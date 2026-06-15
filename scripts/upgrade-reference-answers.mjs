import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { questionBank, roleLabels, levelLabels, styleLabels } from '../src/questions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 内置题：在优秀答案基础上补充机制、命令、边界等硬性技术细节 */
const SUPPLEMENTS = {
  mysql_001:
    'B+ 树非叶子节点仅存键和指针，叶子节点通过链表相连，适合范围扫描和排序。',
  mysql_002:
    'InnoDB 可重复读下：普通快照读靠 MVCC+Read View；当前读（SELECT FOR UPDATE 等）会加 next-key lock 防范围插入。死锁排查用 SHOW ENGINE INNODB STATUS，看持锁/等待关系，优化统一加锁顺序和索引命中。',
  mysql_003:
    'Explain 重点看 type 是否 ALL、key 是否命中、rows 是否过大、Extra 是否有 Using filesort/Using temporary。深分页可改游标分页或延迟关联；新索引要评估写入成本和存储成本。',
  redis_001:
    'Redis 6.0+ IO 线程处理网络读写，命令执行仍在主线程；hash/skiplist/quicklist 针对典型操作优化，RESP 协议解析开销低。',
  redis_002:
    '命令层：SLOWLOG、INFO commandstats、redis-cli --bigkeys、MEMORY USAGE。网络层：连接数、带宽、跨机房 RTT、客户端重试放大。内存层：maxmemory、淘汰策略、mem_fragmentation_ratio。持久化：AOF rewrite、RDB fork 的 CPU/磁盘抖动。结合 latency doctor 和时间线收敛，避免直接重启。',
  redis_003:
    'Cache Aside：写路径先提交 DB 再删缓存；删缓存失败要 MQ/binlog/重试补偿；必须有 TTL 兜底；并发读写注意延迟双删或版本号；余额等强一致场景不能只靠缓存方案。',
  network_001:
    'TIME_WAIT 在主动关闭方等待迟到报文失效；排查超时要分段看 DNS、TCP connect、重传率、连接池、SYN backlog、带宽、跨机房 RTT。',
  network_002:
    'TLS 会话复用可降低握手开销；注意证书过期、SNI 不匹配、keep-alive 与连接池配置不一致导致的建连慢。',
  network_003:
    '400/401/403/404 通常不可重试；408/429/502/503/504 可有限重试。写接口幂等键+唯一索引+状态机；指数退避+随机抖动+熔断防重试风暴。',
  java_001:
    'put：hash 定位桶→冲突拉链表/红黑树（链表≥8 且容量≥64 树化）；容量 2 的幂；负载因子 0.75 触发扩容 rehash。HashMap 非线程安全。',
  java_005:
    '无界队列会使 maximumPoolSize 失效；CallerRunsPolicy 形成反压但可能阻塞提交线程；核心与低优先级任务应分池隔离并监控队列长度。',
  java_007:
    'volatile 不保证 i++ 原子性；ReentrantLock 须在 finally unlock；ConcurrentHashMap 桶级锁/CAS，不能简单 HashMap+大锁替代。',
  system_001:
    '短码可用发号器+Base62；301 永久跳转利于 SEO，302 便于变更和统计；碰撞用唯一约束或重试生成；读链路缓存+DB 持久化，考虑过期和恶意链接检测。',
  system_002:
    'Redis 预扣成功但落库失败要有超时取消和库存回补；热点商品做隔离和本地缓存；防刷结合限流+验证码+风控规则。',
  backend_003:
    '调度幂等：任务实例 ID+状态机/分布式锁；执行器记录开始/结束状态；死信队列和人工介入；观测执行耗时、成功率、积压深度。',
  os_003:
    'epoll 用就绪队列返回活跃 fd，适合大量长连接；Reactor 耗时业务应放 worker 池，避免阻塞 event loop。',
  frontend_002:
    '区分 runtime error、资源 404、接口超时、SSR hydration 失败；止血优先回滚静态资源；治理补 source map、灰度、可用性监控。',
  go_002:
    'pprof goroutine/block profile；常见泄漏：channel 阻塞无消费者、未 context cancel、ticker 未 stop、无界重试协程。',
  go_004:
    'channel 谁发送谁关闭；context 负责取消传播；mutex 保护共享 map/计数器，临界区避免慢 I/O。',
  python_002:
    'cProfile/py-spy 找热点；CPU 密集受 GIL 限制用多进程/C 扩展；I/O 密集查连接池和下游阻塞，勿一概归因 GIL。',
  backend_code_003:
    '幂等：先插处理中记录+唯一索引兜底，成功则返回历史结果；处理中超时要恢复；支付回调与 MQ 消费都要业务单号去重。'
};

function polishInterviewTone(text) {
  return String(text)
    .replace(/\s+/g, ' ')
    .replace(/，，+/g, '，')
    .replace(/。。+/g, '。')
    .replace(/我会先把/g, '首先将')
    .replace(/我会先/g, '首先')
    .replace(/我会/g, '')
    .replace(/我最近参与的是/g, '（示例）')
    .replace(/（示例）一个订单履约系统，一个订单履约系统/g, '（示例）订单履约系统，')
    .replace(/（示例）某订单履约系统，一个订单履约系统/g, '（示例）订单履约系统，')
    .replace(/我想讲一个/g, '（示例）')
    .replace(/我做过一个/g, '（示例）')
    .replace(/我参与过一次/g, '（示例）')
    .replace(/我处理过一次/g, '（示例）')
    .replace(/我主导过一次/g, '（示例）')
    .replace(/我的职责是/g, '个人职责包括')
    .replace(/我主要负责/g, '主要职责包括')
    .replace(/我负责/g, '职责包括')
    .replace(/技术上用的是/g, '技术栈包括')
    .replace(/技术上使用/g, '技术栈包括')
    .replace(/我重点做过/g, '关键实现包括')
    .replace(/我在前端上做了/g, '前端侧采用')
    .replace(/我通过/g, '通过')
    .replace(/我没有简单地/g, '不应简单地')
    .replace(/我没有把所有/g, '不应将所有')
    .replace(/我没有直接/g, '不应直接')
    .replace(/我不会一上来就建议/g, '不应一上来就建议')
    .replace(/我不会一上来就/g, '不应一上来就')
    .replace(/我不会一上来/g, '不应一上来')
    .trim();
}

function uniqueSentences(base, extra) {
  let merged = base.trim();
  const chunks = String(extra || '')
    .split(/(?<=[。；！？])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  for (const chunk of chunks) {
    const signature = chunk.slice(0, Math.min(20, chunk.length));
    if (merged.includes(signature)) continue;
    if (chunk.length > 24 && merged.includes(chunk.slice(0, Math.min(40, chunk.length)))) continue;
    merged += /[。；！？]$/.test(merged) ? '' : '。';
    merged += /[。；！？]$/.test(chunk) ? chunk : `${chunk}。`;
  }
  return merged.replace(/；。/g, '；').replace(/。。+/g, '。').trim();
}

function buildReferenceAnswer(question) {
  const excellent = question.excellentAnswer?.trim() || '';
  const current = question.referenceAnswer?.trim() || '';

  if (!excellent) return polishInterviewTone(current);

  const polishedExc = polishInterviewTone(excellent);
  const polishedCur = polishInterviewTone(current);

  const longer = polishedCur.length >= polishedExc.length ? polishedCur : polishedExc;
  const shorter = polishedCur.length >= polishedExc.length ? polishedExc : polishedCur;
  let merged = uniqueSentences(longer, shorter);

  const supplement = SUPPLEMENTS[question.id];
  if (supplement) {
    merged = uniqueSentences(merged, supplement);
  }

  return polishInterviewTone(merged);
}

function shouldUpdate(question, merged) {
  const current = question.referenceAnswer?.trim() || '';
  if (!current) return true;
  if (merged.length < current.length * 0.97) return false;
  if (merged === current) return false;
  return merged.length > current.length || merged !== current;
}

function writeQuestionsJs(bank) {
  const file = path.join(__dirname, '../src/questions.js');
  const content = `export const questionBank = ${JSON.stringify(bank, null, 2)};

export const roleLabels = ${JSON.stringify(roleLabels, null, 2)};

export const levelLabels = ${JSON.stringify(levelLabels, null, 2)};

export const styleLabels = ${JSON.stringify(styleLabels, null, 2)};
`;
  fs.writeFileSync(file, content, 'utf8');
}

function upgradeApproved() {
  const filePath = path.join(__dirname, '../data/approved-questions.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;

  data.questions = data.questions.map((question) => {
    const referenceAnswer = buildReferenceAnswer(question);
    if (!shouldUpdate(question, referenceAnswer)) return question;
    changed += 1;
    return { ...question, referenceAnswer };
  });

  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return changed;
}

const upgradedBuiltin = questionBank.map((question) => ({
  ...question,
  referenceAnswer: buildReferenceAnswer(question)
}));
writeQuestionsJs(upgradedBuiltin);
const approvedChanged = upgradeApproved();

const builtinAvg = Math.round(
  upgradedBuiltin.reduce((sum, item) => sum + item.referenceAnswer.length, 0) / upgradedBuiltin.length
);
const approved = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/approved-questions.json'), 'utf8')).questions;
const approvedAvg = Math.round(
  approved.reduce((sum, item) => sum + item.referenceAnswer.length, 0) / approved.length
);

console.log(
  JSON.stringify({ builtinAvgRefLen: builtinAvg, approvedAvgRefLen: approvedAvg, approvedChanged }, null, 2)
);
