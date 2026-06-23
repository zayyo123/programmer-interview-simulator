import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const refsDir = path.join(__dirname, '../data/concrete-refs');

function load(name) {
  const p = path.join(refsDir, name);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function save(name, data) {
  fs.writeFileSync(path.join(refsDir, name), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

const PATCHES = {
  'frontend.json': {
    'React 基础': {
      referenceAnswer:
        'React 核心特性：1) 组件化——UI 拆成可复用、可测试的独立单元，通过 props 组合；2) 声明式 UI——描述「给定状态下界面应是什么」，由 React 负责 DOM 更新，而非命令式逐步改 DOM；3) 状态驱动渲染——state/props 变化触发 reconcile 和 commit，UI 与数据关系清晰；4) 单向数据流——数据自顶向下 props 传递，变更通过事件/回调上报父组件。虚拟 DOM 和 Fiber 提供跨平台抽象、批量更新和可中断调度，但性能靠 key、memo、状态下沉和合理拆分而非「虚拟 DOM 一定更快」。Hooks 让逻辑复用更自然，但需理解依赖数组、闭包陷阱和渲染时机。生态（React Router、状态库、Next.js SSR、Testing Library、Vite）支撑中大型复杂交互应用。落地关键是组件边界清晰、状态归属合理、数据流可追踪和可维护性。',
      excellentAnswer:
        '我会讲组件化+声明式+状态驱动+单向数据流四特性，强调虚拟 DOM 不是性能银弹，Hooks 要懂依赖和闭包，复杂项目靠边界、状态归属和生态落地。'
    },
    'React 状态管理': {
      referenceAnswer:
        'state 是组件内部可变数据源，驱动本组件及子树渲染；props 是父组件传入的只读配置，子组件不应直接修改。更新 state 必须用 setState/useState 生成新对象或新值，直接 mutate 原对象会导致引用不变、React 跳过更新或产生隐蔽 bug（如浅比较失效）。state 和 props 区别：谁拥有数据、谁有权修改。状态提升（Lifting State Up）：多个子组件需共享或联动同一状态时，提升到最近公共父组件，通过 props 下传数据、回调上报变更。状态归属判断：仅当前组件使用→本地 state；兄弟组件共享→父组件；需分享/回退/深链→URL query 或路由 state；跨页面全局→Context、Zustand/Redux；服务端数据→React Query/SWR 管理缓存。避免过早全局化导致无关组件重渲染；也避免状态放得过深难以维护。',
      excellentAnswer:
        'state 内部可变、props 只读；不可变更新用 setState。共享状态提升到公共父，归属按本地/URL/全局分层，服务端数据用 React Query。'
    },
    'React 表单': {
      referenceAnswer:
        '受控组件：表单值由 React state 控制，input 的 value 绑定 state、onChange 更新 state，提交时从 state 读取。优点是与 React 数据流一致、可实时校验、可联动、可程序化重置；缺点是每次输入触发渲染，大表单或高频输入可能带来性能开销，需拆字段、debounce 或 useReducer 优化。非受控组件：用 ref（useRef）或原生 DOM 读取 value，React 不持有中间状态。适合：简单表单、文件上传、与第三方非 React 控件集成、只需提交时读一次值的场景。defaultValue 设初始值，提交时 ref.current.value 读取。混合实践：大部分字段受控保证校验联动，文件/日期等特殊控件非受控；React Hook Form 用 ref 注册减少重渲染。选型看是否需要实时校验联动 vs 提交时一次性读取。',
      excellentAnswer:
        '受控组件 value+onChange 便于校验联动但大表单注意渲染；非受控用 ref 读值适合文件上传和简单表单，Hook Form 兼顾两者。'
    },
    'React 数据流': {
      referenceAnswer:
        'React 采用单向数据流：父组件通过 props 向子组件传递数据和配置，子组件不应直接修改 props，因为 props 对子组件是只读的——修改会破坏数据流向可预测性和组件复用性。若子组件需要改变父组件数据，应通过父组件传入的回调函数（如 onChange、onSubmit）通知父组件，由父组件更新 state，新 props 再流下。这是「状态提升」和「容器/展示组件」模式的基础。直接改 props（或 props 中的对象字段）会导致引用不变时浅比较失效、兄弟组件状态不一致、调试困难。复杂场景可用 Context 或状态库，但仍保持「谁拥有 state 谁负责更新」。反模式：子组件直接 mutate props 对象、在子组件内部维护与 props 重复的 state 却不同步。',
      excellentAnswer:
        'props 只读，子改父数据通过回调上报；父更新 state 再流下。禁止 mutate props，复杂场景用 Context 但仍保持单向流。'
    },
    '前端工程化': {
      referenceAnswer:
        'React 项目目录常见两种组织：按技术类型分层（components/、hooks/、utils/、services/、pages/）和按业务模块分层（features/order/、features/user/ 内含组件、API、状态）。技术分层上手快、适合小项目，但业务增长后跨目录跳转多、模块边界模糊。业务模块化（Feature-Sliced 或 Domain）把同一功能的 UI、逻辑、API、类型放一起，利于团队协作和按需加载，但需约定公共层（shared/ui、shared/lib）避免循环依赖。实践建议：pages 做路由入口薄层，features 承载业务，shared 放通用组件和工具；API 层统一封装请求和错误处理；类型定义靠近使用方或集中 types。Monorepo 大项目可 packages/ui、packages/utils 拆分。选型看团队规模和业务复杂度，中型以上倾向业务模块化。',
      excellentAnswer:
        '小项目技术分层够用，中大型按业务 feature 模块化，pages 薄入口+features 聚合+shared 通用，避免循环依赖。'
    },
    'JavaScript 基础': {
      referenceAnswer:
        'var：函数作用域，存在变量提升（声明提升到作用域顶部、赋值留在原地），可重复声明，无暂时性死区。let/const：块级作用域（{}、for、if），有暂时性死区（声明前访问抛 ReferenceError），不可重复声明；const 绑定不可重新赋值但对象属性仍可改。闭包：函数连同其词法作用域（外层变量）一起被保存，内层函数可访问定义时的外层变量，即使外层已执行完毕。常用于：模块化（IIFE 私有变量）、柯里化、防抖节流、React Hooks 闭包快照。风险：闭包持有大对象或 DOM 引用导致无法 GC（内存泄漏）；事件监听/定时器未清理；Hooks 中过期闭包（回调引用旧 state）。修复：组件卸载清理监听和定时器，Hooks 用正确依赖数组、函数式 setState、ref 存最新值。',
      excellentAnswer:
        'var 函数作用域+提升，let/const 块级+TDZ；闭包保存词法环境用于模块化/防抖，注意泄漏和 Hooks 过期闭包，卸载时清理监听。'
    }
  },
  'go.json': {
    '类型系统': {
      referenceAnswer:
        'Go 不是传统 class 继承式 OOP：没有 class 和基于类的继承层级。但可用 struct 表达数据、method 绑定行为、interface 表达能力抽象和多态。interface 是隐式实现——类型实现接口全部方法即满足，无需 implements 声明，利于接口按使用方定义、降低耦合。组合优于继承：通过 struct 嵌入（embedding）复用字段和方法，避免深层继承树。多态通过 interface 实现，依赖注入用 interface 组织依赖。没有构造函数，复杂初始化用 NewXxx 工厂函数返回指针并保证零值可用。相比传统 OOP：依赖更轻、接口更小、组合更灵活；代价是不能照搬继承树设计。实践：定义小接口（io.Reader 风格），业务依赖行为而非具体类型，用组合和接口拆分实现解耦。',
      excellentAnswer:
        'Go 无 class 继承，struct+method+隐式 interface 表达对象行为，组合嵌入优于继承，小接口+工厂函数是落地方式。'
    }
  },
  'java.json': {
    '参数传递': {
      referenceAnswer:
        'Java 方法调用时实参值复制给形参，始终是值传递。基本类型传递数值副本，形参修改不影响实参。对象参数传递的是引用值的副本——形参和实参保存相同引用地址，指向同一堆对象。因此通过参数引用修改对象字段（如 p.setName()）调用方可见，因为操作同一对象；但在方法内把参数重新赋值为新对象（p = new User()）只改变形参这个局部变量的副本，调用方原引用不变。Java 没有 C++ 引用传递，不能通过参数替换调用方持有的对象引用。理解关键：区分「修改对象内容」与「修改引用变量本身」。调试时若调用方对象未变，检查是否在方法内 reassign 了参数而非 mutate 字段。',
      excellentAnswer:
        'Java 全是值传递；对象传的是引用副本，改字段外面可见，参数重新赋值外面不变，关键区分改内容与改引用。'
    }
  },
  'network.json': {
    'TCP/UDP': {
      referenceAnswer:
        'TCP 提供可靠、有序的字节流传输，不保留应用层每次 write 的消息边界。发送方连续 write 两次，接收方可能一次读完或分多次读，因此应用层需用固定长度、长度字段、分隔符或协议头解决粘包和拆包。UDP 以数据报为单位，一次 send 对应一次 recv，报文边界严格保留，不存在粘包拆包。UDP 不保证可靠、顺序和送达，可能丢包乱序。UDP 报文超过链路 MTU 时 IP 层分片，任一分片丢失整个报文丢弃，应用层应控制报文大小（通常 payload 约 1472 字节以内）。差异影响：TCP 应用必须设计消息边界和流控；UDP 应用需自行处理丢包、乱序、重传和幂等。选型：可靠有序用 TCP；低延迟广播、音视频、DNS 等可容忍丢包用 UDP。',
      excellentAnswer:
        'TCP 字节流不保留消息边界要应用层定界；UDP 保报文边界但可能丢包，超 MTU 分片丢失整包丢弃。'
    },
    'HTTPS/TLS': {
      referenceAnswer:
        'HTTPS 握手中证书公钥用于证明服务端身份。RSA 密钥交换：客户端生成 48 字节预主密钥，用服务端证书公钥加密发送，服务端私钥解密，双方派生会话密钥。缺点是一旦长期私钥泄露，历史抓包可被解密，无前向保密。ECDHE：双方生成临时椭圆曲线密钥对，交换公钥后各自计算共享密钥；长期私钥仅用于对握手参数签名证明身份，不直接加密会话密钥，因此具备前向保密。TLS 1.3 已禁止 RSA 静态密钥交换，仅保留 (EC)DHE，强制前向保密并简化密码套件。排查 HTTPS 问题还要看 TLS 版本、SNI、证书链、会话复用（session ticket）和握手分段耗时。',
      excellentAnswer:
        'RSA 用私钥解密预主密钥无前向保密；ECDHE 临时密钥交换+证书签名身份，TLS 1.3 强制前向保密。'
    }
  },
  'data.json': {
    '数据安全': {
      referenceAnswer:
        '敏感数据治理先做分级分类：识别手机号、身份证、地址、银行卡、设备 ID 等，建表时字段标注安全等级。脱敏按场景选择：展示用掩码，关联分析用哈希/token，统计用聚合，不能一刀切。权限按角色最小权限+审批，生产明文访问严格控制。查询、导出、下载、共享全链路审计和异常告警。开发测试用脱敏或合成数据，禁止复制生产明文。导出限制行数、字段和目的地。脱敏考虑可逆/不可逆、join 需求和组合重识别风险（多个非敏感字段组合可还原用户）。指标报表默认脱敏字段，合规审批后少数任务访问明文。历史遗留数据定期扫描治理，把敏感数据当全链路问题而非单点加密。',
      excellentAnswer:
        '分级分类+场景化脱敏+最小权限审批+全链路审计，测试环境脱敏，导出限控，防组合重识别。'
    }
  },
  'ai.json': {
    '数据切分': {
      referenceAnswer:
        '训练/验证/测试切分原则：IID 数据可随机切分；时间序列、推荐日志必须按时间切分，用最近一段作测试模拟线上，禁止 shuffle 导致未来信息泄漏。分组数据（同一用户/商户）用 GroupKFold，样本不能跨 train/test。比例常见 70/15/15 或 80/10/10；验证集调参，测试集只评一次防过拟合。切分后检查各类别、各时间段分布是否一致（PSI）。小数据集可用交叉验证选模型，但 TimeSeriesSplit 不 shuffle，最终仍需独立 holdout 或线上 A/B。嵌套 CV 避免用同一折既选参又评估。记录切分版本和随机种子保证可复现。',
      excellentAnswer:
        '时序/推荐按时间切防泄漏，用户分组不能跨集，验证调参测试只评一次，切分后查分布一致。'
    },
    'NLP 分类': {
      referenceAnswer:
        '文本分类误判分层排查：1) 数据——标签噪声、类别定义模糊、样本不均衡、训练覆盖不足；2) 模型——词袋 vs 预训练（BERT）是否匹配任务，长文本截断是否丢信息；3) 阈值——默认 0.5 不适合不均衡，按 PR 曲线选业务阈值；4) bad case——混淆矩阵看互混类别，定向补样本。治理：主动学习补标注、数据增强（回译/同义替换）、低置信进人工审核、集成多模型。评估除 accuracy 外看 per-class F1、混淆矩阵和线上 bad case 回流。避免只堆模型不查数据和标签质量。',
      excellentAnswer:
        '先查标签噪声和类别混淆，不均衡用 PR 调阈值，bad case 驱动补数据和升级预训练模型。'
    },
    '微调取舍': {
      referenceAnswer:
        '微调适合：大量领域标注、需内化领域知识/风格、延迟允许专用模型。提示词+RAG 适合：知识更新频繁、缺标注、需引用溯源、快速迭代。规则适合：强合规、逻辑确定、可解释优先。决策树：有高质量 KB 且需溯源→RAG；有万级标注且 prompt 瓶颈→微调；简单任务→小模型或 prompt。微调成本含标注、GPU、版本管理和评估回归，必须先和 RAG+prompt 基线对比 ROI。微调后仍需监控漂移和回滚策略。强合规场景规则+人工审核兜底，不盲目微调黑盒模型。',
      excellentAnswer:
        '知识快变用 RAG，大量标注且 prompt 不够再微调，强合规用规则；微调前必须和 RAG 基线比 ROI。'
    },
    '主动学习': {
      referenceAnswer:
        '主动学习用模型不确定性选最有价值样本送标注，降低标注成本。策略：不确定性采样（概率近 0.5）、边界采样（距决策边界最近）、多样性采样（避免重复相似样本）。适用：标注贵、可迭代训练、有基础启动集。流程：小标注集训练→全量预测→选 top-N 不确定样本标注→合并重训→循环至边际收益下降。冷启动先随机/bootstrap 避免模型偏见放大。注意：采样策略需与任务匹配，分类用 entropy，回归用 variance；每轮评估验证集防止选样偏差。与半监督结合可进一步利用无标注数据。',
      excellentAnswer:
        '不确定性采样选高价值样本，冷启动随机/bootstrap，迭代重训至边际收益下降，每轮盯验证集防选样偏差。'
    },
    '过拟合': {
      referenceAnswer:
        '过拟合：训练集指标高、验证/线上差，train-val gap 大。欠拟合：train 和 val 都差。分布问题：train/val 好但线上差→特征穿越、分布偏移、样本选择偏差。治理过拟合：正则（L1/L2/Dropout）、早停、增数据/增强、减模型复杂度、交叉验证。分布问题查特征是否泄漏未来信息、线上特征缺失、训练采样偏差。离线指标是必要非充分，最终以线上 A/B 和监控为准。学习曲线可判断需增数据还是减复杂度。记录实验数据版本和特征 pipeline 保证可复现。',
      excellentAnswer:
        'train-val gap 大→正则/早停/增数据；train val 好线上差查分布偏移和特征穿越，最终以 A/B 为准。'
    }
  },
  'python.json': {
    'GIL 机制': {
      referenceAnswer:
        'CPython GIL（全局解释器锁）保证同一时刻只有一个线程执行 Python 字节码。CPU 密集型多线程无法利用多核并行，线程越多反而因 GIL 争抢增加开销。IO 密集型在 IO 等待时会释放 GIL，多线程仍有效。应对方案：CPU 密集用 multiprocessing 多进程绕过 GIL；C 扩展/numpy 等可在 C 层释放 GIL；IO 密集用 asyncio 单线程协程或 threading。PyPy 也有 GIL。排查 CPU 密集慢时看是否误用多线程；用 cProfile、py-spy 定位热点。不要期望 threading 加速纯 Python 计算循环。',
      excellentAnswer:
        'GIL 让 CPU 密集多线程无法并行，用多进程或 C 扩展；IO 密集用 asyncio 或 threading 因 IO 时会释放 GIL。'
    },
    '序列化性能': {
      referenceAnswer:
        'Python 序列化选型：pickle 快但仅限 Python、不安全不可跨语言；json 通用可读但慢、不支持所有类型；msgpack/protobuf 二进制体积小解析快，适合 RPC 和缓存。大对象序列化瓶颈常在对象遍历和内存拷贝。优化：减少嵌套深度、用 __slots__ 减属性字典、批量序列化、避免循环引用。网络传输优先 protobuf/msgpack；持久化看是否需要人类可读。benchmark 用 timeit 对比同等数据结构，注意 warm-up 和 GC。反序列化安全：禁止 pickle 不可信数据，用 json/schema 校验。',
      excellentAnswer:
        'pickle 快但不安全跨语言；json 通用慢；msgpack/protobuf 适合 RPC。大对象减嵌套+__slots__，不可信数据禁 pickle。'
    }
  },
  'security.json': {
    '攻防演练授权': {
      referenceAnswer:
        '攻防演练（红蓝对抗）必须在书面授权范围内进行。授权书明确：目标系统/IP 段/域名、允许手法（渗透/社工/钓鱼）、时间窗口、紧急联系人和一键停止指令。法律层面签署授权避免触犯《网络安全法》未授权测试。范围外系统、第三方、生产核心业务未经明确授权禁止测试。全程记录操作日志和证据链，测试数据脱敏，禁止窃取真实用户数据。演练前通知相关运维和安全团队建立监控基线，演练后输出报告和修复验证。未授权扫描和渗透可能承担法律责任，授权边界是合规前提。',
      excellentAnswer:
        '书面授权明确目标/手法/时间窗口和停止指令，范围外禁止，全程日志脱敏，演练前后与运维对齐基线和修复。'
    },
    '零信任访问': {
      referenceAnswer:
        '零信任核心：永不默认信任内外网，每次访问都需验证身份、设备、上下文并授权最小权限。实现：1) 身份——SSO+MFA，短期 token；2) 设备——终端健康检查、证书绑定；3) 网络——微隔离、不按 IP 信任内网；4) 应用——每 API 鉴权+RBAC/ABAC，服务间 mTLS；5) 持续验证——会话风险评分、异常行为重认证。与传统边界安全对比：VPN 进内网即畅通 vs 零信任每步校验。落地从身份和 API 网关起步，逐步推广到服务 mesh 和终端。审计全链路访问日志。',
      excellentAnswer:
        '每次访问验证身份+设备+上下文，微隔离+mTLS+最小权限，不靠内网边界默认信任。'
    },
    '隐私删除': {
      referenceAnswer:
        '用户隐私删除（被遗忘权）需覆盖全链路：1) 主库——软删标记+定期硬删或加密销毁；2) 副本——从备份、缓存、搜索引擎、CDN、消息队列、日志中清除或脱敏；3) 第三方——通知合作方删除共享数据；4) 冷备——备份保留策略与删除请求对齐，或加密密钥销毁使备份不可读。技术难点：分布式系统异步副本延迟、日志不可变存储、分析数仓历史分区。流程：核验身份→记录删除工单→各系统执行→审计确认→用户通知。合规留存（税务/审计）与删除权冲突时依法保留最小必要集合并隔离访问。',
      excellentAnswer:
        '主库删+副本缓存日志数仓全链路清理，通知第三方，备份策略对齐删除，合规留存最小化隔离。'
    },
    '权限回收': {
      referenceAnswer:
        '权限回收要及时防离职/转岗遗留访问。触发：HR 离职/转岗事件、定期权限审计、异常行为告警。实现：1) IAM 与 HR 系统联动，离职自动禁用账号和 token；2) RBAC 角色随岗位变更同步，禁止个人永久特权；3) 临时权限设 TTL 自动过期；4) 服务账号和 API key 纳入生命周期管理；5) 会话踢出（revoke refresh token）。审计：回收后验证是否仍能访问（自动化探针）。影子账号和共享账号禁止。关键系统双人复核开通，回收可自动化但开通宜审批。',
      excellentAnswer:
        'HR 事件联动 IAM 自动禁用，临时权限 TTL，服务账号纳入生命周期，回收后探针验证。'
    }
  },
  'qa.json': {
    '缺陷根因分析': {
      referenceAnswer:
        '缺陷根因分析目标是从表象追到可行动根因，而非停留在「人为失误」。方法：5 Why 连续追问直到可改进环节；鱼骨图（人/机/料/法/环）辅助多人讨论。分类：需求遗漏、设计缺陷、编码错误、环境差异、测试遗漏、流程缺失。输出：根因陈述+预防措施+验证方式+责任人跟踪。同类缺陷聚类看系统性问题（如某模块反复空指针→补单测和静态检查）。与复盘区别：根因分析聚焦单缺陷，复盘聚焦事件全链路。避免追责式结论，改进项要可度量（如补用例数、门禁规则）。',
      excellentAnswer:
        '5 Why 追到可行动根因，鱼骨图分类，输出预防+验证，同类聚类看系统性问题，改进可度量。'
    },
    '线上问题复盘': {
      referenceAnswer:
        '线上问题复盘结构：时间线（发现→定位→止血→修复→验证）还原事实，区分触发原因与根因。止血优先：降级、回滚、扩容、限流，再深入定位。改进项分技术（补监控/告警/测试/架构）、流程（缩短响应 SLA、值班/on-call）、组织（协作机制）。无责复盘文化，聚焦系统和流程改进。输出 Postmortem 文档：影响面、时间线、根因、改进项、负责人和截止日期，纳入知识库。跟踪改进项到关闭，未关闭项定期 review。重大事故需管理层可见的度量（MTTR、逃逸率趋势）。',
      excellentAnswer:
        '时间线还原+区分触发与根因，无责复盘，改进分技术/流程/组织，Postmortem 跟踪到关闭。'
    },
    '测试负责人项目': {
      referenceAnswer:
        '（示例）电商大促前质量保障项目。我负责测试策略和跨团队协作。范围：核心链路（下单/支付/库存）深度测试+全链路压测+灰度验证。关键动作：风险驱动用例优先级（资金/库存>P1）；影子流量或录制回放压测验证容量；缺陷分级和发布门禁（P0 阻塞、P1 需评估）；与研发对齐 hotfix 流程和回滚预案。协作：每日风险同步、测试环境数据准备、监控基线对齐。结果：大促零 P0，逃逸缺陷较上次降 40%。可量化：压测峰值 QPS、门禁拦截次数、MTTR。',
      excellentAnswer:
        '大促项目：风险驱动优先级+影子压测+发布门禁+每日风险同步，结果零 P0 和逃逸率下降。'
    }
  }
};

for (const [file, entries] of Object.entries(PATCHES)) {
  const data = load(file);
  for (const [skill, content] of Object.entries(entries)) {
    data[skill] = content;
  }
  save(file, data);
  console.log(`patched ${file}: ${Object.keys(entries).length} skills`);
}
