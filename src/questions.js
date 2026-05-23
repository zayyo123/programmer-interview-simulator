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
    keywords: ['先定位', 'GC 日志', '内存', '对象', '参数'],
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
