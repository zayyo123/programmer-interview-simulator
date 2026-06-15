import {
  extractProfileSignals,
  sanitizeStructuredCategories,
  sanitizeStructuredTerms
} from '../shared/profileAnalysis.js';
import {
  buildLocalProfileAnalysis,
  createSerializableProfileAnalysis,
  sanitizeStructuredFocusTopics
} from '../shared/profileAnalyzeLocal.js';
import { extractStructuredProfile } from './ai.js';

export { buildLocalProfileAnalysis, createSerializableProfileAnalysis };

export async function analyzeProfile({ config, text, role = '' }) {
  const local = buildLocalProfileAnalysis(text, role);
  if (!local.hasInput) return local;

  const structured = await extractStructuredProfile({ config, text, role });
  if (!structured || structured.confidence < 0.65) {
    return local;
  }

  return mergeStructuredProfile(local, structured, text, role);
}

function mergeStructuredProfile(local, structured, text, role) {
  const { source, normalized } = extractProfileSignals(text, { role });
  const llmTerms = sanitizeStructuredTerms(structured.terms, source, normalized);
  const llmCategories = sanitizeStructuredCategories(structured.categories, source, normalized, role);

  const terms = llmTerms.length ? llmTerms : local.terms;
  const categories = llmCategories.length ? llmCategories : local.categories;
  const keywords = [...new Set([...terms, ...categories])].slice(0, 10);

  const focusTopics = sanitizeStructuredFocusTopics(
    structured.focusTopics,
    local.focusTopics,
    role,
    categories
  );
  const capabilities = pickMergedStringList(structured.capabilities, local.capabilities, 5);
  const risks = pickMergedStringList(structured.risks, local.risks, 4);
  const confidence = Math.max(local.confidence, structured.confidence);

  const recommendedTracks = createRecommendedTracks({
    keywords,
    terms,
    categories,
    focusTopics,
    hasProjectRisk: risks.some((item) => item.includes('个人贡献')),
    hasMetricsRisk: risks.some((item) => item.includes('结果证据'))
  });

  return {
    ...local,
    role,
    analyzer: llmTerms.length || llmCategories.length ? 'hybrid' : 'llm',
    confidence,
    terms,
    categories,
    keywords: keywords.length ? keywords : local.keywords,
    focusTopics,
    capabilities,
    risks,
    riskQuestionMappings: createRiskQuestionMappings(risks, focusTopics),
    recommendedTracks: recommendedTracks.length ? recommendedTracks : local.recommendedTracks
  };
}

function pickMergedStringList(preferred, fallback, limit) {
  const primary = normalizeStringList(preferred);
  if (primary.length >= 2) return primary.slice(0, limit);
  if (primary.length === 1) {
    return [...new Set([...primary, ...normalizeStringList(fallback)])].slice(0, limit);
  }
  return normalizeStringList(fallback).slice(0, limit);
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item || '').trim()).filter(Boolean))];
}

function createRiskQuestionMappings(risks, focusTopics) {
  const source = [...(risks || []), ...(focusTopics || [])].join(' ');
  const mappings = [
    { match: /单题薄弱点|本题曾暴露|重练本题/, risk: '本题薄弱点未补齐', questionType: '同类基础题 + 定点追问 + 本题复盘' },
    { match: /技术关键词偏少|基础八股|通用题/, risk: '技术栈不够明确', questionType: '基础八股题 + 广度追问' },
    { match: /个人贡献|项目表达/, risk: '个人职责不够清楚', questionType: '项目经历题 + 个人职责追问' },
    { match: /结果证据|指标|上线效果|量化/, risk: '结果证据不足', questionType: '项目复盘题 + 指标结果追问' },
    { match: /真实场景|落地细节|线上|排查/, risk: '落地细节不足', questionType: '线上排查题 + 场景追问' },
    { match: /高并发|一致性|幂等|限流|缓存穿透|补偿/, risk: '高并发链路风险', questionType: '后端场景题 + 代码/伪代码题' },
    { match: /前端 JS|算法复杂度|代码题/, risk: '代码表达风险', questionType: '轻量代码题 + 边界复杂度追问' }
  ];

  return mappings
    .filter((item) => item.match.test(source))
    .map(({ risk, questionType }) => ({ risk, questionType }))
    .slice(0, 4);
}

function createRecommendedTracks({ keywords, terms, categories, focusTopics, hasProjectRisk, hasMetricsRisk }) {
  const tracks = [];
  const labels = new Set([...keywords, ...terms, ...categories]);

  const hasLabel = (value) => labels.has(value) || keywords.includes(value);
  const hasCategory = (value) => categories.includes(value);
  const hasFocus = (fragment) => focusTopics.some((item) => item.includes(fragment));

  if (hasFocus('单题薄弱点')) tracks.push('单题专项：同类基础题、定点追问、项目化表达和本题复盘。');
  if (hasLabel('MySQL') || hasCategory('MySQL')) tracks.push('MySQL 索引、事务、慢查询定位。');
  if (hasFocus('SQL 代码题')) tracks.push('SQL题：分组统计、窗口函数、索引性能。');
  if (hasLabel('Redis') || hasCategory('Redis')) tracks.push('Redis 缓存一致性、热 key、大 key 和延迟排查。');
  if (hasCategory('Java')) tracks.push('Java 集合、JVM、线程池和 Spring 事务边界。');
  if (hasCategory('前端')) tracks.push('前端首屏性能、状态管理、组件抽象和线上白屏排查。');
  if (hasFocus('前端 JS') || hasCategory('前端')) {
    tracks.push('前端代码题：防抖节流、Promise、数组扁平化。');
  } else if (hasCategory('算法')) {
    tracks.push('算法题：复杂度、边界条件和数据结构选择。');
  }
  if (hasCategory('Go')) tracks.push('Go goroutine 协作、context 超时取消和限流背压。');
  if (hasCategory('Python')) tracks.push('Python worker、任务队列、GIL 与性能排查。');
  if (hasCategory('测试')) tracks.push('测试岗：测试用例设计、自动化框架、回归策略和质量门禁。');
  if (hasCategory('运维')) tracks.push('运维岗：Linux 排障、网络诊断、数据库备份恢复和监控告警。');
  if (hasCategory('DevOps')) tracks.push('DevOps/SRE：CI/CD、K8s 发布、可观测性、容量和故障演练。');
  if (hasCategory('数据')) tracks.push('数据岗：ETL 稳定性、数仓分层、指标口径和数据质量。');
  if (hasCategory('AI')) tracks.push('AI 岗：模型训练、评估指标、特征/向量检索和推理部署。');
  if (hasCategory('安全')) tracks.push('安全岗：常见漏洞原理、修复验证、权限模型和纵深防御。');
  if (hasCategory('架构')) tracks.push('架构/管理岗：高可用架构、容量规划、技术债治理和团队决策。');
  if (hasFocus('高并发')) tracks.push('高并发场景题：限流、幂等、补偿和降级。');
  if (hasFocus('高并发') || hasCategory('系统设计')) tracks.push('后端场景题：限流器、接口幂等、缓存穿透处理。');
  if (hasProjectRisk) tracks.push('项目经历题：按背景、职责、动作、结果重构回答。');
  if (hasMetricsRisk) tracks.push('结果复盘题：准备指标、上线效果和改进空间。');

  return [...new Set(tracks)].slice(0, 6);
}
