import { assessQuestionQuality, loadRuntimeQuestionBank } from '../src/questionGovernance.js';

const questionBank = await loadRuntimeQuestionBank();
const results = questionBank.map((question) => ({
  id: question.id,
  category: question.category,
  type: question.type,
  quality: assessQuestionQuality(question)
}));
const failing = results.filter((item) => !item.quality.approvable);
const averageScore = results.length
  ? Math.round(results.reduce((sum, item) => sum + item.quality.score, 0) / results.length)
  : 0;

if (failing.length) {
  console.error(`题库质量门禁失败：${failing.length}/${results.length} 道题未达标，平均分 ${averageScore}`);
  for (const item of failing.slice(0, 20)) {
    const issues = item.quality.issues
      .map((issue) => `${issue.severity}:${issue.message}`)
      .join('；');
    console.error(`- ${item.id} (${item.category}/${item.type}) ${item.quality.score} 分：${issues}`);
  }
  process.exit(1);
}

console.log(`题库质量门禁通过：${results.length} 道题，平均质量分 ${averageScore}。`);
