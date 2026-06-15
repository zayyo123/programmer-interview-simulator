import {
  createExternalQuestionDraftsFromSignals,
  syncExternalQuestionDrafts
} from '../src/externalSources.js';
import {
  createExternalQuestionCandidateReport,
  importPromotedCandidatesToDrafts
} from '../src/questionGovernance.js';
import {
  createFallbackInterviewerReply,
  createInterviewPlan,
  createReport,
  evaluateAnswerForTest,
  maybeAdvanceQuestion,
  recordAnswerForCurrentQuestion
} from '../src/interview.js';
import { questionBank } from '../src/questions.js';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;

async function main() {
  verifyStalledFollowUpCutoff();
  verifyFrontendAnswerGuide();
  verifyCodeDimensionScores();
  await verifyExternalQuestionSources();

  const server = spawn(process.execPath, ['src/server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      AI_PROVIDER: 'mock'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stderr = '';
  server.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHealth();

    const session = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'middle',
        style: 'normal',
        questionCount: 3,
        resume: '负责订单系统，使用 Java、MySQL、Redis，做过库存一致性优化。'
      }
    });

    assert(session.sessionId, 'sessionId should exist');
    assert(Array.isArray(session.plan) && session.plan.length >= 3, 'plan should contain requested questions');
    assert(
      session.plan.every((item) => item.skill),
      `plan entries should expose skill for future skill-level analytics, got: ${JSON.stringify(session.plan)}`
    );
    assert(
      session.plan.every((item) => typeof item.planReason === 'string' && item.planReason.length >= 6),
      `plan entries should explain why each question is scheduled, got: ${JSON.stringify(session.plan)}`
    );
    assert(session.plan[0]?.type === 'knowledge', `first question should be a technical knowledge question, got: ${session.plan[0]?.id || 'missing'}`);
    assert(session.plan[0]?.id !== 'project_001' && session.plan[0]?.id !== 'backend_004', `first question should not be a project question, got: ${session.plan[0]?.id}`);
    assert(session.liveCoach?.stage === 'opening', `new session should expose opening live coach state, got: ${session.liveCoach?.stage || 'missing'}`);
    assert(session.liveCoach?.target, 'new session should expose live coach interviewer target');
    assert(session.liveCoach?.pressureReason, 'new session should expose why the first answer matters');
    assert(Array.isArray(session.liveCoach?.missingSignals) && session.liveCoach.missingSignals.length >= 1, 'new session should expose opening missing signals');
    assert(
      session.plan.some((item) => item.id === 'backend_004'),
      `backend plan should include the consistency project question when resume signals match, got: ${session.plan.map((item) => item.id).join(', ')}`
    );

    const customizedSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '',
        profileAnalysis: {
          keywords: ['Redis', '系统设计'],
          focusTopics: ['缓存一致性与 Redis 排障', '高并发场景设计'],
          recommendedTracks: ['Redis 缓存一致性、热 key、大 key 和延迟排查。']
        }
      }
    });
    assert(
      customizedSession.plan.some((item) => item.category === 'Redis'),
      `profile analysis should influence the plan toward Redis, got: ${customizedSession.plan.map((item) => `${item.category}:${item.id}`).join(', ')}`
    );

    const questionDrillSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'middle',
        style: 'coaching',
        questionCount: 4,
        resume: [
          '报告单题重练：Redis',
          '原题：Redis 为什么快？',
          '优先补齐要点：I/O 多路复用',
          '避免扣分点：只回答因为是内存数据库',
          '下一轮追问方向：Redis 单线程为什么还能支撑高并发？'
        ].join('\n'),
        profileAnalysis: {
          isQuestionDrill: true,
          keywords: ['Redis'],
          focusTopics: ['单题薄弱点专项重练'],
          recommendedTracks: ['单题专项：同类基础题、定点追问、项目化表达和本题复盘。']
        }
      }
    });
    assert(
      questionDrillSession.plan.some((item) => item.category === 'Redis'),
      `single-question drill should bias backend selection toward the same skill/category, got: ${questionDrillSession.plan.map((item) => `${item.category}:${item.id}`).join(', ')}`
    );
    assert(
      questionDrillSession.plan.some((item) => /单题报告重练/.test(item.planReason || '')),
      `single-question drill plan should explain the report origin, got: ${questionDrillSession.plan.map((item) => item.planReason).join(' | ')}`
    );

    const externalDrafts = await request('/api/external-question-drafts');
    assert(
      externalDrafts.summary && Array.isArray(externalDrafts.sources) && Array.isArray(externalDrafts.drafts),
      `external question draft API should expose cached summary, sources and drafts, got: ${JSON.stringify(externalDrafts)}`
    );

    const externalCandidates = await request('/api/external-question-candidates?limit=5&minScore=60');
    assert(
      externalCandidates.summary?.candidateCount <= 5 && Array.isArray(externalCandidates.candidates),
      `external candidate API should return limited ranked candidates, got: ${JSON.stringify(externalCandidates.summary)}`
    );
    assert(
      externalCandidates.candidates.every((item) => item.promotionScore >= 60 && item.proposedQuestion?.scoringRubric?.mustHave?.length),
      `external candidates should include promotion scores and proposed question structures, got: ${JSON.stringify(externalCandidates.candidates?.[0])}`
    );

    const codingSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'middle',
        style: 'normal',
        questionCount: 5,
        resume: '',
        profileAnalysis: {
          keywords: ['MySQL', '算法'],
          focusTopics: ['SQL 分组统计', '算法复杂度与边界条件'],
          recommendedTracks: ['SQL题：查询最近 30 天每个用户已支付订单总金额。', '算法题：LRU 缓存设计。']
        }
      }
    });
    const lightweightCodingQuestions = codingSession.plan
      .filter((item) => ['sql', 'algorithm'].includes(item.codeKind));
    assert(
      lightweightCodingQuestions.length > 0,
      `profile analysis should be able to schedule a lightweight coding question, got: ${codingSession.plan.map((item) => `${item.category}:${item.id}:${item.codeKind || '-'}`).join(', ')}`
    );
    assert(
      lightweightCodingQuestions.every((item) => item.codeKind),
      `coding questions in the plan should expose codeKind, got: ${JSON.stringify(codingSession.plan)}`
    );

    const frontendCodingSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'frontend',
        level: 'middle',
        style: 'normal',
        questionCount: 5,
        resume: '',
        profileAnalysis: {
          keywords: ['前端'],
          focusTopics: ['前端 JS 手写代码题'],
          recommendedTracks: ['前端代码题：防抖节流、Promise、数组扁平化。']
        }
      }
    });
    assert(
      frontendCodingSession.plan.some((item) => item.codeKind === 'frontend'),
      `frontend customization should schedule a frontend coding question, got: ${frontendCodingSession.plan.map((item) => `${item.category}:${item.id}:${item.codeKind || '-'}`).join(', ')}`
    );

    const mobileClientCategories = new Set(['Android', 'iOS', '跨端/鸿蒙']);
    const pureFrontendSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'frontend',
        level: 'senior',
        style: 'pressure',
        questionCount: 8,
        resume: '负责 React 中后台、组件库、Webpack 性能优化、首屏加载和白屏监控。'
      }
    });
    assert(
      pureFrontendSession.plan.every((item) => !mobileClientCategories.has(item.category)),
      `pure frontend interviews should not include mobile client questions, got: ${pureFrontendSession.plan.map((item) => `${item.category}:${item.id}`).join(', ')}`
    );

    const androidFrontendSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'frontend',
        level: 'senior',
        style: 'pressure',
        questionCount: 8,
        resume: '负责 Android App、Kotlin、ANR、崩溃率治理和移动端性能优化。'
      }
    });
    assert(
      androidFrontendSession.plan.some((item) => item.category === 'Android'),
      `Android resume signals should allow Android questions, got: ${androidFrontendSession.plan.map((item) => `${item.category}:${item.id}`).join(', ')}`
    );
    assert(
      androidFrontendSession.plan.every((item) => !['iOS', '跨端/鸿蒙'].includes(item.category)),
      `Android resume signals should not unlock unrelated mobile tracks, got: ${androidFrontendSession.plan.map((item) => `${item.category}:${item.id}`).join(', ')}`
    );

    const backendCodingSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'middle',
        style: 'normal',
        questionCount: 5,
        resume: '',
        profileAnalysis: {
          keywords: ['系统设计', 'Redis'],
          focusTopics: ['高并发场景设计', '缓存一致性与 Redis 排障'],
          recommendedTracks: ['后端场景题：限流器、接口幂等、缓存穿透处理。']
        }
      }
    });
    assert(
      backendCodingSession.plan.some((item) => item.codeKind === 'backend'),
      `backend customization should schedule a backend scenario coding question, got: ${backendCodingSession.plan.map((item) => `${item.category}:${item.id}:${item.codeKind || '-'}`).join(', ')}`
    );

    const idempotencyCodingSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'middle',
        style: 'normal',
        questionCount: 5,
        resume: '岗位要求熟悉支付回调、下单写接口、接口幂等、幂等键、唯一约束、重复请求和 MQ 重复消费处理。'
      }
    });
    assert(
      idempotencyCodingSession.plan.some((item) => item.id === 'backend_code_003'),
      `backend idempotency customization should schedule backend_code_003, got: ${idempotencyCodingSession.plan.map((item) => `${item.category}:${item.id}:${item.codeKind || '-'}`).join(', ')}`
    );

    const technicalWarmupAnswer = [
      'MySQL 索引能提升查询速度，核心是用 B+ 树这样的有序结构减少扫描范围。',
      'InnoDB 主键索引的叶子节点存整行数据，二级索引叶子节点存主键值，所以查非索引字段可能需要回表。',
      '如果查询字段都在索引里，就可以走覆盖索引，减少回表和随机 I/O。',
      '所以我会从减少扫描范围、B+ 树有序定位、回表成本和覆盖索引这几块回答。'
    ].join('');
    const warmupAnswer = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: technicalWarmupAnswer }
    });
    assert(warmupAnswer.liveCoach?.stage, 'technical warmup response should expose a live coach snapshot');
    assert(warmupAnswer.currentQuestion === 'backend_004', `technical warmup should advance to the project question, got: ${warmupAnswer.currentQuestion}`);

    const weakAnswer = '我们团队做了一个项目，主要用了 Java。';
    const answer1 = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: weakAnswer }
    });
    const lastReply1 = answer1.messages.at(-1)?.content || '';
    assert(
      /你自己负责|亲手负责|技术栈|项目是给谁解决什么问题|业务背景|核心考点|卡在哪里/.test(lastReply1),
      `follow-up should target the missing project signal, got: ${lastReply1}`
    );
    assert(answer1.liveCoach?.stage === 'clarify', `first weak answer should expose clarify follow-up stage, got: ${answer1.liveCoach?.stage || 'missing'}`);
    assert(answer1.liveCoach?.suggestedMove, 'first weak answer should include a live coach next move');
    assert(answer1.liveCoach?.pressureReason, 'weak answer should include a live coach pressure reason');
    assert(Array.isArray(answer1.liveCoach?.missingSignals) && answer1.liveCoach.missingSignals.length >= 1, 'weak answer should include missing interview signals');
    assert(answer1.currentQuestion === 'backend_004', 'weak project answer should stay on the project question');

    const weakAnswer2 = '主要还是团队一起做的，我这边就是参与开发。';
    const answerRepeat = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: weakAnswer2 }
    });
    const lastReplyRepeat = answerRepeat.messages.at(-1)?.content || '';
    assert(
      /不要再用“我们”概括|没有回答到点上|直接从你本人开始讲|别再总结观点/.test(lastReplyRepeat),
      `repeated weak answer should trigger a tighter follow-up, got: ${lastReplyRepeat}`
    );
    assert(
      ['pin_down', 'pressure'].includes(answerRepeat.liveCoach?.stage),
      `repeated weak answer should escalate live coach stage, got: ${answerRepeat.liveCoach?.stage || 'missing'}`
    );
    assert(answerRepeat.currentQuestion === 'backend_004', 'repeated weak project answer should still stay on the project question');

    const strongerAnswer = [
      '这个项目是订单履约系统，目标是减少库存扣减和订单状态不一致的问题。',
      '我主要负责订单状态流转、数据一致性和幂等设计，技术栈是 Java、MySQL、Redis 和 MQ。',
      '当时最大的难点是支付回调、库存扣减和消息重试之间可能出现重复或乱序。',
      '我通过本地消息表、业务单号幂等、状态机校验和补偿任务保证最终一致性。',
      '之所以不用强一致分布式事务，是因为链路跨服务且峰值流量高，优先保证可恢复性和下单成功率，最后异常订单明显减少。'
    ].join('');
    const answer2 = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: strongerAnswer }
    });
    assert(answer2.liveCoach?.stage, 'stronger answer response should still expose a live coach snapshot');
    assert(answer2.currentQuestion !== 'backend_004', 'stronger project answer should advance to the next question');

    const seniorSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责过高并发订单和缓存排障，做过 Redis 延迟分析和任务调度平台治理。'
      }
    });
    assert(
      seniorSession.plan.some((item) => item.id === 'redis_002'),
      `senior backend troubleshooting session should include redis_002, got: ${seniorSession.plan.map((item) => item.id).join(', ')}`
    );

    let seniorCurrentQuestion = seniorSession.plan[0]?.id;
    let seniorBridgeGuard = 0;
    while (seniorCurrentQuestion !== 'redis_002' && seniorBridgeGuard < 5) {
      seniorBridgeGuard += 1;
      const bridgeAnswer = {
        mysql_001: [
          'MySQL 索引提升查询速度的核心是用 B+ 树这样的有序结构减少扫描范围。',
          'InnoDB 主键索引叶子节点存整行数据，二级索引叶子节点存主键值，所以二级索引查非索引字段可能需要回表。',
          '如果查询字段都在索引里，就可以走覆盖索引，减少回表和随机 I/O。',
          '所以我会从减少扫描范围、B+ 树定位、回表成本和覆盖索引这几块回答。'
        ].join(''),
        backend_004: [
          '我做过高并发订单链路治理项目，业务目标是降低支付成功后订单和库存不一致的问题。',
          '我负责订单状态流转、数据一致性和幂等设计。',
          '核心风险是支付回调重复、库存扣减超时和 MQ 重投会导致状态乱序或重复执行。',
          '我用业务单号加事件类型做幂等，用状态机限制非法流转，失败时落补偿任务并按退避策略重试。',
          '没有直接用强一致事务，是因为跨服务链路峰值流量高，优先保证可恢复性和下单成功率，异常订单明显减少。'
        ].join('')
      }[seniorCurrentQuestion] || [
        '我会先给结论，再补核心机制、边界条件和实际场景。',
        '这题的关键是先说明主链路，再解释为什么这样设计，以及异常情况下怎么验证。',
        '如果是线上问题，我会先看影响范围和时间线，再结合监控、日志和关键指标定位。'
      ].join('');
      const projectBridgeAnswer = await request(`/api/interviews/${seniorSession.sessionId}/answer`, {
        method: 'POST',
        body: { answer: bridgeAnswer }
      });
      seniorCurrentQuestion = projectBridgeAnswer.currentQuestion;
    }
    assert(
      seniorCurrentQuestion === 'redis_002',
      `senior troubleshooting flow should advance to redis_002 before Redis answer, got: ${seniorCurrentQuestion}`
    );

    const seniorAnswer = await request(`/api/interviews/${seniorSession.sessionId}/answer`, {
      method: 'POST',
      body: {
        answer: '我会先看监控，看看 Redis 是不是慢了，再看看网络和内存，如果有问题就处理。'
      }
    });
    const seniorReply = seniorAnswer.messages.at(-1)?.content || '';
    assert(
      /按真实排障顺序回答|先确认影响范围|网络层讲具体|只聚焦内存信号|不要只说会看日志/.test(seniorReply),
      `senior troubleshooting follow-up should force a concrete diagnostic path, got: ${seniorReply}`
    );

    const backendScenarioSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'backend',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责支付回调、订单状态流转和库存补偿，做过异常订单治理。'
      }
    });
    assert(
      backendScenarioSession.plan.some((item) => item.id === 'backend_004'),
      `senior backend scenario should include backend_004, got: ${backendScenarioSession.plan.map((item) => item.id).join(', ')}`
    );

    const backendScenarioAnswer = await request(`/api/interviews/${backendScenarioSession.sessionId}/answer`, {
      method: 'POST',
      body: {
        answer: '我们主要用 MQ 和消息重试保证一致性，基本就是这个方案。'
      }
    });
    const backendScenarioReply = backendScenarioAnswer.messages.at(-1)?.content || '';
    assert(
      /支付回调|MQ 重投|补偿重跑|库存|最终一致|业务背景|核心考点|解决什么问题/.test(backendScenarioReply),
      `backend consistency follow-up should probe concrete chain risk, got: ${backendScenarioReply}`
    );

    const javaSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'java',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责 Java 订单履约链路治理，做过线程池隔离、事务边界拆分和失败补偿。'
      }
    });
    assert(
      javaSession.plan.some((item) => item.id === 'java_004'),
      `java session should include java_004 when resume signals match, got: ${javaSession.plan.map((item) => item.id).join(', ')}`
    );

    const javaAnswer = await request(`/api/interviews/${javaSession.sessionId}/answer`, {
      method: 'POST',
      body: {
        answer: '我们主要用 Java 把链路拆成几个服务，再配上异步处理。'
      }
    });
    const javaReply = javaAnswer.messages.at(-1)?.content || '';
    assert(
      /简历里提到过|订单履约链路治理|线程池隔离|事务边界|失败补偿|业务背景|核心考点|解决什么问题/.test(javaReply),
      `java project follow-up should anchor on resume-backed project context, got: ${javaReply}`
    );

    const goSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'go',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责 Go 异步任务平台，做过 goroutine 调度、限流背压和 context 超时治理。'
      }
    });
    assert(
      goSession.plan.some((item) => item.id === 'go_003'),
      `go session should include go_003 when resume signals match, got: ${goSession.plan.map((item) => item.id).join(', ')}`
    );

    const goProfileSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'go',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责 Go 并发治理，处理过 channel 阻塞、context 取消、mutex 锁竞争、goroutine 泄漏和 pprof 排查。',
        profileAnalysis: {
          keywords: ['Go', 'channel', 'context'],
          focusTopics: ['mutex 锁竞争', 'goroutine 泄漏', 'block profile'],
          recommendedTracks: ['Go题：channel、context、mutex 和并发泄漏治理。']
        }
      }
    });
    assert(
      ['go_004', 'approved_go_goroutine_001', 'approved_rigorous_go_001_context超时泄漏'].includes(goProfileSession.plan[0]?.id),
      `go profile session should start with a Go concurrency governance question when role-specific concurrency signals match, got: ${goProfileSession.plan.map((item) => item.id).join(', ')}`
    );

    const pythonSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'python',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责 Python worker 和 Celery 队列治理，处理过 CPU 飙高、GIL 争用和任务积压。'
      }
    });
    assert(
      pythonSession.plan.some((item) => item.id === 'python_004'),
      `python session should include python_004 when resume signals match, got: ${pythonSession.plan.map((item) => item.id).join(', ')}`
    );

    const frontendIncidentSession = await request('/api/interviews', {
      method: 'POST',
      body: {
        role: 'frontend',
        level: 'senior',
        style: 'pressure',
        questionCount: 5,
        resume: '负责前端发布和监控，排查过白屏、资源 404 和运行时异常。'
      }
    });
    assert(
      frontendIncidentSession.plan.some((item) => item.id === 'frontend_002'),
      `senior frontend incident session should include frontend_002, got: ${frontendIncidentSession.plan.map((item) => item.id).join(', ')}`
    );

    const frontendIncidentAnswer = await request(`/api/interviews/${frontendIncidentSession.sessionId}/answer`, {
      method: 'POST',
      body: {
        answer: '我会先看报错和监控，如果有问题就先回滚。'
      }
    });
    const frontendIncidentReply = frontendIncidentAnswer.messages.at(-1)?.content || '';
    assert(
      /影响版本|用户范围|资源加载失败|运行时异常|回滚|热修|业务背景|核心考点|解决什么问题/.test(frontendIncidentReply),
      `frontend white-screen follow-up should probe concrete incident handling, got: ${frontendIncidentReply}`
    );

    const reportResult = await request(`/api/interviews/${session.sessionId}/finish`, {
      method: 'POST'
    });
    const firstQuestion = reportResult.report?.questions?.[0];
    const interviewerConcerns = reportResult.report?.overview?.interviewerConcerns;
    assert(firstQuestion, 'report should include first question details');
    assert(
      Array.isArray(firstQuestion.dimensionScores) && firstQuestion.dimensionScores.length === 4,
      'report should include four dimension scores for each answered question'
    );
    assert(
      firstQuestion.type,
      'report question entries should include the original question type'
    );
    assert(
      firstQuestion.skill,
      'report question entries should include the normalized skill field'
    );
    assert(
      Array.isArray(firstQuestion.expectedPoints) && firstQuestion.expectedPoints.length >= 1,
      'report question entries should include expected answer points'
    );
    assert(
      Array.isArray(firstQuestion.expectedPointCoverage) && firstQuestion.expectedPointCoverage.length === firstQuestion.expectedPoints.length,
      'report question entries should include expected point coverage'
    );
    assert(
      firstQuestion.expectedPointCoverage.every((item) => item.point && typeof item.covered === 'boolean'),
      'expected point coverage should include point text and boolean status'
    );
    assert(
      firstQuestion.dimensionScores.every((item) => item.label && Number.isFinite(Number(item.score)) && item.detail),
      'each dimension score should include label, numeric score, and detail'
    );
    assert(
      /核心点没答实|表达上最影响说服力|下一句就该补/.test(firstQuestion.gapAnalysis || ''),
      'gap analysis should explain the interview gap'
    );
    assert(interviewerConcerns?.headline, 'report overview should include an interviewer concern headline');
    assert(
      Array.isArray(interviewerConcerns?.evidence) && interviewerConcerns.evidence.length >= 1,
      'report overview should include interviewer concern evidence'
    );
    assert(
      /追问|风险|题|面试官/.test(interviewerConcerns.summary || ''),
      `interviewer concern summary should explain the concern, got: ${interviewerConcerns?.summary || ''}`
    );
    assert(firstQuestion.answerPlaybook?.interviewerIntent, 'report should include answer playbook interviewer intent');
    assert(firstQuestion.answerPlaybook?.first30Seconds, 'report should include answer playbook first-30-seconds guidance');
    assert(
      Array.isArray(firstQuestion.answerPlaybook?.proofPoints) && firstQuestion.answerPlaybook.proofPoints.length >= 1,
      'report should include answer playbook proof points'
    );

    console.log('Smoke test passed');
  } finally {
    server.kill();
    if (stderr.trim()) {
      process.stderr.write(stderr);
    }
  }
}

function verifyStalledFollowUpCutoff() {
  const config = {
    role: 'backend',
    level: 'middle',
    style: 'pressure',
    questionCount: 5,
    resume: '负责订单系统，使用 Java、MySQL、Redis，做过库存一致性优化。'
  };
  const session = {
    config,
    plan: createInterviewPlan(config),
    currentIndex: 0,
    answers: [],
    completed: false,
    messages: []
  };
  const weakAnswers = [
    '我们团队做了一个订单项目，主要用 Java。',
    '主要还是团队一起做的，我这边就是参与开发。',
    '就是配合开发和联调，更多是团队推进。'
  ];

  for (const answer of weakAnswers) {
    recordAnswerForCurrentQuestion(session, answer);
    createFallbackInterviewerReply({ session, answer });
    maybeAdvanceQuestion(session, answer);
  }

  const report = createReport(session);
  assert(session.currentIndex === 1, `stalled follow-up should advance after repeated non-progress answers, got index ${session.currentIndex}`);
  assert(
    typeof report.questions[0]?.planReason === 'string' && report.questions[0].planReason.length >= 6,
    `report questions should preserve plan reasons, got: ${JSON.stringify(report.questions[0])}`
  );
  assert(report.questions[0]?.exitReason === 'stalled_follow_up', `stalled answer should be marked as interviewer cutoff, got ${report.questions[0]?.exitReason}`);
  assert(
    /主动收口|连续追问后被面试官主动收口/.test(report.questions[0]?.gapAnalysis || ''),
    `gap analysis should explain the interviewer cutoff, got: ${report.questions[0]?.gapAnalysis || ''}`
  );
  assert(report.uncoveredQuestions.length >= 1, 'report should keep remaining planned questions as uncovered after cutoff');
  assert(
    report.uncoveredQuestions.every((item) => typeof item.planReason === 'string' && item.planReason.length >= 6),
    `uncovered questions should preserve plan reasons, got: ${JSON.stringify(report.uncoveredQuestions)}`
  );

  const drillConfig = {
    role: 'backend',
    level: 'middle',
    style: 'coaching',
    questionCount: 3,
    resume: [
      '报告单题重练：Redis',
      '原题：Redis 为什么快？',
      '优先补齐要点：I/O 多路复用',
      '避免扣分点：只回答因为是内存数据库'
    ].join('\n'),
    profileAnalysis: {
      isQuestionDrill: true,
      keywords: ['Redis'],
      focusTopics: ['单题薄弱点专项重练'],
      recommendedTracks: ['单题专项：同类基础题、定点追问、项目化表达和本题复盘。']
    }
  };
  const drillSession = {
    config: drillConfig,
    plan: createInterviewPlan(drillConfig),
    currentIndex: 0,
    answers: [],
    completed: false,
    messages: []
  };
  recordAnswerForCurrentQuestion(drillSession, 'Redis 快主要因为内存和 I/O 多路复用，还要补单线程模型和数据结构。');
  const drillReport = createReport(drillSession);
  assert(
    drillReport.questions[0]?.questionDrillTarget?.source === '单题报告重练',
    `single-question drill report should persist structured drill target, got: ${JSON.stringify(drillReport.questions[0]?.questionDrillTarget)}`
  );
  assert(
    drillReport.questions[0]?.questionDrillTarget?.missedPoint === 'I/O 多路复用',
    `single-question drill report should persist the missed point, got: ${JSON.stringify(drillReport.questions[0]?.questionDrillTarget)}`
  );
}

function verifyFrontendAnswerGuide() {
  const html = readFileSync('public/index.html', 'utf8');
  const app = readFileSync('public/app.js', 'utf8').replace(/\r\n/g, '\n');
  const styles = readFileSync('public/styles.css', 'utf8');

  assert(html.includes('id="answerGuide"'), 'frontend should render the current answer guide container');
  assert(html.includes('id="planPreview"'), 'setup form should render a pre-interview plan preview container');
  assert(html.includes('/app.js?v=geek-light-1'), 'index should load the latest frontend bundle version');
  assert(html.includes('/vendor/echarts.min.js'), 'index should load ECharts for dashboard charts');
  assert(app.includes('function renderAnswerGuide'), 'frontend should update answer guide from current question state');
  assert(app.includes('function renderQuestionDrillAnswerGuide'), 'answer guide should render single-question drill guidance');
  assert(app.includes('function parseQuestionDrillPlanReason'), 'answer guide should parse single-question drill plan reasons');
  assert(app.includes('单题重练目标'), 'answer guide should label single-question drill goals');
  assert(app.includes('本题先补齐'), 'answer guide should remind users of the missed point before answering');
  assert(app.includes('function renderPlanPreview'), 'frontend should render a pre-interview plan preview');
  assert(app.includes('function createPlanPreviewReasons'), 'plan preview should explain why this session is arranged');
  assert(app.includes('function createTrainingStagePreview'), 'plan preview and next-session recommendation should share stage generation');
  assert(app.includes('isQuestionDrill'), 'plan preview should detect single-question drill intent');
  assert(app.includes('单题薄弱点专项重练'), 'single-question drill should become a visible focus topic');
  assert(app.includes('同类基础题 + 定点追问 + 本题复盘'), 'single-question drill should map to focused question types');
  assert(app.includes('项目化表达'), 'single-question drill preview should include project-style expression practice');
  assert(app.includes('预览只展示面试节奏'), 'plan preview should avoid leaking concrete questions and answers');
  assert(app.includes('风险对应题型'), 'profile analysis should explain which question types map to risks');
  assert(app.includes('function createRiskQuestionMappings'), 'profile analysis should build risk-to-question mappings');
  assert(app.includes('项目经历题 + 个人职责追问'), 'risk mapping should connect project risk to project follow-ups');
  assert(app.includes('安排原因：'), 'interview route should show why each planned question is scheduled');
  assert(app.includes('当前答题方式：'), 'answer guide should use Chinese training copy');
  assert(app.includes('code-answer-mode'), 'coding questions should switch the answer area into code mode');
  assert(app.includes('data-code-answer-mode'), 'coding questions should allow switching answer modes');
  assert(app.includes('function renderCodeAnswerModeSwitch'), 'coding questions should render a lightweight answer mode switch');
  assert(app.includes('function getCodeAnswerModeGuide'), 'coding answer mode should update prompts and checklist');
  assert(app.includes('SQL 代码'), 'coding answer mode should include SQL-specific copy');
  assert(app.includes('思路说明'), 'coding answer mode should include explanation mode copy');
  assert(app.includes('function renderCodeAnswerChecklist'), 'coding questions should render a structured answer checklist');
  assert(app.includes('先讲解题思路'), 'coding checklist should prompt for solution thinking');
  assert(app.includes('写伪代码或关键代码'), 'coding checklist should prompt for pseudocode or key code');
  assert(app.includes('<details class="learning-materials">'), 'report learning materials should be collapsed by default');
  assert(app.includes('参考要点'), 'report learning materials should include expected answer points');
  assert(app.includes('要点覆盖'), 'report learning materials should show expected point coverage');
  assert(app.includes('function renderExpectedPointCoverage'), 'frontend should render expected point coverage');
  assert(app.includes('常见扣分点'), 'report should expose common mistakes inside learning materials');
  assert(app.includes('代码题复盘重点'), 'coding reports should expose code review focus inside learning materials');
  assert(app.includes('按作答清单补齐'), 'coding reports should map dimension scores back to the answer checklist');
  assert(app.includes('function getCodeChecklistGaps'), 'coding reports should calculate checklist gaps from dimension scores');
  assert(app.includes('function getCodeReviewModeSuggestion'), 'coding reports should recommend the next answer mode');
  assert(app.includes('建议下次优先使用'), 'coding reports should explain which answer mode to use next');
  assert(app.includes('function renderReportCodeModeDrillAction'), 'coding reports should render a direct drill action');
  assert(app.includes('按本题模式补练'), 'coding reports should allow drilling the suggested answer mode from the report');
  assert(app.includes('data-report-code-mode-status'), 'coding report drill action should show local status feedback');
  assert(app.includes('已写入左侧配置和计划预览'), 'coding report drill action should confirm the setup was updated');
  assert(app.includes('return true;'), 'coding answer mode drill should report successful application');
  assert(app.includes('function renderReportQuestionDrillAction'), 'reports should render a direct drill action for each question');
  assert(app.includes('function applyReportQuestionDrill'), 'reports should apply a single-question weakness drill to setup');
  assert(app.includes('data-apply-report-question'), 'question reports should expose a targeted drill action');
  assert(app.includes('重练本题薄弱点'), 'question report drill action should use Chinese training copy');
  assert(app.includes('function createReportQuestionDrillPrompt'), 'question report drill should build a targeted prompt');
  assert(app.includes('function findFirstMissedExpectedPoint'), 'question report drill should prioritize missed expected points');
  assert(app.includes('codeReviewModeSuggestion: createStoredCodeReviewModeSuggestion'), 'history should persist coding answer mode suggestions');
  assert(app.includes('function renderHistoryCodeModeSuggestions'), 'dashboard should render coding answer mode suggestions');
  assert(app.includes('function calculateCodeModeSuggestions'), 'dashboard should aggregate coding answer mode suggestions');
  assert(app.includes('function createCodeModeSuggestionKey'), 'coding answer mode actions should share a stable suggestion key');
  assert(app.includes('代码题作答模式建议'), 'dashboard should expose coding answer mode suggestions in Chinese');
  assert(app.includes('data-apply-code-mode'), 'coding answer mode suggestions should allow applying a drill');
  assert(app.includes('function applyCodeModeSuggestionDrill'), 'coding answer mode drill should write the mode back to setup');
  assert(app.includes('按这个模式补练'), 'coding answer mode action should use Chinese training copy');
  assert(app.includes('function getCodeKindPracticeKeywords'), 'coding answer mode drill should map code kinds to practice keywords');
  assert(app.includes('SQL题、分组统计、窗口函数、索引性能'), 'SQL coding drill should bias the next plan toward SQL query practice');
  assert(app.includes('前端 JS 手写、Promise、防抖节流、数组处理'), 'frontend coding drill should bias the next plan toward JS hand-written questions');
  assert(app.includes('后端场景伪代码、接口幂等、限流、缓存穿透'), 'backend coding drill should bias the next plan toward scenario pseudocode');
  assert(app.includes('算法复杂度、边界条件、数据结构'), 'algorithm coding drill should bias the next plan toward algorithm expression');
  assert(app.includes('补伪代码或关键实现'), 'coding reports should call out missing pseudocode or implementation');
  assert(app.includes('失败恢复'), 'backend coding review focus should include failure recovery');
  assert(app.includes('questionId: item.questionId'), 'history should persist stable question ids for question-level analytics');
  assert(app.includes('planReason: item.planReason'), 'history should persist plan reasons for question-level review');
  assert(app.includes('questionDrillTarget: item.questionDrillTarget'), 'history should persist structured single-question drill targets');
  assert(app.includes('本题安排原因'), 'report should show why each question was scheduled');
  assert(app.includes('function renderQuestionDrillTarget'), 'report and history should render single-question drill target records');
  assert(app.includes('function formatQuestionDrillTargetMarkdown'), 'markdown export should format single-question drill target records');
  assert(app.includes('- 单题重练目标：'), 'exported markdown should include single-question drill targets');
  assert(app.includes('function isQuestionDrillPlanReason'), 'interview progress should detect single-question drill plan reasons');
  assert(app.includes('单题重练目标'), 'interview progress should label single-question drill targets');
  assert(app.includes('来自单题报告重练'), 'interview progress should explain the drill origin during the route');
  assert(app.includes('- 安排原因：'), 'exported markdown should include per-question plan reasons');
  assert(app.includes('## 未覆盖的计划题目'), 'exported markdown should include uncovered planned questions');
  assert(app.includes('推荐下一场面试'), 'dashboard should recommend the next interview session');
  assert(app.includes('next-session-stages'), 'next-session recommendation should preview the next interview stages');
  assert(app.includes('createRecommendedSessionStages'), 'next-session recommendation should build a stage preview');
  assert(app.includes('nextSessionRecommendation'), 'history should persist the next-session recommendation snapshot');
  assert(app.includes('function createStoredNextSessionRecommendation'), 'history should store a compact next-session recommendation');
  assert(app.includes('uncoveredQuestions: Array.isArray(report.uncoveredQuestions)'), 'history and recommendation records should persist uncovered planned questions');
  assert(app.includes('function findPriorityUncoveredQuestion'), 'next-session recommendation should prioritize uncovered planned questions');
  assert(app.includes('优先补齐上一轮未覆盖'), 'next-session recommendation should explain uncovered-question practice focus');
  assert(app.includes('createUncoveredQuestionDrillPrompt'), 'next-session recommendation should build drills from uncovered planned questions');
  assert(app.includes('function createHistoryRecommendationSummary'), 'history should render the original next-session recommendation summary');
  assert(app.includes('data-clear-history'), 'history dashboard should allow clearing local history');
  assert(app.includes('function clearPracticeHistory'), 'history dashboard should implement local history clearing');
  assert(app.includes('最多保留'), 'history dashboard should communicate the retention limit');
  assert(app.includes('data-delete-history-record'), 'history records should allow deleting a single local record');
  assert(app.includes('function deleteHistoryRecord'), 'history records should implement single-record deletion');
  assert(app.includes('删除这条记录'), 'history record deletion should use Chinese UI copy');
  assert(app.includes('function renderHistoryRecord'), 'history should render expandable interview records');
  assert(app.includes('function renderHistoryRecordQuestions'), 'history should render saved question details inside records');
  assert(app.includes('本轮题目回看'), 'history record details should show saved interview questions');
  assert(app.includes('data-apply-history-record'), 'history records should allow applying a targeted drill');
  assert(app.includes('function applyHistoryRecordDrill'), 'history records should apply a targeted weak-question drill');
  assert(app.includes('function findLowestScoreQuestion'), 'history record drill should select the lowest-score question');
  assert(app.includes('重练这轮薄弱题'), 'history record drill should expose a Chinese retry action');
  assert(app.includes('最弱技能点'), 'dashboard should summarize weak skills');
  assert(app.includes('高频薄弱题目'), 'dashboard should summarize recurring weak questions');
  assert(app.includes('function renderHistoryWeakSkills'), 'frontend should render weak skill analytics');
  assert(app.includes('function renderHistoryWeakQuestions'), 'frontend should render weak question analytics');
  assert(app.includes('未完成训练目标'), 'dashboard should surface unfinished planned training targets');
  assert(app.includes('function renderHistoryUnfinishedTargets'), 'frontend should render unfinished training targets');
  assert(app.includes('function calculateUnfinishedTargets'), 'frontend should calculate unfinished targets from history');
  assert(app.includes('data-apply-unfinished-target'), 'unfinished targets should allow applying a targeted drill');
  assert(app.includes('function applyUnfinishedTargetDrill'), 'unfinished target drill should write the target back to setup');
  assert(app.includes('补练这个目标'), 'unfinished target action should use Chinese training copy');
  assert(app.includes('专项重练完成情况'), 'dashboard should summarize single-question drill progress');
  assert(app.includes('function renderHistoryQuestionDrillProgress'), 'frontend should render single-question drill progress');
  assert(app.includes('function calculateQuestionDrillProgress'), 'frontend should calculate single-question drill progress');
  assert(app.includes('data-apply-question-drill'), 'single-question drill progress should allow continuing an unfinished target');
  assert(app.includes('function applyQuestionDrillProgressDrill'), 'single-question drill progress should write the target back to setup');
  assert(app.includes('继续补练这个目标'), 'single-question drill progress action should use Chinese training copy');
  assert(app.includes('继续补练'), 'single-question drill progress should show unfinished status');
  assert(app.includes('已达标'), 'single-question drill progress should show completed status');
  assert(app.includes('达标标准：最高分达到 75 分'), 'single-question drill progress should explain the pass threshold');
  assert(app.includes('当前最弱维度'), 'single-question drill progress should surface the weakest dimension');
  assert(app.includes('function findQuestionDrillWeakestDimension'), 'frontend should calculate weakest dimension for single-question drills');
  assert(app.includes('function createQuestionDrillPassStandard'), 'frontend should format the single-question drill pass standard');
  assert(app.includes('function calculateWeakQuestions'), 'frontend should reuse weak question analytics for recommendations');
  assert(app.includes('function calculateWeakSkills'), 'frontend should reuse weak skill analytics for recommendations');
  assert(app.includes('createWeakQuestionDrillPrompt'), 'next-session recommendation should build drills from concrete weak questions');
  assert(app.includes('目标把平均分从'), 'next-session recommendation should prioritize the weakest skill');
  assert(app.includes('减少追问次数'), 'next-session recommendation should prioritize weak question follow-up reduction');
  assert(app.includes('function createSkillDrillPrompt'), 'next-session recommendation should build a skill drill prompt');
  assert(app.includes('技能训练要求'), 'applying next-session recommendation should write skill drill requirements into setup');
  assert(app.includes('renderProfileAnalysis(resumeInput.value);\n  renderPlanPreview();'), 'applying next-session recommendation should refresh the left plan preview');
  assert(app.includes('高频未覆盖要点'), 'dashboard should summarize recurring missed expected points');
  assert(app.includes('function renderHistoryMissedPoints'), 'frontend should render recurring missed expected points');
  assert(app.includes('高频扣分点'), 'dashboard should summarize recurring common mistakes');
  assert(app.includes('data-apply-next-session'), 'dashboard should allow applying the next session recommendation');
  assert(app.includes('function applyNextSessionRecommendation'), 'frontend should apply the recommended session back to setup controls');
  assert(app.includes('function applyRecommendationToSetup'), 'recommendation actions should reuse setup application logic');
  assert(app.includes('data-copy-report'), 'report should expose a copy-to-markdown action');
  assert(app.includes('function createReportMarkdown'), 'frontend should build a markdown report for export');
  assert(app.includes('程序员模拟面试复盘报告'), 'exported report should use Chinese markdown title');
  assert(app.includes('代码题清单缺口'), 'exported markdown report should include coding checklist gaps');
  assert(app.includes('建议下次模式：'), 'exported markdown report should include coding answer mode suggestions');
  assert(app.includes('## 推荐下一场面试'), 'exported markdown report should include the recommended next interview');
  assert(app.includes('function formatNextSessionMarkdown'), 'exported markdown report should format next-session configuration');
  assert(app.includes('阶段预览：'), 'exported markdown report should include the next-session stage preview');
  assert(styles.includes('.code-answer-mode textarea'), 'code answer mode should have dedicated textarea styling');
  assert(styles.includes('.answer-guide-drill'), 'single-question drill answer guide should have dedicated styling');
  assert(styles.includes('.code-answer-mode-switch'), 'code answer mode switch should have dedicated styling');
  assert(styles.includes('.progress-step p'), 'plan reason copy should have dedicated route-step styling');
  assert(styles.includes('.progress-step.question-drill'), 'single-question drill route steps should have dedicated styling');
  assert(styles.includes('.progress-drill-badge'), 'single-question drill route badge should have dedicated styling');
  assert(styles.includes('.question-drill-target'), 'report/history single-question drill targets should have dedicated styling');
  assert(styles.includes('.code-answer-checklist'), 'code answer checklist should have dedicated styling');
  assert(styles.includes('.risk-question-map'), 'risk-to-question mapping should have dedicated styling');
  assert(styles.includes('.plan-preview-steps'), 'plan preview should have dedicated step styling');
  assert(styles.includes('.plan-preview-reasons'), 'plan preview reasons should have dedicated styling');
  assert(styles.includes('.learning-materials summary'), 'learning materials should have dedicated collapsed-summary styling');
  assert(styles.includes('.code-review-gap'), 'code review checklist gaps should have dedicated styling');
  assert(styles.includes('.code-review-gap p'), 'code review mode suggestion should have compact styling');
  assert(styles.includes('.coverage-item.missed'), 'expected point coverage should have missed-state styling');
  assert(styles.includes('.history-skill'), 'weak skill analytics should have dedicated dashboard styling');
  assert(styles.includes('.history-item small'), 'history recommendation summary should have compact styling');
  assert(styles.includes('.history-record-body'), 'expandable history records should have dedicated body styling');
  assert(styles.includes('.history-record-actions'), 'history record actions should have dedicated styling');
  assert(styles.includes('.history-record-question'), 'history record questions should have dedicated styling');
  assert(styles.includes('.history-record-question small'), 'history question plan reasons should have compact styling');
  assert(styles.includes('.history-unfinished-target'), 'unfinished training targets should have dedicated dashboard styling');
  assert(styles.includes('.history-weak-question'), 'weak question analytics should have dedicated dashboard styling');
  assert(styles.includes('.history-missed-point'), 'missed expected points should have dedicated dashboard styling');
  assert(styles.includes('.history-code-mode'), 'coding answer mode suggestions should have dedicated dashboard styling');
  assert(styles.includes('.history-question-drill'), 'single-question drill progress should have dedicated dashboard styling');
  assert(styles.includes('.next-session-card'), 'next session recommendation should have dedicated dashboard styling');
  assert(styles.includes('.next-session-stages'), 'next session stage preview should have dedicated styling');
  assert(styles.includes('.subtle-button'), 'history clear action should use subtle button styling');
  assert(styles.includes('.mini-button'), 'apply recommendation action should use compact button styling');
  assert(styles.includes('.report-card-header'), 'report copy action should have dedicated header styling');
}

function verifyCodeDimensionScores() {
  const sqlQuestion = questionBank.find((item) => item.id === 'sql_001');
  const backendQuestion = questionBank.find((item) => item.id === 'backend_code_001');
  assert(sqlQuestion, 'SQL coding question should exist');
  assert(backendQuestion, 'backend scenario coding question should exist');

  const sqlEvaluation = evaluateAnswerForTest(
    [
      '思路是先筛选最近 30 天且 paid 的订单，再按 user_id 分组统计金额。',
      'SQL 可以写成 select user_id, sum(amount) total_amount from orders where status = paid and created_at >= now() - interval 30 day group by user_id order by total_amount desc limit 10。',
      '边界上要注意金额为空、状态枚举和 created_at 索引，数据量大时 where 条件和排序成本会影响性能。'
    ].join(''),
    sqlQuestion,
    { level: 'middle' }
  );
  const sqlLabels = sqlEvaluation.dimensionScores.map((item) => item.label);
  assert(
    ['解题思路', '实现完整度', '边界覆盖', '性能意识'].every((label) => sqlLabels.includes(label)),
    `SQL coding dimensions should be code-specific, got: ${sqlLabels.join(', ')}`
  );

  const backendEvaluation = evaluateAnswerForTest(
    [
      '我会按用户和接口维度做固定窗口限流，key 用 userId + api + minute。',
      '每次请求 INCR，第一次创建设置 TTL，超过阈值返回 429。',
      '边界上固定窗口有突刺问题，高并发下 Redis INCR 和 EXPIRE 要用 Lua 保证原子性，要求更高时换滑动窗口或令牌桶。'
    ].join(''),
    backendQuestion,
    { level: 'middle' }
  );
  const backendLabels = backendEvaluation.dimensionScores.map((item) => item.label);
  assert(
    backendLabels.includes('方案取舍') && backendLabels.includes('边界覆盖'),
    `backend scenario dimensions should emphasize tradeoff and boundary, got: ${backendLabels.join(', ')}`
  );
}

async function verifyExternalQuestionSources() {
  const stackDrafts = createExternalQuestionDraftsFromSignals([
    {
      title: 'How to explain Java thread pool rejection policy in an interview?',
      tags: ['java', 'concurrency'],
      link: 'https://stackoverflow.com/questions/1/example',
      score: 42
    }
  ], {
    id: 'stack-overflow-test',
    name: 'Stack Overflow 测试信号',
    provider: 'Stack Exchange API',
    license: 'CC BY-SA',
    licenseUrl: 'https://stackoverflow.com/help/licensing',
    attributionRequired: true,
    url: 'https://api.stackexchange.com/2.3/search/advanced'
  });

  assert(stackDrafts.length === 1, 'Stack Exchange signal should become one external draft');
  assert(stackDrafts[0].importPolicy === 'signal-only', 'Stack Exchange drafts should be signal-only because of CC BY-SA');
  assert(stackDrafts[0].attributionRequired, 'Stack Exchange drafts should keep attribution requirement');
  assert(stackDrafts[0].trainingDraft?.commonMistakes?.length >= 1, 'external drafts should include Chinese training notes');

  const mockFetch = async (url) => {
    if (String(url).includes('api.github.com/repos/realabbas')) {
      return createMockResponse([
        {
          type: 'file',
          name: 'java.md',
          path: 'java.md',
          download_url: 'https://raw.githubusercontent.com/mock/java.md',
          html_url: 'https://github.com/mock/java.md'
        }
      ]);
    }

    if (String(url).includes('raw.githubusercontent.com/mock/java.md')) {
      return createMockResponse([
        '# Java',
        '- What is the difference between HashMap and ConcurrentHashMap?',
        '- How does JVM garbage collection work?'
      ].join('\n'), false);
    }

    if (String(url).includes('api.github.com/repos/Snailclimb/JavaGuide/contents/docs')) {
      return createMockResponse([
        {
          type: 'file',
          name: 'java-basic-questions-01.md',
          path: 'docs/java/basis/java-basic-questions-01.md',
          download_url: 'https://raw.githubusercontent.com/mock/javaguide-java.md',
          html_url: 'https://github.com/Snailclimb/JavaGuide/blob/main/docs/java/basis/java-basic-questions-01.md'
        }
      ]);
    }

    if (String(url).includes('raw.githubusercontent.com/mock/javaguide-java.md')) {
      return createMockResponse([
        '# Java 基础常见面试题总结',
        '## HashMap 和 ConcurrentHashMap 有什么区别？',
        '## JVM 垃圾回收的基本原理是什么？'
      ].join('\n'), false);
    }

    if (String(url).includes('api.stackexchange.com')) {
      return createMockResponse({
        quota_remaining: 9999,
        items: [
          {
            title: 'How to design Redis cache invalidation for interview?',
            tags: ['redis', 'caching'],
            link: 'https://stackoverflow.com/questions/2/example',
            score: 30
          }
        ]
      });
    }

    throw new Error(`unexpected mock url: ${url}`);
  };

  const payload = await syncExternalQuestionDrafts({
    fetchImpl: mockFetch,
    outputPath: join(tmpdir(), `programmer-interview-external-${Date.now()}.json`)
  });
  assert(payload.summary.draftCount >= 3, `mock external sync should produce drafts, got: ${payload.summary.draftCount}`);
  assert(payload.summary.readyForImportCount >= 2, 'GitHub CC0 drafts should be marked ready for transformation');
  assert(payload.summary.chineseGithubDraftCount >= 2, 'Chinese GitHub sources should produce transformable Chinese drafts');
  assert(payload.summary.attributionRequiredCount >= 1, 'Stack Exchange drafts should keep attribution count');
  assert(
    payload.drafts.some((item) => item.license === 'CC0-1.0' && item.importPolicy === 'can-transform'),
    'GitHub CC0 source should create transformable drafts'
  );
  assert(
    payload.drafts.some((item) => item.license === 'Apache-2.0' && item.provider === 'GitHub 中文题库' && item.importPolicy === 'can-transform'),
    'JavaGuide Apache-2.0 source should create transformable Chinese drafts'
  );

  const candidateReport = await createExternalQuestionCandidateReport({
    limit: 6,
    minScore: 60
  });
  assert(candidateReport.summary.candidateCount <= 6, 'external candidate report should respect the limit');
  assert(candidateReport.candidates.length >= 1, 'external candidate report should rank at least one cached draft');
  assert(
    candidateReport.candidates.every((item) => item.promotionReasons.length && item.proposedQuestion?.expectedPoints?.length >= 3),
    'external candidate report should explain promotion reasons and generate structured question candidates'
  );

  const lowQualityCandidatePath = join(tmpdir(), `programmer-interview-low-quality-candidate-${Date.now()}.json`);
  const lowQualityDraftPath = join(tmpdir(), `programmer-interview-low-quality-draft-${Date.now()}.json`);
  const lowQualityCandidate = candidateReport.candidates.find((item) => item.qualityIssues?.some((issue) => issue.severity === 'blocker'));
  if (lowQualityCandidate) {
    writeFileSync(lowQualityCandidatePath, JSON.stringify({ candidates: [lowQualityCandidate] }, null, 2));
    writeFileSync(lowQualityDraftPath, JSON.stringify({ drafts: [] }, null, 2));
    const importResult = await importPromotedCandidatesToDrafts({
      inputPath: lowQualityCandidatePath,
      outputPath: lowQualityDraftPath,
      ranks: String(lowQualityCandidate.rank)
    });
    assert(importResult.summary.importedCount === 0, 'low-quality candidate drafts should not be imported by default');
  }
}

function createMockResponse(payload, json = true) {
  return {
    ok: true,
    status: 200,
    json: async () => payload,
    text: async () => String(payload)
  };
}

async function waitForHealth(timeoutMs = 8000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // Server may still be booting.
    }

    await delay(150);
  }

  throw new Error('Server did not become healthy in time');
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(data)}`);
  }
  return data;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
