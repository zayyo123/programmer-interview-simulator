import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveQuestionAnswers } from '../shared/referenceAnswerResolver.js';
import { getConcreteKnowledgeAnswer } from '../shared/concreteReferenceCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../data/approved-questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const PATCHES = {
  // 已迁移至 architect.json「高可用架构」，不再用短 patch 覆盖目录详细版
};

function pickAnswers(question, resolved) {
  const patch = PATCHES[question.id];
  const catalog = getConcreteKnowledgeAnswer(question);

  let referenceAnswer = patch?.referenceAnswer ?? resolved.referenceAnswer;
  let excellentAnswer = resolved.excellentAnswer;

  // 目录版显著更长时，同步写入主题库（避免运行时与主数据长期不一致）
  if (!patch && catalog?.referenceAnswer) {
    const current = String(question.referenceAnswer || '').trim();
    const candidate = String(catalog.referenceAnswer || '').trim();
    if (candidate.length >= current.length + 20 && candidate !== current) {
      referenceAnswer = candidate;
      if (catalog.excellentAnswer && catalog.excellentAnswer.length >= String(question.excellentAnswer || '').length) {
        excellentAnswer = catalog.excellentAnswer;
      }
    }
  }

  if (question.id === 'approved_security_011_sql_注入') {
    referenceAnswer = String(referenceAnswer).replace(/含占位符/g, '使用 ? 或 :name 等绑定参数');
    referenceAnswer = referenceAnswer.replace(/与数量匹配的占位符/g, '与数量匹配的绑定参数');
  }

  if (question.id === 'approved_frontend_extra_019_大列表虚拟滚动') {
    referenceAnswer = String(referenceAnswer).replace(/空白占位/g, '空白区域');
  }

  if (question.id === 'approved_frontend_extra_031_弱网优化') {
    referenceAnswer = String(referenceAnswer).replace(/页面结构占位/g, '页面骨架布局');
    if (excellentAnswer.length < 40) {
      excellentAnswer =
        '我会设超时和指数退避重试，骨架屏降低等待感知，Service Worker 缓存离线可用，弱网下降级图片和视频优先保证核心内容。';
    }
  }

  return { referenceAnswer, excellentAnswer };
}

let upgraded = 0;

data.questions = data.questions.map((question) => {
  const resolved = resolveQuestionAnswers(question);
  const { referenceAnswer, excellentAnswer } = pickAnswers(question, resolved);

  const changed =
    referenceAnswer !== question.referenceAnswer
    || excellentAnswer !== question.excellentAnswer;

  if (changed) upgraded += 1;

  return changed
    ? { ...question, referenceAnswer, excellentAnswer }
    : question;
});

data.updatedAt = new Date().toISOString();
fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ upgraded }, null, 2));
