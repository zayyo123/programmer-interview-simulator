import { spawn } from 'node:child_process';

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;

async function main() {
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

    const weakAnswer = '我们团队做了一个项目，主要用了 Java。';
    const answer1 = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: weakAnswer }
    });
    const lastReply1 = answer1.messages.at(-1)?.content || '';
    assert(
      /你自己负责|亲手负责|技术栈|项目是给谁解决什么问题|卡在哪里/.test(lastReply1),
      `follow-up should target the missing project signal, got: ${lastReply1}`
    );
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
    assert(answerRepeat.currentQuestion === session.plan[0].id, 'repeated weak answer should still stay on the same question');

    const strongerAnswer = [
      '这个项目是订单履约系统，目标是减少库存扣减和订单状态不一致的问题。',
      '我主要负责订单状态流转和库存一致性处理，技术栈是 Java、MySQL、Redis。',
      '当时最大的难点是下单成功但库存消息偶发失败，我通过本地消息表和补偿机制把异常订单降下来了。'
    ].join('');
    const answer2 = await request(`/api/interviews/${session.sessionId}/answer`, {
      method: 'POST',
      body: { answer: strongerAnswer }
    });
    assert(answer2.currentQuestion !== session.plan[0].id, 'stronger answer should advance to the next question');

    const reportResult = await request(`/api/interviews/${session.sessionId}/finish`, {
      method: 'POST'
    });
    const firstQuestion = reportResult.report?.questions?.[0];
    assert(firstQuestion, 'report should include first question details');
    assert(
      /核心点没答实|表达上最影响说服力|下一句就该补/.test(firstQuestion.gapAnalysis || ''),
      'gap analysis should explain the interview gap'
    );

    console.log('Smoke test passed');
  } finally {
    server.kill();
    if (stderr.trim()) {
      process.stderr.write(stderr);
    }
  }
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
