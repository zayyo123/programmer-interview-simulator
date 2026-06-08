# ????????

?????2026-06-06T09:17:45.295Z

????????????????????????????????????????????????

## 后端开发?backend?- 188 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?Redis / knowledge / ?? 2?Redis 为什么快？
3. ?MySQL / knowledge / ?? 2?MySQL 索引为什么能提升查询速度？
4. ?MySQL / knowledge / ?? 3?请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？
5. ?MySQL / knowledge / ?? 3?线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。
6. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
7. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
8. ?网络 / knowledge / ?? 3?请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？
9. ?操作系统 / knowledge / ?? 2?请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？
10. ?操作系统 / knowledge / ?? 3?请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？
11. ?操作系统 / knowledge / ?? 3?请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。
12. ?Java / knowledge / ?? 2?HashMap 的底层原理是什么？
13. ?Java / knowledge / ?? 3?请说明 Java 线程池的核心参数、任务提交流程和拒绝策略。线上线程池打满、队列堆积时，你会怎么排查和治理？
14. ?Java / knowledge / ?? 3?请说明 synchronized、ReentrantLock、volatile 和 ConcurrentHashMap 分别解决什么并发问题。线上出现锁竞争或并发安全问题时，你会怎么定位？
15. ?系统设计 / system-design / ?? 3?如果让你设计一个短链接系统，你会怎么设计？
16. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
17. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
18. ?Redis / knowledge / ?? 3?如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？
19. ?Redis / knowledge / ?? 3?数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。
20. ?系统设计 / system-design / ?? 3?设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？
21. ?Python / knowledge / ?? 2?Python 里生成器和普通列表相比，适合用在什么场景？你会怎么解释它的价值？
22. ?Python / knowledge / ?? 3?如果一个 Python 服务 CPU 打满、吞吐上不去，你会怎么判断是 GIL、代码热点还是架构问题？
23. ?Go / knowledge / ?? 2?Go 的 goroutine 为什么适合做高并发服务？它和线程相比关键差别是什么？
24. ?Go / knowledge / ?? 3?如果一个 Go 服务出现 goroutine 数量持续上涨、延迟抖动，你会怎么排查？
25. ?Go / knowledge / ?? 3?请说明 Go 里 channel、context 和 mutex 的典型使用场景。线上出现 goroutine 泄漏、channel 阻塞或锁竞争时，你会怎么定位和治理？
26. ?系统设计 / system-design / ?? 3?如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？
27. ?Java / knowledge / ?? 3?如果一个 Java 服务频繁出现 Full GC 和请求抖动，你会怎么判断是内存分配、对象滞留还是 JVM 参数配置问题？
28. ?Java / project / ?? 3?讲一个你用 Java 做过的核心业务链路治理项目。重点讲清线程池或异步编排、事务边界、失败补偿，以及你为什么这样拆。
29. ?项目经历 / project / ?? 3?说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。
30. ?Python / project / ?? 3?说一个你用 Python 做过的任务调度、异步处理或数据流水线项目。重点讲讲任务拆分、失败重试、可观测性和资源隔离。
31. ?Python / knowledge / ?? 3?如果一个 Python 服务同时有接口请求慢、worker 积压和 CPU 飙高，你会怎么判断是 GIL、I/O 阻塞、序列化开销还是任务模型设计问题？
32. ?Go / project / ?? 3?讲一个你用 Go 做过的高并发服务或任务系统。重点讲清 goroutine 协作、限流背压、超时取消和故障止血是怎么设计的。
33. ?MySQL / algorithm / ?? 2?有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。
34. ?MySQL / algorithm / ?? 3?有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。
35. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
36. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
37. ?系统设计 / algorithm / ?? 3?请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。
38. ?Redis / algorithm / ?? 3?如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。
39. ?系统设计 / algorithm / ?? 3?请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。
40. ?MySQL / knowledge / ?? 2?MySQL 整数类型的 UNSIGNED 属性有什么作用？设计字段时什么时候适合使用，什么时候不建议使用？
41. ?MySQL / knowledge / ?? 2?CHAR 和 VARCHAR 的区别是什么？在用户昵称、手机号、固定编码等字段上你会如何选择？
42. ?MySQL / knowledge / ?? 2?DECIMAL 和 FLOAT/DOUBLE 有什么区别？为什么金额、费率这类字段通常不用浮点数保存？
43. ?MySQL / knowledge / ?? 2?DATETIME 和 TIMESTAMP 有什么区别？如果系统面向多时区用户，创建时间和业务发生时间应该怎么设计？
44. ?MySQL / knowledge / ?? 2?手机号、身份证号、订单号这类“数字字符串”为什么通常不建议用 INT/BIGINT 存？
45. ?MySQL / knowledge / ?? 2?MySQL 支持哪些常见存储引擎？为什么业务系统通常默认选择 InnoDB？
46. ?MySQL / knowledge / ?? 2?MyISAM 和 InnoDB 的核心区别是什么？如果一个老系统还在用 MyISAM，迁移到 InnoDB 要关注哪些风险？
47. ?MySQL / knowledge / ?? 3?MySQL InnoDB 为什么常用 B+Tree 作为索引结构？相比哈希索引和普通 B 树，它适合解决什么问题？
48. ?MySQL / knowledge / ?? 2?什么是覆盖索引？它为什么能减少回表，设计时又有哪些限制？
49. ?MySQL / knowledge / ?? 2?请解释 MySQL 联合索引和最左前缀原则。为什么索引列顺序会影响查询效果？
50. ?MySQL / knowledge / ?? 2?哪些字段适合创建索引？高频查询字段是否都应该建索引？
51. ?MySQL / knowledge / ?? 2?MySQL 中常见的索引失效原因有哪些？线上发现走了全表扫描时你会怎么排查？
52. ?MySQL / knowledge / ?? 2?什么是数据库事务？ACID 四个特性分别解决什么问题？
53. ?MySQL / knowledge / ?? 2?并发事务会带来哪些典型问题？脏读、不可重复读、幻读分别是什么？
54. ?MySQL / knowledge / ?? 3?不可重复读和幻读到底怎么区分？在 InnoDB 可重复读隔离级别下还需要担心幻读吗？
55. ?MySQL / knowledge / ?? 3?MySQL 的隔离级别完全是靠锁实现的吗？请说明 MVCC、快照读和当前读的关系。
56. ?MySQL / knowledge / ?? 2?表级锁和行级锁有什么区别？为什么有时写了行锁语义的 SQL 最后会锁住很多行？
57. ?MySQL / knowledge / ?? 3?当前读和快照读有什么区别？在库存扣减或防重复提交场景下应该用哪类读？
58. ?MySQL / knowledge / ?? 2?常见 SQL 优化手段有哪些？请按“定位问题、改写 SQL、调整索引、验证效果”的顺序回答。
59. ?MySQL / knowledge / ?? 2?如何分析一条 SQL 的性能？Explain 里哪些字段最值得关注？
60. ?MySQL / knowledge / ?? 3?MySQL 深度分页为什么会慢？如果接口需要翻到第 10000 页，你会怎么优化？
61. ?MySQL / knowledge / ?? 2?能不能把图片、文件这类二进制内容直接存到 MySQL？一般业务系统为什么更常把文件放对象存储？
62. ?MySQL / knowledge / ?? 2?MySQL 中如何存储 IP 地址？VARCHAR、整数和 VARBINARY 各有什么取舍？
63. ?Go / knowledge / ?? 2?Go 中指针的作用是什么？什么时候方法接收者应该使用指针接收者？
64. ?Go / knowledge / ?? 2?Go 有异常吗？Go 的 error、panic、recover 分别适合什么场景？
65. ?Go / knowledge / ?? 2?Goroutine 是什么？它和操作系统线程有什么区别，使用时如何避免泄漏？
66. ?Java / knowledge / ?? 3?Java 垃圾回收大致如何工作？线上出现频繁 Full GC 或长暂停时你会如何排查？
67. ?Go / algorithm / ?? 2?请用 Go 说明如何判断单链表是否有环，并分析快慢指针解法的正确性和复杂度。
68. ?Go / knowledge / ?? 2?Go 是面向对象语言吗？请结合 struct、method、interface 和组合说明 Go 的类型设计。
69. ?Python / knowledge / ?? 2?Django QuerySet 里如何表达“不等于”？exclude() 和 ~Q(...) 有什么区别和使用场景？
70. ?Python / knowledge / ?? 3?Python 元类是什么？它和类、对象的关系是什么？真实项目里什么时候才值得使用元类？
71. ?Python / knowledge / ?? 1?Python 中 if __name__ == "__main__" 有什么作用？它和模块导入、脚本执行有什么关系？
72. ?Python / knowledge / ?? 2?Python 里的 yield 有什么作用？请说明生成器、迭代器协议、惰性求值，以及它适合哪些真实场景。
73. ?Python / knowledge / ?? 2?Django model 字段里的 null=True 和 blank=True 有什么区别？为什么字符串字段通常不建议设置 null=True？
74. ?Python / knowledge / ?? 3?Django 中如何组合多个 QuerySet？请比较 filter(Q(...))、union()、链式合并和 Python 层合并的适用场景。
75. ?Python / knowledge / ?? 3?Django 如何回退一次 migration？线上回退数据库迁移时你会关注哪些风险？
76. ?Java / knowledge / ?? 2?为什么说 Java 语言是“编译与解释并存”？请结合字节码、JIT 和跨平台说明。
77. ?Java / knowledge / ?? 2?Java 异常使用有哪些需要注意的地方？请结合业务异常、日志、事务回滚和异常吞掉的风险说明。
78. ?Java / knowledge / ?? 2?Java 字符串拼接什么时候用“+”，什么时候用 StringBuilder？请说明编译器优化、循环拼接和可读性取舍。
79. ?Java / knowledge / ?? 3?JDK 动态代理和 CGLIB 动态代理有什么区别？Spring AOP 在实际项目中如何选择？
80. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
81. ?网络 / knowledge / ?? 3?有了 HTTP，为什么很多微服务还会使用 RPC？请从协议语义、性能、治理和可观测性角度说明取舍。
82. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
83. ?MySQL / knowledge / ?? 2?SQL 和 NoSQL 数据库有什么区别？在真实项目里你会如何做技术选型？
84. ?MySQL / knowledge / ?? 3?设计一套业务数据库表结构时，你通常会按哪些步骤推进？如何兼顾范式、索引、扩展性和线上演进？
85. ?Java / knowledge / ?? 2?ArrayList 和 LinkedList 有什么区别？请结合底层结构、随机访问、插入删除和真实项目选型说明。
86. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
87. ?网络 / knowledge / ?? 3?TCP TIME_WAIT 为什么存在？TIME_WAIT 过多会不会出问题，线上你会如何判断和治理？
88. ?Java / knowledge / ?? 3?常见序列化协议有哪些？在 RPC、缓存和消息队列场景中你会如何选择 JSON、Protobuf、Avro 或 Java 原生序列化？
89. ?Java / knowledge / ?? 2?Java 反射有什么优缺点？Spring、ORM 或测试框架为什么会大量使用反射？
90. ?Java / knowledge / ?? 2?Java 泛型有什么作用？请说明类型安全、类型擦除、通配符上界和下界的使用场景。
91. ?Java / knowledge / ?? 2?try-with-resources 相比 try-catch-finally 有什么优势？哪些资源适合用它管理？
92. ?Java / knowledge / ?? 3?ClassNotFoundException 和 NoClassDefFoundError 有什么区别？线上启动或运行时报类缺失时你会怎么排查？
93. ?Java / knowledge / ?? 3?ArrayBlockingQueue、LinkedBlockingQueue 和 ConcurrentLinkedQueue 有什么区别？线程池队列选型时你会如何取舍？
94. ?Go / knowledge / ?? 2?Go 里的 zero value 是什么？它对结构体设计、map/slice/channel 使用有什么影响？
95. ?Go / algorithm / ?? 2?请用 Go 思路实现一个栈或队列，并说明 slice 扩容、内存保留和并发安全需要注意什么。
96. ?Go / algorithm / ?? 2?请用 Go 实现或说明如何反转单链表，并分析边界条件、时间复杂度和空间复杂度。
97. ?MySQL / knowledge / ?? 3?索引越多越好吗？请说明索引对查询、写入、存储、锁和执行计划的影响。
98. ?Java / knowledge / ?? 2?为什么说 Java 只有值传递？对象作为参数传入方法后，修改字段和重新赋值有什么区别？
99. ?Java / knowledge / ?? 3?Java 注解是如何被解析和使用的？请结合编译期处理、运行时反射和 Spring 注解说明。
100. ?Redis / knowledge / ?? 3?线上 Redis 出现延迟升高，你如何区分热 key、大 key、慢命令和网络抖动？分别怎么治理？
101. ?Redis / system-design / ?? 3?订单详情接口使用 Redis 缓存时，如何设计数据库与缓存的一致性策略？如果更新后短时间读到旧值，你怎么排查和改进？
102. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
103. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
104. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
105. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
106. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
107. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
108. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
109. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
110. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
111. ?运维 / knowledge / ?? 2?Linux load average 很高时一定是 CPU 不够吗？你会如何定位是 CPU、IO、锁等待还是进程堆积？
112. ?运维 / knowledge / ?? 3?Nginx 网关大量 502/504 时，你会如何区分上游服务异常、连接池耗尽、超时配置和网络问题？
113. ?运维 / knowledge / ?? 3?你会如何设计数据库备份和恢复方案？请说明全量、增量、binlog、恢复演练、RPO/RTO 和权限隔离。
114. ?DevOps / project / ?? 3?请讲一次你参与线上故障处理的经历，重点说明告警发现、影响评估、止血动作、根因定位、复盘和自动化改进。
115. ?DevOps / knowledge / ?? 3?Kubernetes 中如何设计一次安全的应用发布？请说明 readiness、liveness、滚动更新、回滚和灰度验证。
116. ?DevOps / knowledge / ?? 2?配置和密钥应该如何管理？为什么不应该把数据库密码、Token 或私钥直接提交到代码仓库？
117. ?DevOps / system-design / ?? 3?如何为生产发布流水线设计质量门禁？请说明代码检查、测试、制品一致性、安全扫描、审批和紧急发布例外。
118. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
119. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
120. ?安全 / project / ?? 2?如果发现生产 API Key 被提交到了 Git 仓库，你会如何评估影响、止血、轮换和防止再次发生？
121. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
122. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
123. ?运维 / knowledge / ?? 3?线上访问某域名偶发失败或解析到错误地址，你会如何排查 DNS 缓存、权威解析、递归解析、TTL 和客户端配置？
124. ?运维 / knowledge / ?? 2?服务器磁盘告警时，如何区分磁盘空间满、inode 满、日志暴涨和文件已删除但空间未释放？
125. ?运维 / knowledge / ?? 3?MySQL 主从延迟突然升高时，你会如何判断是主库写入过大、从库 SQL 线程慢、网络问题还是大事务导致？
126. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
127. ?安全 / knowledge / ?? 3?OAuth 登录或三方授权中有哪些常见安全风险？你会如何校验 redirect_uri、state、scope 和授权码交换流程？
128. ?安全 / system-design / ?? 3?如果要建设一套安全审计日志体系，你会记录哪些事件，如何保证不可抵赖、可检索、低噪声和隐私合规？
129. ?安全 / knowledge / ?? 3?登录、验证码或短信接口被刷时，你会如何设计反滥用策略，同时避免误伤正常用户？
130. ?Java / knowledge / ?? 3?请说明 JVM 运行时内存区域如何划分，堆、栈、方法区和直接内存在排查 OOM 时分别要看什么？
131. ?Java / knowledge / ?? 2?Java 类加载的双亲委派模型解决什么问题？什么时候会打破双亲委派？
132. ?Java / knowledge / ?? 2?什么对象可以作为 GC Roots？线上内存泄漏时如何用 MAT 或堆 dump 定位引用链？
133. ?Java / knowledge / ?? 3?多个业务共用一个线程池导致互相影响，你会如何设计线程池隔离和监控？
134. ?Java / knowledge / ?? 2?CompletableFuture 适合哪些异步编排场景？使用时如何处理超时、异常和线程池选择？
135. ?Java / knowledge / ?? 2?Spring 声明式事务在哪些场景会失效？自调用、异常类型和传播行为分别有什么风险？
136. ?Java / knowledge / ?? 3?Spring Bean 生命周期里有哪些关键阶段？初始化、代理和循环依赖问题如何排查？
137. ?Java / knowledge / ?? 2?Java 服务 p99 延迟抖动明显时，你会如何从 GC、线程、锁和下游依赖定位？
138. ?Go / knowledge / ?? 3?Go 的 GMP 调度模型如何工作？它为什么能支撑大量 goroutine？
139. ?Go / knowledge / ?? 2?goroutine 泄漏常见原因有哪些？你会如何用 pprof 和日志定位？
140. ?Go / knowledge / ?? 2?Go channel 应该由谁关闭？关闭后读写会发生什么，如何避免 panic？
141. ?Go / knowledge / ?? 3?context 在超时取消和请求链路中如何使用？滥用 context 会带来什么问题？
142. ?Go / knowledge / ?? 2?defer 的执行顺序和适用场景是什么？高频路径中要注意哪些性能和可读性取舍？
143. ?Go / knowledge / ?? 2?Go interface 中 nil 值有哪些坑？为什么一个 nil 指针放进 interface 后不等于 nil？
144. ?Go / knowledge / ?? 3?Go map 为什么不是并发安全的？你会如何选择 mutex、sync.Map 或分片锁？
145. ?Go / knowledge / ?? 2?Go 逃逸分析是什么？什么情况下变量会从栈逃逸到堆，对性能有什么影响？
146. ?Go / knowledge / ?? 2?Go 服务 GC 频繁导致延迟抖动，你会如何从分配率、GOGC 和对象生命周期排查？
147. ?Go / knowledge / ?? 3?Go pprof 能分析哪些问题？CPU、heap、goroutine 和 block profile 分别怎么看？
148. ?Go / knowledge / ?? 2?Go 错误处理如何设计 error wrapping、sentinel error 和业务错误码？
149. ?Go / knowledge / ?? 2?Go 泛型适合解决什么问题？为什么不应该为了抽象而过度使用泛型？
150. ?Go / knowledge / ?? 3?Go HTTP 服务如何实现优雅退出，避免请求中断和资源泄漏？
151. ?Go / knowledge / ?? 2?Go 服务高并发下如何设计限流、队列和背压，避免 goroutine 无限堆积？
152. ?Go / knowledge / ?? 2?Go 并发代码如何测试竞态条件？race detector 能发现什么，不能发现什么？
153. ?Python / knowledge / ?? 3?Python GIL 解决什么问题？为什么 IO 密集和 CPU 密集场景表现不同？
154. ?Python / knowledge / ?? 2?asyncio 适合哪些场景？事件循环、协程和阻塞调用使用不当会有什么问题？
155. ?Python / knowledge / ?? 2?Celery 任务如何设计幂等、重试、超时和死信处理？
156. ?Python / knowledge / ?? 3?Django ORM 中 N+1 查询如何产生？select_related 和 prefetch_related 如何选择？
157. ?Python / knowledge / ?? 2?Django transaction.atomic 使用时要注意哪些事务边界、锁和异常回滚问题？
158. ?Python / knowledge / ?? 2?FastAPI 服务接口慢时，你会如何区分框架开销、阻塞 IO、数据库和序列化问题？
159. ?Python / knowledge / ?? 3?Python 服务内存持续增长时，你会如何用 tracemalloc、objgraph 或 heapy 定位？
160. ?Python / knowledge / ?? 2?Python 装饰器的实现原理是什么？在鉴权、缓存和日志中使用时要注意什么？
161. ?Python / knowledge / ?? 2?with 上下文管理器如何工作？数据库连接、文件和锁为什么适合用它管理？
162. ?Python / knowledge / ?? 3?gunicorn/uwsgi 多进程模型如何影响连接池、内存和任务调度？
163. ?Python / knowledge / ?? 2?Python JSON 序列化成为瓶颈时，你会如何优化和验证？
164. ?Python / knowledge / ?? 2?Python 类型提示和 mypy 能解决什么问题？它们不能保证什么？
165. ?Python / system-design / ?? 3?Python 项目依赖冲突或供应链风险如何治理？
166. ?Python / knowledge / ?? 2?Python Web 服务中如何设计本地缓存和 Redis 缓存，避免穿透和脏数据？
167. ?Python / knowledge / ?? 2?Python 服务如何设计结构化日志、traceId 和异常堆栈，方便线上排查？
168. ?Python / knowledge / ?? 3?pytest fixture 如何组织复杂测试数据和依赖，避免测试互相污染？
169. ?系统设计 / knowledge / ?? 3?分布式锁适合解决什么问题？Redis 锁、数据库锁和 ZooKeeper 锁各有什么边界？
170. ?系统设计 / knowledge / ?? 2?分布式定时任务如何避免重复执行、漏执行和执行节点故障？
171. ?系统设计 / knowledge / ?? 3?如何抽象一套通用接口幂等组件，支持下单、支付回调和 MQ 消费？
172. ?系统设计 / system-design / ?? 3?消息队列如何保证同一业务实体的顺序性？分区、重试和死信会带来什么影响？
173. ?系统设计 / knowledge / ?? 3?高流量接口上线前如何设计缓存预热和失败回退，避免冷启动打爆数据库？
174. ?系统设计 / knowledge / ?? 2?账户或库存热点更新导致锁竞争时，你会如何拆分、排队或异步化？
175. ?系统设计 / system-design / ?? 3?读写分离场景下主从延迟会带来什么问题，业务如何兜底？
176. ?系统设计 / knowledge / ?? 2?业务配置如何支持灰度、生效范围、审计和快速回滚？
177. ?系统设计 / knowledge / ?? 3?后端接口如何设计兼容演进，避免客户端或调用方升级时大面积失败？
178. ?系统设计 / system-design / ?? 3?核心链路压测如何处理测试流量标记、数据隔离和下游保护？
179. ?系统设计 / knowledge / ?? 3?下游依赖故障时，如何设计缓存兜底、默认值、限流和用户提示？
180. ?系统设计 / knowledge / ?? 2?后端慢请求治理如何从网关、应用、数据库、缓存和下游依赖分层推进？
181. ?系统设计 / system-design / ?? 3?本地缓存、分布式缓存和 CDN 如何组合，如何处理一致性和失效？
182. ?系统设计 / knowledge / ?? 2?核心写操作如何设计审计日志，满足追踪、合规和问题定位？
183. ?系统设计 / knowledge / ?? 3?后端服务灰度发布如何处理流量染色、数据兼容和回滚？
184. ?系统设计 / system-design / ?? 3?批处理任务如何限速和分片，避免影响在线业务？
185. ?系统设计 / knowledge / ?? 3?高价值接口如何设计限流、防刷、验证码和风控联动？
186. ?系统设计 / knowledge / ?? 2?后端异常如何区分业务异常、系统异常、依赖异常和可重试异常？
187. ?系统设计 / system-design / ?? 3?统一错误码体系如何设计，既方便前端展示又方便服务端排障？
188. ?系统设计 / knowledge / ?? 2?生产数据订正如何设计审批、脚本、备份、验证和审计？

## 前端开发?frontend?- 100 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
3. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
4. ?前端 / knowledge / ?? 2?如果一个页面首屏加载很慢，你会怎么定位和优化？
5. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
6. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
7. ?前端 / knowledge / ?? 3?线上前端页面偶发白屏，你会怎么做故障定位、止血和后续治理？
8. ?前端 / project / ?? 3?说说你做过的一个前端中后台或复杂业务后台，你是怎么处理状态管理、权限、组件复用和可维护性的？
9. ?前端 / project / ?? 3?讲一个你做过的复杂前端页面或中后台模块。重点说清楚你是怎么处理大列表性能、交互一致性和多人协作可维护性的。
10. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
11. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
12. ?前端 / algorithm / ?? 2?请说明如何实现一个 debounce 防抖函数。可以写 JS 代码、伪代码，或说明核心流程和边界处理。
13. ?前端 / algorithm / ?? 2?请说明如何实现一个 throttle 节流函数。可以写 JS 代码、伪代码，或说明时间戳版、定时器版以及 leading/trailing 边界怎么处理。
14. ?前端 / algorithm / ?? 2?请说明如何实现数组扁平化 flatten。可以写 JS 代码、伪代码，或说明递归/迭代思路和复杂度。
15. ?前端 / algorithm / ?? 3?请分析下面这类 Promise 和事件循环代码的输出顺序，并说明同步代码、微任务、宏任务分别如何调度。可以写出判断步骤或伪代码：console.log("A"); setTimeout(() => console.log("B")); Promise.resolve().then(() => console.log("C")).then(() => console.log("D")); console.log("E");
16. ?前端 / algorithm / ?? 3?请实现一个简版 Promise.all。可以写 JS 代码、伪代码，或说明核心流程：如何保持结果顺序、处理非 Promise 值、空数组，以及任意一个任务失败时立即 reject。
17. ?前端 / algorithm / ?? 3?请实现一个并发限制器：给定一组返回 Promise 的任务函数和最大并发数 limit，要求同一时间最多执行 limit 个任务，并在全部完成后按输入顺序返回结果。可以写 JS 代码、伪代码，或说明调度流程。
18. ?前端 / knowledge / ?? 3?从在浏览器地址栏输入 URL 到页面展示，中间发生了哪些关键步骤？请按网络、浏览器渲染和前端资源加载说明。
19. ?前端 / knowledge / ?? 2?什么是事件委托？它适合解决什么问题，在复杂组件里使用时要注意哪些边界？
20. ?前端 / knowledge / ?? 3?一个大型前端页面首屏慢、交互卡顿，你会如何系统优化？请区分加载性能、渲染性能和运行时性能。
21. ?前端 / knowledge / ?? 1?React 的核心特性有哪些？为什么它适合构建复杂交互界面？
22. ?前端 / knowledge / ?? 1?JSX 是什么？它和模板语法、React.createElement 之间是什么关系？
23. ?前端 / knowledge / ?? 2?React Element 和 Component 有什么区别？为什么说 Element 是不可变的 UI 描述？
24. ?前端 / knowledge / ?? 1?React 中 state 的作用是什么？为什么更新 state 时要避免直接修改原对象？
25. ?前端 / knowledge / ?? 2?React 中 state 和 props 有什么区别？什么时候应该把状态提升到父组件？
26. ?前端 / knowledge / ?? 2?React 事件处理和原生 HTML/DOM 事件处理有什么区别？
27. ?前端 / knowledge / ?? 2?什么是 Virtual DOM？它解决了什么问题，为什么不能简单说 Virtual DOM 一定比手写 DOM 快？
28. ?前端 / knowledge / ?? 3?React Fiber 的主要目标是什么？它和可中断渲染、优先级调度有什么关系？
29. ?前端 / knowledge / ?? 2?React 受控组件是什么？它适合哪些表单场景，又会带来什么性能和复杂度问题？
30. ?前端 / knowledge / ?? 2?React 非受控组件是什么？什么时候使用 ref 读取表单值比完全受控更合适？
31. ?前端 / knowledge / ?? 2?什么是 Lifting State Up？如何判断一个状态应该放在子组件、父组件、URL 还是全局状态里？
32. ?前端 / knowledge / ?? 2?React 高阶组件（HOC）是什么？它和 Hooks、render props 相比适合解决什么问题？
33. ?前端 / knowledge / ?? 3?React reconciliation 是什么？key 在列表 diff 中为什么重要？
34. ?前端 / knowledge / ?? 2?React Portals 是什么？为什么弹窗、Tooltip、下拉菜单常用 Portal 实现？
35. ?前端 / knowledge / ?? 2?ReactDOMServer 的作用是什么？SSR 能解决哪些问题，又会带来哪些工程复杂度？
36. ?前端 / knowledge / ?? 2?React 中如何使用 innerHTML？为什么 dangerouslySetInnerHTML 名字里带 dangerously，如何避免 XSS？
37. ?前端 / knowledge / ?? 2?React 中如何 memoize 一个组件？React.memo、useMemo、useCallback 分别解决什么问题？
38. ?前端 / knowledge / ?? 3?如果让你实现一个 React SSR 页面，你会如何组织路由、数据预取、HTML 注水和客户端 hydration？
39. ?前端 / knowledge / ?? 2?Hooks 出现后是否完全替代 render props 和 HOC？在项目里如何选择逻辑复用方式？
40. ?前端 / knowledge / ?? 2?React 和 ReactDOM 有什么区别？为什么 ReactDOM 被拆成独立包？
41. ?前端 / knowledge / ?? 2?为什么 React 子组件不能直接修改 props？如果子组件需要改变父组件数据，应该怎么设计？
42. ?前端 / knowledge / ?? 2?React 项目常见目录结构如何设计？按技术类型分层和按业务模块分层各有什么取舍？
43. ?前端 / knowledge / ?? 2?JavaScript 中 var、let、const 有什么区别？请结合作用域、提升、暂时性死区和可变性说明。
44. ?前端 / knowledge / ?? 3?JavaScript 事件循环如何工作？宏任务、微任务、渲染时机和 async/await 之间有什么关系？
45. ?前端 / knowledge / ?? 2?什么是 JavaScript 闭包？它常用于哪些场景，又可能带来哪些内存或状态问题？
46. ?前端 / knowledge / ?? 3?TypeScript 泛型解决什么问题？在封装 API 请求、组件 props 或工具函数时如何避免泛型滥用？
47. ?前端 / knowledge / ?? 2?TypeScript interface 的作用是什么？它适合描述哪些契约，和类实现有什么关系？
48. ?前端 / knowledge / ?? 2?TypeScript 中什么时候用 interface，什么时候用 class？为什么不能把类型建模都写成 class？
49. ?前端 / knowledge / ?? 3?TypeScript Decorator 是什么？它适合哪些框架场景，使用时有哪些稳定性和可维护性风险？
50. ?前端 / knowledge / ?? 3?TypeScript 中 interface 和 type 有什么区别？项目里如何制定使用约定？
51. ?前端 / knowledge / ?? 2?TypeScript 中 declare 关键字什么时候使用？它和真实运行时代码有什么区别？
52. ?前端 / knowledge / ?? 2?能否从 JavaScript 库生成 TypeScript 声明文件？生成的 .d.ts 为什么仍然需要人工审核？
53. ?前端 / knowledge / ?? 2?TypeScript 能不能用于后端？在 Node.js 后端项目里使用 TypeScript 的收益和代价是什么？
54. ?前端 / knowledge / ?? 2?TypeScript 为什么需要编译？编译阶段会做什么，运行时还会保留类型信息吗？
55. ?前端 / knowledge / ?? 3?TypeScript 支持函数重载吗？它和联合类型、泛型相比适合解决什么问题？
56. ?前端 / knowledge / ?? 2?TypeScript 中如何处理 null 和 undefined？strictNullChecks 开启后，类型收窄和可选链有什么作用？
57. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
58. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
59. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
60. ?前端 / knowledge / ?? 2?React 列表渲染里的 key 有什么作用？为什么不推荐在可变列表中直接使用数组下标作为 key？
61. ?前端 / knowledge / ?? 3?浏览器从 HTML 到页面渲染的关键流程是什么？哪些操作会触发重排和重绘？
62. ?前端 / knowledge / ?? 2?首屏加载慢时，你会如何从资源体积、网络、渲染和接口请求定位？
63. ?前端 / knowledge / ?? 2?LCP、FID/INP、CLS 分别衡量什么？如何针对性优化？
64. ?前端 / knowledge / ?? 3?前端项目如何做代码分割和懒加载，避免首屏 bundle 过大？
65. ?前端 / knowledge / ?? 2?Tree Shaking 生效需要哪些条件？为什么有些依赖无法被摇掉？
66. ?前端 / knowledge / ?? 2?前端静态资源如何设计强缓存、协商缓存、hash 和 CDN 刷新策略？
67. ?前端 / knowledge / ?? 3?Service Worker 能解决哪些缓存和离线问题？使用不当有什么风险？
68. ?前端 / knowledge / ?? 2?CORS 的预检请求、凭证和安全边界是什么？如何排查跨域失败？
69. ?前端 / knowledge / ?? 2?前端如何防护 XSS？富文本、innerHTML 和第三方脚本分别要注意什么？
70. ?前端 / knowledge / ?? 3?前端使用 Cookie 鉴权时，SameSite、httpOnly 和 CSRF Token 分别解决什么？
71. ?前端 / knowledge / ?? 2?复杂页面中状态应该放组件、URL、全局 store 还是服务端缓存？如何判断？
72. ?前端 / knowledge / ?? 2?React 页面卡顿时，你会如何定位不必要渲染、长任务和大列表问题？
73. ?前端 / knowledge / ?? 3?Hooks 中闭包和依赖数组常见坑有哪些？如何避免状态过期？
74. ?前端 / knowledge / ?? 2?React Error Boundary 能捕获什么，不能捕获什么？线上白屏如何治理？
75. ?前端 / knowledge / ?? 2?Vue 响应式系统如何追踪依赖？数组、对象和异步更新有哪些注意点？
76. ?前端 / knowledge / ?? 3?如何设计一个可复用表格或表单组件，同时避免过度抽象？
77. ?前端 / system-design / ?? 3?中后台系统如何设计菜单权限、按钮权限、路由守卫和接口权限校验？
78. ?前端 / knowledge / ?? 2?复杂表单如何处理联动校验、异步校验、草稿保存和错误提示？
79. ?前端 / knowledge / ?? 3?虚拟滚动如何实现？动态高度、滚动定位和可访问性有哪些难点？
80. ?前端 / knowledge / ?? 2?前端监控如何采集 JS 错误、白屏、性能、接口异常和用户行为？
81. ?前端 / knowledge / ?? 2?线上 Source Map 如何用于定位问题，同时避免源码泄露？
82. ?前端 / knowledge / ?? 3?前端埋点如何设计事件模型、去重、版本和数据质量校验？
83. ?前端 / knowledge / ?? 2?微前端适合什么场景？沙箱、样式隔离、通信和部署会带来哪些问题？
84. ?前端 / knowledge / ?? 2?前端 Monorepo 如何管理包、依赖、构建缓存和版本发布？
85. ?前端 / system-design / ?? 3?如何设计前端 ESLint、Prettier、TypeScript、测试和构建门禁？
86. ?前端 / knowledge / ?? 2?TypeScript 如何为接口数据、组件 props 和业务状态建模？过度类型化有什么问题？
87. ?前端 / knowledge / ?? 2?单元测试、组件测试、E2E 测试在前端分别适合覆盖什么？
88. ?前端 / knowledge / ?? 3?前端可访问性应该关注哪些语义、键盘操作、焦点管理和颜色对比？
89. ?前端 / system-design / ?? 3?多语言项目如何设计文案、日期货币、复数规则和异步加载？
90. ?前端 / knowledge / ?? 2?移动端 H5 如何处理视口、刘海屏、1px、软键盘和安全区？
91. ?前端 / knowledge / ?? 3?弱网环境下前端如何做请求超时、重试、骨架屏和离线提示？
92. ?前端 / knowledge / ?? 2?大文件上传如何做分片、断点续传、秒传和失败重试？
93. ?前端 / knowledge / ?? 2?前端 WebSocket 如何处理重连、心跳、消息乱序和页面生命周期？
94. ?前端 / knowledge / ?? 3?前端第三方依赖如何做漏洞治理、锁版本和供应链风险控制？
95. ?前端 / knowledge / ?? 2?如何建设前端设计系统，保证组件一致性和团队协作效率？
96. ?前端 / knowledge / ?? 2?SSR、SSG 和 CSR 分别适合什么场景？它们对性能和部署有什么影响？
97. ?前端 / knowledge / ?? 3?SSR Hydration 不一致会出现什么问题？如何定位和避免？
98. ?前端 / knowledge / ?? 2?前端页面内存持续上涨时，你会如何定位事件监听、定时器和闭包引用？
99. ?前端 / knowledge / ?? 2?宏任务、微任务和渲染时机如何影响 Promise、setTimeout 和 UI 更新？
100. ?前端 / project / ?? 3?请讲一次你治理前端性能、稳定性或工程化问题的项目经历。

## 全栈开发?fullstack?- 261 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?Redis / knowledge / ?? 2?Redis 为什么快？
3. ?MySQL / knowledge / ?? 2?MySQL 索引为什么能提升查询速度？
4. ?MySQL / knowledge / ?? 3?请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？
5. ?MySQL / knowledge / ?? 3?线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。
6. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
7. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
8. ?网络 / knowledge / ?? 3?请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？
9. ?操作系统 / knowledge / ?? 2?请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？
10. ?操作系统 / knowledge / ?? 3?请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？
11. ?操作系统 / knowledge / ?? 3?请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。
12. ?前端 / knowledge / ?? 2?如果一个页面首屏加载很慢，你会怎么定位和优化？
13. ?系统设计 / system-design / ?? 3?如果让你设计一个短链接系统，你会怎么设计？
14. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
15. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
16. ?Redis / knowledge / ?? 3?如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？
17. ?Redis / knowledge / ?? 3?数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。
18. ?前端 / knowledge / ?? 3?线上前端页面偶发白屏，你会怎么做故障定位、止血和后续治理？
19. ?系统设计 / system-design / ?? 3?设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？
20. ?Python / knowledge / ?? 2?Python 里生成器和普通列表相比，适合用在什么场景？你会怎么解释它的价值？
21. ?Python / knowledge / ?? 3?如果一个 Python 服务 CPU 打满、吞吐上不去，你会怎么判断是 GIL、代码热点还是架构问题？
22. ?Go / knowledge / ?? 2?Go 的 goroutine 为什么适合做高并发服务？它和线程相比关键差别是什么？
23. ?Go / knowledge / ?? 3?如果一个 Go 服务出现 goroutine 数量持续上涨、延迟抖动，你会怎么排查？
24. ?Go / knowledge / ?? 3?请说明 Go 里 channel、context 和 mutex 的典型使用场景。线上出现 goroutine 泄漏、channel 阻塞或锁竞争时，你会怎么定位和治理？
25. ?系统设计 / system-design / ?? 3?如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？
26. ?前端 / project / ?? 3?说说你做过的一个前端中后台或复杂业务后台，你是怎么处理状态管理、权限、组件复用和可维护性的？
27. ?项目经历 / project / ?? 3?你做过的全栈项目里，有没有一次是你需要同时协调前端交互、后端接口和数据一致性的？说说你的判断和取舍。
28. ?项目经历 / project / ?? 3?说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。
29. ?前端 / project / ?? 3?讲一个你做过的复杂前端页面或中后台模块。重点说清楚你是怎么处理大列表性能、交互一致性和多人协作可维护性的。
30. ?Python / project / ?? 3?说一个你用 Python 做过的任务调度、异步处理或数据流水线项目。重点讲讲任务拆分、失败重试、可观测性和资源隔离。
31. ?Python / knowledge / ?? 3?如果一个 Python 服务同时有接口请求慢、worker 积压和 CPU 飙高，你会怎么判断是 GIL、I/O 阻塞、序列化开销还是任务模型设计问题？
32. ?Go / project / ?? 3?讲一个你用 Go 做过的高并发服务或任务系统。重点讲清 goroutine 协作、限流背压、超时取消和故障止血是怎么设计的。
33. ?MySQL / algorithm / ?? 2?有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。
34. ?MySQL / algorithm / ?? 3?有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。
35. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
36. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
37. ?前端 / algorithm / ?? 2?请说明如何实现一个 debounce 防抖函数。可以写 JS 代码、伪代码，或说明核心流程和边界处理。
38. ?前端 / algorithm / ?? 2?请说明如何实现一个 throttle 节流函数。可以写 JS 代码、伪代码，或说明时间戳版、定时器版以及 leading/trailing 边界怎么处理。
39. ?前端 / algorithm / ?? 2?请说明如何实现数组扁平化 flatten。可以写 JS 代码、伪代码，或说明递归/迭代思路和复杂度。
40. ?前端 / algorithm / ?? 3?请分析下面这类 Promise 和事件循环代码的输出顺序，并说明同步代码、微任务、宏任务分别如何调度。可以写出判断步骤或伪代码：console.log("A"); setTimeout(() => console.log("B")); Promise.resolve().then(() => console.log("C")).then(() => console.log("D")); console.log("E");
41. ?前端 / algorithm / ?? 3?请实现一个简版 Promise.all。可以写 JS 代码、伪代码，或说明核心流程：如何保持结果顺序、处理非 Promise 值、空数组，以及任意一个任务失败时立即 reject。
42. ?前端 / algorithm / ?? 3?请实现一个并发限制器：给定一组返回 Promise 的任务函数和最大并发数 limit，要求同一时间最多执行 limit 个任务，并在全部完成后按输入顺序返回结果。可以写 JS 代码、伪代码，或说明调度流程。
43. ?系统设计 / algorithm / ?? 3?请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。
44. ?Redis / algorithm / ?? 3?如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。
45. ?系统设计 / algorithm / ?? 3?请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。
46. ?MySQL / knowledge / ?? 2?MySQL 整数类型的 UNSIGNED 属性有什么作用？设计字段时什么时候适合使用，什么时候不建议使用？
47. ?MySQL / knowledge / ?? 2?CHAR 和 VARCHAR 的区别是什么？在用户昵称、手机号、固定编码等字段上你会如何选择？
48. ?MySQL / knowledge / ?? 2?DECIMAL 和 FLOAT/DOUBLE 有什么区别？为什么金额、费率这类字段通常不用浮点数保存？
49. ?MySQL / knowledge / ?? 2?DATETIME 和 TIMESTAMP 有什么区别？如果系统面向多时区用户，创建时间和业务发生时间应该怎么设计？
50. ?MySQL / knowledge / ?? 2?手机号、身份证号、订单号这类“数字字符串”为什么通常不建议用 INT/BIGINT 存？
51. ?MySQL / knowledge / ?? 2?MySQL 支持哪些常见存储引擎？为什么业务系统通常默认选择 InnoDB？
52. ?MySQL / knowledge / ?? 2?MyISAM 和 InnoDB 的核心区别是什么？如果一个老系统还在用 MyISAM，迁移到 InnoDB 要关注哪些风险？
53. ?MySQL / knowledge / ?? 3?MySQL InnoDB 为什么常用 B+Tree 作为索引结构？相比哈希索引和普通 B 树，它适合解决什么问题？
54. ?MySQL / knowledge / ?? 2?什么是覆盖索引？它为什么能减少回表，设计时又有哪些限制？
55. ?MySQL / knowledge / ?? 2?请解释 MySQL 联合索引和最左前缀原则。为什么索引列顺序会影响查询效果？
56. ?MySQL / knowledge / ?? 2?哪些字段适合创建索引？高频查询字段是否都应该建索引？
57. ?MySQL / knowledge / ?? 2?MySQL 中常见的索引失效原因有哪些？线上发现走了全表扫描时你会怎么排查？
58. ?MySQL / knowledge / ?? 2?什么是数据库事务？ACID 四个特性分别解决什么问题？
59. ?MySQL / knowledge / ?? 2?并发事务会带来哪些典型问题？脏读、不可重复读、幻读分别是什么？
60. ?MySQL / knowledge / ?? 3?不可重复读和幻读到底怎么区分？在 InnoDB 可重复读隔离级别下还需要担心幻读吗？
61. ?MySQL / knowledge / ?? 3?MySQL 的隔离级别完全是靠锁实现的吗？请说明 MVCC、快照读和当前读的关系。
62. ?MySQL / knowledge / ?? 2?表级锁和行级锁有什么区别？为什么有时写了行锁语义的 SQL 最后会锁住很多行？
63. ?MySQL / knowledge / ?? 3?当前读和快照读有什么区别？在库存扣减或防重复提交场景下应该用哪类读？
64. ?MySQL / knowledge / ?? 2?常见 SQL 优化手段有哪些？请按“定位问题、改写 SQL、调整索引、验证效果”的顺序回答。
65. ?MySQL / knowledge / ?? 2?如何分析一条 SQL 的性能？Explain 里哪些字段最值得关注？
66. ?MySQL / knowledge / ?? 3?MySQL 深度分页为什么会慢？如果接口需要翻到第 10000 页，你会怎么优化？
67. ?MySQL / knowledge / ?? 2?能不能把图片、文件这类二进制内容直接存到 MySQL？一般业务系统为什么更常把文件放对象存储？
68. ?MySQL / knowledge / ?? 2?MySQL 中如何存储 IP 地址？VARCHAR、整数和 VARBINARY 各有什么取舍？
69. ?前端 / knowledge / ?? 3?从在浏览器地址栏输入 URL 到页面展示，中间发生了哪些关键步骤？请按网络、浏览器渲染和前端资源加载说明。
70. ?前端 / knowledge / ?? 2?什么是事件委托？它适合解决什么问题，在复杂组件里使用时要注意哪些边界？
71. ?前端 / knowledge / ?? 3?一个大型前端页面首屏慢、交互卡顿，你会如何系统优化？请区分加载性能、渲染性能和运行时性能。
72. ?前端 / knowledge / ?? 1?React 的核心特性有哪些？为什么它适合构建复杂交互界面？
73. ?前端 / knowledge / ?? 1?JSX 是什么？它和模板语法、React.createElement 之间是什么关系？
74. ?前端 / knowledge / ?? 2?React Element 和 Component 有什么区别？为什么说 Element 是不可变的 UI 描述？
75. ?前端 / knowledge / ?? 1?React 中 state 的作用是什么？为什么更新 state 时要避免直接修改原对象？
76. ?前端 / knowledge / ?? 2?React 中 state 和 props 有什么区别？什么时候应该把状态提升到父组件？
77. ?前端 / knowledge / ?? 2?React 事件处理和原生 HTML/DOM 事件处理有什么区别？
78. ?前端 / knowledge / ?? 2?什么是 Virtual DOM？它解决了什么问题，为什么不能简单说 Virtual DOM 一定比手写 DOM 快？
79. ?前端 / knowledge / ?? 3?React Fiber 的主要目标是什么？它和可中断渲染、优先级调度有什么关系？
80. ?前端 / knowledge / ?? 2?React 受控组件是什么？它适合哪些表单场景，又会带来什么性能和复杂度问题？
81. ?前端 / knowledge / ?? 2?React 非受控组件是什么？什么时候使用 ref 读取表单值比完全受控更合适？
82. ?前端 / knowledge / ?? 2?什么是 Lifting State Up？如何判断一个状态应该放在子组件、父组件、URL 还是全局状态里？
83. ?前端 / knowledge / ?? 2?React 高阶组件（HOC）是什么？它和 Hooks、render props 相比适合解决什么问题？
84. ?前端 / knowledge / ?? 3?React reconciliation 是什么？key 在列表 diff 中为什么重要？
85. ?前端 / knowledge / ?? 2?React Portals 是什么？为什么弹窗、Tooltip、下拉菜单常用 Portal 实现？
86. ?前端 / knowledge / ?? 2?ReactDOMServer 的作用是什么？SSR 能解决哪些问题，又会带来哪些工程复杂度？
87. ?前端 / knowledge / ?? 2?React 中如何使用 innerHTML？为什么 dangerouslySetInnerHTML 名字里带 dangerously，如何避免 XSS？
88. ?前端 / knowledge / ?? 2?React 中如何 memoize 一个组件？React.memo、useMemo、useCallback 分别解决什么问题？
89. ?前端 / knowledge / ?? 3?如果让你实现一个 React SSR 页面，你会如何组织路由、数据预取、HTML 注水和客户端 hydration？
90. ?前端 / knowledge / ?? 2?Hooks 出现后是否完全替代 render props 和 HOC？在项目里如何选择逻辑复用方式？
91. ?前端 / knowledge / ?? 2?React 和 ReactDOM 有什么区别？为什么 ReactDOM 被拆成独立包？
92. ?前端 / knowledge / ?? 2?为什么 React 子组件不能直接修改 props？如果子组件需要改变父组件数据，应该怎么设计？
93. ?前端 / knowledge / ?? 2?React 项目常见目录结构如何设计？按技术类型分层和按业务模块分层各有什么取舍？
94. ?前端 / knowledge / ?? 2?JavaScript 中 var、let、const 有什么区别？请结合作用域、提升、暂时性死区和可变性说明。
95. ?前端 / knowledge / ?? 3?JavaScript 事件循环如何工作？宏任务、微任务、渲染时机和 async/await 之间有什么关系？
96. ?前端 / knowledge / ?? 2?什么是 JavaScript 闭包？它常用于哪些场景，又可能带来哪些内存或状态问题？
97. ?前端 / knowledge / ?? 3?TypeScript 泛型解决什么问题？在封装 API 请求、组件 props 或工具函数时如何避免泛型滥用？
98. ?前端 / knowledge / ?? 2?TypeScript interface 的作用是什么？它适合描述哪些契约，和类实现有什么关系？
99. ?前端 / knowledge / ?? 2?TypeScript 中什么时候用 interface，什么时候用 class？为什么不能把类型建模都写成 class？
100. ?前端 / knowledge / ?? 3?TypeScript Decorator 是什么？它适合哪些框架场景，使用时有哪些稳定性和可维护性风险？
101. ?前端 / knowledge / ?? 3?TypeScript 中 interface 和 type 有什么区别？项目里如何制定使用约定？
102. ?前端 / knowledge / ?? 2?TypeScript 中 declare 关键字什么时候使用？它和真实运行时代码有什么区别？
103. ?前端 / knowledge / ?? 2?能否从 JavaScript 库生成 TypeScript 声明文件？生成的 .d.ts 为什么仍然需要人工审核？
104. ?Go / knowledge / ?? 2?Go 中指针的作用是什么？什么时候方法接收者应该使用指针接收者？
105. ?Go / knowledge / ?? 2?Go 有异常吗？Go 的 error、panic、recover 分别适合什么场景？
106. ?Go / knowledge / ?? 2?Goroutine 是什么？它和操作系统线程有什么区别，使用时如何避免泄漏？
107. ?Java / knowledge / ?? 3?Java 垃圾回收大致如何工作？线上出现频繁 Full GC 或长暂停时你会如何排查？
108. ?前端 / knowledge / ?? 2?TypeScript 能不能用于后端？在 Node.js 后端项目里使用 TypeScript 的收益和代价是什么？
109. ?前端 / knowledge / ?? 2?TypeScript 为什么需要编译？编译阶段会做什么，运行时还会保留类型信息吗？
110. ?前端 / knowledge / ?? 3?TypeScript 支持函数重载吗？它和联合类型、泛型相比适合解决什么问题？
111. ?前端 / knowledge / ?? 2?TypeScript 中如何处理 null 和 undefined？strictNullChecks 开启后，类型收窄和可选链有什么作用？
112. ?Go / algorithm / ?? 2?请用 Go 说明如何判断单链表是否有环，并分析快慢指针解法的正确性和复杂度。
113. ?Go / knowledge / ?? 2?Go 是面向对象语言吗？请结合 struct、method、interface 和组合说明 Go 的类型设计。
114. ?Python / knowledge / ?? 2?Django QuerySet 里如何表达“不等于”？exclude() 和 ~Q(...) 有什么区别和使用场景？
115. ?Python / knowledge / ?? 3?Python 元类是什么？它和类、对象的关系是什么？真实项目里什么时候才值得使用元类？
116. ?Python / knowledge / ?? 1?Python 中 if __name__ == "__main__" 有什么作用？它和模块导入、脚本执行有什么关系？
117. ?Python / knowledge / ?? 2?Python 里的 yield 有什么作用？请说明生成器、迭代器协议、惰性求值，以及它适合哪些真实场景。
118. ?Python / knowledge / ?? 2?Django model 字段里的 null=True 和 blank=True 有什么区别？为什么字符串字段通常不建议设置 null=True？
119. ?Python / knowledge / ?? 3?Django 中如何组合多个 QuerySet？请比较 filter(Q(...))、union()、链式合并和 Python 层合并的适用场景。
120. ?Python / knowledge / ?? 3?Django 如何回退一次 migration？线上回退数据库迁移时你会关注哪些风险？
121. ?Java / knowledge / ?? 2?为什么说 Java 语言是“编译与解释并存”？请结合字节码、JIT 和跨平台说明。
122. ?Java / knowledge / ?? 2?Java 异常使用有哪些需要注意的地方？请结合业务异常、日志、事务回滚和异常吞掉的风险说明。
123. ?Java / knowledge / ?? 2?Java 字符串拼接什么时候用“+”，什么时候用 StringBuilder？请说明编译器优化、循环拼接和可读性取舍。
124. ?Java / knowledge / ?? 3?JDK 动态代理和 CGLIB 动态代理有什么区别？Spring AOP 在实际项目中如何选择？
125. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
126. ?网络 / knowledge / ?? 3?有了 HTTP，为什么很多微服务还会使用 RPC？请从协议语义、性能、治理和可观测性角度说明取舍。
127. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
128. ?MySQL / knowledge / ?? 2?SQL 和 NoSQL 数据库有什么区别？在真实项目里你会如何做技术选型？
129. ?MySQL / knowledge / ?? 3?设计一套业务数据库表结构时，你通常会按哪些步骤推进？如何兼顾范式、索引、扩展性和线上演进？
130. ?Java / knowledge / ?? 2?ArrayList 和 LinkedList 有什么区别？请结合底层结构、随机访问、插入删除和真实项目选型说明。
131. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
132. ?网络 / knowledge / ?? 3?TCP TIME_WAIT 为什么存在？TIME_WAIT 过多会不会出问题，线上你会如何判断和治理？
133. ?Java / knowledge / ?? 3?常见序列化协议有哪些？在 RPC、缓存和消息队列场景中你会如何选择 JSON、Protobuf、Avro 或 Java 原生序列化？
134. ?Java / knowledge / ?? 2?Java 反射有什么优缺点？Spring、ORM 或测试框架为什么会大量使用反射？
135. ?Java / knowledge / ?? 2?Java 泛型有什么作用？请说明类型安全、类型擦除、通配符上界和下界的使用场景。
136. ?Java / knowledge / ?? 2?try-with-resources 相比 try-catch-finally 有什么优势？哪些资源适合用它管理？
137. ?Java / knowledge / ?? 3?ClassNotFoundException 和 NoClassDefFoundError 有什么区别？线上启动或运行时报类缺失时你会怎么排查？
138. ?Java / knowledge / ?? 3?ArrayBlockingQueue、LinkedBlockingQueue 和 ConcurrentLinkedQueue 有什么区别？线程池队列选型时你会如何取舍？
139. ?Go / knowledge / ?? 2?Go 里的 zero value 是什么？它对结构体设计、map/slice/channel 使用有什么影响？
140. ?Go / algorithm / ?? 2?请用 Go 思路实现一个栈或队列，并说明 slice 扩容、内存保留和并发安全需要注意什么。
141. ?Go / algorithm / ?? 2?请用 Go 实现或说明如何反转单链表，并分析边界条件、时间复杂度和空间复杂度。
142. ?前端 / knowledge / ?? 2?React 列表渲染里的 key 有什么作用？为什么不推荐在可变列表中直接使用数组下标作为 key？
143. ?MySQL / knowledge / ?? 3?索引越多越好吗？请说明索引对查询、写入、存储、锁和执行计划的影响。
144. ?Java / knowledge / ?? 2?为什么说 Java 只有值传递？对象作为参数传入方法后，修改字段和重新赋值有什么区别？
145. ?Java / knowledge / ?? 3?Java 注解是如何被解析和使用的？请结合编译期处理、运行时反射和 Spring 注解说明。
146. ?Redis / knowledge / ?? 3?线上 Redis 出现延迟升高，你如何区分热 key、大 key、慢命令和网络抖动？分别怎么治理？
147. ?Redis / system-design / ?? 3?订单详情接口使用 Redis 缓存时，如何设计数据库与缓存的一致性策略？如果更新后短时间读到旧值，你怎么排查和改进？
148. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
149. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
150. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
151. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
152. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
153. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
154. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
155. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
156. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
157. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
158. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
159. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
160. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
161. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
162. ?安全 / knowledge / ?? 3?OAuth 登录或三方授权中有哪些常见安全风险？你会如何校验 redirect_uri、state、scope 和授权码交换流程？
163. ?Java / knowledge / ?? 3?请说明 JVM 运行时内存区域如何划分，堆、栈、方法区和直接内存在排查 OOM 时分别要看什么？
164. ?Java / knowledge / ?? 2?Java 类加载的双亲委派模型解决什么问题？什么时候会打破双亲委派？
165. ?Java / knowledge / ?? 2?什么对象可以作为 GC Roots？线上内存泄漏时如何用 MAT 或堆 dump 定位引用链？
166. ?Java / knowledge / ?? 3?多个业务共用一个线程池导致互相影响，你会如何设计线程池隔离和监控？
167. ?Java / knowledge / ?? 2?CompletableFuture 适合哪些异步编排场景？使用时如何处理超时、异常和线程池选择？
168. ?Java / knowledge / ?? 2?Spring 声明式事务在哪些场景会失效？自调用、异常类型和传播行为分别有什么风险？
169. ?Java / knowledge / ?? 3?Spring Bean 生命周期里有哪些关键阶段？初始化、代理和循环依赖问题如何排查？
170. ?Java / knowledge / ?? 2?Java 服务 p99 延迟抖动明显时，你会如何从 GC、线程、锁和下游依赖定位？
171. ?Go / knowledge / ?? 3?Go 的 GMP 调度模型如何工作？它为什么能支撑大量 goroutine？
172. ?Go / knowledge / ?? 2?goroutine 泄漏常见原因有哪些？你会如何用 pprof 和日志定位？
173. ?Go / knowledge / ?? 2?Go channel 应该由谁关闭？关闭后读写会发生什么，如何避免 panic？
174. ?Go / knowledge / ?? 3?context 在超时取消和请求链路中如何使用？滥用 context 会带来什么问题？
175. ?Go / knowledge / ?? 2?defer 的执行顺序和适用场景是什么？高频路径中要注意哪些性能和可读性取舍？
176. ?Go / knowledge / ?? 2?Go interface 中 nil 值有哪些坑？为什么一个 nil 指针放进 interface 后不等于 nil？
177. ?Go / knowledge / ?? 3?Go map 为什么不是并发安全的？你会如何选择 mutex、sync.Map 或分片锁？
178. ?Go / knowledge / ?? 2?Go 逃逸分析是什么？什么情况下变量会从栈逃逸到堆，对性能有什么影响？
179. ?Go / knowledge / ?? 2?Go 服务 GC 频繁导致延迟抖动，你会如何从分配率、GOGC 和对象生命周期排查？
180. ?Go / knowledge / ?? 3?Go pprof 能分析哪些问题？CPU、heap、goroutine 和 block profile 分别怎么看？
181. ?Go / knowledge / ?? 2?Go 错误处理如何设计 error wrapping、sentinel error 和业务错误码？
182. ?Go / knowledge / ?? 2?Go 泛型适合解决什么问题？为什么不应该为了抽象而过度使用泛型？
183. ?Go / knowledge / ?? 3?Go HTTP 服务如何实现优雅退出，避免请求中断和资源泄漏？
184. ?Go / knowledge / ?? 2?Go 服务高并发下如何设计限流、队列和背压，避免 goroutine 无限堆积？
185. ?Go / knowledge / ?? 2?Go 并发代码如何测试竞态条件？race detector 能发现什么，不能发现什么？
186. ?Python / knowledge / ?? 3?Python GIL 解决什么问题？为什么 IO 密集和 CPU 密集场景表现不同？
187. ?Python / knowledge / ?? 2?asyncio 适合哪些场景？事件循环、协程和阻塞调用使用不当会有什么问题？
188. ?Python / knowledge / ?? 2?Celery 任务如何设计幂等、重试、超时和死信处理？
189. ?Python / knowledge / ?? 3?Django ORM 中 N+1 查询如何产生？select_related 和 prefetch_related 如何选择？
190. ?Python / knowledge / ?? 2?Django transaction.atomic 使用时要注意哪些事务边界、锁和异常回滚问题？
191. ?Python / knowledge / ?? 2?FastAPI 服务接口慢时，你会如何区分框架开销、阻塞 IO、数据库和序列化问题？
192. ?Python / knowledge / ?? 3?Python 服务内存持续增长时，你会如何用 tracemalloc、objgraph 或 heapy 定位？
193. ?Python / knowledge / ?? 2?Python 装饰器的实现原理是什么？在鉴权、缓存和日志中使用时要注意什么？
194. ?Python / knowledge / ?? 2?with 上下文管理器如何工作？数据库连接、文件和锁为什么适合用它管理？
195. ?Python / knowledge / ?? 3?gunicorn/uwsgi 多进程模型如何影响连接池、内存和任务调度？
196. ?Python / knowledge / ?? 2?Python JSON 序列化成为瓶颈时，你会如何优化和验证？
197. ?Python / knowledge / ?? 2?Python 类型提示和 mypy 能解决什么问题？它们不能保证什么？
198. ?Python / system-design / ?? 3?Python 项目依赖冲突或供应链风险如何治理？
199. ?Python / knowledge / ?? 2?Python Web 服务中如何设计本地缓存和 Redis 缓存，避免穿透和脏数据？
200. ?Python / knowledge / ?? 2?Python 服务如何设计结构化日志、traceId 和异常堆栈，方便线上排查？
201. ?Python / knowledge / ?? 3?pytest fixture 如何组织复杂测试数据和依赖，避免测试互相污染？
202. ?前端 / knowledge / ?? 3?浏览器从 HTML 到页面渲染的关键流程是什么？哪些操作会触发重排和重绘？
203. ?前端 / knowledge / ?? 2?首屏加载慢时，你会如何从资源体积、网络、渲染和接口请求定位？
204. ?前端 / knowledge / ?? 2?LCP、FID/INP、CLS 分别衡量什么？如何针对性优化？
205. ?前端 / knowledge / ?? 3?前端项目如何做代码分割和懒加载，避免首屏 bundle 过大？
206. ?前端 / knowledge / ?? 2?Tree Shaking 生效需要哪些条件？为什么有些依赖无法被摇掉？
207. ?前端 / knowledge / ?? 2?前端静态资源如何设计强缓存、协商缓存、hash 和 CDN 刷新策略？
208. ?前端 / knowledge / ?? 3?Service Worker 能解决哪些缓存和离线问题？使用不当有什么风险？
209. ?前端 / knowledge / ?? 2?CORS 的预检请求、凭证和安全边界是什么？如何排查跨域失败？
210. ?前端 / knowledge / ?? 2?前端如何防护 XSS？富文本、innerHTML 和第三方脚本分别要注意什么？
211. ?前端 / knowledge / ?? 3?前端使用 Cookie 鉴权时，SameSite、httpOnly 和 CSRF Token 分别解决什么？
212. ?前端 / knowledge / ?? 2?复杂页面中状态应该放组件、URL、全局 store 还是服务端缓存？如何判断？
213. ?前端 / knowledge / ?? 2?React 页面卡顿时，你会如何定位不必要渲染、长任务和大列表问题？
214. ?前端 / knowledge / ?? 3?Hooks 中闭包和依赖数组常见坑有哪些？如何避免状态过期？
215. ?前端 / knowledge / ?? 2?React Error Boundary 能捕获什么，不能捕获什么？线上白屏如何治理？
216. ?前端 / knowledge / ?? 2?Vue 响应式系统如何追踪依赖？数组、对象和异步更新有哪些注意点？
217. ?前端 / knowledge / ?? 3?如何设计一个可复用表格或表单组件，同时避免过度抽象？
218. ?前端 / system-design / ?? 3?中后台系统如何设计菜单权限、按钮权限、路由守卫和接口权限校验？
219. ?前端 / knowledge / ?? 2?复杂表单如何处理联动校验、异步校验、草稿保存和错误提示？
220. ?前端 / knowledge / ?? 3?虚拟滚动如何实现？动态高度、滚动定位和可访问性有哪些难点？
221. ?前端 / knowledge / ?? 2?前端监控如何采集 JS 错误、白屏、性能、接口异常和用户行为？
222. ?前端 / knowledge / ?? 2?线上 Source Map 如何用于定位问题，同时避免源码泄露？
223. ?前端 / knowledge / ?? 3?前端埋点如何设计事件模型、去重、版本和数据质量校验？
224. ?前端 / knowledge / ?? 2?微前端适合什么场景？沙箱、样式隔离、通信和部署会带来哪些问题？
225. ?前端 / knowledge / ?? 2?前端 Monorepo 如何管理包、依赖、构建缓存和版本发布？
226. ?前端 / system-design / ?? 3?如何设计前端 ESLint、Prettier、TypeScript、测试和构建门禁？
227. ?前端 / knowledge / ?? 2?TypeScript 如何为接口数据、组件 props 和业务状态建模？过度类型化有什么问题？
228. ?前端 / knowledge / ?? 2?单元测试、组件测试、E2E 测试在前端分别适合覆盖什么？
229. ?前端 / knowledge / ?? 3?前端可访问性应该关注哪些语义、键盘操作、焦点管理和颜色对比？
230. ?前端 / system-design / ?? 3?多语言项目如何设计文案、日期货币、复数规则和异步加载？
231. ?前端 / knowledge / ?? 2?移动端 H5 如何处理视口、刘海屏、1px、软键盘和安全区？
232. ?前端 / knowledge / ?? 3?弱网环境下前端如何做请求超时、重试、骨架屏和离线提示？
233. ?前端 / knowledge / ?? 2?大文件上传如何做分片、断点续传、秒传和失败重试？
234. ?前端 / knowledge / ?? 2?前端 WebSocket 如何处理重连、心跳、消息乱序和页面生命周期？
235. ?前端 / knowledge / ?? 3?前端第三方依赖如何做漏洞治理、锁版本和供应链风险控制？
236. ?前端 / knowledge / ?? 2?如何建设前端设计系统，保证组件一致性和团队协作效率？
237. ?前端 / knowledge / ?? 2?SSR、SSG 和 CSR 分别适合什么场景？它们对性能和部署有什么影响？
238. ?前端 / knowledge / ?? 3?SSR Hydration 不一致会出现什么问题？如何定位和避免？
239. ?前端 / knowledge / ?? 2?前端页面内存持续上涨时，你会如何定位事件监听、定时器和闭包引用？
240. ?前端 / knowledge / ?? 2?宏任务、微任务和渲染时机如何影响 Promise、setTimeout 和 UI 更新？
241. ?前端 / project / ?? 3?请讲一次你治理前端性能、稳定性或工程化问题的项目经历。
242. ?系统设计 / knowledge / ?? 3?分布式锁适合解决什么问题？Redis 锁、数据库锁和 ZooKeeper 锁各有什么边界？
243. ?系统设计 / knowledge / ?? 2?分布式定时任务如何避免重复执行、漏执行和执行节点故障？
244. ?系统设计 / knowledge / ?? 3?如何抽象一套通用接口幂等组件，支持下单、支付回调和 MQ 消费？
245. ?系统设计 / system-design / ?? 3?消息队列如何保证同一业务实体的顺序性？分区、重试和死信会带来什么影响？
246. ?系统设计 / knowledge / ?? 3?高流量接口上线前如何设计缓存预热和失败回退，避免冷启动打爆数据库？
247. ?系统设计 / knowledge / ?? 2?账户或库存热点更新导致锁竞争时，你会如何拆分、排队或异步化？
248. ?系统设计 / system-design / ?? 3?读写分离场景下主从延迟会带来什么问题，业务如何兜底？
249. ?系统设计 / knowledge / ?? 2?业务配置如何支持灰度、生效范围、审计和快速回滚？
250. ?系统设计 / knowledge / ?? 3?后端接口如何设计兼容演进，避免客户端或调用方升级时大面积失败？
251. ?系统设计 / system-design / ?? 3?核心链路压测如何处理测试流量标记、数据隔离和下游保护？
252. ?系统设计 / knowledge / ?? 3?下游依赖故障时，如何设计缓存兜底、默认值、限流和用户提示？
253. ?系统设计 / knowledge / ?? 2?后端慢请求治理如何从网关、应用、数据库、缓存和下游依赖分层推进？
254. ?系统设计 / system-design / ?? 3?本地缓存、分布式缓存和 CDN 如何组合，如何处理一致性和失效？
255. ?系统设计 / knowledge / ?? 2?核心写操作如何设计审计日志，满足追踪、合规和问题定位？
256. ?系统设计 / knowledge / ?? 3?后端服务灰度发布如何处理流量染色、数据兼容和回滚？
257. ?系统设计 / system-design / ?? 3?批处理任务如何限速和分片，避免影响在线业务？
258. ?系统设计 / knowledge / ?? 3?高价值接口如何设计限流、防刷、验证码和风控联动？
259. ?系统设计 / knowledge / ?? 2?后端异常如何区分业务异常、系统异常、依赖异常和可重试异常？
260. ?系统设计 / system-design / ?? 3?统一错误码体系如何设计，既方便前端展示又方便服务端排障？
261. ?系统设计 / knowledge / ?? 2?生产数据订正如何设计审批、脚本、备份、验证和审计？

## Java 后端?java?- 120 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?Redis / knowledge / ?? 2?Redis 为什么快？
3. ?MySQL / knowledge / ?? 2?MySQL 索引为什么能提升查询速度？
4. ?MySQL / knowledge / ?? 3?请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？
5. ?MySQL / knowledge / ?? 3?线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。
6. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
7. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
8. ?网络 / knowledge / ?? 3?请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？
9. ?操作系统 / knowledge / ?? 2?请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？
10. ?操作系统 / knowledge / ?? 3?请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？
11. ?操作系统 / knowledge / ?? 3?请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。
12. ?Java / knowledge / ?? 2?HashMap 的底层原理是什么？
13. ?Java / knowledge / ?? 3?请说明 Java 线程池的核心参数、任务提交流程和拒绝策略。线上线程池打满、队列堆积时，你会怎么排查和治理？
14. ?Java / knowledge / ?? 3?请说明 synchronized、ReentrantLock、volatile 和 ConcurrentHashMap 分别解决什么并发问题。线上出现锁竞争或并发安全问题时，你会怎么定位？
15. ?系统设计 / system-design / ?? 3?如果让你设计一个短链接系统，你会怎么设计？
16. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
17. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
18. ?Redis / knowledge / ?? 3?如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？
19. ?Redis / knowledge / ?? 3?数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。
20. ?系统设计 / system-design / ?? 3?设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？
21. ?系统设计 / system-design / ?? 3?如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？
22. ?Java / knowledge / ?? 3?如果一个 Java 服务频繁出现 Full GC 和请求抖动，你会怎么判断是内存分配、对象滞留还是 JVM 参数配置问题？
23. ?Java / project / ?? 3?讲一个你用 Java 做过的核心业务链路治理项目。重点讲清线程池或异步编排、事务边界、失败补偿，以及你为什么这样拆。
24. ?项目经历 / project / ?? 3?说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。
25. ?MySQL / algorithm / ?? 2?有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。
26. ?MySQL / algorithm / ?? 3?有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。
27. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
28. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
29. ?系统设计 / algorithm / ?? 3?请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。
30. ?Redis / algorithm / ?? 3?如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。
31. ?系统设计 / algorithm / ?? 3?请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。
32. ?MySQL / knowledge / ?? 2?MySQL 整数类型的 UNSIGNED 属性有什么作用？设计字段时什么时候适合使用，什么时候不建议使用？
33. ?MySQL / knowledge / ?? 2?CHAR 和 VARCHAR 的区别是什么？在用户昵称、手机号、固定编码等字段上你会如何选择？
34. ?MySQL / knowledge / ?? 2?DECIMAL 和 FLOAT/DOUBLE 有什么区别？为什么金额、费率这类字段通常不用浮点数保存？
35. ?MySQL / knowledge / ?? 2?DATETIME 和 TIMESTAMP 有什么区别？如果系统面向多时区用户，创建时间和业务发生时间应该怎么设计？
36. ?MySQL / knowledge / ?? 2?手机号、身份证号、订单号这类“数字字符串”为什么通常不建议用 INT/BIGINT 存？
37. ?MySQL / knowledge / ?? 2?MySQL 支持哪些常见存储引擎？为什么业务系统通常默认选择 InnoDB？
38. ?MySQL / knowledge / ?? 2?MyISAM 和 InnoDB 的核心区别是什么？如果一个老系统还在用 MyISAM，迁移到 InnoDB 要关注哪些风险？
39. ?MySQL / knowledge / ?? 3?MySQL InnoDB 为什么常用 B+Tree 作为索引结构？相比哈希索引和普通 B 树，它适合解决什么问题？
40. ?MySQL / knowledge / ?? 2?什么是覆盖索引？它为什么能减少回表，设计时又有哪些限制？
41. ?MySQL / knowledge / ?? 2?请解释 MySQL 联合索引和最左前缀原则。为什么索引列顺序会影响查询效果？
42. ?MySQL / knowledge / ?? 2?哪些字段适合创建索引？高频查询字段是否都应该建索引？
43. ?MySQL / knowledge / ?? 2?MySQL 中常见的索引失效原因有哪些？线上发现走了全表扫描时你会怎么排查？
44. ?MySQL / knowledge / ?? 2?什么是数据库事务？ACID 四个特性分别解决什么问题？
45. ?MySQL / knowledge / ?? 2?并发事务会带来哪些典型问题？脏读、不可重复读、幻读分别是什么？
46. ?MySQL / knowledge / ?? 3?不可重复读和幻读到底怎么区分？在 InnoDB 可重复读隔离级别下还需要担心幻读吗？
47. ?MySQL / knowledge / ?? 3?MySQL 的隔离级别完全是靠锁实现的吗？请说明 MVCC、快照读和当前读的关系。
48. ?MySQL / knowledge / ?? 2?表级锁和行级锁有什么区别？为什么有时写了行锁语义的 SQL 最后会锁住很多行？
49. ?MySQL / knowledge / ?? 3?当前读和快照读有什么区别？在库存扣减或防重复提交场景下应该用哪类读？
50. ?MySQL / knowledge / ?? 2?常见 SQL 优化手段有哪些？请按“定位问题、改写 SQL、调整索引、验证效果”的顺序回答。
51. ?MySQL / knowledge / ?? 2?如何分析一条 SQL 的性能？Explain 里哪些字段最值得关注？
52. ?MySQL / knowledge / ?? 3?MySQL 深度分页为什么会慢？如果接口需要翻到第 10000 页，你会怎么优化？
53. ?MySQL / knowledge / ?? 2?能不能把图片、文件这类二进制内容直接存到 MySQL？一般业务系统为什么更常把文件放对象存储？
54. ?MySQL / knowledge / ?? 2?MySQL 中如何存储 IP 地址？VARCHAR、整数和 VARBINARY 各有什么取舍？
55. ?Java / knowledge / ?? 3?Java 垃圾回收大致如何工作？线上出现频繁 Full GC 或长暂停时你会如何排查？
56. ?Java / knowledge / ?? 2?为什么说 Java 语言是“编译与解释并存”？请结合字节码、JIT 和跨平台说明。
57. ?Java / knowledge / ?? 2?Java 异常使用有哪些需要注意的地方？请结合业务异常、日志、事务回滚和异常吞掉的风险说明。
58. ?Java / knowledge / ?? 2?Java 字符串拼接什么时候用“+”，什么时候用 StringBuilder？请说明编译器优化、循环拼接和可读性取舍。
59. ?Java / knowledge / ?? 3?JDK 动态代理和 CGLIB 动态代理有什么区别？Spring AOP 在实际项目中如何选择？
60. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
61. ?网络 / knowledge / ?? 3?有了 HTTP，为什么很多微服务还会使用 RPC？请从协议语义、性能、治理和可观测性角度说明取舍。
62. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
63. ?MySQL / knowledge / ?? 2?SQL 和 NoSQL 数据库有什么区别？在真实项目里你会如何做技术选型？
64. ?MySQL / knowledge / ?? 3?设计一套业务数据库表结构时，你通常会按哪些步骤推进？如何兼顾范式、索引、扩展性和线上演进？
65. ?Java / knowledge / ?? 2?ArrayList 和 LinkedList 有什么区别？请结合底层结构、随机访问、插入删除和真实项目选型说明。
66. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
67. ?网络 / knowledge / ?? 3?TCP TIME_WAIT 为什么存在？TIME_WAIT 过多会不会出问题，线上你会如何判断和治理？
68. ?Java / knowledge / ?? 3?常见序列化协议有哪些？在 RPC、缓存和消息队列场景中你会如何选择 JSON、Protobuf、Avro 或 Java 原生序列化？
69. ?Java / knowledge / ?? 2?Java 反射有什么优缺点？Spring、ORM 或测试框架为什么会大量使用反射？
70. ?Java / knowledge / ?? 2?Java 泛型有什么作用？请说明类型安全、类型擦除、通配符上界和下界的使用场景。
71. ?Java / knowledge / ?? 2?try-with-resources 相比 try-catch-finally 有什么优势？哪些资源适合用它管理？
72. ?Java / knowledge / ?? 3?ClassNotFoundException 和 NoClassDefFoundError 有什么区别？线上启动或运行时报类缺失时你会怎么排查？
73. ?Java / knowledge / ?? 3?ArrayBlockingQueue、LinkedBlockingQueue 和 ConcurrentLinkedQueue 有什么区别？线程池队列选型时你会如何取舍？
74. ?MySQL / knowledge / ?? 3?索引越多越好吗？请说明索引对查询、写入、存储、锁和执行计划的影响。
75. ?Java / knowledge / ?? 2?为什么说 Java 只有值传递？对象作为参数传入方法后，修改字段和重新赋值有什么区别？
76. ?Java / knowledge / ?? 3?Java 注解是如何被解析和使用的？请结合编译期处理、运行时反射和 Spring 注解说明。
77. ?Redis / knowledge / ?? 3?线上 Redis 出现延迟升高，你如何区分热 key、大 key、慢命令和网络抖动？分别怎么治理？
78. ?Redis / system-design / ?? 3?订单详情接口使用 Redis 缓存时，如何设计数据库与缓存的一致性策略？如果更新后短时间读到旧值，你怎么排查和改进？
79. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
80. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
81. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
82. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
83. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
84. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
85. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
86. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
87. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
88. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
89. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
90. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
91. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
92. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
93. ?Java / knowledge / ?? 3?请说明 JVM 运行时内存区域如何划分，堆、栈、方法区和直接内存在排查 OOM 时分别要看什么？
94. ?Java / knowledge / ?? 2?Java 类加载的双亲委派模型解决什么问题？什么时候会打破双亲委派？
95. ?Java / knowledge / ?? 2?什么对象可以作为 GC Roots？线上内存泄漏时如何用 MAT 或堆 dump 定位引用链？
96. ?Java / knowledge / ?? 3?多个业务共用一个线程池导致互相影响，你会如何设计线程池隔离和监控？
97. ?Java / knowledge / ?? 2?CompletableFuture 适合哪些异步编排场景？使用时如何处理超时、异常和线程池选择？
98. ?Java / knowledge / ?? 2?Spring 声明式事务在哪些场景会失效？自调用、异常类型和传播行为分别有什么风险？
99. ?Java / knowledge / ?? 3?Spring Bean 生命周期里有哪些关键阶段？初始化、代理和循环依赖问题如何排查？
100. ?Java / knowledge / ?? 2?Java 服务 p99 延迟抖动明显时，你会如何从 GC、线程、锁和下游依赖定位？
101. ?系统设计 / knowledge / ?? 3?分布式锁适合解决什么问题？Redis 锁、数据库锁和 ZooKeeper 锁各有什么边界？
102. ?系统设计 / knowledge / ?? 2?分布式定时任务如何避免重复执行、漏执行和执行节点故障？
103. ?系统设计 / knowledge / ?? 3?如何抽象一套通用接口幂等组件，支持下单、支付回调和 MQ 消费？
104. ?系统设计 / system-design / ?? 3?消息队列如何保证同一业务实体的顺序性？分区、重试和死信会带来什么影响？
105. ?系统设计 / knowledge / ?? 3?高流量接口上线前如何设计缓存预热和失败回退，避免冷启动打爆数据库？
106. ?系统设计 / knowledge / ?? 2?账户或库存热点更新导致锁竞争时，你会如何拆分、排队或异步化？
107. ?系统设计 / system-design / ?? 3?读写分离场景下主从延迟会带来什么问题，业务如何兜底？
108. ?系统设计 / knowledge / ?? 2?业务配置如何支持灰度、生效范围、审计和快速回滚？
109. ?系统设计 / knowledge / ?? 3?后端接口如何设计兼容演进，避免客户端或调用方升级时大面积失败？
110. ?系统设计 / system-design / ?? 3?核心链路压测如何处理测试流量标记、数据隔离和下游保护？
111. ?系统设计 / knowledge / ?? 3?下游依赖故障时，如何设计缓存兜底、默认值、限流和用户提示？
112. ?系统设计 / knowledge / ?? 2?后端慢请求治理如何从网关、应用、数据库、缓存和下游依赖分层推进？
113. ?系统设计 / system-design / ?? 3?本地缓存、分布式缓存和 CDN 如何组合，如何处理一致性和失效？
114. ?系统设计 / knowledge / ?? 2?核心写操作如何设计审计日志，满足追踪、合规和问题定位？
115. ?系统设计 / knowledge / ?? 3?后端服务灰度发布如何处理流量染色、数据兼容和回滚？
116. ?系统设计 / system-design / ?? 3?批处理任务如何限速和分片，避免影响在线业务？
117. ?系统设计 / knowledge / ?? 3?高价值接口如何设计限流、防刷、验证码和风控联动？
118. ?系统设计 / knowledge / ?? 2?后端异常如何区分业务异常、系统异常、依赖异常和可重试异常？
119. ?系统设计 / system-design / ?? 3?统一错误码体系如何设计，既方便前端展示又方便服务端排障？
120. ?系统设计 / knowledge / ?? 2?生产数据订正如何设计审批、脚本、备份、验证和审计？

## Go 后端?go?- 120 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?Redis / knowledge / ?? 2?Redis 为什么快？
3. ?MySQL / knowledge / ?? 2?MySQL 索引为什么能提升查询速度？
4. ?MySQL / knowledge / ?? 3?请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？
5. ?MySQL / knowledge / ?? 3?线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。
6. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
7. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
8. ?网络 / knowledge / ?? 3?请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？
9. ?操作系统 / knowledge / ?? 2?请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？
10. ?操作系统 / knowledge / ?? 3?请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？
11. ?操作系统 / knowledge / ?? 3?请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。
12. ?系统设计 / system-design / ?? 3?如果让你设计一个短链接系统，你会怎么设计？
13. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
14. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
15. ?Redis / knowledge / ?? 3?如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？
16. ?Redis / knowledge / ?? 3?数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。
17. ?系统设计 / system-design / ?? 3?设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？
18. ?Go / knowledge / ?? 2?Go 的 goroutine 为什么适合做高并发服务？它和线程相比关键差别是什么？
19. ?Go / knowledge / ?? 3?如果一个 Go 服务出现 goroutine 数量持续上涨、延迟抖动，你会怎么排查？
20. ?Go / knowledge / ?? 3?请说明 Go 里 channel、context 和 mutex 的典型使用场景。线上出现 goroutine 泄漏、channel 阻塞或锁竞争时，你会怎么定位和治理？
21. ?系统设计 / system-design / ?? 3?如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？
22. ?项目经历 / project / ?? 3?说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。
23. ?Go / project / ?? 3?讲一个你用 Go 做过的高并发服务或任务系统。重点讲清 goroutine 协作、限流背压、超时取消和故障止血是怎么设计的。
24. ?MySQL / algorithm / ?? 2?有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。
25. ?MySQL / algorithm / ?? 3?有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。
26. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
27. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
28. ?系统设计 / algorithm / ?? 3?请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。
29. ?Redis / algorithm / ?? 3?如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。
30. ?系统设计 / algorithm / ?? 3?请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。
31. ?MySQL / knowledge / ?? 2?MySQL 整数类型的 UNSIGNED 属性有什么作用？设计字段时什么时候适合使用，什么时候不建议使用？
32. ?MySQL / knowledge / ?? 2?CHAR 和 VARCHAR 的区别是什么？在用户昵称、手机号、固定编码等字段上你会如何选择？
33. ?MySQL / knowledge / ?? 2?DECIMAL 和 FLOAT/DOUBLE 有什么区别？为什么金额、费率这类字段通常不用浮点数保存？
34. ?MySQL / knowledge / ?? 2?DATETIME 和 TIMESTAMP 有什么区别？如果系统面向多时区用户，创建时间和业务发生时间应该怎么设计？
35. ?MySQL / knowledge / ?? 2?手机号、身份证号、订单号这类“数字字符串”为什么通常不建议用 INT/BIGINT 存？
36. ?MySQL / knowledge / ?? 2?MySQL 支持哪些常见存储引擎？为什么业务系统通常默认选择 InnoDB？
37. ?MySQL / knowledge / ?? 2?MyISAM 和 InnoDB 的核心区别是什么？如果一个老系统还在用 MyISAM，迁移到 InnoDB 要关注哪些风险？
38. ?MySQL / knowledge / ?? 3?MySQL InnoDB 为什么常用 B+Tree 作为索引结构？相比哈希索引和普通 B 树，它适合解决什么问题？
39. ?MySQL / knowledge / ?? 2?什么是覆盖索引？它为什么能减少回表，设计时又有哪些限制？
40. ?MySQL / knowledge / ?? 2?请解释 MySQL 联合索引和最左前缀原则。为什么索引列顺序会影响查询效果？
41. ?MySQL / knowledge / ?? 2?哪些字段适合创建索引？高频查询字段是否都应该建索引？
42. ?MySQL / knowledge / ?? 2?MySQL 中常见的索引失效原因有哪些？线上发现走了全表扫描时你会怎么排查？
43. ?MySQL / knowledge / ?? 2?什么是数据库事务？ACID 四个特性分别解决什么问题？
44. ?MySQL / knowledge / ?? 2?并发事务会带来哪些典型问题？脏读、不可重复读、幻读分别是什么？
45. ?MySQL / knowledge / ?? 3?不可重复读和幻读到底怎么区分？在 InnoDB 可重复读隔离级别下还需要担心幻读吗？
46. ?MySQL / knowledge / ?? 3?MySQL 的隔离级别完全是靠锁实现的吗？请说明 MVCC、快照读和当前读的关系。
47. ?MySQL / knowledge / ?? 2?表级锁和行级锁有什么区别？为什么有时写了行锁语义的 SQL 最后会锁住很多行？
48. ?MySQL / knowledge / ?? 3?当前读和快照读有什么区别？在库存扣减或防重复提交场景下应该用哪类读？
49. ?MySQL / knowledge / ?? 2?常见 SQL 优化手段有哪些？请按“定位问题、改写 SQL、调整索引、验证效果”的顺序回答。
50. ?MySQL / knowledge / ?? 2?如何分析一条 SQL 的性能？Explain 里哪些字段最值得关注？
51. ?MySQL / knowledge / ?? 3?MySQL 深度分页为什么会慢？如果接口需要翻到第 10000 页，你会怎么优化？
52. ?MySQL / knowledge / ?? 2?能不能把图片、文件这类二进制内容直接存到 MySQL？一般业务系统为什么更常把文件放对象存储？
53. ?MySQL / knowledge / ?? 2?MySQL 中如何存储 IP 地址？VARCHAR、整数和 VARBINARY 各有什么取舍？
54. ?Go / knowledge / ?? 2?Go 中指针的作用是什么？什么时候方法接收者应该使用指针接收者？
55. ?Go / knowledge / ?? 2?Go 有异常吗？Go 的 error、panic、recover 分别适合什么场景？
56. ?Go / knowledge / ?? 2?Goroutine 是什么？它和操作系统线程有什么区别，使用时如何避免泄漏？
57. ?Go / algorithm / ?? 2?请用 Go 说明如何判断单链表是否有环，并分析快慢指针解法的正确性和复杂度。
58. ?Go / knowledge / ?? 2?Go 是面向对象语言吗？请结合 struct、method、interface 和组合说明 Go 的类型设计。
59. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
60. ?网络 / knowledge / ?? 3?有了 HTTP，为什么很多微服务还会使用 RPC？请从协议语义、性能、治理和可观测性角度说明取舍。
61. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
62. ?MySQL / knowledge / ?? 2?SQL 和 NoSQL 数据库有什么区别？在真实项目里你会如何做技术选型？
63. ?MySQL / knowledge / ?? 3?设计一套业务数据库表结构时，你通常会按哪些步骤推进？如何兼顾范式、索引、扩展性和线上演进？
64. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
65. ?网络 / knowledge / ?? 3?TCP TIME_WAIT 为什么存在？TIME_WAIT 过多会不会出问题，线上你会如何判断和治理？
66. ?Go / knowledge / ?? 2?Go 里的 zero value 是什么？它对结构体设计、map/slice/channel 使用有什么影响？
67. ?Go / algorithm / ?? 2?请用 Go 思路实现一个栈或队列，并说明 slice 扩容、内存保留和并发安全需要注意什么。
68. ?Go / algorithm / ?? 2?请用 Go 实现或说明如何反转单链表，并分析边界条件、时间复杂度和空间复杂度。
69. ?MySQL / knowledge / ?? 3?索引越多越好吗？请说明索引对查询、写入、存储、锁和执行计划的影响。
70. ?Redis / knowledge / ?? 3?线上 Redis 出现延迟升高，你如何区分热 key、大 key、慢命令和网络抖动？分别怎么治理？
71. ?Redis / system-design / ?? 3?订单详情接口使用 Redis 缓存时，如何设计数据库与缓存的一致性策略？如果更新后短时间读到旧值，你怎么排查和改进？
72. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
73. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
74. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
75. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
76. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
77. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
78. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
79. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
80. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
81. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
82. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
83. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
84. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
85. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
86. ?Go / knowledge / ?? 3?Go 的 GMP 调度模型如何工作？它为什么能支撑大量 goroutine？
87. ?Go / knowledge / ?? 2?goroutine 泄漏常见原因有哪些？你会如何用 pprof 和日志定位？
88. ?Go / knowledge / ?? 2?Go channel 应该由谁关闭？关闭后读写会发生什么，如何避免 panic？
89. ?Go / knowledge / ?? 3?context 在超时取消和请求链路中如何使用？滥用 context 会带来什么问题？
90. ?Go / knowledge / ?? 2?defer 的执行顺序和适用场景是什么？高频路径中要注意哪些性能和可读性取舍？
91. ?Go / knowledge / ?? 2?Go interface 中 nil 值有哪些坑？为什么一个 nil 指针放进 interface 后不等于 nil？
92. ?Go / knowledge / ?? 3?Go map 为什么不是并发安全的？你会如何选择 mutex、sync.Map 或分片锁？
93. ?Go / knowledge / ?? 2?Go 逃逸分析是什么？什么情况下变量会从栈逃逸到堆，对性能有什么影响？
94. ?Go / knowledge / ?? 2?Go 服务 GC 频繁导致延迟抖动，你会如何从分配率、GOGC 和对象生命周期排查？
95. ?Go / knowledge / ?? 3?Go pprof 能分析哪些问题？CPU、heap、goroutine 和 block profile 分别怎么看？
96. ?Go / knowledge / ?? 2?Go 错误处理如何设计 error wrapping、sentinel error 和业务错误码？
97. ?Go / knowledge / ?? 2?Go 泛型适合解决什么问题？为什么不应该为了抽象而过度使用泛型？
98. ?Go / knowledge / ?? 3?Go HTTP 服务如何实现优雅退出，避免请求中断和资源泄漏？
99. ?Go / knowledge / ?? 2?Go 服务高并发下如何设计限流、队列和背压，避免 goroutine 无限堆积？
100. ?Go / knowledge / ?? 2?Go 并发代码如何测试竞态条件？race detector 能发现什么，不能发现什么？
101. ?系统设计 / knowledge / ?? 3?分布式锁适合解决什么问题？Redis 锁、数据库锁和 ZooKeeper 锁各有什么边界？
102. ?系统设计 / knowledge / ?? 2?分布式定时任务如何避免重复执行、漏执行和执行节点故障？
103. ?系统设计 / knowledge / ?? 3?如何抽象一套通用接口幂等组件，支持下单、支付回调和 MQ 消费？
104. ?系统设计 / system-design / ?? 3?消息队列如何保证同一业务实体的顺序性？分区、重试和死信会带来什么影响？
105. ?系统设计 / knowledge / ?? 3?高流量接口上线前如何设计缓存预热和失败回退，避免冷启动打爆数据库？
106. ?系统设计 / knowledge / ?? 2?账户或库存热点更新导致锁竞争时，你会如何拆分、排队或异步化？
107. ?系统设计 / system-design / ?? 3?读写分离场景下主从延迟会带来什么问题，业务如何兜底？
108. ?系统设计 / knowledge / ?? 2?业务配置如何支持灰度、生效范围、审计和快速回滚？
109. ?系统设计 / knowledge / ?? 3?后端接口如何设计兼容演进，避免客户端或调用方升级时大面积失败？
110. ?系统设计 / system-design / ?? 3?核心链路压测如何处理测试流量标记、数据隔离和下游保护？
111. ?系统设计 / knowledge / ?? 3?下游依赖故障时，如何设计缓存兜底、默认值、限流和用户提示？
112. ?系统设计 / knowledge / ?? 2?后端慢请求治理如何从网关、应用、数据库、缓存和下游依赖分层推进？
113. ?系统设计 / system-design / ?? 3?本地缓存、分布式缓存和 CDN 如何组合，如何处理一致性和失效？
114. ?系统设计 / knowledge / ?? 2?核心写操作如何设计审计日志，满足追踪、合规和问题定位？
115. ?系统设计 / knowledge / ?? 3?后端服务灰度发布如何处理流量染色、数据兼容和回滚？
116. ?系统设计 / system-design / ?? 3?批处理任务如何限速和分片，避免影响在线业务？
117. ?系统设计 / knowledge / ?? 3?高价值接口如何设计限流、防刷、验证码和风控联动？
118. ?系统设计 / knowledge / ?? 2?后端异常如何区分业务异常、系统异常、依赖异常和可重试异常？
119. ?系统设计 / system-design / ?? 3?统一错误码体系如何设计，既方便前端展示又方便服务端排障？
120. ?系统设计 / knowledge / ?? 2?生产数据订正如何设计审批、脚本、备份、验证和审计？

## Python 后端?python?- 120 ?

1. ?项目经历 / project / ?? 2?请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。
2. ?Redis / knowledge / ?? 2?Redis 为什么快？
3. ?MySQL / knowledge / ?? 2?MySQL 索引为什么能提升查询速度？
4. ?MySQL / knowledge / ?? 3?请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？
5. ?MySQL / knowledge / ?? 3?线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。
6. ?网络 / knowledge / ?? 2?请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？
7. ?网络 / knowledge / ?? 3?一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？
8. ?网络 / knowledge / ?? 3?请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？
9. ?操作系统 / knowledge / ?? 2?请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？
10. ?操作系统 / knowledge / ?? 3?请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？
11. ?操作系统 / knowledge / ?? 3?请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。
12. ?系统设计 / system-design / ?? 3?如果让你设计一个短链接系统，你会怎么设计？
13. ?算法 / algorithm / ?? 2?给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。
14. ?项目经历 / project / ?? 1?挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。
15. ?Redis / knowledge / ?? 3?如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？
16. ?Redis / knowledge / ?? 3?数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。
17. ?系统设计 / system-design / ?? 3?设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？
18. ?Python / knowledge / ?? 2?Python 里生成器和普通列表相比，适合用在什么场景？你会怎么解释它的价值？
19. ?Python / knowledge / ?? 3?如果一个 Python 服务 CPU 打满、吞吐上不去，你会怎么判断是 GIL、代码热点还是架构问题？
20. ?系统设计 / system-design / ?? 3?如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？
21. ?项目经历 / project / ?? 3?说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。
22. ?Python / project / ?? 3?说一个你用 Python 做过的任务调度、异步处理或数据流水线项目。重点讲讲任务拆分、失败重试、可观测性和资源隔离。
23. ?Python / knowledge / ?? 3?如果一个 Python 服务同时有接口请求慢、worker 积压和 CPU 飙高，你会怎么判断是 GIL、I/O 阻塞、序列化开销还是任务模型设计问题？
24. ?MySQL / algorithm / ?? 2?有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。
25. ?MySQL / algorithm / ?? 3?有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。
26. ?算法 / algorithm / ?? 3?请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。
27. ?算法 / algorithm / ?? 2?请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。
28. ?系统设计 / algorithm / ?? 3?请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。
29. ?Redis / algorithm / ?? 3?如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。
30. ?系统设计 / algorithm / ?? 3?请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。
31. ?MySQL / knowledge / ?? 2?MySQL 整数类型的 UNSIGNED 属性有什么作用？设计字段时什么时候适合使用，什么时候不建议使用？
32. ?MySQL / knowledge / ?? 2?CHAR 和 VARCHAR 的区别是什么？在用户昵称、手机号、固定编码等字段上你会如何选择？
33. ?MySQL / knowledge / ?? 2?DECIMAL 和 FLOAT/DOUBLE 有什么区别？为什么金额、费率这类字段通常不用浮点数保存？
34. ?MySQL / knowledge / ?? 2?DATETIME 和 TIMESTAMP 有什么区别？如果系统面向多时区用户，创建时间和业务发生时间应该怎么设计？
35. ?MySQL / knowledge / ?? 2?手机号、身份证号、订单号这类“数字字符串”为什么通常不建议用 INT/BIGINT 存？
36. ?MySQL / knowledge / ?? 2?MySQL 支持哪些常见存储引擎？为什么业务系统通常默认选择 InnoDB？
37. ?MySQL / knowledge / ?? 2?MyISAM 和 InnoDB 的核心区别是什么？如果一个老系统还在用 MyISAM，迁移到 InnoDB 要关注哪些风险？
38. ?MySQL / knowledge / ?? 3?MySQL InnoDB 为什么常用 B+Tree 作为索引结构？相比哈希索引和普通 B 树，它适合解决什么问题？
39. ?MySQL / knowledge / ?? 2?什么是覆盖索引？它为什么能减少回表，设计时又有哪些限制？
40. ?MySQL / knowledge / ?? 2?请解释 MySQL 联合索引和最左前缀原则。为什么索引列顺序会影响查询效果？
41. ?MySQL / knowledge / ?? 2?哪些字段适合创建索引？高频查询字段是否都应该建索引？
42. ?MySQL / knowledge / ?? 2?MySQL 中常见的索引失效原因有哪些？线上发现走了全表扫描时你会怎么排查？
43. ?MySQL / knowledge / ?? 2?什么是数据库事务？ACID 四个特性分别解决什么问题？
44. ?MySQL / knowledge / ?? 2?并发事务会带来哪些典型问题？脏读、不可重复读、幻读分别是什么？
45. ?MySQL / knowledge / ?? 3?不可重复读和幻读到底怎么区分？在 InnoDB 可重复读隔离级别下还需要担心幻读吗？
46. ?MySQL / knowledge / ?? 3?MySQL 的隔离级别完全是靠锁实现的吗？请说明 MVCC、快照读和当前读的关系。
47. ?MySQL / knowledge / ?? 2?表级锁和行级锁有什么区别？为什么有时写了行锁语义的 SQL 最后会锁住很多行？
48. ?MySQL / knowledge / ?? 3?当前读和快照读有什么区别？在库存扣减或防重复提交场景下应该用哪类读？
49. ?MySQL / knowledge / ?? 2?常见 SQL 优化手段有哪些？请按“定位问题、改写 SQL、调整索引、验证效果”的顺序回答。
50. ?MySQL / knowledge / ?? 2?如何分析一条 SQL 的性能？Explain 里哪些字段最值得关注？
51. ?MySQL / knowledge / ?? 3?MySQL 深度分页为什么会慢？如果接口需要翻到第 10000 页，你会怎么优化？
52. ?MySQL / knowledge / ?? 2?能不能把图片、文件这类二进制内容直接存到 MySQL？一般业务系统为什么更常把文件放对象存储？
53. ?MySQL / knowledge / ?? 2?MySQL 中如何存储 IP 地址？VARCHAR、整数和 VARBINARY 各有什么取舍？
54. ?Python / knowledge / ?? 2?Django QuerySet 里如何表达“不等于”？exclude() 和 ~Q(...) 有什么区别和使用场景？
55. ?Python / knowledge / ?? 3?Python 元类是什么？它和类、对象的关系是什么？真实项目里什么时候才值得使用元类？
56. ?Python / knowledge / ?? 1?Python 中 if __name__ == "__main__" 有什么作用？它和模块导入、脚本执行有什么关系？
57. ?Python / knowledge / ?? 2?Python 里的 yield 有什么作用？请说明生成器、迭代器协议、惰性求值，以及它适合哪些真实场景。
58. ?Python / knowledge / ?? 2?Django model 字段里的 null=True 和 blank=True 有什么区别？为什么字符串字段通常不建议设置 null=True？
59. ?Python / knowledge / ?? 3?Django 中如何组合多个 QuerySet？请比较 filter(Q(...))、union()、链式合并和 Python 层合并的适用场景。
60. ?Python / knowledge / ?? 3?Django 如何回退一次 migration？线上回退数据库迁移时你会关注哪些风险？
61. ?网络 / knowledge / ?? 2?为什么说 TCP 是面向字节流，UDP 是面向报文？这对粘包、拆包和应用层协议设计有什么影响？
62. ?网络 / knowledge / ?? 3?有了 HTTP，为什么很多微服务还会使用 RPC？请从协议语义、性能、治理和可观测性角度说明取舍。
63. ?网络 / knowledge / ?? 3?HTTPS 握手里的 RSA 和 ECDHE 有什么区别？为什么现代 TLS 更推荐 ECDHE？
64. ?MySQL / knowledge / ?? 2?SQL 和 NoSQL 数据库有什么区别？在真实项目里你会如何做技术选型？
65. ?MySQL / knowledge / ?? 3?设计一套业务数据库表结构时，你通常会按哪些步骤推进？如何兼顾范式、索引、扩展性和线上演进？
66. ?网络 / knowledge / ?? 2?HTTP 和 HTTPS 有什么区别？为什么 HTTPS 更安全，线上排查 HTTPS 问题时你会看哪些信号？
67. ?网络 / knowledge / ?? 3?TCP TIME_WAIT 为什么存在？TIME_WAIT 过多会不会出问题，线上你会如何判断和治理？
68. ?MySQL / knowledge / ?? 3?索引越多越好吗？请说明索引对查询、写入、存储、锁和执行计划的影响。
69. ?Redis / knowledge / ?? 3?线上 Redis 出现延迟升高，你如何区分热 key、大 key、慢命令和网络抖动？分别怎么治理？
70. ?Redis / system-design / ?? 3?订单详情接口使用 Redis 缓存时，如何设计数据库与缓存的一致性策略？如果更新后短时间读到旧值，你怎么排查和改进？
71. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
72. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
73. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
74. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
75. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
76. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
77. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
78. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
79. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
80. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
81. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
82. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
83. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
84. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
85. ?Python / knowledge / ?? 3?Python GIL 解决什么问题？为什么 IO 密集和 CPU 密集场景表现不同？
86. ?Python / knowledge / ?? 2?asyncio 适合哪些场景？事件循环、协程和阻塞调用使用不当会有什么问题？
87. ?Python / knowledge / ?? 2?Celery 任务如何设计幂等、重试、超时和死信处理？
88. ?Python / knowledge / ?? 3?Django ORM 中 N+1 查询如何产生？select_related 和 prefetch_related 如何选择？
89. ?Python / knowledge / ?? 2?Django transaction.atomic 使用时要注意哪些事务边界、锁和异常回滚问题？
90. ?Python / knowledge / ?? 2?FastAPI 服务接口慢时，你会如何区分框架开销、阻塞 IO、数据库和序列化问题？
91. ?Python / knowledge / ?? 3?Python 服务内存持续增长时，你会如何用 tracemalloc、objgraph 或 heapy 定位？
92. ?Python / knowledge / ?? 2?Python 装饰器的实现原理是什么？在鉴权、缓存和日志中使用时要注意什么？
93. ?Python / knowledge / ?? 2?with 上下文管理器如何工作？数据库连接、文件和锁为什么适合用它管理？
94. ?Python / knowledge / ?? 3?gunicorn/uwsgi 多进程模型如何影响连接池、内存和任务调度？
95. ?Python / knowledge / ?? 2?Python JSON 序列化成为瓶颈时，你会如何优化和验证？
96. ?Python / knowledge / ?? 2?Python 类型提示和 mypy 能解决什么问题？它们不能保证什么？
97. ?Python / system-design / ?? 3?Python 项目依赖冲突或供应链风险如何治理？
98. ?Python / knowledge / ?? 2?Python Web 服务中如何设计本地缓存和 Redis 缓存，避免穿透和脏数据？
99. ?Python / knowledge / ?? 2?Python 服务如何设计结构化日志、traceId 和异常堆栈，方便线上排查？
100. ?Python / knowledge / ?? 3?pytest fixture 如何组织复杂测试数据和依赖，避免测试互相污染？
101. ?系统设计 / knowledge / ?? 3?分布式锁适合解决什么问题？Redis 锁、数据库锁和 ZooKeeper 锁各有什么边界？
102. ?系统设计 / knowledge / ?? 2?分布式定时任务如何避免重复执行、漏执行和执行节点故障？
103. ?系统设计 / knowledge / ?? 3?如何抽象一套通用接口幂等组件，支持下单、支付回调和 MQ 消费？
104. ?系统设计 / system-design / ?? 3?消息队列如何保证同一业务实体的顺序性？分区、重试和死信会带来什么影响？
105. ?系统设计 / knowledge / ?? 3?高流量接口上线前如何设计缓存预热和失败回退，避免冷启动打爆数据库？
106. ?系统设计 / knowledge / ?? 2?账户或库存热点更新导致锁竞争时，你会如何拆分、排队或异步化？
107. ?系统设计 / system-design / ?? 3?读写分离场景下主从延迟会带来什么问题，业务如何兜底？
108. ?系统设计 / knowledge / ?? 2?业务配置如何支持灰度、生效范围、审计和快速回滚？
109. ?系统设计 / knowledge / ?? 3?后端接口如何设计兼容演进，避免客户端或调用方升级时大面积失败？
110. ?系统设计 / system-design / ?? 3?核心链路压测如何处理测试流量标记、数据隔离和下游保护？
111. ?系统设计 / knowledge / ?? 3?下游依赖故障时，如何设计缓存兜底、默认值、限流和用户提示？
112. ?系统设计 / knowledge / ?? 2?后端慢请求治理如何从网关、应用、数据库、缓存和下游依赖分层推进？
113. ?系统设计 / system-design / ?? 3?本地缓存、分布式缓存和 CDN 如何组合，如何处理一致性和失效？
114. ?系统设计 / knowledge / ?? 2?核心写操作如何设计审计日志，满足追踪、合规和问题定位？
115. ?系统设计 / knowledge / ?? 3?后端服务灰度发布如何处理流量染色、数据兼容和回滚？
116. ?系统设计 / system-design / ?? 3?批处理任务如何限速和分片，避免影响在线业务？
117. ?系统设计 / knowledge / ?? 3?高价值接口如何设计限流、防刷、验证码和风控联动？
118. ?系统设计 / knowledge / ?? 2?后端异常如何区分业务异常、系统异常、依赖异常和可重试异常？
119. ?系统设计 / system-design / ?? 3?统一错误码体系如何设计，既方便前端展示又方便服务端排障？
120. ?系统设计 / knowledge / ?? 2?生产数据订正如何设计审批、脚本、备份、验证和审计？

## 测试开发 / QA?qa?- 100 ?

1. ?测试 / knowledge / ?? 2?如果让你为一个下单接口设计测试方案，你会怎么拆功能测试、接口测试、异常场景和回归策略？
2. ?测试 / project / ?? 3?请讲一个你主导测试质量提升或自动化建设的项目，重点说明问题现状、你的方案、落地阻力和结果。
3. ?测试 / knowledge / ?? 2?拿到一个新需求后，你如何设计测试策略？请说明需求评审、风险分析、用例设计、自动化和上线验证。
4. ?测试 / knowledge / ?? 3?自动化测试经常出现偶发失败，你会如何判断是产品缺陷、环境问题、数据污染还是用例本身不稳定？
5. ?测试 / knowledge / ?? 3?你会如何设计一次接口性能测试？请说明压测目标、场景建模、数据准备、指标观察和瓶颈定位。
6. ?测试 / project / ?? 2?请讲一次你发现并推动解决复杂缺陷的经历，重点说明复现条件、定位证据、沟通推进和防复发措施。
7. ?DevOps / system-design / ?? 3?如何为生产发布流水线设计质量门禁？请说明代码检查、测试、制品一致性、安全扫描、审批和紧急发布例外。
8. ?测试 / system-design / ?? 3?拿到一个需求评审文档后，你会如何识别测试风险并设计测试策略？
9. ?测试 / knowledge / ?? 2?测试时间被压缩时，你如何给测试用例排序，保证核心风险先被覆盖？
10. ?测试 / knowledge / ?? 2?请说明等价类和边界值分析如何用于接口参数测试，常见遗漏点有哪些？
11. ?测试 / knowledge / ?? 3?上下游接口字段频繁变更时，你如何用契约测试降低联调和回归风险？
12. ?测试 / system-design / ?? 3?接口自动化、UI 自动化和单元测试分别适合覆盖什么问题，如何分层建设？
13. ?测试 / knowledge / ?? 2?UI 自动化用例经常失败但人工验证正常，你会如何治理稳定性？
14. ?测试 / knowledge / ?? 3?依赖服务不稳定或未开发完成时，你如何使用 Mock、Stub 或测试桩推进测试？
15. ?测试 / knowledge / ?? 2?自动化测试需要稳定可重复的数据，你会如何设计测试数据准备、清理和隔离？
16. ?测试 / system-design / ?? 3?下单、支付、退款这类写接口如何设计幂等性测试？
17. ?测试 / knowledge / ?? 3?如果一个库存扣减接口要支持并发下单，你会如何设计并发测试和数据校验？
18. ?测试 / knowledge / ?? 2?你会如何把业务流量模型转换成一次可执行的性能测试方案？
19. ?测试 / knowledge / ?? 2?系统上线前需要评估容量上限，你会如何设计压测、观察指标和瓶颈定位？
20. ?测试 / knowledge / ?? 3?长时间稳定性测试应该关注哪些指标，如何判断内存泄漏、连接泄漏或资源耗尽？
21. ?测试 / knowledge / ?? 2?你如何设计一次有控制的故障注入测试，验证系统降级和恢复能力？
22. ?测试 / knowledge / ?? 2?一次改动影响多个模块时，你如何设计冒烟、核心回归和全量回归策略？
23. ?测试 / knowledge / ?? 3?功能灰度发布后，测试侧应该如何设计验证点、监控指标和回滚条件？
24. ?测试 / knowledge / ?? 2?遇到偶发缺陷无法稳定复现时，你会如何收集证据并缩小范围？
25. ?测试 / project / ?? 3?你如何利用日志、链路追踪和数据库记录证明一个缺陷的根因？
26. ?测试 / knowledge / ?? 3?什么是测试左移？你会如何把质量活动前置到需求、设计和开发阶段？
27. ?测试 / knowledge / ?? 2?你会如何在 CI 流水线里设计测试门禁，避免低质量代码进入主干？
28. ?测试 / knowledge / ?? 2?接口返回字段新增、删除或语义变化时，你如何测试兼容性和调用方风险？
29. ?测试 / knowledge / ?? 3?测试一个写入数据库的业务流程时，除了接口返回，你还会校验哪些数据状态？
30. ?测试 / knowledge / ?? 2?异步消息链路如何测试消息重复、乱序、延迟和消费失败？
31. ?测试 / knowledge / ?? 2?定时任务和批处理任务如何测试补跑、重跑、失败恢复和数据一致性？
32. ?测试 / knowledge / ?? 3?支付回调场景如何覆盖签名校验、重复回调、延迟回调和金额不一致？
33. ?测试 / knowledge / ?? 2?后台系统的角色权限如何设计测试矩阵，避免水平越权和垂直越权？
34. ?测试 / knowledge / ?? 2?文件上传功能应该测试哪些安全、大小、格式、存储和访问控制问题？
35. ?测试 / knowledge / ?? 3?在普通业务测试中，你会如何补充基础安全测试，而不是完全依赖安全团队？
36. ?测试 / system-design / ?? 3?Web 系统需要做浏览器兼容性测试时，你如何确定覆盖范围和优先级？
37. ?测试 / knowledge / ?? 2?移动端 App 测试如何覆盖弱网、权限、安装升级、崩溃和机型兼容问题？
38. ?测试 / knowledge / ?? 3?新服务上线前，测试侧如何验收日志、指标、告警和链路追踪是否可用？
39. ?测试 / knowledge / ?? 2?测试环境经常不可用或数据混乱，你会如何推动环境治理？
40. ?测试 / knowledge / ?? 2?多团队共用测试环境时，如何避免依赖变更、数据污染和版本不一致影响测试？
41. ?测试 / knowledge / ?? 3?自动化测试中的 flaky 用例应该如何识别、分类和治理？
42. ?测试 / project / ?? 3?如何看待代码覆盖率、接口覆盖率和需求覆盖率？为什么覆盖率高不等于质量高？
43. ?测试 / knowledge / ?? 2?什么时候适合做探索式测试？如何保证它不是随便点点？
44. ?测试 / system-design / ?? 3?业务验收测试阶段，测试工程师如何帮助业务方设计验收范围和判断标准？
45. ?测试 / knowledge / ?? 2?发布后你会如何设计线上巡检，快速发现功能、数据和性能异常？
46. ?测试 / knowledge / ?? 2?如何测试告警规则是否真的能在故障发生时触发，并且不会产生大量噪声？
47. ?测试 / knowledge / ?? 3?报表或数据接口测试中，你如何验证数据完整性、准确性和口径一致？
48. ?测试 / knowledge / ?? 2?大促或活动前测试团队应该如何做风险评估、压测、预案和上线保障？
49. ?测试 / knowledge / ?? 2?请说明一份严谨测试计划应包含哪些内容，如何让研发、产品和运维都能执行？
50. ?测试 / knowledge / ?? 3?需求范围很大但测试资源有限时，你如何做风险评估并向团队说明取舍？
51. ?测试 / knowledge / ?? 2?如何判断一个自动化用例值得建设和维护，而不是增加长期成本？
52. ?测试 / knowledge / ?? 2?发布失败需要回滚时，测试侧如何验证回滚后的功能、数据和配置状态？
53. ?测试 / knowledge / ?? 3?微服务很多、接口频繁变更时，你会如何设计契约测试，避免上下游联调阶段才发现字段或语义不兼容？
54. ?测试 / knowledge / ?? 3?自动化和回归测试经常因为测试数据不稳定失败，你会如何设计测试数据管理方案？
55. ?测试 / project / ?? 2?请讲一次你负责上线前验收或发布质量把关的经历，重点说明准入标准、回归范围、风险沟通和上线后观察。
56. ?测试 / knowledge / ?? 3?普通业务测试中如何覆盖基础安全风险？请说明越权、输入校验、敏感信息、上传下载和接口重放的测试思路。
57. ?测试 / knowledge / ?? 3?需求评审时测试如何识别高风险变更，并输出可执行测试策略？
58. ?测试 / knowledge / ?? 2?如何评审测试用例质量，避免只覆盖正常流程和 happy path？
59. ?测试 / knowledge / ?? 2?设计接口自动化框架时，如何处理鉴权、数据、断言、报告和并发执行？
60. ?测试 / knowledge / ?? 3?UI 自动化如何设计 Page Object、等待机制和失败截图，降低维护成本？
61. ?测试 / knowledge / ?? 2?压测发现 TPS 上不去时，测试如何配合定位瓶颈而不是只给结果？
62. ?测试 / knowledge / ?? 2?全链路压测如何避免污染生产数据，并保证流量模型可信？
63. ?测试 / knowledge / ?? 3?长稳压测如何发现内存泄漏、连接泄漏、日志暴涨和性能衰退？
64. ?测试 / knowledge / ?? 2?Mock 平台如何支持契约、动态响应、异常注入和调用记录？
65. ?测试 / knowledge / ?? 2?如何基于代码变更、接口依赖和历史缺陷做精准回归？
66. ?测试 / knowledge / ?? 3?需求覆盖率、代码覆盖率和接口覆盖率如何结合判断测试充分性？
67. ?测试 / knowledge / ?? 2?如何定义 P0/P1/P2 缺陷，并在上线压力下做风险沟通？
68. ?测试 / project / ?? 3?缺陷复盘时如何区分需求遗漏、设计缺陷、编码问题和测试遗漏？
69. ?测试 / knowledge / ?? 3?测试团队如何用漏测率、回归耗时、缺陷密度和发布成功率衡量质量？
70. ?测试 / knowledge / ?? 2?测试工具如何平台化，避免只服务单个项目或变成没人维护的脚本？
71. ?测试 / knowledge / ?? 2?灰度期间如何验证功能正确性、用户影响和回滚条件？
72. ?测试 / project / ?? 3?线上问题发生后，测试如何复盘为什么没拦住，并改进测试策略？
73. ?测试 / knowledge / ?? 2?SaaS 多租户系统如何测试数据隔离、权限隔离和配置差异？
74. ?测试 / knowledge / ?? 2?数据报表如何验证口径、延迟、权限和导出一致性？
75. ?测试 / knowledge / ?? 3?搜索功能如何测试召回、排序、同义词、纠错和性能？
76. ?测试 / knowledge / ?? 2?推荐系统如何测试策略效果、曝光埋点、冷启动和降级？
77. ?测试 / knowledge / ?? 2?消息队列场景如何测试重复消费、顺序、延迟和死信？
78. ?测试 / knowledge / ?? 3?缓存更新策略如何测试脏读、穿透、击穿和回源压力？
79. ?测试 / knowledge / ?? 2?数据库迁移上线前后，测试如何验证数据一致性和回滚风险？
80. ?测试 / knowledge / ?? 2?配置中心变更如何测试灰度、回滚、生效范围和权限？
81. ?测试 / knowledge / ?? 3?复杂审批流如何覆盖角色、状态流转、撤回、加签和超时？
82. ?测试 / knowledge / ?? 2?风控规则如何测试命中、误伤、白名单和策略灰度？
83. ?测试 / knowledge / ?? 2?新系统上线前，测试如何验收日志字段、traceId 和错误码是否可排查？
84. ?测试 / knowledge / ?? 3?测试如何验证告警规则、通知链路和值班响应真的有效？
85. ?测试 / knowledge / ?? 2?老客户端兼容新服务端时，测试如何覆盖协议、字段和功能降级？
86. ?测试 / knowledge / ?? 2?弱网、超时和重试场景如何设计自动化或半自动化验证？
87. ?测试 / knowledge / ?? 3?移动端崩溃如何复现、收集堆栈并推动定位？
88. ?测试 / knowledge / ?? 2?App 安装、升级、回滚和数据迁移要测试哪些风险？
89. ?测试 / knowledge / ?? 2?测试环境使用生产数据时，如何验证脱敏有效且不影响测试？
90. ?测试 / knowledge / ?? 3?复杂角色权限如何设计权限矩阵和自动化校验？
91. ?测试 / knowledge / ?? 2?账单或结算系统如何测试金额精度、舍入、对账和异常冲正？
92. ?测试 / knowledge / ?? 2?库存系统如何测试并发扣减、锁、超卖和补偿？
93. ?测试 / knowledge / ?? 3?订单状态机如何测试合法流转、非法流转、并发和补偿？
94. ?测试 / knowledge / ?? 2?退款链路如何测试部分退款、重复回调、金额校验和账务一致？
95. ?测试 / knowledge / ?? 2?多服务测试环境版本不一致时，如何识别影响并降低联调成本？
96. ?测试 / knowledge / ?? 3?探索式测试如何写测试章程，保证目标、范围和发现可追踪？
97. ?测试 / knowledge / ?? 2?自动化失败后如何自动分诊是环境、数据、脚本还是产品缺陷？
98. ?测试 / knowledge / ?? 2?如何定义测试准入和准出标准，让质量门禁可执行？
99. ?测试 / knowledge / ?? 3?当研发认为测试阻碍发布时，你如何用事实和指标推进质量改进？
100. ?测试 / project / ?? 3?请讲一次你作为测试负责人协调多团队完成复杂项目测试的经历。

## 运维 / DBA / 网络?ops?- 100 ?

1. ?运维 / knowledge / ?? 2?一台 Linux 服务器突然 CPU 飙高、接口超时，你会按什么顺序排查？请说明你会看哪些系统和业务信号。
2. ?运维 / project / ?? 3?请讲一个你处理过的线上故障或重大稳定性问题，重点说清告警发现、排查链路、止血动作和后续治理。
3. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
4. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
5. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
6. ?运维 / knowledge / ?? 2?Linux load average 很高时一定是 CPU 不够吗？你会如何定位是 CPU、IO、锁等待还是进程堆积？
7. ?运维 / knowledge / ?? 3?Nginx 网关大量 502/504 时，你会如何区分上游服务异常、连接池耗尽、超时配置和网络问题？
8. ?运维 / knowledge / ?? 3?你会如何设计数据库备份和恢复方案？请说明全量、增量、binlog、恢复演练、RPO/RTO 和权限隔离。
9. ?DevOps / project / ?? 3?请讲一次你参与线上故障处理的经历，重点说明告警发现、影响评估、止血动作、根因定位、复盘和自动化改进。
10. ?DevOps / knowledge / ?? 3?Kubernetes 中如何设计一次安全的应用发布？请说明 readiness、liveness、滚动更新、回滚和灰度验证。
11. ?DevOps / knowledge / ?? 2?配置和密钥应该如何管理？为什么不应该把数据库密码、Token 或私钥直接提交到代码仓库？
12. ?运维 / project / ?? 3?Linux 主机 CPU 使用率突然升高，你会如何区分用户态、内核态、iowait 和应用热点？
13. ?运维 / knowledge / ?? 2?load average 很高但 CPU 使用率不高时，你会如何定位是 IO 等待、锁等待还是进程堆积？
14. ?运维 / knowledge / ?? 2?服务器内存持续上涨时，你如何区分应用泄漏、页缓存增长和容器限制导致的问题？
15. ?运维 / knowledge / ?? 3?线上出现 OOM Killer 时，你会如何定位被杀进程、内存来源和后续治理方案？
16. ?运维 / knowledge / ?? 2?磁盘空间突然写满导致服务异常，你会如何止血、定位增长来源并防止复发？
17. ?运维 / knowledge / ?? 2?磁盘空间还有剩余但无法创建文件，你会如何排查 inode 耗尽问题？
18. ?运维 / knowledge / ?? 3?接口变慢同时 iowait 升高，你会如何定位是磁盘、文件系统还是数据库 IO 问题？
19. ?运维 / knowledge / ?? 2?跨机房访问延迟突然升高，你会如何从链路、DNS、路由和服务端指标定位？
20. ?运维 / system-design / ?? 3?服务偶发域名解析失败或解析很慢，你会如何排查 DNS 缓存、解析链路和降级方案？
21. ?运维 / knowledge / ?? 3?HTTPS 证书即将过期或已经过期，你会如何设计监控、轮换和应急处理？
22. ?运维 / knowledge / ?? 2?Nginx 大量 502 或 504 时，你会如何区分上游异常、超时配置和网络问题？
23. ?运维 / knowledge / ?? 2?负载均衡误判健康状态导致流量打到异常节点，你会如何排查和改进健康检查？
24. ?运维 / knowledge / ?? 3?上线后服务端口不通，你会如何排查安全组、防火墙、监听地址和路由问题？
25. ?运维 / knowledge / ?? 2?服务连接数突然升高或 TIME_WAIT 很多，你会如何判断风险和治理方向？
26. ?运维 / knowledge / ?? 2?线上报 too many open files，你会如何确认是泄漏、限额过小还是短连接过多？
27. ?运维 / knowledge / ?? 3?定时任务在高峰期拖垮系统，你会如何排查、隔离和重新设计调度策略？
28. ?运维 / system-design / ?? 3?日志没有正确轮转导致磁盘写满，你会如何设计日志保留、压缩和告警？
29. ?运维 / project / ?? 3?你会如何设计数据库备份和恢复演练，保证 RPO/RTO 可验证而不是写在文档里？
30. ?运维 / knowledge / ?? 3?数据库主从延迟升高影响读请求，你会如何定位原因并设计读写策略？
31. ?运维 / knowledge / ?? 2?数据库慢查询突然增多，运维侧如何配合研发定位索引、连接池和资源瓶颈？
32. ?运维 / knowledge / ?? 2?Redis 内存逼近上限或延迟升高时，你会如何从大 key、热 key、淘汰和持久化排查？
33. ?运维 / knowledge / ?? 3?Kafka 消费堆积时，你会如何判断是生产突增、消费者慢还是分区设计问题？
34. ?运维 / knowledge / ?? 2?Kubernetes Pod 反复 CrashLoopBackOff，你会如何从事件、日志、探针和资源限制定位？
35. ?运维 / knowledge / ?? 2?Kubernetes 节点出现 MemoryPressure 或 DiskPressure 时，你会如何处理和预防？
36. ?运维 / knowledge / ?? 3?容器内服务被限流或 OOM，你会如何判断 request、limit 和真实负载是否匹配？
37. ?运维 / knowledge / ?? 2?一次发布后错误率升高，运维侧如何判断继续观察、限流、回滚还是切流？
38. ?运维 / knowledge / ?? 2?你会如何设计主机、应用和业务告警，避免漏报和告警风暴？
39. ?运维 / knowledge / ?? 3?重大故障处理中，你如何组织分工、同步信息、控制变更和推动复盘？
40. ?运维 / knowledge / ?? 2?业务流量持续增长时，你如何做容量评估、扩容计划和成本控制？
41. ?运维 / knowledge / ?? 2?主机房不可用时，你会如何设计和验证灾备切换流程？
42. ?运维 / knowledge / ?? 3?请说明 RPO 和 RTO 的区别，以及它们如何影响备份、复制和切换方案。
43. ?运维 / knowledge / ?? 2?服务器和数据库权限如何做最小化管理，避免共享账号和越权操作？
44. ?运维 / knowledge / ?? 2?你会如何加固 SSH 登录，降低暴力破解和凭证泄露风险？
45. ?运维 / knowledge / ?? 3?生产环境操作审计应该记录什么，如何保证问题发生后可以追溯？
46. ?运维 / project / ?? 3?多台服务器时间不一致会造成哪些问题，你会如何监控和治理 NTP？
47. ?运维 / knowledge / ?? 2?多环境配置不一致导致问题反复出现，你会如何发现和治理配置漂移？
48. ?运维 / knowledge / ?? 3?CMDB 数据不准会影响哪些运维动作，你会如何保证资产和服务关系可信？
49. ?运维 / knowledge / ?? 2?生产系统安全补丁如何规划灰度、回滚和兼容性验证？
50. ?运维 / knowledge / ?? 2?夜间批处理任务失败影响第二天业务，你会如何设计告警、补跑和依赖控制？
51. ?运维 / knowledge / ?? 3?如何把 SLO 用到运维工作中，而不是只看 CPU、内存这类资源指标？
52. ?运维 / knowledge / ?? 3?线上访问某域名偶发失败或解析到错误地址，你会如何排查 DNS 缓存、权威解析、递归解析、TTL 和客户端配置？
53. ?运维 / knowledge / ?? 2?服务器磁盘告警时，如何区分磁盘空间满、inode 满、日志暴涨和文件已删除但空间未释放？
54. ?运维 / knowledge / ?? 3?MySQL 主从延迟突然升高时，你会如何判断是主库写入过大、从库 SQL 线程慢、网络问题还是大事务导致？
55. ?运维 / system-design / ?? 3?大促前你会如何做容量评估和保障？请说明流量预测、压测、扩容、限流降级、值守和回滚预案。
56. ?DevOps / knowledge / ?? 3?为什么要做基础设施即代码？当云资源被人工改动导致配置漂移时，你会如何发现、治理和防止复发？
57. ?DevOps / knowledge / ?? 3?SLO、SLI 和错误预算分别是什么？你会如何用它们平衡发布速度和系统稳定性？
58. ?DevOps / knowledge / ?? 3?容器镜像从构建到上线有哪些供应链安全风险？你会如何做基础镜像治理、漏洞扫描、签名和准入控制？
59. ?DevOps / system-design / ?? 3?云资源成本持续上涨时，你会如何建设成本可观测性和治理机制，同时避免影响稳定性？
60. ?运维 / system-design / ?? 3?生产服务器为什么要通过堡垒机或统一入口操作？你会如何设计权限、审计、命令记录和紧急访问流程？
61. ?运维 / knowledge / ?? 3?服务器磁盘故障时，RAID0/1/5/10 的恢复能力和性能取舍是什么？
62. ?运维 / knowledge / ?? 2?Linux LVM 如何在线扩容？扩容前后需要验证哪些文件系统和备份风险？
63. ?运维 / knowledge / ?? 2?接口超时但服务日志正常时，你会如何用 tcpdump/Wireshark 抓包定位问题？
64. ?运维 / knowledge / ?? 3?服务器遭遇 SYN Flood 或连接洪泛时，你会看哪些指标并如何缓解？
65. ?运维 / knowledge / ?? 2?Nginx 如何配置连接数限制和请求速率限制？误配置会带来什么影响？
66. ?运维 / knowledge / ?? 2?Nginx 反向代理缓存如何设计缓存键、过期、刷新和穿透防护？
67. ?运维 / knowledge / ?? 3?Keepalived 和 VIP 如何实现高可用？脑裂和误切换如何防范？
68. ?运维 / knowledge / ?? 2?日志从主机到平台采集丢失或延迟时，你会如何排查 Agent、队列和存储？
69. ?运维 / system-design / ?? 3?Prometheus 指标基数过高会造成什么问题？如何治理 label 和保留周期？
70. ?运维 / knowledge / ?? 3?如何设计一套能真正用于排障的 Grafana 看板，而不是堆满无关指标？
71. ?运维 / knowledge / ?? 2?生产堡垒机如何设计授权、审计、命令记录和紧急访问？
72. ?运维 / knowledge / ?? 2?DBA 如何设计生产数据库账号权限、审批和审计，避免共享 root 账号？
73. ?运维 / knowledge / ?? 3?MySQL 如何基于全量备份和 binlog 做时间点恢复？演练时要验证什么？
74. ?运维 / knowledge / ?? 2?备份文件如何加密、校验、异地存储和定期恢复演练？
75. ?运维 / knowledge / ?? 2?Redis Sentinel 主从切换时可能出现哪些风险，如何验证客户端正确重连？
76. ?运维 / knowledge / ?? 3?Redis Cluster 扩容、reshard 和故障转移时要注意哪些运维风险？
77. ?运维 / system-design / ?? 3?Elasticsearch 集群 yellow/red 状态如何排查，分片和磁盘水位如何治理？
78. ?运维 / knowledge / ?? 2?Kafka broker 宕机后如何判断 ISR、leader 迁移、数据丢失和消费影响？
79. ?运维 / knowledge / ?? 3?RabbitMQ 消息堆积时，你会如何判断消费者、路由、ack 和磁盘瓶颈？
80. ?运维 / knowledge / ?? 2?Kubernetes 节点磁盘被镜像和容器日志占满时如何治理？
81. ?运维 / knowledge / ?? 2?Kubernetes 集群内服务解析慢或失败时，你会如何排查 CoreDNS？
82. ?运维 / knowledge / ?? 3?Kubernetes Ingress 访问异常时如何区分 Ingress、Service、Endpoint 和 Pod 问题？
83. ?运维 / knowledge / ?? 2?Kubernetes taint/toleration 和 nodeSelector 如何用于节点隔离？误用有什么风险？
84. ?运维 / knowledge / ?? 2?Kubernetes PVC 挂载失败或读写慢时，你会如何排查存储类、节点和权限？
85. ?运维 / system-design / ?? 3?服务器时间漂移会影响哪些业务？NTP/Chrony 如何监控和治理？
86. ?运维 / knowledge / ?? 2?高并发服务上线前，哪些 Linux 内核参数可能需要评估，为什么不能盲目套模板？
87. ?运维 / knowledge / ?? 2?应用连接池耗尽时，运维侧如何从数据库、网络和应用指标协助定位？
88. ?运维 / knowledge / ?? 3?轮询、最少连接、IP Hash 和权重负载均衡各适合什么场景？
89. ?运维 / knowledge / ?? 2?WAF 上线后误拦正常请求，你会如何分析规则、日志和回滚策略？
90. ?运维 / knowledge / ?? 2?遭遇 DDoS 攻击时，运维如何判断攻击类型、牵引清洗和保护核心服务？
91. ?运维 / knowledge / ?? 3?服务 CMDB 信息不准确时会影响哪些故障处理和发布动作？如何治理？
92. ?运维 / knowledge / ?? 2?生产巡检自动化应该检查哪些内容，如何避免巡检脚本自身造成风险？
93. ?运维 / knowledge / ?? 2?机房断电或网络中断时，运维如何执行应急预案和恢复验证？
94. ?运维 / knowledge / ?? 3?如何为 CPU、内存、磁盘、连接数、队列积压设置容量水位和扩容阈值？
95. ?运维 / knowledge / ?? 2?多域名多环境证书轮换如何自动化，避免过期和替换错误？
96. ?运维 / knowledge / ?? 2?为什么核心系统发布需要窗口和冻结策略？例外发布如何审批？
97. ?运维 / knowledge / ?? 3?运维 Runbook 如何编写和演练，保证新人值班也能执行？
98. ?运维 / knowledge / ?? 2?云厂商或第三方服务故障时，运维如何判断影响范围并执行切换？
99. ?运维 / knowledge / ?? 2?服务器和云资源成本持续上涨时，运维如何定位浪费和优化？
100. ?运维 / knowledge / ?? 3?一次生产配置变更造成故障时，你会如何通过审计追踪责任和改进流程？

## DevOps / SRE?devops?- 153 ?

1. ?DevOps / knowledge / ?? 2?你会如何设计一个从代码提交到生产发布的 CI/CD 流水线？请说明构建、测试、发布、回滚和权限控制。
2. ?DevOps / system-design / ?? 3?如果让你建设一套面向业务团队的可观测性平台，你会怎么设计日志、指标、链路追踪和告警降噪？
3. ?Redis / knowledge / ?? 3?Redis RDB、AOF、主从复制、哨兵和 Cluster 分别解决什么问题？线上选择时你会关注哪些风险？
4. ?操作系统 / knowledge / ?? 3?线上服务 CPU 使用率突然升高，你会如何从系统层和应用层定位？
5. ?操作系统 / knowledge / ?? 3?Linux 机器出现 OOM 或内存持续上涨时，你会怎么区分应用内存泄漏、页缓存增长和容器限制问题？
6. ?操作系统 / knowledge / ?? 2?线上服务报 too many open files 时，文件描述符是什么？你会如何定位泄漏还是限额过小？
7. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
8. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
9. ?运维 / knowledge / ?? 2?Linux load average 很高时一定是 CPU 不够吗？你会如何定位是 CPU、IO、锁等待还是进程堆积？
10. ?运维 / knowledge / ?? 3?Nginx 网关大量 502/504 时，你会如何区分上游服务异常、连接池耗尽、超时配置和网络问题？
11. ?运维 / knowledge / ?? 3?你会如何设计数据库备份和恢复方案？请说明全量、增量、binlog、恢复演练、RPO/RTO 和权限隔离。
12. ?DevOps / project / ?? 3?请讲一次你参与线上故障处理的经历，重点说明告警发现、影响评估、止血动作、根因定位、复盘和自动化改进。
13. ?DevOps / knowledge / ?? 3?Kubernetes 中如何设计一次安全的应用发布？请说明 readiness、liveness、滚动更新、回滚和灰度验证。
14. ?DevOps / knowledge / ?? 2?配置和密钥应该如何管理？为什么不应该把数据库密码、Token 或私钥直接提交到代码仓库？
15. ?DevOps / system-design / ?? 3?如何为生产发布流水线设计质量门禁？请说明代码检查、测试、制品一致性、安全扫描、审批和紧急发布例外。
16. ?安全 / project / ?? 2?如果发现生产 API Key 被提交到了 Git 仓库，你会如何评估影响、止血、轮换和防止再次发生？
17. ?运维 / project / ?? 3?Linux 主机 CPU 使用率突然升高，你会如何区分用户态、内核态、iowait 和应用热点？
18. ?运维 / knowledge / ?? 2?load average 很高但 CPU 使用率不高时，你会如何定位是 IO 等待、锁等待还是进程堆积？
19. ?运维 / knowledge / ?? 2?服务器内存持续上涨时，你如何区分应用泄漏、页缓存增长和容器限制导致的问题？
20. ?运维 / knowledge / ?? 3?线上出现 OOM Killer 时，你会如何定位被杀进程、内存来源和后续治理方案？
21. ?运维 / knowledge / ?? 2?磁盘空间突然写满导致服务异常，你会如何止血、定位增长来源并防止复发？
22. ?运维 / knowledge / ?? 2?磁盘空间还有剩余但无法创建文件，你会如何排查 inode 耗尽问题？
23. ?运维 / knowledge / ?? 3?接口变慢同时 iowait 升高，你会如何定位是磁盘、文件系统还是数据库 IO 问题？
24. ?运维 / knowledge / ?? 2?跨机房访问延迟突然升高，你会如何从链路、DNS、路由和服务端指标定位？
25. ?运维 / system-design / ?? 3?服务偶发域名解析失败或解析很慢，你会如何排查 DNS 缓存、解析链路和降级方案？
26. ?运维 / knowledge / ?? 3?HTTPS 证书即将过期或已经过期，你会如何设计监控、轮换和应急处理？
27. ?运维 / knowledge / ?? 2?Nginx 大量 502 或 504 时，你会如何区分上游异常、超时配置和网络问题？
28. ?运维 / knowledge / ?? 2?负载均衡误判健康状态导致流量打到异常节点，你会如何排查和改进健康检查？
29. ?运维 / knowledge / ?? 3?上线后服务端口不通，你会如何排查安全组、防火墙、监听地址和路由问题？
30. ?运维 / knowledge / ?? 2?服务连接数突然升高或 TIME_WAIT 很多，你会如何判断风险和治理方向？
31. ?运维 / knowledge / ?? 2?线上报 too many open files，你会如何确认是泄漏、限额过小还是短连接过多？
32. ?运维 / knowledge / ?? 3?定时任务在高峰期拖垮系统，你会如何排查、隔离和重新设计调度策略？
33. ?运维 / system-design / ?? 3?日志没有正确轮转导致磁盘写满，你会如何设计日志保留、压缩和告警？
34. ?运维 / project / ?? 3?你会如何设计数据库备份和恢复演练，保证 RPO/RTO 可验证而不是写在文档里？
35. ?运维 / knowledge / ?? 3?数据库主从延迟升高影响读请求，你会如何定位原因并设计读写策略？
36. ?运维 / knowledge / ?? 2?数据库慢查询突然增多，运维侧如何配合研发定位索引、连接池和资源瓶颈？
37. ?运维 / knowledge / ?? 2?Redis 内存逼近上限或延迟升高时，你会如何从大 key、热 key、淘汰和持久化排查？
38. ?运维 / knowledge / ?? 3?Kafka 消费堆积时，你会如何判断是生产突增、消费者慢还是分区设计问题？
39. ?运维 / knowledge / ?? 2?Kubernetes Pod 反复 CrashLoopBackOff，你会如何从事件、日志、探针和资源限制定位？
40. ?运维 / knowledge / ?? 2?Kubernetes 节点出现 MemoryPressure 或 DiskPressure 时，你会如何处理和预防？
41. ?运维 / knowledge / ?? 3?容器内服务被限流或 OOM，你会如何判断 request、limit 和真实负载是否匹配？
42. ?运维 / knowledge / ?? 2?一次发布后错误率升高，运维侧如何判断继续观察、限流、回滚还是切流？
43. ?运维 / knowledge / ?? 2?你会如何设计主机、应用和业务告警，避免漏报和告警风暴？
44. ?运维 / knowledge / ?? 3?重大故障处理中，你如何组织分工、同步信息、控制变更和推动复盘？
45. ?运维 / knowledge / ?? 2?业务流量持续增长时，你如何做容量评估、扩容计划和成本控制？
46. ?运维 / knowledge / ?? 2?主机房不可用时，你会如何设计和验证灾备切换流程？
47. ?运维 / knowledge / ?? 3?请说明 RPO 和 RTO 的区别，以及它们如何影响备份、复制和切换方案。
48. ?运维 / knowledge / ?? 2?服务器和数据库权限如何做最小化管理，避免共享账号和越权操作？
49. ?运维 / knowledge / ?? 2?你会如何加固 SSH 登录，降低暴力破解和凭证泄露风险？
50. ?运维 / knowledge / ?? 3?生产环境操作审计应该记录什么，如何保证问题发生后可以追溯？
51. ?运维 / project / ?? 3?多台服务器时间不一致会造成哪些问题，你会如何监控和治理 NTP？
52. ?运维 / knowledge / ?? 2?多环境配置不一致导致问题反复出现，你会如何发现和治理配置漂移？
53. ?运维 / knowledge / ?? 3?CMDB 数据不准会影响哪些运维动作，你会如何保证资产和服务关系可信？
54. ?运维 / knowledge / ?? 2?生产系统安全补丁如何规划灰度、回滚和兼容性验证？
55. ?运维 / knowledge / ?? 2?夜间批处理任务失败影响第二天业务，你会如何设计告警、补跑和依赖控制？
56. ?运维 / knowledge / ?? 3?如何把 SLO 用到运维工作中，而不是只看 CPU、内存这类资源指标？
57. ?运维 / knowledge / ?? 3?线上访问某域名偶发失败或解析到错误地址，你会如何排查 DNS 缓存、权威解析、递归解析、TTL 和客户端配置？
58. ?运维 / knowledge / ?? 2?服务器磁盘告警时，如何区分磁盘空间满、inode 满、日志暴涨和文件已删除但空间未释放？
59. ?运维 / knowledge / ?? 3?MySQL 主从延迟突然升高时，你会如何判断是主库写入过大、从库 SQL 线程慢、网络问题还是大事务导致？
60. ?运维 / system-design / ?? 3?大促前你会如何做容量评估和保障？请说明流量预测、压测、扩容、限流降级、值守和回滚预案。
61. ?DevOps / knowledge / ?? 3?为什么要做基础设施即代码？当云资源被人工改动导致配置漂移时，你会如何发现、治理和防止复发？
62. ?DevOps / knowledge / ?? 3?SLO、SLI 和错误预算分别是什么？你会如何用它们平衡发布速度和系统稳定性？
63. ?DevOps / knowledge / ?? 3?容器镜像从构建到上线有哪些供应链安全风险？你会如何做基础镜像治理、漏洞扫描、签名和准入控制？
64. ?DevOps / system-design / ?? 3?云资源成本持续上涨时，你会如何建设成本可观测性和治理机制，同时避免影响稳定性？
65. ?数据 / knowledge / ?? 2?离线调度任务经常延迟产出，你会如何分析依赖链路、关键路径、资源队列和上游晚到数据？
66. ?安全 / system-design / ?? 3?如果要建设一套安全审计日志体系，你会记录哪些事件，如何保证不可抵赖、可检索、低噪声和隐私合规？
67. ?安全 / knowledge / ?? 3?登录、验证码或短信接口被刷时，你会如何设计反滥用策略，同时避免误伤正常用户？
68. ?DevOps / system-design / ?? 3?你如何为核心服务设计 SLO 和错误预算，并用它指导发布节奏和稳定性投入？
69. ?DevOps / knowledge / ?? 3?告警太多导致值班疲劳时，你会如何做告警分级、去重、抑制和升级策略？
70. ?DevOps / knowledge / ?? 2?一次线上重大故障发生后，SRE 应该如何组织事故响应、沟通、止血和复盘？
71. ?DevOps / system-design / ?? 3?如果一个服务错误预算提前耗尽，你会如何处理后续发布、治理优先级和团队沟通？
72. ?DevOps / system-design / ?? 3?你会如何设计金丝雀发布的流量分配、指标观察、自动回滚和人工确认条件？
73. ?DevOps / knowledge / ?? 2?蓝绿发布适合哪些场景？如何处理数据库变更、缓存预热和快速回切？
74. ?DevOps / knowledge / ?? 3?Kubernetes 滚动更新中如何避免不可用窗口、容量不足和新旧版本不兼容？
75. ?DevOps / knowledge / ?? 2?readiness、liveness 和 startup probe 分别解决什么问题，配置错误会造成哪些线上风险？
76. ?DevOps / system-design / ?? 3?如何设计 Kubernetes HPA 指标和扩缩容策略，避免流量抖动时反复扩缩？
77. ?DevOps / knowledge / ?? 2?Kubernetes request 和 limit 如何影响调度、稳定性和成本？设置不合理会有什么后果？
78. ?DevOps / system-design / ?? 3?节点出现 MemoryPressure 或 DiskPressure 导致 Pod 被驱逐时，你会如何定位和治理？
79. ?DevOps / system-design / ?? 3?服务网格能解决哪些治理问题？引入 Istio/Envoy 时要关注哪些复杂度和故障面？
80. ?DevOps / knowledge / ?? 2?配置中心如何支持动态配置、灰度配置、审计、回滚和敏感配置隔离？
81. ?DevOps / system-design / ?? 3?生产密钥需要定期轮换时，你会如何设计自动化流程，避免服务中断？
82. ?DevOps / knowledge / ?? 2?制品仓库如何保证构建产物可追溯、不可篡改、可回滚，并控制依赖污染？
83. ?DevOps / knowledge / ?? 2?CI/CD 中如何加入依赖漏洞、镜像扫描、许可证和制品签名门禁？
84. ?DevOps / knowledge / ?? 3?CI/CD 流水线变慢影响交付时，你会如何定位瓶颈并优化？
85. ?DevOps / system-design / ?? 3?发布流水线如何设计权限、审批和审计，避免任何人都能直接改生产？
86. ?DevOps / knowledge / ?? 2?一次发布失败后，你如何判断回滚、前滚修复还是降级？流水线需要准备哪些能力？
87. ?DevOps / knowledge / ?? 2?Terraform state 为什么重要？多人协作和生产环境中如何保护 state、锁和敏感输出？
88. ?DevOps / system-design / ?? 3?基础设施配置漂移如何发现和治理？紧急手工变更如何回写到代码？
89. ?DevOps / system-design / ?? 3?开发、测试、预发、生产环境差异很大时，你会如何治理环境一致性？
90. ?DevOps / knowledge / ?? 2?日志、指标和 Trace 成本快速上涨时，你会如何在可观测性和成本之间做取舍？
91. ?DevOps / knowledge / ?? 2?链路追踪采样率如何设置，既控制成本又保留故障定位能力？
92. ?DevOps / knowledge / ?? 2?为什么生产日志需要结构化？你会如何定义字段、traceId、错误码和敏感信息规则？
93. ?DevOps / knowledge / ?? 2?SRE 如何基于历史趋势和业务计划做容量预测，并避免过度扩容？
94. ?DevOps / system-design / ?? 3?如何建设统一限流降级能力，让业务团队能安全配置并快速止血？
95. ?DevOps / system-design / ?? 3?下游故障时重试可能放大事故，你会如何治理超时、重试、退避和熔断？
96. ?DevOps / knowledge / ?? 2?微服务调用链很长时，如何设置超时预算，避免局部慢拖垮全链路？
97. ?DevOps / system-design / ?? 3?你会如何设计一次生产前故障演练，验证降级、切流、告警和值班流程？
98. ?DevOps / system-design / ?? 3?混沌工程实验上线前需要哪些准入条件，如何避免演练本身造成事故？
99. ?DevOps / system-design / ?? 3?多 Kubernetes 集群部署时，如何设计发布编排、流量切换、配置同步和故障隔离？
100. ?DevOps / system-design / ?? 3?跨地域容灾体系中，SRE 如何设计健康检测、流量切换、数据恢复和演练？
101. ?DevOps / system-design / ?? 3?如何建设有效值班体系，避免告警无人响应或长期依赖少数专家？
102. ?DevOps / knowledge / ?? 2?一份可执行 Runbook 应包含哪些内容，如何保证它在故障时真的有用？
103. ?DevOps / knowledge / ?? 2?大促或关键时期为什么要做变更冻结？冻结期遇到紧急修复如何决策？
104. ?DevOps / knowledge / ?? 3?服务 owner 不清导致故障没人处理，你会如何建立服务目录、责任人和升级机制？
105. ?DevOps / system-design / ?? 3?发布完成后不能只看部署成功，你会如何设计自动化发布后验证？
106. ?DevOps / system-design / ?? 3?新服务上线生产前，SRE 会设置哪些准入标准？
107. ?DevOps / system-design / ?? 3?一次严谨的可靠性评审应该覆盖哪些方面，如何输出可追踪的改进项？
108. ?DevOps / knowledge / ?? 2?哪些运维操作适合自动化？如何避免自动化脚本误操作扩大事故？
109. ?DevOps / system-design / ?? 3?涉及数据库 schema 的发布，DevOps/SRE 如何设计兼容、灰度、回滚和锁表风险控制？
110. ?DevOps / knowledge / ?? 2?消息队列积压时，SRE 如何判断生产突增、消费慢、下游故障和扩容策略？
111. ?DevOps / system-design / ?? 3?高流量服务发布或扩容前，如何设计缓存预热，避免冷启动打爆数据库？
112. ?DevOps / knowledge / ?? 2?降级开关上线后，如何验证它真的能生效且不会误伤核心业务？
113. ?运维 / system-design / ?? 3?生产服务器为什么要通过堡垒机或统一入口操作？你会如何设计权限、审计、命令记录和紧急访问流程？
114. ?运维 / knowledge / ?? 3?服务器磁盘故障时，RAID0/1/5/10 的恢复能力和性能取舍是什么？
115. ?运维 / knowledge / ?? 2?Linux LVM 如何在线扩容？扩容前后需要验证哪些文件系统和备份风险？
116. ?运维 / knowledge / ?? 2?接口超时但服务日志正常时，你会如何用 tcpdump/Wireshark 抓包定位问题？
117. ?运维 / knowledge / ?? 3?服务器遭遇 SYN Flood 或连接洪泛时，你会看哪些指标并如何缓解？
118. ?运维 / knowledge / ?? 2?Nginx 如何配置连接数限制和请求速率限制？误配置会带来什么影响？
119. ?运维 / knowledge / ?? 2?Nginx 反向代理缓存如何设计缓存键、过期、刷新和穿透防护？
120. ?运维 / knowledge / ?? 3?Keepalived 和 VIP 如何实现高可用？脑裂和误切换如何防范？
121. ?运维 / knowledge / ?? 2?日志从主机到平台采集丢失或延迟时，你会如何排查 Agent、队列和存储？
122. ?运维 / system-design / ?? 3?Prometheus 指标基数过高会造成什么问题？如何治理 label 和保留周期？
123. ?运维 / knowledge / ?? 3?如何设计一套能真正用于排障的 Grafana 看板，而不是堆满无关指标？
124. ?运维 / knowledge / ?? 2?生产堡垒机如何设计授权、审计、命令记录和紧急访问？
125. ?运维 / knowledge / ?? 2?DBA 如何设计生产数据库账号权限、审批和审计，避免共享 root 账号？
126. ?运维 / knowledge / ?? 3?MySQL 如何基于全量备份和 binlog 做时间点恢复？演练时要验证什么？
127. ?运维 / knowledge / ?? 2?备份文件如何加密、校验、异地存储和定期恢复演练？
128. ?运维 / knowledge / ?? 2?Redis Sentinel 主从切换时可能出现哪些风险，如何验证客户端正确重连？
129. ?运维 / knowledge / ?? 3?Redis Cluster 扩容、reshard 和故障转移时要注意哪些运维风险？
130. ?运维 / system-design / ?? 3?Elasticsearch 集群 yellow/red 状态如何排查，分片和磁盘水位如何治理？
131. ?运维 / knowledge / ?? 2?Kafka broker 宕机后如何判断 ISR、leader 迁移、数据丢失和消费影响？
132. ?运维 / knowledge / ?? 3?RabbitMQ 消息堆积时，你会如何判断消费者、路由、ack 和磁盘瓶颈？
133. ?运维 / knowledge / ?? 2?Kubernetes 节点磁盘被镜像和容器日志占满时如何治理？
134. ?运维 / knowledge / ?? 2?Kubernetes 集群内服务解析慢或失败时，你会如何排查 CoreDNS？
135. ?运维 / knowledge / ?? 3?Kubernetes Ingress 访问异常时如何区分 Ingress、Service、Endpoint 和 Pod 问题？
136. ?运维 / knowledge / ?? 2?Kubernetes taint/toleration 和 nodeSelector 如何用于节点隔离？误用有什么风险？
137. ?运维 / knowledge / ?? 2?Kubernetes PVC 挂载失败或读写慢时，你会如何排查存储类、节点和权限？
138. ?运维 / system-design / ?? 3?服务器时间漂移会影响哪些业务？NTP/Chrony 如何监控和治理？
139. ?运维 / knowledge / ?? 2?高并发服务上线前，哪些 Linux 内核参数可能需要评估，为什么不能盲目套模板？
140. ?运维 / knowledge / ?? 2?应用连接池耗尽时，运维侧如何从数据库、网络和应用指标协助定位？
141. ?运维 / knowledge / ?? 3?轮询、最少连接、IP Hash 和权重负载均衡各适合什么场景？
142. ?运维 / knowledge / ?? 2?WAF 上线后误拦正常请求，你会如何分析规则、日志和回滚策略？
143. ?运维 / knowledge / ?? 2?遭遇 DDoS 攻击时，运维如何判断攻击类型、牵引清洗和保护核心服务？
144. ?运维 / knowledge / ?? 3?服务 CMDB 信息不准确时会影响哪些故障处理和发布动作？如何治理？
145. ?运维 / knowledge / ?? 2?生产巡检自动化应该检查哪些内容，如何避免巡检脚本自身造成风险？
146. ?运维 / knowledge / ?? 2?机房断电或网络中断时，运维如何执行应急预案和恢复验证？
147. ?运维 / knowledge / ?? 3?如何为 CPU、内存、磁盘、连接数、队列积压设置容量水位和扩容阈值？
148. ?运维 / knowledge / ?? 2?多域名多环境证书轮换如何自动化，避免过期和替换错误？
149. ?运维 / knowledge / ?? 2?为什么核心系统发布需要窗口和冻结策略？例外发布如何审批？
150. ?运维 / knowledge / ?? 3?运维 Runbook 如何编写和演练，保证新人值班也能执行？
151. ?运维 / knowledge / ?? 2?云厂商或第三方服务故障时，运维如何判断影响范围并执行切换？
152. ?运维 / knowledge / ?? 2?服务器和云资源成本持续上涨时，运维如何定位浪费和优化？
153. ?运维 / knowledge / ?? 3?一次生产配置变更造成故障时，你会如何通过审计追踪责任和改进流程？

## 数据开发 / 数仓?data?- 128 ?

1. ?数据 / knowledge / ?? 2?请说明你理解的数据仓库分层思路，以及 ODS、DWD、DWS、ADS 各层通常解决什么问题。
2. ?数据 / project / ?? 3?请讲一个你做过的数据链路或数仓建设项目，重点说明数据来源、调度依赖、质量保障和业务价值。
3. ?数据 / knowledge / ?? 2?你会如何设计数据质量监控？请说明完整性、唯一性、准确性、及时性、波动检测和告警处理闭环。
4. ?数据 / system-design / ?? 3?请设计一条实时订单指标链路，从业务库变更到实时看板，如何保证低延迟、可恢复和口径一致？
5. ?数据 / knowledge / ?? 3?什么是缓慢变化维？用户等级、门店归属这类维度变化时，数仓应该如何保留历史口径？
6. ?数据 / knowledge / ?? 3?Spark 或 Hive 任务出现数据倾斜时，通常有哪些表现？你会如何定位倾斜 key 并选择治理方案？
7. ?AI / knowledge / ?? 3?模型上线后效果逐渐变差，你会如何区分数据漂移、概念漂移、特征缺失、埋点变化和模型本身退化？
8. ?AI / knowledge / ?? 2?什么是训练数据泄漏？为什么离线指标异常高反而要警惕？你会如何发现和避免？
9. ?数据 / project / ?? 3?ODS、DWD、DWS、ADS 分层如何落地，怎样避免分层流于形式？
10. ?数据 / knowledge / ?? 2?请说明事实表、维度表和指标口径之间的关系，如何设计一个订单主题模型？
11. ?数据 / knowledge / ?? 2?设计事实表时为什么要先确定粒度？粒度不清会带来什么问题？
12. ?数据 / knowledge / ?? 3?用户等级或门店归属发生变化时，如何用缓慢变化维保留历史口径？
13. ?数据 / knowledge / ?? 2?多个团队对 GMV、活跃用户等指标口径不一致时，你会如何治理？
14. ?数据 / knowledge / ?? 2?你会如何设计数据质量规则，覆盖完整性、唯一性、准确性、及时性和波动？
15. ?数据 / knowledge / ?? 3?数据血缘在故障定位、影响分析和合规审计中如何发挥作用？
16. ?数据 / knowledge / ?? 2?元数据平台应该管理哪些信息，如何帮助开发和业务理解数据资产？
17. ?数据 / system-design / ?? 3?复杂数仓任务依赖很多时，你如何设计调度、失败重试和优先级？
18. ?数据 / knowledge / ?? 3?历史数据需要补跑时，你如何避免重复写入、口径不一致和下游雪崩？
19. ?数据 / knowledge / ?? 2?实时或离线链路遇到晚到数据时，你会如何处理窗口、补偿和指标修正？
20. ?数据 / knowledge / ?? 2?使用 CDC 同步业务库变更到数仓时，你会关注哪些一致性和恢复问题？
21. ?数据 / system-design / ?? 3?请设计一条从订单变更到实时看板的链路，说明低延迟和可恢复如何保证。
22. ?数据 / knowledge / ?? 2?流处理里 exactly-once 语义解决什么问题，真实落地时有哪些边界？
23. ?数据 / knowledge / ?? 2?Flink 中 watermark 和窗口如何处理乱序数据，迟到数据应该怎么补偿？
24. ?数据 / knowledge / ?? 3?埋点或订单事件可能重复上报时，你会如何设计去重键和幂等写入？
25. ?数据 / system-design / ?? 3?多个系统用户 ID 不一致时，你如何建设统一 ID 映射并处理合并拆分风险？
26. ?数据 / project / ?? 3?数据开发中如何处理个人敏感信息、脱敏、权限和审计？
27. ?数据 / knowledge / ?? 3?Hive 或湖仓表如何设计分区，避免扫描过大和小文件问题？
28. ?数据 / knowledge / ?? 2?数据湖或 Hive 表产生大量小文件时，会影响什么，你会如何治理？
29. ?数据 / system-design / ?? 3?Spark 任务出现数据倾斜时，你会如何发现倾斜 key 并选择处理方案？
30. ?数据 / knowledge / ?? 3?Spark 任务运行很慢时，你会从资源、shuffle、并行度和数据倾斜哪些方面排查？
31. ?数据 / knowledge / ?? 2?一个 Hive SQL 运行数小时，你会如何分析执行计划并优化？
32. ?数据 / knowledge / ?? 2?ClickHouse、Doris、Elasticsearch 和传统数仓分别适合哪些分析查询场景？
33. ?数据 / knowledge / ?? 3?湖仓一体解决什么问题，引入 Iceberg/Hudi/Delta 时要关注哪些成本？
34. ?数据 / knowledge / ?? 2?业务数据集市如何建设，既满足部门需求又避免指标烟囱？
35. ?数据 / knowledge / ?? 2?A/B 实验数据链路如何保证分流、曝光、转化和统计口径可信？
36. ?数据 / knowledge / ?? 3?用户行为漏斗分析如何建模，如何处理跨天、去重和事件乱序？
37. ?数据 / system-design / ?? 3?营销归因模型如何设计数据口径，常见误区有哪些？
38. ?数据 / knowledge / ?? 2?将数仓指标通过 API 服务输出时，如何设计缓存、权限、限流和口径版本？
39. ?数据 / knowledge / ?? 3?数据平台存储和计算成本快速上涨，你会如何定位浪费并治理？
40. ?数据 / knowledge / ?? 2?上游表字段变更时，如何让下游任务、报表和数据服务平滑演进？
41. ?数据 / knowledge / ?? 2?数据开发如何做单元测试、集成测试和数据回归测试？
42. ?数据 / knowledge / ?? 3?核心报表要求每天 9 点前产出，你如何设计 SLA、告警和降级方案？
43. ?数据 / project / ?? 3?客户、商品、门店等主数据如何治理，避免重复、冲突和历史口径混乱？
44. ?数据 / knowledge / ?? 2?交易数据对账如何设计，如何处理长短款、延迟到账和差异追踪？
45. ?数据 / system-design / ?? 3?财务类数据链路为什么要更重视可追溯、权限和不可变更审计？
46. ?数据 / knowledge / ?? 2?跨国家业务中，事件时间、业务日期和报表日期应该如何设计？
47. ?数据 / knowledge / ?? 2?数据保留、归档和删除策略如何设计，兼顾成本、合规和可恢复？
48. ?数据 / knowledge / ?? 3?机器学习特征表如何设计离线和在线一致性，避免训练服务偏差？
49. ?数据 / knowledge / ?? 2?前端或客户端埋点质量差时，你会如何建立埋点规范、验证和监控？
50. ?数据 / knowledge / ?? 2?数据平台如何做行列级权限、审批和访问审计？
51. ?数据 / knowledge / ?? 3?核心指标口径升级时，如何处理历史报表、同比环比和业务沟通？
52. ?AI / project / ?? 3?分类、排序或推荐模型上线前，你会如何选择离线指标和线上指标？
53. ?AI / knowledge / ?? 2?训练数据泄漏有哪些常见形式，为什么离线效果异常好反而要警惕？
54. ?AI / knowledge / ?? 2?样本类别极不均衡时，模型评估和训练策略应该如何调整？
55. ?AI / knowledge / ?? 3?特征工程如何从业务理解、统计稳定性和线上可用性三个角度设计？
56. ?AI / knowledge / ?? 2?训练集、验证集和测试集如何切分，时间序列场景为什么不能随机切？
57. ?AI / knowledge / ?? 2?交叉验证适合解决什么问题，为什么不能替代独立测试集和线上验证？
58. ?AI / knowledge / ?? 3?模型上线后效果下降时，你如何区分数据漂移、概念漂移和埋点变化？
59. ?AI / knowledge / ?? 2?模型线上 A/B 实验如何设计分流、样本量、指标和停止条件？
60. ?AI / system-design / ?? 3?推荐系统排序模型如何同时平衡点击率、转化、探索和长期体验？
61. ?AI / knowledge / ?? 3?搜索排序效果不好时，你会如何分析召回、排序、同义词和用户意图？
62. ?AI / knowledge / ?? 2?文本分类模型误判很多时，你会如何从数据、标签、特征和阈值排查？
63. ?AI / knowledge / ?? 2?向量 embedding 的质量如何评估，为什么相似度高不一定代表业务相关？
64. ?AI / knowledge / ?? 3?知识库问答中，文档切片大小和重叠策略如何影响召回和答案质量？
65. ?AI / knowledge / ?? 2?RAG 回答错误时，你如何判断是检索没召回、重排失败还是生成幻觉？
66. ?AI / knowledge / ?? 2?为什么 RAG 系统常需要 rerank，如何评估重排是否真的改善答案？
67. ?AI / knowledge / ?? 3?大模型回答很自信但事实错误时，你会如何设计引用、拒答和评估机制？
68. ?AI / system-design / ?? 3?提示词优化如何做系统评估，而不是只看几个主观案例？
69. ?AI / project / ?? 3?面向用户的大模型应用如何防止提示词注入、越权读取和不安全输出？
70. ?AI / knowledge / ?? 3?选择向量数据库时，你会关注索引类型、召回率、延迟、过滤和更新成本哪些问题？
71. ?AI / knowledge / ?? 2?什么时候应该做模型微调，什么时候用提示词、RAG 或规则更合适？
72. ?AI / knowledge / ?? 2?模型推理延迟过高时，你会从模型、服务、硬件和请求模式哪些层面优化？
73. ?AI / knowledge / ?? 3?在线推理中动态 batching 能解决什么问题，会带来哪些延迟和稳定性风险？
74. ?AI / knowledge / ?? 2?模型量化、蒸馏或剪枝能降低成本，但如何评估精度损失和边界案例？
75. ?AI / knowledge / ?? 2?GPU 利用率很低但服务延迟很高时，你会如何排查瓶颈？
76. ?AI / system-design / ?? 3?模型服务上线时如何设计版本管理、灰度、回滚和依赖兼容？
77. ?AI / knowledge / ?? 2?新模型灰度发布时，你会看哪些指标决定继续放量还是回滚？
78. ?AI / knowledge / ?? 2?模型监控除了 QPS 和延迟，还应该关注哪些效果、数据和业务指标？
79. ?AI / knowledge / ?? 3?训练流水线如何保证数据、代码、参数和模型产物可追溯？
80. ?AI / system-design / ?? 3?特征平台如何解决离线训练和在线推理特征不一致的问题？
81. ?AI / knowledge / ?? 2?MLOps 和普通 DevOps 有什么区别，模型生命周期多了哪些治理点？
82. ?AI / knowledge / ?? 3?标注数据质量差时，你会如何设计抽检、一致性评估和返工机制？
83. ?AI / knowledge / ?? 2?主动学习适合什么场景，如何选择样本让标注成本更有效？
84. ?AI / knowledge / ?? 2?模型对不同人群表现差异明显时，你会如何评估和治理偏差？
85. ?AI / knowledge / ?? 3?训练和推理过程中如何保护个人敏感信息，避免日志、样本和输出泄露？
86. ?AI / project / ?? 3?模型容易被异常输入攻击或诱导时，你会如何发现和增强鲁棒性？
87. ?AI / knowledge / ?? 2?业务方不信任模型结果时，你会如何提供可解释性和可审计证据？
88. ?AI / knowledge / ?? 3?多个模型实验并行时，你如何管理参数、数据版本、指标和结论？
89. ?AI / knowledge / ?? 2?超参数调优如何避免过拟合验证集和浪费大量计算资源？
90. ?AI / knowledge / ?? 2?模型训练集效果很好但线上效果差，你会如何判断过拟合和数据分布问题？
91. ?AI / knowledge / ?? 3?推荐系统遇到新用户、新商品冷启动时，你会如何设计策略？
92. ?AI / knowledge / ?? 2?用户反馈会影响后续训练时，如何避免反馈回路放大偏见或低质内容？
93. ?AI / knowledge / ?? 2?大模型应用成本快速上涨时，你会如何通过缓存、路由和模型分层优化？
94. ?AI / knowledge / ?? 3?如何设计多模型路由，让简单问题走小模型，复杂问题走大模型？
95. ?AI / knowledge / ?? 2?离线评估效果好但线上差，你如何排查特征、样本、延迟和业务策略差异？
96. ?AI / system-design / ?? 3?AI 系统低置信度时如何设计人工复核、兜底和持续学习闭环？
97. ?数据 / knowledge / ?? 3?多个部门对 GMV、活跃用户等指标口径不一致时，你会如何做指标治理和口径统一？
98. ?数据 / project / ?? 3?请讲一次你处理数据补数或历史数据修复的经历，重点说明影响范围、补数方案、幂等校验和业务沟通。
99. ?数据 / knowledge / ?? 3?数仓里有手机号、身份证、地址等敏感数据时，你会如何做分级分类、脱敏、权限控制和审计？
100. ?数据 / knowledge / ?? 2?离线调度任务经常延迟产出，你会如何分析依赖链路、关键路径、资源队列和上游晚到数据？
101. ?AI / knowledge / ?? 3?模型或推荐策略上线前，你会如何设计 A/B 实验？请说明分流、指标、样本量、护栏指标和实验风险。
102. ?AI / system-design / ?? 3?如果要建设一个特征平台或 Feature Store，你会如何设计离线/在线一致性、特征复用、权限和监控？
103. ?AI / knowledge / ?? 2?模型训练数据标注质量不稳定时，你会如何设计标注规范、抽检、一致性评估和问题样本回流？
104. ?数据 / system-design / ?? 3?数据指标从报表走向 API 和产品能力时，如何设计 SLA、权限、缓存和版本？
105. ?数据 / knowledge / ?? 2?实时数仓如何分层？ODS、DWD、DWS 在流处理中和离线数仓有什么差异？
106. ?数据 / knowledge / ?? 3?Iceberg、Hudi、Delta 这类表格式解决什么问题，引入时要关注哪些成本？
107. ?数据 / system-design / ?? 3?什么是 Data Contract？如何用它治理上游 schema 变更和下游稳定性？
108. ?数据 / knowledge / ?? 3?指标平台如何设计指标定义、口径审批、血缘、版本和权限？
109. ?数据 / knowledge / ?? 2?交易实时对账如何处理延迟、重复、撤销和补偿？
110. ?数据 / system-design / ?? 3?核心指标口径变更后，历史数据是否要重算？如何评估影响和成本？
111. ?数据 / knowledge / ?? 2?数据资产如何分级分类，并影响权限、脱敏、保留和审计策略？
112. ?数据 / knowledge / ?? 3?调度资源有限时，如何给数据任务设置优先级和抢占策略？
113. ?数据 / system-design / ?? 3?数据服务接口高峰变慢时，如何从查询、缓存、限流和预聚合优化？
114. ?数据 / knowledge / ?? 3?核心指标突然下降时，如何判断是业务变化、埋点异常、任务失败还是口径变化？
115. ?数据 / knowledge / ?? 2?离线维表和在线特征维表不一致时，会对报表和模型造成什么影响？
116. ?数据 / system-design / ?? 3?数据分析沙箱如何既支持探索分析，又避免敏感数据泄露和资源失控？
117. ?数据 / knowledge / ?? 2?数据权限审批如何设计最小权限、有效期、审批链和审计回收？
118. ?数据 / knowledge / ?? 3?多个系统同一实体字段冲突时，如何设计主数据和冲突解决规则？
119. ?数据 / system-design / ?? 3?客户端埋点升级后新旧版本并存，如何保证数据口径连续？
120. ?数据 / knowledge / ?? 3?数据模型或指标上线前需要哪些评审、测试、灰度和回滚机制？
121. ?数据 / knowledge / ?? 2?离线任务重复运行时，如何设计幂等写入、防重复分区和结果校验？
122. ?数据 / system-design / ?? 3?Flink 任务故障恢复后，如何验证 checkpoint、状态和外部写入一致？
123. ?数据 / knowledge / ?? 2?数据质量告警如何分级，哪些问题需要阻断下游报表或模型？
124. ?数据 / knowledge / ?? 3?数据目录如何帮助业务用户找到可信数据，而不是变成没人维护的列表？
125. ?数据 / system-design / ?? 3?如何把计算和存储成本归因到团队、任务和数据产品？
126. ?数据 / knowledge / ?? 3?如何识别冷热数据，并设计归档、降级存储和删除策略？
127. ?数据 / knowledge / ?? 2?自动解析血缘不准时，如何结合运行时、元数据和人工补充治理？
128. ?数据 / system-design / ?? 3?跨区域数据同步如何处理延迟、断点续传、校验和合规限制？

## AI / 算法工程师?ai?- 100 ?

1. ?AI / knowledge / ?? 2?如果让你评估一个分类模型或推荐模型的效果，你会看哪些指标？离线评估和线上评估有什么区别？
2. ?AI / project / ?? 3?请讲一个你做过的模型落地或大模型应用项目，重点说明数据、效果评估、上线方式和成本取舍。
3. ?AI / system-design / ?? 3?知识库问答系统经常回答得很自信但事实错误，你会如何从检索、重排、提示词、引用和评估体系上治理幻觉？
4. ?AI / knowledge / ?? 3?模型上线后效果逐渐变差，你会如何区分数据漂移、概念漂移、特征缺失、埋点变化和模型本身退化？
5. ?AI / knowledge / ?? 3?模型推理服务延迟过高时，你会从模型、特征、批处理、硬件、缓存和降级策略哪些方面优化？
6. ?AI / knowledge / ?? 2?什么是训练数据泄漏？为什么离线指标异常高反而要警惕？你会如何发现和避免？
7. ?AI / project / ?? 3?分类、排序或推荐模型上线前，你会如何选择离线指标和线上指标？
8. ?AI / knowledge / ?? 2?训练数据泄漏有哪些常见形式，为什么离线效果异常好反而要警惕？
9. ?AI / knowledge / ?? 2?样本类别极不均衡时，模型评估和训练策略应该如何调整？
10. ?AI / knowledge / ?? 3?特征工程如何从业务理解、统计稳定性和线上可用性三个角度设计？
11. ?AI / knowledge / ?? 2?训练集、验证集和测试集如何切分，时间序列场景为什么不能随机切？
12. ?AI / knowledge / ?? 2?交叉验证适合解决什么问题，为什么不能替代独立测试集和线上验证？
13. ?AI / knowledge / ?? 3?模型上线后效果下降时，你如何区分数据漂移、概念漂移和埋点变化？
14. ?AI / knowledge / ?? 2?模型线上 A/B 实验如何设计分流、样本量、指标和停止条件？
15. ?AI / system-design / ?? 3?推荐系统排序模型如何同时平衡点击率、转化、探索和长期体验？
16. ?AI / knowledge / ?? 3?搜索排序效果不好时，你会如何分析召回、排序、同义词和用户意图？
17. ?AI / knowledge / ?? 2?文本分类模型误判很多时，你会如何从数据、标签、特征和阈值排查？
18. ?AI / knowledge / ?? 2?向量 embedding 的质量如何评估，为什么相似度高不一定代表业务相关？
19. ?AI / knowledge / ?? 3?知识库问答中，文档切片大小和重叠策略如何影响召回和答案质量？
20. ?AI / knowledge / ?? 2?RAG 回答错误时，你如何判断是检索没召回、重排失败还是生成幻觉？
21. ?AI / knowledge / ?? 2?为什么 RAG 系统常需要 rerank，如何评估重排是否真的改善答案？
22. ?AI / knowledge / ?? 3?大模型回答很自信但事实错误时，你会如何设计引用、拒答和评估机制？
23. ?AI / system-design / ?? 3?提示词优化如何做系统评估，而不是只看几个主观案例？
24. ?AI / project / ?? 3?面向用户的大模型应用如何防止提示词注入、越权读取和不安全输出？
25. ?AI / knowledge / ?? 3?选择向量数据库时，你会关注索引类型、召回率、延迟、过滤和更新成本哪些问题？
26. ?AI / knowledge / ?? 2?什么时候应该做模型微调，什么时候用提示词、RAG 或规则更合适？
27. ?AI / knowledge / ?? 2?模型推理延迟过高时，你会从模型、服务、硬件和请求模式哪些层面优化？
28. ?AI / knowledge / ?? 3?在线推理中动态 batching 能解决什么问题，会带来哪些延迟和稳定性风险？
29. ?AI / knowledge / ?? 2?模型量化、蒸馏或剪枝能降低成本，但如何评估精度损失和边界案例？
30. ?AI / knowledge / ?? 2?GPU 利用率很低但服务延迟很高时，你会如何排查瓶颈？
31. ?AI / system-design / ?? 3?模型服务上线时如何设计版本管理、灰度、回滚和依赖兼容？
32. ?AI / knowledge / ?? 2?新模型灰度发布时，你会看哪些指标决定继续放量还是回滚？
33. ?AI / knowledge / ?? 2?模型监控除了 QPS 和延迟，还应该关注哪些效果、数据和业务指标？
34. ?AI / knowledge / ?? 3?训练流水线如何保证数据、代码、参数和模型产物可追溯？
35. ?AI / system-design / ?? 3?特征平台如何解决离线训练和在线推理特征不一致的问题？
36. ?AI / knowledge / ?? 2?MLOps 和普通 DevOps 有什么区别，模型生命周期多了哪些治理点？
37. ?AI / knowledge / ?? 3?标注数据质量差时，你会如何设计抽检、一致性评估和返工机制？
38. ?AI / knowledge / ?? 2?主动学习适合什么场景，如何选择样本让标注成本更有效？
39. ?AI / knowledge / ?? 2?模型对不同人群表现差异明显时，你会如何评估和治理偏差？
40. ?AI / knowledge / ?? 3?训练和推理过程中如何保护个人敏感信息，避免日志、样本和输出泄露？
41. ?AI / project / ?? 3?模型容易被异常输入攻击或诱导时，你会如何发现和增强鲁棒性？
42. ?AI / knowledge / ?? 2?业务方不信任模型结果时，你会如何提供可解释性和可审计证据？
43. ?AI / knowledge / ?? 3?多个模型实验并行时，你如何管理参数、数据版本、指标和结论？
44. ?AI / knowledge / ?? 2?超参数调优如何避免过拟合验证集和浪费大量计算资源？
45. ?AI / knowledge / ?? 2?模型训练集效果很好但线上效果差，你会如何判断过拟合和数据分布问题？
46. ?AI / knowledge / ?? 3?推荐系统遇到新用户、新商品冷启动时，你会如何设计策略？
47. ?AI / knowledge / ?? 2?用户反馈会影响后续训练时，如何避免反馈回路放大偏见或低质内容？
48. ?AI / knowledge / ?? 2?大模型应用成本快速上涨时，你会如何通过缓存、路由和模型分层优化？
49. ?AI / knowledge / ?? 3?如何设计多模型路由，让简单问题走小模型，复杂问题走大模型？
50. ?AI / knowledge / ?? 2?离线评估效果好但线上差，你如何排查特征、样本、延迟和业务策略差异？
51. ?AI / system-design / ?? 3?AI 系统低置信度时如何设计人工复核、兜底和持续学习闭环？
52. ?AI / knowledge / ?? 3?模型或推荐策略上线前，你会如何设计 A/B 实验？请说明分流、指标、样本量、护栏指标和实验风险。
53. ?AI / system-design / ?? 3?如果要建设一个特征平台或 Feature Store，你会如何设计离线/在线一致性、特征复用、权限和监控？
54. ?AI / knowledge / ?? 3?大模型应用接入外部文档和工具调用后，如何防护 prompt injection、越权工具调用和敏感信息泄漏？
55. ?AI / knowledge / ?? 2?模型训练数据标注质量不稳定时，你会如何设计标注规范、抽检、一致性评估和问题样本回流？
56. ?AI / knowledge / ?? 3?什么是特征穿越或标签泄漏？如何在训练和评估阶段发现？
57. ?AI / knowledge / ?? 2?模型输出概率不准时，校准曲线和 Platt/Isotonic 校准如何帮助业务决策？
58. ?AI / knowledge / ?? 2?分类模型阈值如何选择？如何结合误报成本、漏报成本和业务容量？
59. ?AI / knowledge / ?? 3?NDCG、MAP、MRR 分别适合衡量什么排序问题？
60. ?AI / knowledge / ?? 2?推荐系统为什么通常分召回、粗排、精排和重排？每层关注什么？
61. ?AI / knowledge / ?? 2?推荐模型负采样怎么做？采样偏差会如何影响训练和评估？
62. ?AI / knowledge / ?? 3?在线特征延迟或缺失会如何影响模型效果？如何监控和兜底？
63. ?AI / knowledge / ?? 2?特征分布漂移如何监控？PSI、KS 或分桶统计能说明什么？
64. ?AI / knowledge / ?? 2?SHAP、特征重要性和规则解释分别适合什么场景？
65. ?AI / knowledge / ?? 3?如何评估模型对不同用户群体是否存在偏差，并制定治理方案？
66. ?AI / knowledge / ?? 2?探索利用问题如何用 epsilon-greedy、UCB 或 Thompson Sampling 处理？
67. ?AI / knowledge / ?? 2?强化学习为什么很难直接落地业务系统？数据、奖励和安全边界是什么？
68. ?AI / system-design / ?? 3?大模型应用如何建设离线评测集，覆盖正确性、鲁棒性、安全和成本？
69. ?AI / knowledge / ?? 2?RAG 系统如何评估检索召回率、上下文相关性和答案忠实度？
70. ?AI / knowledge / ?? 2?知识库问答如何设计引用和证据，降低幻觉并便于用户核验？
71. ?AI / knowledge / ?? 3?AI Agent 调用外部工具时如何设计权限、参数校验和失败恢复？
72. ?AI / knowledge / ?? 2?提示词注入攻击如何影响 RAG 或 Agent 系统？如何防护？
73. ?AI / knowledge / ?? 2?大模型输出如何做内容安全过滤、拒答和人工复核？
74. ?AI / knowledge / ?? 3?LLM 应用缓存如何设计 key、上下文、权限和失效策略？
75. ?AI / knowledge / ?? 2?多模型路由如何根据任务复杂度、成本和延迟选择模型？
76. ?AI / knowledge / ?? 2?知识库文档更新后，向量索引如何增量更新并避免旧答案残留？
77. ?AI / knowledge / ?? 3?HNSW、topK、相似度阈值和过滤条件如何影响召回和延迟？
78. ?AI / knowledge / ?? 2?新模型上线如何做灰度和 A/B，避免用户体验大面积波动？
79. ?AI / knowledge / ?? 2?离线 AUC 提升但线上转化下降，你会如何排查？
80. ?AI / knowledge / ?? 3?训练数据来自历史策略时，选择偏差会如何影响新模型？
81. ?AI / knowledge / ?? 2?新用户和新物品冷启动如何结合规则、内容特征和探索策略？
82. ?AI / knowledge / ?? 2?转化标签延迟很长时，模型训练和评估如何处理？
83. ?AI / knowledge / ?? 3?标签噪声高时，你会如何清洗、重标、降权或鲁棒训练？
84. ?AI / knowledge / ?? 2?模型服务如何保留版本、特征依赖和回滚能力？
85. ?AI / knowledge / ?? 2?Feature Store 如何保证离线训练和在线推理一致？
86. ?AI / knowledge / ?? 3?训练任务抢占 GPU 资源时，如何设计队列、优先级和配额？
87. ?AI / knowledge / ?? 2?分布式训练中数据并行和模型并行分别解决什么问题？
88. ?AI / knowledge / ?? 2?蒸馏、量化和剪枝如何降低推理成本，如何验证效果损失？
89. ?AI / knowledge / ?? 3?模型反演、成员推断和数据泄露风险是什么，如何降低？
90. ?AI / knowledge / ?? 2?在线学习适合什么场景？如何避免错误反馈快速污染模型？
91. ?AI / knowledge / ?? 2?异常检测模型如何评估？没有明确标签时怎么验证效果？
92. ?AI / knowledge / ?? 3?时间序列预测如何处理趋势、季节性、节假日和概念漂移？
93. ?AI / knowledge / ?? 2?图特征或图神经网络适合解决哪些推荐、风控或关系挖掘问题？
94. ?AI / knowledge / ?? 2?多模态模型落地时，图片、文本和语音输入如何做质量控制和安全过滤？
95. ?AI / knowledge / ?? 3?AI 低置信或高风险输出如何设计人工审核和反馈闭环？
96. ?AI / system-design / ?? 3?AI 项目如何在效果、延迟和推理成本之间做预算和治理？
97. ?AI / knowledge / ?? 2?模型服务 SLA 应该包含哪些指标，如何处理降级和熔断？
98. ?AI / knowledge / ?? 3?线上实验结果如何判断统计显著，而不是偶然波动？
99. ?AI / knowledge / ?? 2?模型卡或模型文档应记录哪些信息，方便审计和交接？
100. ?AI / system-design / ?? 3?请讲一次 AI 项目效果不达预期时，你如何复盘数据、模型和业务假设。

## 安全工程师?security?- 100 ?

1. ?安全 / knowledge / ?? 2?请解释 XSS、CSRF 和 SQL 注入分别是什么，有哪些常见防护手段？
2. ?安全 / project / ?? 3?请讲一个你处理过的安全漏洞或安全治理项目，重点说明风险评估、修复方案、验证方法和后续防复发措施。
3. ?DevOps / knowledge / ?? 2?配置和密钥应该如何管理？为什么不应该把数据库密码、Token 或私钥直接提交到代码仓库？
4. ?安全 / knowledge / ?? 3?接口已经做了登录鉴权，为什么还可能出现越权？请说明水平越权、垂直越权和对象级权限校验的设计。
5. ?安全 / knowledge / ?? 3?什么是 SSRF？如果系统允许用户提交图片 URL 或 webhook 地址，你会如何防护内网探测和云元数据泄漏？
6. ?安全 / project / ?? 2?如果发现生产 API Key 被提交到了 Git 仓库，你会如何评估影响、止血、轮换和防止再次发生？
7. ?安全 / knowledge / ?? 3?用户头像或附件上传功能有哪些安全风险？你会如何设计文件类型校验、存储隔离、访问控制和恶意文件处理？
8. ?安全 / project / ?? 3?认证和授权有什么区别，为什么登录成功不代表接口访问一定安全？
9. ?安全 / knowledge / ?? 2?什么是 IDOR 或水平越权，接口如何设计对象级权限校验？
10. ?安全 / knowledge / ?? 2?RBAC 和 ABAC 分别适合什么权限模型，复杂组织权限如何设计？
11. ?安全 / knowledge / ?? 3?JWT 使用中有哪些安全风险，如何设计过期、撤销和密钥轮换？
12. ?安全 / knowledge / ?? 2?OAuth2 授权码模式解决什么问题，回调地址和 state 参数为什么重要？
13. ?安全 / knowledge / ?? 2?Session 固定、劫持和 Cookie 泄露分别如何防护？
14. ?安全 / knowledge / ?? 3?用户密码为什么不能明文或普通哈希存储，如何使用盐和慢哈希？
15. ?安全 / knowledge / ?? 2?多因素认证适合保护哪些场景，如何处理找回、设备丢失和风控体验？
16. ?安全 / system-design / ?? 3?富文本或评论系统如何防护存储型 XSS，同时保留必要格式？
17. ?安全 / knowledge / ?? 3?CSRF 的攻击条件是什么，SameSite、Token 和二次确认分别解决什么？
18. ?安全 / knowledge / ?? 2?为什么参数化查询是 SQL 注入核心防护，动态 SQL 场景要注意什么？
19. ?安全 / knowledge / ?? 2?允许用户提交 URL 的功能如何防止 SSRF、内网探测和云元数据泄露？
20. ?安全 / knowledge / ?? 3?文件上传功能如何防止 WebShell、恶意文件、越权访问和存储污染？
21. ?安全 / knowledge / ?? 2?不安全反序列化为什么危险，如何从类型白名单和数据格式上治理？
22. ?安全 / knowledge / ?? 2?系统需要调用 shell 命令时，如何防止命令注入和参数逃逸问题？
23. ?安全 / knowledge / ?? 3?下载文件接口如何防止路径穿越读取服务器敏感文件？
24. ?安全 / knowledge / ?? 2?CORS 配置过宽会带来什么风险，为什么不能简单允许所有来源带 Cookie？
25. ?安全 / project / ?? 3?登录、短信验证码和高价值接口如何设计限流、防刷和风控策略？
26. ?安全 / knowledge / ?? 3?如何防止账号密码被撞库或暴力破解，同时避免误伤正常用户？
27. ?安全 / knowledge / ?? 2?API Key、数据库密码和私钥如何存储、分发、轮换和审计？
28. ?安全 / knowledge / ?? 2?生产密钥疑似泄露时，你会如何评估影响、轮换密钥和验证失效？
29. ?安全 / knowledge / ?? 3?HTTPS 不是配上证书就结束，TLS 协议版本和加密套件如何治理？
30. ?安全 / knowledge / ?? 2?内部服务调用什么时候需要 mTLS，它解决什么问题，又会增加哪些运维成本？
31. ?安全 / knowledge / ?? 2?API 网关应该承担哪些安全能力，哪些权限校验不能只放在网关？
32. ?安全 / system-design / ?? 3?零信任架构的核心思想是什么，如何落地身份、设备、网络和审计控制？
33. ?安全 / knowledge / ?? 2?安全审计日志应该记录哪些字段，如何避免日志被篡改或泄露敏感信息？
34. ?安全 / knowledge / ?? 2?安全告警很多但有效率低时，你会如何做规则分级、关联分析和闭环处置？
35. ?安全 / knowledge / ?? 3?发现高危漏洞后，如何做影响评估、修复优先级和例外风险接受？
36. ?安全 / knowledge / ?? 2?第三方依赖爆出漏洞时，你如何判断是否受影响并推进修复？
37. ?安全 / knowledge / ?? 2?SAST、DAST 和人工代码审计分别适合发现哪些问题，如何组合使用？
38. ?安全 / knowledge / ?? 3?新系统设计阶段如何做威胁建模，识别资产、入口、攻击者和缓解措施？
39. ?安全 / knowledge / ?? 2?如何把安全要求嵌入需求、设计、开发、测试和发布流程？
40. ?安全 / knowledge / ?? 2?发现生产数据疑似泄露时，你会如何分级、止血、取证和复盘？
41. ?安全 / knowledge / ?? 3?数据库字段加密、传输加密和磁盘加密分别解决什么问题？
42. ?安全 / project / ?? 3?为什么密钥管理系统比把密钥放配置文件更安全，使用时要注意什么？
43. ?安全 / knowledge / ?? 2?测试环境和分析场景中如何做数据脱敏，避免影响可用性和合规性？
44. ?安全 / system-design / ?? 3?收集用户个人信息时，系统设计应如何体现最小化、授权和删除能力？
45. ?安全 / knowledge / ?? 2?云上 IAM 权限如何避免过度授权，如何设计角色、策略和临时凭证？
46. ?安全 / knowledge / ?? 2?容器镜像和运行时有哪些安全风险，如何做基线、扫描和权限收敛？
47. ?安全 / knowledge / ?? 3?Kubernetes 集群 RBAC 如何避免默认权限过大和命名空间越权？
48. ?安全 / knowledge / ?? 2?软件供应链攻击可能发生在哪些环节，如何保护依赖、构建和制品？
49. ?安全 / knowledge / ?? 2?WAF 能解决什么问题，为什么不能把应用安全全部寄托在 WAF 上？
50. ?安全 / knowledge / ?? 3?生产服务器和中间件安全基线应该包含哪些检查项，如何持续验证？
51. ?安全 / knowledge / ?? 2?技术系统如何降低钓鱼和社工导致的账号接管风险？
52. ?测试 / knowledge / ?? 3?普通业务测试中如何覆盖基础安全风险？请说明越权、输入校验、敏感信息、上传下载和接口重放的测试思路。
53. ?DevOps / knowledge / ?? 3?容器镜像从构建到上线有哪些供应链安全风险？你会如何做基础镜像治理、漏洞扫描、签名和准入控制？
54. ?数据 / knowledge / ?? 3?数仓里有手机号、身份证、地址等敏感数据时，你会如何做分级分类、脱敏、权限控制和审计？
55. ?AI / knowledge / ?? 3?大模型应用接入外部文档和工具调用后，如何防护 prompt injection、越权工具调用和敏感信息泄漏？
56. ?安全 / knowledge / ?? 3?JWT 和传统服务端 Session 各有什么安全取舍？如何处理 token 过期、刷新、吊销、泄漏和权限变更？
57. ?安全 / knowledge / ?? 3?OAuth 登录或三方授权中有哪些常见安全风险？你会如何校验 redirect_uri、state、scope 和授权码交换流程？
58. ?安全 / system-design / ?? 3?如果要建设一套安全审计日志体系，你会记录哪些事件，如何保证不可抵赖、可检索、低噪声和隐私合规？
59. ?安全 / knowledge / ?? 3?登录、验证码或短信接口被刷时，你会如何设计反滥用策略，同时避免误伤正常用户？
60. ?安全 / knowledge / ?? 3?如何用 STRIDE 对一个新系统做威胁建模，并把结果转成开发任务？
61. ?安全 / knowledge / ?? 2?安全开发生命周期如何嵌入需求、设计、编码、测试和发布？
62. ?安全 / knowledge / ?? 2?如何系统性发现水平越权和垂直越权，而不是只测几个接口？
63. ?安全 / knowledge / ?? 3?开放 API 如何设计签名、时间戳、nonce 和重放防护？
64. ?安全 / knowledge / ?? 2?日志、报表和测试环境如何做敏感数据脱敏，避免影响排查和合规？
65. ?安全 / knowledge / ?? 2?发现 Git 仓库泄露密钥后，如何评估影响、轮换和防止复发？
66. ?安全 / knowledge / ?? 3?SSRF 为什么可能打到云元数据服务？如何防护 IMDS 凭证泄露？
67. ?安全 / knowledge / ?? 2?怀疑服务器被植入 WebShell，你会如何取证、止血和恢复？
68. ?安全 / knowledge / ?? 2?遭遇勒索攻击时，如何隔离、取证、恢复和沟通？
69. ?安全 / knowledge / ?? 3?零信任访问如何设计身份、设备、网络和持续评估？
70. ?安全 / knowledge / ?? 2?如何落地最小权限原则，避免权限越积越多？
71. ?安全 / knowledge / ?? 2?Kubernetes 集群如何治理 RBAC、镜像、Secret 和网络策略风险？
72. ?安全 / knowledge / ?? 3?容器逃逸风险来自哪里？如何通过运行时权限和基线降低风险？
73. ?安全 / knowledge / ?? 2?容器镜像如何做漏洞扫描、签名、最小化和准入控制？
74. ?安全 / knowledge / ?? 2?npm/pip/maven 依赖供应链攻击如何发生，如何治理？
75. ?安全 / knowledge / ?? 3?静态代码扫描误报很多时，如何调优规则并推动研发修复？
76. ?安全 / knowledge / ?? 2?动态扫描如何接入测试环境，避免扫不全或误伤业务？
77. ?安全 / knowledge / ?? 2?漏洞 CVSS 分很高但业务不可达时，如何做风险评级和修复优先级？
78. ?安全 / knowledge / ?? 3?业务短期无法修复安全问题时，如何设计例外审批、补偿控制和到期复查？
79. ?安全 / knowledge / ?? 2?用户要求删除个人数据时，系统如何处理主库、缓存、日志、备份和下游同步？
80. ?安全 / knowledge / ?? 2?数据加密中 DEK、KEK 和 KMS 的关系是什么？
81. ?安全 / knowledge / ?? 3?如何发现 token 被盗用？从 IP、设备、行为和频率看哪些异常？
82. ?安全 / knowledge / ?? 2?安全风控如何和登录、支付、短信、客服流程联动？
83. ?安全 / knowledge / ?? 2?如何设计安全审计平台的事件模型、检索、告警和保留策略？
84. ?安全 / knowledge / ?? 3?一次红蓝对抗后，如何把发现的问题转化为长期安全能力？
85. ?安全 / knowledge / ?? 2?为什么 WAF 可能被绕过？应用侧仍需做哪些安全控制？
86. ?安全 / knowledge / ?? 2?业务逻辑漏洞为什么扫描器难以发现？如何通过测试和评审治理？
87. ?安全 / knowledge / ?? 3?支付接口如何防止金额篡改、重复回调、越权退款和订单伪造？
88. ?安全 / knowledge / ?? 2?验证码如何防止机器识别、绕过和短信轰炸？
89. ?安全 / knowledge / ?? 2?账号接管常见路径有哪些，如何设计检测和保护？
90. ?安全 / knowledge / ?? 3?如何发现和治理日志中的密码、token、身份证和手机号泄露？
91. ?安全 / knowledge / ?? 2?员工转岗或离职后，系统权限如何自动回收和审计？
92. ?安全 / knowledge / ?? 2?接入第三方 SDK 或 SaaS 时，你会做哪些安全评估？
93. ?安全 / knowledge / ?? 3?移动端应用如何防止接口被重放、包被篡改和敏感信息泄露？
94. ?安全 / knowledge / ?? 2?如何设计对研发真正有效的安全培训和编码规范？
95. ?安全 / knowledge / ?? 2?安全团队应该看哪些指标衡量风险下降，而不是只统计漏洞数量？
96. ?安全 / knowledge / ?? 3?渗透测试或攻防演练前为什么要明确授权范围和停止条件？
97. ?安全 / knowledge / ?? 2?如何利用证书透明度或域名监控发现异常证书和钓鱼站点？
98. ?安全 / knowledge / ?? 2?涉及跨境数据传输时，技术系统需要支持哪些合规控制？
99. ?安全 / knowledge / ?? 3?服务器、中间件和数据库安全基线如何自动化检查和闭环整改？
100. ?安全 / knowledge / ?? 2?把历史明文密钥迁移到 KMS 时，如何保证业务不中断和权限收敛？

## 架构师 / 技术管理?architect?- 127 ?

1. ?系统设计 / knowledge / ?? 3?如果一个核心业务系统要从单体逐步演进到更高可用、更易扩展的架构，你会怎么规划演进路径，而不是一次性推倒重来？
2. ?项目经历 / project / ?? 3?请讲一个你主导架构治理、技术决策或团队研发流程改进的项目，重点说清背景、决策依据、推进阻力和结果。
3. ?系统设计 / system-design / ?? 3?请设计一个接口限流方案，说明固定窗口、滑动窗口、漏桶、令牌桶的取舍，以及如何避免误伤核心用户。
4. ?系统设计 / system-design / ?? 3?支付回调或订单创建接口如何做幂等？请说明幂等键、唯一约束、状态机和重试之间的关系。
5. ?系统设计 / system-design / ?? 3?订单创建后需要异步通知库存和物流，如何设计消息可靠投递、幂等消费和失败补偿？
6. ?系统设计 / system-design / ?? 3?如果核心接口要求跨机房高可用，你会如何设计流量切换、数据一致性、故障检测和演练机制？
7. ?系统设计 / system-design / ?? 3?一个微服务链路偶发慢请求，如何设计日志、指标和链路追踪，让团队能快速定位问题？
8. ?项目经历 / project / ?? 3?请讲一次你治理技术债或推进架构改造的经历，重点说明问题证据、优先级排序、推进阻力、收益指标和复盘。
9. ?DevOps / project / ?? 3?请讲一次你参与线上故障处理的经历，重点说明告警发现、影响评估、止血动作、根因定位、复盘和自动化改进。
10. ?系统设计 / system-design / ?? 3?订单表数据量快速增长时，什么时候该考虑分库分表？如何选择分片键，并处理扩容、跨分片查询和全局唯一 ID？
11. ?安全 / project / ?? 3?认证和授权有什么区别，为什么登录成功不代表接口访问一定安全？
12. ?安全 / knowledge / ?? 2?什么是 IDOR 或水平越权，接口如何设计对象级权限校验？
13. ?安全 / knowledge / ?? 2?RBAC 和 ABAC 分别适合什么权限模型，复杂组织权限如何设计？
14. ?安全 / knowledge / ?? 3?JWT 使用中有哪些安全风险，如何设计过期、撤销和密钥轮换？
15. ?安全 / knowledge / ?? 2?OAuth2 授权码模式解决什么问题，回调地址和 state 参数为什么重要？
16. ?安全 / knowledge / ?? 2?Session 固定、劫持和 Cookie 泄露分别如何防护？
17. ?安全 / knowledge / ?? 3?用户密码为什么不能明文或普通哈希存储，如何使用盐和慢哈希？
18. ?安全 / knowledge / ?? 2?多因素认证适合保护哪些场景，如何处理找回、设备丢失和风控体验？
19. ?安全 / system-design / ?? 3?富文本或评论系统如何防护存储型 XSS，同时保留必要格式？
20. ?安全 / knowledge / ?? 3?CSRF 的攻击条件是什么，SameSite、Token 和二次确认分别解决什么？
21. ?安全 / knowledge / ?? 2?为什么参数化查询是 SQL 注入核心防护，动态 SQL 场景要注意什么？
22. ?安全 / knowledge / ?? 2?允许用户提交 URL 的功能如何防止 SSRF、内网探测和云元数据泄露？
23. ?安全 / knowledge / ?? 3?文件上传功能如何防止 WebShell、恶意文件、越权访问和存储污染？
24. ?安全 / knowledge / ?? 2?不安全反序列化为什么危险，如何从类型白名单和数据格式上治理？
25. ?安全 / knowledge / ?? 2?系统需要调用 shell 命令时，如何防止命令注入和参数逃逸问题？
26. ?安全 / knowledge / ?? 3?下载文件接口如何防止路径穿越读取服务器敏感文件？
27. ?安全 / knowledge / ?? 2?CORS 配置过宽会带来什么风险，为什么不能简单允许所有来源带 Cookie？
28. ?安全 / project / ?? 3?登录、短信验证码和高价值接口如何设计限流、防刷和风控策略？
29. ?安全 / knowledge / ?? 3?如何防止账号密码被撞库或暴力破解，同时避免误伤正常用户？
30. ?安全 / knowledge / ?? 2?API Key、数据库密码和私钥如何存储、分发、轮换和审计？
31. ?安全 / knowledge / ?? 2?生产密钥疑似泄露时，你会如何评估影响、轮换密钥和验证失效？
32. ?安全 / knowledge / ?? 3?HTTPS 不是配上证书就结束，TLS 协议版本和加密套件如何治理？
33. ?安全 / knowledge / ?? 2?内部服务调用什么时候需要 mTLS，它解决什么问题，又会增加哪些运维成本？
34. ?安全 / knowledge / ?? 2?API 网关应该承担哪些安全能力，哪些权限校验不能只放在网关？
35. ?安全 / system-design / ?? 3?零信任架构的核心思想是什么，如何落地身份、设备、网络和审计控制？
36. ?安全 / knowledge / ?? 2?安全审计日志应该记录哪些字段，如何避免日志被篡改或泄露敏感信息？
37. ?安全 / knowledge / ?? 2?安全告警很多但有效率低时，你会如何做规则分级、关联分析和闭环处置？
38. ?安全 / knowledge / ?? 3?发现高危漏洞后，如何做影响评估、修复优先级和例外风险接受？
39. ?安全 / knowledge / ?? 2?第三方依赖爆出漏洞时，你如何判断是否受影响并推进修复？
40. ?安全 / knowledge / ?? 2?SAST、DAST 和人工代码审计分别适合发现哪些问题，如何组合使用？
41. ?安全 / knowledge / ?? 3?新系统设计阶段如何做威胁建模，识别资产、入口、攻击者和缓解措施？
42. ?安全 / knowledge / ?? 2?如何把安全要求嵌入需求、设计、开发、测试和发布流程？
43. ?安全 / knowledge / ?? 2?发现生产数据疑似泄露时，你会如何分级、止血、取证和复盘？
44. ?安全 / knowledge / ?? 3?数据库字段加密、传输加密和磁盘加密分别解决什么问题？
45. ?安全 / project / ?? 3?为什么密钥管理系统比把密钥放配置文件更安全，使用时要注意什么？
46. ?安全 / knowledge / ?? 2?测试环境和分析场景中如何做数据脱敏，避免影响可用性和合规性？
47. ?安全 / system-design / ?? 3?收集用户个人信息时，系统设计应如何体现最小化、授权和删除能力？
48. ?安全 / knowledge / ?? 2?云上 IAM 权限如何避免过度授权，如何设计角色、策略和临时凭证？
49. ?安全 / knowledge / ?? 2?容器镜像和运行时有哪些安全风险，如何做基线、扫描和权限收敛？
50. ?安全 / knowledge / ?? 3?Kubernetes 集群 RBAC 如何避免默认权限过大和命名空间越权？
51. ?安全 / knowledge / ?? 2?软件供应链攻击可能发生在哪些环节，如何保护依赖、构建和制品？
52. ?安全 / knowledge / ?? 2?WAF 能解决什么问题，为什么不能把应用安全全部寄托在 WAF 上？
53. ?安全 / knowledge / ?? 3?生产服务器和中间件安全基线应该包含哪些检查项，如何持续验证？
54. ?安全 / knowledge / ?? 2?技术系统如何降低钓鱼和社工导致的账号接管风险？
55. ?系统设计 / system-design / ?? 3?核心单体系统如何逐步演进，而不是一次性推倒重来？
56. ?系统设计 / knowledge / ?? 2?DDD 中限界上下文如何帮助服务拆分，错误边界会带来什么问题？
57. ?系统设计 / knowledge / ?? 2?微服务数量增加后，如何治理调用链路、版本、熔断、限流和依赖关系？
58. ?系统设计 / knowledge / ?? 3?什么时候模块化单体比微服务更合适，如何保证模块边界不腐化？
59. ?系统设计 / system-design / ?? 3?API 网关在架构中应该承担哪些职责，哪些职责不应该放在网关？
60. ?系统设计 / knowledge / ?? 2?跨服务事务如何设计，2PC、TCC、Saga 和最终一致性如何取舍？
61. ?系统设计 / knowledge / ?? 3?业务能接受最终一致性时，如何设计状态、补偿、对账和用户体验？
62. ?系统设计 / knowledge / ?? 2?订单、支付、消息消费等场景如何从架构层设计幂等能力？
63. ?系统设计 / knowledge / ?? 2?本地事务和消息发送不一致时，Outbox 模式如何解决可靠投递？
64. ?系统设计 / knowledge / ?? 3?CQRS 适合解决什么问题，读写分离会带来哪些一致性和复杂度成本？
65. ?系统设计 / knowledge / ?? 2?事件驱动架构如何设计事件契约、幂等消费、重放和故障隔离？
66. ?系统设计 / knowledge / ?? 2?高并发读场景如何设计缓存架构，避免穿透、击穿、雪崩和一致性问题？
67. ?系统设计 / system-design / ?? 3?核心服务高可用设计要覆盖哪些层面，如何避免单点和级联故障？
68. ?系统设计 / knowledge / ?? 2?跨地域多活系统如何处理流量路由、数据一致性和故障切换？
69. ?系统设计 / knowledge / ?? 2?灾备方案如何从业务等级、RPO/RTO、演练和成本角度设计？
70. ?系统设计 / knowledge / ?? 3?订单表快速增长时，如何选择分片键并处理扩容、跨分片查询和全局 ID？
71. ?系统设计 / system-design / ?? 3?历史系统迁移到新架构时，如何设计双写、校验、切流和回滚？
72. ?系统设计 / project / ?? 3?如何设计日志、指标、Trace 和告警，让复杂系统具备可诊断性？
73. ?系统设计 / knowledge / ?? 3?架构师如何用 SLO 驱动稳定性治理和资源投入优先级？
74. ?系统设计 / knowledge / ?? 2?如何基于业务增长做容量规划，避免过度设计和容量不足？
75. ?系统设计 / system-design / ?? 3?云成本持续上涨时，架构上如何从资源、存储、流量和研发效率治理？
76. ?系统设计 / knowledge / ?? 3?技术债很多时，如何判断优先级并推动业务团队投入治理？
77. ?系统设计 / knowledge / ?? 2?平台工程应该解决哪些研发效率问题，如何避免平台变成新的瓶颈？
78. ?系统设计 / knowledge / ?? 2?系统之间依赖越来越复杂时，如何做依赖分层、隔离和契约治理？
79. ?系统设计 / system-design / ?? 3?对外 API 如何设计版本兼容、废弃策略和调用方迁移？
80. ?系统设计 / knowledge / ?? 2?系统升级时如何保证向前兼容和向后兼容，避免一次升级拖垮多个团队？
81. ?系统设计 / knowledge / ?? 2?核心数据模型变化时，如何控制数据库、接口、缓存和报表的连锁影响？
82. ?系统设计 / knowledge / ?? 3?SaaS 多租户系统如何设计数据隔离、权限、计费和噪声隔离？
83. ?系统设计 / system-design / ?? 3?大型后台权限系统如何设计角色、资源、数据范围和审计？
84. ?系统设计 / knowledge / ?? 2?如何设计灰度、蓝绿、金丝雀和一键回滚能力支撑高频发布？
85. ?系统设计 / knowledge / ?? 3?架构决策记录应该写什么，如何避免关键技术决策只留在口头上？
86. ?系统设计 / knowledge / ?? 2?系统架构和团队边界如何互相影响，什么时候需要调整团队协作模型？
87. ?系统设计 / system-design / ?? 3?面对中间件或平台能力时，如何判断自研、开源二开还是采购？
88. ?系统设计 / knowledge / ?? 3?核心链路性能不足时，如何从架构上分层定位和优化？
89. ?系统设计 / project / ?? 3?遗留系统缺少文档和测试时，如何安全推进重构或迁移？
90. ?系统设计 / knowledge / ?? 2?熔断、限流、降级、隔离和重试分别解决什么问题，如何避免互相冲突？
91. ?系统设计 / system-design / ?? 3?混沌工程如何服务于架构可靠性，而不是制造无意义故障？
92. ?系统设计 / knowledge / ?? 2?业务要求快速上线但架构风险明显时，你如何提出可执行折中方案？
93. ?系统设计 / knowledge / ?? 2?不同业务场景如何定义强一致、最终一致和可补偿一致性的边界？
94. ?系统设计 / knowledge / ?? 3?一次严谨的架构评审应该覆盖哪些内容，如何让评审结论可追踪？
95. ?运维 / system-design / ?? 3?大促前你会如何做容量评估和保障？请说明流量预测、压测、扩容、限流降级、值守和回滚预案。
96. ?DevOps / knowledge / ?? 3?为什么要做基础设施即代码？当云资源被人工改动导致配置漂移时，你会如何发现、治理和防止复发？
97. ?DevOps / knowledge / ?? 3?SLO、SLI 和错误预算分别是什么？你会如何用它们平衡发布速度和系统稳定性？
98. ?DevOps / system-design / ?? 3?云资源成本持续上涨时，你会如何建设成本可观测性和治理机制，同时避免影响稳定性？
99. ?系统设计 / system-design / ?? 3?一个单体系统准备拆服务时，你会如何识别领域边界、数据归属和团队协作边界，避免拆成分布式单体？
100. ?系统设计 / knowledge / ?? 3?公共 API 或内部 RPC 接口如何做版本治理和兼容性设计，避免升级时大面积影响调用方？
101. ?项目经历 / project / ?? 3?请讲一次你推动跨团队技术决策的经历，重点说明分歧点、决策依据、沟通机制、落地结果和复盘。
102. ?系统设计 / system-design / ?? 3?如果要建设内部技术平台，如何判断哪些能力应该平台化？如何避免平台变成低效的“大而全系统”？
103. ?系统设计 / system-design / ?? 3?技术债很多但业务排期很紧时，你如何制定架构治理路线图并获得业务团队支持？
104. ?系统设计 / knowledge / ?? 2?当系统边界和团队边界长期不匹配时，会出现哪些问题，你会如何调整？
105. ?系统设计 / knowledge / ?? 3?如何按业务重要性给系统划分等级，并为不同等级设计可用性、容量和运维要求？
106. ?系统设计 / system-design / ?? 3?一次架构评审中，你会如何识别单点、容量、数据一致性、依赖和安全风险？
107. ?系统设计 / knowledge / ?? 3?团队技术栈过于分散时，架构师如何治理统一性和创新空间之间的矛盾？
108. ?系统设计 / knowledge / ?? 2?内部平台能力越做越多时，如何判断哪些能力应该沉淀平台，哪些应该留给业务？
109. ?系统设计 / system-design / ?? 3?跨团队接口频繁变更时，如何设计契约、版本、灰度和废弃机制？
110. ?系统设计 / knowledge / ?? 2?架构治理如何量化收益？你会看哪些稳定性、效率、成本和质量指标？
111. ?系统设计 / knowledge / ?? 3?做技术选型时，你如何比较成熟度、生态、团队能力、成本和退出机制？
112. ?系统设计 / system-design / ?? 3?业务中台或技术中台如何避免变成所有需求的瓶颈？
113. ?系统设计 / knowledge / ?? 3?多个业务域共享核心数据时，如何设计主数据、事件同步和一致性边界？
114. ?系统设计 / knowledge / ?? 2?核心系统迁移时，如何设计双轨运行、数据校验、灰度切流和回滚？
115. ?系统设计 / system-design / ?? 3?对外开放 API 如何设计配额、认证、版本、文档、审计和 SLA？
116. ?系统设计 / knowledge / ?? 2?单租户系统演进为多租户 SaaS 时，架构上要改哪些核心能力？
117. ?系统设计 / knowledge / ?? 3?一次架构方案上线后效果不达预期，你会如何复盘决策假设和执行问题？
118. ?系统设计 / system-design / ?? 3?如果核心系统一年内多次故障，你会如何组织稳定性专项治理？
119. ?系统设计 / knowledge / ?? 3?业务要求降低 30% 云成本时，架构师如何在成本和可靠性之间取舍？
120. ?系统设计 / knowledge / ?? 2?交易库、分析库、搜索索引和缓存之间如何划分职责，避免数据链路混乱？
121. ?系统设计 / system-design / ?? 3?架构规范写了没人执行时，你会如何通过工具、门禁和评审推动落地？
122. ?系统设计 / knowledge / ?? 2?没有直接管理权限时，架构师如何推动跨团队技术改造？
123. ?系统设计 / knowledge / ?? 3?遗留系统中存在大量隐式依赖时，你会如何识别、分层和逐步剥离？
124. ?系统设计 / system-design / ?? 3?如何设计服务弹性，让系统面对流量突增、依赖失败和局部故障仍能降级运行？
125. ?系统设计 / knowledge / ?? 3?什么时候应该把同步链路改成异步？异步化会引入哪些一致性和体验问题？
126. ?系统设计 / knowledge / ?? 2?多个系统权限模型不一致时，如何设计统一身份、角色、资源和审计体系？
127. ?系统设计 / system-design / ?? 3?如何让关键架构知识不只存在少数老员工脑子里？

