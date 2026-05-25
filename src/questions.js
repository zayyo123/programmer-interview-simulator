export const questionBank = [
  {
    id: 'project_001',
    category: '项目经历',
    roles: ['backend', 'frontend', 'fullstack', 'java', 'go', 'python'],
    levels: ['junior', 'middle', 'senior'],
    type: 'project',
    difficulty: 2,
    question: '请介绍一个你最近参与度最高的项目，重点说一下项目背景、你的职责、技术栈，以及你解决过的一个关键问题。',
    keywords: ['项目背景', '职责', '技术栈', '问题', '结果'],
    referenceAnswer: '一个完整的项目介绍应该包含业务背景、项目目标、个人职责、核心技术栈、关键难点、解决方案和结果指标。回答时要避免只罗列技术名词，应说明自己具体做了什么，以及方案带来的效果。',
    excellentAnswer: '我最近参与的是一个订单履约系统，目标是提升下单后库存确认和发货链路的稳定性。我主要负责订单状态流转、库存扣减一致性和消息重试机制。技术上使用 Spring Boot、MySQL、Redis 和 RabbitMQ。项目里比较关键的问题是订单创建成功但库存消息偶发失败，我通过本地消息表、幂等消费和定时补偿保证最终一致性，最后把人工处理异常订单的比例明显降了下来。',
    followUps: [
      '这个项目里你个人贡献最大的一部分是什么？',
      '如果流量增长 10 倍，你会优先改哪里？',
      '这个方案有没有你后来觉得可以改进的地方？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '个人职责', '技术栈', '关键问题'],
      goodToHave: ['指标结果', '取舍原因', '复盘改进'],
      redFlags: ['只讲团队做了什么', '没有具体个人贡献', '没有业务背景']
    }
  },
  {
    id: 'redis_001',
    category: 'Redis',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: 'Redis 为什么快？',
    keywords: ['内存', 'I/O 多路复用', '单线程', '数据结构', '协议'],
    referenceAnswer: 'Redis 快主要因为数据存储在内存中，核心命令执行路径短；它使用 I/O 多路复用处理大量连接；早期核心命令采用单线程模型，减少锁竞争和上下文切换；内部数据结构针对常见操作做了优化；同时 RESP 协议相对简单。',
    excellentAnswer: '我会从几个方面看。首先 Redis 主要基于内存读写，延迟很低。其次它用了 I/O 多路复用，可以用较少线程处理大量连接。第三，Redis 的核心命令长期采用单线程执行，避免了多线程锁竞争和频繁上下文切换。再加上 hash、skiplist、quicklist 等数据结构针对典型场景做了优化，所以它快不是单纯因为内存，而是内存、网络模型、线程模型和数据结构共同作用。',
    followUps: [
      'Redis 单线程为什么还能支撑高并发？',
      'Redis 6.0 引入多线程主要解决什么问题？',
      '如果线上 Redis 突然变慢，你会怎么排查？'
    ],
    scoringRubric: {
      mustHave: ['内存', 'I/O 多路复用'],
      goodToHave: ['单线程模型', '数据结构优化', '协议简单'],
      redFlags: ['只回答因为是内存数据库']
    }
  },
  {
    id: 'mysql_001',
    category: 'MySQL',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: 'MySQL 索引为什么能提升查询速度？',
    keywords: ['B+ 树', '减少扫描', '有序', '回表', '覆盖索引'],
    referenceAnswer: 'MySQL 常用 InnoDB 索引基于 B+ 树。索引通过有序结构减少数据扫描范围，把全表扫描变成树上的快速定位。聚簇索引叶子节点存储整行数据，二级索引叶子节点存储主键值，可能需要回表。覆盖索引可以直接从索引拿到查询字段，减少回表成本。',
    excellentAnswer: '索引的核心价值是减少扫描量。以 InnoDB 为例，B+ 树索引是有序的，可以通过较少的层级定位到目标范围，而不是把整张表扫一遍。主键索引的叶子节点就是行数据，二级索引叶子节点存的是主键，所以通过二级索引查非索引字段可能需要回表。如果查询字段都在索引里，就可以走覆盖索引，进一步减少 I/O。',
    followUps: [
      '什么情况下索引会失效？',
      '为什么 InnoDB 常用 B+ 树而不是哈希表？',
      '联合索引的最左前缀原则是什么？'
    ],
    scoringRubric: {
      mustHave: ['B+ 树', '减少扫描范围'],
      goodToHave: ['聚簇索引', '回表', '覆盖索引'],
      redFlags: ['只说索引类似目录但没有解释机制']
    }
  },
  {
    id: 'mysql_002',
    category: 'MySQL',
    skill: 'MySQL',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请解释 MySQL 事务隔离级别、MVCC 和幻读之间的关系。线上出现死锁时你会怎么排查？',
    keywords: ['事务隔离级别', 'MVCC', 'Read View', '幻读', '死锁排查'],
    referenceAnswer: 'MySQL 常见隔离级别包括读未提交、读已提交、可重复读和串行化。InnoDB 通过 MVCC 和 Read View 让普通快照读在不加锁的情况下读取一致性版本；读已提交通常每次查询生成新的 Read View，可重复读通常在事务内复用 Read View。幻读是同一事务里按相同条件读取到新插入的记录，InnoDB 在可重复读下对快照读主要依赖 MVCC，对当前读、更新和加锁读会结合 next-key lock 限制范围插入。死锁排查要看错误日志、SHOW ENGINE INNODB STATUS、事务持锁和等待关系，再结合 SQL 顺序、索引命中和锁范围收敛优化。',
    excellentAnswer: '我会先把隔离级别和实现机制分开讲。事务隔离级别定义的是并发读写下允许看到什么现象；InnoDB 的 MVCC 是实现一致性读的重要手段，核心是版本链和 Read View。读已提交下一条语句通常会生成新的 Read View，所以可能看到其他事务已提交的新数据；可重复读下事务内快照读通常复用同一个 Read View，所以多次读结果更稳定。幻读本质是范围查询里出现了之前不存在的新行，InnoDB 对普通快照读用 MVCC 避免读到不该看到的版本，对当前读或加锁读会用 next-key lock 锁住索引范围，防止其他事务插入命中的记录。线上死锁我会先收集死锁日志和 SHOW ENGINE INNODB STATUS，确认两个事务分别持有什么锁、等待什么锁，再看 SQL 是否走了合适索引、是否访问顺序不一致、是否范围锁过大，优化方向包括统一加锁顺序、补充索引缩小锁范围、拆小事务和减少事务内慢操作。',
    followUps: [
      '读已提交和可重复读在 Read View 生成时机上有什么区别？',
      'next-key lock 为什么依赖索引范围？如果没有合适索引会有什么风险？',
      '如果两个转账事务互相等待导致死锁，你会从代码和 SQL 两侧怎么改？'
    ],
    scoringRubric: {
      mustHave: ['事务隔离级别', 'MVCC', 'Read View', '幻读'],
      goodToHave: ['next-key lock', '死锁排查', '索引命中', '统一加锁顺序'],
      redFlags: ['把 MVCC 说成简单加锁', '认为可重复读一定完全没有幻读问题', '死锁只说重试不分析锁等待关系']
    }
  },
  {
    id: 'mysql_003',
    category: 'MySQL',
    skill: 'MySQL',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '线上有一条 MySQL 查询突然变慢，你会怎么定位和优化？请重点说明慢日志、Explain 和索引调整的判断思路。',
    keywords: ['慢查询日志', 'Explain', '索引命中', '扫描行数', 'SQL 改写'],
    expectedPoints: ['确认慢查询范围', '查看 Explain 执行计划', '判断索引是否命中', '关注扫描行数和排序临时表', '结合业务改写 SQL'],
    referenceAnswer: '定位慢查询通常先确认影响范围和慢查询 SQL，可以通过慢查询日志、监控和调用链找到具体语句。然后用 Explain 查看执行计划，重点关注 type、possible_keys、key、rows、filtered、Extra 等字段，判断是否走了合适索引、扫描行数是否过大、是否出现 filesort 或 temporary。优化方向包括补充或调整联合索引、避免索引失效、减少返回字段和扫描范围、改写 SQL、分页优化，以及在必要时做缓存、分表或离线汇总。',
    excellentAnswer: '我会按“先定位、再解释计划、最后改方案”的顺序回答。第一步先确认这条 SQL 是偶发慢还是持续慢，慢在数据库执行还是网络/应用等待，可以从慢查询日志、APM 调用链、数据库监控里拿到 SQL、耗时、扫描行数和执行频率。第二步用 Explain 看执行计划，重点看 type 是否退化为 ALL，key 是否用了预期索引，rows 是否明显过大，Extra 里有没有 Using filesort、Using temporary、Using where。第三步结合 SQL 条件和业务语义优化：如果 where、order by、group by 没有合适索引，就考虑联合索引并遵守最左前缀；如果函数、隐式类型转换或前导模糊匹配导致索引失效，就改写条件；如果深分页慢，可以改成基于游标或延迟关联；如果统计类查询频繁，可以做汇总表或缓存。最后还要压测或灰度验证，避免新索引带来写入成本和存储成本。',
    commonMistakes: [
      '只说加索引，但不看 Explain 和查询条件是否真的能命中。',
      '看到 rows 大就直接分库分表，跳过 SQL 改写和索引设计。',
      '只关注查询耗时，忽略执行频率、返回行数、写入成本和业务可接受延迟。'
    ],
    followUps: [
      'Explain 里 type、key、rows 和 Extra 分别能帮你判断什么？',
      '联合索引应该怎么设计，为什么要关注最左前缀？',
      '如果是深分页导致慢查询，你会怎么改？'
    ],
    scoringRubric: {
      mustHave: ['慢查询日志', 'Explain', '索引命中', '扫描行数'],
      goodToHave: ['filesort', 'temporary', '联合索引', 'SQL 改写', '深分页优化'],
      redFlags: ['一上来只说加索引', '不会解释执行计划字段', '不考虑新索引的写入和存储成本']
    }
  },
  {
    id: 'network_001',
    category: '网络',
    skill: '网络',
    roles: ['backend', 'frontend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '请解释 TCP 三次握手和四次挥手的过程，以及为什么建立连接需要三次握手。线上接口偶发超时，你会从网络层看哪些信号？',
    keywords: ['TCP', '三次握手', '四次挥手', '超时', '网络排查'],
    expectedPoints: ['三次握手过程', '四次挥手过程', '为什么不是两次握手', '超时排查信号', '连接状态观察'],
    referenceAnswer: 'TCP 三次握手大致是客户端发送 SYN，服务端回复 SYN+ACK，客户端再回复 ACK，双方确认发送和接收能力都正常后连接建立。四次挥手是因为 TCP 是全双工连接，一方发送 FIN 表示自己不再发送数据，另一方 ACK 后仍可能继续发送剩余数据，等它也发送 FIN，再由对端 ACK 后连接关闭。三次握手的价值在于避免历史重复连接请求造成误连接，同时确认双方收发能力。线上接口偶发超时可以看 DNS、连接建立耗时、TCP 重传、连接数、SYN backlog、带宽、跨机房链路、负载均衡和客户端重试等信号。',
    excellentAnswer: '我会先讲连接建立：第一次客户端发 SYN，表示想建立连接并带上初始序列号；第二次服务端返回 SYN+ACK，说明服务端收到了客户端请求，也把自己的初始序列号发给客户端；第三次客户端发 ACK，服务端收到后双方都确认对方的发送和接收能力正常。之所以不是两次，是为了避免旧的 SYN 报文在网络里滞留后被服务端误认为新连接，也无法让服务端确认客户端已经收到自己的响应。关闭连接通常需要四次，是因为 TCP 是全双工，一端不发了不代表另一端也发完了，所以 FIN 和 ACK 往往分开。排查接口偶发超时时，我会把网络层拆成域名解析、建连、传输和网关四段：看 DNS 耗时、TCP connect 耗时、重传率、连接池耗尽、SYN backlog、带宽打满、跨机房 RTT、负载均衡 5xx/超时，以及客户端是否有超时重试放大流量。',
    commonMistakes: [
      '只背 SYN、ACK 顺序，但说不清为什么需要三次握手。',
      '把四次挥手说成固定永远四个包，忽略 FIN 和 ACK 可能合并。',
      '排查超时时只看服务端日志，不看连接建立、重传、带宽和负载均衡。'
    ],
    followUps: [
      '为什么两次握手不能可靠避免历史连接请求造成的问题？',
      'TIME_WAIT 的作用是什么？过多时你会怎么判断风险？',
      '如果只有跨机房请求超时明显增多，你会怎么继续缩小范围？'
    ],
    scoringRubric: {
      mustHave: ['三次握手过程', '四次挥手过程', '为什么三次握手', '超时排查'],
      goodToHave: ['历史 SYN', 'TIME_WAIT', 'TCP 重传', '连接池', '负载均衡'],
      redFlags: ['只背流程没有解释原因', '把超时全部归因于服务器慢', '完全没有网络指标意识']
    }
  },
  {
    id: 'network_002',
    category: '网络',
    skill: '网络',
    roles: ['backend', 'frontend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '一个 HTTP 接口偶发超时，你会如何从 DNS、TCP/TLS、连接池、网关和服务端链路逐层定位？HTTPS 相比 HTTP 多了哪些关键开销和风险点？',
    keywords: ['HTTP', 'HTTPS', 'DNS', 'TLS', '连接池', '接口超时'],
    expectedPoints: ['DNS 解析耗时', 'TCP/TLS 建连耗时', '连接池耗尽', '网关和负载均衡', '服务端处理耗时', '客户端重试放大'],
    referenceAnswer: 'HTTP 接口超时排查要先拆分链路，而不是直接判断服务端慢。可以从 DNS 解析、TCP connect、TLS 握手、连接池获取连接、网关或负载均衡转发、服务端处理、下游依赖和响应传输几个阶段看耗时。HTTPS 相比 HTTP 多了 TLS 握手、证书校验、加解密和证书过期/域名不匹配等风险。排查时要结合客户端耗时分段、网关日志、服务端访问日志、连接池指标、重试次数、错误码、上游下游调用链和网络重传等信号，判断是建连慢、连接复用失败、网关拥塞、服务端慢还是下游拖慢。',
    excellentAnswer: '我会先把“超时”拆成具体阶段。第一段是 DNS，看解析耗时、缓存命中和是否有异常域名解析；第二段是建连，看 TCP connect 耗时、重传、跨机房 RTT；第三段是 HTTPS 特有的 TLS 握手，看证书校验、会话复用和握手耗时；第四段是连接池，看是否连接池耗尽、空闲连接失效、keep-alive 配置不一致；第五段看网关和负载均衡，比如是否某个 upstream 慢、排队、限流或 5xx 增多；最后才看服务端应用和下游依赖。HTTPS 的额外成本主要来自 TLS 握手和加解密，风险点包括证书过期、SNI/域名不匹配、协议版本或加密套件兼容问题。真实落地时我会用客户端分段耗时、网关访问日志、APM trace 和连接池监控一起对齐时间线，同时关注重试是否把偶发慢放大成流量峰值。',
    commonMistakes: [
      '接口超时直接归因于服务端慢，没有拆 DNS、建连、TLS、网关和下游阶段。',
      '只知道 HTTPS 更安全，但讲不清 TLS 握手、证书校验和会话复用的影响。',
      '忽略连接池耗尽、keep-alive 失效和客户端重试放大这些常见生产问题。'
    ],
    followUps: [
      '如何判断超时发生在建连阶段还是服务端处理阶段？',
      'HTTPS 的 TLS 会话复用能减少什么开销？',
      '如果超时只发生在少量客户端或某个机房，你会怎么缩小范围？'
    ],
    scoringRubric: {
      mustHave: ['DNS', 'TCP/TLS 建连', '连接池', '网关和负载均衡', '服务端处理'],
      goodToHave: ['TLS 会话复用', '证书风险', '客户端重试', 'APM trace', '网络重传'],
      redFlags: ['只看服务端日志', '不会拆分超时阶段', '忽略 HTTPS 握手和证书问题']
    }
  },
  {
    id: 'network_003',
    category: '网络',
    skill: '网络',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请说明常见 HTTP 状态码的语义，以及接口重试、超时和幂等策略应该怎么设计，才能避免重试风暴和重复写入？',
    keywords: ['HTTP 状态码', '幂等', '重试', '退避', '重试风暴'],
    expectedPoints: ['状态码语义', '可重试错误判断', '幂等键设计', '超时和重试退避', '重试风暴防护'],
    referenceAnswer: 'HTTP 状态码要先按大类理解：2xx 表示成功，3xx 表示重定向，4xx 通常是客户端请求问题，5xx 通常是服务端或网关问题。重试策略不能看到错误就无脑重试，通常只对超时、连接失败、部分 5xx、429 等临时性错误重试；对参数错误、鉴权失败等 4xx 不应重试。写接口必须考虑幂等，可以用业务唯一单号、幂等键、去重表、唯一索引或状态机防止重复写入。重试要设置次数上限、指数退避、抖动和熔断限流，避免大量客户端同时重试把下游打垮。',
    excellentAnswer: '我会先把状态码和调用策略关联起来。2xx 是成功；301/302/307/308 要关注方法是否保持和重定向循环；400、401、403、404 多数是请求或权限问题，通常不应该重试；408、429、502、503、504 这类更可能是临时性问题，可以在有限次数内重试。重试策略一定要和超时、限流、熔断一起设计：每次请求要有总超时和单次超时，重试次数有限，使用指数退避和随机抖动，避免所有客户端在同一时间再次打到服务端。对于写接口，重试前必须设计幂等，比如客户端生成 idempotency key，服务端用唯一索引或幂等表记录请求结果；订单、支付这类链路还要结合业务单号、状态机和去重消费，保证重复请求返回同一结果而不是重复扣款或重复创建。最后还要有监控，关注重试率、429/5xx、幂等冲突数和下游错误，防止重试把局部故障放大成全链路故障。',
    commonMistakes: [
      '把所有 5xx 或所有超时都无限重试，没有次数上限、退避和熔断。',
      '只在客户端做防重复点击，没有服务端幂等键、唯一约束或状态机保护。',
      '看到 4xx 也重试，忽略参数错误、鉴权失败和资源不存在这类不可恢复错误。'
    ],
    followUps: [
      '哪些 HTTP 状态码适合重试，哪些不适合？为什么？',
      '支付或下单接口的幂等键应该放在哪里，服务端怎么存？',
      '指数退避和随机抖动分别解决什么问题？'
    ],
    scoringRubric: {
      mustHave: ['状态码语义', '可重试错误判断', '幂等键', '重试上限', '退避'],
      goodToHave: ['随机抖动', '熔断限流', '唯一索引', '状态机', '重试率监控'],
      redFlags: ['无脑重试所有失败请求', '写接口没有服务端幂等', '不区分 4xx 和 5xx']
    }
  },
  {
    id: 'os_001',
    category: '操作系统',
    skill: '操作系统',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '请说明进程和线程的区别，以及一次线上服务 CPU 飙高时，你会如何从操作系统角度定位问题？',
    keywords: ['进程', '线程', '上下文切换', 'CPU', '系统排查'],
    expectedPoints: ['进程和线程区别', '资源隔离与共享', '上下文切换成本', 'CPU 飙高定位', '线程栈或热点函数分析'],
    referenceAnswer: '进程是资源分配的基本单位，拥有相对独立的地址空间、文件句柄等资源；线程是 CPU 调度的基本单位，同一进程内线程共享进程资源，但各自有栈和执行上下文。线程切换通常比进程切换轻，但线程过多也会带来上下文切换、锁竞争和调度开销。线上 CPU 飙高时，可以先确认是用户态还是内核态、单核打满还是整体打满，再看进程和线程级 CPU，占用高的线程可以结合线程栈、火焰图或性能采样定位热点代码，同时关注死循环、频繁 GC、锁自旋、系统调用和 I/O 等待等原因。',
    excellentAnswer: '我会先把概念讲清楚：进程更像资源容器，有独立地址空间，进程间通信成本相对更高；线程运行在进程里，共享堆、文件描述符等资源，但每个线程有自己的栈、寄存器上下文和调度状态。线程更轻量，但不是越多越好，线程过多会造成上下文切换增加，锁竞争也可能把 CPU 消耗在等待或自旋上。排查 CPU 飙高时，我会先看监控确认是某台机器、某个进程还是某个时间段整体升高，再用 top、pidstat 或类似工具定位到具体进程和线程；如果是 Java 服务，会把高 CPU 线程 id 转换成十六进制去 jstack 里找对应线程栈；如果是 Go 或 Python，也会结合 pprof、采样或火焰图看热点函数。最后再区分是业务死循环、热点计算、频繁 GC、锁竞争、系统调用过多，还是内核态网络/磁盘问题。',
    commonMistakes: [
      '只说进程包含线程，但讲不清资源隔离、共享和调度差异。',
      'CPU 飙高只说重启服务，没有定位到进程、线程和热点代码。',
      '忽略上下文切换、锁竞争、GC 和内核态 CPU 等常见原因。'
    ],
    followUps: [
      '线程越多一定能提高吞吐吗？什么时候反而会变慢？',
      '如果 CPU 高但接口吞吐没有上升，你会怀疑哪些问题？',
      'Java 服务里如何把 top 看到的高 CPU 线程对应到 jstack 栈？'
    ],
    scoringRubric: {
      mustHave: ['进程和线程区别', '资源隔离与共享', 'CPU 飙高定位', '线程栈'],
      goodToHave: ['上下文切换', '锁竞争', 'GC', '火焰图', '用户态和内核态'],
      redFlags: ['把进程和线程说成完全一样', '只会重启不定位', '没有线程级排查意识']
    }
  },
  {
    id: 'os_002',
    category: '操作系统',
    skill: '操作系统',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请解释虚拟内存、页缓存和 Swap 的作用。线上服务内存持续上涨甚至 OOM 时，你会怎么定位？',
    keywords: ['虚拟内存', '页缓存', 'Swap', 'OOM', '内存排查'],
    expectedPoints: ['虚拟内存作用', '页缓存作用', 'Swap 风险', '区分进程内存和系统缓存', 'OOM 排查路径'],
    referenceAnswer: '虚拟内存为进程提供连续、独立的地址空间，操作系统通过页表把虚拟地址映射到物理内存，并配合权限隔离和按需加载。页缓存是操作系统用内存缓存磁盘文件内容，用来提升文件读写性能，它占用内存但通常可以在内存紧张时回收。Swap 是把不活跃内存页换出到磁盘，能缓解物理内存不足，但会显著增加延迟。线上内存上涨或 OOM 时，要先区分是进程真实占用增长、页缓存增长、内存泄漏、堆外内存、连接/线程过多，还是容器 limit 设置不合理，再结合监控、进程内存、堆分析、GC 日志、OOM 日志和系统指标定位。',
    excellentAnswer: '我会先把三个概念分开。虚拟内存解决的是进程地址空间隔离和按需映射问题，每个进程看到的是自己的虚拟地址，真正落到物理内存要通过页表。页缓存是系统为了加速文件 I/O 把磁盘数据缓存到内存里，所以 free 看到内存少不一定是坏事，要看 available 和 cache 是否可回收。Swap 是内存不足时把部分页换到磁盘，能避免马上失败，但对延迟敏感的服务通常很危险，因为访问被换出的页会触发磁盘 I/O。排查 OOM 时我会先确认是宿主机 OOM、容器 OOM 还是语言运行时 OOM；再看 RSS、VSZ、cache、swap、container limit 和 OOM killer 日志；如果是 Java，会看堆、直接内存、线程栈、GC 日志和 heap dump；Go 或 Python 会结合 pprof、tracemalloc 或对象统计。最后再判断是业务缓存无界、对象泄漏、批量查询过大、连接数/线程数过多，还是页缓存或容器配置造成的误判。',
    commonMistakes: [
      '看到 free 内存少就判断内存泄漏，忽略页缓存和 available。',
      '把虚拟内存等同于物理内存，不区分 VSZ、RSS 和容器限制。',
      'OOM 排查只看应用日志，不看 OOM killer、cgroup limit、堆外内存和线程栈。'
    ],
    followUps: [
      '为什么 Linux 上 free 内存很少不一定代表内存不足？',
      'RSS、VSZ 和容器 memory limit 分别说明什么？',
      '如果 Java 堆不大但进程 RSS 很高，你会怀疑哪些堆外来源？'
    ],
    scoringRubric: {
      mustHave: ['虚拟内存作用', '页缓存', 'Swap', 'OOM 排查'],
      goodToHave: ['RSS', 'VSZ', '容器 limit', '堆外内存', 'OOM killer'],
      redFlags: ['把页缓存直接当内存泄漏', '只会重启或加内存', '不区分宿主机 OOM 和容器 OOM']
    }
  },
  {
    id: 'os_003',
    category: '操作系统',
    skill: '操作系统',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请解释 I/O 多路复用、select/poll/epoll 的区别，以及 Reactor 模型为什么适合高并发网络服务。',
    keywords: ['I/O 多路复用', 'select', 'poll', 'epoll', 'Reactor'],
    expectedPoints: ['I/O 多路复用价值', 'select 和 poll 局限', 'epoll 优势', 'Reactor 事件分发', '高并发连接处理'],
    referenceAnswer: 'I/O 多路复用的核心是用一个或少量线程同时监听多个文件描述符的就绪事件，避免一个连接一个线程带来的大量阻塞和线程切换。select 和 poll 都需要把关注的文件描述符集合交给内核，并在返回后遍历查找就绪项；select 还有 fd 数量限制。epoll 通过在内核维护关注列表，并用就绪队列返回活跃事件，减少了每次重复传递和全量扫描的成本，更适合大量连接但活跃连接较少的场景。Reactor 模型基于事件循环，监听 I/O 就绪事件，再把读写、解码和业务处理分发给对应 handler 或 worker，因此常用于高并发网络框架。',
    excellentAnswer: '我会先说它解决的问题：高并发连接下，如果每个连接都阻塞等待 I/O，会产生大量线程和上下文切换。I/O 多路复用让线程先把多个 fd 注册给内核，等这些 fd 中有读写事件就绪时再回来处理。select 的问题是 fd 集合大小有限，并且每次调用都要传入集合，返回后还要遍历；poll 取消了固定大小限制，但仍然需要遍历；epoll 把关注的 fd 放在内核里维护，事件就绪后放入就绪队列，应用拿到的是活跃事件，所以在大量长连接场景下效率更好。Reactor 可以理解为“事件循环 + 事件分发”：主线程或 event loop 负责监听连接和 I/O 就绪，业务 handler 处理读写和协议解析，耗时任务再交给 worker 池，避免阻塞事件循环。Redis、Netty、Nginx 这类系统的高并发能力，都和事件驱动、非阻塞 I/O、合理的线程模型有关。',
    commonMistakes: [
      '只说 epoll 比 select 快，但讲不清全量扫描和就绪队列的差异。',
      '把 I/O 多路复用理解成多线程并发处理业务，忽略它关注的是 I/O 就绪通知。',
      'Reactor 模型里把耗时业务放进事件循环，忽略阻塞 event loop 的风险。'
    ],
    followUps: [
      '为什么 epoll 更适合大量长连接但活跃连接不多的场景？',
      'Reactor 的事件循环里为什么不能执行耗时业务？',
      'Redis 单线程处理命令为什么还能支撑高并发连接？'
    ],
    scoringRubric: {
      mustHave: ['I/O 多路复用', 'select', 'poll', 'epoll', 'Reactor'],
      goodToHave: ['就绪队列', '事件循环', '非阻塞 I/O', '上下文切换', 'worker 池'],
      redFlags: ['把 I/O 多路复用等同于多线程', '不会解释 epoll 的优势', '忽略事件循环阻塞风险']
    }
  },
  {
    id: 'java_001',
    category: 'Java',
    roles: ['backend', 'java'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: 'HashMap 的底层原理是什么？',
    keywords: ['数组', '链表', '红黑树', 'hash', '扩容'],
    referenceAnswer: 'Java HashMap 底层主要是数组加链表或红黑树。通过 key 的 hash 值定位数组桶，哈希冲突时使用链表存储；当链表长度达到阈值且数组容量满足条件时会树化为红黑树。扩容时容量通常翻倍，并重新分布元素以降低冲突。',
    excellentAnswer: 'HashMap 可以理解为一个桶数组。put 时先根据 key 的 hash 定位桶位置，如果没有冲突就直接放入；如果冲突，就在桶里用链表或红黑树组织节点。Java 8 以后，当链表过长并且数组容量达到条件，会把链表转成红黑树，避免极端情况下查询退化得太厉害。扩容时容量翻倍，元素会根据新的容量重新分布，所以频繁扩容会有成本。',
    followUps: [
      'HashMap 为什么线程不安全？',
      'HashMap 和 ConcurrentHashMap 有什么区别？',
      '为什么 HashMap 容量通常是 2 的幂？'
    ],
    scoringRubric: {
      mustHave: ['数组', '链表', '哈希冲突'],
      goodToHave: ['红黑树', '扩容', '2 的幂'],
      redFlags: ['把 HashMap 说成单纯数组或单纯链表']
    }
  },
  {
    id: 'java_005',
    category: 'Java',
    skill: 'Java',
    roles: ['backend', 'java'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请说明 Java 线程池的核心参数、任务提交流程和拒绝策略。线上线程池打满、队列堆积时，你会怎么排查和治理？',
    keywords: ['线程池', '线程池参数', '队列堆积', '拒绝策略', 'CallerRunsPolicy', '线程池打满'],
    expectedPoints: ['核心参数含义', '任务提交流程', '拒绝策略', '队列堆积排查', '线程池隔离和监控'],
    referenceAnswer: 'Java 线程池常见核心参数包括 corePoolSize、maximumPoolSize、keepAliveTime、workQueue、threadFactory 和 rejectedExecutionHandler。任务提交时，如果运行线程数小于 corePoolSize，会优先创建核心线程；否则进入队列；队列满且线程数小于 maximumPoolSize 时创建非核心线程；仍无法接收时触发拒绝策略。常见拒绝策略包括 AbortPolicy、CallerRunsPolicy、DiscardPolicy 和 DiscardOldestPolicy。线上线程池打满要看活跃线程数、队列长度、任务耗时、下游依赖、拒绝次数和线程栈，治理方向包括隔离不同业务线程池、调整队列和线程数、设置超时、限流降级、拆分慢任务和补充监控告警。',
    excellentAnswer: '我会先讲流程，而不是只背参数。线程池收到任务后，先看当前线程数是否小于 corePoolSize，是的话直接创建核心线程执行；否则尝试放入 workQueue；如果队列也满了，再看是否能扩到 maximumPoolSize；如果仍然不能接收，就走拒绝策略。拒绝策略里 AbortPolicy 会抛异常，CallerRunsPolicy 会让提交任务的线程自己执行，从而形成一定反压，DiscardPolicy 和 DiscardOldestPolicy 则会丢任务，业务上要非常谨慎。线上打满时，我会先看是线程数打满还是队列堆积，结合任务耗时分布、下游接口耗时、线程栈和拒绝次数判断是下游慢、任务过重、流量突增还是线程池混用。治理上不会只盲目加线程，而是做业务隔离、核心链路限流、任务超时、队列长度告警、慢任务拆分；对于关键任务，还要设计补偿或重试，避免被拒绝后静默丢失。',
    commonMistakes: [
      '只背 corePoolSize 和 maximumPoolSize，但讲不清任务先入队还是先扩容。',
      '线程池打满只说把线程数调大，忽略下游慢、队列堆积和线程池隔离。',
      '随意使用丢弃策略，没有说明任务丢失后的业务后果和补偿。'
    ],
    followUps: [
      '为什么无界队列可能让 maximumPoolSize 形同虚设？',
      'CallerRunsPolicy 为什么能形成反压？它有什么风险？',
      '如果一个线程池同时跑核心订单任务和低优先级通知任务，会有什么问题？'
    ],
    scoringRubric: {
      mustHave: ['核心线程数', '最大线程数', '队列', '拒绝策略', '任务提交流程'],
      goodToHave: ['CallerRunsPolicy', '线程池隔离', '队列监控', '线程栈', '限流降级'],
      redFlags: ['只会背参数名', '打满后只会加线程', '不考虑任务丢失和业务补偿']
    }
  },
  {
    id: 'java_006',
    category: 'Java',
    skill: 'Java',
    roles: ['backend', 'java'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请说明 synchronized、ReentrantLock、volatile 和 ConcurrentHashMap 分别解决什么并发问题。线上出现锁竞争或并发安全问题时，你会怎么定位？',
    keywords: ['synchronized', 'ReentrantLock', 'volatile', 'ConcurrentHashMap', '锁竞争'],
    expectedPoints: ['synchronized 和 ReentrantLock 区别', 'volatile 可见性和禁止重排序', 'ConcurrentHashMap 并发安全机制', '锁竞争定位', '选择并发工具的场景'],
    referenceAnswer: 'synchronized 和 ReentrantLock 都能实现互斥，但 ReentrantLock 提供可中断锁、超时获取锁、公平锁和多个 Condition 等更灵活能力；synchronized 由 JVM 管理，语义简单，退出同步块会自动释放锁。volatile 主要保证变量可见性和禁止指令重排序，但不保证复合操作原子性。ConcurrentHashMap 用分段或桶级别并发控制、CAS 和 synchronized 等机制提升并发访问安全性。线上锁竞争可以看线程栈、锁等待、阻塞线程数、接口耗时和 CPU 状态，定位是否临界区过大、锁粒度过粗、热点 key 或同步调用导致阻塞。',
    excellentAnswer: '我会先按问题类型区分。需要互斥保护临界区时可以用 synchronized 或 ReentrantLock；如果只是一个状态标记，需要让其他线程及时看见，并避免重排序影响，可以用 volatile，但像 i++ 这种复合操作不能只靠 volatile。ReentrantLock 比 synchronized 更灵活，比如 tryLock、lockInterruptibly、公平锁和多个 Condition，但也要求 finally 里手动 unlock。ConcurrentHashMap 解决的是并发读写 Map 的线程安全和性能问题，不能简单用 HashMap 加外层大锁替代。线上怀疑锁竞争时，我会先看接口耗时、线程状态和阻塞数量，再抓线程栈或用监控看 blocked/waiting 线程集中在哪个锁；如果发现大量线程卡在同一段同步代码，会检查临界区是否包含慢 I/O、远程调用、大循环或热点资源。治理上通常会缩小锁粒度、减少锁内耗时、拆分热点 key、用无锁或读写分离结构，必要时做限流和降级。',
    commonMistakes: [
      '认为 volatile 可以保证所有线程安全，忽略复合操作的原子性问题。',
      '使用 ReentrantLock 后没有在 finally 中释放锁，导致异常路径死锁。',
      '线上锁竞争只说加机器，不看线程栈、临界区大小和热点资源。'
    ],
    followUps: [
      'volatile 为什么不能保证 i++ 的线程安全？',
      'ReentrantLock 相比 synchronized 适合哪些更复杂的场景？',
      '如果线程栈显示大量线程 BLOCKED 在同一个锁上，你会怎么优化？'
    ],
    scoringRubric: {
      mustHave: ['synchronized', 'ReentrantLock', 'volatile', 'ConcurrentHashMap', '锁竞争'],
      goodToHave: ['可见性', '原子性', 'CAS', '线程栈', '锁粒度'],
      redFlags: ['把 volatile 当成万能锁', '忘记释放 ReentrantLock', '不会定位阻塞线程']
    }
  },
  {
    id: 'frontend_001',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: '如果一个页面首屏加载很慢，你会怎么定位和优化？',
    keywords: ['性能指标', '网络', '资源体积', '渲染', '缓存'],
    referenceAnswer: '可以先用 Lighthouse、Performance、Network 等工具定位瓶颈，关注 FCP、LCP、TTFB、资源加载瀑布图和主线程耗时。优化方向包括减少 JS/CSS 体积、代码分割、图片压缩和懒加载、合理缓存、SSR/SSG、接口聚合、减少阻塞渲染资源和长任务。',
    excellentAnswer: '我会先区分是网络慢、服务端慢、资源太大还是渲染慢。工具上看 Lighthouse 指标和 Performance 主线程，再看 Network 的瀑布图、资源大小和 TTFB。如果瓶颈在资源体积，会做代码分割、移除无用依赖、压缩图片和懒加载；如果是渲染阻塞，会处理关键 CSS、延迟非关键脚本；如果是接口慢，会考虑缓存、接口聚合或 SSR/SSG。',
    followUps: [
      'LCP 慢通常可能是什么原因？',
      '如何减少首屏 JavaScript 体积？',
      'SSR 一定能提升首屏吗？'
    ],
    scoringRubric: {
      mustHave: ['先定位', '性能指标', 'Network 或 Performance'],
      goodToHave: ['代码分割', '图片优化', '缓存', 'SSR'],
      redFlags: ['直接说加缓存但不定位问题']
    }
  },
  {
    id: 'system_001',
    category: '系统设计',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '如果让你设计一个短链接系统，你会怎么设计？',
    keywords: ['短码生成', '重定向', '存储', '缓存', '高可用', '统计'],
    referenceAnswer: '短链接系统通常包含创建短链和访问重定向两条核心链路。创建时需要生成唯一短码，保存短码到长链接的映射；访问时根据短码查询映射并返回 301 或 302 重定向。高并发下可以使用缓存承接热点访问，数据库做持久化，短码生成可用号段发放、哈希或分布式 ID，并考虑防冲突、过期时间、访问统计、限流和风控。',
    excellentAnswer: '我会先拆成写入和读取。写入是用户提交长链接，服务生成唯一短码并保存映射；读取是用户访问短码，系统查到长链接后重定向。短码生成可以用发号器或分布式 ID 再做 Base62 编码，避免冲突。读链路通常压力更大，所以会把短码映射放入 Redis 缓存，DB 做最终存储。还要考虑过期时间、访问统计、恶意链接检测、限流，以及服务和存储的高可用。',
    followUps: [
      '短码如何保证唯一？',
      '301 和 302 重定向怎么选？',
      '热点短链被大量访问时怎么处理？'
    ],
    scoringRubric: {
      mustHave: ['创建短链', '访问重定向', '短码唯一', '存储映射'],
      goodToHave: ['缓存', '统计', '限流', '高可用'],
      redFlags: ['只描述接口不考虑唯一性和读写链路']
    }
  },
  {
    id: 'algorithm_001',
    category: '算法',
    roles: ['backend', 'frontend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'algorithm',
    codeKind: 'algorithm',
    difficulty: 2,
    question: '给定一个整数数组和目标值，如何返回两个数的下标，使它们的和等于目标值？请说明思路和复杂度。',
    keywords: ['哈希表', '一次遍历', '差值', '时间复杂度', '空间复杂度'],
    referenceAnswer: '经典做法是一次遍历数组，用哈希表保存已经遍历过的数字及其下标。对当前数字 x，检查 target - x 是否已经在哈希表中，如果存在就返回两个下标；否则把 x 和下标存入哈希表。时间复杂度 O(n)，空间复杂度 O(n)。',
    excellentAnswer: '我会用哈希表把查找另一个数的成本降到 O(1)。遍历数组时，当前值是 x，需要找的是 target - x。如果这个差值已经在 map 里，说明之前出现过对应数字，直接返回之前下标和当前下标；如果没有，就把当前数字和下标存进去。这样只需要遍历一次，时间复杂度 O(n)，额外空间 O(n)。',
    followUps: [
      '如果数组里有重复数字怎么办？',
      '如果要返回所有组合，思路要怎么改？',
      '如果数组已经有序，是否还有其他解法？'
    ],
    scoringRubric: {
      mustHave: ['哈希表', '一次遍历', '复杂度'],
      goodToHave: ['重复数字处理', '边界情况'],
      redFlags: ['只给双重循环且不说明复杂度']
    }
  },
  {
    id: 'project_002',
    category: '项目经历',
    roles: ['backend', 'frontend', 'fullstack', 'java', 'go', 'python'],
    levels: ['junior'],
    type: 'project',
    difficulty: 1,
    question: '挑一个你最熟悉的项目，说清楚这个项目是做什么的、你具体负责什么、你写过的一个功能是怎么落地的。',
    keywords: ['项目背景', '职责', '技术栈', '场景', '结果'],
    referenceAnswer: '初级候选人的项目题重点不是系统复杂度，而是是否能把业务背景、自己负责的模块、实现过程和结果讲清楚。回答里最好有一个具体功能，说明你自己写了什么代码、遇到了什么问题、最后效果如何。',
    excellentAnswer: '我想讲一个后台工单系统。项目目标是把原来线下流转的售后流程搬到线上，减少人工统计。我的职责是负责工单列表、状态流转和通知模块，技术上用的是 Java、Spring Boot、MySQL 和 Vue。我重点做过一个超时提醒功能，先梳理了不同状态下的超时规则，再通过定时任务扫描待处理工单并触发站内信提醒，最终让客服漏处理工单的情况明显减少。',
    followUps: [
      '这个功能里你自己写的核心逻辑是什么？',
      '实现过程中最卡住你的问题是什么？',
      '如果让你现在重做一次，你会先改哪一块？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '个人职责', '技术栈'],
      goodToHave: ['关键问题', '指标结果', '复盘改进'],
      redFlags: ['只会泛泛描述项目', '说不清自己做了什么', '没有具体功能场景']
    }
  },
  {
    id: 'redis_002',
    category: 'Redis',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '如果线上 Redis 延迟突然升高，你会怎么判断是命令、网络、内存还是持久化导致的问题？',
    keywords: ['先定位', '慢查询', '网络', '内存', '持久化'],
    referenceAnswer: '高级候选人的 Redis 排障题重点在于先建立排查顺序，再把常见瓶颈拆开。通常会先确认现象和影响范围，再看命令耗时、连接和网络、内存碎片与淘汰、以及 AOF/RDB 持久化是否阻塞主线程。',
    excellentAnswer: '我会先确认问题范围，是整体变慢还是部分实例、部分命令变慢，然后结合监控看延迟从什么时候开始抖动。第一步排命令层，查看慢查询和大 key，确认是不是某些命令本身耗时过高。第二步看网络和连接数，包括连接暴涨、网卡带宽、跨机房访问和客户端超时重试。第三步看内存状态，比如是否接近 maxmemory、是否发生频繁淘汰、内存碎片率是否异常。第四步看持久化，如果刚好在做 AOF rewrite 或 RDB fork，也可能带来抖动。最后再结合 CPU、QPS 和实例日志收敛到根因。',
    followUps: [
      '你会怎么快速发现大 key 或热 key？',
      'AOF rewrite 为什么会带来抖动？',
      '如果确认是网络问题，你会怎么继续缩小范围？'
    ],
    scoringRubric: {
      mustHave: ['先定位', '慢查询', '网络', '内存'],
      goodToHave: ['持久化', '大 key', '热 key', '监控时间线'],
      redFlags: ['一上来就重启实例', '只会回答看监控', '没有排查顺序']
    }
  },
  {
    id: 'redis_003',
    category: 'Redis',
    skill: 'Redis',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '数据库更新后，Redis 缓存应该怎么处理才能尽量保证一致性？请说明常见方案、风险点和你在项目里会怎么落地。',
    keywords: ['缓存一致性', '先写数据库', '删除缓存', '消息补偿', '过期兜底'],
    expectedPoints: ['缓存旁路模式', '先写数据库再删除缓存', '删除失败补偿', '过期时间兜底', '并发读写风险'],
    referenceAnswer: '常见做法是缓存旁路模式：读请求先查缓存，未命中再查数据库并回填缓存；写请求先更新数据库，再删除缓存，而不是直接更新缓存。这样可以避免缓存结构复杂或多处写缓存带来的不一致。风险点包括删除缓存失败、并发读写导致旧值回填、主从延迟或事务提交前删除缓存等。落地时通常会给缓存设置合理 TTL，用消息队列、订阅 binlog 或重试任务做删除失败补偿；对强一致要求高的场景要减少缓存使用或引入同步锁、版本号等额外控制。',
    excellentAnswer: '我会先说明这不是绝对强一致方案，而是在性能和一致性之间做取舍。多数业务我会用 cache aside：读时先读 Redis，未命中再读 DB 并写缓存；写时先提交数据库，再删除缓存。优先删除而不是更新缓存，是因为缓存可能是聚合结构，直接更新容易漏字段或漏场景。真正落地时要处理几个边界：第一，删除缓存失败要有重试或消息补偿，比如写入 MQ、订阅 binlog，或者后台任务扫描补偿；第二，缓存必须有 TTL 兜底，防止脏数据无限存在；第三，要注意并发读写，写库后删缓存期间，如果旧查询回填了缓存，可以通过延迟双删、版本号或热点 key 互斥重建降低概率；第四，如果业务要求强一致，比如余额扣减，就不能只依赖缓存一致性方案，应该以数据库事务或专门的一致性链路为准。',
    commonMistakes: [
      '把更新数据库和更新缓存说成一个原子操作，但没有说明失败回滚和补偿。',
      '只说设置过期时间，忽略写入后短时间内的脏读风险。',
      '没有区分强一致业务和最终一致业务，所有场景都套同一套缓存方案。'
    ],
    followUps: [
      '为什么通常建议更新数据库后删除缓存，而不是直接更新缓存？',
      '如果删除缓存失败，你会怎么做补偿和监控？',
      '延迟双删能解决什么问题？它有什么代价和局限？'
    ],
    scoringRubric: {
      mustHave: ['缓存旁路模式', '先写数据库', '删除缓存', '一致性风险'],
      goodToHave: ['消息补偿', 'binlog 订阅', '过期时间兜底', '延迟双删'],
      redFlags: ['认为 Redis 和数据库天然强一致', '只会说更新缓存不提失败场景', '没有任何补偿或兜底机制']
    }
  },
  {
    id: 'frontend_002',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '线上前端页面偶发白屏，你会怎么做故障定位、止血和后续治理？',
    keywords: ['先定位', '监控', '回滚', '错误边界', '治理'],
    referenceAnswer: '高级前端故障题通常要体现三段思路：先判断影响面和版本范围，再选择回滚、降级或热修作为止血手段，最后补齐监控、发布和容错治理。只谈某个技术点而没有处理流程，面试官通常会觉得实战经验不足。',
    excellentAnswer: '我会先确认影响范围，是全量白屏还是部分路由、部分浏览器白屏，再结合埋点和前端监控看是不是某个版本发布后开始出现。止血上优先考虑回滚静态资源版本，或者对问题路由做降级兜底，避免继续扩大影响。定位时我会看 runtime error、资源加载失败、接口超时和 hydration 异常，必要时在入口加错误边界和关键日志。事后治理会补齐 source map 上报、灰度发布、核心页面可用性监控，以及对配置或动态数据做更严格的容错。',
    followUps: [
      '如果 sourcemap 没开，你怎么尽快拿到有效线索？',
      '白屏和接口超时导致的空白态你会怎么区分？',
      '你会怎么设计前端可用性监控指标？'
    ],
    scoringRubric: {
      mustHave: ['先定位', '监控', '回滚'],
      goodToHave: ['错误边界', '治理', '灰度发布', '影响范围'],
      redFlags: ['只会说打开控制台看报错', '没有止血思路', '没有后续治理']
    }
  },
  {
    id: 'system_002',
    category: '系统设计',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['senior'],
    type: 'system-design',
    difficulty: 3,
    question: '设计一个秒杀下单系统，你会怎么保证高并发下的可用性、一致性和防刷？',
    keywords: ['流量削峰', '库存扣减', '异步下单', '幂等', '防刷'],
    referenceAnswer: '秒杀题通常会考察候选人是否能同时处理流量、库存一致性和风控问题。一个较完整的回答应该覆盖入口限流、库存预扣或原子扣减、异步化链路、重复下单控制，以及异常补偿和监控治理。',
    excellentAnswer: '我会按入口、核心交易链路和兜底治理来拆。入口层先做活动预热、CDN 和网关限流，必要时配合验证码或人机校验做防刷。库存层优先在 Redis 或内存里做原子预扣，避免所有请求直接打数据库，再通过消息队列异步创建订单。真正落库时要保证幂等，比如用用户加商品维度的唯一约束防止重复下单，同时要有超时取消和库存回补机制。最后还要关注监控告警、热点隔离、降级开关和故障演练，不然系统即使能扛住流量，也未必能稳定成交。',
    followUps: [
      '你会怎么处理 Redis 预扣成功但订单落库失败？',
      '为什么不直接数据库扣库存？',
      '活动开始瞬间的热点流量怎么防止把某个实例打穿？'
    ],
    scoringRubric: {
      mustHave: ['流量削峰', '库存扣减', '异步下单', '防刷'],
      goodToHave: ['幂等', '补偿', '监控', '降级'],
      redFlags: ['只讲抢购接口', '没有一致性思路', '没有风控和限流']
    }
  },
  {
    id: 'python_001',
    category: 'Python',
    roles: ['python', 'backend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: 'Python 里生成器和普通列表相比，适合用在什么场景？你会怎么解释它的价值？',
    keywords: ['惰性计算', '迭代器', '内存占用', 'yield', '流式处理'],
    referenceAnswer: '回答这题的重点是说明生成器不是语法技巧，而是用来按需产出数据、降低内存占用并保持可迭代接口的一种手段。通常会结合 yield、迭代器协议和大数据量或流式处理场景来说明。',
    excellentAnswer: '我会先从使用场景讲。普通列表会一次性把所有结果放进内存，适合数据量可控、需要反复随机访问的场景；生成器更适合大批量数据、分页拉取或流式处理，因为它基于 yield 按需产出，每次 next 才继续往下执行。它本质上实现了迭代器协议，所以 for 循环可以直接消费。价值主要在于节省内存、让处理链路更流式，但代价是通常只能顺序遍历一次，不适合频繁回看历史结果。',
    followUps: [
      '如果要处理一个超大日志文件，你会怎么用生成器组织读取和过滤？',
      '生成器为什么通常只能遍历一次？',
      '什么场景下你反而不会用生成器？'
    ],
    scoringRubric: {
      mustHave: ['yield', '惰性计算', '内存占用'],
      goodToHave: ['迭代器', '流式处理', '取舍'],
      redFlags: ['只说语法长得不一样', '只说更快但讲不清原因', '完全不提内存和场景']
    }
  },
  {
    id: 'python_002',
    category: 'Python',
    roles: ['python', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '如果一个 Python 服务 CPU 打满、吞吐上不去，你会怎么判断是 GIL、代码热点还是架构问题？',
    keywords: ['先定位', 'GIL', 'profiling', '多进程', 'I/O 密集'],
    referenceAnswer: '高级 Python 排障题重点在于先区分问题类型，再决定优化方向。需要先确认是 CPU 密集还是 I/O 密集，再看 profiling 结果、线程模型、GIL 影响和是否要改成多进程或拆服务。',
    excellentAnswer: '我会先确认瓶颈到底在 CPU、I/O 还是外部依赖，不会一上来就把问题归因到 GIL。先看监控和 profiling，找到热点函数、请求类型和是否单机普遍打满。如果是 I/O 密集但线程吞吐仍低，要看是不是有锁竞争、连接池或下游阻塞；如果是纯 Python CPU 密集逻辑，多线程通常会被 GIL 限制，这时更适合多进程、任务队列，或者把热点逻辑下沉到 C 扩展、NumPy 这类能释放 GIL 的实现。最后再判断是不是架构层的问题，比如单个进程承担了过多同步计算，应该拆成异步链路或独立计算服务。',
    followUps: [
      '你会怎么用 profiling 快速找到热点代码？',
      '什么情况下多线程仍然适合 Python 服务？',
      '如果你怀疑是下游 I/O 拖慢了整体吞吐，会先看什么指标？'
    ],
    scoringRubric: {
      mustHave: ['先定位', 'GIL', 'profiling'],
      goodToHave: ['多进程', 'I/O 密集', '架构拆分'],
      redFlags: ['把所有性能问题都归因到 GIL', '没有定位顺序', '只会说加机器']
    }
  },
  {
    id: 'go_001',
    category: 'Go',
    roles: ['go', 'backend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'knowledge',
    difficulty: 2,
    question: 'Go 的 goroutine 为什么适合做高并发服务？它和线程相比关键差别是什么？',
    keywords: ['轻量级', '调度器', '栈扩缩容', 'M:N', '通信'],
    referenceAnswer: '回答这题的重点不是只说 goroutine 很轻，而是解释它背后的调度模型、栈管理和通信方式。比较好的回答会提到 Go runtime 调度器、M:N 模型、栈可扩缩和 channel/同步原语。',
    excellentAnswer: 'goroutine 适合高并发，核心在于它不是直接映射成一个系统线程，而是由 Go runtime 做 M:N 调度。相比线程，goroutine 初始栈更小，而且能按需扩缩，所以单机可以承载更多并发任务。调度器会把 goroutine 分配到多个内核线程上运行，减少线程创建和切换成本。再加上 channel、context 这些机制，能更清晰地组织并发协作。当然它也不是没有代价，如果 goroutine 泄漏、阻塞点太多或者共享内存同步混乱，照样会把服务拖慢。',
    followUps: [
      'goroutine 泄漏通常会怎么出现？',
      '如果 channel 和 mutex 都能解决问题，你怎么做取舍？',
      'Go 调度器里的 M、P、G 你会怎么快速解释？'
    ],
    scoringRubric: {
      mustHave: ['轻量级', '调度器', 'M:N'],
      goodToHave: ['栈扩缩容', 'channel', '取舍'],
      redFlags: ['只说 goroutine 就是线程', '完全不提调度模型', '只会背概念不讲场景']
    }
  },
  {
    id: 'go_002',
    category: 'Go',
    roles: ['go', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '如果一个 Go 服务出现 goroutine 数量持续上涨、延迟抖动，你会怎么排查？',
    keywords: ['先定位', 'pprof', '阻塞', '泄漏', '上下文取消'],
    referenceAnswer: '这类 Go 排障题重点在于是否有系统化的定位思路。通常会从 goroutine 数量、pprof、阻塞位置、资源释放和 context 传递几个方面拆开说明。',
    excellentAnswer: '我会先确认 goroutine 上涨是瞬时流量带来的正常波动，还是请求结束后也回不去。先看 runtime 和业务监控，比如 goroutine 数、延迟、QPS、错误率，再抓 goroutine profile 和 block profile，看大量协程卡在什么位置，是 channel 等待、锁竞争、网络调用还是定时任务没退出。如果怀疑泄漏，我会重点看有没有消费端退出但生产端还在写 channel、没有 context cancel、ticker 没 stop、重试协程无上限这些常见问题。定位到热点后，再决定是修退出逻辑、缩小临界区还是把阻塞操作改成异步或限流。',
    followUps: [
      '你会怎么从 goroutine dump 判断是不是 channel 阻塞？',
      'context 在这里主要帮你解决什么问题？',
      '如果是定时任务不断堆积，你会怎么止血？'
    ],
    scoringRubric: {
      mustHave: ['先定位', 'pprof', '泄漏'],
      goodToHave: ['阻塞', '上下文取消', '止血'],
      redFlags: ['一上来就重启服务', '不会看 profile', '没有退出和资源释放意识']
    }
  },
  {
    id: 'go_004',
    category: 'Go',
    skill: 'Go',
    roles: ['go', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '请说明 Go 里 channel、context 和 mutex 的典型使用场景。线上出现 goroutine 泄漏、channel 阻塞或锁竞争时，你会怎么定位和治理？',
    keywords: ['channel', 'context', 'mutex', 'goroutine 泄漏', '锁竞争'],
    expectedPoints: ['channel 通信和关闭原则', 'context 取消传播', 'mutex 保护共享状态', 'goroutine 泄漏定位', '锁竞争排查'],
    referenceAnswer: 'Go 并发里，channel 更适合表达 goroutine 之间的消息传递和任务流转，mutex 更适合保护共享内存状态，context 用于超时、取消和请求级元数据传递。channel 关闭通常由发送方负责，接收方不应随意关闭；context 取消要沿调用链传递，避免请求结束后后台 goroutine 继续阻塞。线上排查 goroutine 泄漏或阻塞时，可以看 goroutine 数、pprof goroutine dump、block profile、mutex profile 和线程栈，判断是否卡在 channel 收发、锁等待、网络 I/O 或没有消费端。治理方向包括补 context cancel、关闭退出信号、避免无界 goroutine、缩小锁粒度和把慢 I/O 移出临界区。',
    excellentAnswer: '我会先讲取舍：如果核心是传递任务或事件，比如 worker 从队列取任务，channel 更自然；如果多个 goroutine 要维护同一份 map、计数器或缓存状态，用 mutex 更直接，避免为了共享状态强行绕 channel。context 不是用来传业务参数的容器，主要负责取消、超时和跨 goroutine 传播生命周期。channel 的关闭原则通常是谁发送谁关闭，多个发送方时要特别谨慎，可以用额外的 done channel 或 context 控制退出。线上如果 goroutine 数持续上涨，我会先看 pprof goroutine，确认大量 goroutine 卡在 send、recv、select、锁等待还是网络调用；再结合 block profile 和 mutex profile 看阻塞位置。如果是 channel 阻塞，要检查生产消费是否不对称、buffer 是否太小、退出时是否没有通知；如果是锁竞争，要看临界区里是否有慢调用、大循环或热点资源。最终治理一般是补取消路径、限制 goroutine 数、拆分热点锁、缩小临界区和增加阻塞/队列/泄漏监控。',
    commonMistakes: [
      '把 channel 当成所有并发问题的唯一答案，简单共享状态也强行用 channel 绕一圈。',
      'context 没有沿链路传递或没有调用 cancel，导致请求结束后 goroutine 继续运行。',
      'channel 由多个发送方随意关闭，容易造成 panic 或数据丢失。'
    ],
    followUps: [
      'channel 应该由发送方关闭还是接收方关闭？多发送方时怎么处理？',
      'context cancel 没有调用会带来什么问题？',
      '如果 mutex profile 显示某个锁等待很高，你会怎么优化？'
    ],
    scoringRubric: {
      mustHave: ['channel', 'context', 'mutex', 'goroutine 泄漏', '锁竞争'],
      goodToHave: ['pprof', 'block profile', 'mutex profile', '关闭原则', '缩小临界区'],
      redFlags: ['认为 channel 可以替代所有锁', '不理解 context 取消传播', '不会用 profile 定位阻塞']
    }
  },
  {
    id: 'backend_003',
    category: '系统设计',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '如果让你设计一个面向内部研发团队的任务调度平台，你会怎么设计任务定义、调度执行、失败重试和可观测性？',
    keywords: ['任务模型', '调度', '重试', '幂等', '监控'],
    referenceAnswer: '这类系统设计题的重点不是只说一个定时任务框架，而是把任务定义、调度、执行、失败处理和运维观测拆开。候选人至少要说清楚任务元数据、触发方式、执行器、重试机制、幂等保障，以及日志、指标、告警等运营能力。',
    excellentAnswer: '我会把系统拆成任务定义层、调度控制层、执行器层和观测治理层。任务定义里至少包含任务类型、触发方式（cron、延时、事件）、超时、重试策略和路由信息。调度层负责扫描到期任务并分发到队列或执行器，为了避免重复触发，需要用任务实例 ID 配合状态机或分布式锁做幂等保障。执行器拉取任务后先记录开始状态，失败按退避策略重试，超过阈值进入死信或人工处理队列。观测层要补齐执行耗时、成功率、重试次数、积压深度、失败原因分布和告警，这样平台才真的能支持内部生产场景。',
    followUps: [
      '如果任务已经执行成功，但调度器没有收到回执，你怎么避免重复执行？',
      '你会怎么设计任务的超时、取消和强杀机制？',
      '如果某个下游依赖故障，你会怎么做止血和流量保护？'
    ],
    scoringRubric: {
      mustHave: ['任务模型', '调度', '重试', '幂等'],
      goodToHave: ['监控', '超时', '死信队列', '取舍原因'],
      redFlags: ['只说定时任务加数据库', '没有幂等或重试设计', '没有可观测性']
    }
  },
  {
    id: 'java_003',
    category: 'Java',
    roles: ['java', 'backend'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '如果一个 Java 服务频繁出现 Full GC 和请求抖动，你会怎么判断是内存分配、对象滞留还是 JVM 参数配置问题？',
    keywords: ['先定位', 'GC 日志', '内存', '对象', 'JVM 参数'],
    referenceAnswer: '这类排障题关键是先建立判断顺序：先确认 Full GC 的发生时段和影响范围，再看 GC 日志、堆使用情况、对象分配速率和老年代滞留，最后再判断是否需要调整 JVM 参数或优化代码。',
    excellentAnswer: '我不会一上来就调参数，而是先确认现象。先看监控和 GC 日志，判断是突然有对象分配暴增、老年代一直降不下来，还是某次版本上线后停顿时间明显变差。如果是分配率过高，会继续看是否有大量短命对象、重复缓冲或序列化开销；如果怀疑是对象滞留，就结合 heap dump 看缓存是否失控、监听器未释放、ThreadLocal 或大集合持有过多对象。只有在日志和堆数据支持的前提下，我才会去判断新生代、老年代大小或收集器选型是否不合适。最后再用停顿时间、GC 频率和请求 SLA 验证优化是否生效。',
    followUps: [
      '你会从 GC 日志里优先看哪些指标？',
      '如果怀疑是内存泄漏，你会怎么快速锁定热点对象？',
      '什么情况下你才会认为问题可以通过调 JVM 参数解决？'
    ],
    scoringRubric: {
      mustHave: ['先定位', 'GC 日志', '内存', '对象'],
      goodToHave: ['heap dump', '参数调优', '监控时间线', '验证结果'],
      redFlags: ['一上来就说加大堆', '没有排查顺序', '不会看 GC 日志']
    }
  },
  {
    id: 'java_004',
    category: 'Java',
    roles: ['java', 'backend'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '讲一个你用 Java 做过的核心业务链路治理项目。重点讲清线程池或异步编排、事务边界、失败补偿，以及你为什么这样拆。',
    keywords: ['项目背景', '个人职责', '事务边界', '异步编排', '取舍原因'],
    referenceAnswer: '这类 Java 项目题不是看你背了多少框架，而是看你能不能把真实链路里的并发、事务和恢复机制讲成一个完整判断过程。回答里应该体现业务目标、自己负责的边界、同步和异步怎么切、事务放在哪一层，以及失败后怎么补偿和验证。',
    excellentAnswer: '我做过一个 Java 订单履约链路治理项目，用户支付成功后要更新订单状态、扣减库存并触发履约通知。我的职责是负责订单服务里的状态流转和异步编排。设计上我没有把所有动作都塞进一个长事务里，而是把“本地事务落订单事件”和“异步消费后续动作”拆开。同步链路里只做订单状态校验、幂等检查和事件落库，保证用户请求尽快返回；后续库存和通知通过线程池隔离的异步消费者处理。这样做的原因是下游依赖耗时波动大，如果放在主事务里会把 RT 和失败面一起放大。为了避免异步任务堆积，我把核心履约和低优先级通知分开线程池，并配了拒绝策略和降级开关。失败后通过补偿任务按退避策略重试，同时用状态机限制非法流转。上线后高峰期超时和人工补单量都明显下降。',
    followUps: [
      '为什么这里你没有直接把所有步骤放进一个事务里？',
      '如果异步线程池开始排队，你会先怎么止血？',
      '补偿任务重试很多次还不成功时，你怎么避免状态越修越乱？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '个人职责', '事务边界', '异步编排'],
      goodToHave: ['取舍原因', '补偿', '线程池隔离', '结果指标'],
      redFlags: ['只说用了 Spring 事务', '讲不清同步和异步边界', '没有失败恢复和治理思路']
    }
  },
  {
    id: 'frontend_003',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '说说你做过的一个前端中后台或复杂业务后台，你是怎么处理状态管理、权限、组件复用和可维护性的？',
    keywords: ['项目背景', '状态管理', '权限设计', '组件复用', '取舍原因'],
    referenceAnswer: '这类前端项目题不是只讲技术栈，而是看你能不能把复杂业务前端工程化。回答里最好说明业务复杂点、你负责的模块、状态怎么切分、权限和路由怎么控制、组件如何抽象，以及后续怎么降低维护成本。',
    excellentAnswer: '我做过一个给运营和客服使用的中后台，里面有订单查询、审核流、活动配置和权限管理。我主要负责前端架构和核心交互模块。状态上我把页面局部的短期状态留在组件内，把跨页面共享的用户信息、权限能力、查询条件和字典数据放到公共 store，避免所有状态都堆到全局。权限上除了路由守卫，还在按钮和操作层做 capability 判断，避免只靠前端隐藏。组件复用方面，我把表格搜索、批量操作和审核弹窗抽成业务组件，但保留页面层的组装逻辑，防止抽象过度。后续为了降低维护成本，我还补齐了模块约定文档、关键流程的 E2E 用例和发布前检查表。',
    followUps: [
      '你为什么没有把所有状态都放到公共 store？',
      '如果权限规则经常变化，你会怎么让前端更好维护？',
      '有没有一次你发现组件抽象过度，后来怎么改的？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '状态管理', '权限设计', '组件复用'],
      goodToHave: ['取舍原因', '可维护性', '测试', '个人职责'],
      redFlags: ['只说用了什么框架', '没有权限或状态分层思路', '组件抽象和业务边界不清']
    }
  },
  {
    id: 'fullstack_001',
    category: '项目经历',
    roles: ['fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '你做过的全栈项目里，有没有一次是你需要同时协调前端交互、后端接口和数据一致性的？说说你的判断和取舍。',
    keywords: ['项目背景', '前后端协作', '数据一致性', '取舍原因', '结果'],
    referenceAnswer: '全栈项目题关键是看候选人能不能站在跨层视角做判断，而不是分别讲前端或后端。回答里应该体现业务流程、数据契约、用户体验、异常流转和前后端各自承担的责任边界。',
    excellentAnswer: '我做过一个报名下单和支付的全链路功能。用户在前端填写信息后，后端会创建预订单，支付成功后再把状态流转到正式订单。这里的难点是用户体验希望操作立刻有反馈，但支付和通知又是异步的。我在前端上做了状态机式交互，让每个阶段都有明确可见的等待、成功和失败状态；后端则通过幂等 key、回调验签和延时补偿避免重复下单或状态丢失。前后端之间我们先定义好状态值、错误码和提示语，减少各自理解不一致带来的扯皮。最终用户完成率提升了，而且异常订单的人工处理量明显下降。',
    followUps: [
      '这个功能里最容易出现前后端理解不一致的地方是什么？',
      '如果支付回调延迟或丢失，你在前端和后端分别怎么处理？',
      '这个方案的代价是什么，如果重做你会先改哪里？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '前后端协作', '数据一致性', '取舍原因'],
      goodToHave: ['结果指标', '幂等设计', '异步处理', '个人职责'],
      redFlags: ['只分别说前端和后端', '没有一致性或异步处理意识', '只说功能流程不说判断和取舍']
    }
  },
  {
    id: 'backend_004',
    category: '项目经历',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '说一个你做过的高并发订单、支付或库存链路项目。重点讲清你怎么处理消息重试、幂等和最终一致性，以及为什么这样设计。',
    keywords: ['项目背景', '个人职责', '数据一致性', '幂等设计', '取舍原因'],
    referenceAnswer: '这类后端项目题的重点不是罗列用了 MQ、Redis 或分布式事务，而是说明业务链路里哪里最容易出错、你负责哪段、为什么选当前一致性方案、以及如何把重复消费、回调乱序、补偿重试这些问题控制住。',
    excellentAnswer: '我做过一条支付成功后生成正式订单并扣减库存的链路。业务上要求用户感知尽量快，但支付回调、库存服务和下游通知又都是异步的。我负责订单状态流转和一致性治理，采用的方案是先落订单事件，再通过消息队列驱动库存和通知。为了防止重复消费，我在消费者侧用业务单号加事件类型做幂等表，并把状态机设计成只能按预期方向流转。支付回调可能重复或乱序，所以我把回调验签、状态校验和去重放在入口层处理；如果库存服务超时，就记录补偿任务并按退避策略重试，而不是在主链路里无限阻塞。之所以没有上强一致事务，是因为链路跨服务且峰值流量高，优先保证下单成功率和可恢复性。上线后异常订单需要人工介入的比例明显下降，峰值期间链路也更稳。',
    followUps: [
      '如果消息已经消费成功，但消费者回写数据库超时了，你怎么避免重复执行？',
      '为什么这条链路里你没有直接选分布式事务或强一致方案？',
      '如果补偿任务越积越多，你会先怎么止血和定位瓶颈？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '个人职责', '数据一致性', '幂等设计'],
      goodToHave: ['取舍原因', '重试', '状态机', '结果指标'],
      redFlags: ['只说用了 MQ 但讲不清一致性策略', '把幂等和重试混为一谈', '没有个人负责的链路和判断']
    }
  },
  {
    id: 'frontend_004',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '讲一个你做过的复杂前端页面或中后台模块。重点说清楚你是怎么处理大列表性能、交互一致性和多人协作可维护性的。',
    keywords: ['项目背景', '状态管理', '性能指标', '可维护性', '取舍原因'],
    referenceAnswer: '这类前端项目题更看工程判断。候选人需要说明页面为什么复杂、性能瓶颈在哪里、状态是怎么分层的、如何保证交互和接口状态一致，以及为了让多人维护不失控做了哪些抽象或约束。',
    excellentAnswer: '我做过一个运营活动配置后台，页面里有复杂筛选、大表格、批量编辑和权限控制。最开始的问题是筛选项一多以后页面渲染会卡，用户切换 tab 还容易丢状态。我负责页面架构和核心交互，先把瞬时 UI 状态、本地编辑态和跨页面共享状态分层，避免所有东西都塞进全局 store。性能上我先用 Performance 和 React DevTools 找到瓶颈，发现主要是大列表重复渲染和筛选条件变化触发了过多无效更新，所以后面做了虚拟滚动、列表区块拆分和请求结果缓存。为了让交互一致，我把批量操作、保存中、保存失败和回滚提示都统一到状态机里，而不是每个组件各自判断。多人协作上我抽了表格查询框架和权限指令，但保留业务页面自己的组装层，避免抽象过度。这样做的代价是前期约束更多，但后面新页面接入速度和线上稳定性都好了很多。',
    followUps: [
      '你怎么判断一个状态应该留在组件内，还是提升到共享层？',
      '如果你们抽的通用表格层越来越重，你会怎么收口？',
      '性能优化之后你拿什么指标或现象来证明真的有效？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '状态管理', '性能指标', '可维护性'],
      goodToHave: ['取舍原因', '权限设计', '组件复用', '结果指标'],
      redFlags: ['只说用了虚拟列表或缓存', '讲不清状态分层和协作边界', '没有验证优化效果']
    }
  },
  {
    id: 'python_003',
    category: 'Python',
    roles: ['python', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '说一个你用 Python 做过的任务调度、异步处理或数据流水线项目。重点讲讲任务拆分、失败重试、可观测性和资源隔离。',
    keywords: ['项目背景', '任务模型', '重试', '监控', '取舍原因'],
    referenceAnswer: '这类 Python 项目题的核心是判断候选人是否真的做过长期运行的异步系统。回答里应该体现任务怎么定义、如何切分同步链路和异步链路、失败后如何重试或回滚，以及怎样用日志、指标和告警把问题暴露出来。',
    excellentAnswer: '我做过一个基于 Python 的异步任务平台，负责处理文件导入、数据清洗和结果回写。业务特点是任务耗时差异很大，而且下游依赖不稳定，所以我没有把所有逻辑都放在同步接口里，而是把请求拆成提交、排队、执行和回写几个阶段。我负责任务模型、worker 执行框架和失败治理。任务定义里会带超时、重试策略和幂等键；执行层按任务类型分队列，避免大任务把小任务全部堵住。失败后不是一律重试，而是区分临时故障和脏数据，临时故障按退避策略重试，数据问题直接落到人工处理队列。可观测性上我补了任务成功率、排队时长、重试次数和死信量指标，并在日志里串联 trace id 方便回放。这样做的取舍是系统复杂度更高，但换来了吞吐稳定性和更低的人工排障成本。',
    followUps: [
      '你怎么避免某一类大任务把整个 worker 池拖慢？',
      '如果重试越来越多，你怎么判断该扩容、限流还是先修任务逻辑？',
      '任务已经执行成功但回写状态失败时，你怎么保证最终状态可恢复？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '任务模型', '重试', '监控'],
      goodToHave: ['取舍原因', '幂等设计', '资源隔离', '结果指标'],
      redFlags: ['只说用了 Celery 或队列', '没有失败分类和治理思路', '讲不清自己负责哪部分']
    }
  },
  {
    id: 'python_004',
    category: 'Python',
    roles: ['python', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '如果一个 Python 服务同时有接口请求慢、worker 积压和 CPU 飙高，你会怎么判断是 GIL、I/O 阻塞、序列化开销还是任务模型设计问题？',
    keywords: ['先定位', '采样', 'I/O 阻塞', 'CPU 热点', '任务模型'],
    referenceAnswer: '这类 Python 排障题的重点是有没有明确的拆解顺序。好的回答会先确认慢的是 Web 线程、后台 worker 还是两边一起，再结合 profile、队列堆积、I/O 等待和对象序列化成本去判断问题落在哪一层。',
    excellentAnswer: '我会先把现象拆开，确认是接口慢带着 worker 积压，还是 worker 本身打满 CPU 反过来拖慢服务。先看请求 RT、队列长度、worker 并发数和 CPU 使用率的时间线，判断问题从哪一层开始。接着用 profile 或采样看热点函数，如果 CPU 主要耗在 JSON 序列化、压缩、数据处理这类纯 Python 代码，就要考虑 GIL 和 CPU 密集任务不适合堆线程；如果大量时间卡在数据库、网络或对象存储调用，就更像 I/O 阻塞或下游抖动。再往下我会看任务模型是不是把长任务和短任务混在一起、重试是否放大了积压、序列化 payload 是否过大。最后再决定是拆队列、改进程模型、把 CPU 密集逻辑下沉到独立 worker，还是先限流止血。',
    followUps: [
      '什么现象会让你优先怀疑是 GIL 或 CPU 密集逻辑，而不是 I/O？',
      '如果确认是任务模型设计有问题，你会先怎么改队列和 worker 拆分？',
      '你会拿哪几个指标来证明优化之后积压真的被收住了？'
    ],
    scoringRubric: {
      mustHave: ['先定位', 'I/O 阻塞', 'CPU 热点', '任务模型'],
      goodToHave: ['采样', 'GIL', '限流止血', '结果指标'],
      redFlags: ['一上来就盲目扩容', '只会说 Python 有 GIL', '不会区分 CPU 密集和 I/O 密集']
    }
  },
  {
    id: 'go_003',
    category: 'Go',
    roles: ['go', 'backend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '讲一个你用 Go 做过的高并发服务或任务系统。重点讲清 goroutine 协作、限流背压、超时取消和故障止血是怎么设计的。',
    keywords: ['项目背景', '个人职责', 'goroutine 协作', '限流背压', '取舍原因'],
    referenceAnswer: '这类 Go 项目题要看候选人是否真的理解 Go 并发模型在生产环境里的使用方式。回答里应该体现 goroutine 怎么组织、channel 或队列怎么配合、超时取消如何贯穿链路，以及当积压出现时怎样止血和保住核心流量。',
    excellentAnswer: '我做过一个 Go 的异步导出和回调服务，特点是高峰期会同时收到很多导出请求，而且下游回调偶尔会变慢。我负责 worker 执行框架和流量保护。并发模型上，我没有简单地每个请求起一串 goroutine，而是拆成接入层、任务队列和执行 worker 三层：接入层负责快速校验和入队，执行层按任务类型分 worker 池，避免大任务拖死小任务。goroutine 之间通过 channel 传递任务，但所有下游调用都带 context timeout 和 cancel，确保请求超时后不会把后台协程一直挂住。为了避免堆积扩散，我加了队列长度阈值、并发上限和熔断降级，先保住核心任务，低优先级导出允许延后。这样设计的取舍是实现复杂一些，但比无限起协程更可控，线上延迟抖动和 goroutine 泄漏风险都更低。',
    followUps: [
      '如果队列持续变长，你怎么判断该扩 worker、限流还是先降级？',
      'context 取消在这条链路里最关键地避免了什么问题？',
      '为什么这里你没有让每个任务自己再无限拆 goroutine？'
    ],
    scoringRubric: {
      mustHave: ['项目背景', '个人职责', 'goroutine 协作', '限流背压'],
      goodToHave: ['取舍原因', '超时取消', '资源隔离', '结果指标'],
      redFlags: ['只说 Go 并发很轻量', '讲不清协程边界和治理策略', '没有止血和背压意识']
    }
  },
  {
    id: 'sql_001',
    category: 'MySQL',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'algorithm',
    codeKind: 'sql',
    difficulty: 2,
    question: '有一张 orders 表，字段包括 user_id、amount、status、created_at。请写 SQL 或说明思路：统计最近 30 天每个用户已支付订单的总金额，并按总金额倒序取前 10 名。',
    keywords: ['WHERE', 'GROUP BY', 'SUM', 'ORDER BY', 'LIMIT'],
    referenceAnswer: '可以先用 WHERE 过滤最近 30 天且 status 为已支付的订单，再按 user_id 分组，使用 SUM(amount) 统计总金额，最后按总金额倒序排序并 LIMIT 10。核心 SQL 形态是：SELECT user_id, SUM(amount) AS total_amount FROM orders WHERE status = "paid" AND created_at >= NOW() - INTERVAL 30 DAY GROUP BY user_id ORDER BY total_amount DESC LIMIT 10。实际生产里还要关注 status、created_at、user_id 的索引设计以及金额字段精度。通用 SQL 写法里，时间函数可以按数据库方言调整。注意不要直接使用 DOUBLE 存金额。',
    excellentAnswer: '我会先把过滤条件放在 WHERE：status = "paid"，并限制 created_at 在最近 30 天，然后 GROUP BY user_id，用 SUM(amount) 得到每个用户的总支付金额，再 ORDER BY total_amount DESC LIMIT 10。SQL 可以写成 SELECT user_id, SUM(amount) AS total_amount FROM orders WHERE status = "paid" AND created_at >= NOW() - INTERVAL 30 DAY GROUP BY user_id ORDER BY total_amount DESC LIMIT 10。补充一点，真实业务里我会确认 amount 是否用 DECIMAL，避免浮点误差；如果数据量大，会考虑 status、created_at 和 user_id 的联合索引，或者按时间分区/离线汇总，避免每次扫大量历史订单。',
    followUps: [
      '如果 orders 表数据量很大，这条 SQL 可能慢在哪里？',
      '这个查询适合建什么索引，为什么？',
      '如果还要按城市维度统计，SQL 结构要怎么调整？'
    ],
    scoringRubric: {
      mustHave: ['WHERE', 'GROUP BY', 'SUM', 'ORDER BY'],
      goodToHave: ['LIMIT', '索引', '金额精度', '时间范围'],
      redFlags: ['没有过滤已支付状态', '忘记分组', '只说查出来再用代码统计']
    }
  },
  {
    id: 'sql_002',
    category: 'MySQL',
    skill: 'MySQL',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'sql',
    difficulty: 3,
    question: '有 employees 表，字段包括 id、name、department_id、salary。请写 SQL 或说明思路：查询每个部门薪资第二高的员工，要求考虑并列薪资的情况。',
    keywords: ['窗口函数', 'DENSE_RANK', 'PARTITION BY', 'ORDER BY', '并列薪资'],
    expectedPoints: ['按部门分区', '按薪资倒序排名', '使用 DENSE_RANK 处理并列', '筛选第二名', '说明 RANK 和 ROW_NUMBER 差异'],
    referenceAnswer: '推荐使用窗口函数。先按 department_id 分区，再按 salary 倒序计算 DENSE_RANK，最后筛选 rank = 2 的记录。示例：SELECT id, name, department_id, salary FROM (SELECT e.*, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees e) t WHERE salary_rank = 2。使用 DENSE_RANK 可以处理并列薪资：如果最高薪有多人并列，下一档薪资会被认为是第二高。ROW_NUMBER 只给每行唯一序号，不适合处理并列；RANK 会跳号，要根据题意选择。',
    excellentAnswer: '我会先确认“第二高”是第二个不同薪资档，还是按员工行排序的第二名。题目要求考虑并列薪资，所以更适合用 DENSE_RANK。SQL 可以写成：SELECT id, name, department_id, salary FROM (SELECT e.*, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk FROM employees e) t WHERE rnk = 2。这里 PARTITION BY department_id 表示每个部门独立排名，ORDER BY salary DESC 表示薪资从高到低，DENSE_RANK 能让并列最高都排第 1，下一档薪资排第 2，因此能返回每个部门第二高薪资档的所有员工。如果数据库不支持窗口函数，可以先按 department_id、salary 去重分组，再找每个部门小于最高薪的最大 salary，最后回表查员工，但可读性和性能通常不如窗口函数。',
    commonMistakes: [
      '用 ROW_NUMBER 导致并列薪资时只返回其中一名员工。',
      '没有按 department_id 分区，变成查询全公司第二高薪资。',
      '没有说明第二高是第二个薪资档还是第二行记录，题意不清时直接写 SQL。'
    ],
    followUps: [
      'DENSE_RANK、RANK 和 ROW_NUMBER 在并列薪资下有什么区别？',
      '如果只想返回每个部门任意一名第二高薪员工，SQL 可以怎么改？',
      '这类窗口函数查询在大表上要注意哪些索引或排序成本？'
    ],
    scoringRubric: {
      mustHave: ['PARTITION BY', 'ORDER BY', 'DENSE_RANK', '筛选第二名'],
      goodToHave: ['并列薪资', 'ROW_NUMBER 差异', 'RANK 差异', '索引和排序成本'],
      redFlags: ['没有按部门分组', '忽略并列薪资', '只用 LIMIT 1 OFFSET 1 查询全表']
    }
  },
  {
    id: 'algorithm_002',
    category: '算法',
    roles: ['backend', 'frontend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'algorithm',
    difficulty: 3,
    question: '请说明如何设计一个 LRU 缓存，要求 get 和 put 都尽量做到 O(1)。可以用伪代码或数据结构思路回答。',
    keywords: ['哈希表', '双向链表', '最近使用', '淘汰', 'O(1)'],
    referenceAnswer: 'LRU 缓存通常用哈希表加双向链表实现。哈希表负责用 key O(1) 定位节点，双向链表维护访问顺序，越靠近头部表示越新，尾部表示最久未使用。get 命中时把节点移动到头部；put 时如果 key 已存在则更新并移动到头部，如果不存在则插入新节点；容量超限时删除尾部节点，并同步从哈希表移除。这样查询、更新、移动和淘汰都可以做到 O(1)。',
    excellentAnswer: '我会用 map + 双向链表。map 的 key 指向链表节点，这样 get 时可以 O(1) 找到节点；链表负责维护最近使用顺序，头部放最新访问的节点，尾部放最久没用的节点。get(key) 如果不存在返回空；如果存在，就把这个节点从原位置摘下来移动到头部。put(key, value) 如果 key 已存在，更新 value 并移动到头部；如果不存在，新建节点插到头部，同时写入 map。超过容量时，删除尾部节点，并把尾部 key 从 map 里删掉。这里必须用双向链表，因为移动和删除中间节点需要 O(1) 处理前后指针。',
    followUps: [
      '为什么不能只用数组或普通队列实现？',
      'put 已存在 key 时要注意什么？',
      '如果这个 LRU 要支持并发访问，你会补什么保护？'
    ],
    scoringRubric: {
      mustHave: ['哈希表', '双向链表', '最近使用', '淘汰'],
      goodToHave: ['O(1)', '移动到头部', '删除尾部', '并发保护'],
      redFlags: ['只说用 Map 但不维护顺序', '淘汰逻辑说不清', '复杂度不是 O(1)']
    }
  },
  {
    id: 'algorithm_003',
    category: '算法',
    skill: '算法',
    roles: ['backend', 'frontend', 'java', 'go', 'python', 'fullstack'],
    levels: ['junior'],
    type: 'algorithm',
    codeKind: 'algorithm',
    difficulty: 2,
    question: '请说明如何判断一个只包含括号字符的字符串是否合法。可以写代码、伪代码，或说明栈的处理流程和复杂度。',
    keywords: ['栈', '括号匹配', '左括号入栈', '右括号出栈', '空栈判断'],
    referenceAnswer: '判断括号是否合法通常使用栈。遍历字符串时，遇到左括号就入栈；遇到右括号时，先判断栈是否为空，如果为空说明没有可匹配的左括号，直接不合法；如果不为空，就弹出栈顶并检查类型是否匹配。遍历结束后，如果栈为空说明所有左括号都被匹配，字符串合法；如果栈里还有元素，说明有未闭合的左括号。时间复杂度 O(n)，空间复杂度 O(n)。',
    excellentAnswer: '我会用栈保存还没有匹配的左括号。遍历每个字符时，如果是 "("、"["、"{" 就压栈；如果是右括号，就先看栈是否为空，空的话直接返回 false，因为右括号出现在了没有左括号的位置。栈不为空时弹出栈顶，用映射关系判断是否和当前右括号成对，例如 ")" 必须匹配 "("。遍历结束后还要检查栈是否为空，只有为空才说明所有左括号都闭合了。这个算法每个字符最多入栈出栈一次，所以时间 O(n)，最坏情况下栈保存所有左括号，空间 O(n)。',
    followUps: [
      '为什么这个题适合用栈，而不是只统计左右括号数量？',
      '如果字符串里除了括号还有普通字符，你会怎么处理？',
      '如果要返回第一个不合法字符的位置，流程要怎么调整？'
    ],
    scoringRubric: {
      mustHave: ['栈', '左括号入栈', '右括号出栈', '类型匹配'],
      goodToHave: ['空栈判断', '遍历结束检查', '复杂度', '非法位置'],
      redFlags: ['只统计左右括号数量', '忘记检查括号类型', '没有处理空栈和剩余左括号']
    }
  },
  {
    id: 'frontend_code_001',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 2,
    question: '请说明如何实现一个 debounce 防抖函数。可以写 JS 代码、伪代码，或说明核心流程和边界处理。',
    keywords: ['闭包', '定时器', '清除定时器', '延迟执行', 'this 和参数'],
    referenceAnswer: '防抖的核心是多次触发时只执行最后一次。实现上通常用闭包保存 timer，每次调用时先 clearTimeout(timer)，再重新 setTimeout，在延迟时间后调用原函数。为了更完整，调用时要用 fn.apply(this, args) 保留 this 和参数；如果需要立即执行版本，还要区分 leading 和 trailing 行为。',
    excellentAnswer: '我会返回一个新函数，并在外层闭包里保存 timer。每次触发新函数时，先清掉上一次 timer，再创建新的 setTimeout。等 wait 时间内没有再次触发时，才用 fn.apply(this, args) 执行原函数，这样可以保留调用方的 this 和参数。基础代码大概是：let timer; return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), wait); }。如果是搜索框联想或窗口 resize，这种方式可以减少高频触发带来的重复请求或重复计算。',
    followUps: [
      '防抖和节流的区别是什么？',
      '为什么要用 apply 保留 this 和参数？',
      '如果要求第一次立即执行、后续再防抖，思路怎么改？'
    ],
    scoringRubric: {
      mustHave: ['闭包', '定时器', '清除定时器', '延迟执行'],
      goodToHave: ['this 和参数', '立即执行', '使用场景', '防抖节流区别'],
      redFlags: ['只说减少执行次数但讲不出实现', '忘记清除定时器', '没有处理参数和 this']
    }
  },
  {
    id: 'frontend_code_005',
    category: '前端',
    skill: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 2,
    question: '请说明如何实现一个 throttle 节流函数。可以写 JS 代码、伪代码，或说明时间戳版、定时器版以及 leading/trailing 边界怎么处理。',
    keywords: ['throttle', '节流', '时间戳', '定时器', 'leading trailing'],
    expectedPoints: ['固定时间窗口最多执行一次', '闭包保存上次执行时间或定时器', '保留 this 和参数', 'leading/trailing 边界', '防抖和节流区别'],
    referenceAnswer: '节流的核心是高频触发时按固定频率执行，而不是每次都执行。常见实现有时间戳版和定时器版：时间戳版记录 lastTime，每次触发时判断 now - lastTime 是否超过 wait，超过才执行并更新 lastTime；定时器版在没有 timer 时设置一个 setTimeout，延迟结束后执行并清空 timer。更完整的实现需要保留 this 和参数，并明确 leading 是否立即执行、trailing 是否补最后一次执行。',
    excellentAnswer: '我会先说明节流和防抖的区别：防抖是等一段时间内不再触发才执行最后一次，节流是持续触发时每隔固定时间最多执行一次。实现上可以用闭包保存 lastTime：返回的新函数每次执行时取 Date.now()，如果 now - lastTime >= wait，就用 fn.apply(this, args) 执行原函数并更新 lastTime。这个版本适合 leading 立即执行。若希望 trailing 也执行最后一次，可以配合 timer：当距离不足时设置剩余时间的定时器，时间到后执行最后一次并清理 timer。面试里至少要讲清固定频率、闭包状态、this/参数保留，以及 leading/trailing 的取舍。',
    commonMistakes: [
      '把节流写成防抖：每次触发都清空并重新设置定时器，导致持续触发时一直不执行。',
      '没有保留 this 和参数，包装函数改变了原函数调用语义。',
      '没有说明 leading/trailing 行为，导致第一次或最后一次执行是否发生不清楚。'
    ],
    followUps: [
      '防抖和节流分别适合哪些业务场景？',
      '如何实现既支持首次立即执行，又支持最后一次补执行的节流？',
      '如果页面卸载或组件销毁，定时器版节流要注意什么？'
    ],
    scoringRubric: {
      mustHave: ['节流', '闭包', '时间戳或定时器', '固定频率执行'],
      goodToHave: ['this 和参数', 'leading trailing', '防抖节流区别', '清理定时器'],
      redFlags: ['把节流实现成防抖', '每次触发都立即执行', '不处理参数和 this']
    }
  },
  {
    id: 'frontend_code_002',
    category: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['junior', 'middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 2,
    question: '请说明如何实现数组扁平化 flatten。可以写 JS 代码、伪代码，或说明递归/迭代思路和复杂度。',
    keywords: ['递归', 'Array.isArray', '结果数组', '遍历', '复杂度'],
    referenceAnswer: '数组扁平化可以递归实现：遍历数组中的每一项，如果当前项还是数组，就递归展开；如果不是数组，就放入结果数组。JS 里可以用 Array.isArray 判断。时间复杂度通常是 O(n)，n 是所有元素总数；空间复杂度取决于结果数组和递归调用栈。也可以用栈迭代实现，避免递归层级太深导致调用栈风险。',
    excellentAnswer: '我会先写递归版：准备一个 result，遍历输入数组，如果 Array.isArray(item) 为 true，就递归处理 item，并把里面的元素继续 push 到 result；否则直接 push 当前元素。伪代码是：function flatten(arr) { const res = []; for (const item of arr) { if (Array.isArray(item)) res.push(...flatten(item)); else res.push(item); } return res; }。复杂度上，每个元素访问一次，所以时间 O(n)，额外空间包括结果数组和递归栈。如果数组嵌套特别深，我会改成显式栈迭代，避免调用栈溢出。',
    followUps: [
      '如果只想扁平化一层，代码怎么改？',
      '递归层级很深时有什么风险？',
      '如何保留元素原有顺序地用栈实现？'
    ],
    scoringRubric: {
      mustHave: ['递归', 'Array.isArray', '结果数组', '遍历'],
      goodToHave: ['复杂度', '迭代实现', '调用栈风险', '保序'],
      redFlags: ['只说用 flat 方法但不讲实现', '没有判断数组类型', '复杂度和边界情况说不清']
    }
  },
  {
    id: 'frontend_code_003',
    category: '前端',
    skill: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 3,
    question: '请分析下面这类 Promise 和事件循环代码的输出顺序，并说明同步代码、微任务、宏任务分别如何调度。可以写出判断步骤或伪代码：console.log("A"); setTimeout(() => console.log("B")); Promise.resolve().then(() => console.log("C")).then(() => console.log("D")); console.log("E");',
    keywords: ['Promise', '事件循环', '微任务', '宏任务', '输出顺序'],
    expectedPoints: ['同步代码先执行', 'Promise then 进入微任务队列', 'setTimeout 进入宏任务队列', '微任务清空后再执行宏任务', '链式 then 的调度顺序'],
    referenceAnswer: '这段代码输出顺序通常是 A、E、C、D、B。原因是同步代码会先执行，所以先输出 A 和 E；setTimeout 回调进入宏任务队列；Promise.resolve().then 的回调进入微任务队列。当前同步任务执行完后，会先清空微任务队列，因此输出 C；第一个 then 返回后，第二个 then 被继续放入微任务队列，所以再输出 D；最后事件循环进入下一个宏任务，执行 setTimeout 输出 B。',
    excellentAnswer: '我会按队列变化来分析。第一行 console.log("A") 是同步代码，立即输出 A。setTimeout 注册回调，放到后续宏任务里。Promise.resolve().then(...) 会把第一个 then 回调放入微任务队列，但不会立刻执行。最后一行 console.log("E") 也是同步代码，所以第二个输出是 E。同步栈清空后，事件循环先处理微任务：执行第一个 then 输出 C；这个 then 执行完成后，链式的第二个 then 才进入微任务队列并继续执行，输出 D。微任务队列清空后，才轮到宏任务里的 setTimeout，输出 B。因此顺序是 A、E、C、D、B。回答时我还会提醒：浏览器和 Node 的事件循环细节有差异，但在这类基础 Promise 与 setTimeout 输出题里，核心判断是同步优先、微任务优先于宏任务。',
    commonMistakes: [
      '把 Promise.then 当成同步代码，导致把 C 放在 E 前面。',
      '认为 setTimeout 延迟为 0 就会立刻执行，忽略宏任务要等当前任务和微任务结束。',
      '只背最终答案，不解释链式 then 为什么会继续排入微任务队列。'
    ],
    followUps: [
      'async/await 和 Promise.then 在微任务调度上有什么关系？',
      '如果 then 里再创建一个 setTimeout，输出顺序会怎么变化？',
      '浏览器渲染和微任务清空之间大致是什么关系？'
    ],
    scoringRubric: {
      mustHave: ['同步代码先执行', '微任务', '宏任务', '输出顺序'],
      goodToHave: ['链式 then', 'async/await', '浏览器和 Node 差异', '渲染时机'],
      redFlags: ['把 Promise.then 说成同步执行', '把 setTimeout 说成一定最先执行', '只给答案不讲调度过程']
    }
  },
  {
    id: 'frontend_code_004',
    category: '前端',
    skill: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 3,
    question: '请实现一个简版 Promise.all。可以写 JS 代码、伪代码，或说明核心流程：如何保持结果顺序、处理非 Promise 值、空数组，以及任意一个任务失败时立即 reject。',
    keywords: ['Promise.all', '并发聚合', '结果顺序', '失败短路', '非 Promise 值'],
    expectedPoints: ['返回新的 Promise', '按输入顺序保存结果', 'Promise.resolve 包装每一项', '失败立即 reject', '空数组直接 resolve'],
    referenceAnswer: '简版 Promise.all 需要返回一个新的 Promise。对输入数组逐项遍历，用 Promise.resolve(item) 兼容普通值和 Promise；每一项成功后，把结果按原下标写入 results，并记录完成数量；当完成数量等于输入长度时 resolve(results)。如果任意一项 reject，就直接 reject 外层 Promise。空数组要立即 resolve([])。关键点是并发执行不等于按完成顺序返回，最终结果必须保持输入顺序。',
    excellentAnswer: '我会先处理边界：如果入参为空数组，直接 resolve([])。然后创建 results 数组和 count 计数器，返回一个新的 Promise。遍历输入时保留 index，用 Promise.resolve(item) 把普通值也包装成 Promise；成功回调里把 value 放到 results[index]，而不是 push，这样才能保持和输入一致的顺序。每成功一个 count 加一，count 等于数组长度时 resolve(results)。失败回调里直接 reject(reason)，实现失败短路。伪代码大概是：return new Promise((resolve, reject) => { if (!arr.length) resolve([]); arr.forEach((item, index) => Promise.resolve(item).then(value => { results[index] = value; if (++count === arr.length) resolve(results); }, reject)); })。真实实现还要考虑可迭代对象和 thenable，但面试手写版先把顺序、普通值、空数组和失败短路讲清楚。',
    commonMistakes: [
      '用 push 保存结果，导致最终顺序变成完成顺序而不是输入顺序。',
      '没有用 Promise.resolve 包装普通值或 thenable，兼容性不完整。',
      '忘记处理空数组，导致外层 Promise 永远不 resolve。'
    ],
    followUps: [
      'Promise.all 和 Promise.allSettled 的失败处理有什么区别？',
      '如果要限制并发数，比如一次最多跑 3 个任务，思路怎么改？',
      '为什么结果数组要按 index 写入，而不是直接 push？'
    ],
    scoringRubric: {
      mustHave: ['返回新的 Promise', '结果顺序', 'Promise.resolve', '失败短路'],
      goodToHave: ['空数组', '非 Promise 值', 'thenable', '并发限制', 'allSettled 区别'],
      redFlags: ['按完成顺序返回结果', '失败后仍继续等待全部完成才 reject', '漏掉空数组边界']
    }
  },
  {
    id: 'frontend_code_006',
    category: '前端',
    skill: '前端',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'frontend',
    difficulty: 3,
    question: '请实现一个并发限制器：给定一组返回 Promise 的任务函数和最大并发数 limit，要求同一时间最多执行 limit 个任务，并在全部完成后按输入顺序返回结果。可以写 JS 代码、伪代码，或说明调度流程。',
    keywords: ['并发限制器', '任务队列', '最大并发数', '补位执行', '结果顺序'],
    expectedPoints: ['限制同时运行数量', '维护当前运行数 activeCount', '任务完成后补位启动下一个', '按输入顺序保存结果', '处理失败和空任务'],
    referenceAnswer: '并发限制器的核心是维护一个待执行队列、当前运行数量 activeCount 和结果数组。开始时先启动不超过 limit 个任务；每个任务完成后把结果写入对应下标，activeCount 减一，然后从队列里补位启动下一个任务。全部任务完成后 resolve(results)。如果希望行为类似 Promise.all，可以任意一个任务失败时 reject；如果希望收集全部结果，则要把成功和失败都包装成状态对象。空任务数组应直接 resolve([])。',
    excellentAnswer: '我会把它看成一个小型调度器。输入不是已经开始执行的 Promise，而最好是一组 task 函数，这样调度器才能控制什么时候启动。内部准备 results、nextIndex、finishedCount 和 activeCount。先写一个 runNext 函数：只要 activeCount < limit 且 nextIndex 还没越界，就取出当前 index，activeCount 加一，执行 Promise.resolve().then(tasks[index])。成功后把结果写到 results[index]，失败时如果采用 Promise.all 语义就直接 reject；finally 里 activeCount 减一、finishedCount 加一，如果全部完成就 resolve(results)，否则继续 runNext 补位。关键点是：并发限制控制的是启动数量，结果要按 index 写入，任务完成后要立刻补下一个，且 limit 要做边界校验。',
    commonMistakes: [
      '直接对所有任务调用 Promise.all，任务已经全部启动，实际上没有限制并发。',
      '用 push 保存结果，导致最终顺序变成完成顺序而不是输入顺序。',
      '任务完成后没有补位启动下一个，导致只执行了第一批任务。'
    ],
    followUps: [
      '为什么输入最好是任务函数数组，而不是已经创建好的 Promise 数组？',
      '如果不想失败短路，而是收集所有成功和失败结果，结构要怎么改？',
      '这个并发限制器和后端限流器的相同点、不同点是什么？'
    ],
    scoringRubric: {
      mustHave: ['并发限制', 'activeCount', '补位执行', '结果顺序'],
      goodToHave: ['任务函数', '失败策略', '空任务', 'limit 边界', 'allSettled 语义'],
      redFlags: ['直接 Promise.all 启动全部任务', '没有补位逻辑', '结果顺序不稳定']
    }
  },
  {
    id: 'backend_code_001',
    category: '系统设计',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'backend',
    difficulty: 3,
    question: '请设计一个简单的接口限流器。可以用伪代码或流程说明：如何按用户或 IP 限制单位时间内的请求次数，并说明边界情况。',
    keywords: ['限流', '计数器', '时间窗口', 'Redis', '过期时间'],
    referenceAnswer: '轻量限流可以用固定窗口计数器实现：以用户或 IP 加接口名组成 key，例如 rate:{userId}:{api}:{minute}，每次请求先对 key 做 INCR，如果是第一次创建则设置过期时间，计数超过阈值就拒绝。生产上要注意固定窗口边界突刺问题，可以升级为滑动窗口、令牌桶或漏桶；分布式环境下通常用 Redis 原子操作或 Lua 脚本保证计数和过期设置的一致性。',
    excellentAnswer: '我会先明确限流维度，比如用户、IP、接口或租户。最简单可以用 Redis 固定窗口计数器：请求进来后拼 key，例如 rate:userId:api:yyyyMMddHHmm，对 key 执行 INCR，第一次创建时设置 60 秒过期；如果计数超过阈值，直接返回 429 或降级提示。这个方案实现简单，但窗口边界可能在两分钟交界处放过双倍流量，所以高要求场景我会换成滑动窗口或令牌桶。分布式场景下，INCR 和 EXPIRE 最好用 Lua 合并，避免设置过期失败导致 key 长期存在。',
    followUps: [
      '固定窗口限流有什么边界问题？',
      '为什么 Redis INCR 和 EXPIRE 最好做成原子操作？',
      '如果要支持不同接口不同限流阈值，你会怎么配置？'
    ],
    scoringRubric: {
      mustHave: ['限流', '计数器', '时间窗口', '过期时间'],
      goodToHave: ['Redis', '原子操作', '滑动窗口', '令牌桶'],
      redFlags: ['只说加缓存但没有计数逻辑', '没有限流维度', '不考虑分布式一致性']
    }
  },
  {
    id: 'backend_code_002',
    category: 'Redis',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'backend',
    difficulty: 3,
    question: '如果一个热点接口容易出现缓存穿透，你会怎么设计防护？请说明请求流程、伪代码思路和异常边界。',
    keywords: ['缓存穿透', '空值缓存', '布隆过滤器', '回源', '过期时间'],
    referenceAnswer: '缓存穿透是指请求查询缓存和数据库都不存在的数据，导致大量请求直接打到数据库。常见防护包括：对不存在结果做短 TTL 空值缓存；在入口用布隆过滤器拦截明显不存在的 key；对回源数据库做限流和降级；同时要注意空值缓存过期时间不能太长，避免真实数据后来写入后仍被空值挡住。',
    excellentAnswer: '我会把流程拆成三步。第一步先查缓存，命中正常返回；第二步如果缓存未命中，先用布隆过滤器判断 key 是否可能存在，如果一定不存在就直接拒绝或返回空结果；第三步如果可能存在再回源数据库。数据库查不到时，不是直接什么都不做，而是写入一个短 TTL 的空值缓存，比如 1 到 5 分钟，避免同一个不存在 key 反复打 DB。边界上要控制空值 TTL，数据写入时要删除对应空值缓存；如果异常流量很大，还要对回源加限流、热点 key 监控和降级策略。',
    followUps: [
      '空值缓存的 TTL 为什么不能太长？',
      '布隆过滤器误判会带来什么影响？',
      '如果穿透请求 key 非常分散，单纯空值缓存还够吗？'
    ],
    scoringRubric: {
      mustHave: ['缓存穿透', '空值缓存', '回源', '过期时间'],
      goodToHave: ['布隆过滤器', '限流', '降级', '数据写入一致性'],
      redFlags: ['把缓存穿透和缓存击穿混淆', '只说加缓存但不处理不存在数据', '没有数据库保护措施']
    }
  },
  {
    id: 'backend_code_003',
    category: '系统设计',
    skill: '后端场景题',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'algorithm',
    codeKind: 'backend',
    difficulty: 3,
    question: '请设计一个写接口的幂等方案。可以用伪代码或流程说明：如何用幂等键、状态记录或唯一约束，避免支付回调、下单请求或 MQ 消息重复处理。',
    keywords: ['接口幂等', '幂等键', '唯一约束', '状态机', '重复请求'],
    expectedPoints: ['幂等键来源和作用域', '请求状态记录', '唯一约束或去重表', '并发重复处理', '失败重试和结果复用'],
    referenceAnswer: '写接口幂等的核心是让同一个业务动作重复到达时只生效一次。常见做法是由客户端或上游生成幂等键，比如订单号、支付流水号、业务单号加事件类型；服务端用唯一索引、幂等表或状态机记录处理状态。请求进来先查幂等记录：成功过就返回上次结果，处理中可以拒绝或等待，失败可按策略重试。真正落库时要把幂等记录和业务写入放在同一个事务里，或通过唯一约束兜底，避免并发下重复创建、重复扣款或重复消费。',
    excellentAnswer: '我会先区分幂等键的粒度：下单接口可以用 clientRequestId 加用户维度，支付回调用支付流水号，MQ 消费可以用业务单号加事件类型。服务端收到请求后先尝试插入幂等记录，状态是处理中；如果唯一键冲突，就查询已有记录，成功则直接返回历史结果，处理中则返回处理中或做短暂等待，失败则看是否允许重试。业务处理和幂等状态更新最好在同一个本地事务里完成：先校验状态机是否允许流转，再写业务数据，最后把幂等记录改成成功并保存返回摘要。高并发下不能只靠先查再写，要用唯一索引、行锁或原子插入兜底；异常时要有超时恢复任务，把长期处理中记录标记为可重试或人工介入。这样重复请求、重试、回调乱序和 MQ 重投都能被收敛到同一个业务结果上。',
    commonMistakes: [
      '只在前端按钮防重复提交，没有服务端唯一约束或幂等记录。',
      '把幂等和重试混在一起，只说失败重试，不说明重复到达怎么返回同一结果。',
      '先查询再插入但没有唯一索引兜底，并发请求仍然可能重复写入。'
    ],
    followUps: [
      '幂等键应该由客户端传，还是服务端生成？不同业务有什么区别？',
      '如果幂等记录一直停留在处理中，你会怎么恢复？',
      '支付回调重复和 MQ 消息重复消费，在幂等设计上有什么共同点和不同点？'
    ],
    scoringRubric: {
      mustHave: ['接口幂等', '幂等键', '唯一约束', '重复请求'],
      goodToHave: ['状态机', '处理中状态', '结果复用', '事务一致性', '超时恢复'],
      redFlags: ['只做前端防重复', '没有唯一约束', '不处理并发重复请求']
    }
  }
];

export const roleLabels = {
  backend: '后端开发',
  frontend: '前端开发',
  fullstack: '全栈开发',
  java: 'Java 后端',
  go: 'Go 后端',
  python: 'Python 后端'
};

export const levelLabels = {
  junior: '初级',
  middle: '中级',
  senior: '高级'
};

export const styleLabels = {
  normal: '正常',
  pressure: '压力',
  coaching: '引导'
};
