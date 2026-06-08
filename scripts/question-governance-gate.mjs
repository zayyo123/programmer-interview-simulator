import { loadRuntimeQuestionBank } from '../src/questionGovernance.js';

const TEMPLATE_REPEAT_THRESHOLD = 8;
const TEMPLATE_PHRASE_LENGTH = 32;
const TEMPLATE_PHRASE_STEP = 12;
const SAMPLE_LIMIT = 20;

const legacyTemplateSourcePatterns = [
  /^internal-curated-/i
];

const legacySemanticSourcePatterns = [
  /^built-in$/i,
  /^manual-curated$/i,
  /^internal-curated-/i,
  /Interview Questions/i,
  /JavaGuide/i,
  /Stack Overflow/i,
  /JavaScript Questions/i,
  /FAQGURU/i
];

const semanticProfiles = {
  qa: {
    label: '测试',
    categories: ['测试'],
    signals: ['测试', '用例', '断言', '覆盖', '边界', '自动化', '回归', '缺陷', '质量', 'Mock', '压测', '性能']
  },
  ops: {
    label: '运维',
    categories: ['运维'],
    signals: ['监控', '告警', '故障', '容量', 'CPU', '内存', '磁盘', '网络', '日志', 'Linux', 'Kubernetes', 'Pod', '节点', '恢复']
  },
  devops: {
    label: 'DevOps/SRE',
    categories: ['DevOps'],
    signals: ['CI', 'CD', '流水线', '发布', '回滚', '灰度', '制品', '门禁', 'SLO', 'Trace', '告警', 'Kubernetes']
  },
  data: {
    label: '数据',
    categories: ['数据'],
    signals: ['数据', 'SQL', '数仓', 'ETL', '指标', '口径', '血缘', '分区', '质量', '调度', '离线', '实时']
  },
  ai: {
    label: 'AI',
    categories: ['AI'],
    signals: ['数据', '模型', '训练', '推理', '评估', '特征', 'A/B', '漂移', 'Embedding', '向量', 'RAG', '召回']
  },
  security: {
    label: '安全',
    categories: ['安全'],
    signals: ['漏洞', '权限', '认证', '授权', '注入', 'XSS', 'CSRF', '加密', '审计', '渗透', '越权', '威胁', '供应链', 'SBOM', '依赖', '签名', '制品']
  },
  architect: {
    label: '架构/技术管理',
    categories: ['系统设计'],
    signals: ['架构', '系统', '容量', '一致性', '可用性', '扩展', '降级', '限流', '熔断', '取舍', 'RTO', 'RPO']
  },
  frontend: {
    label: '前端',
    categories: ['前端'],
    signals: ['前端', '页面', '浏览器', 'React', 'Vue', '组件', '渲染', '白屏', 'JS', 'CSS', 'Android', 'iOS', '跨端', '鸿蒙']
  },
  android: {
    label: 'Android',
    categories: ['Android'],
    signals: ['Android', 'ANR', '主线程', 'Binder', 'Trace', 'Activity', 'Service', '启动', '权限', '线程']
  },
  ios: {
    label: 'iOS',
    categories: ['iOS'],
    signals: ['iOS', '启动', 'dyld', 'Instruments', 'MetricKit', 'Swift', 'Objective-C', '首页', '渲染', '主线程']
  },
  cross: {
    label: '跨端/鸿蒙',
    categories: ['跨端/鸿蒙'],
    signals: ['跨端', '鸿蒙', '小程序', 'App', 'Web', '多端', '状态', '接口', '灰度', '版本']
  },
  java: {
    label: 'Java',
    categories: ['Java'],
    signals: ['Java', 'JVM', 'Spring', '线程', 'GC', '事务', 'Bean', 'HashMap', 'CompletableFuture', '锁']
  },
  go: {
    label: 'Go',
    categories: ['Go'],
    signals: ['Go', 'goroutine', 'channel', 'context', 'pprof', 'defer', 'GMP', 'map', 'interface', 'race']
  },
  python: {
    label: 'Python',
    categories: ['Python'],
    signals: ['Python', 'GIL', 'asyncio', 'Celery', 'Django', 'FastAPI', '生成器', '装饰器', '协程', 'pandas']
  },
  mysql: {
    label: 'MySQL',
    categories: ['MySQL'],
    signals: ['MySQL', 'InnoDB', '索引', '事务', '锁', '死锁', 'Explain', 'binlog', 'MVCC', 'SQL']
  },
  redis: {
    label: 'Redis',
    categories: ['Redis'],
    signals: ['Redis', '缓存', 'key', '过期', '命中率', '持久化', '内存', 'Lua', '热点', '击穿']
  },
  kafka: {
    label: 'Kafka',
    categories: ['Kafka'],
    signals: ['Kafka', 'topic', 'partition', 'consumer', 'producer', 'offset', 'lag', 'rebalance', '消息', '死信']
  },
  network: {
    label: '网络',
    categories: ['网络'],
    signals: ['DNS', 'TCP', 'TLS', 'HTTP', '连接', '重传', '握手', 'TIME_WAIT', '网关', '负载均衡']
  },
  php: {
    label: 'PHP',
    categories: ['PHP'],
    signals: ['PHP', 'FPM', 'OPcache', 'Composer', 'nginx', 'slowlog', 'worker', 'autoload']
  },
  cpp: {
    label: 'C/C++',
    categories: ['C/C++'],
    signals: ['C++', 'core', 'gdb', 'ASan', 'TSan', '指针', '内存', '越界', '竞态', '迭代器']
  },
  dotnet: {
    label: 'C#/.NET',
    categories: ['C#/.NET'],
    signals: ['.NET', 'C#', 'ThreadPool', 'async', 'Task', 'GC', 'dotnet', '连接池']
  },
  node: {
    label: 'Node.js',
    categories: ['Node.js'],
    signals: ['Node', 'event loop', 'GC', 'heap', 'Promise', 'JSON', 'worker_threads', '异步']
  }
};

const questionBank = await loadRuntimeQuestionBank();
const templateFailures = findTemplateFailures(questionBank);
const semanticFailures = findSemanticFailures(questionBank);

if (templateFailures.length || semanticFailures.length) {
  if (templateFailures.length) {
    console.error(`反模板化门禁失败：发现 ${templateFailures.length} 个重复答案片段超过阈值 ${TEMPLATE_REPEAT_THRESHOLD}。`);
    for (const item of templateFailures.slice(0, SAMPLE_LIMIT)) {
      console.error(`- 重复 ${item.questionCount} 道题：${item.phrase}`);
      console.error(`  样例：${item.ids.slice(0, 6).join('、')}`);
    }
  }

  if (semanticFailures.length) {
    console.error(`题目语义门禁失败：发现 ${semanticFailures.length} 道题缺少岗位/方向必要技术信号。`);
    for (const item of semanticFailures.slice(0, SAMPLE_LIMIT)) {
      console.error(`- ${item.id} (${item.category}/${item.domainLabel})：命中 ${item.hitCount}/${item.requiredHits}，需要包含：${item.expectedSignals.join('、')}`);
    }
  }

  process.exit(1);
}

console.log(
  `题库治理门禁通过：反模板化检查覆盖 ${countStrictTemplateQuestions(questionBank)} 道非历史模板题，语义审核覆盖 ${countSemanticQuestions(questionBank)} 道题。`
);

function findTemplateFailures(items) {
  const phraseMap = new Map();

  for (const question of items) {
    if (isLegacyTemplateQuestion(question)) continue;
    for (const field of ['referenceAnswer', 'excellentAnswer']) {
      const text = clean(question[field]);
      for (const phrase of createPhrases(text)) {
        if (!phraseMap.has(phrase)) phraseMap.set(phrase, new Set());
        phraseMap.get(phrase).add(question.id);
      }
    }
  }

  return [...phraseMap.entries()]
    .map(([phrase, ids]) => ({ phrase, ids: [...ids], questionCount: ids.size }))
    .filter((item) => item.questionCount > TEMPLATE_REPEAT_THRESHOLD)
    .sort((left, right) => right.questionCount - left.questionCount || left.phrase.localeCompare(right.phrase, 'zh-Hans-CN'));
}

function findSemanticFailures(items) {
  const failures = [];

  for (const question of items) {
    if (isLegacySemanticQuestion(question)) continue;
    const domains = getSemanticDomains(question);
    if (!domains.length) continue;

    const text = createSemanticText(question);
    for (const domain of domains) {
      const profile = semanticProfiles[domain];
      const hitCount = profile.signals.filter((signal) => includesSignal(text, signal)).length;
      const requiredHits = getRequiredSignalCount(question, domain);
      if (hitCount < requiredHits) {
        failures.push({
          id: question.id,
          category: question.category,
          domain,
          domainLabel: profile.label,
          hitCount,
          requiredHits,
          expectedSignals: profile.signals.slice(0, 10)
        });
      }
    }
  }

  return failures;
}

function getSemanticDomains(question) {
  const category = clean(question.category);
  const domains = Object.entries(semanticProfiles)
    .filter(([, profile]) => profile.categories.includes(category))
    .map(([domain]) => domain);

  if (category === '项目经历') {
    for (const role of question.roles || []) {
      if (['qa', 'ops', 'devops', 'data', 'ai', 'security', 'architect'].includes(role)) {
        domains.push(role);
      }
    }
  }

  return [...new Set(domains)];
}

function getRequiredSignalCount(question, domain) {
  if (['java', 'go', 'python', 'php', 'cpp', 'dotnet', 'node', 'mysql', 'redis', 'kafka', 'network'].includes(domain)) return 2;
  if (domain === 'frontend' && question.type === 'algorithm') return 2;
  if (question.type === 'project') return 2;
  if (domain === 'architect' && question.type === 'system-design') return 2;
  return 3;
}

function createPhrases(text) {
  const normalized = text.replace(/\s+/g, ' ');
  const phrases = [];
  for (let index = 0; index + TEMPLATE_PHRASE_LENGTH <= normalized.length; index += TEMPLATE_PHRASE_STEP) {
    const phrase = normalized.slice(index, index + TEMPLATE_PHRASE_LENGTH).trim();
    if (isUsefulTemplatePhrase(phrase)) phrases.push(phrase);
  }
  return phrases;
}

function isUsefulTemplatePhrase(phrase) {
  if (phrase.length < TEMPLATE_PHRASE_LENGTH) return false;
  if (/^[\d\s\p{P}]+$/u.test(phrase)) return false;
  return /[\u4e00-\u9fa5A-Za-z]/.test(phrase);
}

function createSemanticText(question) {
  return [
    question.category,
    question.skill,
    question.question,
    question.referenceAnswer,
    question.excellentAnswer,
    ...(question.keywords || []),
    ...(question.expectedPoints || []),
    ...(question.followUps || []),
    ...(question.commonMistakes || []),
    ...(question.scoringRubric?.mustHave || []),
    ...(question.scoringRubric?.goodToHave || []),
    ...(question.scoringRubric?.redFlags || [])
  ].filter(Boolean).join(' ').toLowerCase();
}

function includesSignal(text, signal) {
  return text.includes(String(signal).toLowerCase());
}

function countStrictTemplateQuestions(items) {
  return items.filter((question) => !isLegacyTemplateQuestion(question)).length;
}

function countSemanticQuestions(items) {
  return items.filter((question) => !isLegacySemanticQuestion(question) && getSemanticDomains(question).length).length;
}

function isLegacyTemplateQuestion(question) {
  const source = question.governance?.source || question.source || 'unknown';
  return legacyTemplateSourcePatterns.some((pattern) => pattern.test(source));
}

function isLegacySemanticQuestion(question) {
  const source = question.governance?.source || question.source || 'unknown';
  return legacySemanticSourcePatterns.some((pattern) => pattern.test(source));
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}
