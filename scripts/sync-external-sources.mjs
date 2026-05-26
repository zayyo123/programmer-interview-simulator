import { syncExternalQuestionDrafts, externalDraftPath } from '../src/externalSources.js';

try {
  const payload = await syncExternalQuestionDrafts();
  console.log(`外部题源同步完成：${payload.summary.draftCount} 条草稿`);
  console.log(`可转写入库：${payload.summary.readyForImportCount} 条`);
  console.log(`仅作信号参考：${payload.summary.stackExchangeSignalCount} 条`);
  console.log(`输出文件：${externalDraftPath}`);

  for (const source of payload.sources) {
    const status = source.ok ? '成功' : `失败：${source.error}`;
    console.log(`- ${source.name}：${status}，${source.draftCount} 条`);
  }
} catch (error) {
  console.error(`外部题源同步失败：${error.message}`);
  process.exit(1);
}
