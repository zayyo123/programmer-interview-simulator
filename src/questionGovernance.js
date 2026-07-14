import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadExternalQuestionDrafts, syncExternalQuestionDrafts } from './externalSources.js';
import { getAvailableQuestionCount } from './interview.js';
import { questionBank, roleLabels } from './questions.js';
import { withResolvedReferenceAnswers } from '../shared/referenceAnswerResolver.js';

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..');
export const questionDraftPath = join(rootDir, 'data', 'question-drafts.json');
export const approvedQuestionPath = join(rootDir, 'data', 'approved-questions.json');
export const promotedQuestionCandidatePath = join(rootDir, 'data', 'promoted-question-candidates.json');

const allowedTypes = new Set(['knowledge', 'project', 'system-design', 'algorithm']);
const allowedCodeKinds = new Set(['algorithm', 'sql', 'frontend', 'backend']);
const allowedLevels = new Set(['junior', 'middle', 'senior']);
const allowedRoles = new Set(Object.keys(roleLabels));

const defaultTemplates = [
  {
    id: 'backend-middle-balanced',
    name: '后端中级均衡面',
    roles: ['backend', 'java', 'go', 'python'],
    levels: ['middle'],
    stages: ['knowledge', 'project', 'knowledge', 'system-design', 'algorithm'],
    difficultyMix: [2, 2, 3, 2, 3],
    rules: ['先基础校准', '再项目真实性', '最后用场景/代码题拉开区分度']
  },
  {
    id: 'frontend-middle-coding',
    name: '前端代码与工程化',
    roles: ['frontend', 'fullstack'],
    levels: ['middle'],
    stages: ['knowledge', 'project', 'knowledge', 'algorithm', 'knowledge'],
    difficultyMix: [2, 2, 3, 2, 2],
    rules: ['覆盖浏览器/框架基础', '保留 JS 手写题', '追问性能和工程化落地']
  },
  {
    id: 'senior-pressure-diagnostic',
    name: '高级压力排障面',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['senior'],
    stages: ['knowledge', 'project', 'knowledge', 'system-design', 'algorithm'],
    difficultyMix: [2, 3, 3, 3, 3],
    rules: ['优先线上排障', '要求讲判断顺序', '每题检查指标、取舍和失败恢复']
  }
];

export async function loadRuntimeQuestionBank() {
  const approved = await loadApprovedQuestions();
  return [
    ...questionBank.map((item) => withResolvedReferenceAnswers(attachGovernance(item, {
      status: 'approved',
      source: 'built-in',
      reviewStatus: '已审核'
    }))),
    ...approved.map((item) => withResolvedReferenceAnswers(attachGovernance(item, {
      status: 'approved',
      source: item.governance?.source || 'manual-approved',
      reviewStatus: '人工审核通过'
    })))
  ];
}

export async function getQuestionBankCatalog(filters = {}) {
  const [runtimeBank, drafts] = await Promise.all([
    loadRuntimeQuestionBank(),
    loadQuestionDrafts()
  ]);
  const pendingDrafts = drafts.filter((item) => item.status === 'pending');
  const rejectedDrafts = drafts.filter((item) => item.status === 'rejected');
  const filteredItems = filterQuestions(runtimeBank, filters).slice(0, 60);
  const role = clean(filters.role);
  const level = clean(filters.level);

  return {
    summary: createQuestionBankSummary(runtimeBank, pendingDrafts, rejectedDrafts),
    availability: {
      role: role || null,
      level: level || null,
      count: getAvailableQuestionCount({ role, level }, runtimeBank)
    },
    templates: defaultTemplates,
    facets: createQuestionFacets(runtimeBank),
    items: filteredItems.map(toCatalogItem),
    pendingDrafts: pendingDrafts.slice(0, 12).map(toDraftCatalogItem)
  };
}

export async function submitQuestionDraft(input = {}, options = {}) {
  const draftPath = options.outputPath || questionDraftPath;
  const drafts = await loadQuestionDraftsFromPath(draftPath);
  const now = new Date().toISOString();
  const draft = normalizeDraft(input, {
    id: `draft_${randomUUID()}`,
    status: 'pending',
    createdAt: now,
    updatedAt: now
  });

  drafts.unshift(draft);
  await saveQuestionDraftsToPath(drafts, draftPath);
  return toDraftCatalogItem(draft);
}

export async function reviewQuestionDraft(id, input = {}) {
  const drafts = await loadQuestionDrafts();
  const draftIndex = drafts.findIndex((item) => item.id === id);
  if (draftIndex === -1) {
    const error = new Error('未找到待审核题目');
    error.statusCode = 404;
    throw error;
  }

  const action = input.action === 'reject' ? 'reject' : 'approve';
  const now = new Date().toISOString();
  const draft = drafts[draftIndex];

  if (action === 'reject') {
    drafts[draftIndex] = {
      ...draft,
      status: 'rejected',
      reviewNotes: String(input.notes || '人工审核未通过').trim(),
      reviewedAt: now,
      updatedAt: now
    };
    await saveQuestionDrafts(drafts);
    return { draft: toDraftCatalogItem(drafts[draftIndex]), approvedQuestion: null };
  }

  const approvedQuestion = normalizeApprovedQuestion(draft, {
    approvedAt: now,
    approvedBy: String(input.approvedBy || 'local-reviewer').trim(),
    reviewNotes: String(input.notes || '人工审核通过').trim()
  });
  const quality = assessQuestionQuality(approvedQuestion, {
    phase: 'approval',
    requireHumanReview: true
  });
  if (!quality.approvable) {
    const error = new Error(`题目质量门禁未通过：${quality.issues.map((item) => item.message).join('；')}`);
    error.statusCode = 400;
    throw error;
  }

  const approvedQuestions = await loadApprovedQuestions();
  approvedQuestions.unshift({
    ...approvedQuestion,
    governance: {
      ...approvedQuestion.governance,
      quality
    }
  });
  drafts[draftIndex] = {
    ...draft,
    status: 'approved',
    approvedQuestionId: approvedQuestion.id,
    reviewNotes: approvedQuestion.governance.reviewNotes,
    reviewedAt: now,
    updatedAt: now
  };

  await Promise.all([
    saveApprovedQuestions(approvedQuestions),
    saveQuestionDrafts(drafts)
  ]);

  return {
    draft: toDraftCatalogItem(drafts[draftIndex]),
    approvedQuestion: toCatalogItem({
      ...approvedQuestion,
      governance: {
        ...approvedQuestion.governance,
        quality
      }
    })
  };
}

export function createPaperBlueprint(plan = []) {
  const items = Array.isArray(plan) ? plan : [];
  return {
    total: items.length,
    difficultyMix: countBy(items, (item) => String(item.difficulty || 2)),
    typeMix: countBy(items, (item) => item.type || 'knowledge'),
    categories: [...new Set(items.map((item) => item.category).filter(Boolean))],
    items: items.map((item, index) => ({
      order: index + 1,
      id: item.id,
      category: item.category,
      skill: item.skill || item.category,
      type: item.type,
      codeKind: item.codeKind || null,
      difficulty: item.difficulty,
      tags: createQuestionTags(item).slice(0, 6),
      planReason: item.planReason || '按规则组卷。'
    }))
  };
}

export function assessQuestionQuality(question, options = {}) {
  const issues = [];
  const addIssue = (severity, code, message, penalty) => {
    issues.push({ severity, code, message, penalty });
  };

  const text = clean(question.question);
  const referenceAnswer = clean(question.referenceAnswer);
  const excellentAnswer = clean(question.excellentAnswer);
  const keywords = normalizeArray(question.keywords);
  const expectedPoints = Array.isArray(question.expectedPoints) && question.expectedPoints.length
    ? normalizeArray(question.expectedPoints)
    : normalizeArray(question.scoringRubric?.mustHave).concat(normalizeArray(question.scoringRubric?.goodToHave));
  const followUps = normalizeArray(question.followUps);
  const rubric = question.scoringRubric || {};
  const type = question.type || 'knowledge';
  const source = question.governance?.source || question.source || 'built-in';
  let score = 100;

  const penalize = (severity, code, message, penalty) => {
    score -= penalty;
    addIssue(severity, code, message, penalty);
  };

  if (!clean(question.id)) penalize('blocker', 'missing-id', '缺少稳定题目 id', 12);
  if (!clean(question.category)) penalize('blocker', 'missing-category', '缺少技术分类', 10);
  if (!allowedTypes.has(type)) penalize('blocker', 'invalid-type', '题型不在允许范围内', 12);
  if (!Array.isArray(question.roles) || !question.roles.length) penalize('blocker', 'missing-roles', '缺少适用岗位', 10);
  if (!Array.isArray(question.levels) || !question.levels.length) penalize('blocker', 'missing-levels', '缺少适用级别', 10);
  if (!Number.isInteger(question.difficulty) || question.difficulty < 1 || question.difficulty > 3) {
    penalize('blocker', 'invalid-difficulty', '难度必须是 1-3 的整数', 10);
  }

  if (text.length < 6) penalize('blocker', 'question-too-short', '题干太短，无法形成真实面试问题', 16);
  else if (text.length < 12) penalize('warn', 'question-brief', '题干较短，建议补充追问或场景约束', 4);
  if (text.length > 260) penalize('warn', 'question-too-long', '题干过长，建议拆成主问题和追问', 4);
  if (hasPlaceholderText(text)) penalize('blocker', 'placeholder-question', '题干包含占位或 AI 痕迹', 18);
  if (looksGarbled(text) || looksGarbled(referenceAnswer)) penalize('blocker', 'garbled-text', '题干或答案疑似乱码', 18);
  if (hasCandidateTemplateText(`${text} ${referenceAnswer} ${excellentAnswer}`)) {
    penalize('blocker', 'candidate-template-text', '题目仍包含候选题模板/待重写说明，不能直接入库', 24);
  }

  if (referenceAnswer.length < 220) {
    penalize('blocker', 'thin-reference-answer', '参考答案少于 220 字，无法充分覆盖原理、边界和验证', 18);
  } else if (referenceAnswer.length < 300) {
    penalize('blocker', 'brief-reference-answer', '参考答案少于 300 字，必须补充机制、异常边界、验证指标或方案取舍', 12);
  }
  if (excellentAnswer.length < 300) {
    penalize('blocker', 'thin-excellent-answer', '优秀回答少于 300 字，无法提供完整可复述的面试示范', 12);
  }
  if (/面试答题可结合这些要点展开|明确 .+ 的目标、适用场景和边界/.test(referenceAnswer)) {
    penalize('warn', 'generic-answer-padding', '参考答案包含通用扩写套话，应替换为与题目直接相关的技术细节', 6);
  }
  if (isNearlySameText(text, referenceAnswer)) penalize('blocker', 'answer-repeats-question', '参考答案几乎复述题干', 18);
  if (hasPlaceholderText(referenceAnswer) || hasPlaceholderText(excellentAnswer)) {
    penalize('blocker', 'placeholder-answer', '答案包含占位或 AI 痕迹', 18);
  }

  if (keywords.length < 3) penalize('warn', 'few-keywords', '关键词少于 3 个，抽题和评分信号偏弱', 6);
  if (expectedPoints.length < 3) penalize('warn', 'few-expected-points', '参考要点少于 3 个，难以判断覆盖度', 8);
  if (followUps.length < 2) penalize('warn', 'few-follow-ups', '追问少于 2 个，真实面试深挖不足', 6);
  if (normalizeArray(rubric.mustHave).length < 2) penalize('warn', 'weak-must-have', '必答评分点少于 2 个', 7);
  if (normalizeArray(rubric.goodToHave).length < 1) penalize('warn', 'weak-good-to-have', '加分点评分点不足', 4);
  if (normalizeArray(rubric.redFlags).length < 1) penalize('warn', 'weak-red-flags', '缺少扣分/危险信号', 4);

  if (type === 'algorithm') {
    if (!allowedCodeKinds.has(question.codeKind || 'algorithm')) {
      penalize('blocker', 'invalid-code-kind', '代码题缺少有效 codeKind', 12);
    }
    if (!/复杂度|边界|空|重复|性能|索引|并发|失败|异常|取舍|时间|空间/i.test(`${referenceAnswer} ${excellentAnswer}`)) {
      penalize('warn', 'weak-code-boundary', '代码题答案缺少边界、复杂度或工程取舍', 10);
    }
  }

  if (['project', 'system-design'].includes(type) && !hasRealScenarioSignal(`${text} ${referenceAnswer}`)) {
    penalize('warn', 'weak-scenario', '项目/场景题缺少业务、线上、故障或指标语境', 10);
  }

  if (question.difficulty >= 3 && !hasSeniorSignal(`${text} ${referenceAnswer}`)) {
    penalize('warn', 'weak-senior-signal', '进阶题缺少排查顺序、取舍、风险或指标信号', 8);
  }

  if (/ai|llm|generated|外部|github|stack|stackoverflow/i.test(source)) {
    const license = question.governance?.license || question.license || '';
    if (!license) penalize('blocker', 'missing-license', '外部/AI 题缺少来源许可信息', 14);
    if (options.requireHumanReview && !clean(question.governance?.reviewNotes)) {
      penalize('blocker', 'missing-human-review', '外部/AI 题入库前必须有人工复核说明', 14);
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const blockerCount = issues.filter((item) => item.severity === 'blocker').length;
  const warnCount = issues.filter((item) => item.severity === 'warn').length;
  const approvable = blockerCount === 0 && score >= 78;

  return {
    score,
    grade: score >= 92 ? 'A' : score >= 84 ? 'B' : score >= 78 ? 'C' : 'D',
    approvable,
    blockerCount,
    warnCount,
    issues,
    gates: {
      structure: issues.every((item) => !['missing-id', 'missing-category', 'invalid-type', 'missing-roles', 'missing-levels', 'invalid-difficulty'].includes(item.code)),
      answer: issues.every((item) => !['thin-reference-answer', 'answer-repeats-question', 'placeholder-answer'].includes(item.code)),
      realism: issues.every((item) => !['weak-scenario', 'weak-senior-signal'].includes(item.code)),
      evaluation: issues.every((item) => !['few-expected-points', 'few-follow-ups', 'weak-must-have'].includes(item.code)),
      provenance: issues.every((item) => !['missing-license', 'missing-human-review'].includes(item.code))
    }
  };
}

export async function createQuestionQualityReport(filters = {}) {
  const runtimeBank = await loadRuntimeQuestionBank();
  const items = filterQuestions(runtimeBank, filters).map((question) => ({
    id: question.id,
    category: question.category,
    type: question.type,
    difficulty: question.difficulty,
    quality: assessQuestionQuality(question)
  }));
  const failing = items.filter((item) => !item.quality.approvable);
  const scores = items.map((item) => item.quality.score);
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;

  return {
    summary: {
      total: items.length,
      averageScore,
      failingCount: failing.length,
      blockerCount: items.reduce((sum, item) => sum + item.quality.blockerCount, 0),
      warnCount: items.reduce((sum, item) => sum + item.quality.warnCount, 0)
    },
    failing,
    items
  };
}

export async function createExternalQuestionCandidateReport(options = {}) {
  const externalPayload = await loadExternalQuestionDrafts();
  const limit = clampNumber(options.limit, 30, 1, 120);
  const minScore = clampNumber(options.minScore, 70, 0, 100);
  const includeSignalOnly = String(options.includeSignalOnly || '').toLowerCase() === 'true';
  const categoryFilter = clean(options.category);
  const sourceFilter = clean(options.sourceId || options.source);
  const scoredDrafts = (externalPayload.drafts || [])
    .map((draft) => scoreExternalDraftForPromotion(draft))
    .filter((item) => item.promotionScore >= minScore)
    .filter((item) => includeSignalOnly || item.importPolicy === 'can-transform')
    .filter((item) => !categoryFilter || item.category === categoryFilter)
    .filter((item) => !sourceFilter || item.sourceId === sourceFilter || item.sourceName === sourceFilter)
    .sort((left, right) => right.promotionScore - left.promotionScore || right.qualityScore - left.qualityScore || String(left.title).localeCompare(String(right.title), 'zh-Hans-CN'));
  const candidates = selectBalancedExternalCandidates(scoredDrafts, limit)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
      proposedQuestion: createPromotedQuestionCandidate(item)
    }));

  return {
    generatedAt: new Date().toISOString(),
    sourceSyncedAt: externalPayload.syncedAt || null,
    summary: {
      externalDraftCount: externalPayload.summary?.draftCount || externalPayload.drafts?.length || 0,
      scoredCount: scoredDrafts.length,
      candidateCount: candidates.length,
      minScore,
      includeSignalOnly,
      byCategory: countBy(candidates, (item) => item.category || '未分类'),
      bySource: countBy(candidates, (item) => item.sourceName || item.provider || '未知来源')
    },
    scoringRubric: {
      license: '可转写授权优先；仅信号源默认不入正式题库。',
      interviewValue: '题目必须像真实程序员面试题，覆盖原理、场景、边界或排查。',
      coverage: '优先补足 Java、MySQL、Redis、网络、操作系统、算法、前端、系统设计等模块。',
      transformReadiness: '候选题会生成 expectedPoints、followUps、commonMistakes 和 scoringRubric 草案。'
    },
    candidates
  };
}

export async function writeExternalQuestionCandidates(options = {}) {
  const report = await createExternalQuestionCandidateReport(options);
  await writeJson(options.outputPath || promotedQuestionCandidatePath, report);
  return report;
}

export async function importPromotedCandidatesToDrafts(options = {}) {
  const candidatePayload = await loadPromotedQuestionCandidates(options.inputPath || promotedQuestionCandidatePath);
  const candidates = selectPromotedCandidates(candidatePayload.candidates || [], options);
  const draftPath = options.outputPath || questionDraftPath;
  const drafts = await loadQuestionDraftsFromPath(draftPath);
  const existingKeys = new Set(drafts.map((item) => createDraftDedupeKey(item)));
  const now = new Date().toISOString();
  const imported = [];
  const skipped = [];

  for (const candidate of candidates) {
    const draft = createDraftFromPromotedCandidate(candidate, now);
    const key = createDraftDedupeKey(draft);
    if (existingKeys.has(key)) {
      skipped.push({
        rank: candidate.rank,
        title: candidate.title,
        reason: '待审核草稿中已存在相同题干或候选来源。'
      });
      continue;
    }

    drafts.unshift(draft);
    existingKeys.add(key);
    imported.push(toDraftCatalogItem(draft));
  }

  if (imported.length) {
    await saveQuestionDraftsToPath(drafts, draftPath);
  }

  return {
    importedAt: now,
    inputPath: options.inputPath || promotedQuestionCandidatePath,
    outputPath: draftPath,
    summary: {
      candidateCount: candidatePayload.candidates?.length || 0,
      selectedCount: candidates.length,
      importedCount: imported.length,
      skippedCount: skipped.length,
      pendingDraftCount: drafts.filter((item) => item.status === 'pending').length
    },
    imported,
    skipped
  };
}

export async function runAutomaticQuestionScreening(options = {}) {
  const shouldSync = options.sync !== false && String(options.sync || 'true').toLowerCase() !== 'false';
  const startedAt = new Date().toISOString();
  let syncPayload = null;
  let syncError = null;

  if (shouldSync) {
    try {
      syncPayload = await syncExternalQuestionDrafts();
    } catch (error) {
      syncError = error.message;
    }
  }

  const candidateReport = await writeExternalQuestionCandidates({
    limit: options.limit ?? 40,
    minScore: options.minScore ?? 72,
    includeSignalOnly: options.includeSignalOnly ?? false,
    category: options.category,
    source: options.source,
    outputPath: options.outputPath
  });

  const screeningReport = {
    startedAt,
    completedAt: new Date().toISOString(),
    mode: shouldSync ? 'sync-and-screen' : 'screen-cached',
    sync: syncPayload
      ? {
        ok: true,
        draftCount: syncPayload.summary?.draftCount || 0,
        readyForImportCount: syncPayload.summary?.readyForImportCount || 0,
        sourceCount: syncPayload.summary?.sourceCount || 0
      }
      : {
        ok: !syncError,
        skipped: !shouldSync,
        error: syncError
      },
    screening: {
      outputPath: options.outputPath || promotedQuestionCandidatePath,
      ...candidateReport.summary
    },
    candidates: candidateReport.candidates.slice(0, 12).map((item) => ({
      rank: item.rank,
      title: item.title,
      category: item.category,
      promotionScore: item.promotionScore,
      qualityScore: item.qualityScore,
      sourceName: item.sourceName,
      importPolicy: item.importPolicy,
      risks: item.promotionRisks
    }))
  };

  return {
    ...candidateReport,
    automation: screeningReport
  };
}

async function loadQuestionDrafts() {
  return loadQuestionDraftsFromPath(questionDraftPath);
}

async function loadQuestionDraftsFromPath(path = questionDraftPath) {
  try {
    const payload = JSON.parse(await readFile(path, 'utf8'));
    return Array.isArray(payload?.drafts) ? payload.drafts : [];
  } catch {
    return [];
  }
}

async function saveQuestionDrafts(drafts) {
  await saveQuestionDraftsToPath(drafts, questionDraftPath);
}

async function saveQuestionDraftsToPath(drafts, path = questionDraftPath) {
  await writeJson(path, {
    updatedAt: new Date().toISOString(),
    drafts
  });
}

async function loadPromotedQuestionCandidates(path = promotedQuestionCandidatePath) {
  try {
    const payload = JSON.parse(await readFile(path, 'utf8'));
    return {
      ...payload,
      candidates: Array.isArray(payload?.candidates) ? payload.candidates : []
    };
  } catch (error) {
    const notFound = new Error(`未找到候选题文件：${path}。请先运行 npm run promote:drafts。`);
    notFound.cause = error;
    throw notFound;
  }
}

function selectPromotedCandidates(candidates, options = {}) {
  const rankSet = parseRankSet(options.ranks || options.rank);
  const category = clean(options.category);
  const minScore = clampNumber(options.minScore, 0, 0, 100);
  const top = clampNumber(options.top || options.limit, rankSet.size ? 999 : 10, 1, 200);
  const includeSignalOnly = String(options.includeSignalOnly || '').toLowerCase() === 'true';
  const includeLowQuality = String(options.includeLowQuality || '').toLowerCase() === 'true';

  return candidates
    .filter((candidate) => !rankSet.size || rankSet.has(Number(candidate.rank)))
    .filter((candidate) => !category || candidate.category === category)
    .filter((candidate) => Number(candidate.promotionScore || 0) >= minScore)
    .filter((candidate) => includeSignalOnly || candidate.importPolicy === 'can-transform')
    .filter((candidate) => includeLowQuality || isCandidateQualityImportable(candidate))
    .slice(0, top);
}

function isCandidateQualityImportable(candidate) {
  if (Number(candidate.qualityScore || 0) < 78) return false;
  return !normalizeArray(candidate.qualityIssues).some((issue) => issue?.severity === 'blocker');
}

function parseRankSet(value) {
  return new Set(String(value || '')
    .split(/[,，\s]+/)
    .filter(Boolean)
    .map((item) => Number(item))
    .filter(Number.isFinite));
}

function createDraftFromPromotedCandidate(candidate, now) {
  const proposed = candidate.proposedQuestion || {};
  const sourceName = candidate.sourceName || candidate.provider || 'external-candidate';
  const sourceUrl = candidate.sourceUrl || proposed.governance?.sourceUrl || '';
  const title = clean(candidate.title || proposed.question).replace(/^⭐️\s*/, '');
  const draftId = `draft_candidate_${String(candidate.rank || randomUUID()).replace(/[^a-zA-Z0-9_-]/g, '_')}_${randomUUID().slice(0, 8)}`;

  return normalizeDraft({
    ...proposed,
    id: draftId,
    title,
    question: clean(proposed.question || candidate.title).replace(/^⭐️\s*/, ''),
    source: `external-candidate:${sourceName}`,
    license: candidate.license || proposed.governance?.license || '',
    attribution: [
      sourceName,
      candidate.license ? `许可证：${candidate.license}` : '',
      sourceUrl ? `来源：${sourceUrl}` : ''
    ].filter(Boolean).join('；'),
    reviewNotes: [
      `由候选题 #${candidate.rank || '-'} 自动转入待审核草稿。`,
      `推荐分：${candidate.promotionScore ?? '-'}，结构质量：${candidate.qualityScore ?? '-'}`,
      ...(candidate.promotionReasons || []).slice(0, 3),
      ...(candidate.promotionRisks || []).slice(0, 2).map((risk) => `风险：${risk}`)
    ].join('；')
  }, {
    id: draftId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    importedFromCandidate: {
      rank: candidate.rank,
      candidateId: candidate.id,
      sourceId: candidate.sourceId,
      sourceName,
      sourceUrl,
      sourcePath: candidate.sourcePath || '',
      promotionScore: candidate.promotionScore,
      qualityScore: candidate.qualityScore
    }
  });
}

function createDraftDedupeKey(item) {
  const imported = item.importedFromCandidate || {};
  return normalizeComparableText([
    item.question,
    imported.sourceId,
    imported.candidateId,
    imported.rank
  ].filter(Boolean).join('|'));
}

async function loadApprovedQuestions() {
  try {
    const payload = JSON.parse(await readFile(approvedQuestionPath, 'utf8'));
    return Array.isArray(payload?.questions) ? payload.questions : [];
  } catch {
    return [];
  }
}

async function saveApprovedQuestions(questions) {
  await writeJson(approvedQuestionPath, {
    updatedAt: new Date().toISOString(),
    questions
  });
}

async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function normalizeDraft(input, defaults) {
  const roles = normalizeArray(input.roles).filter((item) => allowedRoles.has(item));
  const levels = normalizeArray(input.levels).filter((item) => allowedLevels.has(item));
  const type = allowedTypes.has(input.type) ? input.type : 'knowledge';
  const codeKind = allowedCodeKinds.has(input.codeKind) ? input.codeKind : undefined;
  const category = clean(input.category) || inferCategory(input.question || input.title || input.referenceAnswer);
  const keywords = normalizeArray(input.keywords || input.tags)
    .concat(splitTags(input.tagsText))
    .filter(Boolean);
  const expectedPoints = normalizeArray(input.expectedPoints).length
    ? normalizeArray(input.expectedPoints)
    : keywords.slice(0, 5);
  const referenceAnswer = clean(input.referenceAnswer || input.answer);
  const excellentAnswer = clean(input.excellentAnswer) || referenceAnswer;

  return {
    ...defaults,
    title: clean(input.title) || clean(input.question).slice(0, 32) || '待审核面试题',
    category,
    skill: clean(input.skill) || category,
    roles: roles.length ? roles : ['backend', 'java'],
    levels: levels.length ? levels : ['middle'],
    type,
    codeKind: type === 'algorithm' ? (codeKind || 'algorithm') : undefined,
    difficulty: clampDifficulty(input.difficulty),
    question: clean(input.question || input.title),
    keywords: [...new Set(keywords.length ? keywords : [category])],
    expectedPoints: [...new Set(expectedPoints.length ? expectedPoints : [category])],
    referenceAnswer,
    excellentAnswer,
    followUps: normalizeArray(input.followUps).length
      ? normalizeArray(input.followUps)
      : createDefaultFollowUps(category),
    commonMistakes: normalizeArray(input.commonMistakes),
    source: clean(input.source) || 'manual',
    license: clean(input.license) || '原创/内部题库',
    attribution: clean(input.attribution),
    reviewNotes: clean(input.reviewNotes)
  };
}

function normalizeApprovedQuestion(draft, review) {
  const missingFields = [];
  if (!clean(draft.question)) missingFields.push('题干');
  if (!clean(draft.referenceAnswer)) missingFields.push('参考答案');
  if (!clean(draft.excellentAnswer)) missingFields.push('优秀回答');
  if (missingFields.length) {
    const error = new Error(`题目还不能入库，缺少：${missingFields.join('、')}`);
    error.statusCode = 400;
    throw error;
  }

  const baseId = clean(draft.id).replace(/^draft_/, 'manual_').replace(/[^a-zA-Z0-9_-]/g, '_');
  const rubric = {
    mustHave: normalizeArray(draft.scoringRubric?.mustHave).length
      ? normalizeArray(draft.scoringRubric.mustHave)
      : draft.expectedPoints.slice(0, 3),
    goodToHave: normalizeArray(draft.scoringRubric?.goodToHave).length
      ? normalizeArray(draft.scoringRubric.goodToHave)
      : draft.keywords.filter((item) => !draft.expectedPoints.includes(item)).slice(0, 4),
    redFlags: normalizeArray(draft.scoringRubric?.redFlags).length
      ? normalizeArray(draft.scoringRubric.redFlags)
      : (draft.commonMistakes.length ? draft.commonMistakes : ['只背结论，没有解释原因、边界或落地场景'])
  };

  return {
    id: baseId,
    category: draft.category,
    skill: draft.skill || draft.category,
    roles: draft.roles,
    levels: draft.levels,
    type: draft.type,
    ...(draft.type === 'algorithm' ? { codeKind: draft.codeKind || 'algorithm' } : {}),
    difficulty: draft.difficulty,
    question: draft.question,
    keywords: draft.keywords,
    expectedPoints: draft.expectedPoints,
    referenceAnswer: draft.referenceAnswer,
    excellentAnswer: draft.excellentAnswer,
    followUps: draft.followUps.length ? draft.followUps : createDefaultFollowUps(draft.category),
    commonMistakes: draft.commonMistakes,
    scoringRubric: rubric,
    governance: {
      status: 'approved',
      source: draft.source || 'manual',
      license: draft.license || '原创/内部题库',
      attribution: draft.attribution || '',
      draftId: draft.id,
      approvedAt: review.approvedAt,
      approvedBy: review.approvedBy,
      reviewNotes: review.reviewNotes
    }
  };
}

function attachGovernance(question, governance) {
  return {
    ...question,
    governance: {
      ...(question.governance || {}),
      ...governance
    }
  };
}

function filterQuestions(items, filters) {
  const role = clean(filters.role);
  const level = clean(filters.level);
  const type = clean(filters.type);
  const category = clean(filters.category);
  const search = clean(filters.search).toLowerCase();

  return items.filter((item) => {
    if (role && !item.roles?.includes(role)) return false;
    if (level && !item.levels?.includes(level)) return false;
    if (type && item.type !== type) return false;
    if (category && item.category !== category) return false;
    if (search) {
      const haystack = [
        item.id,
        item.category,
        item.skill,
        item.question,
        ...(item.keywords || []),
        ...(item.expectedPoints || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

function createQuestionBankSummary(runtimeBank, pendingDrafts, rejectedDrafts) {
  const customApproved = runtimeBank.filter((item) => item.governance?.source !== 'built-in').length;
  const qualityScores = runtimeBank.map((item) => assessQuestionQuality(item).score);
  const failingCount = runtimeBank.filter((item) => !assessQuestionQuality(item).approvable).length;
  return {
    approvedCount: runtimeBank.length,
    builtInCount: runtimeBank.length - customApproved,
    customApprovedCount: customApproved,
    pendingReviewCount: pendingDrafts.length,
    rejectedCount: rejectedDrafts.length,
    categoryCount: new Set(runtimeBank.map((item) => item.category)).size,
    tagCount: new Set(runtimeBank.flatMap(createQuestionTags)).size,
    qualityScore: qualityScores.length
      ? Math.round(qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length)
      : 0,
    qualityFailingCount: failingCount
  };
}

function createQuestionFacets(items) {
  return {
    categories: [...new Set(items.map((item) => item.category).filter(Boolean))].sort(),
    types: [...new Set(items.map((item) => item.type).filter(Boolean))].sort(),
    roles: Object.entries(roleLabels).map(([value, label]) => ({ value, label }))
  };
}

function toCatalogItem(item) {
  const quality = item.governance?.quality || assessQuestionQuality(item);
  return {
    id: item.id,
    category: item.category,
    skill: item.skill || item.category,
    roles: item.roles || [],
    levels: item.levels || [],
    type: item.type,
    codeKind: item.codeKind || null,
    difficulty: item.difficulty,
    question: item.question,
    tags: createQuestionTags(item).slice(0, 8),
    reviewStatus: item.governance?.reviewStatus || '人工审核通过',
    source: item.governance?.source || 'built-in',
    quality: {
      score: quality.score,
      grade: quality.grade,
      approvable: quality.approvable,
      issues: quality.issues.slice(0, 4)
    }
  };
}

function toDraftCatalogItem(item) {
  const quality = assessQuestionQuality({
    id: item.id,
    category: item.category,
    skill: item.skill,
    roles: item.roles,
    levels: item.levels,
    type: item.type,
    codeKind: item.codeKind,
    difficulty: item.difficulty,
    question: item.question,
    keywords: item.keywords,
    expectedPoints: item.expectedPoints,
    referenceAnswer: item.referenceAnswer,
    excellentAnswer: item.excellentAnswer,
    followUps: item.followUps,
    commonMistakes: item.commonMistakes,
    scoringRubric: {
      mustHave: item.expectedPoints,
      goodToHave: item.keywords,
      redFlags: item.commonMistakes
    },
    governance: {
      source: item.source,
      license: item.license,
      reviewNotes: item.reviewNotes
    }
  });

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    roles: item.roles || [],
    levels: item.levels || [],
    type: item.type,
    difficulty: item.difficulty,
    question: item.question,
    tags: createQuestionTags(item).slice(0, 8),
    source: item.source || 'manual',
    status: item.status,
    reviewNotes: item.reviewNotes || '',
    createdAt: item.createdAt,
    quality: {
      score: quality.score,
      grade: quality.grade,
      approvable: quality.approvable,
      issues: quality.issues.slice(0, 4)
    }
  };
}

function createQuestionTags(item) {
  return [...new Set([
    item.category,
    item.skill,
    item.type,
    ...(item.keywords || []),
    ...(item.expectedPoints || [])
  ].filter(Boolean))];
}

function scoreExternalDraftForPromotion(draft = {}) {
  const title = clean(draft.title);
  const sourceCategory = clean(draft.category);
  const inferredCategory = inferCategory(`${title} ${normalizeArray(draft.tags).join(' ')}`);
  const shouldOverrideSourceCategory = sourceCategory === '算法'
    && inferredCategory !== '综合能力'
    && inferredCategory !== '算法'
    && !/算法|复杂度|链表|数组|二分|滑动窗口|动态规划|栈|队列|树|图/.test(title);
  const category = shouldOverrideSourceCategory
    ? inferredCategory
    : sourceCategory && sourceCategory !== '综合能力'
    ? sourceCategory
    : (inferredCategory !== '综合能力' ? inferredCategory : sourceCategory || inferredCategory);
  const titleSignals = analyzeExternalTitle(title);
  const sourceSignals = analyzeExternalSource(draft);
  const coverageSignals = analyzeExternalCoverage(category, draft);
  let promotionScore = 40;
  const reasons = [];
  const risks = [];

  if (isLowValuePromotionTitle(title)) {
    promotionScore -= 45;
    risks.push('疑似正文说明、代码片段或低价值标题，暂不建议入库。');
  }

  promotionScore += sourceSignals.score;
  reasons.push(...sourceSignals.reasons);
  risks.push(...sourceSignals.risks);

  promotionScore += titleSignals.score;
  reasons.push(...titleSignals.reasons);
  risks.push(...titleSignals.risks);

  promotionScore += coverageSignals.score;
  reasons.push(...coverageSignals.reasons);

  if (Number(draft.popularity) > 1000) {
    promotionScore += 4;
    reasons.push('外部热度较高，适合提炼常见误区和追问。');
  } else if (Number(draft.popularity) > 50) {
    promotionScore += 2;
    reasons.push('外部有一定讨论热度。');
  }

  const proposed = createPromotedQuestionCandidate({
    ...draft,
    category,
    promotionScore: 0,
    qualityScore: 0,
    promotionReasons: [],
    promotionRisks: []
  });
  const quality = assessQuestionQuality(proposed, { phase: 'external-candidate' });
  promotionScore += Math.round((quality.score - 78) / 4);

  if (!quality.approvable) {
    risks.push(...quality.issues.slice(0, 3).map((issue) => `候选结构待补强：${issue.message}`));
  }

  promotionScore = Math.max(0, Math.min(100, Math.round(promotionScore)));

  return {
    id: draft.id,
    title,
    category,
    skill: clean(draft.skill) || category,
    type: draft.type || inferExternalQuestionType(title, category),
    difficulty: clampDifficulty(draft.difficulty),
    provider: draft.provider || '',
    sourceId: draft.sourceId || '',
    sourceName: draft.sourceName || '',
    sourceUrl: draft.sourceUrl || '',
    sourcePath: draft.sourcePath || '',
    license: draft.license || '',
    licenseUrl: draft.licenseUrl || '',
    attributionRequired: Boolean(draft.attributionRequired),
    importPolicy: draft.importPolicy || 'signal-only',
    popularity: Number(draft.popularity || 0) || 0,
    tags: normalizeArray(draft.tags),
    promotionScore,
    qualityScore: quality.score,
    qualityGrade: quality.grade,
    promotionReasons: [...new Set(reasons)].slice(0, 6),
    promotionRisks: [...new Set(risks)].slice(0, 6),
    qualityIssues: quality.issues.slice(0, 4)
  };
}

function analyzeExternalSource(draft) {
  const reasons = [];
  const risks = [];
  let score = 0;

  if (draft.importPolicy === 'can-transform') {
    score += 18;
    reasons.push('授权策略允许转写成正式中文训练题。');
  } else {
    score -= 16;
    risks.push('该来源仅适合作为追问/误区信号，不建议直接入正式题库。');
  }

  if (['Apache-2.0', 'MIT', 'CC0-1.0', 'CC BY 4.0'].includes(draft.license)) {
    score += 8;
    reasons.push(`授权清晰：${draft.license}。`);
  } else {
    score -= 8;
    risks.push('授权不适合作为直接入库素材。');
  }

  if (draft.attributionRequired) {
    score -= 2;
    risks.push('需要在候选题中保留来源署名和许可证链接。');
  }

  if (/中文题库|JavaGuide/i.test(`${draft.provider} ${draft.sourceName}`)) {
    score += 8;
    reasons.push('中文题源，转写成本低，和当前中文模拟面试定位匹配。');
  }

  return { score, reasons, risks };
}

function analyzeExternalTitle(title) {
  const reasons = [];
  const risks = [];
  let score = 0;
  const normalized = normalizeComparableText(title);

  if (/[\u4e00-\u9fff]/.test(title)) {
    score += 10;
    reasons.push('题目本身是中文，适合直接转成中文面试问法。');
  }

  if (/[?？]|什么|为什么|如何|怎么|区别|原理|机制|流程|有哪些|是否/.test(title)) {
    score += 12;
    reasons.push('标题天然接近面试问句。');
  } else {
    score -= 6;
    risks.push('标题更像文章主题，入库前需要改写成明确问题。');
  }

  if (/线上|排查|优化|设计|高并发|一致性|性能|索引|事务|缓存|GC|线程|HTTP|TCP|复杂度|边界/.test(title)) {
    score += 10;
    reasons.push('包含高频面试考点或真实工程场景。');
  }

  if (normalized.length < 8) {
    score -= 12;
    risks.push('标题过短，语义不够完整。');
  } else if (normalized.length > 80) {
    score -= 5;
    risks.push('标题较长，建议拆成主问题和追问。');
  }

  if (/目录|导航|推荐阅读|总结|适用场景|databaseadministrator/i.test(title.replace(/\s+/g, ''))) {
    score -= 18;
    risks.push('疑似目录或说明段落，优先级较低。');
  }

  if (/^[@#<>{}]/.test(title) || /methodProxy|param|return|throws|import\s|public\s|private\s|class\s/i.test(title)) {
    score -= 24;
    risks.push('疑似代码片段或 API 注释，不适合直接作为面试题。');
  }

  if (/https?:\/\/|<https?:|www\.|\.com\b|\.cn\b/i.test(title)) {
    score -= 28;
    risks.push('标题包含外链或资料引用，优先作为资料信号而不是面试题。');
  }

  if (title.length > 90 && /就是|而|对应于|实现了|支持|不支持|通过|用于|可以|使用的是|介绍到/.test(title)) {
    score -= 32;
    risks.push('标题更像正文解释句，自动筛选会降级处理。');
  }

  if (/^什么是.+[,，].+[,，].+\??$/.test(title) || /数据库管理员|相关网站|推荐阅读|相关阅读/.test(title)) {
    score -= 16;
    risks.push('标题更像概念词条或资料目录，需要人工改写后再考虑。');
  }

  if (title.includes('⭐️')) {
    score += 2;
    reasons.push('来源中带高频标记，可作为候选参考。');
  }

  return { score, reasons, risks };
}

function isLowValuePromotionTitle(title) {
  const value = String(title || '').trim();
  if (/^[@#<>{}]/.test(value)) return true;
  if (/methodProxy|@param|@return|@throws|import\s|public\s|private\s|protected\s|class\s/i.test(value)) return true;
  if (/https?:\/\/|<https?:|www\.|\.com\b|\.cn\b/i.test(value)) return true;
  if (/数据库管理员|相关网站|推荐阅读|相关阅读/.test(value)) return true;
  if (/^[^?？]{2,16}[:：]\s*.+/.test(value) && !/区别|为什么|如何|什么|怎么|怎样|有哪些|是否/.test(value)) return true;
  if (value.length > 90 && /就是|而|对应于|实现了|支持|不支持|通过|用于|可以|使用的是|介绍到/.test(value)) return true;
  if (/为什么.*因为/.test(value) && value.length > 45) return true;
  if (/^(安全性|可移植性|高性能|健壮性|简单性|解释型|多线程)\s*[（(]/.test(value)) return true;
  if (/^\d+(?:\.\d+)*\.\s*/.test(value) && !/[?？]|为什么|如何|什么|怎么|怎样|区别|有哪些|是否/.test(value)) return true;
  if (/^[\u4e00-\u9fffA-Za-z0-9\s（）()、，,]+[；;]$/.test(value) && !/[?？]|为什么|如何|什么|怎么|怎样|区别|有哪些|是否/.test(value)) return true;
  return false;
}

function analyzeExternalCoverage(category, draft) {
  const currentCount = questionBank.filter((item) => item.category === category).length;
  const scarceCategories = new Set(['网络', '操作系统', '算法', 'Redis', '系统设计', '前端', 'MySQL', 'Go', 'Python']);
  const reasons = [];
  let score = 0;

  if (category === '通用技术' || category === '综合能力') {
    return {
      score: -12,
      reasons: ['分类较泛，建议排在明确技术模块之后。']
    };
  }

  if (scarceCategories.has(category)) {
    score += 16;
    reasons.push(`当前正式题库的 ${category} 方向仍值得继续扩充。`);
  } else if (currentCount <= 5) {
    score += 7;
    reasons.push(`${category} 正式题数量不多，适合作为补充候选。`);
  }

  if (draft.importPolicy === 'can-transform' && category !== '通用技术' && category !== '综合能力') {
    score += 4;
    reasons.push('分类明确，容易映射到本地岗位训练路线。');
  }

  return { score, reasons };
}

function selectBalancedExternalCandidates(items, limit) {
  const byCategory = new Map();
  const selected = [];

  for (const item of items) {
    const count = byCategory.get(item.category) || 0;
    if (count >= 8) continue;
    selected.push(item);
    byCategory.set(item.category, count + 1);
    if (selected.length >= limit) break;
  }

  if (selected.length >= limit) return selected;

  for (const item of items) {
    if (selected.some((selectedItem) => selectedItem.id === item.id)) continue;
    selected.push(item);
    if (selected.length >= limit) break;
  }

  return selected;
}

function createPromotedQuestionCandidate(item) {
  const category = item.category || inferCategory(item.title);
  const type = item.type || inferExternalQuestionType(item.title, category);
  const expectedPoints = createExpectedPointsFromExternalTitle(item.title, category);
  const keywords = [...new Set([
    category,
    ...normalizeArray(item.tags),
    ...expectedPoints.slice(0, 3)
  ].filter(Boolean))].slice(0, 8);
  const commonMistakes = createCommonMistakesFromExternalTitle(item.title, category);

  return {
    id: `candidate_${normalizeSlug(`${category}_${item.title}`).slice(0, 48)}`,
    category,
    skill: item.skill || category,
    roles: inferRolesForCategory(category),
    levels: inferLevelsForExternalCandidate(item.difficulty, item.title),
    type,
    ...(type === 'algorithm' ? { codeKind: inferCodeKindFromCategory(category, item.title) } : {}),
    difficulty: clampDifficulty(item.difficulty),
    question: createCandidateQuestionText(item.title, category, type),
    keywords,
    expectedPoints,
    referenceAnswer: createCandidateReferenceAnswer(item.title, category, item),
    excellentAnswer: createCandidateExcellentAnswer(item.title, category, item),
    followUps: createCandidateFollowUps(item.title, category, type),
    commonMistakes,
    scoringRubric: {
      mustHave: expectedPoints.slice(0, 3),
      goodToHave: expectedPoints.slice(3).concat(keywords.filter((keyword) => !expectedPoints.includes(keyword))).slice(0, 5),
      redFlags: commonMistakes
    },
    governance: {
      status: 'candidate',
      source: item.sourceName || item.provider || 'external',
      sourceUrl: item.sourceUrl || '',
      sourcePath: item.sourcePath || '',
      license: item.license || '',
      licenseUrl: item.licenseUrl || '',
      attributionRequired: Boolean(item.attributionRequired),
      promotionScore: item.promotionScore || 0,
      qualityScore: item.qualityScore || 0,
      reviewNotes: '外部草稿自动生成候选题，正式入库前需要人工复核参考答案和评分点。'
    }
  };
}

function inferExternalQuestionType(title, category) {
  if (category === '算法' || /算法|复杂度|数组|链表|二分|滑动窗口|动态规划|栈|队列/i.test(title)) return 'algorithm';
  if (/系统设计|架构|高并发|分布式|限流|幂等|一致性|秒杀|缓存/.test(title)) return 'system-design';
  return 'knowledge';
}

function createExpectedPointsFromExternalTitle(title, category) {
  const points = [
    `${category} 核心概念`,
    '适用场景',
    '关键机制',
    '边界条件',
    '常见误区'
  ];

  if (/线上|排查|优化|性能|慢|故障/.test(title)) points.push('排查顺序和优化取舍');
  if (/设计|架构|高并发|分布式|一致性/.test(title)) points.push('方案取舍和失败恢复');
  if (/算法|复杂度|数组|链表|二分|窗口/.test(title)) points.push('时间复杂度和空间复杂度');
  if (/索引|事务|MVCC|数据库|MySQL/i.test(title)) points.push('数据库执行机制和性能影响');
  if (/HTTP|HTTPS|TCP|DNS|网络/i.test(title)) points.push('网络交互流程和异常场景');

  return [...new Set(points)].slice(0, 7);
}

function createCommonMistakesFromExternalTitle(title, category) {
  const mistakes = [
    '只背结论，不解释原理和判断过程。',
    '没有说明适用边界和失败场景。',
    '不能结合真实项目或线上排查经验。'
  ];

  if (/区别|vs|VS/.test(title)) mistakes.push('只罗列差异，不说明为什么这样设计以及如何选择。');
  if (/优化|性能|慢|排查/.test(title)) mistakes.push('一上来给方案，不先确认现象、范围、指标和证据。');
  if (category === '算法') mistakes.push('忽略复杂度、边界输入和重复/空值等特殊情况。');

  return [...new Set(mistakes)].slice(0, 5);
}

function createCandidateQuestionText(title, category, type) {
  const cleanTitle = clean(title).replace(/[。.]$/, '');
  if (/[?？]$/.test(cleanTitle)) {
    return `${cleanTitle} 请用中文面试回答方式说明核心原理、边界条件和真实项目中的取舍。`;
  }
  if (type === 'algorithm') {
    return `请围绕“${cleanTitle}”说明解题思路、关键数据结构、边界条件和复杂度；可以写伪代码或代码片段。`;
  }
  if (type === 'system-design') {
    return `请围绕“${cleanTitle}”设计一个可落地方案，说明核心流程、关键取舍、失败场景和监控治理。`;
  }
  return `请解释“${cleanTitle}”，并说明它在 ${category} 面试中的核心原理、适用场景、边界条件和常见误区。`;
}

function createCandidateReferenceAnswer(title, category, item) {
  return [
    `这道题来自外部草稿“${title}”，正式入库前应重写为本地中文参考答案。`,
    `回答应先给出 ${category} 的核心定义或主流程，再解释关键机制和适用场景。`,
    '随后补充边界条件、常见误区、线上排查或项目落地取舍。',
    item.attributionRequired ? `入库时需要保留来源署名：${item.sourceName || item.provider}，许可证 ${item.license || '未知'}。` : '该来源不要求额外署名，但仍建议保留来源链接便于追溯。'
  ].join('');
}

function createCandidateExcellentAnswer(title, category, item) {
  return [
    `优秀回答可以按“结论 -> 原理 -> 场景 -> 边界 -> 项目化表达”的结构组织。`,
    `先用一两句话回答“${title}”的核心结论，再展开 ${category} 里的关键机制。`,
    '如果涉及性能、并发、一致性或网络交互，要说明判断顺序、指标证据和方案取舍。',
    '最后结合自己项目中的一次真实使用、排查或优化经历，说明结果和复盘。'
  ].join('');
}

function createCandidateFollowUps(title, category, type) {
  const followUps = [
    `如果继续追问“${title}”的实现细节，你会补充哪三个关键点？`,
    `这个问题在真实项目里最容易踩的坑是什么？`,
    `你会用哪些指标或现象证明自己的判断是对的？`
  ];

  if (type === 'algorithm') followUps.push('如果输入规模扩大 10 倍，你的复杂度和边界处理是否还能接受？');
  if (type === 'system-design') followUps.push('如果核心依赖失败或流量突增，你的方案如何降级和恢复？');
  if (category === 'MySQL') followUps.push('如果线上 SQL 变慢，你会如何用 Explain 和监控验证原因？');
  if (category === 'Redis') followUps.push('如果 Redis 延迟升高或缓存不一致，你会怎么排查？');

  return [...new Set(followUps)].slice(0, 5);
}

function inferRolesForCategory(category) {
  const roleMap = {
    前端: ['frontend', 'fullstack'],
    Java: ['java', 'backend', 'fullstack'],
    Go: ['go', 'backend', 'fullstack'],
    Python: ['python', 'backend', 'fullstack'],
    MySQL: ['backend', 'java', 'go', 'python', 'fullstack'],
    Redis: ['backend', 'java', 'go', 'python', 'fullstack'],
    网络: ['backend', 'java', 'go', 'python', 'fullstack', 'frontend'],
    操作系统: ['backend', 'java', 'go', 'python', 'fullstack'],
    算法: ['backend', 'frontend', 'fullstack', 'java', 'go', 'python'],
    系统设计: ['backend', 'java', 'go', 'python', 'fullstack']
  };
  return roleMap[category] || ['backend', 'java', 'fullstack'];
}

function inferLevelsForExternalCandidate(difficulty, title) {
  const level = clampDifficulty(difficulty);
  if (level >= 3 || /高并发|分布式|一致性|排查|性能|优化|架构|源码|GC|锁/.test(title)) return ['middle', 'senior'];
  if (level <= 1) return ['junior', 'middle'];
  return ['junior', 'middle', 'senior'];
}

function inferCodeKindFromCategory(category, title) {
  if (/SQL|查询|索引|数据库|MySQL/i.test(title) || category === 'MySQL') return 'sql';
  if (category === '前端') return 'frontend';
  if (/限流|幂等|缓存|接口|系统/.test(title)) return 'backend';
  return 'algorithm';
}

function normalizeSlug(value) {
  const ascii = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return ascii || `external_${randomUUID().slice(0, 8)}`;
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.map(clean).filter(Boolean);
  if (typeof value === 'string') return splitTags(value);
  return [];
}

function splitTags(value) {
  return String(value || '')
    .split(/[,，、\n]/)
    .map(clean)
    .filter(Boolean);
}

function inferCategory(text) {
  const value = String(text || '');
  if (/包装类型|Integer|String|StringBuilder|StringBuffer|HashMap|ConcurrentHashMap|JDK|JVM|Java|异常|BIO|NIO|AIO/i.test(value)) return 'Java';
  const rules = [
    ['Java', /java|jvm|jdk|jre|string|stringbuilder|stringbuffer|exception|hashmap|concurrenthashmap|spring|线程池|锁|gc|bio|nio|aio/i],
    ['Go', /go|goroutine|channel|context|pprof/i],
    ['Python', /python|gil|celery/i],
    ['前端', /前端|javascript|typescript|react|vue|浏览器|promise/i],
    ['MySQL', /mysql|sql|索引|事务|慢查询|数据库/i],
    ['Redis', /redis|缓存|热 key|大 key|穿透|击穿/i],
    ['网络', /tcp|http|https|dns|tls|网络|连接池/i],
    ['操作系统', /进程|线程|内存|swap|linux|io 多路复用|epoll/i],
    ['系统设计', /系统设计|高并发|分布式|限流|幂等|补偿/i],
    ['算法', /算法|复杂度|链表|数组|二分|滑动窗口|动态规划/i]
  ];
  return rules.find(([, pattern]) => pattern.test(value))?.[0] || '综合能力';
}

function createDefaultFollowUps(category) {
  return [
    `这个问题里最容易被忽略的边界是什么？`,
    `如果落到你自己的项目里，你会怎么验证这个方案？`,
    `如果面试官继续追问 ${category} 的失败场景，你会补充哪一点？`
  ];
}

function clampDifficulty(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 2;
  return Math.max(1, Math.min(3, Math.round(number)));
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function countBy(items, getter) {
  return items.reduce((summary, item) => {
    const key = getter(item);
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});
}

function hasPlaceholderText(value) {
  return /todo|tbd|待补充|待完善|占位|示例答案|这里填写|作为ai|作为 AI|ai生成|AI 生成/i.test(String(value || ''));
}

function hasCandidateTemplateText(value) {
  const text = String(value || '');
  return [
    '正式入库前应重写',
    '请用中文面试回答方式说明',
    '这道题来自外部草稿',
    '优秀回答可以按“结论 -> 原理 -> 场景 -> 边界 -> 项目化表达”',
    '的实现细节，你会补充哪三个关键点'
  ].some((pattern) => text.includes(pattern));
}

function looksGarbled(value) {
  const text = String(value || '');
  if (!text) return false;
  const mojibakeHits = (text.match(/[锟斤拷]|涓|绋|鍚|闂|缂|妯|熷|栫/g) || []).length;
  return mojibakeHits >= 5 || /�{2,}/.test(text);
}

function isNearlySameText(left, right) {
  const normalizedLeft = normalizeComparableText(left);
  const normalizedRight = normalizeComparableText(right);
  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;
  const shorter = normalizedLeft.length <= normalizedRight.length ? normalizedLeft : normalizedRight;
  const longer = normalizedLeft.length > normalizedRight.length ? normalizedLeft : normalizedRight;
  return shorter.length >= 16 && longer.includes(shorter) && shorter.length / longer.length > 0.72;
}

function normalizeComparableText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^\p{Script=Han}a-z0-9]+/gu, '');
}

function hasRealScenarioSignal(value) {
  return /项目|业务|线上|接口|服务|系统|链路|故障|排查|指标|高并发|数据量|延迟|吞吐|失败|重试|补偿|落地|设计/i.test(String(value || ''));
}

function hasSeniorSignal(value) {
  return /顺序|定位|排查|取舍|权衡|风险|指标|监控|日志|边界|失败|降级|限流|回滚|压测|复杂度|一致性|性能/i.test(String(value || ''));
}

function clean(value) {
  return String(value ?? '').trim();
}
