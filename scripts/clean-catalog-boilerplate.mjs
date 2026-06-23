import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogDir = path.join(__dirname, '../data/concrete-refs');

const BOILERPLATE =
  /验证：用指标、日志或实验数据证明方案有效，并说明失败场景下的回滚\/降级策略。/g;

const PRACTICE_TAIL =
  /(?:\s*实践中要用指标、日志或对照实验验证方案有效性，并提前设计异常时的回滚与降级策略，避免把离线结论直接等同于线上效果。)+/g;

function dedupeSentences(text) {
  const parts = String(text || '')
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const part of parts) {
    const key = part.replace(/\s+/g, '');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(part.endsWith('。') || part.endsWith('！') || part.endsWith('？') ? part : `${part}。`);
  }
  return out.join('').replace(/。+/g, '。');
}

function cleanReference(text) {
  let value = String(text || '').trim();
  value = value.replace(BOILERPLATE, '');
  value = value.replace(PRACTICE_TAIL, '');
  value = value.replace(/(?:\s*补充：[^。！？]+[。！？])+/g, (block) => {
    const sentences = block.match(/补充：[^。！？]+[。！？]/g) || [];
    const seen = new Set();
    const kept = [];
    for (const sentence of sentences) {
      const key = sentence.replace(/\s+/g, '');
      if (seen.has(key)) continue;
      seen.add(key);
      kept.push(sentence);
    }
    return kept.length ? ` ${kept.join('')}` : '';
  });
  value = dedupeSentences(value);
  return value.replace(/\s+/g, ' ').trim();
}

function cleanFile(fileName) {
  const filePath = path.join(catalogDir, fileName);
  if (!fs.existsSync(filePath)) return { file: fileName, changed: 0, skipped: true };
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const entry of Object.values(data)) {
    if (!entry?.referenceAnswer) continue;
    const before = entry.referenceAnswer;
    const after = cleanReference(before);
    if (after !== before) {
      entry.referenceAnswer = after;
      changed += 1;
    }
  }

  if (changed > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
  return { file: fileName, changed };
}

const files = fs
  .readdirSync(catalogDir)
  .filter((name) => name.endsWith('.json'));

const results = files.map(cleanFile);
const total = results.reduce((sum, item) => sum + item.changed, 0);
console.log(JSON.stringify({ files: results.length, entriesChanged: total, results }, null, 2));
