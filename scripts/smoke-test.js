import {
  createFallbackInterviewerReply,
  createInterviewPlan,
  createReport,
  maybeAdvanceQuestion,
  recordAnswerForCurrentQuestion
} from '../src/interview.js';
import { spawn } from 'node:child_process';

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;

async function main() {
  verifyStalledFollowUpCutoff();

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
    assert(session.liveCoach?.stage === 'opening', `new session should expose opening live coach state, got: ${session.liveCoach?.stage || 'missing'}`);
    assert(session.liveCoach?.target, 'new session should expose live coach interviewer target');
    assert(session.liveCoach?.pressureReason, 'new session should expose why the first answer matters');
    assert(Array.isArray(session.liveCoach?.missingSignals) && session.liveCoach.missingSignals.length >= 1, 'new session should expose opening missing signals');
    assert(
      session.plan.some((item) => item.id === 'backend_004'),
      `backend plan should include the consistency project question when resume signals match, got: ${session.plan.map((item) => item.id).join(', ')}`
    );

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
    assert(answer1.currentQuestion === session.plan[0].id, 'weak answer should stay on the same question');

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
    assert(answerRepeat.currentQuestion === session.plan[0].id, 'repeated weak answer should still stay on the same question');

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
    assert(answer2.currentQuestion !== session.plan[0].id, 'stronger answer should advance to the next question');

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
    while (seniorCurrentQuestion !== 'redis_002' && seniorBridgeGuard < 3) {
      seniorBridgeGuard += 1;
      const projectBridgeAnswer = await request(`/api/interviews/${seniorSession.sessionId}/answer`, {
        method: 'POST',
        body: {
          answer: seniorCurrentQuestion === 'backend_004'
            ? [
              '我做过高并发订单链路治理项目，业务目标是降低支付成功后订单和库存不一致的问题。',
              '我负责订单状态流转、数据一致性和幂等设计。',
              '核心风险是支付回调重复、库存扣减超时和 MQ 重投会导致状态乱序或重复执行。',
              '我用业务单号加事件类型做幂等，用状态机限制非法流转，失败时落补偿任务并按退避策略重试。',
              '没有直接用强一致事务，是因为跨服务链路峰值流量高，优先保证可恢复性和下单成功率，异常订单明显减少。'
            ].join('')
            : [
              '我做过订单和缓存稳定性治理项目，目标是降低高峰期缓存抖动对下单链路的影响。',
              '我负责 Redis 延迟分析、缓存降级策略和订单链路保护。',
              '当时核心问题是热点 key 和慢命令会放大接口延迟，我先用监控时间线定位影响范围，再结合慢查询、大 key 和网络指标收敛根因。',
              '方案上我做了热点隔离、超时降级和缓存重建保护，避免请求全部打到数据库，最终高峰期延迟明显下降。'
            ].join('')
        }
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
  assert(report.questions[0]?.exitReason === 'stalled_follow_up', `stalled answer should be marked as interviewer cutoff, got ${report.questions[0]?.exitReason}`);
  assert(
    /主动收口|连续追问后被面试官主动收口/.test(report.questions[0]?.gapAnalysis || ''),
    `gap analysis should explain the interviewer cutoff, got: ${report.questions[0]?.gapAnalysis || ''}`
  );
  assert(report.uncoveredQuestions.length >= 1, 'report should keep remaining planned questions as uncovered after cutoff');
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
