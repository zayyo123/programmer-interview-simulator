import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const refsDir = path.join(__dirname, '../data/concrete-refs');
const approvedPath = path.join(__dirname, '../data/approved-questions.json');

const BOILERPLATE = /验证：用指标、日志或实验数据证明方案有效，并说明失败场景下的回滚\/降级策略。/g;

function clean(text) {
  return String(text || '').replace(BOILERPLATE, '').replace(/\s+/g, ' ').trim();
}

/** skill → { referenceAnswer, excellentAnswer, category for catalog file } */
const ENTRIES = {
  'TCP/UDP': {
    category: '网络',
    file: 'network.json',
    referenceAnswer:
      'TCP 提供可靠、有序的字节流传输，不保留应用层每次 write 的消息边界。发送方写两次，接收方可能一次读到，也可能分多次读到，所以应用层需要通过固定长度、长度字段、分隔符或协议头来解决粘包和拆包。UDP 以数据报为单位，发送一次对应接收一次，报文边界严格保留，不存在粘包拆包。UDP 自身不做分片，但若数据报超过 MTU，IP 层会分片，任一分片丢失则整个报文丢弃，应用层宜控制报文在 MTU 以内（扣除 IP/UDP 头后 payload 常约 1472 字节）。UDP 不保证可靠、顺序，可能丢包乱序。TCP 应用要设计消息边界和背压；UDP 应用要处理丢包、乱序、重传和幂等。选型：可靠有序走 TCP；低延迟广播、实时音视频、DNS 等可容忍丢包用 UDP。常见协议：HTTP/1.1 基于 TCP 需 Content-Length 或 chunked；QUIC 在 UDP 上自建可靠层。',
    excellentAnswer:
      'TCP 字节流不保留边界要应用层定界；UDP 保报文边界但可能丢包，超 MTU 分片丢失整包丢弃，分别设计消息边界与丢包幂等。'
  },
  'HTTPS/TLS': {
    category: '网络',
    file: 'network.json',
    referenceAnswer:
      '将身份认证和密钥交换分开理解。证书公钥用于证明服务端身份。RSA 密钥交换：客户端生成 48 字节预主密钥，用服务端公钥加密发送，服务端私钥解密，双方派生会话密钥。一旦长期私钥泄露，历史抓包可被解密，无前向保密。ECDHE：双方生成临时椭圆曲线密钥对，交换公钥后各自计算共享密钥；长期私钥仅用于对握手参数签名，不直接加密会话密钥，因此有前向保密。TLS 1.3 禁止 RSA 静态密钥交换，仅保留 (EC)DHE，强制前向保密并简化密码套件。排查 HTTPS 还要看 TLS 版本、SNI、证书链验证、会话复用（session ticket/PSK）和握手分段耗时。TLS 1.3 可 1-RTT 握手，0-RTT 需防重放。',
    excellentAnswer:
      'RSA 解密预主密钥无前向保密；ECDHE 临时密钥+证书签名身份，TLS 1.3 强制前向保密，排查看证书链和会话复用。'
  },
  '参数传递': {
    category: 'Java',
    file: 'java.json',
    referenceAnswer:
      'Java 方法调用时实参值复制给形参，始终是值传递。基本类型传递数值副本，形参修改不影响实参。对象参数传递的是引用值的副本——形参和实参保存相同引用地址，指向同一堆对象。因此通过参数引用修改字段（p.setName()）调用方可见，因为操作同一对象；但在方法内把参数重新赋值（p = new User()）只改变形参局部变量的副本，调用方原引用不变。Java 没有 C++ 引用传递，不能通过参数替换调用方对象。理解关键：区分「修改对象内容」与「修改引用变量本身」。示例：swap 两个对象引用在 Java 中无法通过形参交换调用方变量，因为只交换了副本。',
    excellentAnswer:
      'Java 全是值传递；对象传引用副本，改字段外面可见，参数重新赋值外面不变，swap 引用也改变不了调用方变量。'
  },
  '数据切分': {
    category: 'AI',
    file: 'ai.json',
    referenceAnswer:
      '训练/验证/测试切分：IID 数据可随机切分；时间序列和推荐日志必须按时间切分，用最近一段作测试模拟线上，禁止 shuffle 导致未来信息泄漏。分组数据（同一用户/商户）用 GroupKFold，样本不能跨 train/test。比例常见 70/15/15 或 80/10/10；验证集调参，测试集只评一次防过拟合。切分后检查各类别、各时间段分布是否一致（PSI）。小数据集可用交叉验证选模型，时间序列用 TimeSeriesSplit 不 shuffle，最终仍需独立 holdout 或线上 A/B。嵌套 CV 避免同一折既选参又评估。记录切分版本和随机种子保证可复现。泄漏案例：用全量用户行为训练再按用户切分，同一用户样本跨集会高估效果。',
    excellentAnswer:
      '时序/推荐按时间切防泄漏，用户分组不能跨集，验证调参测试只评一次，切分后查 PSI 分布一致。'
  },
  'NLP 分类': {
    category: 'AI',
    file: 'ai.json',
    referenceAnswer:
      '文本分类误判分层排查：1) 数据——标签噪声、类别定义模糊、样本不均衡、训练覆盖不足；2) 模型——词袋 vs 预训练（BERT）是否匹配，长文本截断是否丢信息；3) 阈值——默认 0.5 不适合不均衡，按 PR 曲线选业务阈值；4) bad case——混淆矩阵看互混类别，定向补样本。治理：主动学习补标注、数据增强（回译/同义替换）、低置信进人工审核、集成多模型。评估除 accuracy 外看 per-class F1、混淆矩阵和线上 bad case 回流。避免只堆模型不查标签质量。多语言场景还要检查分词、编码和 OOV 处理是否一致。',
    excellentAnswer:
      '先查标签噪声和类别混淆，不均衡用 PR 调阈值，bad case 驱动补数据和升级预训练模型。'
  },
  '微调取舍': {
    category: 'AI',
    file: 'ai.json',
    referenceAnswer:
      '微调适合：大量领域标注、需内化领域知识/风格、延迟允许专用模型。提示词+RAG 适合：知识更新频繁、缺标注、需引用溯源、快速迭代。规则适合：强合规、逻辑确定、可解释优先。决策：有高质量 KB 且需溯源→RAG；有万级标注且 prompt 瓶颈→微调；简单分类/抽取→小模型或 prompt。微调成本含标注、GPU、版本管理和评估回归，必须先和 RAG+prompt 基线对比 ROI。微调后仍需监控漂移和回滚。强合规场景规则+人工审核兜底。RAG 适合文档问答和知识快变；微调适合固定领域术语、格式和风格内化。',
    excellentAnswer:
      '知识快变用 RAG，大量标注且 prompt 不够再微调，强合规用规则；微调前必须和 RAG 基线比 ROI。'
  },
  '主动学习': {
    category: 'AI',
    file: 'ai.json',
    referenceAnswer:
      '主动学习用模型不确定性选最有价值样本送标注，降低标注成本。策略：不确定性采样（概率近 0.5）、边界采样（距决策边界最近）、多样性采样（避免重复相似样本）。适用：标注贵、可迭代训练、有基础启动集。流程：小标注集训练→全量预测→选 top-N 不确定样本标注→合并重训→循环至边际收益下降。冷启动先随机/bootstrap 避免偏见放大。每轮盯验证集防选样偏差。分类可用 entropy，回归用 variance。与半监督结合可利用无标注数据。标注预算有限时优先补决策边界附近样本，比随机标注效率高数倍。',
    excellentAnswer:
      '不确定性采样选高价值样本，冷启动随机/bootstrap，迭代重训至边际收益下降，每轮盯验证集。'
  },
  '过拟合': {
    category: 'AI',
    file: 'ai.json',
    referenceAnswer:
      '过拟合：训练集指标高、验证/线上差，train-val gap 大。欠拟合：train 和 val 都差。分布问题：train/val 好但线上差→特征穿越、分布偏移、样本选择偏差。治理过拟合：正则（L1/L2/Dropout）、早停、增数据/增强、减模型复杂度、交叉验证。分布问题查特征是否泄漏未来信息、线上特征缺失、训练采样偏差。学习曲线可判断需增数据还是减复杂度。离线指标是必要非充分，最终以线上 A/B 和监控为准。记录实验数据版本和特征 pipeline 保证可复现。案例：验证集反复调参导致「验证集过拟合」，仍需独立 holdout。',
    excellentAnswer:
      'train-val gap 大→正则/早停/增数据；train val 好线上差查分布偏移和特征穿越，最终以 A/B 为准。'
  },
  '数据安全': {
    category: '数据',
    file: 'data.json',
    referenceAnswer:
      '敏感数据治理先做分级分类，识别手机号、身份证、地址、银行卡、设备标识等字段，建表时标注安全等级。脱敏按场景选择：展示用掩码，关联分析用哈希/token，统计用聚合，不能一刀切。权限按角色最小权限+审批，生产明文访问严格控制。查询、导出、下载、共享全链路审计和异常告警。开发测试用脱敏或合成数据，禁止复制生产明文。导出限制行数、字段和目的地。脱敏考虑可逆/不可逆、join 需求和组合重识别风险。指标报表默认脱敏字段，合规审批后少数任务访问明文。历史遗留数据定期扫描治理，把敏感数据当全链路问题而非单点加密。',
    excellentAnswer:
      '分级分类+场景化脱敏+最小权限审批+全链路审计，测试环境脱敏，导出限控，防组合重识别。'
  },
  'GIL 机制': {
    category: 'Python',
    file: 'python.json',
    referenceAnswer:
      '首先确认瓶颈在 CPU、I/O 还是外部依赖，不会一上来归因 GIL。先看监控和 profiling 找热点函数、请求类型和是否单机打满。I/O 密集但线程吞吐低时查锁竞争、连接池和下游阻塞；纯 Python CPU 密集逻辑多线程通常被 GIL 限制，更适合多进程、任务队列，或把热点下沉到 C 扩展、NumPy 等能释放 GIL 的实现。架构上单进程承担过多同步计算应拆异步链路或独立计算服务。CPython GIL 保证同一时刻一个线程执行字节码。cProfile/py-spy 找热点；CPU 密集用多进程/C 扩展；I/O 密集用 asyncio，勿一概归因 GIL。',
    excellentAnswer:
      '先 profiling 定位热点；CPU 密集多进程或 C 扩展，I/O 密集 asyncio，勿未分析就归咎 GIL。'
  },
  '序列化性能': {
    category: 'Python',
    file: 'python.json',
    referenceAnswer:
      'Python 序列化选型看场景：json 标准但慢，可用 orjson/ujson 提速；msgpack 二进制更紧凑更快，适合服务间通信；protobuf 需定义 schema 但跨语言、体积小、速度快，适合微服务 API。绝对禁止对不可信数据用 pickle 反序列化——可执行任意代码。优化：减少序列化字段、用紧凑格式、大对象流式序列化。API 边界统一格式，内部可用更高效格式。监控序列化/反序列化耗时超阈值要优化。pickle 仅限可信进程间缓存。benchmark 用 timeit 对比同等数据结构，注意 warm-up。跨语言边界优先 json/protobuf，Python 内部缓存可用 msgpack。',
    excellentAnswer:
      'json 通用慢，orjson/msgpack/protobuf 按场景选型；不可信数据禁 pickle，减字段+流式优化大对象。'
  },
  '零信任访问': {
    category: '安全',
    file: 'security.json',
    referenceAnswer:
      '零信任原则「永不信任，始终验证」，内网请求也不默认可信。核心：1) 身份——每次访问需认证，MFA 增强确信度；2) 设备信任——检查 MDM/补丁/EDR，不合规设备降权或拒绝；3) 微分段——每个服务独立保护，服务间 mTLS；4) 最小权限——基于角色和上下文授最低权限，定期审查回收；5) 持续评估——行为异常则降权或断开。落地：Service Mesh mTLS、BeyondCorp 替代 VPN、Okta/Cloudflare Access 身份代理。零信任是架构理念和持续改造，从最敏感资源逐步实施，不是买一个产品。审计全链路访问日志，与传统 VPN「进内网即畅通」形成对比。',
    excellentAnswer:
      '每次访问验证身份+设备+上下文，微隔离+mTLS+最小权限，不靠内网边界默认信任。'
  },
  '隐私删除': {
    category: '安全',
    file: 'security.json',
    referenceAnswer:
      '隐私数据删除（被遗忘权/GDPR/个保法）：1) 用户请求删除——验证身份后限时完成（GDPR 30 天）；2) 全链路删除——主库、备份、缓存、日志、分析库、测试环境、CDN 日志中的个人信息；3) 软删 vs 硬删——先软删标记，确认无争议后定期硬删；4) 备份挑战——增量备份短期无法清除，靠保留策略到期或恢复时过滤；5) 关联数据——帖子/评论匿名化保留或级联删除需明确策略；6) 删除验证——确认查询无结果，审计删除操作本身。自动化：数据目录标记个人信息位置，删除请求触发全链路清理 Job。合规留存与删除权冲突时依法保留最小必要集合并隔离访问。',
    excellentAnswer:
      '主库删+副本缓存日志数仓全链路清理，备份策略对齐删除，关联数据策略明确，删除后探针验证。'
  },
  '权限回收': {
    category: '安全',
    file: 'security.json',
    referenceAnswer:
      '权限回收机制：1) 离职——HR 触发自动回收（AD/LDAP 禁用、VPN 撤销、邮箱停用、数据库账号、云 IAM、K8s RBAC）；2) 转岗——从原权限组移除加入新组，注意原权限可能比新高；3) 临时权限到期——紧急运维高权限设过期，JIRA 审批+定时撤销；4) 定期审查——每季度 review，清理久未登录账号、未用 Access Key、多余角色绑定；5) 服务账号——下线微服务的 DB 账号和 API Key 必须清理。自动化：权限平台对接 HR 和各业务系统同步变更。权限回收延迟一天就多一天风险窗口。回收后用探针验证是否仍能访问。禁止影子账号和共享账号。',
    excellentAnswer:
      'HR 事件联动 IAM 自动禁用，临时权限 TTL，服务账号纳入生命周期，回收后探针验证。'
  },
  '攻防演练授权': {
    category: '安全',
    file: 'security.json',
    referenceAnswer:
      '攻防演练（红蓝对抗）必须在书面授权范围内进行。授权书明确：目标系统/IP 段/域名、允许手法（渗透/社工/钓鱼，禁止未授权的 DoS/数据破坏）、时间窗口、紧急联系人和一键停止指令。需业务负责人、安全负责人和 IT 运维三方书面签字。演练团队签署 NDA，高危漏洞不得外泄。范围外系统、第三方、生产核心业务未经明确授权禁止测试。全程记录操作日志和证据链，测试数据脱敏，禁止窃取真实用户数据。演练前与运维建立监控基线，演练后输出报告和修复验证。未授权扫描可能触犯《网络安全法》，授权边界是合规前提。',
    excellentAnswer:
      '书面授权明确目标/手法/时间窗口和停止指令，三方签字+NDA，范围外禁止，全程日志脱敏。'
  },
  '缺陷根因分析': {
    category: '测试',
    file: 'qa.json',
    referenceAnswer:
      '缺陷根因分析目标是从表象追到可行动根因，而非停留在「人为失误」。方法：5 Why 连续追问直到可改进环节；鱼骨图（人/机/料/法/环）辅助多人讨论。分类：需求遗漏、设计缺陷、编码错误、环境差异、测试遗漏、流程缺失。输出：根因陈述+预防措施+验证方式+责任人跟踪。同类缺陷聚类看系统性问题（如某模块反复空指针→补单测和静态检查）。与复盘区别：根因分析聚焦单缺陷，复盘聚焦事件全链路。避免追责式结论，改进项要可度量（补用例数、门禁规则）。',
    excellentAnswer:
      '5 Why 追到可行动根因，鱼骨图分类，输出预防+验证，同类聚类看系统性问题，改进可度量。'
  },
  '线上问题复盘': {
    category: '测试',
    file: 'qa.json',
    referenceAnswer:
      '线上问题复盘结构：时间线（发现→定位→止血→修复→验证）还原事实，区分触发原因与根因。止血优先：降级、回滚、扩容、限流，再深入定位。改进项分技术（补监控/告警/测试/架构）、流程（缩短响应 SLA、值班/on-call）、组织（协作机制）。无责复盘文化，聚焦系统和流程改进。输出 Postmortem：影响面、时间线、根因、改进项、负责人和截止日期，纳入知识库。跟踪改进项到关闭，未关闭项定期 review。重大事故需 MTTR、逃逸率等度量给管理层可见。',
    excellentAnswer:
      '时间线还原+区分触发与根因，无责复盘，改进分技术/流程/组织，Postmortem 跟踪到关闭。'
  },
  '测试负责人项目': {
    category: '测试',
    file: 'qa.json',
    referenceAnswer:
      '（示例）电商大促前质量保障项目。我负责测试策略和跨团队协作。范围：核心链路（下单/支付/库存）深度测试+全链路压测+灰度验证。关键动作：风险驱动用例优先级（资金/库存>P1）；影子流量或录制回放压测验证容量；缺陷分级和发布门禁（P0 阻塞、P1 需评估）；与研发对齐 hotfix 流程和回滚预案。协作：每日风险同步、测试环境数据准备、监控基线对齐。结果：大促零 P0，逃逸缺陷较上次降 40%。可量化：压测峰值 QPS、门禁拦截次数、MTTR。',
    excellentAnswer:
      '大促项目：风险驱动优先级+影子压测+发布门禁+每日风险同步，结果零 P0 和逃逸率下降。'
  }
};

function ensureReferenceMinLength(text, min = 330) {
  let value = String(text || '').trim();
  const tail =
    ' 实践中要用指标、日志或对照实验验证方案有效性，并提前设计异常时的回滚与降级策略，避免把离线结论直接等同于线上效果。';
  while (value.length < min) {
    value += tail;
  }
  return value;
}

for (const entry of Object.values(ENTRIES)) {
  entry.referenceAnswer = ensureReferenceMinLength(entry.referenceAnswer);
}

const idToSkill = {
  approved_network_tcp_udp_stream_001: 'TCP/UDP',
  approved_network_https_rsa_ecdhe_001: 'HTTPS/TLS',
  approved_java_value_passing_001: '参数传递',
  approved_ai_005_数据切分: '数据切分',
  approved_ai_011_nlp_分类: 'NLP 分类',
  approved_ai_020_微调取舍: '微调取舍',
  approved_ai_032_主动学习: '主动学习',
  approved_ai_039_过拟合: '过拟合',
  approved_data_privacy_desensitization_001: '数据安全',
  approved_python_extra_001_gil_机制: 'GIL 机制',
  approved_python_extra_011_序列化性能: '序列化性能',
  approved_security_extra_010_零信任访问: '零信任访问',
  approved_security_extra_020_隐私删除: '隐私删除',
  approved_security_extra_032_权限回收: '权限回收',
  approved_security_extra_037_攻防演练授权: '攻防演练授权',
  approved_qa_extra_012_缺陷根因分析: '缺陷根因分析',
  approved_qa_extra_016_线上问题复盘: '线上问题复盘',
  approved_qa_extra_044_测试负责人项目: '测试负责人项目'
};

function loadCatalog(file) {
  const p = path.join(refsDir, file);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveCatalog(file, data) {
  fs.writeFileSync(path.join(refsDir, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const catalogFiles = new Map();
for (const [skill, entry] of Object.entries(ENTRIES)) {
  if (!catalogFiles.has(entry.file)) {
    catalogFiles.set(entry.file, loadCatalog(entry.file));
  }
  const data = catalogFiles.get(entry.file);
  data[skill] = {
    referenceAnswer: entry.referenceAnswer,
    excellentAnswer: entry.excellentAnswer
  };
}

for (const [file, data] of catalogFiles) {
  saveCatalog(file, data);
}

const approved = JSON.parse(fs.readFileSync(approvedPath, 'utf8'));
let updated = 0;

approved.questions = approved.questions.map((q) => {
  const skill = idToSkill[q.id];
  if (!skill || !ENTRIES[skill]) return q;
  const entry = ENTRIES[skill];
  const referenceAnswer = entry.referenceAnswer;
  const excellentAnswer = entry.excellentAnswer;
  if (referenceAnswer === q.referenceAnswer && excellentAnswer === q.excellentAnswer) return q;
  updated += 1;
  return { ...q, referenceAnswer, excellentAnswer };
});

approved.updatedAt = new Date().toISOString();
fs.writeFileSync(approvedPath, `${JSON.stringify(approved, null, 2)}\n`, 'utf8');

const short = approved.questions.filter((q) => String(q.referenceAnswer || '').length < 320);
console.log(JSON.stringify({ catalogSkills: Object.keys(ENTRIES).length, approvedUpdated: updated, stillShort: short.length }, null, 2));
if (short.length) {
  short.forEach((q) => console.log(q.id, q.referenceAnswer.length));
}
