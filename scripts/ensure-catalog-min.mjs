import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogDir = path.join(__dirname, '../data/concrete-refs');
const MIN_LEN = 330;

const EXPAND = {
  'architect.json::高可用架构':
    '切换演练应覆盖入口切流、数据库 failover 和回滚三条路径，并量化 RTO/RPO 是否达标。',
  'java.json::Spring 事务':
    'NESTED 传播用 savepoint 部分回滚；多数据源场景 @Transactional 要指定 transactionManager，否则可能误用默认数据源。',
  'java.json::JVM 调优':
    'heap dump 用 jmap -dump:live 或 OOM 自动 dump，MAT 分析 Dominator Tree 找大对象；Metaspace 持续增长查类加载泄漏；DirectMemory 结合 NIO 和 -XX:MaxDirectMemorySize 排查。',
  'python.json::装饰器':
    'property 本质是数据描述符装饰器；functools.cache（3.9+）是 lru_cache 的无界简化版，注意内存增长风险。',
  'python.json::包依赖治理':
    'SBOM 随发布产物输出，Dependabot/Renovate 自动提 PR 跟进安全补丁；升级失败时按 lock 文件回滚到上一版本。',
  'python.json::缓存设计':
    '本地缓存与 Redis 一致性靠 TTL+主动失效；大 value 考虑压缩，监控慢查询和大 key 对 Redis 的影响。读 miss 时用 singleflight 合并回源防击穿。',
  'java.json::Bean 生命周期':
    'FactoryBean 和 @Configuration 类参与特殊生命周期；@Lazy 延迟初始化要注意首次访问线程安全。ApplicationContext 关闭时触发 destroy 释放资源。',
  'security.json::支付安全':
    'Webhook 重放防护：nonce+时间窗校验；退款/部分退款与原始订单状态机关联校验；支付链路全链路 trace 便于对账与纠纷取证；分账/代扣场景独立验签与权限隔离；支付沙箱与生产密钥严格分离。'
};

for (const [key, extra] of Object.entries(EXPAND)) {
  const [file, skill] = key.split('::');
  const filePath = path.join(catalogDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const entry = data[skill];
  if (!entry) {
    console.warn('missing', key);
    continue;
  }
  let ref = String(entry.referenceAnswer || '').trim();
  if (!ref.includes(extra.slice(0, 16))) {
    ref = /[。！？]$/.test(ref) ? `${ref}${extra}` : `${ref}。${extra}`;
  }
  entry.referenceAnswer = ref;
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(key, entry.referenceAnswer.length);
}

let short = 0;
for (const file of fs.readdirSync(catalogDir).filter((f) => f.endsWith('.json'))) {
  const data = JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8'));
  for (const [skill, entry] of Object.entries(data)) {
    const len = (entry.referenceAnswer || '').length;
    if (len < MIN_LEN) {
      console.log('still short', file, skill, len);
      short += 1;
    }
  }
}
console.log('remaining', short);
