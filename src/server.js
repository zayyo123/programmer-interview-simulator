import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateInterviewerReply, generateInterviewQuestionPlan } from './ai.js';
import { chooseProvider, loadConfig } from './config.js';
import { loadExternalQuestionDrafts, syncExternalQuestionDrafts } from './externalSources.js';
import {
  buildInterviewPrompt,
  createLiveCoachSnapshot,
  createInterviewPlan,
  validateQuestionCount,
  buildInterviewerReplyMessages,
  createInterviewOpeningMessages,
  getCurrentQuestion,
  getRecordedAnswerForCurrentQuestion,
  maybeAdvanceQuestion,
  recordAnswerForCurrentQuestion,
  recordSkippedQuestion,
  advanceAfterSkip,
  buildSkipQuestionMessages
} from './interview.js';
import {
  createPaperBlueprint,
  createExternalQuestionCandidateReport,
  createQuestionQualityReport,
  getQuestionBankCatalog,
  importPromotedCandidatesToDrafts,
  loadRuntimeQuestionBank,
  reviewQuestionDraft,
  runAutomaticQuestionScreening,
  submitQuestionDraft
} from './questionGovernance.js';
import { parseProfileDocument } from './profileIngest.js';
import { analyzeProfile } from './profileAnalyzeService.js';
import { finalizeReport } from './reportFinalize.js';

const config = loadConfig();
const sessions = new Map();
const publicDir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'public');
const sharedDir = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'shared');

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return sendJson(response, 200, { ok: true });
    }

    if (request.method === 'GET' && url.pathname === '/api/external-question-drafts') {
      const payload = await loadExternalQuestionDrafts();
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/external-question-drafts/sync') {
      const payload = await syncExternalQuestionDrafts();
      return sendJson(response, 200, payload);
    }

    if (request.method === 'GET' && url.pathname === '/api/external-question-candidates') {
      const payload = await createExternalQuestionCandidateReport(Object.fromEntries(url.searchParams.entries()));
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/external-question-candidates/auto-screen') {
      const body = await readJson(request);
      const payload = await runAutomaticQuestionScreening(body);
      return sendJson(response, 200, payload.automation);
    }

    if (request.method === 'POST' && url.pathname === '/api/external-question-candidates/import') {
      const body = await readJson(request);
      const payload = await importPromotedCandidatesToDrafts(body);
      return sendJson(response, 200, payload);
    }

    if (request.method === 'GET' && url.pathname === '/api/question-bank') {
      const payload = await getQuestionBankCatalog(Object.fromEntries(url.searchParams.entries()));
      return sendJson(response, 200, payload);
    }

    if (request.method === 'GET' && url.pathname === '/api/question-bank/quality') {
      const payload = await createQuestionQualityReport(Object.fromEntries(url.searchParams.entries()));
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/question-bank/drafts') {
      const body = await readJson(request);
      const draft = await submitQuestionDraft(body);
      return sendJson(response, 201, { draft });
    }

    if (request.method === 'POST' && url.pathname.match(/^\/api\/question-bank\/drafts\/[^/]+\/review$/)) {
      const draftId = url.pathname.split('/')[4];
      const body = await readJson(request);
      const payload = await reviewQuestionDraft(draftId, body);
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/question-paper') {
      const body = await readJson(request);
      const runtimeQuestionBank = await loadRuntimeQuestionBank();
      const excludeQuestionIds = Array.isArray(body.excludeQuestionIds) ? body.excludeQuestionIds : [];
      const reuseAllowedQuestionIds = Array.isArray(body.reuseAllowedQuestionIds) ? body.reuseAllowedQuestionIds : [];
      const validation = validateQuestionCount(body.questionCount, body, {
        questionBank: runtimeQuestionBank,
        excludeQuestionIds
      });
      if (!validation.ok) {
        const error = new Error(validation.message);
        error.statusCode = 400;
        throw error;
      }
      const plan = createInterviewPlan(
        { ...body, questionCount: validation.value },
        {
          questionBank: runtimeQuestionBank,
          excludeQuestionIds,
          reuseAllowedQuestionIds,
          selectionSeed: body.selectionSeed
        }
      );
      return sendJson(response, 200, createPaperBlueprint(plan));
    }

    if (request.method === 'POST' && url.pathname === '/api/profile/parse') {
      const body = await readJson(request);
      const payload = await parseProfileDocument(body);
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/profile/analyze') {
      const body = await readJson(request);
      const text = String(body.text || body.resume || '').trim();
      const role = String(body.role || '').trim();
      const payload = await analyzeProfile({ config, text, role });
      return sendJson(response, 200, payload);
    }

    if (request.method === 'POST' && url.pathname === '/api/interviews') {
      const body = await readJson(request);
      const session = await createSession(body);
      sessions.set(session.id, session);

      return sendJson(response, 201, {
        sessionId: session.id,
        provider: session.provider,
        questionSource: session.questionSource,
        questionSourceFallbackReason: session.questionSourceFallbackReason,
        messages: session.messages,
        liveCoach: createLiveCoachSnapshot(session),
        plan: session.plan.map((item) => ({
          id: item.id,
          category: item.category,
          skill: item.skill || item.category,
          type: item.type,
          codeKind: item.codeKind || null,
          difficulty: item.difficulty,
          planReason: item.planReason || '按本轮训练节奏安排。'
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

      const answeringQuestion = getCurrentQuestion(session);
      session.messages.push({
        role: 'candidate',
        content: answer,
        questionId: answeringQuestion?.id || null,
        createdAt: new Date().toISOString()
      });

      const effectiveAnswer = getRecordedAnswerForCurrentQuestion(session) || answer;
      const prompt = buildInterviewPrompt({ session, answer: effectiveAnswer });
      const previousIndex = session.currentIndex;
      const result = await generateInterviewerReply({ config, session, answer, prompt });
      maybeAdvanceQuestion(session, answer);
      const advanced = session.currentIndex > previousIndex;
      const nextQuestion = advanced ? getCurrentQuestion(session) : null;
      session.provider = result.provider;
      session.messages.push(
        ...buildInterviewerReplyMessages({
          replyText: result.text,
          provider: result.provider,
          advanced,
          nextQuestion,
          completed: Boolean(session.completed),
          questionIndex: session.currentIndex + 1,
          answeringQuestionId: answeringQuestion?.id || null
        })
      );

      return sendJson(response, 200, {
        provider: result.provider,
        messages: session.messages,
        liveCoach: createLiveCoachSnapshot(session),
        currentQuestion: getCurrentQuestion(session)?.id || null,
        completed: Boolean(session.completed)
      });
    }

    if (request.method === 'POST' && url.pathname.match(/^\/api\/interviews\/[^/]+\/skip$/)) {
      const sessionId = url.pathname.split('/')[3];
      const session = sessions.get(sessionId);
      if (!session) return sendJson(response, 404, { error: '未找到这轮面试会话' });
      if (session.completed) return sendJson(response, 400, { error: '本轮面试已结束' });

      const skippedQuestion = recordSkippedQuestion(session);
      if (!skippedQuestion) return sendJson(response, 400, { error: '当前没有可跳过的题目' });

      session.messages.push({
        role: 'candidate',
        kind: 'skip',
        content: '（跳过此题）',
        questionId: skippedQuestion.id,
        createdAt: new Date().toISOString()
      });

      const { completed, nextQuestion } = advanceAfterSkip(session);
      session.messages.push(
        ...buildSkipQuestionMessages({
          skippedQuestionId: skippedQuestion.id,
          nextQuestion,
          completed,
          questionIndex: session.currentIndex + 1
        })
      );

      return sendJson(response, 200, {
        provider: 'mock',
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
      session.report = await finalizeReport(session, config);

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
    return sendJson(response, error.statusCode || 500, { error: error.statusCode ? error.message : '服务器内部错误' });
  }
});

const MAX_TCP_PORT = 65535;

function listenWithPortFallback(server, preferredPort) {
  return new Promise((resolve, reject) => {
    let port = preferredPort;
    let warned = false;

    const tryListen = () => {
      const onError = (error) => {
        if (error.code === 'EADDRINUSE' && port < MAX_TCP_PORT) {
          if (!warned) {
            console.warn(`Port ${preferredPort} is already in use, trying the next available port...`);
            warned = true;
          }
          port += 1;
          tryListen();
          return;
        }

        if (error.code === 'EADDRINUSE') {
          reject(new Error(`No available port found between ${preferredPort} and ${MAX_TCP_PORT}.`));
          return;
        }

        reject(error);
      };

      server.once('error', onError);
      server.listen(port, () => {
        server.removeListener('error', onError);
        resolve(port);
      });
    };

    tryListen();
  });
}

listenWithPortFallback(server, config.port)
  .then((actualPort) => {
    if (actualPort !== config.port) {
      console.warn(`Switched to port ${actualPort} because ${config.port} was occupied.`);
    }
    console.log(`Programmer Interview Simulator running at http://localhost:${actualPort}`);
  })
  .catch((error) => {
    console.error(error.message || error);
    process.exit(1);
  });

async function createSession(input) {
  const interviewConfig = {
    role: input.role || 'java',
    level: input.level || 'middle',
    style: input.style || 'normal',
    resume: input.resume || '',
    questionCount: Number(input.questionCount || 5),
    profileAnalysis: input.profileAnalysis || null,
    questionSource: input.questionSource || 'local'
  };
  const runtimeQuestionBank = await loadRuntimeQuestionBank();
  const excludeQuestionIds = Array.isArray(input.excludeQuestionIds) ? input.excludeQuestionIds : [];
  const reuseAllowedQuestionIds = Array.isArray(input.reuseAllowedQuestionIds) ? input.reuseAllowedQuestionIds : [];
  const questionCountValidation = validateQuestionCount(
    interviewConfig.questionCount,
    interviewConfig,
    { questionBank: runtimeQuestionBank, excludeQuestionIds }
  );
  if (!questionCountValidation.ok) {
    const error = new Error(questionCountValidation.message);
    error.statusCode = 400;
    throw error;
  }
  interviewConfig.questionCount = questionCountValidation.value;
  const localPlan = createInterviewPlan(interviewConfig, {
    questionBank: runtimeQuestionBank,
    excludeQuestionIds,
    reuseAllowedQuestionIds,
    selectionSeed: input.selectionSeed
  });
  const aiPlanResult = interviewConfig.questionSource === 'ai'
    ? await generateInterviewQuestionPlan({ config, interviewConfig, localPlan })
    : null;
  const plan = Array.isArray(aiPlanResult?.questions) && aiPlanResult.questions.length
    ? aiPlanResult.questions
    : localPlan;
  const firstQuestion = plan[0];
  const id = randomUUID();

  return {
    id,
    config: interviewConfig,
    provider: aiPlanResult?.provider || chooseProvider(config),
    questionSource: aiPlanResult?.questions?.length ? 'ai' : 'local',
    questionSourceFallbackReason: aiPlanResult?.questions?.length ? '' : aiPlanResult?.error || '',
    plan,
    currentIndex: 0,
    answers: [],
    completed: false,
    messages: createInterviewOpeningMessages(interviewConfig, firstQuestion),
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

  if (cleanPath.startsWith('/shared/')) {
    const target = join(sharedDir, cleanPath.replace(/^\/shared\//, ''));
    if (!target.startsWith(sharedDir)) {
      return sendJson(response, 403, { error: '没有访问权限' });
    }
    try {
      const content = await readFile(target);
      response.writeHead(200, {
        'Content-Type': getContentType(extname(target))
      });
      response.end(content);
      return;
    } catch {
      return sendJson(response, 404, { error: '未找到请求的内容' });
    }
  }

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
