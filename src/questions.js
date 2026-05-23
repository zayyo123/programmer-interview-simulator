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
  }
,
  {
    id: 'backend_003',
    category: '绯荤粺璁捐',
    roles: ['backend', 'java', 'go', 'python', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'system-design',
    difficulty: 3,
    question: '濡傛灉璁╀綘璁捐涓€涓潰鍚戝唴閮ㄧ殑浠诲姟璋冨害骞冲彴锛屼綘浼氭€庝箞璁捐浠诲姟瀹氫箟銆佽皟搴︺€侀噸璇曞拰鍙娴嬫€э紵',
    keywords: ['浠诲姟妯″瀷', '璋冨害', '閲嶈瘯', '骞傜瓑', '鐩戞帶'],
    referenceAnswer: '杩欑被棰樼洰閲嶇偣鏄妸浠诲姟鐨勫畾涔夈€佽皟搴︽墽琛屻€佸け璐ュ鐞嗗拰杩愮淮瑙傛祴鎷嗗紑璁层€傚€欓€変汉搴旇鑳借娓呬换鍔″厓鏁版嵁銆佽皟搴︽柟寮忋€佹墽琛屽櫒銆佸け璐ラ噸璇曘€佸幓閲嶄笌骞傜瓑锛屼互鍙婃棩蹇椼€佹寚鏍囥€佸憡璀︾瓑杩愮淮鑳藉姏銆?',
    excellentAnswer: '鎴戜細鎶婄郴缁熸媶鎴愪换鍔″畾涔夊眰銆佽皟搴︽帶鍒跺眰銆佹墽琛屽櫒灞傚拰瑙傛祴娌荤悊灞傘€備换鍔″畾涔夐噷鑷冲皯瑕佸寘鍚换鍔＄被鍨嬨€佽皟搴︽柟寮忥紙cron銆佸欢鏃躲€佷簨浠惰Е鍙戯級銆侀噸璇曠瓥鐣ャ€侀€夎矾淇℃伅鍜岃秴鏃舵椂闂淬€傝皟搴﹀眰璐熻矗鍒版椂鎵弿鍜屽垎鍙戜换鍔★紝涓轰簡閬垮厤閲嶅瑙﹀彂锛屼細鐢ㄤ换鍔″疄渚媔D 鍔犵姸鎬佹満鎴栧垎甯冨紡閿佸仛骞傜瓑淇濋殰銆傛墽琛屽櫒浼氫粠闃熷垪鎷夊彇浠诲姟锛屾墽琛屽墠鍏堣褰曞紑濮嬬姸鎬侊紝鎵ц澶辫触鎸夐€€閬块噸璇曪紝瓒呰繃闃堝€煎氨杩涘叆姝讳俊闃熷垪鎴栦汉宸ュ鐞嗛槦鍒椼€傚彟澶栬鎶婃棩蹇椼€佹墽琛屾椂闂淬€佹垚鍔熺巼銆侀噸璇曟鏁般€佺Н鍘嬫繁搴﹁繖浜涙寚鏍囧仛鍑烘潵锛岃繖鏍锋墠鑳界湡姝ｇ敤浜庡唴閮ㄧ敓浜с€?',
    followUps: [
      '濡傛灉浠诲姟宸茬粡鎵ц鎴愬姛锛屼絾璋冨害鍣ㄦ病鏀跺埌鍥炴墽锛屼綘鎬庝箞閬垮厤閲嶅鎵ц锛?',
      '浣犱細鎬庝箞璁捐浠诲姟鐨勮秴鏃躲€佸彇娑堝拰寮烘潃鏈哄埗锛?',
      '濡傛灉鏌愪釜涓嬫父渚濊禆鏁呴殰锛屼綘浼氭€庝箞鍋氭琛€鍜屾祦閲忎繚鎶わ紵'
    ],
    scoringRubric: {
      mustHave: ['浠诲姟妯″瀷', '璋冨害', '閲嶈瘯', '骞傜瓑'],
      goodToHave: ['鐩戞帶', '姝讳俊闃熷垪', '瓒呮椂', '鍙栬垗'],
      redFlags: ['鍙瀹氭椂浠诲姟鍔犳暟鎹簱', '娌℃湁骞傜瓑鎴栭噸璇曡璁?', '娌℃湁鍙娴嬫€?']
    }
  },
  {
    id: 'java_003',
    category: 'Java',
    roles: ['java', 'backend'],
    levels: ['middle', 'senior'],
    type: 'knowledge',
    difficulty: 3,
    question: '濡傛灉涓€涓?Java 鏈嶅姟棰戠箒鍑虹幇 Full GC 鍜岃姹傛姈鍔紝浣犱細鎬庝箞鍒ゆ柇鏄唴瀛樺垎閰嶃€佸璞℃粸鐣欒繕鏄弬鏁伴厤缃棶棰橈紵',
    keywords: ['鍏堝畾浣?', 'GC 鏃ュ織', '鍐呭瓨', '瀵硅薄', '鍙傛暟'],
    referenceAnswer: '杩欑被鎺掗殰棰樺叧閿槸鍏堝缓绔嬪垽鏂『搴忥細鍏堢‘璁?Full GC 鍙戠敓鏃舵鍜屽奖鍝嶈寖鍥达紝鍐嶇湅 GC 鏃ュ織銆佸爢浣跨敤鎯呭喌銆佸璞″垎閰嶉€熺巼鍜岃€佸勾浠ｆ粸鐣欙紝鏈€鍚庡啀鍒ゆ柇鏄惁闇€瑕佽皟鏁?JVM 鍙傛暟鎴栦紭鍖栦唬鐮併€?',
    excellentAnswer: '鎴戜笉浼氫竴涓婃潵灏辫皟鍙傦紝鑰屾槸鍏堢‘璁?Full GC 鐨勭幇璞°€傚厛鐪嬬洃鎺у拰 GC 鏃ュ織锛屽垽鏂槸鍚︾獊鐒舵湁瀵硅薄鍒嗛厤鏆存定銆佽€佸勾浠ｄ竴鐩存定涓嶄笅鏉ワ紝杩樻槸鍋滈】鏃堕棿鍦ㄦ煇涓増鏈悗鏄庢樉鍙樺樊銆傚鏋滄槸鍒嗛厤鐜囪繃楂橈紝浼氬幓鐪嬫槸鍚︽湁澶ч噺鐭懡瀵硅薄銆侀噸澶嶇紦鍐叉垨搴忓垪鍖栧紑閿€锛涙濡傛灉鏄€佸勾浠ｆ粸鐣欙紝灏辫缁撳悎 heap dump 鐪嬫槸鍚﹀瓨鍦ㄧ紦瀛樹笉鍙楁帶銆佺洃鍚櫒鏈噴鏀俱€佺嚎绋嬫湰鍦板彉閲忔垨闆嗗悎鎸佹湁杩囧瀵硅薄銆傚鏋滄棩蹇楁樉绀烘槸鍥炴敹鍣ㄥ弬鏁版垨鍫嗗尯鍩熼厤缃笉鍚堥€傦紝鎵嶄細鍦ㄦ湁鏍规嵁鐨勬儏鍐典笅璋冩暣鏂颁唬銆佽€佸勾浠ｆ垨鍨冨溇鍥炴敹鍣ㄩ€夊瀷銆傛渶鍚庣敤鍋滈】鏃堕棿銆丼LA 鍜?GC 棰戠巼楠岃瘉浼樺寲鏄惁鐢熸晥銆?',
    followUps: [
      '浣犱細浠?GC 鏃ュ織閲屽厛鐪嬪摢浜涙寚鏍囷紵',
      '濡傛灉鎬€鐤戞槸鍐呭瓨娉勬紡锛屼綘浼氭€庝箞蹇€熸墍瀹氱儹鐐瑰璞★紵',
      '浠€涔堟儏鍐典笅浣犳墠浼氳涓洪棶棰樺彲浠ラ€氳繃璋?JVM 鍙傛暟瑙ｅ喅锛?'
    ],
    scoringRubric: {
      mustHave: ['鍏堝畾浣?', 'GC 鏃ュ織', '鍐呭瓨', '瀵硅薄'],
      goodToHave: ['heap dump', '鍙傛暟', '鐩戞帶鏃堕棿绾?', '楠岃瘉'],
      redFlags: ['涓€涓婃潵灏辫鍔犲ぇ鍫?', '娌℃湁鎺掓煡椤哄簭', '涓嶄細鐪?GC 鏃ュ織']
    }
  },
  {
    id: 'frontend_003',
    category: '鍓嶇',
    roles: ['frontend', 'fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '璇磋浣犲仛杩囩殑涓€涓墠绔腑鍙版垨澶嶆潅涓氬姟鍚庡彴锛屼綘鏄€庝箞澶勭悊鐘舵€佺鐞嗐€佹潈闄愩€佺粍浠跺鐢ㄥ拰鍙淮鎶ゆ€х殑锛?',
    keywords: ['椤圭洰鑳屾櫙', '鐘舵€佺鐞?', '鏉冮檺', '缁勪欢澶嶇敤', '鍙栬垗'],
    referenceAnswer: '杩欑被鍓嶇椤圭洰棰樹笉鏄彧璁叉妧鏈爤锛岃€屾槸瑕佷綋鐜颁綘瀵瑰鏉備笟鍔″墠绔伐绋嬪寲鐨勫垽鏂€傚洖绛旈噷鏈€濂借兘璇存槑涓氬姟澶嶆潅鐐广€佷綘璐熻矗鐨勬ā鍧椼€佺姸鎬佸垏鍒嗘柟寮忋€佹潈闄愬拰璺敱鎺у埗銆佺粍浠朵笌妯″潡鐨勬娊璞★紝浠ュ強鍚庣画鎬庝箞闄嶄綆缁存姢鎴愭湰銆?',
    excellentAnswer: '鎴戝仛杩囦竴涓悜杩愯惀鍜屽鏈嶅洟闃熶娇鐢ㄧ殑鍚庡彴锛岄噷闈㈡湁璁㈠崟鏌ヨ銆佸鏍告祦绋嬨€佹椿鍔ㄩ厤缃拰鏉冮檺绠＄悊銆傛垜涓昏璐熻矗鍓嶇鏋舵瀯鍜屾牳蹇冧氦浜掓ā鍧椼€傜姸鎬佷笂鎴戞妸椤甸潰绾у埆鐨勭煭鏈熺姸鎬佺暀鍦ㄧ粍浠跺唴锛屽皢璺ㄩ〉闈㈠叡浜殑鏌ヨ鏉′欢銆佺敤鎴蜂俊鎭€佹潈闄愯兘鍔涘拰瀛楀吀鏁版嵁鏀惧埌鍏叡 store锛岄伩鍏嶄粈涔堥兘鏀惧叏灞€銆傛潈闄愪笂闄や簡璺敱瀹堝崼锛岃繕鍦ㄦ寜閽拰鎿嶄綔灞傚仛 capability 鍒ゆ柇锛岄伩鍏嶄粎闈犲墠绔殣钘忋€傜粍浠跺鐢ㄦ柟闈紝鎴戞妸琛ㄦ牸鎼滅储銆佹壒閲忔搷浣溿€佸鏍稿脊绐楁娊鎴愪笟鍔″煿浠讹紝鍚屾椂淇濈暀涓氬姟灞傜粍瑁呴€昏緫锛岄伩鍏嶄负浜嗗鐢ㄨ€屽鐢ㄣ€傚悗缁负浜嗛檷浣庣淮鎶ゆ垚鏈紝鎴戣繕琛ラ綈浜嗘ā鍧楃害瀹氭枃妗ｃ€佸叧閿祦绋嬬殑 E2E 鐢ㄤ緥鍜屽彂甯冨墠妫€鏌ヨ〃銆?',
    followUps: [
      '浣犱负浠€涔堟病鏈夋妸鎵€鏈夌姸鎬侀兘鏀惧埌鍏叡 store锛?',
      '濡傛灉鏉冮檺瑙勫垯缁忓父鍙樺姩锛屼綘浼氭€庝箞璁╁墠绔洿濂界淮鎶わ紵',
      '鏈夋病鏈変竴娆′綘鍙戠幇缁勪欢鎶借薄杩囧害锛屽悗鏉ユ€庝箞鏀癸紵'
    ],
    scoringRubric: {
      mustHave: ['椤圭洰鑳屾櫙', '鐘舵€佺鐞?', '鏉冮檺', '缁勪欢澶嶇敤'],
      goodToHave: ['鍙栬垗', '鍙淮鎶?', '娴嬭瘯', '涓汉鑱岃矗'],
      redFlags: ['鍙鐢ㄤ簡浠€涔堟鏋?', '娌℃湁鏉冮檺鎴栫姸鎬佸垎灞傛€濊矾', '缁勪欢鎶借薄鍜屼笟鍔¤竟鐣屼笉娓呮櫚']
    }
  },
  {
    id: 'fullstack_001',
    category: '椤圭洰缁忓巻',
    roles: ['fullstack'],
    levels: ['middle', 'senior'],
    type: 'project',
    difficulty: 3,
    question: '浣犲仛杩囩殑鍏ㄦ爤椤圭洰閲岋紝鏈夋病鏈変竴娆℃槸浣犻渶瑕佸悓鏃跺崗璋冨墠绔氦浜掋€佸悗绔帴鍙ｅ拰鏁版嵁涓€鑷存€х殑锛熻璇翠綘鐨勫垽鏂拰鍙栬垗銆?',
    keywords: ['椤圭洰鑳屾櫙', '鍓嶅悗绔崗鍚?', '鏁版嵁涓€鑷存€?', '鍙栬垗鍘熷洜', '缁撴灉'],
    referenceAnswer: '鍏ㄦ爤椤圭洰棰樺叧閿槸鐪嬪€欓€変汉鑳戒笉鑳界珯鍦ㄨ法灞傝瑙掑仛鍒ゆ柇锛屼笉鏄彧鍒嗗埆璁插墠绔垨鍚庣銆傚洖绛旈噷搴旇浣撶幇涓氬姟娴佺▼銆佹暟鎹悎鍚屻€佺敤鎴蜂綋楠屻€佸紓甯告祦杞拰鍓嶅悗绔悇鑷壙鎷呯殑璐ｄ换杈圭晫銆?',
    excellentAnswer: '鎴戝仛杩囦竴涓姤鍚嶄笅鍗曞拰鏀粯鐨勫叏閾捐矾鍔熻兘銆傜敤鎴峰湪鍓嶇濉啓淇℃伅鍚庯紝鍚庣浼氬垱寤洪璁㈠崟锛屾敮浠樻垚鍔熷悗鍐嶅皢鐘舵€佹祦杞埌姝ｅ紡璁㈠崟銆傝繖閲岀殑闅剧偣鏄敤鎴蜂綋楠屽笇鏈涙搷浣滅珛鍗虫湁鍙嶉锛屼絾鏀粯鍜岄€氱煡鍙堟槸寮傛鐨勩€傛垜鍦ㄥ墠绔笂鍋氫簡鐘舵€佹満寮忕殑浜や簰锛岃姣忎釜闃舵閮芥湁鏄庣‘鍙鐨勭瓑寰呫€佹垚鍔熷拰澶辫触鐘舵€侊紱鍚庣鍒欓€氳繃骞傜瓑 key 銆佸洖璋冮獙绛惧拰寤舵椂琛ュ伩閬垮厤閲嶅涓嬪崟鎴栫姸鎬佷涪澶便€傚墠鍚庣涔嬮棿鎴戜滑鍏堝畾涔夊ソ鐘舵€佸€笺€侀敊璇爜鍜屾彁绀鸿锛屽噺灏戜簡鍚勮嚜鐞嗚В涓嶄竴鑷村甫鏉ョ殑鎵毊銆傛渶鍚庣敤鎴峰畬鎴愮巼姣斿師鏉ユ彁楂樹簡锛岃€屼笖寮傚父璁㈠崟鐨勪汉宸ュ勭悊閲忔槑鏄句笅闄嶃€?',
    followUps: [
      '杩欎釜鍔熻兘閲屾渶瀹规槗鍑虹幇鍓嶅悗绔悊瑙ｄ笉涓€鑷寸殑鍦版柟鏄粈涔堬紵',
      '濡傛灉鍥炶皟寤惰繜鎴栦涪澶憋紝浣犲湪鍓嶇鍜屽悗绔垎鍒€庝箞澶勭悊锛?',
      '杩欎釜鏂规鐨勪唬浠锋槸浠€涔堬紝濡傛灉閲嶅仛浣犱細鍏堟敼鍝噷锛?'
    ],
    scoringRubric: {
      mustHave: ['椤圭洰鑳屾櫙', '鍓嶅悗绔崗鍚?', '鏁版嵁涓€鑷存€?', '鍙栬垗鍘熷洜'],
      goodToHave: ['鎸囨爣缁撴灉', '骞傜瓑', '寮傛', '涓汉鑱岃矗'],
      redFlags: ['鍙垎鍒鍓嶇鍜屽悗绔?', '娌℃湁涓€鑷存€ф垨寮傛澶勭悊鎰忚瘑', '鍙鍔熻兘娴佺▼涓嶈鍒ゆ柇鍜屽彇鑸?']
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
