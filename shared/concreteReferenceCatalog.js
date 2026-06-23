import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const catalogDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'concrete-refs');
const catalogCache = new Map();

// 题库 skill 与 concrete-refs 键名不一致时的别名映射（仅改查找，不改 JSON 键名）
const SKILL_ALIASES = {
  AI: {
    '数据泄漏': '特征穿越',
    '模型评估': '特征穿越',
    '数据漂移': '特征漂移监控',
    'A/B 实验': '实验显著性',
    '线上实验': '实验显著性',
    '推荐排序': '召回排序架构',
    'RAG 切片': 'RAG 召回评估',
    '检索召回': 'RAG 召回评估',
    '重排模型': 'RAG 召回评估',
    '幻觉治理': 'RAG 引用',
    'RAG 应用': 'RAG 引用',
    'LLM 安全护栏': '提示词注入',
    '大模型安全': '提示词注入',
    '向量数据库': '向量召回参数',
    '量化压缩': '模型压缩',
    '金丝雀发布': '模型灰度',
    '模型监控': '特征漂移监控',
    '特征平台': 'Feature Store',
    '公平性偏差': '模型公平性',
    '可解释性': '模型可解释性',
    '冷启动': '冷启动推荐',
    '多模型路由': '模型路由',
    '离线在线一致性': '离线在线偏差',
    '人机协同': '人审闭环',
    '推理成本': '成本预算',
    '数据标注': '标签噪声',
    '隐私保护': '模型安全',
    '对抗样本': '模型安全',
    '模型部署': '模型版本回滚',
    'GPU 利用率': '训练资源调度',
    'MLOps': '模型文档',
    'ML Pipeline': '模型文档',
    '实验追踪': '模型文档',
    'Prompt 评估': 'LLM 评测集',
    Embedding: 'Embedding 更新',
    '反馈闭环': '反馈延迟',
    '模型服务': '模型 SLA',
    '推理延迟': '模型 SLA',
    '批处理推理': '模型 SLA'
  }
};

const INLINE_PATTERN_RULES = [
  {
    match: (q) => /JVM|内存区域|堆.*栈|方法区|元空间|直接内存|OOM/i.test(`${q.skill} ${q.question}`),
    reference: 'JVM 运行时数据区可分成：程序计数器、虚拟机栈、本地方法栈、堆、方法区/元空间（JDK8+ 字符串常量池在堆）。线程私有区异常看线程栈和局部变量；Java heap space 看 heap dump、对象直方图和大对象；Metaspace 看类加载是否泄漏；unable to create native thread 看线程数和栈大小；Direct buffer OOM 结合 NIO 和 -XX:MaxDirectMemorySize。排查顺序：先看异常类型定位区域，再用 jmap -heap/jmap -histo、jstack、MAT 分析引用链。',
    excellent: '我会先根据 OOM 异常信息判断是堆、元空间、栈还是直接内存问题：堆用 jmap/MAT 看对象分布，元空间查类加载泄漏，线程过多看 jstack 和线程数，直接内存结合 NIO 使用排查。'
  },
  {
    match: (q) => /双亲委派|类加载/i.test(`${q.skill} ${q.question}`),
    reference: '双亲委派：类加载器收到请求后先委派父加载器，父无法加载才自己加载，保证核心类由 Bootstrap 统一加载，避免用户自定义 java.lang.String 等类破坏安全。打破场景：SPI（如 JDBC Driver）、OSGi、热部署、Tomcat 多 WebApp 隔离。排查类冲突看 ClassLoader 链、-verbose:class 和 ClassNotFoundException/NoClassDefFoundError 的 loader 信息。',
    excellent: '双亲委派的核心是先把加载请求交给父加载器，保证 JDK 核心类唯一性；SPI、热部署等场景会打破委派。线上类冲突我会打印 ClassLoader 链和 -verbose:class 定位重复类。'
  },
  {
    match: (q) => /GC Root|GC Roots|内存泄漏|堆 dump|MAT/i.test(`${q.skill} ${q.question}`),
    reference: 'GC Roots 包括：虚拟机栈/local 变量、静态变量、常量、JNI 引用、同步锁持有对象、JMX Bean 等。泄漏排查：触发 heap dump（jmap -dump:live 或 OOM 自动 dump），MAT 看 Dominator Tree 和 GC Roots 到泄漏对象的最短路径，区分真实泄漏 vs 缓存未过期。常见泄漏：ThreadLocal 未 remove、静态集合、监听器未注销、类加载器泄漏。',
    excellent: '我会用 MAT 从 GC Roots 追引用链：先看 Dominator Tree 找占用最大的对象，再确认是 ThreadLocal、静态缓存还是监听器未释放。'
  },
  {
    match: (q) => /线程池隔离|线程池.*监控/i.test(`${q.skill} ${q.question}`),
    reference: '多业务共池会互相抢占队列和线程。隔离方案：按业务拆独立 ThreadPoolExecutor（核心/最大线程、队列、拒绝策略分开），或 Hystrix/Resilience4j 舱壁；IO 密集和 CPU 密集分池。监控：activeCount、queueSize、completedTaskCount、拒绝次数、任务等待 P99；配合线程池打满告警和动态扩容/降级。线程池参数结合 CPU 核数和任务类型，队列有界防 OOM。',
    excellent: '我会按业务域拆线程池并设置有界队列，监控队列长度和拒绝次数；核心链路单独池，非核心可降级，避免一个慢任务拖死全站。'
  },
  {
    match: (q) => /CompletableFuture/i.test(`${q.skill} ${q.question}`),
    reference: '适合多异步步骤编排：thenApply/thenCompose 串行、allOf/anyOf 并行聚合。超时用 orTimeout/completeOnTimeout（JDK9+）或 ScheduledExecutor 兜底；异常用 exceptionally/handle 记录并降级；线程池用业务专用 Executor，避免默认 ForkJoinPool.commonPool() 被阻塞任务占满。避免在 thenRun 里阻塞等待另一个 CF 造成链式阻塞。',
    excellent: '我用 CompletableFuture 做异步编排时会指定业务线程池，设置超时和 exceptionally 降级，并行用 allOf，避免在回调里阻塞 common pool。'
  },
  {
    match: (q) => /Spring 事务|声明式事务/i.test(`${q.skill} ${q.question}`),
    reference: '事务失效常见原因：同类自调用绕过代理（需注入 self 或 AopContext）、方法非 public、异常被 catch 未抛出（默认只回滚 RuntimeException/Error）、错误传播行为（REQUIRES_NEW 嵌套）、数据库引擎非 InnoDB。排查：开 spring.transaction 日志、看 Connection 是否同一、@Transactional 是否生效（代理类）、异常类型是否触发 rollback。',
    excellent: 'Spring 事务失效我重点查自调用、异常是否被吞、传播行为和引擎是否 InnoDB；会用日志确认是否走了代理和同一 Connection。'
  },
  {
    match: (q) => /Bean 生命周期|循环依赖/i.test(`${q.skill} ${q.question}`),
    reference: '生命周期：实例化 -> 属性注入 -> Aware 回调 -> BeanPostProcessor before -> @PostConstruct -> init-method -> 使用 -> @PreDestroy -> destroy。AOP 代理多在初始化阶段创建。循环依赖：单例+属性注入可用三级缓存提前暴露工厂；构造器循环无法解决。排查启动失败看循环依赖栈、BeanCurrentlyInCreationException，以及是否混用 prototype。',
    excellent: 'Bean 生命周期我会从实例化讲到代理创建；循环依赖靠三级缓存解决 setter 注入，构造器注入循环会直接失败。'
  },
  {
    match: (q) => /JVM 调优|p99.*延迟|Full GC/i.test(`${q.skill} ${q.question}`),
    reference: 'p99 抖动排查顺序：1) GC 日志看 Full GC 频率和 STW；2) jstack 看 BLOCKED/WAITING 和锁竞争；3) 线程池/连接池是否耗尽；4) 下游 RT 和超时重试放大。工具：async-profiler、JFR、arthas。调优：修正堆大小和 GC 器（G1/ZGC），减少大对象和过早晋升，修复泄漏；锁问题用减小临界区、读写锁或无锁结构。',
    excellent: 'p99 抖动我会先看 GC 和 STW，再看锁和线程池，最后查下游；用 JFR/async-profiler 定位热点，而不是先调堆参数。'
  },
  {
    match: (q) => /GMP|Go 调度|goroutine/i.test(`${q.skill} ${q.question}`) && !/泄漏/i.test(`${q.skill} ${q.question}`),
    reference: 'GMP：G 是 goroutine，M 是 OS 线程，P 是逻辑处理器持有本地运行队列。G 多时 M 不必 1:1，P 数量默认 GOMAXPROCS。调度：work stealing、sysmon 抢占长任务、网络轮询器把阻塞 syscall 的 M 让出。能支撑大量 G 因为栈初始小（可扩缩）、用户态调度成本低、阻塞时线程可让出。',
    excellent: 'Go 靠 GMP 把大量 goroutine 映射到少量 OS 线程，P 本地队列加 work stealing；阻塞 syscall 和网络 I/O 通过 netpoller 让线程复用。'
  },
  {
    match: (q) => /goroutine 泄漏|goroutine 数量/i.test(`${q.skill} ${q.question}`),
    reference: '泄漏原因：channel 阻塞无人读/写、WaitGroup 未 Done、context 未取消、定时器/ticker 未 Stop、HTTP body 未关闭。定位：pprof goroutine、看相同栈是否持续增长；日志加 goroutine 计数。修复：用 context 超时、select default、defer close、确保消费者退出；压测后 goroutine 数应回落。',
    excellent: 'goroutine 泄漏我先用 pprof goroutine 看重复栈，常见是 channel 永久阻塞或 context 没取消；修复会加超时和退出信号。'
  },
  {
    match: (q) => /channel 关闭|channel.*panic/i.test(`${q.skill} ${q.question}`),
    reference: '原则：只由发送方关闭，或明确唯一 owner 关闭；接收方不要 close。关闭后再 send panic，再 recv 得零值且 ok=false。range 自动读到关闭。避免 panic：用 select+ok 判断、sync.Once 关闭、文档约定谁关闭。fan-in 用 WaitGroup 等所有 sender 结束再 close。',
    excellent: 'channel 我只让发送方关闭；接收方用 v, ok := <-ch 判断，避免向已关闭 channel 发送导致 panic。'
  },
  {
    match: (q) => /context.*传播|context.*超时|context.*取消/i.test(`${q.skill} ${q.question}`),
    reference: 'context 传递 deadline/cancel 信号和 request-scoped 值。用法：根 context.Background/TODO，请求入口 context.WithTimeout/WithCancel，下游函数第一个参数传 ctx，select ctx.Done() 退出。滥用：把 ctx 存全局、在结构体长期持有、用 Value 传大对象。链路超时需层层传递，避免父取消后子 goroutine 泄漏。',
    excellent: '我在入口用 WithTimeout 创建 ctx 并贯穿 RPC/DB 调用，goroutine 里 select Done()；不把 context 存全局或塞大对象。'
  },
  {
    match: (q) => /Redis 为什么快|redis.*快/i.test(`${q.skill} ${q.question}`),
    reference: 'Redis 快的原因：1) 内存读写；2) I/O 多路复用（epoll）单线程处理多连接；3) 命令执行单线程避免锁竞争（6.0+ IO 线程只处理网络）；4) 高效数据结构（SDS、跳表、quicklist）；5) RESP 协议简单。不是“因为内存”一句话，而是内存+事件模型+数据结构共同作用。',
    excellent: '我会从内存、I/O 多路复用、单线程命令执行和数据结构优化四方面讲 Redis 为什么快，而不是只说内存数据库。'
  },
  {
    match: (q) => /B\+树|索引为什么|MySQL 索引/i.test(`${q.skill} ${q.question}`),
    reference: 'InnoDB 用 B+Tree：叶子节点存数据且链表连接，适合范围查询和顺序扫描；非叶子只存键减少高度。索引将随机 IO 变有序 IO，覆盖索引可避免回表。注意最左前缀、区分度低的列、过多索引写放大。Explain 看 type、key、rows、Extra 判断是否走索引。',
    excellent: 'MySQL 索引本质是 B+Tree 降低磁盘扫描范围；我会结合最左前缀、覆盖索引和 Explain 说明为什么快、什么时候失效。'
  }
];

function loadCatalogFile(name) {
  if (catalogCache.has(name)) return catalogCache.get(name);

  const filePath = join(catalogDir, name);
  if (!existsSync(filePath)) {
    catalogCache.set(name, {});
    return {};
  }

  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  catalogCache.set(name, data);
  return data;
}

function loadSkillCatalog(category = '') {
  const map = {
    Java: 'java.json',
    Go: 'go.json',
    Python: 'python.json',
    运维: 'ops.json',
    前端: 'frontend.json',
    安全: 'security.json',
    测试: 'qa.json',
    AI: 'ai.json',
    系统设计: 'architect.json'
  };
  const fileName = map[category];
  return fileName ? loadCatalogFile(fileName) : {};
}

function toExcellentAnswer(reference = '') {
  const text = String(reference || '').trim();
  if (!text) return '';
  if (text.startsWith('（示例）')) return text.replace(/^（示例）/, '我');
  if (/^先说结论|^我会|^我/.test(text)) return text;
  return `我会这样回答：${text}`;
}

function resolveCatalogSkill(category = '', skill = '') {
  const aliases = SKILL_ALIASES[category];
  if (aliases?.[skill]) return aliases[skill];
  return skill;
}

function lookupSkillCatalog(question) {
  const skill = String(question.skill || '').trim();
  if (!skill) return null;

  const catalog = loadSkillCatalog(question.category);
  const catalogSkill = resolveCatalogSkill(question.category, skill);
  const entry = catalog[catalogSkill];
  if (!entry?.referenceAnswer) return null;

  return {
    referenceAnswer: entry.referenceAnswer,
    excellentAnswer: entry.excellentAnswer || toExcellentAnswer(entry.referenceAnswer)
  };
}

function lookupPatternRules(question) {
  for (const rule of INLINE_PATTERN_RULES) {
    if (!rule.match(question)) continue;
    return {
      referenceAnswer: rule.reference,
      excellentAnswer: rule.excellent || toExcellentAnswer(rule.reference)
    };
  }
  return null;
}

export function matchConcreteKnowledgeAnswer(question = {}) {
  return Boolean(lookupSkillCatalog(question) || lookupPatternRules(question));
}

export function getConcreteKnowledgeAnswer(question = {}) {
  return lookupSkillCatalog(question) || lookupPatternRules(question);
}
