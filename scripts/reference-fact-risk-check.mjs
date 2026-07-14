import { readFileSync } from 'node:fs';
import { loadRuntimeQuestionBank } from '../src/questionGovernance.js';

const questionBank = await loadRuntimeQuestionBank();
const errors = [];
const genericPatterns = [
  /面试答题可结合这些要点展开/,
  /明确 .+ 的目标、适用场景和边界/
];
const seniorAnswerSignals = {
  boundary: /边界|异常|失败|风险|限制|不适合|不能|避免|注意|取舍|代价|降级|回滚|超时|幂等|误报|冲突|泄漏|故障|不可|问题/,
  verification: /验证|监控|指标|压测|测试|日志|对账|回归|观察|采样|EXPLAIN|profile|复杂度|成功率|延迟|排查|检查|确认|复现|评审|记录|审计|报告|trace|pprof|告警|采集|结果|状态/iu,
  tradeoff: /取舍|权衡|代价|成本|适合|不适合|相比|而不是|但|否则|不能|优先|选择|差异|区别|场景|优缺点|影响|并非|不等于|视情况|根据|结合/
};

const riskyPatterns = [
  { pattern: /(?:经验值|适合 CPU 密集).{0,30}2\s*[×*]\s*CPU.{0,10}1|2\s*[×*]\s*CPU.{0,10}1.{0,30}适合 CPU 密集/i, message: 'worker 数不能使用固定的 2*CPU+1 公式' },
  { pattern: /cProfile\s*看\s*GIL 等待时间/i, message: 'cProfile 不能被描述为直接测量 GIL 等待时间' },
  { pattern: /BackgroundTasks.{0,30}异步化(?:慢接口|非关键路径)/i, message: 'BackgroundTasks 不是可靠的重型异步任务队列' },
  { pattern: /关键依赖必须多活\/多供应商/, message: '多云或多供应商不是所有关键依赖的强制答案' },
  { pattern: /不含整单优惠分摊问题/, message: '部分退款不能忽略整单优惠分摊' },
  { pattern: /生产峰值的?60-70%.{0,30}(?:6-24|12-24)小时/, message: '稳定性压测不能套用固定流量百分比和时长' },
  { pattern: /将80%用例集中|需求追溯矩阵是否 100% 覆盖/, message: '测试策略不能用固定用例比例代替风险判断' }
];

for (const question of questionBank) {
  const answer = String(question.referenceAnswer || '').trim();
  const excellentAnswer = String(question.excellentAnswer || '').trim();
  if (answer.length < 300) {
    errors.push(`${question.id}: 参考答案仅 ${answer.length} 字，低于 300 字深度门槛`);
  }
  if (excellentAnswer.length < 300) {
    errors.push(`${question.id}: 优秀回答仅 ${excellentAnswer.length} 字，低于 300 字示范门槛`);
  }
  if (excellentAnswer === answer) {
    errors.push(`${question.id}: 优秀回答与参考答案完全相同，缺少面试表达层次`);
  }
  if (genericPatterns.some((pattern) => pattern.test(answer))) {
    errors.push(`${question.id}: 参考答案仍包含模板化扩写`);
  }
  if (genericPatterns.some((pattern) => pattern.test(excellentAnswer))) {
    errors.push(`${question.id}: 优秀回答仍包含模板化扩写`);
  }
  if (question.difficulty >= 3) {
    const signalCount = Object.values(seniorAnswerSignals)
      .filter((pattern) => pattern.test(answer))
      .length;
    if (signalCount < 2) {
      errors.push(`${question.id}: 高难题答案缺少边界、验证或取舍信息，当前仅命中 ${signalCount} 类`);
    }
  }

  const sentences = answer.split(/[。！？]/).map((item) => item.trim()).filter((item) => item.length >= 12);
  const seen = new Set();
  for (const sentence of sentences) {
    if (seen.has(sentence)) {
      errors.push(`${question.id}: 参考答案包含重复句“${sentence.slice(0, 36)}”`);
      break;
    }
    seen.add(sentence);
  }

  for (const rule of riskyPatterns) {
    if (rule.pattern.test(answer)) errors.push(`${question.id}: ${rule.message}`);
  }
}

const catalogSources = ['python.json', 'qa.json'].map((fileName) => ({
  fileName,
  content: readFileSync(new URL(`../data/concrete-refs/${fileName}`, import.meta.url), 'utf8')
}));
for (const source of catalogSources) {
  for (const rule of riskyPatterns) {
    if (rule.pattern.test(source.content)) errors.push(`${source.fileName}: ${rule.message}`);
  }
}

if (errors.length) {
  console.error(`参考答案事实与深度门禁失败，共 ${errors.length} 个问题：`);
  for (const error of errors.slice(0, 40)) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`参考答案事实与深度门禁通过：${questionBank.length} 道题参考答案和优秀回答均不少于 300 字，高难题具备边界/验证/取舍信息，且无机械重复、模板填充、重复句或已知高风险表述。`);
