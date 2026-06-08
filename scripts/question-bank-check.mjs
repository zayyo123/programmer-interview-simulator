import { loadRuntimeQuestionBank } from '../src/questionGovernance.js';
import { roleLabels } from '../src/questions.js';

const allowedTypes = new Set(['knowledge', 'project', 'system-design', 'algorithm']);
const allowedCodeKinds = new Set(['algorithm', 'sql', 'frontend', 'backend']);
const allowedLevels = new Set(['junior', 'middle', 'senior']);
const allowedRoles = new Set(Object.keys(roleLabels));
const questionBank = await loadRuntimeQuestionBank();
const ids = new Set();
const errors = [];

if (!questionBank.length) {
  errors.push('运行时题库为空');
}

for (const [index, question] of questionBank.entries()) {
  const label = question.id || `第 ${index + 1} 题`;
  const rubric = question.scoringRubric || {};
  const expectedPoints = Array.isArray(question.expectedPoints) && question.expectedPoints.length
    ? question.expectedPoints
    : [...new Set([...(rubric.mustHave || []), ...(rubric.goodToHave || [])])];

  requireString(question.id, `${label}: 缺少 id`);
  if (question.id && ids.has(question.id)) errors.push(`${label}: id 重复`);
  if (question.id) ids.add(question.id);

  requireString(question.category, `${label}: 缺少 category`);
  requireString(question.skill || question.category, `${label}: 缺少可推导的 skill`);
  requireString(question.question, `${label}: 缺少 question`);
  requireString(question.referenceAnswer, `${label}: 缺少 referenceAnswer`);
  requireString(question.excellentAnswer, `${label}: 缺少 excellentAnswer`);

  requireArray(question.roles, `${label}: roles 必须是非空数组`);
  for (const role of question.roles || []) {
    if (!allowedRoles.has(role)) errors.push(`${label}: 未知角色 ${role}`);
  }

  requireArray(question.levels, `${label}: levels 必须是非空数组`);
  for (const level of question.levels || []) {
    if (!allowedLevels.has(level)) errors.push(`${label}: 未知级别 ${level}`);
  }

  if (!allowedTypes.has(question.type)) errors.push(`${label}: 未知题型 ${question.type}`);
  if (!Number.isInteger(question.difficulty) || question.difficulty < 1 || question.difficulty > 3) {
    errors.push(`${label}: difficulty 必须是 1-3 的整数`);
  }

  requireArray(question.keywords, `${label}: keywords 必须是非空数组`);
  requireArray(question.followUps, `${label}: followUps 必须是非空数组`);
  requireArray(rubric.mustHave, `${label}: scoringRubric.mustHave 必须是非空数组`);
  requireArray(rubric.goodToHave, `${label}: scoringRubric.goodToHave 必须是非空数组`);
  requireArray(rubric.redFlags, `${label}: scoringRubric.redFlags 必须是非空数组`);
  requireArray(expectedPoints, `${label}: expectedPoints 无法从题库或评分规则推导`);

  if (question.type === 'algorithm' && !allowedCodeKinds.has(question.codeKind || 'algorithm')) {
    errors.push(`${label}: algorithm 题必须提供有效 codeKind 或默认 algorithm`);
  }
}

const coverage = summarizeCoverage();
const sources = summarizeSources();

if (errors.length) {
  console.error(`题库结构体检失败，共 ${errors.length} 个问题：`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `题库结构体检通过：${questionBank.length} 道运行时题目，覆盖 ${coverage.roles.size} 个方向、${coverage.categories.size} 个技术模块，来源：${sources}。`
);

function requireString(value, message) {
  if (typeof value !== 'string' || !value.trim()) errors.push(message);
}

function requireArray(value, message) {
  if (!Array.isArray(value) || !value.length) errors.push(message);
}

function summarizeCoverage() {
  return questionBank.reduce((summary, question) => {
    for (const role of question.roles || []) summary.roles.add(role);
    if (question.category) summary.categories.add(question.category);
    return summary;
  }, { roles: new Set(), categories: new Set() });
}

function summarizeSources() {
  const counts = questionBank.reduce((summary, question) => {
    const source = question.governance?.source || question.source || 'unknown';
    summary.set(source, (summary.get(source) || 0) + 1);
    return summary;
  }, new Map());
  return [...counts.entries()]
    .map(([source, count]) => `${source} ${count}`)
    .join('、');
}
