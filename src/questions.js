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
