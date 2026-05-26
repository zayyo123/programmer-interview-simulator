import {
  promotedQuestionCandidatePath,
  runAutomaticQuestionScreening
} from '../src/questionGovernance.js';

const options = parseArgs(process.argv.slice(2));
const report = await runAutomaticQuestionScreening(options);
const automation = report.automation;

console.log(`自动候选题筛选完成：${automation.screening.candidateCount}/${automation.screening.externalDraftCount} 条`);
console.log(`模式：${automation.mode}`);
if (automation.sync.skipped) {
  console.log('同步题源：已跳过，使用本地缓存');
} else if (automation.sync.ok) {
  console.log(`同步题源：${automation.sync.draftCount} 条草稿，可转写 ${automation.sync.readyForImportCount} 条`);
} else {
  console.log(`同步题源：失败，已使用本地缓存继续筛选（${automation.sync.error}）`);
}
console.log(`评分门槛：${automation.screening.minScore}`);
console.log(`输出文件：${automation.screening.outputPath || promotedQuestionCandidatePath}`);
console.log('分类分布：');
for (const [category, count] of Object.entries(automation.screening.byCategory || {})) {
  console.log(`- ${category}: ${count}`);
}

console.log('Top 10 候选：');
for (const item of report.candidates.slice(0, 10)) {
  console.log(`#${item.rank} ${item.promotionScore}分 ${item.category}｜${item.title}`);
  console.log(`  来源：${item.sourceName || item.provider || '未知来源'}｜质量 ${item.qualityScore} ${item.qualityGrade}`);
  if (item.promotionRisks.length) {
    console.log(`  风险：${item.promotionRisks.slice(0, 2).join('；')}`);
  }
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
    else if (key === 'sync') options.sync = value !== 'false';
    return options;
  }, {});
}
