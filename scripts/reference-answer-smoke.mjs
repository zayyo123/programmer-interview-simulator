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

const detailedIds = [
  'mysql_001',
  'frontend_001',
  'system_001',
  'algorithm_001',
  'python_001',
  'go_001',
  'java_003',
  'security_001',
  'architect_001'
];

for (const id of detailedIds) {
  const question = questionBank.find((item) => item.id === id);
  assert(question, `${id} should exist`);
  const resolvedAnswer = resolveQuestionAnswers(question);
  const answer = resolvedAnswer.referenceAnswer;
  assert(answer.length >= 300, `${id} reference should contain at least 300 characters`);
  assert(resolvedAnswer.excellentAnswer.length >= 300, `${id} excellent answer should contain at least 300 characters`);
  assert(resolvedAnswer.excellentAnswer !== answer, `${id} excellent answer should differ from the reference answer`);
  assert(/边界|异常|风险|取舍|不能|不会|并非|不适合|限制|成本|若/.test(answer), `${id} reference should explain boundaries or trade-offs`);
  assert(/验证|验收|监控|指标|压测|复杂度|测试|回归|观察|分析|比较|评估|EXPLAIN/.test(answer), `${id} reference should explain verification`);
}

console.log('reference-answer-smoke: ok');
