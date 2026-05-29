import { importPromotedCandidatesToDrafts, questionDraftPath } from '../src/questionGovernance.js';

const options = parseArgs(process.argv.slice(2));
const result = await importPromotedCandidatesToDrafts(options);

console.log(`候选题已转入待审核草稿：${result.summary.importedCount}/${result.summary.selectedCount} 条`);
console.log(`待审核草稿文件：${result.outputPath || questionDraftPath}`);
console.log(`当前待审核总数：${result.summary.pendingDraftCount}`);

if (result.imported.length) {
  console.log('本次导入：');
  for (const item of result.imported) {
    console.log(`- ${item.id}｜${item.category}｜质量 ${item.quality.score} ${item.quality.grade}｜${item.title}`);
  }
}

if (result.skipped.length) {
  console.log('跳过项：');
  for (const item of result.skipped) {
    console.log(`- #${item.rank || '-'} ${item.title}：${item.reason}`);
  }
}

function parseArgs(args) {
  return args.reduce((options, arg) => {
    const [key, rawValue] = arg.replace(/^--/, '').split('=');
    const value = rawValue ?? 'true';
    if (key === 'ranks' || key === 'rank') options.ranks = value;
    else if (key === 'top' || key === 'limit') options.top = Number(value);
    else if (key === 'min-score') options.minScore = Number(value);
    else if (key === 'category') options.category = value;
    else if (key === 'input') options.inputPath = value;
    else if (key === 'output') options.outputPath = value;
    else if (key === 'include-signal-only') options.includeSignalOnly = value;
    else if (key === 'include-low-quality') options.includeLowQuality = value;
    return options;
  }, {});
}
