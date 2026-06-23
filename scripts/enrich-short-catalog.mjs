import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogDir = path.join(__dirname, '../data/concrete-refs');
const MIN_LEN = 320;

/** 按技能追加的实质技术段落（命令、配置、指标、坑、验证） */
const EXPANSIONS = {
  'security.json': {
    '威胁建模 STRIDE': '实操：用数据流图标注信任边界和跨边界数据流，每个节点/流用 STRIDE 六类打标签并写缓解措施到 backlog。工具可用 Microsoft Threat Modeling Tool 或 OWASP Threat Dragon。验证：高风险威胁必须有 owner 和修复 deadline，上线前复审未关闭项。',
    'SDL 流程': '落地：需求阶段输出安全需求清单和合规映射；设计阶段强制威胁建模评审；开发接入 SonarQube/Semgrep SAST；测试用 OWASP ZAP DAST + 渗透；发布前做最终安全评审和镜像签名。门禁：高危漏洞阻断发布，例外走审批登记册。',
    '越权测试': '实操：Burp Autorize 或自研脚本双账号互换 userId/orderId 批量重放；垂直越权测 /admin 接口用普通用户 token。修复：服务端从 session/token 取当前用户，WHERE 条件带 owner_id，禁止信任前端 hidden 字段。验证：自动化回归越权用例纳入 CI。',
    'API 签名': '拼接规则示例：sorted(params)+timestamp+nonce 做 HMAC-SHA256，Header 传 X-Signature/X-Timestamp/X-Nonce。服务端校验时间窗 ±300s、nonce 用 Redis SETNX 去重 TTL 10min。常见坑：参数编码不一致（URL encode）、body 和 query 混签顺序错误。',
    '数据脱敏': '日志脱敏用 Logback %mask 或自定义 Converter；DB 脱敏用视图/列级权限。动态脱敏场景：客服查单只显示手机号中间四位。验证：正则扫描日志/导出文件确认无明文身份证、银行卡；脱敏后业务校验（身份证校验位）仍能通过。',
    '密钥泄露响应': '应急 SLA：发现后 1h 内轮换、4h 内完成影响面评估。查 CloudTrail/访问日志是否有异常 API 调用。Git 清理用 BFG --delete-files 或 git filter-repo，轮换后旧密钥立即 revoke。预防：pre-commit 跑 gitleaks，CI 扫依赖和镜像。',
    '云元数据防护': 'AWS 开启 IMDSv2（HttpTokens=required），Azure 用 Managed Identity 替代实例元数据直取。网络层 egress 拒绝 169.254.0.0/16。应用层 SSRF 防护：URL 白名单、禁止内网 IP 段、DNS rebinding 检测。验证：渗透测试尝试 file:// 和 169.254.169.254 访问。',
    'WebShell 排查': '命令：find /var/www -mtime -7 -name "*.php" -o -name "*.jsp"；rkhunter/chkrootkit 查 rootkit。进程：ps aux | grep www-data 看异常 shell。日志：awk 统计 access.log 中 POST 到 .php/.jsp 的 200 响应。处置：隔离主机、保留镜像取证、全量杀毒后从干净备份恢复。',
    '勒索攻击应急': '取证：内存 Volatility dump、磁盘 dd 镜像后再隔离。恢复：从离线不可变备份（WORM/气隙）恢复，先验证备份无感染。合规：按法规决定是否报警。预防：3-2-1 备份策略、定期恢复演练、EDR + 邮件网关 + 补丁管理。',
    '零信任访问': '落地：BeyondCorp/ZTNA 网关替代传统 VPN；设备 posture 检查（补丁、磁盘加密、MDM 注册）；每请求动态策略（身份+设备+位置+行为）。微隔离用 Calico/Cilium NetworkPolicy 按 label 隔离。验证：模拟失陷设备应被拒绝访问核心资源。',
    '最小权限': 'IAM 模板权限按岗位预置，转岗触发权限重算不继承旧权限。JIT 提权用 PAM（CyberArk/BeyondTrust）审批+录像+限时。审计：每季度导出权限清单 vs 实际 API 调用日志，标记 90 天未使用权限回收。',
    'K8s 安全': 'Pod Security 设 restricted：runAsNonRoot、drop ALL capabilities、readOnlyRootFilesystem。NetworkPolicy 默认 deny-all 再按需放行。Secrets 用 External Secrets Operator 从 Vault 注入。审计：kube-apiserver --audit-log-path，Falco 监控异常 syscall。',
    '容器逃逸': '禁止 privileged、hostPID、hostNetwork、挂载 /var/run/docker.sock。Capabilities 只加 NET_BIND_SERVICE 等必需项。运行时 Falco 规则检测 nsenter/mount 异常。CVE 响应：关注 runc/containerd 漏洞，及时升级节点内核和运行时。',
    '镜像安全': 'CI 流水线 Trivy/Grype 扫描，CRITICAL 阻断构建。cosign sign + Kyverno/Gatekeeper 验签准入。基础镜像选 distroless 或 chainguard，多阶段构建不含编译器和 shell。SBOM 用 syft 生成随镜像发布。',
    '供应链投毒': 'lockfile 提交到 Git，CI 用 npm ci/pip install --require-hashes。私有 registry proxy 审核后才同步公共包。Dependabot/Renovate 自动 PR 安全更新。新依赖人工 review 维护者信誉和下载量。',
    'SAST 落地': '裁剪规则集：去掉误报高的规则，标记 suppress 并设复审日期。门禁：CRITICAL/HIGH 阻断 merge。给研发提供修复示例代码而非只报 CWE 编号。度量：MTTR、误报率、修复率按团队排名驱动改进。',
    'DAST 落地': 'ZAP/Burp 配置登录态（cookie/token 自动刷新）、扫描范围白名单、rate limit 防打挂测试环境。排除破坏性 payload（DROP/DELETE）。结果与 JIRA 集成，同一漏洞多入口去重。预发扫描需变更窗口审批。',
    '漏洞评级': '公式：风险 = 可达性（公网/需认证）× 影响（RCE/数据泄露）× 利用成熟度（PoC/在野）。CVSS 9.0 但仅内网低可达可降为 Medium。EPSS 分数辅助排序。每季度复审评级，新 PoC 出现可升级优先级。',
    '安全例外': '例外单必填：风险描述、补偿控制（WAF 规则/网络隔离/增强监控）、责任人、过期日（≤30天）。到期自动告警，未修复则阻断发布。例外登记册季度审计，推动闭环而非无限延期。',
    '隐私删除': '删除链路：主库 DELETE → 缓存 DEL key → MQ 广播删除事件 → 下游消费确认 → 搜索索引删除。日志保留脱敏审计记录不删原文。备份按保留策略自然淘汰，不单独回擦。验证：删除后全链路查询确认无残留。',
    '加密密钥分层': 'DEK 每条记录或每租户独立，KEK 在 KMS（AWS KMS/阿里云 KMS）托管。轮换 KEK 时 KMS ReEncrypt 只重加密 DEK 不动业务数据。禁止代码硬编码 DEK，通过 KMS GenerateDataKey 获取。',
    'Token 泄漏监控': '风控规则：异地登录（GeoIP 突变）、新设备、凌晨高频 API、敏感接口突增。高风险自动 revoke refresh_token 并强制 MFA。阈值按用户历史基线动态调整，避免一刀切误杀。',
    '风控联动': '同步 API 超时 50ms 内返回决策（pass/challenge/block），异步事件订阅补充画像。支付场景高风险走 3DS/人脸二次验证。规则热更新通过配置中心推送，灰度 1% 验证后全量。',
    '安全审计平台': '事件模型 JSON：{actor, action, resource, result, ip, timestamp, traceId}。存储 WORM（S3 Object Lock）防篡改，保留期按等保/GDPR 要求（金融 7 年）。告警规则：批量删除、非工作时段高危操作、权限变更。',
    '红蓝对抗复盘': '输出：攻击路径时间线、检测延迟（TTD）、响应延迟（TTR）、未覆盖盲区。改进分技术（补检测规则/漏洞）、流程（缩短响应 SLA）、意识（钓鱼演练）。下次演练验证改进项关闭率。',
    'WAF 绕过': '防御：请求标准化（URL decode 两次、Unicode 归一化）后再匹配规则。限制 body 大小防缓冲区溢出绕过。WAF 只是纵深一层，代码层参数化查询和输出编码才是根本。',
    '业务逻辑漏洞': '测试：手工构造 0 元订单、优惠券叠加、跳过审批节点、并发抢库存。代码评审关注状态机和金额计算在服务端。运行时监控异常业务指标（0 元订单率、异常退款率）自动告警。',
    '支付安全': '幂等：商户订单号唯一索引防重复扣款。金额服务端重算不信任前端。回调验签用支付平台公钥验证 RSA/SHA256 签名。每日对账：系统流水 vs 渠道账单，差异自动告警+人工核查。',
    '验证码安全': '短信限频：同手机号 1 次/min、10 次/天，同 IP 50 次/天。发送前过行为验证码（滑块）防轰炸。验证码 5min 过期、验证后立即失效。服务端校验，禁止前端 JS 判断后跳过。',
    '账号接管': 'MFA 强制：TOTP/FIDO2 优先于 SMS（防 SIM swap）。对接 HaveIBeenPwned 检查密码是否泄露。异常登录：新设备邮件通知+二次验证。高危操作（改密/转账）独立二次验证。',
    '日志敏感信息': '扫描：grep -rE "(password|secret|token)=\\S+" logs/。治理：结构化日志标记 @Sensitive 字段自动掩码。禁止 DEBUG 级别记录完整请求体。新增日志 PR 必须过安全 review。',
    '权限回收': 'HR 系统 webhook 触发：离职当天 revoke 所有 IAM/SSO/VPN/SSH key。季度审计：90 天未使用权限自动回收通知 owner 确认。PAM 特权账号到期自动锁定。',
    '三方服务安全': '评估清单：数据存储地域、子处理者列表、SOC2/ISO27001 认证、漏洞披露 SLA、合同数据泄露通知时限（≤72h）。沙箱环境验证 SDK 网络行为和数据上报范围。',
    '移动端安全': '证书固定：OkHttp CertificatePinner / iOS TrustKit，需有 pin 轮换和过期预案。请求签名：timestamp+nonce+HMAC 防重放。密钥存 Android Keystore/iOS Keychain，禁 SharedPreferences 明文。',
    '安全培训': '用本仓库真实漏洞 case 做培训（如 SQL 注入修复前后对比）。编码规范附正反例。度量：培训后同类漏洞逃逸率季度对比。融入 onboarding 和 code review checklist。',
    '安全指标': '核心：MTTR（高危漏洞修复周期）、逃逸率（线上发现/总发现 <5%）、SAST/DAST 覆盖率、安全例外活跃数趋势。仪表盘按团队/业务线下钻，驱动改进而非 KPI 考核。',
    '证书透明度': '监控：crt.sh API 或 Censys 每日轮询域名新证书。异常签发（未知 CA、通配符突增）立即告警。CAA DNS 记录限制可签发 CA 列表。配合证书到期监控（x509_cert_not_after）。',
    '数据出境': '个保法/GDPR：识别出境数据类型和规模，安全评估+备案。技术：数据本地化存储、出境字段最小化、传输 TLS1.2+、存储 AES-256。签 DPA 明确责任和泄露通知义务。',
    '安全基线自动化': 'kube-bench 检查 K8s CIS 基线，InSpec/Chef Compliance 检查 OS 配置。漂移检测：每日扫描 vs 基线 diff，自动修复（Ansible）或告警。CI 新环境上线前必须通过基线检查。',
    '密钥托管迁移': '步骤：盘点（gitleaks/trufflehog 全库扫描）→ KMS 创建密钥 → 双模式过渡（同时支持明文和 KMS 读取）→ 灰度切换 → 移除明文路径 → 审计确认无残留。权限：KMS key policy 限制调用者身份。',
    '越权测试': '补充：水平越权改 URL 中 id、垂直越权换低权限 token 访问管理接口。自动化脚本批量替换资源 ID 回归。修复后验证 object-level 权限校验在 service 层而非 controller 参数。',
    '数据脱敏': '补充：动态脱敏按角色返回不同粒度（客服看中间四位、管理员看全量需审批）。导出文件脱敏后仍需扫描确认。测试环境禁止直接使用生产明文数据。',
    '最小权限': '补充：权限申请工单关联业务需求，到期自动回收。特权操作（生产 DB 写）走 JIT 审批+录像。离职当天 HR 事件触发全量 revoke 并验证无残留 token。',
    'SAST 落地': '补充：与研发共建 suppress 规则库，误报标记需安全团队复审。高危漏洞 SLA：24h 响应、7 天修复。修复建议附安全代码示例而非只报 CWE 编号。',
    '漏洞评级': '补充：内网漏洞降级但不忽略，设修复 deadline。在野利用（CISA KEV 列表）直接升 Critical。评级结果录入漏洞管理平台跟踪闭环。',
    '安全例外': '补充：无补偿控制的例外不予批准。例外到期前 7 天自动提醒 owner。同一例外连续续期 ≥3 次需架构委员会评审。',
    '隐私删除': '补充：删除请求需身份验证+冷却期防恶意删除。下游系统确认回执后才标记删除完成。GDPR 30 天内响应，记录处理时效。',
    'Token 泄漏监控': '补充：refresh_token 轮换机制，检测到泄漏立即吊销全族 token。设备指纹变化+异地登录组合评分。用户自助「登出所有设备」功能。',
    '风控联动': '补充：风控决策日志留存 ≥180 天供审计。规则变更需灰度验证误伤率。支付/转账等资金操作风控不可绕过。',
    '红蓝对抗复盘': '补充：红队报告含 ATT&CK 技术映射。蓝队检测覆盖率（哪些攻击步骤被检测到）。改进项纳入下个季度安全 OKR 跟踪。',
    'WAF 绕过': '补充：定期用 OWASP Core Rule Set 更新+自定义规则。业务新增接口上线前过 WAF 规则评审。误报和漏报率双指标监控。',
    '业务逻辑漏洞': '补充：核心流程（支付/优惠/审批）做威胁建模识别逻辑风险。代码评审 checklist 包含状态机和金额计算。运行时异常业务指标监控。',
    '支付安全': '补充：PCI-DSS  scope 最小化，卡号不落库。3DS 二次验证高风险交易。支付回调 IP 白名单+签名双重验证。',
    '验证码安全': '补充：图形验证码防 OCR 用扭曲+干扰线。同一 IP 连续失败 5 次锁定 15min。验证码答案仅存服务端 session/Redis。',
    '账号接管': '补充：密码策略：长度 ≥12+复杂度+泄露密码检查。登录失败锁定策略。新设备登录邮件/短信通知用户确认。',
    '权限回收': '补充：回收后验证：API token 失效、SSH key 删除、VPN 账号禁用。外包人员权限单独管理，合同到期自动回收。',
    '三方服务安全': '补充：SDK 网络行为审计（是否上报多余数据）。合同数据泄露通知时限 ≤72h。退出预案：替换方案和迁移时间表。',
    '安全培训': '补充：新员工 onboarding 必修安全课。研发安全 Champions 制度，每团队 1 名安全接口人。钓鱼模拟演练季度一次。',
    '安全指标': '补充：对比行业基准（如 OWASP SAMM 成熟度）。逃逸漏洞根因分类统计（SAST 漏检/DAST 漏检/逻辑漏洞）。指标驱动安全投入决策。',
    '数据出境': '补充：个保法安全评估+网信办申报流程。出境数据脱敏/加密。境内备份保留，出境仅为必要业务所需最小集。',
    '攻防演练授权': '授权范围：明确测试目标系统/IP 段、测试手法（渗透/社工/钓鱼）、时间窗口、紧急联系人和停止指令。法律：签署书面授权书，避免未授权测试触犯《网络安全法》。范围外系统禁止测试。全程记录操作日志，测试数据脱敏处理。'
  },
  'qa.json': {
    '测试策略评审': '评审检查单：需求追溯矩阵是否 100% 覆盖、核心链路（支付/登录）用例占比是否 ≥60%、异常分支是否有对应用例、自动化回归范围是否明确。输出：优先级标注（P0/P1/P2）和取舍理由文档。',
    '用例设计评审': '方法：画状态机逐边验证合法/非法跳转；等价类表覆盖有效/无效分区；边界值表列上下界（0、0.01、MAX_INT）。典型遗漏：逆向状态跳转（已取消再支付）、并发竞态、幂等重复提交。',
    '接口自动化框架': '分层：base（HTTP 客户端+断言+日志）→ case（业务逻辑）→ data（yaml/json 参数）。conftest.py 管理 token fixture 和环境变量切换。CI：pytest-xdist -n auto 并行，--reruns 2 应对偶发失败。报告：Allure + 失败自动附请求响应。',
    'UI 自动化架构': 'Playwright 优先：auto-wait 减少 flaky，trace on-first-retry 保留失败现场。POM 强制：Page 类封装定位器，Case 只调业务方法。定位器优先级：data-testid > role+name > text。CI headless + 失败截图 + 视频录制。',
    '性能瓶颈定位': '压测：k6/JMeter 阶梯加压找拐点（TPS 不再增长或 RT 飙升点）。应用层：async-profiler/JFR 火焰图、jstack 看 BLOCKED。DB：slow query log + EXPLAIN。连接池：HikariCP active/idle 监控。优化后同场景复压验证。',
    '全链路压测': '染色：网关 header X-Shadow-Traffic=1 全链路透传。影子库：表结构同步生产，写入拦截（DB 触发器或中间件）。保护：压测流量限流+熔断，核心服务保留 30% 容量给真实用户。验证：压测前跑染色透传测试用例。',
    '稳定性压测': '参数：生产峰值 60-70% 流量持续 12-24h。监控：内存曲线（应平稳不持续上涨）、连接数、GC 频率、MQ lag。对比：开始和结束时的 heap dump/连接数快照。典型发现：连接泄漏、ThreadLocal 未清理、缓存无限增长。',
    '接口 Mock 平台': '能力：Swagger 导入自动生成 Mock、请求参数条件路由不同响应、故障注入（delay/500/timeout）、调用记录审计。版本：Mock 规则纳入 Git，环境变量切换真实/Mock。定期清理过期规则防维护负担。',
    '精准回归': '实现：git diff → 变更方法 → Jacoco/静态调用图 → 映射表 → 精选用例集。维护映射：覆盖率数据反向建立 method→testcase 关系。效果度量：回归用例数缩减比例和执行时间对比。',
    '测试覆盖分析': '三维：需求追溯矩阵（目标 100%）、Jacoco 分支覆盖（核心 ≥80%）、接口自动化覆盖率。低代码覆盖指向遗漏异常分支；低需求覆盖指向功能遗漏。不追求 100% 行覆盖，关注风险区域。',
    '缺陷分级': 'P0：核心功能不可用+影响大量用户，立即修。P1：核心受损或中等影响，版本前必修。P2：非核心，下迭代。线上在修自动升 P。不接受无复现步骤的 P0。分级记录到 JIRA 字段便于统计。',
    '质量度量': '核心指标：逃逸率（线上/总缺陷 <5%）、缺陷密度（每千行/每迭代）、自动化通过率、MTTR。按迭代趋势图，逃逸率突升触发根因分析（测试遗漏/需求变更/环境差异）。',
    '测试平台化': '架构：用例管理+执行引擎+报告服务微服务化，K8s 弹性执行节点。先服务好一个项目验证价值，再抽象通用能力。Owner 和 SLA 明确，平台自身有自动化测试保障。',
    '灰度测试': '放量：1%→5%→10%→50%，每阶段观察 ≥1 个业务周期。对比灰度/非灰度：错误率、转化率、客诉率。回滚阈值：错误率超基线 2 倍或 P0 客诉。监控 Crashlytics/Sentry 崩溃率。',
    '多租户测试': '数据隔离：租户 A token 查租户 B 数据必须 403/空。SQL 直连验证每条查询带 tenant_id 条件。缓存 key 必须含 tenantId 防串数据。配置变更只影响目标租户。',
    '报表测试': '口径验证：用源数据手工计算 vs 报表结果，重点聚合（SUM/COUNT DISTINCT）、时区、空值。导出 Excel 与页面逐行对比。浮点金额用分（整数）存储避免 0.01 差异。',
    '搜索测试': '矩阵：query→期望 doc_id 列表自动化验证。维度：召回完整性、排序合理性、同义词/纠错、P99<200ms。分词边界 case：「手机壳」vs「手机 壳」。',
    '推荐测试': '离线 NDCG/Recall@K + 线上 A/B 转化率。离线在线一致性：同一用户特征分别调离线模型和线上 API 对比排序。多样性：类目熵 > 阈值。冷启动用户不应全是热门。',
    '消息链路测试': '场景：重复消费幂等（唯一 ID 去重）、分区顺序消费、延迟消息触发、死信队列（失败 N 次后进入 DLQ 并告警）。Docker 嵌入式 MQ 环境自动化。典型缺陷：幂等键缺失致重复扣款。',
    '缓存一致性测试': 'JMeter 并发读写验证 Cache Aside 写后删缓存时序。穿透：大量不存在 key 验证布隆过滤器。击穿：热点 key 过期瞬间验证互斥锁/永不过期。回源：批量 miss 验证限流合并。',
    '数据库迁移测试': '校验：迁移前后逐表行数、关键字段 checksum、聚合金额对比。灰度：切读→切写→全量。检查：字符集、自增 ID 起始值、外键、增量同步。回滚演练验证可逆。',
    '配置测试': '流程：灰度推送→验证灰度实例→全量→模拟错误配置→一键回滚。验证：推送延迟可感知、生效范围不误推、审计日志完整。敏感配置不明文存储。',
    '审批流测试': '状态机表驱动：合法路径全通过、非法跳转全拒绝。场景：撤回时机、加签不中断、超时自动升级。角色：越权操作返回 403。并发：两审批人同时操作幂等。',
    '风控测试': '用例库：风险行为用例库 + 正常行为用例库。指标：命中率、误伤率 <0.1%。策略灰度 1% 对比后全量。线上监控误拦截告警。',
    '日志测试': '自动扫描：traceId 全链路透传无断裂、必填字段（userId/bizId/resultCode）无缺失。错误码与异常一一映射，每条错误码有排查文档。',
    '告警测试': '演练（fire drill）：故意触发 CPU>80% 验证告警产生→通知送达→升级机制。记录告警到响应时间。防告警风暴：聚合+抑制规则。',
    '兼容升级测试': '矩阵：N-1/N-2 客户端 × 新版本服务端。验证：字段只增不删、枚举向后兼容、v1 API 仍可用。Feature Toggle 关闭后降级体验正常。',
    '弱网测试': '工具：TC netem delay 200ms loss 5%、Chrome Network throttling。场景：超时无 ANR、重试幂等、离线缓存可用、恢复后自动同步。集成 CI 定期跑。',
    '客户端崩溃测试': '平台：Bugly/Crashlytics 收集堆栈+设备+操作路径。Top 崩溃排序提 P0/P1。符号表还原混淆堆栈定位代码行。目标：崩溃率 <0.1%。',
    '安装升级测试': '场景：全新安装、N-1 升级（数据/登录态保留）、回滚、DB schema 迁移。边界：存储不足、安装中断、低电量。迁移脚本错误是常见启动崩溃原因。',
    '测试数据脱敏': '扫描：正则匹配手机号/身份证/银行卡明文。验证：脱敏后外键关联完整、业务校验（身份证校验位）仍通过。脱敏管道加自动校验环节。',
    '权限矩阵测试': '矩阵驱动：角色×资源×操作批量生成用例。场景：角色继承、互斥角色、数据权限（同接口不同数据范围）。自动化对比期望 403/200。',
    '合同账单测试': '金额用分（整数）存储。多级分成合计与总额差异 ≤1 分。对账：系统流水 vs 支付渠道日账单。并发冲正、部分退款累计不超实付。',
    '库存测试': 'JMeter 100 并发扣最后 1 件：只成功 1 个。验证乐观锁 version 或 Redis DECR 原子性。DB CHECK(stock>=0)。归还库存幂等。',
    '订单状态机测试': '表驱动合法+非法全路径。高风险节点（支付成功）并发测试。补偿：超时取消释放库存、退款逆向流程状态一致。',
    '退款测试': '部分退款优惠分摊正确。支付渠道重复回调幂等。累计退款 ≤ 实付。退款后账务与渠道对账一致。',
    '测试环境版本': '脚本每日对比注册中心版本与基线，偏差 >2 版本告警。特性环境按 MR 按需创建。版本变更自动通知相关测试人员。',
    '探索式测试章程': 'Charter 模板：目标/范围/时间盒（60min）/资源。探索中记录操作路径和发现。结束后整理可追踪报告，弥补脚本测试遗漏的边缘场景。',
    '自动化失败分诊': 'CI 失败后错误信息聚类分四类：环境（大量同时失败）→自动重跑；数据（造数失败）；脚本（定位器/字段变更）；产品缺陷。分诊后指派不同处理人。',
    '测试准入准出': '准入量化：冒烟 P0 100% 通过+用例评审完成。准出：P0/P1 全关+自动化 ≥98%+性能达标+安全无高危。纳入发布审批必要条件，不接受「基本没问题」。',
    '质量推进': '数据：逃逸率趋势、故障损失金额、返工工时占比。可视化看板给管理层。故障复盘驱动改进而非追责。找研发共识点：减少凌晨修 Bug。',
    '测试策略评审': '补充：变更影响分析（改了哪些模块/接口）驱动用例优先级。历史缺陷热点模块加权覆盖。评审输出风险矩阵和未覆盖项清单。',
    '用例设计评审': '补充：pairwise 组合测试减少用例数但保持覆盖。探索性测试 charter 补充脚本遗漏。评审记录遗留问题跟踪到关闭。',
    '质量度量': '补充：千行代码缺陷率横向对比模块质量。reopen 率反映修复质量。度量结果在迭代回顾会上讨论改进而非考核个人。',
    '报表测试': '补充：跨时区报表验证（UTC vs 本地时间）。多币种金额汇总验证。大数据量报表分页性能测试。',
    '推荐测试': '补充：位置偏差修正（IPS/无偏评估集）。A/B 实验最小运行周期和样本量计算。冷启动用户体验专项测试。',
    '数据库迁移测试': '补充：迁移期间增量同步验证（binlog/CDC）。回滚演练：从新库切回旧库数据完整性。字符集/排序规则一致性检查。',
    '配置测试': '补充：配置热更新不停机验证。多环境配置一致性 diff 检查。配置变更影响面分析（哪些服务依赖该配置）。',
    '审批流测试': '补充：并行审批和串行审批都覆盖。审批人离职/转岗后待办自动转交。审批超时自动提醒和升级。',
    '风控测试': '补充：规则变更前后 A/B 对比命中率和误伤率。边界 case：刚好在阈值上下的请求。风控降级时业务兜底验证。',
    '测试数据脱敏': '补充：关联表脱敏后外键关系完整性验证。脱敏数据量足够支撑性能测试。定期重新扫描防新增明文泄露。',
    '权限矩阵测试': '补充：矩阵自动生成覆盖率报告。新增角色/资源自动扩展矩阵。数据权限（行级）和接口权限分开验证。',
    '缺陷根因分析': '方法：5 Why 追问到可行动根因（非「人为失误」）。分类：需求遗漏/设计缺陷/编码错误/环境差异/测试遗漏。输出：根因+预防措施+验证方式。用鱼骨图辅助多人讨论。同类缺陷聚类看系统性问题。',
    '线上问题复盘': '时间线：发现→定位→止血→修复→验证。区分触发原因和根因。改进项分技术（补监控/测试）、流程（缩短响应 SLA）、组织（值班/协作）。无责复盘，改进项跟踪到关闭。输出 Postmortem 文档纳入知识库。',
    '测试负责人项目': '（示例）电商大促前质量保障项目。我负责测试策略制定和跨团队协作。范围：核心链路（下单/支付/库存）深度测试+全链路压测+灰度验证。关键动作：风险驱动用例优先级、影子流量压测验证容量、缺陷分级和发布门禁。结果：大促零 P0 故障，逃逸缺陷较上次下降 40%。'
  },
  'ops.json': {
    '网络抓包': '命令：tcpdump -i eth0 -w cap host x.x.x.x and port 443；tshark -r cap -Y "tcp.analysis.retransmission"。配合 ss -s 看 Recv-Q/Send-Q。排查顺序：DNS→TCP 握手→TLS→HTTP 时序。',
    'SYN Flood': '指标：ss -ant state syn-recv | wc -l。防护：sysctl net.ipv4.tcp_syncookies=1、调大 tcp_max_syn_backlog/somaxconn。前置 CDN/WAF 清洗。iptables -A INPUT -p tcp --syn -m limit --limit 1/s -j ACCEPT。',
    'Keepalived VIP': '配置：virtual_router_id 唯一、priority 主>备、track_script 检测 Nginx。脑裂：nopreempt + unicast_src_ip + 仲裁脚本确认对端存活。验证：ip addr show 确认 VIP 唯一绑定。',
    '日志采集链路': '排查：Filebeat registry 位点是否落后；Kafka consumer lag；ES bulk reject。对账：日志产生量 vs 采集量 vs 存储量。延迟：调小 flush_interval 或增 consumer 并行度。',
    'Prometheus 存储': '高基数禁忌：user_id/request_id 做 label。治理：recording rule 预聚合、metric_relabel_configs 丢弃高基数。长期存储：remote_write 到 Thanos/Mimir。监控 prometheus_tsdb_head_series。',
    'Grafana 看板': '组织：按 SLO 视角（可用性/延迟/吞吐）而非堆砌面板。变量 templating 切换环境。告警：Grafana Alerting unified contact point。Dashboard JSON 纳入 Git 版本管理。',
    '堡垒机权限': '方案：JumpServer/CyberArk。四要素：RBAC 授权+录屏审计+高危命令拦截（rm -rf/shutdown）+breakglass 紧急访问告警。命令记录存对象存储 WORM 防篡改。',
    '数据库权限': '禁止共享 root。GRANT 最小权限到表级。生产账号工单审批+有效期。审计：MariaDB audit plugin 或 pgAudit 记录 DDL/DCL。季度巡检 mysql.user 过期账号。',
    'binlog 恢复': '流程：xtrabackup 全量恢复 → mysqlbinlog --start-position/--stop-position 回放增量 → GTID 模式用 --include-gtids。隔离库验证行数/checksum 后再切流。RPO 取决于全量备份频率。',
    '备份加密': '传输：rsync over SSH 或 xtrabackup --encrypt。存储：GPG/AES-256 加密后上传 S3/OSS，密钥 KMS 托管。定期恢复演练验证可解密且数据完整。LUKS 加密备份卷防物理丢失泄露。',
    'Redis Sentinel': '至少 3 Sentinel 节点，quorum=2 判定客观下线。min-replicas-to-write 防脑裂丢写。客户端 Sentinel 模式自动发现 master。failover 期间短暂不可写需业务容忍。',
    'Redis Cluster': '16384 slot，MOVED/ASK 重定向。扩容：redis-cli --cluster reshard 迁移 slot。跨 slot 事务不支持，用 hash tag {user} 保证相关 key 同 slot。最少 3 master 各 1 replica。',
    '容器镜像清理': 'docker image prune -a --filter "until=168h"。Harbor retention policy 保留最近 N 个 tag。多阶段构建减小体积。监控节点磁盘 >80% 触发清理。',
    '系统时间漂移': 'chrony 配置内网 NTP 上游，maxdistance 限制。监控 node_timex_offset_seconds 告警 >500ms。虚拟机注意宿主机时间同步。TLS 证书验证和分布式事务对时间敏感。',
    '负载均衡算法': '轮询适合无状态同质后端；加权轮询处理性能差异；最少连接适合长连接；IP Hash 会话保持但分布可能不均；一致性哈希适合缓存层，节点增减只影响少量 key。',
    'WAF 误拦截': '查 WAF 日志定位规则 ID 和匹配内容。白名单按 URL+参数+规则粒度，避免全局放通。新规则先 observation 模式再 block。监控拦截率突增。',
    'DDoS 应急': '流量型：运营商/CDN 牵引清洗。连接型：syncookies+限速。应用层：WAF+验证码+接口限流。保护核心服务降级非核心释放带宽。攻击消退后逐步放开限流。',
    'CMDB 依赖': '自动发现 Agent 采集拓扑减少人工录入。发布/下线流程强制更新 CMDB。定期 diff 实际运行服务 vs CMDB 记录，不匹配告警 owner 修正。owner/SLA/依赖关系必填。',
    '巡检自动化': '覆盖：磁盘/RAID/CPU/内存/证书过期/进程存活/慢查询/MQ lag。脚本只读+超时+限并发。输出巡检报告，异常自动告警。版本化管理脚本。',
    '机房断电': 'UPS 窗口：优先刷盘（数据库 checkpoint）、降级非核心服务。恢复顺序：网络→存储→DB→缓存→应用。DB 先 crash recovery 再开放连接。双机房容灾+定期断电演练。',
    '容量水位': '三级水位：70% 预警、80% 告警、90% 紧急。维度：CPU/内存/磁盘/连接数/QPS。趋势预测提前扩容。弹性：HPA/VPA 按指标自动扩缩，闲置资源回收。',
    '发布窗口': '低峰发布+大促冻结。灰度 1%→5%→全量，每阶段观察 15min。回滚条件：错误率超基线 2 倍。紧急 hotfix 双审批。变更日历团队可见。',
    'Runbook 演练': '结构：现象→影响→排查命令（可复制）→预期输出→判断条件→处置→验证恢复。季度 Chaos Engineering 注入故障，新人值班前必练。度量：Runbook 覆盖率和执行成功率。',
    '供应商故障': '确认影响范围和供应商状态页。多云架构切备供应商；单供应商降级（缓存兜底/默认值）。恢复后验证再回切。关键依赖必须多活/多供应商。',
    '成本优化': '闲置实例（<10% CPU）缩容/合并。压测验证后降配。Spot/按量跑可中断任务。冷数据转低频/归档存储。度量：单位业务成本（每千次请求成本）。',
    '变更审计': '记录 who/when/what/why/result。GitOps/Terraform 天然可审计。审计日志 WORM 存储防篡改。故障复盘关联变更记录分析因果。'
  },
  'ai.json': {
    '阈值选择': '方法：扫阈值画 PR 曲线，按业务成本矩阵 E[Cost]=FP×c_FP+FN×c_FN 选最小点。容量约束：客服只能处理 N 个预警则限制预测正例数。分布漂移后定期回测阈值。',
    '召回排序架构': '召回千级（多路：CF/向量/规则）→粗排百级（双塔轻量模型）→精排（复杂特征 AUC/NDCG 核心）→重排（多样性/打散/运营位）。各层指标不同：召回看覆盖率，精排看 AUC。',
    '负采样': '混合随机+硬负采样，控制流行度偏差。评估用无偏数据集而非曝光日志。批内负采样效率高但有流行度偏差，需 IPS 修正或混合策略。',
    '在线特征延迟': '监控：特征到达率、P99 延迟、按特征维度缺失率告警。兜底：默认值填充→降级少特征模型→预计算+缓存关键特征。长期：Feature Store SLA 治理。',
    '特征漂移监控': 'PSI>0.2 明显漂移触发告警和重训练。分桶按天对比均值/分位数/空值率。区分协变量漂移（输入分布变）和概念漂移（P(Y|X) 变，需重新标注）。',
    '模型公平性': '按受保护维度（性别/地域）分组统计 TPR/FPR 差异。治理：重采样平衡、公平性正则、后处理组间阈值调整。持续监控组间指标，设公平性告警。',
    'RAG 召回评估': '指标：Recall@K、MRR、nDCG@K。构建 query-doc 相关性标注集。召回不足调 chunk size/overlap 和混合检索（向量+BM25）；精度不够加 cross-encoder 重排。',
    'RAG 引用': '输出 [1][2] 映射源文档，后处理验证引用内容与标注文档一致。高风险断言拒绝无引用回答。定期人工抽检引用准确率。',
    'Agent 工具调用': 'ReAct 推理+行动交替。工具描述精确（名称/参数/返回），权限最小化。防注入：用户输入不直接拼入工具参数。评估：任务完成率、调用准确率、平均步数。',
    '提示词注入': '指令隔离（system/user 分隔标记）、输入过滤可疑模式、输出过滤泄露系统信息。高危工具调用需人工确认。监控异常输入模式。',
    '内容安全': '三层：输入检测→模型安全对齐（RLHF）→输出后过滤。高敏感场景人工复核。双指标：误拒率和漏过率。攻防红队持续迭代。',
    '缓存语义': '精确匹配命中率低；语义缓存用 embedding 相似度提升命中但需权限隔离。模型/规则变更时按 scope 失效。监控命中率和用户修正率。',
    '模型路由': '简单任务小模型（快且便宜），复杂任务大模型。级联：小模型置信度低再升大模型。监控各模型调用量、成本、用户满意度。',
    'Embedding 更新': '模型升级后向量空间不兼容，需全量重建索引。过渡：双写双索引蓝绿切换。增量插入后定期 compaction 保索引质量。',
    '模型灰度': '影子模式对比输出→1%-5%-50% 放量。每阶段观察 AUC/转化率/投诉率。统计显著性检验后再扩量。回滚条件明确。',
    '离线在线偏差': '排查：特征穿越、分布差异、选择偏差（IPS 修正）、位置偏差。离线只做参考，最终以线上 A/B 为准。',
    '样本选择偏差': 'IPS 加权修正历史策略偏差。保留随机探索桶采集无偏评估数据。冷启动和长尾效果差是典型表现。',
    '反馈延迟': '延迟反馈模型（DFM）修正短期训练偏差。在线学习实时接收反馈。评估用足够长观察窗口的真实标签。',
    '模型版本回滚': 'MLflow 注册中心锁定模型+特征 schema 版本。回滚一键切流量到上一版本。定期演练旧版本能否正常加载。',
    '模型安全': 'API 限频限精度防反演。训练用 DP-SGD 防成员推断。定期用攻击方法自测。模型卡记录训练数据来源。',
    '在线学习': '小学习率+样本验证防污染。定期与离线全量模型对齐防偏移。异常时快速回滚检查点。',
    '类别不均衡': '评估用 PR-AUC/F1 而非 Accuracy。训练：class_weight、SMOTE 过采样、阈值按成本矩阵调整。监控各类别预测分布漂移。',
    '特征工程': 'EDA 找分布和缺失→构造时序/交叉特征→IV/PSI 筛稳定性→离线验证增益→上线监控空值率和漂移。复杂特征预计算进 Feature Store。',
    '数据切分': '时序/推荐日志按时间切分，同一用户/商户用 GroupKFold 防泄漏。验证调参，测试集只评一次。切分后检查各类别分布一致。补充：时间切分模拟线上分布（最近数据做测试）。检查切分后各类别/各时间段样本量是否足够。避免 test 集被反复调参污染。',
    '交叉验证': 'TimeSeriesSplit 不 shuffle。嵌套 CV 防过拟合验证集。CV 选模型，独立 holdout 或线上 A/B 做最终验证。',
    '搜索相关性': '分层：召回（分词/同义词）→排序（BM25/LTR 特征）→意图识别。nDCG@K 评估，人工标注 bad case 驱动优化。',
    'NLP 分类': 'bad case 驱动补数据。不均衡用 PR 曲线调阈值。长文本用预训练模型（BERT）而非词袋。低置信样本进人工审核。补充：混淆矩阵分析互混类别。数据增强（回译/EDA）缓解样本不足。多标签分类用 sigmoid 而非 softmax。',
    '微调取舍': '有 KB 且需溯源→RAG；有万级标注且 prompt 不够→微调；强合规→规则。微调前必须和 RAG+prompt 基线对比 ROI。补充：LoRA/QLoRA 降低微调成本。微调后评测集必须含 OOD 样本测泛化。模型版本和训练数据版本绑定可追溯。',
    '主动学习': '不确定性采样选最有价值样本标注。冷启动先随机/bootstrap。迭代直到边际收益下降。补充：每轮主动学习后评估模型提升幅度，边际收益 <阈值则停止。标注质量控制（多人标注一致性 ≥0.8）。',
    '超参数调优': 'Optuna 贝叶斯优化控 trial 预算。嵌套 CV 或独立 holdout 防过拟合验证集。记录每次 trial 的数据版本和代码 commit。',
    '过拟合': 'train-val gap 大→正则/早停/增数据。train val 好线上差→分布偏移或特征穿越。最终以线上 A/B 验证。补充：学习曲线判断数据量是否足够。Dropout/weight decay/early stopping 组合使用。交叉验证稳定估计泛化误差。',
    'LLM 评测集': '补充：评测集版本化管理，防训练数据污染。多维度评测：知识/推理/安全/指令遵循。人工评测抽样 ≥5% 校准自动评测偏差。',
    '多模态应用': '补充：模态缺失降级（只有文本时仍能回答）。各模态输入大小限制防 OOM。跨模态对齐耗时监控和超时降级。',
    '模型 SLA': '补充：SLA 违约自动告警和升级。按模型等级差异化 SLA（核心模型更严格）。月度 SLA 报告纳入服务评审。',
    'AI 项目失败复盘': '补充：对比 MVP 假设 vs 实际结果。数据质量审计（标注一致性/覆盖度）。是否优化了错误指标（CTR vs CVR）。'
  },
  'frontend.json': {
    '代码分割': '验证：Webpack Bundle Analyzer 看各 chunk 体积，首屏 JS 目标 <200KB。vendor 分包利用 contenthash 长期缓存。过度分割增加 HTTP 请求数，需平衡 chunk 数量与体积。',
    'React 状态设计': '状态下沉到叶子组件减少重渲染。服务端数据用 React Query/SWR 管理缓存和重新验证。URL 状态（筛选/分页）放 query params 可分享可回退。',
    'Source Map 安全': '生产构建不暴露 sourceMappingURL。Map 上传 Sentry 后从公开目录删除。Nginx location ~ \\.map$ { internal; } 禁止外网访问。',
    '埋点治理': '事件 schema 版本化，新增属性不删旧属性。服务端校验必填字段和枚举值。定期清理无人消费的事件防埋点膨胀。',
    'Monorepo': 'pnpm workspace + Turborepo 构建缓存。changesets 管理版本发布。internal 包用 workspace:* 引用。',
    '前端测试': '单元测纯函数和 Hooks，组件测用户交互（Testing Library），E2E 测主流程（Playwright）。按用户行为写测试不按实现细节。',
    '弱网优化': '超时+指数退避重试（幂等请求）。骨架屏降低感知等待。Service Worker 缓存离线可用。Chrome DevTools Network throttling 模拟验证。',
    'WebSocket': '指数退避重连（1s/2s/4s/8s 上限 30s）。心跳 30s ping/pong 检测断开。消息 ID 补缺失。页面隐藏时降频心跳。降级到 SSE/长轮询。',
    'SSR/SSG': 'SSR 适合动态+SEO（电商详情）；SSG 适合静态内容（博客）；CSR 适合交互密集 SPA（后台）。Next.js ISR 增量静态再生。按路由混合选型。'
  },
  'go.json': {
    'Go 调度器': 'GOMAXPROCS 默认 CPU 核数，可通过 runtime.GOMAXPROCS 调整。sysmon 线程抢占执行超过 10ms 的 G。网络 I/O 通过 netpoller 让出 M，不阻塞线程。调试：GODEBUG=schedtrace=1000 看调度 trace。',
    'goroutine 泄漏': 'pprof http://host/debug/pprof/goroutine?debug=2 看重复栈。压测后 goroutine 数应回落。常见：channel 阻塞、context 未 cancel、ticker 未 Stop。修复加超时和退出信号。',
    'channel 关闭': '关闭后 send panic，recv 得零值 ok=false。fan-in 用 sync.WaitGroup 等所有 sender 结束再 close。sync.Once 保证只关闭一次。',
    'context 传播': '入口 context.WithTimeout 设 deadline，下游第一参数传 ctx。goroutine 里 select ctx.Done() 退出。禁止把 context 存全局变量或结构体长期持有。',
    'defer 成本': 'Go 1.14+ 栈上 defer 开销已很低。高频热点路径可权衡内联 unlock/close。defer 与 return 交互：返回值先计算再执行 defer。',
    '接口与空指针': 'var e *MyError; var err error = e; err != nil 为 true（typed nil）。修复：return nil 而非 typed nil pointer，或返回具体 error 值。',
    'map 并发安全': 'fatal error: concurrent map writes。sync.RWMutex 包一层适合读写分明；sync.Map 适合读多写少且 key 稳定；分片 map 降低锁竞争。',
    '限流背压': 'golang.org/x/time/rate 令牌桶。有界 channel 做背压，满则阻塞或返回 429。监控拒绝率和队列深度，防重试风暴。'
  },
  'java.json': {
    'JVM 内存模型': '排查：jmap -heap 看各区域使用；jmap -histo:live 看对象分布；MAT 分析 dump。Metaspace 用 jstat -gcutil 看是否持续增长。DirectMemory 结合 -XX:MaxDirectMemorySize 和 NIO 使用排查。',
    '类加载机制': '打破双亲委派：SPI（ServiceLoader）、OSGi、Tomcat WebAppClassLoader。排查：-verbose:class 看加载顺序；ClassNotFoundException 打印 ClassLoader 链定位冲突。',
    'GC Root': 'MAT Dominator Tree 找占用最大对象，GC Roots 追引用链。常见泄漏：ThreadLocal 未 remove、静态集合、监听器未注销、类加载器泄漏。jmap -dump:live,format=b,file=heap.hprof。',
    '线程池隔离': 'Hystrix/Resilience4j 舱壁隔离。IO 密集和 CPU 密集分池。监控：activeCount、queueSize、拒绝次数。有界队列防 OOM，CallerRunsPolicy 形成反压。',
    'CompletableFuture': '指定业务线程池，避免默认 ForkJoinPool.commonPool()。orTimeout/completeOnTimeout 设超时。exceptionally/handle 记录并降级。allOf 并行聚合。',
    'Spring 事务': '失效：自调用绕过代理、异常被 catch、非 public 方法、非 RuntimeException 不回滚。排查：@Transactional 是否生效（代理类）、同一 Connection。',
    'Bean 生命周期': '循环依赖：三级缓存解决 setter 注入；构造器注入循环直接失败。AOP 代理在 initializeBean 阶段创建。BeanCurrentlyInCreationException 查循环栈。',
    'JVM 调优': '先 GC 日志看 Full GC 频率，再 jstack 看锁竞争，最后查下游 RT。G1 调 -XX:MaxGCPauseMillis；ZGC 适合低延迟。async-profiler 定位 CPU 热点。'
  },
  'python.json': {
    'GIL 机制': 'GIL 同一时刻只有一个线程执行 Python 字节码。CPU 密集用 multiprocessing 或 C 扩展；I/O 密集用 asyncio/threading。PyPy 也有 GIL。验证：cProfile 看 GIL 等待时间。',
    'FastAPI 性能': '异步路由 async def + await，避免在 async 中阻塞调用。连接池配置（SQLAlchemy pool_size/max_overflow）。uvicorn workers 数 = 2*CPU+1。慢接口用 background tasks。',
    '装饰器': '@wraps(func) 保留元信息。带参数装饰器三层嵌套。类装饰器实现 __call__。常见：@cache、@retry、@login_required。',
    '序列化性能': 'JSON：orjson/ujson 比标准库快。Protobuf/MessagePack 二进制更小。大对象用 pickle 注意安全风险。基准：timeit 对比序列化耗时。',
    '包依赖治理': 'pip-tools/poetry lock 锁定版本。pip-audit 扫描 CVE。私有 index 审核同步。最小化依赖，定期清理未使用包。',
    '缓存设计': 'Cache Aside：读 miss 回源写缓存，写 DB 后删缓存。TTL 兜底。热点 key 永不过期+异步刷新。Redis 集群注意 hash tag。'
  }
};

function mergeExpansion(reference, expansion) {
  const base = String(reference || '').trim();
  const extra = String(expansion || '').trim();
  if (!extra) return base;
  const sig = extra.slice(0, 24);
  if (base.includes(sig)) return base;
  const sep = /[。！？]$/.test(base) ? '' : '。';
  return `${base}${sep}${extra}`;
}

function enrichFile(fileName) {
  const filePath = path.join(catalogDir, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const expansions = EXPANSIONS[fileName] || {};
  let changed = 0;

  for (const [skill, entry] of Object.entries(data)) {
    const before = entry.referenceAnswer || '';
    let referenceAnswer = before;

    if (referenceAnswer.length < MIN_LEN && expansions[skill]) {
      referenceAnswer = mergeExpansion(referenceAnswer, expansions[skill]);
    }

    if (referenceAnswer !== before) {
      entry.referenceAnswer = referenceAnswer;
      changed += 1;
    }

    const exc = String(entry.excellentAnswer || '').trim();
    if (exc.length < 40 && referenceAnswer.length > 80) {
      const firstSentence = referenceAnswer.split(/[。！？]/)[0];
      entry.excellentAnswer = firstSentence.startsWith('我')
        ? firstSentence
        : `我会${firstSentence.replace(/^(实操|落地|方法|流程|参数|指标)[:：]?/, '')}`;
    }
  }

  // 新增目录中尚不存在的技能条目
  for (const [skill, expansion] of Object.entries(expansions)) {
    if (data[skill]) continue;
    const referenceAnswer = String(expansion).trim();
    if (!referenceAnswer) continue;
    data[skill] = {
      referenceAnswer,
      excellentAnswer: `我会${referenceAnswer.split(/[。！？]/)[0].replace(/^（示例）/, '')}`
    };
    changed += 1;
  }

  if (changed > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }
  return { file: fileName, changed, total: Object.keys(data).length };
}

const files = ['security.json', 'qa.json', 'ops.json', 'ai.json', 'frontend.json', 'go.json', 'java.json', 'python.json', 'architect.json', 'network.json', 'data.json', 'mysql.json'];
const results = files.map(enrichFile);
console.log(JSON.stringify(results, null, 2));

// 统计剩余偏短条目
for (const fileName of files) {
  const data = JSON.parse(fs.readFileSync(path.join(catalogDir, fileName), 'utf8'));
  const stillShort = Object.entries(data).filter(([, v]) => (v.referenceAnswer || '').length < MIN_LEN);
  console.log(`${fileName}: still under ${MIN_LEN}: ${stillShort.length}`);
}
