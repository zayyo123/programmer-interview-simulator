import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { questionBank } from '../src/questions.js';
import {
  isGenericTemplateReferenceAnswer,
  resolveQuestionAnswers
} from '../shared/referenceAnswerResolver.js';

const frontendProject = questionBank.find((item) => item.id === 'frontend_003');
assert(frontendProject, 'frontend_003 should exist');

const resolved = resolveQuestionAnswers(frontendProject);
assert(!isGenericTemplateReferenceAnswer(resolved.referenceAnswer), 'frontend_003 reference should stay concrete');
assert(/Pinia|权限|ProTable/.test(resolved.referenceAnswer), 'frontend_003 reference should mention concrete modules');

const templateQuestion = {
  id: 'approved_frontend_extra_040_前端项目复盘',
  category: '前端',
  roles: ['frontend'],
  type: 'project',
  question: '请讲一次你治理前端性能、稳定性或工程化问题的项目经历。',
  skill: '前端项目复盘',
  referenceAnswer: '前端 方向回答 前端项目复盘 题时，不能只背术语，要体现生产场景、判断顺序和验证闭环。',
  excellentAnswer: '我会先把 前端项目复盘 拆成目标、约束、风险和验证四部分。',
  scoringRubric: {
    mustHave: ['性能指标', '治理动作', '验证结果']
  }
};

const fixed = resolveQuestionAnswers(templateQuestion);
assert(!isGenericTemplateReferenceAnswer(fixed.referenceAnswer), 'template frontend project answer should be replaced');
assert(/LCP|Lighthouse|白屏/.test(fixed.referenceAnswer), 'performance project answer should include concrete metrics');

const approved = JSON.parse(readFileSync('data/approved-questions.json', 'utf8'));
const jvm = approved.questions.find((q) => q.skill === 'JVM 内存模型');
assert(jvm && !isGenericTemplateReferenceAnswer(jvm.referenceAnswer), 'approved JVM question should have concrete reference');
assert(/堆|jmap|OOM|元空间/.test(jvm.referenceAnswer), 'JVM reference should mention concrete terms');

console.log('reference-answer-smoke: ok');
