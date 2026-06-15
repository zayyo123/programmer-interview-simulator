import { extractProfileSignals } from './profileAnalysis.js';

const FOCUS_TOPIC_RULES = [
  { topic: '单题薄弱点专项重练', categories: [], when: (s) => s.isQuestionDrill },
  { topic: '数据库索引与事务', categories: ['MySQL'], when: (s) => s.categories.includes('MySQL') || s.hasAny(['mysql', 'innodb', '慢查询', '事务隔离', '索引优化']) },
  { topic: 'SQL 代码题与查询表达', categories: ['MySQL'], when: (s) => s.hasAny(['sql题', '分组统计', '窗口函数', 'dense_rank']) },
  { topic: '缓存一致性与 Redis 排障', categories: ['Redis'], when: (s) => s.categories.includes('Redis') || s.hasAny(['redis', '缓存穿透', '缓存击穿', '分布式锁', '热key', '大key']) },
  { topic: 'JVM / Spring / Java 基础', categories: ['Java'], when: (s) => s.categories.includes('Java') || s.hasAny(['jvm', 'spring boot', 'springboot', 'mybatis']) },
  { topic: 'Go 并发与微服务治理', categories: ['Go'], when: (s) => s.categories.includes('Go') || s.hasAny(['golang', 'goroutine', 'gin框架', 'gin ']) },
  { topic: 'Python 服务与任务调度', categories: ['Python'], when: (s) => s.categories.includes('Python') || s.hasAny(['fastapi', 'django', 'flask', 'celery']) },
  { topic: '前端工程化与性能优化', categories: ['前端'], when: (s) => s.categories.includes('前端') || s.hasAny(['webpack', 'vite', '首屏', '白屏', '工程化']) },
  { topic: '前端 JS 手写代码题', categories: ['前端'], when: (s) => s.categories.includes('前端') && s.hasAny(['防抖', '节流', '数组扁平化', 'promise', '事件循环']) },
  { topic: '异步消息、幂等和补偿', categories: ['消息队列'], when: (s) => s.categories.includes('消息队列') || s.hasAny(['rabbitmq', 'rocketmq', 'kafka', '消息队列']) },
  { topic: '测试设计与自动化策略', categories: ['测试'], when: (s) => s.categories.includes('测试') },
  { topic: 'Linux / 网络 / 数据库运维排障', categories: ['运维'], when: (s) => s.categories.includes('运维') },
  { topic: 'DevOps 与稳定性治理', categories: ['DevOps'], when: (s) => s.categories.includes('DevOps') },
  { topic: '数据链路与数仓建模', categories: ['数据'], when: (s) => s.categories.includes('数据') },
  { topic: 'AI 建模与推理工程化', categories: ['AI'], when: (s) => s.categories.includes('AI') || s.hasAny(['rag', '大模型', '向量数据库', 'pytorch', 'transformer']) },
  { topic: '应用安全与漏洞防护', categories: ['安全'], when: (s) => s.categories.includes('安全') },
  { topic: '架构设计与技术治理', categories: ['架构'], when: (s) => s.categories.includes('架构') },
  { topic: '高并发场景设计', categories: ['系统设计'], when: (s) => s.categories.includes('系统设计') || s.hasAny(['高并发', '限流器', '接口幂等', '熔断降级', '秒杀']) },
  { topic: '算法复杂度与边界条件', categories: ['算法'], when: (s) => s.categories.includes('算法') || s.hasAny(['leetcode', '时间复杂度', '动态规划', '双指针']) }
];

const ALLOWED_FOCUS_TOPICS = new Set(FOCUS_TOPIC_RULES.map((item) => item.topic));

const ROLE_TOPIC_ALLOWLIST = {
  java: new Set(['单题薄弱点专项重练', 'JVM / Spring / Java 基础', '数据库索引与事务', 'SQL 代码题与查询表达', '缓存一致性与 Redis 排障', '异步消息、幂等和补偿', '高并发场景设计', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  backend: new Set(['单题薄弱点专项重练', 'JVM / Spring / Java 基础', '数据库索引与事务', 'SQL 代码题与查询表达', '缓存一致性与 Redis 排障', '异步消息、幂等和补偿', '高并发场景设计', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  go: new Set(['单题薄弱点专项重练', 'Go 并发与微服务治理', '数据库索引与事务', '缓存一致性与 Redis 排障', '异步消息、幂等和补偿', '高并发场景设计', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  python: new Set(['单题薄弱点专项重练', 'Python 服务与任务调度', '数据库索引与事务', '缓存一致性与 Redis 排障', '异步消息、幂等和补偿', '高并发场景设计', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  fullstack: new Set(['单题薄弱点专项重练', '前端工程化与性能优化', '前端 JS 手写代码题', 'JVM / Spring / Java 基础', '数据库索引与事务', '缓存一致性与 Redis 排障', '高并发场景设计', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  frontend: new Set(['单题薄弱点专项重练', '前端工程化与性能优化', '前端 JS 手写代码题', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  qa: new Set(['单题薄弱点专项重练', '测试设计与自动化策略', '数据库索引与事务', '缓存一致性与 Redis 排障', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  ops: new Set(['单题薄弱点专项重练', 'Linux / 网络 / 数据库运维排障', '数据库索引与事务', '缓存一致性与 Redis 排障', 'DevOps 与稳定性治理', '基础八股题', '项目表达']),
  devops: new Set(['单题薄弱点专项重练', 'DevOps 与稳定性治理', 'Linux / 网络 / 数据库运维排障', '高并发场景设计', '基础八股题', '项目表达']),
  data: new Set(['单题薄弱点专项重练', '数据链路与数仓建模', 'SQL 代码题与查询表达', '数据库索引与事务', '算法复杂度与边界条件', '基础八股题', '项目表达']),
  ai: new Set(['单题薄弱点专项重练', 'AI 建模与推理工程化', '算法复杂度与边界条件', '高并发场景设计', '基础八股题', '项目表达']),
  security: new Set(['单题薄弱点专项重练', '应用安全与漏洞防护', '数据库索引与事务', '高并发场景设计', '基础八股题', '项目表达']),
  architect: new Set(['单题薄弱点专项重练', '架构设计与技术治理', '高并发场景设计', '缓存一致性与 Redis 排障', '异步消息、幂等和补偿', '基础八股题', '项目表达'])
};

const CAPABILITY_RULES = [
  { text: '需要把本题按可通过标准重答，并接受同类定点追问。', when: (s) => s.isQuestionDrill },
  { text: '需要讲清个人职责、关键判断和落地结果。', when: (s) => s.hasAny(['负责', '主导', '设计', '落地']) },
  { text: '需要准备性能定位、指标变化和优化取舍。', when: (s) => s.hasAny(['优化', '性能', '慢查询', '延迟', 'qps', '耗时']) },
  { text: '需要准备线上问题排查顺序和止血方案。', when: (s) => s.hasAny(['排查', '故障', '线上', '事故', '白屏']) },
  { text: '需要准备一致性、幂等、重试、限流和缓存保护链路。', when: (s) => s.categories.includes('系统设计') || s.hasAny(['幂等', '缓存穿透', '限流', '分布式事务']) },
  { text: '需要准备测试策略、自动化分层和质量门禁。', when: (s) => s.categories.includes('测试') },
  { text: '需要准备故障排查顺序、容量评估和稳定性基线。', when: (s) => s.categories.includes('运维') },
  { text: '需要准备发布流水线、可观测性和故障恢复机制。', when: (s) => s.categories.includes('DevOps') },
  { text: '需要准备口径一致性、调度依赖和数据质量控制。', when: (s) => s.categories.includes('数据') },
  { text: '需要准备模型效果评估、数据质量和推理成本控制。', when: (s) => s.categories.includes('AI') },
  { text: '需要准备漏洞原理、修复方案和安全基线。', when: (s) => s.categories.includes('安全') },
  { text: '需要准备架构取舍、演进路径和团队协作治理。', when: (s) => s.categories.includes('架构') },
  { text: '需要说明沟通协作边界和推进结果。', when: (s) => s.hasAny(['协作', '跨团队', '推进']) }
];

const RISK_RULES = [
  { text: '本题曾暴露要点缺口或表达不稳，下一轮会先检查是否真正补齐。', when: (s) => s.isQuestionDrill },
  { text: '技术关键词偏少，面试可能只能按通用题推进，建议补充具体技术栈。', when: (s) => s.terms.length < 2 && s.categories.length < 2 },
  { text: '个人贡献信号不足，项目题容易被追问“你具体做了什么”。', when: (s) => !s.hasAny(['负责', '主导', '我做', '我设计', '我实现']) },
  { text: '结果证据不足，建议补充上线效果或量化变化。', when: (s) => !s.hasAny(['提升', '降低', '减少', 'qps', '耗时', '成功率', '%', '指标']) },
  { text: '描述偏简历关键词，缺少真实场景，容易被追问落地细节。', when: (s) => s.hasAny(['熟悉', '了解']) && !s.hasAny(['项目', '落地', '线上', '生产']) }
];

function scoreFocusTopic(topic, categories, role) {
  const rule = FOCUS_TOPIC_RULES.find((item) => item.topic === topic);
  if (!rule) return 0;

  let score = 0;
  const detected = new Set(categories);

  for (const category of rule.categories) {
    if (detected.has(category)) score += 3;
  }

  if (topic.includes('单题薄弱点')) return 100;
  if (role === 'frontend' && topic.includes('前端')) score += 2;
  if (['java', 'backend'].includes(role) && (topic.includes('Java') || topic.includes('MySQL') || topic.includes('Redis') || topic.includes('消息'))) score += 2;
  if (role === 'go' && topic.includes('Go')) score += 2;
  if (role === 'python' && topic.includes('Python')) score += 2;
  if (role === 'fullstack' && (topic.includes('前端') || topic.includes('Java') || topic.includes('MySQL'))) score += 1;

  return score;
}

function finalizeFocusTopics(topics, role, categories) {
  const allowlist = ROLE_TOPIC_ALLOWLIST[role];
  const filtered = allowlist
    ? topics.filter((topic) => allowlist.has(topic))
    : topics;

  const ranked = [...new Set(filtered)]
    .map((topic) => ({ topic, score: scoreFocusTopic(topic, categories, role) }))
    .sort((left, right) => right.score - left.score || filtered.indexOf(left.topic) - filtered.indexOf(right.topic));

  const confident = ranked.filter((item) => item.score > 0);
  const picked = (confident.length ? confident : ranked).map((item) => item.topic);

  return picked.slice(0, 5);
}

function normalizeStringList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item || '').trim()).filter(Boolean))];
}

export function sanitizeStructuredFocusTopics(topics, localFocusTopics, role, categories) {
  const fromLlm = normalizeStringList(topics).filter((topic) => ALLOWED_FOCUS_TOPICS.has(topic));
  const merged = fromLlm.length >= 2
    ? fromLlm
    : [...new Set([...fromLlm, ...normalizeStringList(localFocusTopics)])];

  return finalizeFocusTopics(merged, role, categories);
}

export function buildLocalProfileAnalysis(text, role = '') {
  const signals = extractProfileSignals(text, { role });
  const source = signals.source;

  if (!source) {
    return {
      hasInput: false,
      mode: '快速练习',
      analyzer: 'local',
      confidence: 0,
      keywords: [],
      terms: [],
      categories: [],
      focusTopics: [],
      capabilities: [],
      risks: [],
      recommendedTracks: [],
      riskQuestionMappings: []
    };
  }

  const rawFocusTopics = FOCUS_TOPIC_RULES
    .filter((rule) => rule.when(signals))
    .map((rule) => rule.topic);

  const capabilities = CAPABILITY_RULES
    .filter((rule) => rule.when(signals))
    .map((rule) => rule.text);

  const risks = RISK_RULES
    .filter((rule) => rule.when(signals))
    .map((rule) => rule.text);

  const keywords = signals.keywords.length ? signals.keywords : ['通用技术面'];
  const normalizedFocusTopics = finalizeFocusTopics(rawFocusTopics, role, signals.categories);
  const focusTopics = normalizedFocusTopics.length ? normalizedFocusTopics : ['基础八股题', '项目表达'];
  const normalizedCapabilities = capabilities.length
    ? capabilities
    : ['先按岗位方向考察基础知识、项目表达和追问承压。'];
  const normalizedRisks = risks.length
    ? risks
    : ['当前背景信息较完整，面试会优先验证技术细节和真实落地。'];

  const recommendedTracks = createRecommendedTracks({
    keywords,
    terms: signals.terms,
    categories: signals.categories,
    focusTopics,
    hasProjectRisk: normalizedRisks.some((item) => item.includes('个人贡献')),
    hasMetricsRisk: normalizedRisks.some((item) => item.includes('结果证据'))
  });

  return {
    hasInput: true,
    role,
    mode: source.length >= 80 ? '定制练习' : '轻量定制',
    analyzer: 'local',
    confidence: signals.confidence,
    isQuestionDrill: signals.isQuestionDrill,
    keywords,
    terms: signals.terms,
    categories: signals.categories,
    focusTopics,
    capabilities: normalizedCapabilities,
    risks: normalizedRisks,
    riskQuestionMappings: createRiskQuestionMappings(normalizedRisks, focusTopics),
    recommendedTracks
  };
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

export function createSerializableProfileAnalysis(text, role = '') {
  const analysis = buildLocalProfileAnalysis(text, role);
  if (!analysis.hasInput) return null;

  return {
    role: role || analysis.role || '',
    analyzer: analysis.analyzer || 'local',
    confidence: analysis.confidence ?? 0,
    isQuestionDrill: analysis.isQuestionDrill,
    terms: analysis.terms || [],
    categories: analysis.categories || [],
    keywords: analysis.keywords || [],
    focusTopics: analysis.focusTopics || [],
    capabilities: analysis.capabilities || [],
    risks: analysis.risks || [],
    riskQuestionMappings: analysis.riskQuestionMappings || [],
    recommendedTracks: analysis.recommendedTracks || []
  };
}
