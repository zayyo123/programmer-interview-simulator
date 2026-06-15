import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const MAX_RAW_BYTES = 5 * 1024 * 1024;
const MAX_TEXT_CHARS = 20000;
const SUPPORTED_EXTENSIONS = new Set(['pdf', 'md', 'markdown', 'json', 'txt']);

export async function parseProfileDocument(input) {
  const fileName = String(input?.fileName || '').trim() || 'profile.txt';
  const mimeType = String(input?.mimeType || '').trim();
  const contentBase64 = String(input?.contentBase64 || '').trim();
  const extension = getFileExtension(fileName);

  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw createHttpError(400, `不支持的文件类型：.${extension || 'unknown'}`);
  }
  if (!contentBase64) {
    throw createHttpError(400, '缺少文件内容');
  }

  let binary;
  try {
    binary = Buffer.from(contentBase64, 'base64');
  } catch {
    throw createHttpError(400, '文件内容解码失败');
  }
  if (!binary.length) {
    throw createHttpError(400, '文件内容为空');
  }
  if (binary.length > MAX_RAW_BYTES) {
    throw createHttpError(413, `文件过大，限制 ${Math.floor(MAX_RAW_BYTES / (1024 * 1024))}MB`);
  }

  const source = extension === 'markdown' ? 'md' : extension;
  let text = '';
  const warnings = [];
  let parser = null;

  if (source === 'pdf') {
    const parsed = await parsePdf(binary);
    text = parsed.text;
    warnings.push(...parsed.warnings);
    parser = parsed.parser;
  } else if (source === 'json') {
    text = parseJsonProfile(binary.toString('utf8'));
  } else if (source === 'md') {
    text = parseMarkdown(binary.toString('utf8'));
  } else {
    text = binary.toString('utf8');
  }

  const normalizedText = normalizeText(text).slice(0, MAX_TEXT_CHARS);
  if (!normalizedText) {
    throw createHttpError(422, '未识别到可用文本，请尝试粘贴关键项目背景');
  }

  return {
    fileName,
    mimeType,
    source,
    text: normalizedText,
    charCount: normalizedText.length,
    quality: inferQuality(source, normalizedText.length, warnings),
    warnings,
    parser
  };
}

let PDFParseClass = undefined;

function loadPdfParseClass() {
  if (PDFParseClass !== undefined) return PDFParseClass;
  try {
    const module = require('pdf-parse');
    PDFParseClass = module?.PDFParse || null;
    if (typeof PDFParseClass !== 'function') {
      throw new Error('PDFParse class not found in pdf-parse package');
    }
  } catch (error) {
    console.warn('[profileIngest] pdf-parse unavailable:', error.message);
    PDFParseClass = null;
  }
  return PDFParseClass;
}

async function parsePdfWithLibrary(binary) {
  const PDFParse = loadPdfParseClass();
  if (!PDFParse) return '';

  let parser;
  try {
    parser = new PDFParse({ data: binary });
    const result = await parser.getText();
    return normalizeText(result?.text || '');
  } catch (error) {
    console.warn('[profileIngest] pdf-parse failed:', error.message);
    return '';
  } finally {
    if (parser) {
      await parser.destroy().catch(() => {});
    }
  }
}

function isPdfEncrypted(binary) {
  return binary.includes(Buffer.from('/Encrypt')) || binary.includes(Buffer.from('/Encrypt '));
}

function measureTextQuality(text) {
  if (!text || text.length < 20) {
    return { readable: false, score: 0 };
  }

  const allowed = text.match(/[\u4e00-\u9fffA-Za-z0-9\s.,;:!?，。；：、（）【】《》"'""''\-+/@#%&_]/g) || [];
  const score = allowed.length / text.length;
  const hasControl = /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(text);
  const replacementRatio = (text.match(/\uFFFD/g) || []).length / text.length;

  return {
    readable: score >= 0.55 && !hasControl && replacementRatio < 0.05,
    score
  };
}

async function parsePdf(binary) {
  if (isPdfEncrypted(binary)) {
    throw createHttpError(422, 'PDF 已加密，无法自动解析。请导出未加密版本，或粘贴项目背景文本。');
  }

  const warnings = [];
  const normalized = await parsePdfWithLibrary(binary);

  if (!normalized) {
    throw createHttpError(
      422,
      'PDF 未识别到文本。请确认已使用 Node 22（nvm use 22）并重启服务；扫描件请粘贴文本或上传 TXT/Markdown。'
    );
  }

  const quality = measureTextQuality(normalized);
  if (!quality.readable) {
    throw createHttpError(
      422,
      'PDF 解析结果异常（可能是扫描件、特殊字体或排版问题）。请导出 TXT/Markdown，或直接粘贴项目背景。'
    );
  }

  if (normalized.length < 200) {
    warnings.push('PDF 可提取文本较少，可能是扫描件。建议补充粘贴关键项目经历。');
  }

  return { text: normalized, warnings, parser: 'pdf-parse' };
}

function parseMarkdown(raw) {
  const withoutFrontmatter = raw.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '');
  return withoutFrontmatter
    .replace(/`{3}[\s\S]*?`{3}/g, (codeBlock) => codeBlock.replace(/`/g, ''))
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6})\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '- ');
}

function parseJsonProfile(raw) {
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw createHttpError(422, 'JSON 格式不合法，无法解析');
  }

  const lines = [];
  appendIfPresent(lines, '标题', json?.title || json?.name || json?.position);
  appendIfPresent(lines, '简介', json?.summary || json?.about || json?.profile);
  appendIfPresent(lines, '求职方向', json?.targetRole || json?.jobTitle);

  const skills = normalizeArray(json?.skills || json?.techStack || json?.stack);
  if (skills.length) lines.push(`技能：${skills.join('、')}`);

  const projectCandidates = normalizeProjectList(json?.projects || json?.experience || json?.workExperience);
  for (const item of projectCandidates.slice(0, 8)) {
    if (!item || typeof item !== 'object') continue;
    const title = item.name || item.title || item.project || '项目';
    const role = item.role || item.responsibility || '';
    const stack = normalizeArray(item.stack || item.tech || item.skills).join('、');
    const highlights = normalizeArray(item.highlights || item.achievements || item.tasks).join('；');
    lines.push(`项目：${title}`);
    if (role) lines.push(`- 职责：${role}`);
    if (stack) lines.push(`- 技术栈：${stack}`);
    if (highlights) lines.push(`- 亮点：${highlights}`);
  }

  const jd = json?.jd || json?.jobDescription || json?.requirements;
  if (jd) {
    lines.push('JD 要求：');
    if (typeof jd === 'string') {
      lines.push(jd);
    } else if (Array.isArray(jd)) {
      lines.push(...jd.map((item) => `- ${String(item)}`));
    } else if (typeof jd === 'object') {
      const requirementList = normalizeArray(jd.requirements || jd.mustHave || jd.niceToHave);
      lines.push(...requirementList.map((item) => `- ${item}`));
    }
  }

  if (!lines.length) {
    return typeof json === 'string' ? json : JSON.stringify(json, null, 2);
  }
  return lines.join('\n');
}

function inferQuality(source, charCount, warnings) {
  if (source === 'pdf' && charCount < 120) return 'low';
  if (source === 'pdf' && warnings.some((item) => item.includes('扫描件') || item.includes('较少'))) return 'low';
  if (charCount < 120) return 'low';
  if (charCount < 500) return 'medium';
  return 'high';
}

function normalizeText(text) {
  return String(text || '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u0000/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function appendIfPresent(lines, label, value) {
  const text = String(value || '').trim();
  if (text) lines.push(`${label}：${text}`);
}

function normalizeProjectList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === 'object');
}

function normalizeArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item : item?.name || item?.title || ''))
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getFileExtension(fileName) {
  const idx = fileName.lastIndexOf('.');
  if (idx < 0) return '';
  return fileName.slice(idx + 1).toLowerCase();
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
