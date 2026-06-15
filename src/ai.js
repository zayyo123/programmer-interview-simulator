import { chooseProvider } from './config.js';
import { createFallbackInterviewerReply } from './interview.js';
import { levelLabels, roleLabels } from './questions.js';
import {
  extractProfileSignals,
  sanitizeStructuredCategories,
  sanitizeStructuredTerms
} from '../shared/profileAnalysis.js';
import {
  buildLocalProfileAnalysis,
  sanitizeStructuredFocusTopics
} from '../shared/profileAnalyzeLocal.js';
import { isGenericTemplateReferenceAnswer } from '../shared/referenceAnswerResolver.js';

export async function generateInterviewerReply({ config, session, answer, prompt }) {
  const provider = chooseProvider(config);

  try {
    if (provider === 'gemini') {
      return {
        provider,
        text: await callGemini(config, prompt)
      };
    }

    if (provider === 'openrouter') {
      return {
        provider,
        text: await callOpenRouter(config, prompt)
      };
    }

    if (provider === 'ollama') {
      return {
        provider,
        text: await callOllama(config, prompt)
      };
    }
  } catch (error) {
    console.error(`[ai:${provider}]`, error.message);
  }

  return {
    provider: 'mock',
    text: createFallbackInterviewerReply({ session, answer })
  };
}

export async function generateInterviewQuestionPlan({ config, interviewConfig, localPlan }) {
  const provider = chooseProvider(config);
  if (provider === 'mock') {
    return {
      provider,
      questions: null,
      error: 'No AI provider configured'
    };
  }

  const prompt = buildQuestionPlanPrompt(interviewConfig, localPlan);

  try {
    const text = await callProvider(config, provider, prompt, {
      temperature: 0.35,
      maxOutputTokens: 4000
    });
    const questions = normalizeAiQuestionPlan(text, interviewConfig);
    return {
      provider,
      questions,
      rawText: text
    };
  } catch (error) {
    console.error(`[ai-plan:${provider}]`, error.message);
    return {
      provider,
      questions: null,
      error: error.message
    };
  }
}

async function callProvider(config, provider, prompt, options = {}) {
  if (provider === 'gemini') return callGemini(config, prompt, options);
  if (provider === 'openrouter') return callOpenRouter(config, prompt, options);
  if (provider === 'ollama') return callOllama(config, prompt, options);
  throw new Error(`Unsupported AI provider: ${provider}`);
}

export async function generateConcreteReferenceAnswer({ config, question }) {
  const provider = chooseProvider(config);
  if (provider === 'mock') return null;

  const prompt = buildConcreteReferencePrompt(question);

  try {
    const raw = await callProvider(config, provider, prompt, {
      temperature: 0.25,
      maxOutputTokens: 2200
    });
    return normalizeConcreteReferenceAnswer(parseJsonObject(raw));
  } catch (error) {
    console.error(`[ai-reference:${provider}]`, error.message);
    return null;
  }
}

function buildConcreteReferencePrompt(question = {}) {
  const mustHave = (question.scoringRubric?.mustHave || [])
    .filter((item) => !/明确.*目标|指标.*验证|风险控制/.test(String(item)))
    .slice(0, 6);

  return [
    '你是资深技术面试官。请为下面这道面试题写「参考答案」和「优秀回答示例」。',
    '要求：具体、准确、可照抄口述；写清机制、步骤、命令/配置/指标、边界和排查顺序。',
    '禁止套话：不要写“目标约束风险验证”“不能只背术语”“应先定义问题目标和边界”。',
    '只输出 JSON：{ "referenceAnswer": "...", "excellentAnswer": "..." }',
    `岗位方向：${question.category || '技术'}`,
    `技能点：${question.skill || ''}`,
    `题型：${question.type || 'knowledge'}`,
    `题目：${question.question || ''}`,
    mustHave.length ? `尽量覆盖：${mustHave.join('；')}` : ''
  ].filter(Boolean).join('\n');
}

function normalizeConcreteReferenceAnswer(parsed) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

  const referenceAnswer = String(parsed.referenceAnswer || '').trim();
  const excellentAnswer = String(parsed.excellentAnswer || '').trim();
  if (!referenceAnswer || referenceAnswer.length < 80) return null;
  if (isGenericTemplateReferenceAnswer(referenceAnswer)) return null;

  return {
    referenceAnswer,
    excellentAnswer: excellentAnswer && !isGenericTemplateReferenceAnswer(excellentAnswer)
      ? excellentAnswer
      : referenceAnswer.replace(/^（示例）/, '我')
  };
}

export async function extractStructuredProfile({ config, text, role = '' }) {
  const provider = chooseProvider(config);
  if (provider === 'mock') return null;

  const prompt = buildStructuredProfilePrompt(text, role);

  try {
    const raw = await callProvider(config, provider, prompt, {
      temperature: 0.2,
      maxOutputTokens: 1800
    });
    return normalizeStructuredProfile(parseJsonObject(raw), text, role);
  } catch (error) {
    console.error(`[ai-profile:${provider}]`, error.message);
    return null;
  }
}

function buildStructuredProfilePrompt(text, role) {
  const roleLabel = roleLabels[role] || role || '未指定';
  const resume = String(text || '').trim().slice(0, 6000);

  return [
    '你是技术招聘顾问。请从候选人 JD/简历中做保守、可验证的结构化抽取。',
    '只输出 JSON 对象，不要 Markdown，不要解释。',
    '宁可少识别也不要猜测；只写原文中能明确支持的技术词和方向。',
    '',
    `目标岗位：${roleLabel}`,
    '解析时请结合目标岗位，优先保留与该岗位强相关的技术词、考点和风险；与岗位无关的技能不要强行纳入。',
    `候选人资料：\n${resume}`,
    '',
    '输出字段：',
    'terms: string[] — 具体技术名词，如 "Spring Boot"、"Redis"，最多 8 个',
    'categories: string[] — 从技术方向集合里选，最多 4 个。可选值：Java、Go、Python、前端、MySQL、Redis、消息队列、微服务、测试、运维、DevOps、数据、AI、安全、架构、算法、系统设计',
    'focusTopics: string[] — 面试高频考点，最多 6 个，短语即可',
    'capabilities: string[] — 候选人应准备的能力点，最多 5 条',
    'risks: string[] — 简历/表达风险，最多 4 条',
    'confidence: number — 0 到 1，表示你对抽取结果的整体把握',
    '',
    '约束：',
    '- 没有明确证据就不要输出对应 term 或 category',
    '- 不要把岗位默认值当成候选人技能',
    '- confidence 低于 0.5 时 terms 和 categories 应为空数组'
  ].join('\n');
}

function normalizeStructuredProfile(parsed, text, role) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

  const source = String(text || '').trim();
  const { normalized } = extractProfileSignals(source, { role });
  const terms = sanitizeStructuredTerms(parsed.terms, source, normalized);
  const categories = sanitizeStructuredCategories(parsed.categories, source, normalized, role);
  const local = buildLocalProfileAnalysis(source, role);
  const confidence = clampNumber(parsed.confidence, 0, 1, 0);

  return {
    terms,
    categories,
    focusTopics: sanitizeStructuredFocusTopics(parsed.focusTopics, local.focusTopics, role, categories),
    capabilities: normalizeStringArray(parsed.capabilities).slice(0, 5),
    risks: normalizeStringArray(parsed.risks).slice(0, 4),
    confidence
  };
}

function parseJsonObject(text) {
  const raw = String(text || '').trim();
  if (!raw) throw new Error('AI returned empty profile analysis');

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  } catch {
    // fall through
  }

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  if (fenced) {
    const parsed = JSON.parse(fenced);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  }

  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start !== -1 && end > start) {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
  }

  throw new Error('AI returned invalid profile JSON');
}

function clampNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, numeric));
}

function buildQuestionPlanPrompt(interviewConfig, localPlan = []) {
  const role = roleLabels[interviewConfig.role] || interviewConfig.role || '后端开发';
  const level = levelLabels[interviewConfig.level] || interviewConfig.level || '中级';
  const count = Math.max(1, Math.floor(Number(interviewConfig.questionCount || 5)));
  const resume = String(interviewConfig.resume || '').trim();
  const localOutline = localPlan
    .slice(0, count)
    .map((item, index) => `${index + 1}. ${item.type} / ${item.category} / 难度${item.difficulty}`)
    .join('\n');

  return [
    '你是一名资深程序员技术面试官。请为候选人生成一轮技术面试题目计划。',
    '只输出 JSON，不要 Markdown，不要解释。',
    '',
    `岗位：${role}`,
    `级别：${level}`,
    `题目数量：${count}`,
    `候选人资料：${resume || '未提供'}`,
    '',
    '本地题库建议节奏如下，可参考但不要照抄题目：',
    localOutline || '基础题 / 项目题 / 场景题 / 代码题',
    '',
    '输出格式必须是 JSON 数组。数组每一项必须包含这些字段：',
    'id, category, skill, roles, levels, type, difficulty, question, keywords, referenceAnswer, excellentAnswer, followUps, scoringRubric',
    '',
    '字段约束：',
    `roles 必须包含 "${interviewConfig.role || 'backend'}"`,
    `levels 必须包含 "${interviewConfig.level || 'middle'}"`,
    'type 只能是 knowledge、project、system-design、algorithm',
    'difficulty 只能是 1、2、3',
    'keywords 至少 4 个，followUps 至少 2 个',
    'scoringRubric 必须包含 mustHave、goodToHave、redFlags 三个数组',
    '如果 type 是 algorithm，可以额外给 codeKind，取值 algorithm、sql、frontend、backend',
    '',
    '题目要像真实面试问题，避免泛泛的“请介绍一下 XX”。参考答案和优秀回答要能支撑后续评分。'
  ].join('\n');
}

function normalizeAiQuestionPlan(text, interviewConfig) {
  const parsed = parseJsonFromText(text);
  if (!Array.isArray(parsed)) {
    throw new Error('AI question plan is not a JSON array');
  }

  const role = interviewConfig.role || 'backend';
  const level = interviewConfig.level || 'middle';
  const targetCount = Math.max(1, Math.floor(Number(interviewConfig.questionCount || 5)));
  const allowedTypes = new Set(['knowledge', 'project', 'system-design', 'algorithm']);
  const allowedCodeKinds = new Set(['algorithm', 'sql', 'frontend', 'backend']);

  const questions = parsed
    .map((item, index) => {
      const type = allowedTypes.has(item?.type) ? item.type : 'knowledge';
      const difficulty = Number.isInteger(item?.difficulty)
        ? Math.max(1, Math.min(3, item.difficulty))
        : 2;
      const scoringRubric = item?.scoringRubric || {};
      const keywords = normalizeStringArray(item?.keywords).slice(0, 8);
      const mustHave = normalizeStringArray(scoringRubric.mustHave).length
        ? normalizeStringArray(scoringRubric.mustHave)
        : keywords.slice(0, 4);

      return {
        id: normalizeQuestionId(item?.id, index),
        category: normalizeString(item?.category, 'AI 定制题'),
        skill: normalizeString(item?.skill, item?.category || 'AI 定制题'),
        roles: [...new Set([role, ...normalizeStringArray(item?.roles)])],
        levels: [...new Set([level, ...normalizeStringArray(item?.levels)])],
        type,
        ...(type === 'algorithm' && allowedCodeKinds.has(item?.codeKind) ? { codeKind: item.codeKind } : {}),
        difficulty,
        question: normalizeString(item?.question, ''),
        keywords,
        referenceAnswer: normalizeString(item?.referenceAnswer, ''),
        excellentAnswer: normalizeString(item?.excellentAnswer, ''),
        followUps: normalizeStringArray(item?.followUps).slice(0, 5),
        scoringRubric: {
          mustHave,
          goodToHave: normalizeStringArray(scoringRubric.goodToHave).slice(0, 6),
          redFlags: normalizeStringArray(scoringRubric.redFlags).slice(0, 5)
        }
      };
    })
    .filter((item) => {
      return item.question
        && item.referenceAnswer
        && item.excellentAnswer
        && item.keywords.length >= 3
        && item.followUps.length >= 1;
    })
    .slice(0, targetCount);

  if (questions.length < Math.min(3, targetCount)) {
    throw new Error(`AI returned too few usable questions: ${questions.length}`);
  }

  return questions.map((item, index) => ({
    ...item,
    planReason: `由 AI 根据岗位、级别和候选人资料生成的第 ${index + 1} 题。`
  }));
}

function parseJsonFromText(text) {
  const raw = String(text || '').trim();
  if (!raw) throw new Error('AI returned empty question plan');

  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    if (fenced) return JSON.parse(fenced);

    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1));
    }

    throw new Error('AI returned invalid JSON');
  }
}

function normalizeQuestionId(value, index) {
  const raw = normalizeString(value, `ai_question_${index + 1}`);
  const safe = raw.toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  return safe || `ai_question_${index + 1}`;
}

function normalizeString(value, fallback) {
  const normalized = String(value || '').trim();
  return normalized || fallback;
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || '').trim()).filter(Boolean);
}

async function callGemini(config, prompt, options = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

async function callOpenRouter(config, prompt, options = {}) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openRouterApiKey}`,
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Programmer Interview Simulator'
    },
    body: JSON.stringify({
      model: config.openRouterModel,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

async function callOllama(config, prompt, options = {}) {
  const response = await fetch(`${config.ollamaBaseUrl.replace(/\/$/, '')}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.ollamaModel,
      stream: false,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      options: {
        temperature: options.temperature ?? 0.7,
        num_predict: options.maxOutputTokens ?? 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content?.trim() || '';
}
