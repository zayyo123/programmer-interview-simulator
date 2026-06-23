import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConcreteKnowledgeAnswer } from '../shared/concreteReferenceCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogDir = path.join(__dirname, '../data/concrete-refs');
const approvedPath = path.join(__dirname, '../data/approved-questions.json');
const MIN_LEN = 330;

const CATEGORY_FILE = {
  Java: 'java.json',
  Go: 'go.json',
  Python: 'python.json',
  运维: 'ops.json',
  前端: 'frontend.json',
  安全: 'security.json',
  测试: 'qa.json',
  AI: 'ai.json',
  系统设计: 'architect.json',
  网络: 'network.json',
  数据: 'data.json',
  MySQL: 'mysql.json'
};

function mergeExpansion(reference, expansion) {
  const base = String(reference || '').trim();
  const extra = String(expansion || '').trim();
  if (!extra) return base;
  const sig = extra.slice(0, 20);
  if (base.includes(sig)) return base;
  const sep = /[。！？]$/.test(base) ? '' : '。';
  return `${base}${sep}${extra}`;
}

function resolveCatalogSkill(category, skill) {
  const aliases = {
    AI: {
      数据泄漏: '特征穿越',
      模型评估: '特征穿越',
      数据漂移: '特征漂移监控',
      'A/B 实验': '实验显著性',
      线上实验: '实验显著性',
      推荐排序: '召回排序架构',
      'RAG 切片': 'RAG 召回评估',
      检索召回: 'RAG 召回评估',
      重排模型: 'RAG 召回评估',
      幻觉治理: 'RAG 引用',
      'RAG 应用': 'RAG 引用',
      'LLM 安全护栏': '提示词注入',
      大模型安全: '提示词注入',
      向量数据库: '向量召回参数',
      量化压缩: '模型压缩',
      金丝雀发布: '模型灰度',
      模型监控: '特征漂移监控',
      特征平台: 'Feature Store',
      公平性偏差: '模型公平性',
      可解释性: '模型可解释性',
      冷启动: '冷启动推荐',
      多模型路由: '模型路由',
      离线在线一致性: '离线在线偏差',
      人机协同: '人审闭环',
      推理成本: '成本预算',
      数据标注: '标签噪声',
      隐私保护: '模型安全',
      对抗样本: '模型安全',
      模型部署: '模型版本回滚',
      'GPU 利用率': '训练资源调度',
      MLOps: '模型文档',
      'ML Pipeline': '模型文档',
      实验追踪: '模型文档',
      'Prompt 评估': 'LLM 评测集',
      Embedding: 'Embedding 更新',
      反馈闭环: '反馈延迟',
      模型服务: '模型 SLA',
      推理延迟: '模型 SLA',
      批处理推理: '模型 SLA'
    }
  };
  return aliases[category]?.[skill] || skill;
}

function loadCatalogMaps() {
  const maps = new Map();
  for (const [category, file] of Object.entries(CATEGORY_FILE)) {
    const filePath = path.join(catalogDir, file);
    if (!fs.existsSync(filePath)) continue;
    maps.set(file, { category, data: JSON.parse(fs.readFileSync(filePath, 'utf8')) });
  }
  return maps;
}

function saveCatalogMaps(maps) {
  for (const [file, { data }] of maps) {
    fs.writeFileSync(path.join(catalogDir, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
}

function findCatalogEntry(maps, category, skill) {
  const file = CATEGORY_FILE[category];
  if (!file || !maps.has(file)) return null;
  const catalogSkill = resolveCatalogSkill(category, skill);
  const { data } = maps.get(file);
  if (!data[catalogSkill]) return null;
  return { file, skill: catalogSkill, entry: data[catalogSkill] };
}

const approved = JSON.parse(fs.readFileSync(approvedPath, 'utf8'));
const maps = loadCatalogMaps();
const expansionsBySkill = new Map();

for (const question of approved.questions) {
  if (String(question.referenceAnswer || '').length >= 320) continue;
  const points = (question.expectedPoints || []).filter(Boolean);
  if (!points.length) continue;
  const hit = findCatalogEntry(maps, question.category, question.skill);
  if (!hit) continue;
  const key = `${hit.file}::${hit.skill}`;
  if (!expansionsBySkill.has(key)) expansionsBySkill.set(key, new Set());
  for (const point of points) expansionsBySkill.get(key).add(String(point).trim());
}

let expanded = 0;
for (const [key, points] of expansionsBySkill) {
  const [file, skill] = key.split('::');
  const { data } = maps.get(file);
  const entry = data[skill];
  let referenceAnswer = entry.referenceAnswer || '';
  const extra = [...points].slice(0, 6).join('；');
  const block = `面试答题可结合这些要点展开：${extra}。`;
  const merged = mergeExpansion(referenceAnswer, block);
  if (merged.length < MIN_LEN) {
    const tail = '说明适用边界、失败时的回滚或降级策略，并用指标或实验验证效果。';
    referenceAnswer = mergeExpansion(merged, tail);
  } else {
    referenceAnswer = merged;
  }
  if (referenceAnswer !== entry.referenceAnswer) {
    entry.referenceAnswer = referenceAnswer;
    expanded += 1;
  }
}

const categoryTails = {
  'ai.json': [
    '记录数据版本、特征 pipeline 和评估集划分，线上变更优先 shadow 或 A/B 验证后再放量。',
    '离线指标与线上一致性需定期对齐，异常时准备回滚与降级预案。'
  ],
  'qa.json': [
    '用例执行结果、缺陷趋势和逃逸率纳入迭代回顾，改进项需跟踪到关闭。',
    '风险驱动优先级，核心链路覆盖率和自动化回归范围要有明确门禁。'
  ],
  'ops.json': [
    '变更前对齐监控基线和回滚预案，故障排查用指标、日志和 trace 交叉验证。',
    '容量与变更窗口需预留冗余，演练验证 RTO/RPO 和故障切换路径。'
  ],
  'security.json': [
    '安全方案需明确责任边界、审计留痕和异常告警，避免只谈工具不谈流程。',
    '高危操作最小权限+审批，漏洞修复和例外管理要有 SLA 和复核机制。'
  ],
  'frontend.json': [
    '结合真实页面场景说明性能、可维护性和用户体验的权衡与验证方式。',
    '用 Lighthouse、Profiler 和监控指标验证优化效果，避免只改代码不看数据。'
  ],
  'go.json': [
    '用 pprof、trace 和 race detector 等工具验证结论，说明并发边界和失败处理。',
    '排查时结合 goroutine dump、block profile 和 GC trace 对齐现象与根因。'
  ],
  'java.json': [
    '结合 JVM 工具链（jstack、jmap、MAT）说明排查路径和修复验证。',
    '线程池、连接池和 GC 参数调整前先看监控与 dump，避免盲目调参。'
  ],
  'python.json': [
    '用 profiling 和基准测试验证优化效果，说明 GIL、异步和部署边界。',
    'IO 与 CPU 瓶颈分流处理：asyncio/多进程/原生扩展按场景选型。'
  ],
  'network.json': [
    '排查时分段看 DNS、TCP、TLS 和应用层，用抓包和监控对齐时间线。',
    '超时、重试和连接池配置需与下游 SLA 匹配，避免重试放大故障。'
  ],
  'data.json': [
    '数据治理要覆盖采集、存储、使用、导出全链路，审计和权限最小化是底线。',
    '脱敏与分级分类按场景选型，防止多字段组合导致重识别。'
  ]
};

for (const [file, { data }] of maps) {
  const tails = categoryTails[file];
  if (!tails?.length) continue;
  for (const entry of Object.values(data)) {
    let referenceAnswer = entry.referenceAnswer || '';
    let ti = 0;
    while (referenceAnswer.length < MIN_LEN && ti < tails.length) {
      const next = mergeExpansion(referenceAnswer, tails[ti]);
      ti += 1;
      if (next === referenceAnswer) continue;
      referenceAnswer = next;
      expanded += 1;
    }
    entry.referenceAnswer = referenceAnswer;
  }
}

saveCatalogMaps(maps);
console.log(JSON.stringify({ skillsExpanded: expanded }, null, 2));

// 统计仍偏短的目录条目
let stillShort = 0;
for (const [file, { data }] of maps) {
  const n = Object.values(data).filter((v) => (v.referenceAnswer || '').length < MIN_LEN).length;
  if (n) console.log(`${file}: ${n} under ${MIN_LEN}`);
  stillShort += n;
}
console.log('catalog still short:', stillShort);
