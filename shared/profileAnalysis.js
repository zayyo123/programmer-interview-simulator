const CATEGORY_RULES = [
  { label: 'Java', tokens: ['java', 'spring boot', 'springboot', 'spring', 'jvm', 'mybatis', 'maven', 'gradle'] },
  { label: 'Go', tokens: ['golang', 'goroutine', 'gin框架', 'gin ', 'go语言', 'grpc'] },
  { label: 'Python', tokens: ['python', 'django', 'flask', 'fastapi', 'celery', 'pandas', 'numpy'] },
  { label: '前端', tokens: ['前端', 'frontend', 'react', 'vue3', 'vue 3', 'vue2', 'vue 2', 'angular', 'webpack', 'vite', 'typescript', 'javascript', 'next.js', 'nuxt', 'pinia', 'vuex', 'echarts', 'element plus', 'tailwind'] },
  { label: 'MySQL', tokens: ['mysql', 'innodb', '慢查询', '主从', '索引优化', '事务隔离', '窗口函数'] },
  { label: 'Redis', tokens: ['redis', '缓存穿透', '缓存击穿', '热key', '大key', '分布式锁'] },
  { label: '消息队列', tokens: ['消息队列', 'rabbitmq', 'rocketmq', 'kafka', 'pulsar'] },
  { label: '微服务', tokens: ['微服务', 'dubbo', 'grpc', '服务治理', '注册中心', '配置中心', '链路追踪'] },
  { label: '测试', tokens: ['测试开发', '自动化测试', '接口测试', '性能测试', '回归测试', 'qa工程师', '测试工程师', 'selenium', 'playwright', 'jmeter'] },
  { label: '运维', tokens: ['运维工程师', 'dba', 'linux运维', 'shell脚本', '网络排障', '数据库备份', '主从切换', '巡检', 'prometheus', 'grafana', 'zabbix'] },
  { label: 'DevOps', tokens: ['devops', 'sre', 'ci/cd', 'jenkins', 'gitlab ci', 'gitlab-ci', 'argo', 'helm', 'terraform', 'ansible'] },
  { label: '数据', tokens: ['数据开发', '数据仓库', '数仓', 'etl', 'hive', 'spark', 'flink', 'airflow', '数据治理', '维度建模'] },
  { label: 'AI', tokens: ['人工智能', '机器学习', '深度学习', '大模型', 'llm', 'aigc', '向量数据库', '特征工程', '模型部署', 'pytorch', 'tensorflow', 'transformer'] },
  { label: '安全', tokens: ['安全工程师', '渗透测试', '漏洞挖掘', 'xss', 'sql注入', 'csrf', '越权', 'waf', '安全加固', 'devsecops'] },
  { label: '架构', tokens: ['架构师', '技术经理', '研发经理', '技术总监', '技术治理', '容灾', '高可用', '架构演进', '技术方案评审'] },
  { label: '算法', tokens: ['leetcode', '时间复杂度', '空间复杂度', '动态规划', '二叉树', '链表', '回溯', '双指针', '滑动窗口'] },
  { label: '系统设计', tokens: ['系统设计', '高并发', '秒杀', '限流器', '接口幂等', '熔断降级', '削峰填谷', '分布式事务', '异地多活'] }
];

const TECH_TERM_RULES = [
  { label: 'Spring Boot', patterns: ['spring boot', 'springboot'] },
  { label: 'TypeScript', patterns: ['typescript'] },
  { label: 'JavaScript', patterns: ['javascript'] },
  { label: 'Vue 3', patterns: ['vue3', 'vue 3'] },
  { label: 'Vue 2', patterns: ['vue2', 'vue 2'] },
  { label: 'React', patterns: ['react'] },
  { label: 'Next.js', patterns: ['next.js', 'nextjs'] },
  { label: 'Nuxt', patterns: ['nuxt'] },
  { label: 'Webpack', patterns: ['webpack'] },
  { label: 'Vite', patterns: ['vite'] },
  { label: 'Pinia', patterns: ['pinia'] },
  { label: 'Vuex', patterns: ['vuex'] },
  { label: 'ECharts', patterns: ['echarts'] },
  { label: 'Element Plus', patterns: ['element plus', 'element-plus'] },
  { label: 'Tailwind CSS', patterns: ['tailwind'] },
  { label: 'Node.js', patterns: ['node.js', 'nodejs'] },
  { label: 'MyBatis', patterns: ['mybatis'] },
  { label: 'Goroutine', patterns: ['goroutine'] },
  { label: 'Gin', patterns: ['gin框架', 'gin '] },
  { label: 'FastAPI', patterns: ['fastapi'] },
  { label: 'Celery', patterns: ['celery'] },
  { label: 'RocketMQ', patterns: ['rocketmq'] },
  { label: 'RabbitMQ', patterns: ['rabbitmq'] },
  { label: 'Kafka', patterns: ['kafka'] },
  { label: 'Kubernetes', patterns: ['kubernetes', 'k8s'] },
  { label: 'Docker', patterns: ['docker'] },
  { label: 'Jenkins', patterns: ['jenkins'] },
  { label: 'GitLab CI', patterns: ['gitlab ci', 'gitlab-ci'] },
  { label: 'Prometheus', patterns: ['prometheus'] },
  { label: 'Grafana', patterns: ['grafana'] },
  { label: 'Hive', patterns: ['hive'] },
  { label: 'Spark', patterns: ['spark'] },
  { label: 'Flink', patterns: ['flink'] },
  { label: 'Airflow', patterns: ['airflow'] },
  { label: 'Redis', patterns: ['redis'] },
  { label: 'MySQL', patterns: ['mysql'] },
  { label: 'InnoDB', patterns: ['innodb'] },
  { label: 'Nginx', patterns: ['nginx'] },
  { label: 'Linux', patterns: ['linux'] },
  { label: 'JVM', patterns: ['jvm'] },
  { label: 'RAG', patterns: ['rag'] },
  { label: 'LLM', patterns: ['llm', '大模型'] },
  { label: 'PyTorch', patterns: ['pytorch'] },
  { label: 'TensorFlow', patterns: ['tensorflow'] }
];

const ALLOWED_CATEGORIES = new Set(CATEGORY_RULES.map((item) => item.label));

const ROLE_CATEGORY_PRIORS = {
  java: ['Java', 'MySQL', 'Redis', '微服务', '消息队列'],
  backend: ['Java', 'MySQL', 'Redis', '微服务', '系统设计'],
  go: ['Go', '微服务', 'Redis', 'MySQL', '消息队列'],
  python: ['Python', 'MySQL', 'Redis', '微服务', '消息队列'],
  frontend: ['前端'],
  fullstack: ['前端', 'Java', 'MySQL', 'Redis'],
  qa: ['测试'],
  ops: ['运维'],
  devops: ['DevOps'],
  data: ['数据'],
  ai: ['AI'],
  security: ['安全'],
  architect: ['架构', '系统设计']
};

const TOKEN_FALSE_POSITIVE_BLOCKLIST = {
  react: ['reactive', 'reaction', 'reactivity'],
  rag: ['coverage', 'encourage'],
  spark: ['sparkle']
};

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeProfileText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\u3000/g, ' ')
    .replace(/\s+/g, ' ');
}

function isChineseToken(token) {
  return /[\u4e00-\u9fff]/.test(token);
}

export function tokenMatches(normalized, token) {
  const needle = String(token || '').toLowerCase().trim();
  if (!needle) return false;

  const blockers = TOKEN_FALSE_POSITIVE_BLOCKLIST[needle];
  if (blockers?.some((item) => normalized.includes(item))) {
    return false;
  }

  if (isChineseToken(needle)) {
    return normalized.includes(needle);
  }

  const padded = ` ${normalized} `;
  const re = new RegExp(`(?:^|[^a-z0-9_./+#-])${escapeRegExp(needle)}(?:$|[^a-z0-9_./+#-])`, 'i');
  return re.test(padded);
}

function scoreCategory(rule, normalized) {
  let score = 0;
  let strongHits = 0;

  for (const token of rule.tokens) {
    if (!tokenMatches(normalized, token)) continue;
    score += 1;
    if (token.length >= 4 || isChineseToken(token)) {
      strongHits += 1;
    }
  }

  return { score, strongHits };
}

function extractMatchedTerms(normalized) {
  const matched = [];

  for (const rule of TECH_TERM_RULES) {
    const hit = rule.patterns.some((pattern) => tokenMatches(normalized, pattern));
    if (hit) matched.push(rule.label);
  }

  return [...new Set(matched)].slice(0, 8);
}

function extractMatchedCategories(normalized, role = '') {
  const priors = new Set(ROLE_CATEGORY_PRIORS[role] || []);
  const results = [];

  for (const rule of CATEGORY_RULES) {
    const { score, strongHits } = scoreCategory(rule, normalized);
    const isPrior = priors.has(rule.label);
    const accepted = (score >= 2 && strongHits >= 1) || (isPrior && score >= 1 && strongHits >= 1);
    if (!accepted) continue;
    results.push({ label: rule.label, score: score + (isPrior ? 0.5 : 0) });
  }

  return results
    .sort((left, right) => right.score - left.score)
    .map((item) => item.label)
    .slice(0, 4);
}

function resolveKeywordDisplay(terms, categories) {
  const merged = [];
  const seen = new Set();

  for (const item of [...terms, ...categories]) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged.slice(0, 10);
}

export function termSupportedBySource(term, source, normalized = normalizeProfileText(source)) {
  const label = String(term || '').trim();
  if (!label) return false;

  const rule = TECH_TERM_RULES.find((item) => item.label.toLowerCase() === label.toLowerCase());
  if (rule) {
    return rule.patterns.some((pattern) => tokenMatches(normalized, pattern));
  }

  if (ALLOWED_CATEGORIES.has(label)) {
    const categoryRule = CATEGORY_RULES.find((item) => item.label === label);
    return categoryRule?.tokens.some((token) => tokenMatches(normalized, token)) || false;
  }

  const compact = label.toLowerCase().replace(/\s+/g, '');
  if (compact.length >= 3 && normalized.includes(compact)) return true;
  return tokenMatches(normalized, label);
}

export function sanitizeStructuredTerms(terms, source, normalized) {
  return [...new Set((Array.isArray(terms) ? terms : []).map((item) => String(item || '').trim()).filter(Boolean))]
    .filter((term) => termSupportedBySource(term, source, normalized))
    .slice(0, 8);
}

export function sanitizeStructuredCategories(categories, source, normalized, role = '') {
  const localCategories = extractMatchedCategories(normalized, role);
  const localSet = new Set(localCategories);

  return [...new Set((Array.isArray(categories) ? categories : []).map((item) => String(item || '').trim()).filter(Boolean))]
    .filter((label) => ALLOWED_CATEGORIES.has(label))
    .filter((label) => localSet.has(label) || CATEGORY_RULES.find((rule) => rule.label === label)?.tokens.some((token) => tokenMatches(normalized, token)))
    .slice(0, 4);
}

export function extractProfileSignals(text, options = {}) {
  const source = String(text || '').trim();
  const normalized = normalizeProfileText(source);
  const role = String(options.role || '').trim();
  const isQuestionDrill = /报告单题重练|本题薄弱点|单题专项重练|原题：|优先补齐要点/.test(source);

  const terms = extractMatchedTerms(normalized);
  const categories = extractMatchedCategories(normalized, role);
  const keywords = resolveKeywordDisplay(terms, categories);
  const confidence = terms.length
    ? Math.min(0.95, 0.45 + terms.length * 0.08 + categories.length * 0.05)
    : categories.length
      ? Math.min(0.75, 0.35 + categories.length * 0.1)
      : 0.2;

  const hasAny = (tokens) => tokens.some((token) => tokenMatches(normalized, token));

  return {
    source,
    normalized,
    role,
    isQuestionDrill,
    terms,
    categories,
    keywords,
    confidence,
    hasAny
  };
}
