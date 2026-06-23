import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const refsDir = path.join(__dirname, '../data/concrete-refs');

const GENERIC_GO_TAIL =
  /用 pprof、trace 和 race detector 等工具验证结论，说明并发边界和失败处理。排查时结合 goroutine dump、block profile 和 GC trace 对齐现象与根因。/g;

const GENERIC_JAVA_TAIL =
  /结合 JVM 工具链（jstack、jmap、MAT）说明排查路径和修复验证。线程池、连接池和 GC 参数调整前先看监控与 dump，避免盲目调参。/g;

const GENERIC_PY_TAIL =
  /用 profiling 和基准测试验证优化效果，说明 GIL、异步和部署边界。IO 与 CPU 瓶颈分流处理：asyncio\/多进程\/原生扩展按场景选型。/g;

const PRACTICE_TAIL =
  /(?:\s*实践中要用指标、日志或对照实验验证方案有效性，并提前设计异常时的回滚与降级策略，避免把离线结论直接等同于线上效果。)+/g;

function stripGenericTails(text) {
  return String(text || '')
    .replace(GENERIC_GO_TAIL, '')
    .replace(GENERIC_JAVA_TAIL, '')
    .replace(GENERIC_PY_TAIL, '')
    .replace(PRACTICE_TAIL, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const PATCHES = {
  'go.json': {
    'channel 关闭': {
      referenceAnswer:
        'channel 关闭规则：只应由发送方或唯一 owner 关闭，重复 close 会 panic。关闭后：向已关闭 channel 发送会 panic；接收仍可读，得到零值且 ok=false。接收方用 v, ok := <-ch 判断 channel 是否已关闭，不要用「读到的零值」猜测关闭状态（零值可能是正常发送）。fan-in 场景：多个 sender 向同一 channel 写时，应等所有 sender 退出后再 close，或用 sync.WaitGroup 计数；只 close 一次，可用 sync.Once 保护。select 中配合 default 做非阻塞读/写。常见坑：在 range 循环中 close、在消费者里 close 导致 sender panic。',
      excellentAnswer:
        '发送方关闭 channel，接收方用 ok 判断；fan-in 等所有 sender 结束再 close，sync.Once 防重复关闭。'
    },
    '限流背压': {
      referenceAnswer:
        '限流保护系统不被突发流量打垮，背压让上游感知下游处理能力。Go 常用 golang.org/x/time/rate 令牌桶：Limiter.Allow()/Wait() 控制 QPS 和 burst。网关层（Nginx limit_req、Envoy local rate limit）做入口限流；服务内按租户/接口拆 Limiter。背压：有界 channel 满时阻塞发送或返回 429/503；HTTP 客户端设合理 timeout 和 max concurrency。监控拒绝率、队列深度、下游 P99 RT，配合熔断避免重试风暴。CPU 密集与 IO 密集分池，避免慢任务占满 worker。',
      excellentAnswer:
        'x/time/rate 令牌桶限流，有界 channel 或 429 做背压，监控拒绝率和队列深度，防重试风暴。'
    },
    'defer 成本': {
      referenceAnswer:
        'defer 按 LIFO 顺序在函数返回前执行，Go 1.14+ 栈上 defer 开销已很低，多数场景可放心用。适用：unlock、Close、Stop、recover 兜底。高频热点路径若 defer 层数多，可权衡内联 unlock/close 减少开销。defer 与 return 交互：返回值先计算再执行 defer，defer 可修改命名返回值。闭包 defer 注意循环变量捕获（Go 1.22+ 已修复 per-iteration 语义）。不要用 defer 做复杂业务逻辑，只做资源释放。',
      excellentAnswer:
        'defer 适合 unlock/Close/Stop，Go1.14+ 开销低；热点路径可内联，注意 defer 与命名返回值交互。'
    },
    'map 并发安全': {
      referenceAnswer:
        'map 非并发安全，并发读写会 fatal error: concurrent map read and map write。方案：1) sync.RWMutex 包一层，读多写少时 RLock/RUnlock；2) sync.Map，适合读多写少、key 集合相对稳定、无需遍历全量的场景；3) 分片 map（按 key hash 分 N 个 shard 各持锁）降低锁竞争。选型看读写比例和是否需要 range 全量。测试并发 map 用 go test -race。不要用 sync.Map 替代所有 map——普通 map+Mutex 往往更简单高效。',
      excellentAnswer:
        'map 并发写会 fatal；RWMutex 包一层，读多写少用 sync.Map 或分片 map，-race 验证。'
    },
    'context 传播': {
      referenceAnswer:
        'context 传递 deadline、cancel 信号和 request-scoped 小数据（如 traceID）。入口用 context.WithTimeout/WithCancel 设超时，下游函数第一参数传 ctx。goroutine 内 select <-ctx.Done() 及时退出，避免泄漏。不要把 context 存全局变量或结构体长期持有；Value 只放 request id 等小数据，勿塞大对象。HTTP 服务从 Request.Context() 取 ctx 传给下游 RPC/DB。取消要向下游传播，避免父 ctx 取消后子 goroutine 仍在跑。',
      excellentAnswer:
        '入口 WithTimeout，全链路透传 ctx，goroutine select Done() 退出，禁止全局持有 context。'
    }
  },
  'java.json': {
    '线程池隔离': {
      referenceAnswer:
        '多业务共池会互相抢占线程和队列。隔离：按业务域拆独立 ThreadPoolExecutor，核心/最大线程数、有界队列、拒绝策略分开配置。IO 密集与 CPU 密集分池，避免阻塞 IO 占满 CPU 池。Hystrix/Resilience4j 舱壁模式进一步隔离。监控 activeCount、queueSize、completedTaskCount、拒绝次数、任务等待 P99；队列打满时降级非核心或扩容。有界队列防 OOM，CallerRunsPolicy 形成反压。线程数结合 CPU 核数和任务类型估算，压测验证而非拍脑袋。',
      excellentAnswer:
        '按业务拆独立线程池+有界队列，IO/CPU 分池，监控队列和拒绝次数，核心链路单独池。'
    },
    'Spring 事务': {
      referenceAnswer:
        '声明式事务基于 AOP 代理，失效常见原因：同类自调用绕过代理、方法非 public、异常被 catch 未抛出、rollbackFor 未包含受检异常、非 InnoDB 引擎。传播行为 PROPAGATION_REQUIRED/REQUIRES_NEW 嵌套不当会导致部分提交。排查：确认调用走代理对象、同一 Connection、异常类型是否触发回滚。自调用改注入自身代理或拆到另一个 Bean。生产开启事务日志或 datasource-proxy 看 commit/rollback。',
      excellentAnswer:
        '事务失效查自调用、非 public、异常被吞、rollbackFor；确认走代理且同一 Connection。'
    },
    'CompletableFuture': {
      referenceAnswer:
        'CompletableFuture 适合异步编排：thenApply/thenCompose 串行、allOf/anyOf 并行聚合。必须指定业务线程池 Executor，避免默认 ForkJoinPool.commonPool() 被阻塞任务占满。超时用 orTimeout/completeOnTimeout（JDK9+）或 ScheduledExecutor 兜底；异常用 exceptionally/handle 记录并降级。避免在 thenRun 里阻塞等待另一个 CF 造成链式阻塞。组合多个异步步骤时注意异常传播和取消传播。',
      excellentAnswer:
        'CF 用业务线程池，orTimeout 设超时，exceptionally 降级，allOf 并行，避免阻塞 common pool。'
    },
    'Bean 生命周期': {
      referenceAnswer:
        'Spring Bean 生命周期：实例化 → 属性注入 → Aware 回调 → BeanPostProcessor before → @PostConstruct/init → 使用 → @PreDestroy/destroy。AOP 代理多在 initializeBean 阶段创建。循环依赖：单例 + setter/字段注入靠三级缓存提前暴露半成品；构造器注入循环无法解决，应重构设计。BeanCurrentlyInCreationException 打印循环依赖栈。prototype 作用域不参与三级缓存，循环依赖直接失败。',
      excellentAnswer:
        '生命周期到 destroy；循环依赖三级缓存只解决 setter 注入，构造器循环需重构。'
    },
    'JVM 调优': {
      referenceAnswer:
        'p99 抖动排查顺序：1) GC 日志看 STW 和 Full GC 频率；2) jstack 看锁竞争和 BLOCKED 线程；3) 线程池/连接池是否打满；4) 下游超时引发重试放大。工具：JFR、async-profiler、Arthas。调优先修泄漏和大对象、不合理锁，再选 G1/ZGC 和合理堆大小，而非盲目调参。G1 调 -XX:MaxGCPauseMillis；低延迟场景考虑 ZGC。每次调参前后对比 GC 次数、p99 和吞吐。',
      excellentAnswer:
        'p99 先看 GC 和锁，profiler 定位热点，修泄漏后再调堆和 GC 器，调参前后对比指标。'
    }
  },
  'python.json': {
    '装饰器': {
      referenceAnswer:
        '装饰器是闭包包装函数，@decorator 语法糖等价于 func = decorator(func)。用 functools.wraps 保留 __name__、__doc__ 等元信息。带参数装饰器需三层嵌套：外层收参数、中层收函数、内层是 wrapper。常见用途：日志、鉴权、重试、缓存（lru_cache 要求参数可哈希）。类装饰器实现 __call__。注意装饰器顺序从下到上执行。异步函数装饰器需 await 兼容或 functools.wraps + async wrapper。',
      excellentAnswer:
        '@wraps 保留元信息，带参数装饰器三层嵌套，lru_cache 注意参数可哈希。'
    },
    '包依赖治理': {
      referenceAnswer:
        '依赖治理：锁定 requirements.txt/poetry.lock/pnpm-lock，CI 用 pip install --require-hashes 或 poetry install --sync 严格安装。定期 pip-audit/pip-audit 或 safety 扫描 CVE，高危阻断合并。私有 PyPI 镜像审核后才同步公共包。最小化依赖，depcheck 清理未使用包。升级小步进行，每次升级跑全量测试。避免依赖地狱：约束文件 pin 间接依赖版本，记录升级原因和回滚方案。',
      excellentAnswer:
        'lock 文件+CI audit 扫描 CVE，私有源审核，小步升级跑全量测试，清理未用依赖。'
    },
    '缓存设计': {
      referenceAnswer:
        '缓存分层：本地 LRU（进程内热点）+ Redis（跨进程共享）。模式 Cache Aside：读 miss 回源 DB 再写缓存；写 DB 后删缓存（而非双写）避免不一致。防穿透：布隆过滤器或缓存空值短 TTL；防击穿：热点 key 互斥锁或 singleflight 只放一个回源；防雪崩：TTL 加随机抖动。监控命中率、回源 QPS、Redis 延迟。热点 key 可永不过期+异步刷新。Redis 集群注意 hash tag 保证相关 key 同 slot。',
      excellentAnswer:
        'Cache Aside 读 miss 回源写缓存、写 DB 删缓存；布隆/空值防穿透，互斥锁防击穿，TTL 抖动防雪崩。'
    },
    'FastAPI 性能': {
      referenceAnswer:
        'FastAPI 性能要点：IO 密集路由用 async def + await 原生 async 库（asyncpg、httpx）；CPU 密集放 run_in_executor 或独立 worker 进程，避免阻塞事件循环。用 orjson 加速 JSON、减少中间件层数、连接池复用（SQLAlchemy pool_size/max_overflow）。uvicorn workers 数结合 CPU 和 IO  profile，经验值 2*CPU+1 需压测验证。慢接口用 BackgroundTasks 异步化非关键路径。压测用 locust/k6，看 p99、吞吐和错误率。',
      excellentAnswer:
        'IO 用 async 库，CPU 扔 executor/多进程，orjson+连接池复用，locust/k6 压测调 worker。'
    }
  },
  'architect.json': {
    '高可用架构': {
      referenceAnswer:
        '跨机房高可用要先明确 RTO、RPO、读写模型和故障范围，并区分读链路与强一致写链路——写链路跨地域多活成本很高，通常选同城双活 + 单主写、异步复制和快速切换；读链路可更积极做多地缓存和读副本。流量切换分层：入口 DNS/GSLB/网关就近与故障切流，服务层无状态或状态外置，数据层按场景选主备、异步复制、单元化多活，并量化冲突处理成本。故障检测不能只看机器存活，要看业务成功率、延迟、错误率和依赖健康；切换要有 fencing、版本号、幂等、回放、预案、权限和回滚。最难的是数据冲突和故障误判，平时必须用演练验证 RTO/RPO，而不是只在文档里写高可用。设计时还要考虑依赖降级：下游不可用时核心链路只读或返回缓存，避免级联故障。',
      excellentAnswer:
        '先区分读写链路和 RTO/RPO；写链路多活成本高宜单主写+异步复制，读链路可多副本缓存。流量分层切流，切换要 fencing/幂等/回滚，定期演练验证。'
    }
  }
};

function applyPatches(fileName, patches) {
  const filePath = path.join(refsDir, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  for (const [skill, content] of Object.entries(patches)) {
    if (!data[skill]) continue;
    data[skill].referenceAnswer = content.referenceAnswer;
    if (content.excellentAnswer) {
      data[skill].excellentAnswer = content.excellentAnswer;
    }
    changed += 1;
  }

  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return { file: fileName, changed };
}

const results = Object.entries(PATCHES).map(([file, patches]) => applyPatches(file, patches));
console.log(JSON.stringify(results, null, 2));

let under330 = 0;
for (const file of Object.keys(PATCHES)) {
  const data = JSON.parse(fs.readFileSync(path.join(refsDir, file), 'utf8'));
  for (const [skill, entry] of Object.entries(data)) {
    if ((entry.referenceAnswer || '').length < 330) {
      console.log('still short:', file, skill, entry.referenceAnswer.length);
      under330 += 1;
    }
  }
}
console.log('under 330 in patched files:', under330);
