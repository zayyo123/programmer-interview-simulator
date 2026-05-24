import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateInterviewerReply } from './ai.js';
import { chooseProvider, loadConfig } from './config.js';
import {
  buildInterviewPrompt,
  createLiveCoachSnapshot,
  createInterviewPlan,
  createOpening,
  createReport,
  getCurrentQuestion,
  getRecordedAnswerForCurrentQuestion,
  maybeAdvanceQuestion,
  recordAnswerForCurrentQuestion
} from './interview.js';

const config = loadConfig();
const sessions = new Map();
const publicDir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public');

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === 'POST' && url.pathname === '/api/interviews') {
      const body = await readJson(request);
      const session = createSession(body);
      sessions.set(session.id, session);

      return sendJson(response, 201, {
        sessionId: session.id,
        provider: session.provider,
        messages: session.messages,
        liveCoach: createLiveCoachSnapshot(session),
        plan: session.plan.map((item) => ({
          id: item.id,
          category: item.category,
          type: item.type,
          difficulty: item.difficulty
        }))
      });
    }

    if (request.method === 'POST' && url.pathname.match(/^\/api\/interviews\/[^/]+\/answer$/)) {
      const sessionId = url.pathname.split('/')[3];
      const session = sessions.get(sessionId);
      if (!session) return sendJson(response, 404, { error: '未找到这轮面试会话' });

      const body = await readJson(request);
      const answer = String(body.answer || '').trim();
      if (!answer) return sendJson(response, 400, { error: '请先输入回答' });

      recordAnswerForCurrentQuestion(session, answer);

      session.messages.push({
        role: 'candidate',
        content: answer,
        createdAt: new Date().toISOString()
      });

      const effectiveAnswer = getRecordedAnswerForCurrentQuestion(session) || answer;
      const prompt = buildInterviewPrompt({ session, answer: effectiveAnswer });
      const result = await generateInterviewerReply({ config, session, answer, prompt });
      maybeAdvanceQuestion(session, answer);
      session.provider = result.provider;
      session.messages.push({
        role: 'interviewer',
        content: result.text,
        provider: result.provider,
        createdAt: new Date().toISOString()
      });

      return sendJson(response, 200, {
        provider: result.provider,
        messages: session.messages,
        liveCoach: createLiveCoachSnapshot(session),
        currentQuestion: getCurrentQuestion(session)?.id || null,
        completed: Boolean(session.completed)
      });
    }

    if (request.method === 'POST' && url.pathname.match(/^\/api\/interviews\/[^/]+\/finish$/)) {
      const sessionId = url.pathname.split('/')[3];
      const session = sessions.get(sessionId);
      if (!session) return sendJson(response, 404, { error: '未找到这轮面试会话' });

      session.finishedAt = new Date().toISOString();
      session.report = createReport(session);

      return sendJson(response, 200, {
        report: session.report,
        messages: session.messages
      });
    }

    if (request.method === 'GET') {
      return serveStatic(response, url.pathname);
    }

    return sendJson(response, 404, { error: '未找到请求的内容' });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { error: '服务器内部错误' });
  }
});

server.listen(config.port, () => {
  console.log(`Programmer Interview Simulator running at http://localhost:${config.port}`);
});

function createSession(input) {
  const interviewConfig = {
    role: input.role || 'java',
    level: input.level || 'middle',
    style: input.style || 'normal',
    resume: input.resume || '',
    questionCount: Number(input.questionCount || 5)
  };
  const plan = createInterviewPlan(interviewConfig);
  const firstQuestion = plan[0];
  const id = randomUUID();

  return {
    id,
    config: interviewConfig,
    provider: chooseProvider(config),
    plan,
    currentIndex: 0,
    answers: [],
    completed: false,
    messages: [
      {
        role: 'interviewer',
        content: createOpening(interviewConfig, firstQuestion),
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString()
  };
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload));
}

async function serveStatic(response, pathname) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  const target = join(publicDir, cleanPath.replace(/^\/+/, ''));

  if (!target.startsWith(publicDir)) {
    return sendJson(response, 403, { error: '没有访问权限' });
  }

  try {
    const content = await readFile(target);
    response.writeHead(200, {
      'Content-Type': getContentType(extname(target))
    });
    response.end(content);
  } catch {
    sendJson(response, 404, { error: '未找到请求的内容' });
  }
}

function getContentType(extension) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml'
  }[extension] || 'application/octet-stream';
}
