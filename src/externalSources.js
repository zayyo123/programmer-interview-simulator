import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..');
export const externalDraftPath = join(rootDir, 'data', 'external-question-drafts.json');

const githubSources = [
  {
    id: 'github-realabbas-big-companies',
    name: 'Big Companies Interview Questions',
    provider: 'GitHub',
    license: 'CC0-1.0',
    licenseUrl: 'https://raw.githubusercontent.com/realabbas/big-companies-interview-questions/master/LICENSE',
    attributionRequired: false,
    url: 'https://api.github.com/repos/realabbas/big-companies-interview-questions/contents',
    fallbackUrls: ['https://raw.githubusercontent.com/realabbas/big-companies-interview-questions/master/README.md'],
    repoUrl: 'https://github.com/realabbas/big-companies-interview-questions',
    usage: '可作为外部草稿素材，经去重、中文化和结构化评分后再进入正式题库。',
    seedTitles: [
      'What is the difference between HashMap and ConcurrentHashMap?',
      'How does garbage collection work in Java?',
      'Explain database indexing and query optimization in interviews.'
    ]
  },
  {
    id: 'github-snailclimb-javaguide',
    name: 'JavaGuide 中文面试知识库',
    provider: 'GitHub 中文题库',
    license: 'Apache-2.0',
    licenseUrl: 'https://raw.githubusercontent.com/Snailclimb/JavaGuide/main/LICENSE',
    attributionRequired: true,
    repoUrl: 'https://github.com/Snailclimb/JavaGuide',
    directories: [
      'https://api.github.com/repos/Snailclimb/JavaGuide/contents/docs/java',
      'https://api.github.com/repos/Snailclimb/JavaGuide/contents/docs/database',
      'https://api.github.com/repos/Snailclimb/JavaGuide/contents/docs/cs-basics'
    ],
    fallbackUrls: [
      'https://raw.githubusercontent.com/Snailclimb/JavaGuide/main/docs/java/basis/java-basic-questions-01.md',
      'https://raw.githubusercontent.com/Snailclimb/JavaGuide/main/docs/database/mysql/mysql-questions-01.md'
    ],
    usage: '中文 Apache-2.0 面试知识库，可作为中文草稿素材；正式入库前需要改写为本产品的问答、追问和四维评分结构。',
    seedTitles: [
      'Java 中 HashMap 和 ConcurrentHashMap 有什么区别？',
      'JVM 垃圾回收如何判断对象是否可以回收？',
      'MySQL 索引为什么能提升查询速度？'
    ]
  },
  {
    id: 'github-yangshun-frontend-handbook',
    name: 'Front End Interview Handbook',
    provider: 'GitHub',
    license: 'MIT',
    licenseUrl: 'https://raw.githubusercontent.com/yangshun/front-end-interview-handbook/main/LICENSE',
    attributionRequired: false,
    repoUrl: 'https://github.com/yangshun/front-end-interview-handbook',
    directories: [
      'https://api.github.com/repos/yangshun/front-end-interview-handbook/contents/questions'
    ],
    fallbackUrls: [
      'https://raw.githubusercontent.com/yangshun/front-end-interview-handbook/main/questions/javascript-questions.md',
      'https://raw.githubusercontent.com/yangshun/front-end-interview-handbook/main/questions/css-questions.md',
      'https://raw.githubusercontent.com/yangshun/front-end-interview-handbook/main/questions/html-questions.md'
    ],
    usage: 'MIT 授权的前端面试题库，适合补充 JavaScript、CSS、HTML、浏览器和工程化方向草稿。',
    seedTitles: [
      'What happens when you type a URL into the browser address bar?',
      'Explain event delegation in JavaScript and when you would use it.',
      'How do you optimize the performance of a large frontend page?'
    ]
  },
  {
    id: 'github-sudheerj-react-interview',
    name: 'ReactJS Interview Questions',
    provider: 'GitHub',
    license: 'MIT',
    licenseUrl: 'https://raw.githubusercontent.com/sudheerj/reactjs-interview-questions/master/LICENSE',
    attributionRequired: false,
    url: 'https://api.github.com/repos/sudheerj/reactjs-interview-questions/contents',
    fallbackUrls: ['https://raw.githubusercontent.com/sudheerj/reactjs-interview-questions/master/README.md'],
    repoUrl: 'https://github.com/sudheerj/reactjs-interview-questions',
    usage: 'MIT 授权的 React 面试题库，适合补充前端框架、状态管理和组件设计方向草稿。',
    seedTitles: [
      'What are React hooks and why were they introduced?',
      'How does React reconciliation work?',
      'How do you prevent unnecessary re-renders in React?'
    ]
  },
  {
    id: 'github-lydiahallie-javascript-questions',
    name: 'JavaScript Questions',
    provider: 'GitHub',
    license: 'MIT',
    licenseUrl: 'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/LICENSE',
    attributionRequired: false,
    fallbackUrls: [
      'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md',
      'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/zh-CN/README-zh_CN.md'
    ],
    repoUrl: 'https://github.com/lydiahallie/javascript-questions',
    usage: 'MIT 授权的 JavaScript 高频题库，适合提炼 JS 运行机制、异步、闭包和类型转换方向草稿。',
    seedTitles: [
      'What is the difference between var, let, and const?',
      'How does the JavaScript event loop work?',
      'What are closures in JavaScript and where are they useful?'
    ]
  },
  {
    id: 'github-faqguru-golang-frontend',
    name: 'FAQGURU Go and Frontend Questions',
    provider: 'GitHub',
    license: 'MIT',
    licenseUrl: 'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/LICENSE',
    attributionRequired: false,
    fallbackUrls: [
      'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/topics/en/golang.md',
      'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/topics/en/javascript.md',
      'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/topics/en/react.md',
      'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/topics/en/vuejs.md',
      'https://raw.githubusercontent.com/FAQGURU/FAQGURU/master/topics/en/typeScript.md'
    ],
    repoUrl: 'https://github.com/FAQGURU/FAQGURU',
    usage: 'MIT 授权的多技术 FAQ 题库，本项目只抽取 Go 和前端相关主题作为草稿素材。',
    seedTitles: [
      'What are goroutines and how are they different from threads?',
      'How do channels work in Go?',
      'What is the difference between React state and props?'
    ]
  },
  {
    id: 'github-shomali11-go-interview',
    name: 'Go Interview Coding Questions',
    provider: 'GitHub',
    license: 'MIT',
    licenseUrl: 'https://raw.githubusercontent.com/shomali11/go-interview/master/LICENSE',
    attributionRequired: false,
    repoUrl: 'https://github.com/shomali11/go-interview',
    directories: [
      'https://api.github.com/repos/shomali11/go-interview/contents/algorithms',
      'https://api.github.com/repos/shomali11/go-interview/contents/datastructures',
      'https://api.github.com/repos/shomali11/go-interview/contents/lists',
      'https://api.github.com/repos/shomali11/go-interview/contents/slices',
      'https://api.github.com/repos/shomali11/go-interview/contents/strings'
    ],
    fallbackUrls: ['https://raw.githubusercontent.com/shomali11/go-interview/master/README.md'],
    usage: 'MIT 授权的 Go 编程面试题和代码练习，可作为 Go 算法与数据结构草稿来源。',
    seedTitles: [
      'How would you reverse a linked list in Go?',
      'How do you detect a cycle in a linked list with Go?',
      'How would you implement a stack or queue in Go?'
    ]
  }
];

const stackExchangeSources = [
  {
    id: 'stack-overflow-programmer-interview',
    name: 'Stack Overflow 常见技术问答信号',
    provider: 'Stack Exchange API',
    license: 'CC BY-SA',
    licenseUrl: 'https://stackoverflow.com/help/licensing',
    attributionRequired: true,
    tags: ['javascript', 'reactjs', 'typescript', 'vue.js', 'go', 'python', 'django', 'flask', 'celery', 'java', 'mysql', 'redis', 'algorithm'],
    url: 'https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&site=stackoverflow&pagesize=8&tagged={tag}&filter=!nNPvSNVZJS',
    usage: '仅提取标题、标签、热度和链接作为追问/易错点信号；不要把问答正文直接写入本地题库。'
  }
];

const categoryRules = [
  { category: 'Java', pattern: /java|jvm|jdk|jre|string|stringbuilder|stringbuffer|exception|hashmap|concurrenthashmap|spring|thread|concurrent|lock|bio|nio|aio/i },
  { category: 'Go', pattern: /\bgolang\b|\bgo\b|goroutine|channel|context|pprof/i },
  { category: 'Python', pattern: /python|django|flask|celery|asyncio|\bgil\b|pytest/i },
  { category: '前端', pattern: /javascript|typescript|react|vue|browser|css|html|promise|frontend|front-end/i },
  { category: 'MySQL', pattern: /mysql|sql|database|index|transaction|query/i },
  { category: 'Redis', pattern: /redis|cache|caching/i },
  { category: '网络', pattern: /http|tcp|udp|network|https|socket/i },
  { category: '操作系统', pattern: /process|thread|memory|linux|os|operating system/i },
  { category: '算法', pattern: /algorithm|leetcode|array|tree|graph|dynamic programming|binary search|二分|滑动窗口|动态规划|复杂度/i },
  { category: '系统设计', pattern: /system design|distributed|scalability|architecture|microservice/i }
];

export async function syncExternalQuestionDrafts(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== 'function') {
    throw new Error('当前 Node.js 版本不支持 fetch，无法同步外部题源。');
  }

  const startedAt = new Date().toISOString();
  const results = await Promise.allSettled([
    ...githubSources.map((source) => fetchGithubInterviewQuestions({ fetchImpl, source })),
    fetchStackExchangeSignals({ fetchImpl })
  ]);

  const sources = results.map(formatSyncResult);
  const drafts = dedupeDrafts(sources.flatMap((source) => source.drafts || []));
  const payload = {
    syncedAt: new Date().toISOString(),
    startedAt,
    summary: {
      sourceCount: sources.length,
      draftCount: drafts.length,
      githubDraftCount: drafts.filter((item) => item.provider === 'GitHub').length,
      chineseGithubDraftCount: drafts.filter((item) => item.provider === 'GitHub 中文题库').length,
      stackExchangeSignalCount: drafts.filter((item) => item.provider === 'Stack Exchange API').length,
      readyForImportCount: drafts.filter((item) => item.importPolicy === 'can-transform').length,
      attributionRequiredCount: drafts.filter((item) => item.attributionRequired).length
    },
    sources: sources.map(({ drafts, ...source }) => ({
      ...source,
      draftCount: drafts?.length || 0
    })),
    drafts
  };

  await saveExternalQuestionDrafts(payload, options.outputPath || externalDraftPath);
  return payload;
}

export async function loadExternalQuestionDrafts() {
  try {
    return JSON.parse(await readFile(externalDraftPath, 'utf8'));
  } catch {
    return createEmptyExternalDraftPayload();
  }
}

export function createExternalQuestionDraftsFromSignals(items = [], source = {}) {
  return items
    .map((item, index) => normalizeExternalItem(item, source, index))
    .filter(Boolean);
}

async function fetchGithubInterviewQuestions({ fetchImpl, source }) {
  const drafts = [];

  try {
    const files = source.directories?.length
      ? await fetchGithubMarkdownFilesFromDirectories(source.directories, fetchImpl)
      : await fetchGithubMarkdownFiles(source.url, fetchImpl);
    for (const file of files.slice(0, 20)) {
      const content = await fetchText(file.download_url, fetchImpl);
      drafts.push(...extractGithubMarkdownDrafts(content, {
        ...source,
        sourceUrl: file.html_url,
        sourcePath: file.path
      }));
    }
  } catch (error) {
    for (const fallbackUrl of source.fallbackUrls || []) {
      try {
        const content = await fetchText(fallbackUrl, fetchImpl);
        drafts.push(...extractGithubMarkdownDrafts(content, {
          ...source,
          sourceUrl: fallbackUrl,
          sourcePath: 'README.md',
          fallbackReason: error.message
        }));
      } catch {
        // Use local licensed seeds below when both GitHub API and raw fallback are unreachable.
      }
    }
  }

  if (drafts.length < 3) {
    drafts.push(...createGithubSeedDrafts(source, drafts.length));
  }

  return {
    ...source,
    ok: true,
    drafts
  };
}

async function fetchStackExchangeSignals({ fetchImpl }) {
  const source = stackExchangeSources[0];
  const payloads = await Promise.all(
    source.tags.map((tag) => fetchJson(source.url.replace('{tag}', encodeURIComponent(tag)), fetchImpl))
  );
  const drafts = createExternalQuestionDraftsFromSignals(
    payloads.flatMap((payload) => payload.items || []),
    source
  ).slice(0, 60);

  return {
    ...source,
    ok: true,
    quotaRemaining: Math.min(...payloads.map((payload) => Number(payload.quota_remaining)).filter(Number.isFinite)),
    drafts
  };
}

async function fetchGithubMarkdownFiles(url, fetchImpl) {
  const entries = await fetchJson(url, fetchImpl, {
    headers: { 'User-Agent': 'programmer-interview-simulator' }
  });
  const files = Array.isArray(entries) ? entries : [];
  return files
    .filter((item) => item.type === 'file' && /\.md$/i.test(item.name || '') && item.download_url)
    .sort((left, right) => String(left.path).localeCompare(String(right.path)));
}

async function fetchGithubMarkdownFilesFromDirectories(urls, fetchImpl) {
  const files = [];
  const queue = [...urls];
  const visited = new Set();

  while (queue.length && files.length < 40) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const entries = await fetchJson(url, fetchImpl, {
      headers: { 'User-Agent': 'programmer-interview-simulator' }
    });

    for (const item of Array.isArray(entries) ? entries : []) {
      if (item.type === 'dir' && item.url) {
        queue.push(item.url);
      } else if (item.type === 'file' && /\.md$/i.test(item.name || '') && item.download_url) {
        files.push(item);
      }
    }
  }

  return files.sort((left, right) => String(left.path).localeCompare(String(right.path)));
}

function extractGithubMarkdownDrafts(markdown, source) {
  const lines = String(markdown || '').split(/\r?\n/);
  const candidates = [];
  let currentSection = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,4}\s+(.+)/);
    if (heading) {
      currentSection = cleanupMarkdown(heading[1]);
      if (isQuestionLike(currentSection)) candidates.push(currentSection);
      continue;
    }

    const listItem = line.match(/^(?:[-*+]|\d+[.)])\s+(.+)/);
    if (listItem && isQuestionLike(listItem[1], { allowStatementTitle: false })) {
      candidates.push(cleanupMarkdown(listItem[1]));
    }
  }

  return candidates.slice(0, 80).map((title, index) => normalizeExternalItem({
    title,
    tags: inferTags(`${title} ${currentSection}`),
    link: source.sourceUrl,
    section: currentSection,
    score: 0
  }, source, index)).filter(Boolean);
}

function createGithubSeedDrafts(source, offset = 0) {
  return source.seedTitles.map((title, index) => normalizeExternalItem({
    title,
    tags: inferTags(title),
    link: source.repoUrl,
    score: 0
  }, {
    ...source,
    sourcePath: '本地授权种子',
    seedOnly: true
  }, index + offset)).filter(Boolean);
}

function normalizeExternalItem(item, source, index) {
  const title = cleanupMarkdown(item.title || item.name || item.question || '');
  if (!title || title.length < 8) return null;

  const category = inferCategory([title, ...(item.tags || [])].join(' '));
  const tags = [...new Set([...(item.tags || []), category].filter(Boolean))].slice(0, 8);
  const importPolicy = getImportPolicy(source);

  return {
    id: `${source.id}-${index + 1}`,
    provider: source.provider,
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: item.link || source.repoUrl || source.url,
    sourcePath: source.sourcePath || '',
    license: source.license,
    licenseUrl: source.licenseUrl,
    attributionRequired: Boolean(source.attributionRequired),
    importPolicy,
    category,
    skill: category,
    type: category === '系统设计' ? 'system-design' : category === '算法' ? 'algorithm' : 'knowledge',
    difficulty: inferDifficulty(item),
    title,
    tags,
    popularity: Number(item.score || item.view_count || 0) || 0,
    trainingDraft: createTrainingDraft(title, category, source, importPolicy),
    qualityNotes: createQualityNotes(source, importPolicy)
  };
}

function createTrainingDraft(title, category, source, importPolicy) {
  const action = importPolicy === 'can-transform'
    ? '可转写为中文面试训练题'
    : '仅作为追问和易错点信号';
  return {
    question: `请围绕“${title}”做一次中文技术面试回答，重点说明核心概念、适用场景、边界条件和真实项目中的取舍。`,
    expectedPoints: [
      `${category} 核心概念`,
      '适用场景',
      '边界条件',
      '常见误区',
      '项目化表达'
    ],
    followUps: [
      `如果面试官继续追问“${title}”的实现细节，你会补充哪些关键点？`,
      '这个问题在线上项目中通常会遇到哪些风险？',
      '你会用什么指标或现象证明方案有效？'
    ],
    referenceAnswer: `${source.name} 提供了该主题的开放题源线索。正式入库前应结合本地中文面试标准重写答案，覆盖原理、场景、边界和取舍，避免直接搬运外部正文。`,
    commonMistakes: [
      '只背结论，不解释判断过程。',
      '缺少边界条件和线上排查思路。',
      '没有把题目落到个人项目经验。'
    ],
    importAdvice: action
  };
}

function createQualityNotes(source, importPolicy) {
  if (importPolicy === 'can-transform') {
    return [
      source.attributionRequired ? '来源授权允许改写，但正式入库和导出时应保留来源署名。' : '来源声明为 CC0，可作为改写素材。',
      '入正式题库前仍需中文化、去重、补评分规则。',
      '建议只保留面试训练价值明确的题。'
    ];
  }

  return [
    'Stack Exchange 内容需要署名和遵循 CC BY-SA。',
    '当前只保存标题、标签、链接和热度，不保存正文。',
    '适合提炼追问方向和常见误区，不建议直接入正式题库。'
  ];
}

function getImportPolicy(source) {
  if (['CC0-1.0', 'Apache-2.0', 'MIT', 'CC BY 4.0'].includes(source.license)) return 'can-transform';
  return 'signal-only';
}

function inferCategory(text) {
  const source = String(text || '');
  return categoryRules.find((rule) => rule.pattern.test(source))?.category || '通用技术';
}

function inferTags(text) {
  return categoryRules
    .filter((rule) => rule.pattern.test(String(text || '')))
    .map((rule) => rule.category);
}

function inferDifficulty(item) {
  const score = Number(item.score || item.view_count || 0) || 0;
  if (score >= 100 || /senior|distributed|concurrent|scalability/i.test(item.title || '')) return 3;
  if (score >= 20 || /design|thread|cache|database|algorithm/i.test(item.title || '')) return 2;
  return 1;
}

function isQuestionLike(text, options = {}) {
  const line = cleanupMarkdown(text);
  if (line.length < 8 || line.length > 180) return false;
  if (/^(table of contents|license|copyright|contributing|目录|导航|推荐阅读|参考|相关阅读)$/i.test(line)) return false;
  if (/pull request|package|included|visitor|badge|github\.com|tree\/master|companies\/|startup|awesome list|common interview questions/i.test(line)) return false;
  if (/^(适用场景|应用场景|优点|缺点|特点|总结|注意|说明|原因|解决方案|数据库管理员|database administrator)\s*[:：]/i.test(line)) return false;
  if (!options.allowStatementTitle && /[:：]/.test(line) && !/[?？]|为什么|如何|什么|怎么|怎样|区别|有哪些|是否/.test(line)) return false;
  return /[?？]|how|what|why|design|implement|explain|difference|如何|什么|为什么|设计|实现|解释|区别|是什么|有哪些|原理|流程|机制|怎么|怎样/i.test(line);
}

function cleanupMarkdown(text) {
  return String(text || '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeDrafts(drafts) {
  const seen = new Set();
  const result = [];
  for (const draft of drafts) {
    if (isLowValueExternalTitle(draft.title)) continue;
    const key = `${draft.category}:${draft.title}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      ...draft,
      id: `external_${String(result.length + 1).padStart(4, '0')}`
    });
  }
  return result;
}

function isLowValueExternalTitle(title) {
  const value = String(title || '').trim();
  if (!value) return true;
  if (/^[@#<>{}]/.test(value)) return true;
  if (/methodProxy|@param|@return|@throws|import\s|public\s|private\s|protected\s|class\s/i.test(value)) return true;
  if (/^[\u4e00-\u9fffA-Za-z0-9\s（）()、，,]+[；;]$/.test(value) && !/[?？]|为什么|如何|什么|怎么|怎样|区别|有哪些|是否/.test(value)) return true;
  if (/^(安全性|可移植性|高性能|健壮性|简单性|解释型|多线程)\s*[（(]/.test(value)) return true;
  if (/^[-–—]+$/.test(value)) return true;
  return false;
}

async function fetchJson(url, fetchImpl, options = {}) {
  const response = await fetchImpl(url, options);
  if (!response.ok) throw new Error(`请求失败 ${response.status}: ${url}`);
  return response.json();
}

async function fetchText(url, fetchImpl) {
  const response = await fetchImpl(url, {
    headers: { 'User-Agent': 'programmer-interview-simulator' }
  });
  if (!response.ok) throw new Error(`请求失败 ${response.status}: ${url}`);
  return response.text();
}

function formatSyncResult(result) {
  if (result.status === 'fulfilled') return result.value;
  return {
    ok: false,
    provider: 'unknown',
    name: '外部题源',
    error: result.reason?.message || String(result.reason),
    drafts: []
  };
}

async function saveExternalQuestionDrafts(payload, outputPath = externalDraftPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function createEmptyExternalDraftPayload() {
  return {
    syncedAt: null,
    summary: {
      sourceCount: 0,
      draftCount: 0,
      githubDraftCount: 0,
      stackExchangeSignalCount: 0,
      readyForImportCount: 0,
      attributionRequiredCount: 0
    },
    sources: [...githubSources, ...stackExchangeSources].map((source) => ({
      ...source,
      ok: false,
      draftCount: 0,
      error: '尚未同步'
    })),
    drafts: []
  };
}
