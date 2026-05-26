import { promotedQuestionCandidatePath, writeExternalQuestionCandidates } from '../src/questionGovernance.js';

const options = parseArgs(process.argv.slice(2));
const report = await writeExternalQuestionCandidates(options);

console.log(`外部草稿候选题生成完成：${report.summary.candidateCount}/${report.summary.externalDraftCount} 条`);
console.log(`评分门槛：${report.summary.minScore}`);
console.log(`输出文件：${options.outputPath || promotedQuestionCandidatePath}`);
console.log('分类分布：');
for (const [category, count] of Object.entries(report.summary.byCategory || {})) {
  console.log(`- ${category}: ${count}`);
}

console.log('Top 10 候选：');
for (const item of report.candidates.slice(0, 10)) {
  console.log(`#${item.rank} ${item.promotionScore}分 ${item.category}｜${item.title}`);
  console.log(`  原因：${item.promotionReasons.slice(0, 2).join('；')}`);
}

function parseArgs(args) {
  return args.reduce((options, arg) => {
    const [key, rawValue] = arg.replace(/^--/, '').split('=');
    const value = rawValue ?? 'true';
    if (key === 'limit') options.limit = Number(value);
    else if (key === 'min-score') options.minScore = Number(value);
    else if (key === 'include-signal-only') options.includeSignalOnly = value;
    else if (key === 'category') options.category = value;
    else if (key === 'source') options.source = value;
    else if (key === 'output') options.outputPath = value;
    return options;
  }, {});
}
