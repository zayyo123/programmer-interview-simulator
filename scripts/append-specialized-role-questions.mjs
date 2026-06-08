import { readFile, writeFile } from 'node:fs/promises';

const approvedPath = new URL('../data/approved-questions.json', import.meta.url);
const approvedAt = '2026-05-29T14:30:00.000Z';
const governance = {
  status: 'approved',
  source: 'manual-curated',
  license: '原创/内部题库',
  attributionRequired: false,
  approvedAt,
  approvedBy: 'codex-reviewer',
  reviewNotes: '人工审核通过：面向专项岗位补充的原创中文面试题，已补齐答案、追问、误区和评分规则。'
};

const defaultRedFlags = [
  '只背结论，没有解释判断过程和落地边界。',
  '没有结合真实项目、线上指标或排查证据。',
  '忽略风险、回滚、监控或防复发措施。'
];

const questions = [
  question({
    id: 'approved_qa_contract_testing_001',
    category: '测试',
    skill: '契约测试',
    roles: ['qa'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '微服务很多、接口频繁变更时，你会如何设计契约测试，避免上下游联调阶段才发现字段或语义不兼容？',
    keywords: ['契约测试', '接口兼容', '微服务', 'Mock', 'CI 门禁'],
    expectedPoints: ['定义消费者和提供者契约', '校验字段、类型、语义和兼容性', '接入 CI 门禁', '处理版本演进', '说明 Mock 和真实环境验证边界'],
    referenceAnswer: '契约测试用于提前发现上下游接口不兼容，不只是校验 HTTP 200。消费者可以声明自己依赖的请求、响应字段、错误码和语义约束，提供者在 CI 中验证新版本是否仍满足这些契约。它适合微服务多、接口变更频繁、联调成本高的场景。落地时要管理契约版本，区分向后兼容变更和破坏性变更，并把契约校验放到合并或发布门禁里。Mock 能提升开发效率，但不能替代少量真实环境冒烟和端到端验证。',
    excellentAnswer: '我会先从痛点说起：很多接口问题不是代码跑不起来，而是字段改名、枚举语义变化、错误码变化或必填字段变动导致下游线上失败。契约测试应由消费者描述真实依赖，提供者每次变更自动回归这些契约。对于新增字段通常兼容，删除字段、类型变化、枚举收窄则需要版本化和通知。它不能覆盖所有业务流程，所以我会把契约测试放在接口兼容层，再配合核心链路冒烟、灰度监控和回滚策略。',
    followUps: ['契约测试和普通接口自动化有什么区别？', '消费者契约很多时如何治理版本和废弃？', '什么场景下契约测试仍然挡不住线上问题？'],
    scoringRubric: {
      mustHave: ['消费者契约', '提供者验证', '接口兼容', 'CI 门禁'],
      goodToHave: ['版本治理', '错误码语义', 'Mock 边界', '灰度验证', '破坏性变更'],
      redFlags: ['只说接口自动化', '不区分兼容和不兼容变更', '没有门禁和版本治理']
    }
  }),
  question({
    id: 'approved_qa_test_data_management_001',
    category: '测试',
    skill: '测试数据治理',
    roles: ['qa'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '自动化和回归测试经常因为测试数据不稳定失败，你会如何设计测试数据管理方案？',
    keywords: ['测试数据', '数据隔离', '数据构造', '回滚清理', '脱敏'],
    expectedPoints: ['区分静态基线数据和动态用例数据', '保证账号和业务数据隔离', '提供数据构造和清理机制', '处理并行执行冲突', '关注脱敏和权限'],
    referenceAnswer: '测试数据管理要解决可重复、可隔离、可追溯。稳定基础数据可以做成版本化基线，测试用例运行时创建自己的动态数据，执行后清理或通过事务/租户隔离回收。并行自动化要避免共用账号、订单号或库存，常用唯一前缀、独立租户、数据工厂或 API 构造。涉及生产脱敏数据时要控制权限和敏感字段，不能把真实手机号、身份证、密钥直接放到测试环境。还要有数据健康检查和失败现场保留策略。',
    excellentAnswer: '我会把数据分层：环境基线、用例前置数据、运行中生成数据和验证数据。基线数据由脚本版本化维护，用例数据通过工厂方法或接口创建，并带唯一标识，避免并行互相污染。对不可删除的数据，我会使用测试租户隔离和定期归档。失败时不要立刻清理全部现场，要保留关键业务号方便定位。测试数据治理还要和隐私合规结合，生产数据只能脱敏抽样，访问和导出要有审计。',
    followUps: ['并行自动化如何避免数据互相影响？', '生产数据同步到测试环境要注意什么？', '失败用例的数据应该保留还是清理？'],
    scoringRubric: {
      mustHave: ['数据隔离', '数据构造', '清理机制', '并行冲突'],
      goodToHave: ['基线版本化', '数据工厂', '脱敏', '现场保留', '测试租户'],
      redFlags: ['共用固定账号数据', '无清理策略', '使用未脱敏生产数据']
    }
  }),
  question({
    id: 'approved_qa_release_acceptance_001',
    category: '测试',
    skill: '上线验收',
    roles: ['qa'],
    levels: ['junior', 'middle', 'senior'],
    type: 'project',
    difficulty: 2,
    question: '请讲一次你负责上线前验收或发布质量把关的经历，重点说明准入标准、回归范围、风险沟通和上线后观察。',
    keywords: ['上线验收', '准入标准', '回归范围', '风险沟通', '上线观察'],
    expectedPoints: ['说明需求和发布背景', '定义准入和阻断条件', '按风险选择回归范围', '沟通遗留风险', '上线后看指标和反馈'],
    referenceAnswer: '上线验收项目题要讲清楚你如何把质量标准落地。准入标准可以包括核心用例通过、阻断缺陷清零、接口/数据兼容验证、回滚方案确认和关键监控就绪。回归范围应按变更影响和业务风险选择，而不是全量盲测。若存在遗留问题，要说明影响范围、规避方案和是否接受上线。上线后要观察错误率、核心转化、日志告警、用户反馈和数据指标，必要时触发回滚或热修。',
    excellentAnswer: '我会用一次真实发布讲：这次改动影响支付和优惠券，我先和研发确认变更点、数据库脚本和回滚方案，再把回归分为核心下单、异常支付、优惠叠加和历史订单兼容。上线前我设定阻断条件，比如支付失败率、金额不一致和库存异常不能放行。上线后前 30 分钟盯接口错误率、订单成功率和客服反馈。最后把本次漏测点沉淀为检查清单，而不是只靠个人经验。',
    followUps: ['如何判断一个缺陷是否阻断上线？', '发布窗口很紧时你如何缩小回归范围？', '上线后发现小范围异常，你会建议回滚还是热修？'],
    scoringRubric: {
      mustHave: ['准入标准', '回归范围', '风险沟通', '上线观察'],
      goodToHave: ['回滚方案', '阻断条件', '变更影响分析', '检查清单', '业务指标'],
      redFlags: ['只说测完了', '没有风险分级', '上线后不观察']
    }
  }),
  question({
    id: 'approved_qa_security_testing_001',
    category: '测试',
    skill: '安全测试',
    roles: ['qa', 'security'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '普通业务测试中如何覆盖基础安全风险？请说明越权、输入校验、敏感信息、上传下载和接口重放的测试思路。',
    keywords: ['安全测试', '越权', '输入校验', '敏感信息', '重放'],
    expectedPoints: ['覆盖认证授权和越权', '测试输入校验和注入风险', '检查敏感信息泄漏', '覆盖上传下载安全', '设计重放和幂等场景'],
    referenceAnswer: '业务测试不需要替代专业渗透，但要覆盖高频安全风险。越权测试要尝试换用户、换租户、改资源 id、降级角色；输入校验要覆盖超长、特殊字符、脚本、SQL 片段和非法枚举；敏感信息要检查日志、响应、导出文件和前端页面是否泄漏手机号、身份证、token；上传下载要测类型绕过、大小限制、鉴权和路径安全；写接口要测试重复提交、接口重放和幂等保护。发现问题要给出复现步骤、风险等级和影响范围。',
    excellentAnswer: '我会把安全测试嵌到业务用例里。比如订单详情接口，除了正常查看，还要用 A 用户订单 id 让 B 用户访问，验证对象级授权。导出功能要检查是否能导出其他部门数据、文件 URL 是否可猜、日志是否打印敏感字段。写接口要用重复请求和过期 token 验证幂等和鉴权。测试报告里我会区分阻断级安全缺陷和普通问题，并推动补统一权限、脱敏和扫描规则。',
    followUps: ['水平越权和垂直越权分别怎么测？', '接口重放可能造成什么业务后果？', '敏感信息泄漏除了接口响应还要看哪里？'],
    scoringRubric: {
      mustHave: ['越权测试', '输入校验', '敏感信息', '上传下载或重放'],
      goodToHave: ['租户隔离', '脱敏', '风险评级', '日志检查', '幂等'],
      redFlags: ['只测正常权限', '不检查敏感数据', '没有复现证据']
    }
  }),
  question({
    id: 'approved_ops_dns_troubleshooting_001',
    category: '运维',
    skill: 'DNS 排障',
    roles: ['ops', 'devops', 'backend'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '线上访问某域名偶发失败或解析到错误地址，你会如何排查 DNS 缓存、权威解析、递归解析、TTL 和客户端配置？',
    keywords: ['DNS', 'TTL', '递归解析', '权威解析', '缓存'],
    expectedPoints: ['区分客户端/递归/权威解析问题', '使用 dig/nslookup 对比链路', '关注 TTL 和缓存污染', '检查多线路和负载均衡', '说明止血和回滚'],
    referenceAnswer: 'DNS 问题要先确认失败范围，是单用户、单机房、某运营商还是全局。可以用 dig +trace、指定递归 DNS、直接查权威 NS，对比解析结果和 TTL。客户端侧要看本地缓存、容器 DNS、systemd-resolved、JVM/语言运行时缓存和 hosts；递归侧要看缓存过期、污染或运营商劫持；权威侧要看记录是否发布正确、多线路策略是否误配。止血可以降低 TTL、回滚 DNS 记录、切换备用域名或固定上游地址，但要考虑缓存生效延迟。',
    excellentAnswer: '我会先用多个网络位置和多个递归 DNS 复现，判断问题在哪一层。如果权威返回正确但部分递归返回旧值，可能是 TTL 或缓存未过期；如果权威本身错误，就回滚记录并检查发布流程。容器环境还要看 CoreDNS、ndots、search domain 和上游超时。DNS 故障最麻烦的是缓存不可控，所以变更前要提前降低 TTL，变更后保留监控和回滚窗口。业务层也应有连接失败重试和备用域名策略。',
    followUps: ['dig +trace 能帮助判断什么？', '为什么 DNS 变更前要提前降低 TTL？', 'JVM DNS 缓存可能带来什么问题？'],
    scoringRubric: {
      mustHave: ['递归和权威解析', 'TTL', '客户端缓存', '排查工具'],
      goodToHave: ['多线路解析', 'CoreDNS', '备用域名', '运营商差异', '变更回滚'],
      redFlags: ['只清本机缓存', '不查权威解析', '忽略 TTL 生效延迟']
    }
  }),
  question({
    id: 'approved_ops_disk_inode_001',
    category: '运维',
    skill: '磁盘排障',
    roles: ['ops', 'devops', 'backend'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '服务器磁盘告警时，如何区分磁盘空间满、inode 满、日志暴涨和文件已删除但空间未释放？',
    keywords: ['磁盘空间', 'inode', '日志清理', 'deleted file', 'lsof'],
    expectedPoints: ['使用 df -h 和 df -i', '定位大文件和小文件', '检查 deleted file', '处理日志轮转', '说明止血和长期治理'],
    referenceAnswer: '磁盘告警不一定只是大文件。df -h 看空间使用，df -i 看 inode，inode 满通常是大量小文件导致。du 可以定位目录大小，find 可查大文件或大量小文件；如果文件已删除但进程仍持有句柄，du 看不到但 df 仍显示占用，需要用 lsof | grep deleted 找到进程并重启或释放句柄。日志暴涨要检查 logrotate、应用日志级别和异常循环。止血可以清理无用文件、压缩归档、扩容或调整日志级别，长期要做日志轮转、保留周期、磁盘水位告警和容量规划。',
    excellentAnswer: '我会先区分空间和 inode：空间满看大文件，inode 满看小文件数量。然后对比 df 和 du，如果 df 明显高于 du，优先怀疑 deleted file 被进程持有。处理线上日志不能直接 rm 正在写的文件，可能空间不释放，也可能影响排查，应该用 logrotate、truncate 或重启进程配合。清理前要确认文件类型和业务影响，避免删掉数据库、消息队列或审计日志。复盘时要补日志级别控制和保留策略。',
    followUps: ['df 和 du 结果差很多可能是什么原因？', 'inode 满了为什么新建小文件会失败？', '为什么删除正在写入的日志文件可能不释放空间？'],
    scoringRubric: {
      mustHave: ['df -h', 'df -i', 'du/find', 'deleted file'],
      goodToHave: ['lsof', 'logrotate', 'truncate', '水位告警', '容量规划'],
      redFlags: ['只会 rm 大文件', '不看 inode', '误删业务数据']
    }
  }),
  question({
    id: 'approved_ops_replication_lag_001',
    category: '运维',
    skill: '数据库运维',
    roles: ['ops', 'devops', 'backend'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: 'MySQL 主从延迟突然升高时，你会如何判断是主库写入过大、从库 SQL 线程慢、网络问题还是大事务导致？',
    keywords: ['MySQL', '主从延迟', '复制', '大事务', 'Relay Log'],
    expectedPoints: ['查看复制状态和延迟指标', '区分 IO 线程和 SQL 线程', '检查大事务和慢 SQL', '关注网络和从库资源', '说明止血和一致性风险'],
    referenceAnswer: '主从延迟要先看复制状态、Seconds_Behind_Master、relay log 积压、IO/SQL 线程是否正常。IO 线程慢可能是网络或主库 binlog 传输问题，SQL 线程慢常见于从库执行能力不足、单线程回放、大事务、DDL 或慢 SQL。还要看主库写入峰值、从库 CPU/IO、锁等待和磁盘延迟。止血可以暂停读流量切到主库或其他副本、限制作业、扩容从库、开启并行复制或拆分大事务，但要明确读写分离场景下会读到旧数据的风险。',
    excellentAnswer: '我会先判断延迟是传不过来还是回放不过来。Relay log 增长而 IO 正常，多半是 SQL apply 慢；IO 线程落后则看网络和主库 binlog。大事务会让延迟看起来突然跳高，因为从库必须完整回放；DDL 也可能卡住复制。业务上要先保护一致性，关键读请求不能继续读延迟很高的从库。长期治理包括大事务拆分、DDL 工具、并行复制配置、从库资源隔离和复制延迟告警。',
    followUps: ['Seconds_Behind_Master 有哪些局限？', '大事务为什么会放大复制延迟？', '读写分离遇到主从延迟时业务怎么兜底？'],
    scoringRubric: {
      mustHave: ['复制状态', 'IO/SQL 线程', '大事务', '从库资源'],
      goodToHave: ['relay log', '并行复制', 'DDL', '读写一致性', '延迟告警'],
      redFlags: ['只看一个延迟字段', '不区分传输和回放', '忽略读旧数据风险']
    }
  }),
  question({
    id: 'approved_ops_capacity_planning_001',
    category: '运维',
    skill: '容量规划',
    roles: ['ops', 'devops', 'architect'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '大促前你会如何做容量评估和保障？请说明流量预测、压测、扩容、限流降级、值守和回滚预案。',
    keywords: ['容量规划', '压测', '扩容', '限流降级', '保障预案'],
    expectedPoints: ['基于历史和活动预测流量', '压测验证瓶颈和容量', '制定扩容和预热方案', '准备限流降级和回滚', '值守监控和复盘'],
    referenceAnswer: '容量保障要从业务预测开始，根据历史峰值、活动入口、营销节奏和转化率估算 QPS、订单量、消息量和数据增长。压测要覆盖核心链路和混合场景，找出网关、应用、数据库、缓存、消息队列和下游依赖的瓶颈。扩容不只是加机器，还包括缓存预热、连接池、线程池、队列容量、数据库参数和限流阈值。保障期间要有实时监控、值守分工、降级开关、回滚预案和应急沟通机制。结束后复盘容量余量和瓶颈。',
    excellentAnswer: '我会把大促保障拆成预测、验证、准备、值守和复盘。预测阶段给出峰值和安全系数，压测阶段验证 p99、错误率和资源水位，准备阶段完成扩容、预热、限流、降级和回滚演练。真正值守时看业务指标和技术指标双看板，例如下单成功率、支付成功率、网关 5xx、数据库连接、MQ 积压。任何降级都要提前确认业务可接受范围，而不是故障时临时拍脑袋。',
    followUps: ['压测结果如何转成生产扩容数量？', '哪些能力适合大促前预热？', '降级开关如何避免误操作？'],
    scoringRubric: {
      mustHave: ['流量预测', '压测', '扩容', '限流降级'],
      goodToHave: ['缓存预热', '值守分工', '回滚演练', '业务指标', '安全系数'],
      redFlags: ['只加机器', '无压测', '无降级预案']
    }
  }),
  question({
    id: 'approved_devops_iac_drift_001',
    category: 'DevOps',
    skill: '基础设施即代码',
    roles: ['devops', 'ops', 'architect'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '为什么要做基础设施即代码？当云资源被人工改动导致配置漂移时，你会如何发现、治理和防止复发？',
    keywords: ['IaC', 'Terraform', '配置漂移', '审计', '变更治理'],
    expectedPoints: ['说明 IaC 的价值', '检测配置漂移', '统一变更入口', '处理人工紧急变更', '审计和权限控制'],
    referenceAnswer: '基础设施即代码让网络、机器、数据库、权限等资源以版本化代码管理，提升可审计、可复现和可回滚能力。配置漂移通常来自控制台人工修改、脚本绕过或紧急变更未回写代码。可以通过 Terraform plan、云审计日志、配置巡检和资源基线发现差异。治理上应统一变更入口，限制生产控制台权限，紧急变更要有事后回写和复盘。还要用代码评审、流水线审批、状态锁和最小权限避免多人同时改资源。',
    excellentAnswer: '我会强调 IaC 不是为了炫工具，而是为了让基础设施变更像代码一样可评审、可追踪。发现漂移后先判断是合法紧急变更还是误操作，再决定把现实改回代码定义，还是把代码更新为新的期望状态。生产环境不能让所有人随手点控制台，应该通过流水线执行 plan/apply，并记录审批和审计。对于紧急修复，可以临时开权限，但必须有过期和回收机制。',
    followUps: ['Terraform state 为什么需要加锁和保护？', '紧急控制台变更如何纳入 IaC 流程？', 'IaC 误操作可能造成什么风险？'],
    scoringRubric: {
      mustHave: ['版本化管理', '漂移检测', '统一变更入口', '审计'],
      goodToHave: ['Terraform plan', 'state lock', '最小权限', '紧急变更回写', '代码评审'],
      redFlags: ['手工改生产无记录', '无漂移检测', '不保护 state']
    }
  }),
  question({
    id: 'approved_devops_slo_error_budget_001',
    category: 'DevOps',
    skill: 'SLO 治理',
    roles: ['devops', 'ops', 'architect'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: 'SLO、SLI 和错误预算分别是什么？你会如何用它们平衡发布速度和系统稳定性？',
    keywords: ['SLO', 'SLI', '错误预算', '稳定性', '发布治理'],
    expectedPoints: ['解释 SLI/SLO/错误预算', '选择面向用户的指标', '用预算驱动发布决策', '处理告警和复盘', '避免指标游戏化'],
    referenceAnswer: 'SLI 是衡量服务表现的指标，例如成功率、延迟分位数、可用性；SLO 是这些指标在一段时间内的目标；错误预算是 100% 与 SLO 之间允许失败的空间。它能帮助团队平衡稳定性和迭代速度：预算充足时可以正常发布，预算燃烧过快时要收紧发布、优先修复稳定性问题。SLI 应尽量贴近用户体验，不能只看机器存活。落地还要有燃烧率告警、复盘机制和例外流程，避免为了达标而隐藏错误。',
    excellentAnswer: '我会举例：订单服务 SLO 可以是 30 天内 99.9% 请求在 500ms 内成功，不是 CPU 小于多少。错误预算让业务、研发和 SRE 有共同语言，如果本月预算快烧完，就暂停高风险发布，优先处理超时和错误。告警也可以基于短窗口和长窗口燃烧率，既能发现快速故障，也能发现慢性退化。难点是指标定义要真实反映用户体验，不能把失败请求过滤掉来让报表好看。',
    followUps: ['为什么 SLO 不应该只用机器可用性表示？', '错误预算耗尽后团队应该怎么做？', '燃烧率告警相比固定阈值有什么优势？'],
    scoringRubric: {
      mustHave: ['SLI', 'SLO', '错误预算', '发布决策'],
      goodToHave: ['用户体验指标', '燃烧率', '暂停发布', '复盘', '指标治理'],
      redFlags: ['只讲 SLA 合同', '指标不贴近用户', '预算耗尽仍随意发布']
    }
  }),
  question({
    id: 'approved_devops_image_supply_chain_001',
    category: 'DevOps',
    skill: '镜像供应链安全',
    roles: ['devops', 'security', 'ops'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '容器镜像从构建到上线有哪些供应链安全风险？你会如何做基础镜像治理、漏洞扫描、签名和准入控制？',
    keywords: ['容器镜像', '供应链安全', '漏洞扫描', '镜像签名', '准入控制'],
    expectedPoints: ['治理基础镜像和依赖来源', '扫描漏洞和密钥', '生成 SBOM 或依赖清单', '镜像签名和准入校验', '处理修复和例外'],
    referenceAnswer: '镜像供应链风险包括使用不可信基础镜像、依赖漏洞、构建时泄漏密钥、镜像被篡改、运行时权限过大。治理上应统一基础镜像来源，定期更新安全补丁；构建阶段做依赖漏洞扫描、密钥扫描和镜像扫描，必要时生成 SBOM；发布前对镜像签名，集群准入控制只允许来自可信仓库、签名有效、漏洞等级符合策略的镜像运行。对无法立即修复的漏洞要有例外审批、补偿措施和到期时间。',
    excellentAnswer: '我会把控制点放在构建、仓库和部署三层。构建阶段使用固定版本基础镜像，避免 latest，密钥通过安全变量注入且不进入镜像层。仓库阶段保存扫描结果、SBOM 和签名。部署阶段 admission controller 校验签名、来源、用户权限和高危漏洞策略。不能只扫描一次，因为新 CVE 会不断出现，所以要有持续重扫和重建机制。例外不能永久存在，要有风险说明和 owner。',
    followUps: ['为什么不建议生产镜像使用 latest tag？', 'SBOM 能解决什么问题？', '高危漏洞暂时不能修复时如何处理？'],
    scoringRubric: {
      mustHave: ['基础镜像治理', '漏洞扫描', '镜像签名', '准入控制'],
      goodToHave: ['SBOM', '密钥扫描', '可信仓库', '持续重扫', '例外审批'],
      redFlags: ['使用 latest', '无扫描', '任意镜像可部署']
    }
  }),
  question({
    id: 'approved_devops_cost_observability_001',
    category: 'DevOps',
    skill: '成本治理',
    roles: ['devops', 'ops', 'architect'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '云资源成本持续上涨时，你会如何建设成本可观测性和治理机制，同时避免影响稳定性？',
    keywords: ['云成本', 'FinOps', '成本可观测性', '资源利用率', '稳定性'],
    expectedPoints: ['按业务和团队归因成本', '监控资源利用率和趋势', '识别闲置和过度配置', '建立预算和告警', '结合稳定性做优化取舍'],
    referenceAnswer: '成本治理首先要能归因，资源需要按服务、团队、环境、项目打标签，账单能映射到业务。其次要看利用率和趋势，例如 CPU/内存、存储增长、带宽、日志和监控成本。常见优化包括清理闲置资源、调整规格、预留实例、冷热分层、日志采样、自动伸缩和非生产环境定时关闭。但不能只为了省钱压低容量，必须结合 SLO、峰值流量、容灾余量和回滚风险。治理机制包括预算、告警、评审和 owner。',
    excellentAnswer: '我会先建立成本看板，让每个服务知道自己花了多少钱，钱花在计算、存储、流量还是观测数据上。然后按风险分层优化：闲置资源可以直接清理，低利用率资源可以降配灰度，核心服务容量要结合压测和 SLO 决策。日志和指标成本常被忽略，可以通过采样、保留周期和冷热存储优化。成本治理不能变成月底砍机器，而应纳入架构评审和发布流程。',
    followUps: ['如何避免降本导致稳定性下降？', '哪些云资源最容易产生隐性成本？', '资源标签治理为什么重要？'],
    scoringRubric: {
      mustHave: ['成本归因', '利用率监控', '闲置治理', '稳定性取舍'],
      goodToHave: ['标签', '预算告警', '自动伸缩', '日志成本', 'FinOps'],
      redFlags: ['只砍资源', '无归因', '不看 SLO']
    }
  }),
  question({
    id: 'approved_data_metric_governance_001',
    category: '数据',
    skill: '指标治理',
    roles: ['data'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '多个部门对 GMV、活跃用户等指标口径不一致时，你会如何做指标治理和口径统一？',
    keywords: ['指标治理', '指标口径', 'GMV', '数据字典', '血缘'],
    expectedPoints: ['明确业务定义和责任人', '沉淀公共指标层', '建立指标字典和版本', '处理历史口径迁移', '提供血缘和校验机制'],
    referenceAnswer: '指标口径治理要先把业务定义说清楚，例如 GMV 是否包含退款、取消订单、运费、优惠券，活跃用户按登录还是关键行为。每个核心指标应有 owner、口径文档、计算逻辑、适用范围和版本记录。技术上把公共逻辑沉淀到 DWS/指标层或指标平台，避免每个报表重复写 SQL。口径变更要评估历史数据、下游报表和业务沟通，必要时新旧口径并行一段时间。血缘、质量校验和权限管理能帮助发现误用。',
    excellentAnswer: '我会先把争议指标拉回业务语义，而不是争论谁的 SQL 对。比如 GMV 需要产品、财务、运营确认是否扣退款和优惠。确认后把口径固化到公共指标层，并提供指标字典、示例 SQL、负责人和变更记录。对存量报表要做血缘分析，标出受影响范围，灰度切换或双口径展示。治理成功的标志不是文档写完，而是新报表默认复用公共指标，口径争议减少。',
    followUps: ['指标口径变更如何兼容历史报表？', '如何防止业务方绕过公共指标层自己写口径？', '指标 owner 应该负责哪些事情？'],
    scoringRubric: {
      mustHave: ['业务定义', '指标 owner', '公共指标层', '口径文档'],
      goodToHave: ['版本管理', '血缘分析', '双口径迁移', '质量校验', '指标平台'],
      redFlags: ['只改 SQL', '无 owner', '文档和代码不一致']
    }
  }),
  question({
    id: 'approved_data_backfill_governance_001',
    category: '数据',
    skill: '补数治理',
    roles: ['data'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '请讲一次你处理数据补数或历史数据修复的经历，重点说明影响范围、补数方案、幂等校验和业务沟通。',
    keywords: ['补数', '历史修复', '影响范围', '幂等', '数据校验'],
    expectedPoints: ['说明补数原因和影响范围', '制定可回滚补数方案', '保证任务幂等', '做结果校验和对账', '沟通业务口径和风险'],
    referenceAnswer: '数据补数项目题要讲清楚为什么补、补哪些分区、影响哪些报表和业务决策。方案上要先备份或保留原结果，明确重跑依赖、顺序、资源窗口和回滚策略。补数任务要幂等，重复执行不会产生重复数据或覆盖正确数据；对明细和汇总都要做行数、金额、主键、分区完整性和抽样校验。补数前后要和业务说明口径变化、报表波动和数据可用时间，避免业务误读。',
    excellentAnswer: '我会讲一次上游埋点漏报导致活动数据需要回刷的案例。先通过血缘找出受影响的 ODS、DWD、DWS 和 ADS 表，再冻结相关报表口径说明。补数时按分区重跑，先小范围验证，再批量执行，所有写入用 overwrite 分区或 upsert 保证幂等。完成后对比补数前后订单数、金额和样本明细，并让业务确认指标变化符合预期。最后补了上游质量告警和补数 runbook。',
    followUps: ['补数时如何避免影响线上查询？', '如何判断补数结果是正确的？', '如果补数后业务指标大幅变化，你怎么解释？'],
    scoringRubric: {
      mustHave: ['影响范围', '补数方案', '幂等', '结果校验'],
      goodToHave: ['血缘', '备份回滚', '分区重跑', '业务沟通', 'runbook'],
      redFlags: ['直接全量重跑', '无校验', '不通知业务']
    }
  }),
  question({
    id: 'approved_data_privacy_desensitization_001',
    category: '数据',
    skill: '数据安全',
    roles: ['data', 'security'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '数仓里有手机号、身份证、地址等敏感数据时，你会如何做分级分类、脱敏、权限控制和审计？',
    keywords: ['数据安全', '敏感数据', '脱敏', '权限控制', '审计'],
    expectedPoints: ['识别和分级敏感数据', '按场景选择脱敏方式', '权限最小化和审批', '记录访问审计', '控制导出和开发测试使用'],
    referenceAnswer: '敏感数据治理要先做分级分类，识别手机号、身份证、地址、银行卡、设备标识等字段。脱敏方式要按使用场景选择，展示可用掩码，关联分析可用哈希或 token，统计可用聚合结果，不能一刀切。权限上按角色和最小权限审批，生产明文数据访问要严格控制。所有查询、导出、下载和共享都应有审计记录和告警。开发测试环境应使用脱敏或合成数据，避免真实敏感数据扩散。',
    excellentAnswer: '我会把敏感数据当成全链路治理问题。建表时字段就要标注安全等级，指标和报表默认使用脱敏字段，只有合规审批后的少数任务能访问明文。导出要限制行数、字段和目的地，异常下载要告警。脱敏还要考虑可逆不可逆、是否需要 join 和是否会被组合还原。测试环境不应直接复制生产明文，历史遗留数据也要逐步扫描和治理。',
    followUps: ['哈希脱敏和掩码脱敏分别适合什么场景？', '如何防止多个非敏感字段组合后重新识别用户？', '数据导出为什么比查询权限更需要审计？'],
    scoringRubric: {
      mustHave: ['分级分类', '脱敏', '权限最小化', '审计'],
      goodToHave: ['导出控制', '测试环境脱敏', '字段标注', '异常告警', '重识别风险'],
      redFlags: ['全员明文访问', '无审计', '生产数据直接给测试']
    }
  }),
  question({
    id: 'approved_data_scheduler_dependency_001',
    category: '数据',
    skill: '调度依赖',
    roles: ['data', 'devops'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '离线调度任务经常延迟产出，你会如何分析依赖链路、关键路径、资源队列和上游晚到数据？',
    keywords: ['离线调度', '依赖链路', '关键路径', '资源队列', '晚到数据'],
    expectedPoints: ['梳理任务 DAG 和关键路径', '区分上游数据晚到和计算慢', '检查资源队列和并发限制', '设置 SLA 和告警', '设计补数和降级方案'],
    referenceAnswer: '离线任务延迟要先看 DAG 依赖和关键路径，确认是上游分区未到、某个任务计算慢、资源队列等待还是调度配置错误。上游晚到要看数据产出时间、分区完整性和外部系统 SLA；计算慢要看输入数据量、SQL 计划、数据倾斜和资源配置；队列等待要看集群资源、优先级和并发。治理上要给核心任务设置 SLA、提前告警、关键路径看板、失败重试和补数方案。对非核心报表可以降级或延迟说明。',
    excellentAnswer: '我会从最终报表倒推依赖链路，找最长关键路径，而不是只看失败任务。很多时候任务没失败但排队太久或上游晚到，导致 ADS 延迟。对核心链路，我会设置分区到达检测、任务耗时基线和资源队列监控；对慢 SQL 则分析执行计划和数据倾斜。治理上可以调整依赖粒度、拆分长任务、提升队列优先级、做中间层复用，并把预计产出时间同步给业务。',
    followUps: ['如何判断任务慢是 SQL 问题还是资源排队？', '关键路径看板应该展示哪些信息？', '上游晚到时下游报表是否应该先产出旧数据？'],
    scoringRubric: {
      mustHave: ['DAG', '关键路径', '上游晚到', '资源队列'],
      goodToHave: ['SLA', '分区检测', '耗时基线', '数据倾斜', '业务降级'],
      redFlags: ['只看失败任务', '无依赖视角', '无 SLA 告警']
    }
  }),
  question({
    id: 'approved_ai_ab_experiment_001',
    category: 'AI',
    skill: '线上实验',
    roles: ['ai', 'data'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '模型或推荐策略上线前，你会如何设计 A/B 实验？请说明分流、指标、样本量、护栏指标和实验风险。',
    keywords: ['A/B 实验', '分流', '样本量', '护栏指标', '推荐系统'],
    expectedPoints: ['随机稳定分流', '定义主指标和护栏指标', '估算样本量和实验周期', '避免污染和干扰', '设计灰度和回滚'],
    referenceAnswer: 'A/B 实验要保证分流随机且稳定，用户在实验期间保持同一策略，避免频繁切组。指标上要区分主指标和护栏指标，例如推荐点击率提升不能以投诉率、延迟或留存下降为代价。样本量和实验周期要基于基础转化率、期望提升和显著性估算，不能看一天波动就下结论。还要避免用户间干扰、渠道偏差、缓存污染和多实验互相影响。高风险模型应先小流量灰度，异常时快速回滚。',
    excellentAnswer: '我会先定义实验假设，比如新召回模型提升下单转化，同时不增加延迟和投诉。分流用用户级 hash 保证稳定，核心指标看转化率、GMV 或留存，护栏看延迟、错误率、退款、投诉和资源成本。实验期间不随意偷看数据提前停止，避免显著性误判。对推荐和社交场景，还要考虑网络效应和库存竞争导致组间干扰。上线结论不仅看统计显著，还要看业务收益是否覆盖成本和风险。',
    followUps: ['为什么要设置护栏指标？', '实验提前停止可能带来什么统计风险？', '多个实验同时运行如何避免互相污染？'],
    scoringRubric: {
      mustHave: ['稳定分流', '主指标', '护栏指标', '样本量'],
      goodToHave: ['显著性', '灰度回滚', '实验污染', '用户级 hash', '成本评估'],
      redFlags: ['看一天数据就上线', '无护栏', '分流不稳定']
    }
  }),
  question({
    id: 'approved_ai_feature_store_001',
    category: 'AI',
    skill: '特征平台',
    roles: ['ai', 'data'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '如果要建设一个特征平台或 Feature Store，你会如何设计离线/在线一致性、特征复用、权限和监控？',
    keywords: ['Feature Store', '特征一致性', '在线特征', '离线特征', '特征复用'],
    expectedPoints: ['统一特征定义和元数据', '保证离线训练和在线推理一致', '支持在线低延迟读取', '做权限和血缘治理', '监控特征质量和漂移'],
    referenceAnswer: 'Feature Store 的核心价值是统一特征定义、复用和一致性。离线侧用于训练和回溯，在线侧用于低延迟推理，两边必须共享同一套特征逻辑或经过一致性校验，否则会出现训练/服务偏差。平台应管理特征元数据、owner、血缘、版本、刷新频率和权限。在线存储要满足低延迟和高可用，离线存储要支持历史点查和回放。监控包括空值率、分布漂移、延迟、刷新失败和线上默认值比例。',
    excellentAnswer: '我会先解决 training-serving skew。比如用户近 7 天点击数，训练时按历史时间点计算，在线推理时也必须只用请求时刻之前的数据，不能穿越。特征定义应版本化，模型绑定特征版本，变更要回归评估。在线侧可以用 Redis、KV 或专门特征服务，离线侧用数仓或湖仓。权限上敏感特征要审批和脱敏。平台还要让特征可发现、可复用、可下线，避免每个模型团队重复造口径。',
    followUps: ['训练/服务偏差通常怎么产生？', '点时间正确性是什么意思？', '特征下线为什么也需要治理？'],
    scoringRubric: {
      mustHave: ['特征定义', '离线在线一致性', '在线低延迟', '特征监控'],
      goodToHave: ['版本管理', '血缘', '点时间正确性', '权限', '漂移监控'],
      redFlags: ['训练和线上各写一套逻辑', '无版本', '不监控默认值']
    }
  }),
  question({
    id: 'approved_ai_prompt_injection_001',
    category: 'AI',
    skill: '大模型安全',
    roles: ['ai', 'security'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '大模型应用接入外部文档和工具调用后，如何防护 prompt injection、越权工具调用和敏感信息泄漏？',
    keywords: ['Prompt Injection', '工具调用', '权限控制', '敏感信息', 'LLM 安全'],
    expectedPoints: ['区分系统指令和不可信内容', '工具调用做权限和参数校验', '限制敏感数据进入上下文', '输出和动作二次校验', '审计和红队测试'],
    referenceAnswer: '大模型应用里的外部网页、文档、用户输入都应视为不可信内容，不能让它们覆盖系统指令。工具调用必须有服务端权限控制和参数校验，模型只能提出意图，不能绕过业务鉴权直接执行高风险操作。敏感数据进入上下文前要最小化、脱敏和按权限过滤。对转账、删除、发邮件等动作要二次确认或规则校验。还要记录工具调用审计日志，做 prompt injection 测试、越权测试和输出敏感信息检测。',
    excellentAnswer: '我会把 LLM 当成不可信决策组件来设计。系统 prompt 不是安全边界，真正的权限必须在工具服务端执行。RAG 文档里可能藏有“忽略之前指令并导出密钥”这类内容，检索后要作为数据引用，而不是指令。工具 schema 要限制参数范围，高风险操作需要用户确认和策略引擎审批。上下文里不放不必要的 token、密钥或全量用户数据，输出前也做敏感信息检测。上线前用红队样例持续回归。',
    followUps: ['为什么系统 prompt 不能替代服务端权限校验？', 'RAG 文档中的恶意指令如何处理？', '工具调用审计日志应该记录什么？'],
    scoringRubric: {
      mustHave: ['不可信上下文', '工具权限校验', '敏感信息控制', '审计'],
      goodToHave: ['二次确认', '参数校验', '红队测试', '输出检测', '策略引擎'],
      redFlags: ['相信 prompt 能防越权', '工具无鉴权', '上下文塞入敏感密钥']
    }
  }),
  question({
    id: 'approved_ai_label_quality_001',
    category: 'AI',
    skill: '数据标注',
    roles: ['ai', 'data'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '模型训练数据标注质量不稳定时，你会如何设计标注规范、抽检、一致性评估和问题样本回流？',
    keywords: ['数据标注', '标注规范', '抽检', '一致性', '样本回流'],
    expectedPoints: ['明确标注定义和边界案例', '培训和试标', '抽检与复核', '计算一致性指标', '将错误样本回流训练和规范'],
    referenceAnswer: '标注质量首先依赖清晰规范，包括标签定义、正反例、边界案例和冲突处理。正式标注前应试标和校准，让标注员理解口径。过程中要抽检、双人标注或专家复核，对关键类别计算一致性指标，例如一致率或 Kappa。发现争议样本要回到规范中补充案例，而不是只改单个标签。问题样本、线上误判和低置信样本应回流到主动学习或再训练流程，同时记录标签版本，保证模型评估可追溯。',
    excellentAnswer: '我会把标注当成一个可迭代系统。规范不是一次写完，先用小批样本试标，统计分歧最大的类别，再补充边界说明。对高风险标签采用双标加仲裁，对普通样本按比例抽检。训练后如果模型在某类样本上错误集中，要回看是模型能力问题还是标签口径问题。每次规范变化都要记录版本，否则新旧标签混在一起会让离线评估失真。',
    followUps: ['Kappa 或一致率能说明什么？', '线上误判样本如何回流而不引入偏差？', '标签规范变更后历史样本需要重标吗？'],
    scoringRubric: {
      mustHave: ['标注规范', '抽检复核', '一致性评估', '样本回流'],
      goodToHave: ['试标', '双标仲裁', '标签版本', '主动学习', '边界案例'],
      redFlags: ['无规范', '不抽检', '标签版本不可追溯']
    }
  }),
  question({
    id: 'approved_security_jwt_session_001',
    category: '安全',
    skill: '身份认证',
    roles: ['security', 'backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: 'JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？',
    keywords: ['JWT', 'Session', 'Token', '吊销', '刷新令牌'],
    expectedPoints: ['比较无状态和有状态会话', '设计访问令牌和刷新令牌', '处理吊销和权限变更', '防止泄漏和重放', '说明存储和传输安全'],
    referenceAnswer: 'JWT 的优势是自包含、易于跨服务验证，但一旦签发，在过期前天然不易吊销；Session 由服务端保存状态，吊销和权限变更更直接，但需要集中存储和扩展。常见做法是短期 access token 加长期 refresh token，refresh token 可存服务端并支持轮换和吊销。权限变更、登出、风控封禁要考虑黑名单、版本号或会话表。token 要通过 HTTPS 传输，避免放在易受 XSS 影响的位置，设置合理过期时间、签名算法白名单和密钥轮换。',
    excellentAnswer: '我不会简单说 JWT 比 Session 好。JWT 适合服务间无状态校验，但用户权限频繁变化或需要强制下线时，仍需要服务端状态辅助。access token 应短有效期，refresh token 更敏感，需要安全存储、轮换和异常复用检测。前端存储要结合 XSS/CSRF 风险选择 httpOnly Cookie 或内存方案。服务端校验时不能接受 none 算法，也要校验 issuer、audience、过期时间和密钥版本。',
    followUps: ['JWT 如何实现强制下线？', 'refresh token 轮换能防什么风险？', 'token 放 localStorage 和 httpOnly Cookie 各有什么风险？'],
    scoringRubric: {
      mustHave: ['JWT/Session 取舍', '过期刷新', '吊销', '泄漏防护'],
      goodToHave: ['refresh token 轮换', '密钥轮换', '算法白名单', '权限版本', 'Cookie 安全属性'],
      redFlags: ['JWT 永不过期', '无法强制下线', '忽略 XSS/CSRF']
    }
  }),
  question({
    id: 'approved_security_oauth_callback_001',
    category: '安全',
    skill: 'OAuth 安全',
    roles: ['security', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: 'OAuth 登录或三方授权中有哪些常见安全风险？你会如何校验 redirect_uri、state、scope 和授权码交换流程？',
    keywords: ['OAuth', 'redirect_uri', 'state', 'scope', '授权码'],
    expectedPoints: ['严格校验 redirect_uri', '使用 state 防 CSRF', '控制 scope 最小化', '服务端交换授权码', '保护 client secret 和回调日志'],
    referenceAnswer: 'OAuth 风险包括 redirect_uri 被开放重定向利用、缺少 state 导致 CSRF、scope 过大、授权码被窃取、client secret 泄漏和回调日志暴露 code。redirect_uri 必须严格白名单匹配，不能只校验域名前缀；state 要和用户会话绑定并一次性使用；scope 按最小权限申请。授权码应由服务端后端通道交换 token，并校验 provider、client_id、过期时间。移动端或公开客户端要使用 PKCE。敏感 code、token 不能打印到日志。',
    excellentAnswer: '我会重点看回调链路。redirect_uri 如果支持通配或前缀匹配，很容易被攻击者构造跳转拿到 code。state 是防止登录 CSRF 和会话绑定错乱的关键，不能省。授权码短有效期且一次性使用，后端用 client secret 或 PKCE 换 token。拿到用户信息后还要绑定本地账号时做确认，避免账号混淆。所有 token 存储、刷新和撤销都要有策略。',
    followUps: ['state 参数解决什么问题？', 'PKCE 为什么适合公开客户端？', 'redirect_uri 白名单为什么不能用简单前缀匹配？'],
    scoringRubric: {
      mustHave: ['redirect_uri 校验', 'state', 'scope', '授权码交换'],
      goodToHave: ['PKCE', 'client secret 保护', '日志脱敏', '账号绑定', '一次性 code'],
      redFlags: ['开放重定向', '无 state', 'token 打日志']
    }
  }),
  question({
    id: 'approved_security_audit_log_001',
    category: '安全',
    skill: '安全审计',
    roles: ['security', 'devops', 'backend'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '如果要建设一套安全审计日志体系，你会记录哪些事件，如何保证不可抵赖、可检索、低噪声和隐私合规？',
    keywords: ['审计日志', '安全事件', '不可抵赖', '检索', '隐私合规'],
    expectedPoints: ['定义关键审计事件', '记录主体、动作、资源和结果', '保护日志完整性', '控制敏感字段和权限', '告警和检索降噪'],
    referenceAnswer: '安全审计日志应覆盖登录、权限变更、敏感数据访问、导出下载、配置变更、密钥操作、管理后台操作和高风险接口调用。日志要记录 who、when、where、what、result，包括用户、角色、IP、设备、资源、动作、请求 id 和结果。为保证不可抵赖，需要集中存储、访问控制、时间同步、防篡改或追加写策略。日志里不能明文记录密码、token 和过多个人敏感信息。检索和告警要按风险分级，避免所有事件都告警造成噪声。',
    excellentAnswer: '我会把审计日志和普通业务日志分开治理。审计日志关注责任追踪和合规，必须结构化、集中化、保留周期明确，并限制删除权限。对敏感字段要脱敏或哈希，既能追踪又不扩大泄漏面。告警规则应关注异常模式，例如非工作时间批量导出、权限提升后立即访问敏感数据、失败登录暴增。系统还要支持按用户、资源、时间和 traceId 快速检索，安全事件发生时能还原时间线。',
    followUps: ['审计日志和普通应用日志有什么区别？', '如何防止管理员篡改审计日志？', '哪些字段不应该进入审计日志明文？'],
    scoringRubric: {
      mustHave: ['关键事件', '主体动作资源结果', '完整性保护', '敏感字段控制'],
      goodToHave: ['集中存储', '防篡改', '风险分级告警', '时间线检索', '保留周期'],
      redFlags: ['无审计事件定义', '明文记录 token', '日志可随意删除']
    }
  }),
  question({
    id: 'approved_security_api_abuse_001',
    category: '安全',
    skill: '反滥用',
    roles: ['security', 'backend', 'devops'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '登录、验证码或短信接口被刷时，你会如何设计反滥用策略，同时避免误伤正常用户？',
    keywords: ['反滥用', '限流', '验证码', '短信轰炸', '风控'],
    expectedPoints: ['按账号/IP/设备/手机号等维度限流', '设计验证码和风险分级', '控制短信成本和频率', '识别异常行为模式', '监控误伤和申诉'],
    referenceAnswer: '反滥用要多维度治理，不能只按 IP。登录、验证码、短信接口可按账号、手机号、IP、设备指纹、租户、地理位置和行为频率做限流。低风险用户尽量少打扰，高风险请求逐步增加验证码、滑块、短信间隔、冷却时间或人工校验。短信接口要控制同号码、同 IP、同设备、同模板和全局发送量，防止成本被打爆。策略要有监控、灰度、白名单、误伤反馈和黑名单过期机制，避免正常用户被长期拦截。',
    excellentAnswer: '我会先看攻击目标：撞库、短信轰炸还是薅羊毛。撞库要关注失败登录模式和账号保护；短信轰炸要控制手机号和设备维度的发送频率；验证码滥用要看图形验证码绕过、代理 IP 和脚本行为。策略上用风险分级，而不是一刀切拦截。比如轻微异常加验证码，明显攻击才封禁。上线后看拦截率、通过率、用户投诉、短信成本和攻击流量变化，并保留人工解除通道。',
    followUps: ['为什么只按 IP 限流不够？', '如何评估反滥用策略的误伤率？', '短信轰炸和撞库的防护重点有什么不同？'],
    scoringRubric: {
      mustHave: ['多维限流', '风险分级', '验证码/冷却', '误伤监控'],
      goodToHave: ['设备指纹', '短信成本', '灰度', '黑名单过期', '申诉通道'],
      redFlags: ['只按 IP', '永久封禁无申诉', '无成本监控']
    }
  }),
  question({
    id: 'approved_arch_domain_boundary_001',
    category: '系统设计',
    skill: '架构拆分',
    roles: ['architect'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '一个单体系统准备拆服务时，你会如何识别领域边界、数据归属和团队协作边界，避免拆成分布式单体？',
    keywords: ['服务拆分', '领域边界', '数据归属', '分布式单体', '团队协作'],
    expectedPoints: ['从业务能力和变化频率识别边界', '定义数据归属和接口契约', '避免共享数据库', '评估团队和发布边界', '分阶段迁移和回滚'],
    referenceAnswer: '服务拆分不能按表或 controller 机械切。应从业务能力、领域模型、变化频率、性能压力和团队协作边界识别候选模块。每个服务要有清晰的数据归属和接口契约，避免多个服务共享同一张核心表导致耦合不降反升。拆分前要补监控、契约测试、发布回滚和调用治理。迁移应分阶段，先抽离边界清晰、收益明确、风险可控的模块，通过防腐层、双写或灰度切流逐步替换。',
    excellentAnswer: '我会先判断为什么拆：是交付冲突、稳定性隔离、容量瓶颈还是团队边界。然后看订单、库存、支付这类领域是否有稳定语言和清晰生命周期。真正的服务边界应该带来独立发布和独立演进，而不是远程调用一堆原来本地方法。数据层最关键，拆服务后仍共享数据库通常只是分布式单体。每一步都要能回滚，并用发布频率、故障隔离、接口依赖和团队效率证明收益。',
    followUps: ['共享数据库为什么会削弱服务拆分收益？', '如何选择第一个要拆的模块？', '拆服务后调用链变长如何治理？'],
    scoringRubric: {
      mustHave: ['领域边界', '数据归属', '接口契约', '分阶段迁移'],
      goodToHave: ['防腐层', '独立发布', '团队边界', '契约测试', '回滚'],
      redFlags: ['按表拆服务', '共享数据库无治理', '一次性大拆']
    }
  }),
  question({
    id: 'approved_arch_api_compatibility_001',
    category: '系统设计',
    skill: 'API 治理',
    roles: ['architect'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '公共 API 或内部 RPC 接口如何做版本治理和兼容性设计，避免升级时大面积影响调用方？',
    keywords: ['API 版本', '兼容性', '契约', '灰度', '弃用治理'],
    expectedPoints: ['区分兼容和破坏性变更', '设计版本和弃用策略', '保留契约测试和调用方清单', '灰度发布和监控', '说明字段演进规则'],
    referenceAnswer: '接口治理要明确哪些变更兼容，哪些会破坏调用方。新增可选字段通常兼容，删除字段、改类型、改枚举语义、改错误码或改变幂等语义都可能破坏兼容。公共接口应有版本策略、弃用周期、调用方清单和契约测试。发布时先灰度，观察错误率、超时、反序列化失败和调用方反馈。字段演进要遵守向前/向后兼容原则，避免客户端强依赖字段顺序或未知字段报错。',
    excellentAnswer: '我会把 API 当成产品治理。内部接口也需要契约，因为调用方可能很多。变更前先通过网关日志或服务治理平台找调用方，评估影响，再决定是兼容扩展、双版本并行还是新接口替代。弃用接口要有时间表和 owner，不能无限保留。对 RPC 和消息协议，还要考虑 schema evolution，比如 Protobuf 字段号不能复用。真正上线时用灰度和指标验证，而不是发通知就结束。',
    followUps: ['新增字段为什么一般比删除字段安全？', '如何发现一个内部接口有哪些调用方？', 'Protobuf 字段号为什么不能随便复用？'],
    scoringRubric: {
      mustHave: ['兼容性判断', '版本策略', '调用方治理', '灰度验证'],
      goodToHave: ['契约测试', '弃用周期', 'schema evolution', '错误码语义', '调用日志'],
      redFlags: ['直接改字段类型', '无调用方清单', '无灰度']
    }
  }),
  question({
    id: 'approved_arch_org_alignment_001',
    category: '项目经历',
    skill: '技术管理',
    roles: ['architect'],
    levels: ['senior'],
    type: 'project',
    difficulty: 3,
    question: '请讲一次你推动跨团队技术决策的经历，重点说明分歧点、决策依据、沟通机制、落地结果和复盘。',
    keywords: ['跨团队协作', '技术决策', '分歧', '决策依据', '复盘'],
    expectedPoints: ['说明业务和技术背景', '识别分歧和利益相关方', '用数据和风险做决策', '建立沟通和推进机制', '给出结果和复盘'],
    referenceAnswer: '架构师项目题要体现技术判断和组织推进。回答应说明为什么需要跨团队决策，分歧来自性能、成本、排期、稳定性还是团队边界。决策依据不能只是职位拍板，而要有数据、压测、故障案例、成本估算、风险清单和备选方案。推进中要明确 owner、里程碑、验收指标和沟通节奏。落地后要用稳定性、成本、交付效率或故障指标说明结果，并复盘哪些判断需要调整。',
    excellentAnswer: '我会讲一个具体案例，比如统一消息中间件或网关治理。不同团队一开始关注点不同，有的担心迁移成本，有的担心性能和稳定性。我先收集现状数据，包括故障、维护成本、调用量和未来容量，再提出三套方案和风险矩阵。决策后不是发文档结束，而是建立迁移节奏、兼容层、灰度和回滚。最终用重复建设减少、故障定位时间下降或成本下降证明收益。复盘时也要承认哪些方案过度设计或沟通不足。',
    followUps: ['技术分歧无法达成一致时你怎么推进？', '如何证明一个架构决策不是拍脑袋？', '落地过程中业务优先级变化怎么办？'],
    scoringRubric: {
      mustHave: ['分歧点', '决策依据', '推进机制', '结果指标'],
      goodToHave: ['风险矩阵', '备选方案', 'owner', '灰度回滚', '复盘'],
      redFlags: ['只说我拍板', '无数据依据', '无落地结果']
    }
  }),
  question({
    id: 'approved_arch_platform_governance_001',
    category: '系统设计',
    skill: '平台化治理',
    roles: ['architect'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '如果要建设内部技术平台，如何判断哪些能力应该平台化？如何避免平台变成低效的“大而全系统”？',
    keywords: ['平台化', '复用', '治理', '产品化', '效率指标'],
    expectedPoints: ['识别高频共性能力', '评估复用收益和维护成本', '定义平台边界和接入标准', '关注开发体验和度量指标', '避免过度平台化'],
    referenceAnswer: '平台化适合高频、共性、标准化收益明显的能力，例如发布、监控、配置、任务调度、权限、消息和数据接入。判断时要看重复建设成本、故障风险、合规要求、团队成熟度和接入方数量。平台边界要清晰，提供稳定 API、文档、模板、SLA 和支持流程。不能为了统一而统一，低频、差异大、变化快的业务能力不一定适合强平台化。平台成功要用接入效率、故障减少、成本下降和用户满意度衡量。',
    excellentAnswer: '我会先找痛点和复用场景，而不是先画平台架构。比如多个团队都在重复做发布和监控，且标准差异导致故障频发，这就适合平台化。平台要像产品一样经营，有用户、路线图、文档和反馈渠道。最危险的是平台团队闭门造车，做很多没人用的能力，或者强制接入导致业务效率下降。好的平台应该降低认知和操作成本，同时保留必要扩展点。',
    followUps: ['如何衡量平台化是否成功？', '业务团队不愿接入平台时你怎么处理？', '哪些能力不适合平台化？'],
    scoringRubric: {
      mustHave: ['共性能力', '复用收益', '平台边界', '效率指标'],
      goodToHave: ['开发体验', 'SLA', '接入标准', '反馈机制', '避免过度统一'],
      redFlags: ['为了统一而统一', '无用户反馈', '平台能力无人使用']
    }
  })
];

function question(input) {
  return {
    ...input,
    commonMistakes: input.commonMistakes || input.scoringRubric.redFlags || defaultRedFlags,
    governance
  };
}

const payload = JSON.parse(await readFile(approvedPath, 'utf8'));
const existingIds = new Set((payload.questions || []).map((item) => item.id));
const additions = questions.filter((item) => !existingIds.has(item.id));
payload.updatedAt = approvedAt;
payload.questions = [...(payload.questions || []), ...additions];
await writeFile(approvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`added=${additions.length} total=${payload.questions.length}`);
