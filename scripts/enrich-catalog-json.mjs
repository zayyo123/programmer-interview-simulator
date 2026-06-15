import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isGenericTemplateReferenceAnswer } from '../shared/referenceAnswerResolver.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const approved = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/approved-questions.json'), 'utf8'));
const generic = approved.questions.filter((q) => isGenericTemplateReferenceAnswer(q.referenceAnswer));

function factForSkill(skill = '', category = '', question = '') {
  const text = `${skill} ${question}`;
  const rules = [
    [/RAID|磁盘故障/, 'RAID0 条带无冗余；RAID1 镜像；RAID5/6 允许坏 1/2 块盘；RAID10 性能+冗余。故障处理：mdadm -D 看 State、隔离坏盘 mdadm --fail、热备替换、观察 rebuild；完成后 fsck/读写校验；业务侧只读或切备库。'],
    [/LVM|扩容/, 'lvextend 扩逻辑卷 + resize2fs/xfs_growfs 扩文件系统；先确认 VG 有空余 PV；在线扩容注意 IO 峰值；扩容前快照/备份。'],
    [/抓包|tcpdump/, 'tcpdump -i eth0 host x.x.x.x and port 443 -w cap；Wireshark 看三次握手、重传、RTT；配合 ss -s 看队列。'],
    [/SYN Flood/, 'SYN 半连接占满 backlog；防护：syn cookies、调大 tcp_max_syn_backlog、CDN/WAF 清洗、限速；监控 SYN_RECV 堆积。'],
    [/Nginx 限流/, 'limit_req_zone + limit_req burst/nodelay；limit_conn 限制连接；429 返回；配合 upstream keepalive 和超时。'],
    [/Nginx 缓存/, 'proxy_cache_path 配 keys_zone；proxy_cache_valid 按状态码 TTL；缓存键含 URI/参数；注意鉴权接口禁缓存。'],
    [/Keepalived|VIP/, 'VRRP 选举 master 持 VIP；健康检查脚本失败则降优先级；注意脑裂用 nopreempt/单播/防火墙放行 VRRP。'],
    [/Prometheus/, 'TSDB 块压缩与 retention；高基数标签会爆内存；remote write 长期存储；recording rule 预聚合。'],
    [/Grafana/, 'Panel 用 PromQL；变量 templating 切换环境；告警 contact point；Dashboard as code 版本化。'],
    [/binlog|恢复/, 'mysqlbinlog 按位点回放；全量+binlog 增量；验证 gtid 一致性；恢复在隔离库演练再切流。'],
    [/Redis Sentinel|Cluster/, 'Sentinel 监控主从自动 failover；Cluster 16384 slot，MOVED/ASK 重定向；客户端需集群感知。'],
    [/Kafka Broker/, 'under-replicated 看 ISR；Controller 选举；磁盘满/网络分区导致 leader 不可用；重分配分区均衡。'],
    [/Ingress|CoreDNS|Pod|PV|污点|镜像/, 'K8s 排障：kubectl describe/events/logs；DNS 看 Corefile 上游；Ingress 看 backend/endpoints；PV 绑定 PVC 与 StorageClass。'],
    [/浏览器渲染|渲染路径/, 'HTML 解析 DOM，CSS 构建 CSSOM，合成渲染树，Layout，Paint，Composite；关键路径优化减少阻塞 CSS/JS，defer/async。'],
    [/首屏|LCP|Core Web Vitals/, 'LCP 看最大内容元素加载；优化关键资源优先级、图片尺寸、CDN、SSR；CLS 固定尺寸；INP 减少长任务。'],
    [/代码分割|Tree Shaking/, '动态 import() 路由级拆包；sideEffects:false 助 tree-shaking；分析 bundle 用 rollup-plugin-visualizer。'],
    [/CORS|跨域/, '预检 OPTIONS；Access-Control-Allow-Origin 勿用 * 带凭证；Allow-Methods/Headers；服务端代理同源。'],
    [/XSS|CSRF/, 'XSS：转义输出、CSP、HttpOnly Cookie；CSRF：SameSite、CSRF Token、双重 Cookie、校验 Referer。'],
    [/React 状态|Hooks 闭包|错误边界|渲染性能/, '状态就近+Context/Redux；useCallback/useMemo 避免子组件重渲染；ErrorBoundary 捕获渲染错误；React.memo 列表项。'],
    [/Vue 响应式/, 'Vue3 Proxy 依赖收集 effect；ref/reactive 区别；computed 缓存；避免解构丢失响应式用 toRefs。'],
    [/虚拟滚动/, '只渲染可视区+缓冲区；定高列表简单，动态高需测量缓存；减少 DOM 节点。'],
    [/事件循环/, '宏任务 script/setTimeout、微任务 promise.then；每宏任务清空微队列；async/await 是微任务。'],
    [/Service Worker|缓存策略/, 'SW 拦截 fetch；CacheFirst/NetworkFirst 策略；版本更新 skipWaiting+clients.claim。'],
    [/微前端/, 'qiankun/single-spa 沙箱+路由；样式隔离 shadow DOM；公共依赖 externals；子应用独立部署。'],
    [/RAG|向量|Embedding|LLM 评测|提示词注入/, 'RAG：切分、embedding、向量检索、重排、引用溯源；评测集覆盖边界；防注入：指令隔离、输出过滤、工具权限最小化。'],
    [/威胁建模|STRIDE|SDL|越权|WAF|渗透/, 'STRIDE 六类威胁；SDL 设计评审+威胁建模+测试；越权：水平/垂直，测 IDOR；WAF 误报调规则。'],
    [/接口自动化|UI 自动化|压测|回归/, '接口：pytest+requests/RestAssured；数据驱动；CI 并行。压测：JMeter/k6 场景+阈值；全链路压测隔离环境。'],
    [/测试策略|用例设计|缺陷分级/, '策略：风险驱动，核心链路优先；用例：等价类、边界、状态迁移；缺陷按严重级+影响面分级。']
  ];

  for (const [pattern, fact] of rules) {
    if (pattern.test(text)) return fact;
  }

  return `${skill}：结合题目「${question.replace(/[？?]$/, '')}」，需要讲清定义/流程、3-5 步实操（命令、配置、指标名）、常见坑和验证方式（日志/监控/对账），避免只讲泛泛原则。`;
}

function buildEntry(q) {
  const fact = factForSkill(q.skill, q.category, q.question);
  const referenceAnswer = `${fact}`;
  const excellentAnswer = `我会先给结论，再展开：${fact}`;
  return { referenceAnswer, excellentAnswer };
}

const fileMap = { 运维: 'ops.json', 前端: 'frontend.json', 安全: 'security.json', 测试: 'qa.json', AI: 'ai.json' };
for (const [category, file] of Object.entries(fileMap)) {
  const entries = generic.filter((q) => q.category === category);
  const data = Object.fromEntries(entries.map((q) => [q.skill, buildEntry(q)]));
  fs.writeFileSync(path.join(__dirname, `../data/concrete-refs/${file}`), `${JSON.stringify(data, null, 2)}\n`);
  console.log(file, Object.keys(data).length);
}
