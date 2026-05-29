const setupForm = document.querySelector('#setupForm');
const answerForm = document.querySelector('#answerForm');
const answerInput = document.querySelector('#answerInput');
const answerGuideEl = document.querySelector('#answerGuide');
const messagesEl = document.querySelector('#messages');
const liveCoachEl = document.querySelector('#liveCoach');
const reportEl = document.querySelector('#report');
const interviewProgressEl = document.querySelector('#interviewProgress');
const providerText = document.querySelector('#providerText');
const statusText = document.querySelector('#statusText');
const finishButton = document.querySelector('#finishButton');
const answerSubmitButton = answerForm.querySelector('button[type="submit"]');
const styleSelect = setupForm.querySelector('select[name="style"]');
const styleHint = document.querySelector('#styleHint');
const practiceHistoryEl = document.querySelector('#practiceHistory');
const profileAnalysisEl = document.querySelector('#profileAnalysis');
const planPreviewEl = document.querySelector('#planPreview');
const questionOpsEl = document.querySelector('#questionOps');
const resumeInput = setupForm.querySelector('textarea[name="resume"]');
const roleChoiceGrid = document.querySelector('#roleChoiceGrid');
const levelStepper = document.querySelector('#levelStepper');
const styleSegmented = document.querySelector('#styleSegmented');
const aiProviderSelect = document.querySelector('#aiProviderSelect');
const aiKeyInput = document.querySelector('#aiKeyInput');
const aiKeyField = document.querySelector('#aiKeyField');
const aiProviderWarning = document.querySelector('#aiProviderWarning');
const profileDropzone = document.querySelector('#profileDropzone');
const profileUploadButton = document.querySelector('#profileUploadButton');
const profileFileInput = document.querySelector('#profileFileInput');
const countdownOverlay = document.querySelector('#countdownOverlay');
const workflowStepButtons = document.querySelectorAll('[data-step-target]');
const workflowStepPanels = document.querySelectorAll('[data-workflow-step]');
const workflowStatusEl = document.querySelector('#workflowStatus');
const PRACTICE_HISTORY_KEY = 'programmer-interview-practice-history-v1';
const PRACTICE_HISTORY_LIMIT = 12;

let sessionId = null;
let busy = false;
let activeWorkflowStep = 'setup';
let latestLiveCoachSnapshot = null;
let liveCoachDetailsOpen = false;
let currentPlan = [];
let currentQuestionId = null;
let latestReport = null;
let codeAnswerMode = 'explain';
let codeAnswerModeQuestionId = null;

document.addEventListener('click', (event) => {
  const stepButton = event.target.closest('[data-step-target]');
  if (!stepButton) return;

  setWorkflowStep(stepButton.dataset.stepTarget);
});

liveCoachEl.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-live-coach-toggle]');
  if (!toggle || !latestLiveCoachSnapshot) return;

  liveCoachDetailsOpen = !liveCoachDetailsOpen;
  renderLiveCoach(latestLiveCoachSnapshot);
});

document.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-toggle-panel]');
  if (!toggle) return;

  document.body.classList.toggle(`${toggle.dataset.togglePanel}-collapsed`);
});

answerInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    if (!answerSubmitButton.disabled) {
      answerForm.requestSubmit();
    }
  }
});

answerGuideEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-code-answer-mode]');
  if (!button) return;

  codeAnswerMode = button.dataset.codeAnswerMode || 'explain';
  renderAnswerGuide(getCurrentPlanItem());
});

styleSelect.addEventListener('change', () => {
  renderStyleHint(styleSelect.value);
  syncChoiceControls();
  renderPlanPreview();
  loadQuestionBankSnapshot();
});

resumeInput.addEventListener('input', () => {
  renderProfileAnalysis(resumeInput.value);
  renderPlanPreview();
});

setupForm.addEventListener('change', (event) => {
  if (event.target === resumeInput || event.target === styleSelect) return;
  syncChoiceControls();
  renderPlanPreview();
  loadQuestionBankSnapshot();
});

aiProviderSelect?.addEventListener('change', renderAiProviderState);
aiKeyInput?.addEventListener('input', renderAiProviderState);
profileUploadButton?.addEventListener('click', () => profileFileInput?.click());
profileFileInput?.addEventListener('change', async () => {
  const file = profileFileInput.files?.[0];
  if (file) await importProfileFile(file);
});

profileDropzone?.addEventListener('dragover', (event) => {
  event.preventDefault();
  profileDropzone.classList.add('dragging');
});

profileDropzone?.addEventListener('dragleave', () => {
  profileDropzone.classList.remove('dragging');
});

profileDropzone?.addEventListener('drop', async (event) => {
  event.preventDefault();
  profileDropzone.classList.remove('dragging');
  const file = event.dataTransfer?.files?.[0];
  if (file) await importProfileFile(file);
});

practiceHistoryEl.addEventListener('click', (event) => {
  const clearButton = event.target.closest('[data-clear-history]');
  if (clearButton) {
    clearPracticeHistory();
    return;
  }

  const deleteButton = event.target.closest('[data-delete-history-record]');
  if (deleteButton) {
    deleteHistoryRecord(deleteButton.dataset.deleteHistoryRecord);
    return;
  }

  const historyButton = event.target.closest('[data-apply-history-record]');
  if (historyButton) {
    applyHistoryRecordDrill(historyButton.dataset.applyHistoryRecord);
    return;
  }

  const unfinishedButton = event.target.closest('[data-apply-unfinished-target]');
  if (unfinishedButton) {
    applyUnfinishedTargetDrill(unfinishedButton.dataset.applyUnfinishedTarget);
    return;
  }

  const questionDrillProgressButton = event.target.closest('[data-apply-question-drill]');
  if (questionDrillProgressButton) {
    applyQuestionDrillProgressDrill(questionDrillProgressButton.dataset.applyQuestionDrill);
    return;
  }

  const codeModeButton = event.target.closest('[data-apply-code-mode]');
  if (codeModeButton) {
    applyCodeModeSuggestionDrill(codeModeButton.dataset.applyCodeMode);
    return;
  }

  const button = event.target.closest('[data-apply-next-session]');
  if (!button) return;

  applyNextSessionRecommendation();
});

reportEl.addEventListener('click', async (event) => {
  const routeButton = event.target.closest('[data-apply-report-route]');
  if (routeButton) {
    applyReportRoutePlan(routeButton.dataset.applyReportRoute);
    return;
  }

  const questionDrillButton = event.target.closest('[data-apply-report-question]');
  if (questionDrillButton) {
    const applied = applyReportQuestionDrill(questionDrillButton.dataset.applyReportQuestion);
    const action = questionDrillButton.closest('.report-drill-action');
    const feedback = action?.querySelector('[data-report-question-drill-status]');
    if (feedback) {
      feedback.textContent = applied
        ? '已写入左侧配置和计划预览，可以开始重练本题薄弱点。'
        : '暂未找到这道题的报告数据，请先生成完整复盘。';
      feedback.classList.toggle('active', applied);
    }
    return;
  }

  const codeModeButton = event.target.closest('[data-apply-code-mode]');
  if (codeModeButton) {
    const applied = applyCodeModeSuggestionDrill(codeModeButton.dataset.applyCodeMode);
    const action = codeModeButton.closest('.report-code-mode-action');
    const feedback = action?.querySelector('[data-report-code-mode-status]');
    if (feedback) {
      feedback.textContent = applied
        ? '已写入左侧配置和计划预览，可以开始本题专项补练。'
        : '暂未找到对应历史建议，请先完成并保存本轮报告。';
      feedback.classList.toggle('active', applied);
    }
    return;
  }

  const button = event.target.closest('[data-copy-report]');
  if (!button || !latestReport) return;

  await copyReportMarkdown(latestReport);
});

initializeSetupControls();
questionOpsEl?.addEventListener('click', async (event) => {
  const refreshButton = event.target.closest('[data-refresh-question-bank]');
  if (refreshButton) {
    await loadQuestionBankSnapshot();
    return;
  }

  const reviewButton = event.target.closest('[data-review-draft]');
  if (reviewButton) {
    await reviewDraftQuestion(reviewButton.dataset.reviewDraft, reviewButton.dataset.reviewAction || 'approve');
  }
});

questionOpsEl?.addEventListener('submit', async (event) => {
  const form = event.target.closest('[data-question-draft-form]');
  if (!form) return;
  event.preventDefault();
  await submitQuestionDraft(form);
});
renderStyleHint(styleSelect.value);
renderProfileAnalysis(resumeInput.value);
renderPlanPreview();
renderPracticeHistory();
renderAnswerGuide(null);
renderAiProviderState();
renderWorkflowState();

function canOpenWorkflowStep(step) {
  if (step === 'setup') return true;
  if (step === 'interview') return Boolean(sessionId);
  if (step === 'report') return Boolean(latestReport);
  return false;
}

function setWorkflowStep(step) {
  if (!canOpenWorkflowStep(step)) {
    if (step === 'interview') {
      setWorkflowStatus('请先完成面试配置并开始面试。');
    } else if (step === 'report') {
      setWorkflowStatus('完成面试后会生成复盘报告。');
    }
    renderWorkflowState();
    return false;
  }

  activeWorkflowStep = step;
  renderWorkflowState();
  return true;
}

function setWorkflowStatus(message) {
  if (workflowStatusEl) workflowStatusEl.textContent = message;
}

function renderWorkflowState() {
  workflowStepPanels.forEach((panel) => {
    panel.hidden = panel.dataset.workflowStep !== activeWorkflowStep;
  });

  workflowStepButtons.forEach((button) => {
    const step = button.dataset.stepTarget;
    const available = canOpenWorkflowStep(step);
    button.classList.toggle('active', step === activeWorkflowStep);
    button.classList.toggle('locked', !available);
    button.setAttribute('aria-disabled', String(!available));
  });

  if (latestReport) {
    setWorkflowStatus('复盘报告已生成，可以在三步之间回看配置、面试过程和报告。');
  } else if (sessionId) {
    setWorkflowStatus('面试已开始，可以返回查看配置；报告会在结束后解锁。');
  } else {
    setWorkflowStatus('先完成本轮面试配置，然后进入模拟面试。');
  }
}

function initializeSetupControls() {
  renderChoiceGrid('role', roleChoiceGrid, {
    java: 'JVM / Spring',
    backend: 'API / DB / Redis',
    frontend: 'Vue / React / JS',
    fullstack: '端到端链路',
    go: 'Goroutine / 微服务',
    python: 'FastAPI / Worker',
    qa: '测试策略 / 自动化',
    ops: 'Linux / 网络 / 数据库',
    devops: 'CI/CD / K8s / 稳定性',
    data: 'ETL / 数仓 / SQL',
    ai: '模型 / 特征 / 推理',
    security: '攻防 / 漏洞 / 加固',
    architect: '架构 / 取舍 / 治理'
  });
  renderChoiceGrid('level', levelStepper, {
    junior: '基础主线',
    middle: '细节取舍',
    senior: '架构治理'
  }, 'level-step');
  renderChoiceGrid('style', styleSegmented, {
    normal: '温和引导',
    pressure: '严厉追问',
    coaching: '提示更多'
  }, 'style-segment');
  syncChoiceControls();
}

function renderChoiceGrid(fieldName, container, descriptions = {}, className = 'choice-card') {
  const select = setupForm.querySelector(`select[name="${fieldName}"]`);
  if (!select || !container) return;

  container.innerHTML = [...select.options].map((option) => `
    <button type="button" class="${className}" data-choice-field="${escapeHtml(fieldName)}" data-choice-value="${escapeHtml(option.value)}">
      <strong>${escapeHtml(option.textContent || option.value)}</strong>
      <span>${escapeHtml(descriptions[option.value] || '定制面试路线')}</span>
    </button>
  `).join('');

  container.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choice-value]');
    if (!button) return;

    select.value = button.dataset.choiceValue || select.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    syncChoiceControls();
  });
}

function syncChoiceControls() {
  document.querySelectorAll('[data-choice-field]').forEach((button) => {
    const select = setupForm.querySelector(`select[name="${button.dataset.choiceField}"]`);
    button.classList.toggle('active', Boolean(select && select.value === button.dataset.choiceValue));
  });
}

function renderAiProviderState() {
  if (!aiProviderSelect || !aiProviderWarning || !aiKeyField || !aiKeyInput) return;

  const provider = aiProviderSelect.value;
  const value = aiKeyInput.value.trim();
  const needsKey = provider !== 'mock';
  const missingConfig = needsKey && !value;
  aiKeyInput.placeholder = provider === 'ollama'
    ? '例如：http://localhost:11434'
    : provider === 'mock'
      ? 'Mock 模式无需填写'
      : '粘贴 API Key 后启用真实模型';
  aiKeyField.classList.toggle('warning', missingConfig);
  aiProviderWarning.classList.toggle('warning', missingConfig);
  aiProviderWarning.textContent = missingConfig
    ? '未检测到该引擎配置，将启用本地 Mock 规则保证面试流程可运行。'
    : provider === 'mock'
      ? 'Local Mock 已启用，本地规则会保证流程可运行。'
      : '已填写连接信息。服务端仍以 .env 为准选择真实 AI Provider。';
}

async function importProfileFile(file) {
  const name = file.name || '上传资料';
  const extension = name.split('.').pop()?.toLowerCase() || '';
  let content = '';

  try {
    if (extension === 'pdf') {
      content = `上传文件：${name}\nPDF 文件已接收。当前前端 MVP 不直接解析 PDF 二进制内容，请把关键项目经历或 JD 文本粘贴到这里继续分析。`;
    } else {
      content = await file.text();
    }
  } catch {
    content = `上传文件：${name}\n文件读取失败，请直接粘贴简历或项目背景文本。`;
  }

  resumeInput.value = [resumeInput.value.trim(), content.trim()].filter(Boolean).join('\n\n');
  renderProfileAnalysis(resumeInput.value);
  renderPlanPreview();
  statusText.textContent = `已导入 ${name}，左侧训练计划已根据资料重新计算。`;
}

async function runLaunchCountdown() {
  if (!countdownOverlay) return true;

  countdownOverlay.hidden = false;
  const number = countdownOverlay.querySelector('span');
  for (const value of [3, 2, 1]) {
    if (number) number.textContent = String(value);
    playCountdownTone(value);
    await wait(720);
  }
  if (number) number.textContent = 'GO';
  playCountdownTone(0);
  await wait(320);
  countdownOverlay.hidden = true;
  return true;
}

function playCountdownTone(value) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = value === 0 ? 720 : 440 + value * 70;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
  } catch {
    // Audio is optional; browsers may block it depending on user settings.
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
loadQuestionBankSnapshot();

setupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;

  const canStart = await runLaunchCountdown();
  if (!canStart) return;

  const formData = new FormData(setupForm);
  const payload = {
    role: formData.get('role'),
    level: formData.get('level'),
    style: formData.get('style'),
    questionSource: formData.get('questionSource') || 'local',
    questionCount: Number(formData.get('questionCount') || 5),
    resume: formData.get('resume') || '',
    profileAnalysis: createSerializableProfileAnalysis(formData.get('resume') || '')
  };

  setBusy(true);
  statusText.textContent = '正在开始面试...';

  try {
    const data = await requestJson('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    sessionId = data.sessionId;
    liveCoachDetailsOpen = false;
    currentPlan = Array.isArray(data.plan) ? data.plan : [];
    currentQuestionId = currentPlan[0]?.id || null;
    providerText.textContent = getProviderText(data.provider);
    renderMessages(data.messages || []);
    renderLiveCoach(data.liveCoach);
    renderInterviewProgress(currentPlan, currentQuestionId, false);
    renderAnswerGuide(getCurrentPlanItem());
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>面试正在进行中。结束后会生成针对性的复盘反馈。</p>';
    const sourceText = data.questionSource === 'ai'
      ? '本轮题目由 AI 动态生成。'
      : payload.questionSource === 'ai'
        ? `AI 出题不可用，已回退本地题库。${data.questionSourceFallbackReason || ''}`.trim()
        : '本轮题目来自本地题库。';
    statusText.textContent = `面试已开始。${sourceText}`;
    answerInput.value = '';
    answerInput.disabled = false;
    answerSubmitButton.disabled = false;
    finishButton.disabled = false;
    setSetupReadonly(true);
    setWorkflowStep('interview');
    answerInput.focus();
  } catch (error) {
    statusText.textContent = `开始面试失败：${error.message}`;
  } finally {
    setBusy(false);
  }
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !sessionId) return;

  const answer = answerInput.value.trim();
  if (!answer) {
    statusText.textContent = '请先输入回答再提交。';
    return;
  }

  setBusy(true);
  statusText.textContent = '面试官正在回应...';

  try {
    const data = await requestJson(`/api/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });

    providerText.textContent = getProviderText(data.provider);
    renderMessages(data.messages || []);
    renderLiveCoach(data.liveCoach);
    currentQuestionId = data.currentQuestion || null;
    renderInterviewProgress(currentPlan, currentQuestionId, Boolean(data.completed));
    renderAnswerGuide(getCurrentPlanItem(), Boolean(data.completed || !data.currentQuestion));
    if (data.completed || !data.currentQuestion) {
      statusText.textContent = '计划题目已完成。可以结束并生成复盘报告。';
      answerInput.disabled = true;
      answerSubmitButton.disabled = true;
    } else {
      statusText.textContent = '继续回答。面试官可能还在追问同一个主题。';
      answerInput.disabled = false;
      answerSubmitButton.disabled = false;
    }
    answerInput.value = '';
    if (!answerInput.disabled) {
      answerInput.focus();
    }
  } catch (error) {
    statusText.textContent = `提交回答失败：${error.message}`;
  } finally {
    setBusy(false);
  }
});

finishButton.addEventListener('click', async () => {
  if (busy || !sessionId) return;

  setBusy(true);
  statusText.textContent = '正在生成复盘报告...';

  try {
    const data = await requestJson(`/api/interviews/${sessionId}/finish`, {
      method: 'POST'
    });

    renderMessages(data.messages || []);
    renderReport(data.report);
    savePracticeHistory(data.report);
    renderPracticeHistory();
    renderInterviewProgress(currentPlan, null, true);
    renderAnswerGuide(null, true);
    answerInput.disabled = true;
    answerSubmitButton.disabled = true;
    finishButton.disabled = true;
    statusText.textContent = '报告已生成。请查看总览和逐题差距。';
    setWorkflowStep('report');
  } catch (error) {
    statusText.textContent = `生成报告失败：${error.message}`;
  } finally {
    setBusy(false);
  }
});

function setBusy(nextBusy) {
  busy = nextBusy;
  setupForm.querySelector('button[type="submit"]').disabled = nextBusy || Boolean(sessionId);
  answerInput.disabled = nextBusy || !sessionId || Boolean(latestReport);
  answerSubmitButton.disabled = nextBusy || !sessionId || Boolean(latestReport);
  finishButton.disabled = nextBusy || !sessionId || Boolean(latestReport);
  renderWorkflowState();
}

function resetSessionForNewSetup() {
  sessionId = null;
  currentPlan = [];
  currentQuestionId = null;
  latestLiveCoachSnapshot = null;
  liveCoachDetailsOpen = false;
  codeAnswerModeQuestionId = null;
  setSetupReadonly(false);
  renderInterviewProgress([], null, false);
  renderAnswerGuide(null);
  messagesEl.className = 'messages empty-state';
  messagesEl.innerHTML = '<p>面试官会在这里开场，并提出第一道问题。</p>';
  liveCoachEl.className = 'live-coach empty-state';
  liveCoachEl.innerHTML = '<p>开始面试后，这里会显示面试官当前正在考察什么。</p>';
  answerInput.value = '';
  answerInput.disabled = true;
  answerSubmitButton.disabled = true;
  finishButton.disabled = true;
}

function setSetupReadonly(readonly) {
  setupForm.querySelectorAll('input, select, textarea, button[type="submit"]').forEach((control) => {
    if (control.type === 'file') return;
    control.disabled = readonly || busy;
  });

  profileUploadButton.disabled = readonly || busy;
}

function getCurrentPlanItem() {
  if (!currentQuestionId) return null;
  return currentPlan.find((item) => item.id === currentQuestionId) || null;
}

async function loadQuestionBankSnapshot() {
  if (!questionOpsEl) return;

  const formData = new FormData(setupForm);
  const params = new URLSearchParams({
    role: formData.get('role') || '',
    level: formData.get('level') || ''
  });
  questionOpsEl.classList.add('loading');

  try {
    const [catalog, paper] = await Promise.all([
      requestJson(`/api/question-bank?${params.toString()}`),
      requestJson('/api/question-paper', {
        method: 'POST',
        body: JSON.stringify({
          role: formData.get('role'),
          level: formData.get('level'),
          style: formData.get('style'),
          questionCount: Number(formData.get('questionCount') || 5),
          resume: formData.get('resume') || '',
          profileAnalysis: createSerializableProfileAnalysis(formData.get('resume') || '')
        })
      })
    ]);
    renderQuestionOps(catalog, paper);
  } catch (error) {
    questionOpsEl.className = 'question-ops empty-question-ops';
    questionOpsEl.innerHTML = `<p>${escapeHtml(`题库治理加载失败：${error.message}`)}</p>`;
  }
}

function renderQuestionOps(catalog, paper) {
  if (!questionOpsEl) return;

  const summary = catalog?.summary || {};
  const pendingDrafts = Array.isArray(catalog?.pendingDrafts) ? catalog.pendingDrafts : [];
  const template = selectTemplateForCurrentSetup(catalog?.templates || []);
  const draftList = pendingDrafts.length
    ? pendingDrafts.slice(0, 3).map((draft) => `
      <article class="question-draft">
        <div>
          <strong>${escapeHtml(draft.title || draft.question || '待审核题')}</strong>
          <span>${escapeHtml(`${draft.category || '综合能力'} · ${getPlanTypeLabel(draft.type)} · ${getDifficultyLabel(draft.difficulty)} · 质量 ${draft.quality?.score ?? '-'} ${draft.quality?.grade || ''}`)}</span>
        </div>
        <p>${escapeHtml(draft.question || '')}</p>
        ${renderQuestionQualityIssues(draft.quality)}
        <div class="question-draft-actions">
          <button type="button" class="mini-button" data-review-draft="${escapeHtml(draft.id)}" data-review-action="approve">通过入库</button>
          <button type="button" class="mini-button subtle-button" data-review-draft="${escapeHtml(draft.id)}" data-review-action="reject">驳回</button>
        </div>
      </article>
    `).join('')
    : '<p>暂无待审核题。可以先提交一题，审核通过后会进入后续模拟面试抽题池。</p>';

  questionOpsEl.className = 'question-ops';
  questionOpsEl.innerHTML = `
    <div class="question-ops-header">
      <div>
        <strong>题库与组卷</strong>
        <span>结构化题库 · 人工审核 · 规则抽题</span>
      </div>
      <button type="button" class="mini-button subtle-button" data-refresh-question-bank>刷新</button>
    </div>

    <div class="question-bank-stats">
      <div><span>已审核</span><strong>${escapeHtml(summary.approvedCount ?? 0)}</strong></div>
      <div><span>待审核</span><strong>${escapeHtml(summary.pendingReviewCount ?? 0)}</strong></div>
      <div><span>标签</span><strong>${escapeHtml(summary.tagCount ?? 0)}</strong></div>
      <div><span>质量</span><strong>${escapeHtml(summary.qualityScore ?? '-')}</strong></div>
    </div>

    <div class="question-template-card">
      <span>当前组卷模板</span>
      <strong>${escapeHtml(template?.name || '通用均衡面')}</strong>
      <p>${escapeHtml((template?.rules || ['按岗位、级别、题型、难度和简历信号综合抽题']).join('；'))}</p>
      <div class="question-template-mix">
        ${renderPills(formatPaperMix(paper), '暂无组卷预览')}
      </div>
    </div>

    <details class="question-draft-panel">
      <summary>提交新题草稿</summary>
      <form data-question-draft-form class="question-draft-form">
        <label>
          <span>题目</span>
          <textarea name="question" rows="3" placeholder="例如：Redis 缓存击穿和缓存穿透有什么区别？"></textarea>
        </label>
        <label>
          <span>参考答案</span>
          <textarea name="referenceAnswer" rows="4" placeholder="写出审核用参考答案，至少包含核心机制、边界和落地建议。"></textarea>
        </label>
        <div class="question-draft-grid">
          <label>
            <span>分类</span>
            <input name="category" placeholder="Redis / MySQL / Java" />
          </label>
          <label>
            <span>标签</span>
            <input name="tagsText" placeholder="缓存击穿，互斥锁，逻辑过期" />
          </label>
        </div>
        <button type="submit" class="mini-button">提交待审核</button>
      </form>
    </details>

    <div class="section-label">待审核题目</div>
    <div class="question-draft-list">${draftList}</div>
  `;
}

function renderQuestionQualityIssues(quality) {
  if (!quality?.issues?.length) {
    return '<div class="question-quality-pass">质量门禁暂无明显问题</div>';
  }

  return `
    <div class="question-quality-issues">
      ${quality.issues.slice(0, 3).map((issue) => `
        <span class="${issue.severity === 'blocker' ? 'blocker' : ''}">${escapeHtml(issue.message)}</span>
      `).join('')}
    </div>
  `;
}

function selectTemplateForCurrentSetup(templates) {
  const formData = new FormData(setupForm);
  const role = formData.get('role');
  const level = formData.get('level');
  return templates.find((item) => item.roles?.includes(role) && item.levels?.includes(level))
    || templates.find((item) => item.roles?.includes(role))
    || templates[0]
    || null;
}

function formatPaperMix(paper) {
  const items = [];
  const typeLabels = {
    knowledge: '基础题',
    project: '项目题',
    'system-design': '场景题',
    algorithm: '代码题'
  };
  Object.entries(paper?.typeMix || {}).forEach(([type, count]) => {
    items.push(`${typeLabels[type] || type} ${count}`);
  });
  Object.entries(paper?.difficultyMix || {}).forEach(([difficulty, count]) => {
    items.push(`${getDifficultyLabel(difficulty)} ${count}`);
  });
  return items.slice(0, 6);
}

async function submitQuestionDraft(form) {
  const formData = new FormData(form);
  const setupData = new FormData(setupForm);
  const question = String(formData.get('question') || '').trim();
  const referenceAnswer = String(formData.get('referenceAnswer') || '').trim();
  if (!question || !referenceAnswer) {
    statusText.textContent = '提交草稿失败：题目和参考答案都要填写。';
    return;
  }

  try {
    await requestJson('/api/question-bank/drafts', {
      method: 'POST',
      body: JSON.stringify({
        question,
        title: question.slice(0, 32),
        referenceAnswer,
        excellentAnswer: referenceAnswer,
        category: formData.get('category') || '',
        tagsText: formData.get('tagsText') || '',
        roles: [setupData.get('role') || 'backend'],
        levels: [setupData.get('level') || 'middle'],
        type: 'knowledge',
        difficulty: setupData.get('level') === 'senior' ? 3 : 2,
        source: 'manual-ui'
      })
    });
    form.reset();
    statusText.textContent = '题目草稿已提交，等待人工审核。';
    await loadQuestionBankSnapshot();
  } catch (error) {
    statusText.textContent = `提交草稿失败：${error.message}`;
  }
}

async function reviewDraftQuestion(id, action) {
  if (!id) return;
  try {
    const result = await requestJson(`/api/question-bank/drafts/${encodeURIComponent(id)}/review`, {
      method: 'POST',
      body: JSON.stringify({ action })
    });
    statusText.textContent = result.approvedQuestion
      ? '题目已人工审核通过，并进入后续模拟面试抽题池。'
      : '题目已驳回，未进入正式题库。';
    await loadQuestionBankSnapshot();
  } catch (error) {
    statusText.textContent = `审核失败：${error.message}`;
  }
}

function renderAnswerGuide(question, completed = false) {
  if (!answerGuideEl) return;

  const isCodeQuestion = question?.type === 'algorithm';
  answerForm.classList.toggle('code-answer-mode', Boolean(isCodeQuestion && !completed));
  if (!isCodeQuestion) {
    codeAnswerModeQuestionId = null;
    codeAnswerMode = 'explain';
  } else if (codeAnswerModeQuestionId !== question.id) {
    codeAnswerModeQuestionId = question.id;
    codeAnswerMode = 'explain';
  }

  if (completed) {
    answerGuideEl.className = 'answer-guide empty-answer-guide';
    answerGuideEl.innerHTML = '<p>本轮答题已结束。生成复盘后，可以查看逐题表现、参考答案和下次训练建议。</p>';
    answerInput.placeholder = '本轮面试已结束。';
    answerInput.rows = 4;
    return;
  }

  if (!question) {
    answerGuideEl.className = 'answer-guide empty-answer-guide';
    answerGuideEl.innerHTML = '<p>开始面试后，这里会提示当前题型的作答方式。</p>';
    answerInput.placeholder = '在这里输入你的回答...';
    answerInput.rows = 4;
    return;
  }

  const guide = getAnswerGuide(question);
  const codeModeGuide = isCodeQuestion ? getCodeAnswerModeGuide(question, codeAnswerMode, guide) : null;
  const activeGuide = codeModeGuide || guide;
  const codeModeSwitch = isCodeQuestion ? renderCodeAnswerModeSwitch(codeAnswerMode, question.codeKind) : '';
  const codeChecklist = isCodeQuestion ? renderCodeAnswerChecklist(activeGuide.checklist) : '';
  const questionDrillGuide = renderQuestionDrillAnswerGuide(question);
  answerGuideEl.className = `answer-guide ${isCodeQuestion ? 'code-answer-guide' : ''}`;
  answerGuideEl.innerHTML = `
    <div class="answer-guide-main">
      <strong>${escapeHtml(activeGuide.title)}</strong>
      <span>${escapeHtml(activeGuide.detail)}</span>
    </div>
    ${questionDrillGuide}
    ${codeModeSwitch}
    <div class="answer-guide-points">
      ${activeGuide.points.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
    </div>
    ${codeChecklist}
  `;
  answerInput.placeholder = activeGuide.placeholder;
  answerInput.rows = activeGuide.rows;
}

function renderQuestionDrillAnswerGuide(question) {
  const drill = parseQuestionDrillPlanReason(question?.planReason);
  if (!drill) return '';

  return `
    <div class="answer-guide-drill">
      <span>单题重练目标</span>
      <strong>${escapeHtml(drill.target)}</strong>
      <p>${escapeHtml(drill.missedPoint
        ? `本题先补齐「${drill.missedPoint}」，回答时主动讲出原因、边界和可落地场景。`
        : '本题来自单题报告重练，先按同类题标准重答，再准备接受定点追问。')}</p>
    </div>
  `;
}

function parseQuestionDrillPlanReason(planReason) {
  const text = String(planReason || '');
  if (!isQuestionDrillPlanReason(text)) return null;

  const target = text.match(/重练「([^」]+)」/)?.[1] || '本题薄弱点';
  const missedPoint = text.match(/补齐「([^」]+)」/)?.[1] || '';
  return { target, missedPoint };
}

function renderCodeAnswerModeSwitch(activeMode, codeKind) {
  const codeLabel = codeKind === 'sql' ? 'SQL 代码' : codeKind === 'backend' ? '流程伪代码' : 'JS/代码';
  const modes = [
    ['explain', '思路说明'],
    ['pseudo', '伪代码'],
    ['code', codeLabel]
  ];

  return `
    <div class="code-answer-mode-switch" aria-label="代码题作答模式">
      ${modes.map(([value, label]) => `
        <button type="button" class="${value === activeMode ? 'active' : ''}" data-code-answer-mode="${escapeHtml(value)}">
          ${escapeHtml(label)}
        </button>
      `).join('')}
    </div>
  `;
}

function getCodeAnswerModeGuide(question, mode, baseGuide) {
  const codeKind = question.codeKind || 'algorithm';
  const templates = {
    explain: {
      points: ['先讲思路', '说明数据结构/SQL 形态', '补边界', '给复杂度或取舍'],
      checklist: ['先说输入输出', '讲核心思路', '补边界条件', '说明复杂度或方案取舍'],
      placeholder: '建议结构：\n1. 输入输出是什么\n2. 核心思路/SQL 形态是什么\n3. 为什么这样做\n4. 边界条件和复杂度/取舍',
      rows: 7
    },
    pseudo: {
      points: ['步骤拆解', '关键判断', '状态更新', '异常边界'],
      checklist: ['写初始化', '写主流程', '写关键 if/循环/SQL 条件', '补失败或空数据处理'],
      placeholder: '伪代码示例：\n初始化 ...\n遍历/查询 ...\n如果 ... 则 ...\n更新状态/返回结果 ...\n\n边界：...',
      rows: 9
    },
    code: {
      points: getCodeModePoints(codeKind),
      checklist: getCodeModeChecklist(codeKind),
      placeholder: getCodeModePlaceholder(codeKind),
      rows: 10
    }
  };
  const modeGuide = templates[mode] || templates.explain;

  return {
    ...baseGuide,
    ...modeGuide,
    title: `${baseGuide.title} · ${getCodeAnswerModeLabel(mode, codeKind)}`,
    detail: `${baseGuide.detail} 当前建议按“${getCodeAnswerModeLabel(mode, codeKind)}”组织答案。`
  };
}

function getCodeAnswerModeLabel(mode, codeKind) {
  if (mode === 'pseudo') return '伪代码';
  if (mode === 'code') return codeKind === 'sql' ? 'SQL 代码' : codeKind === 'backend' ? '流程伪代码' : 'JS/代码';
  return '思路说明';
}

function getCodeModePoints(codeKind) {
  return {
    sql: ['SELECT 结构', 'WHERE 条件', 'GROUP/ORDER', '索引风险'],
    frontend: ['函数签名', '核心实现', '副作用', '边界'],
    backend: ['请求流程', '状态判断', '幂等/并发', '失败恢复'],
    algorithm: ['数据结构', '循环/递归', '返回值', '复杂度']
  }[codeKind] || ['核心代码', '边界', '复杂度', '解释'];
}

function getCodeModeChecklist(codeKind) {
  return {
    sql: ['写完整 SQL', '说明过滤/聚合/排序', '补空值和重复数据', '补索引或性能风险'],
    frontend: ['写函数签名', '写关键实现', '说明参数/this/异步副作用', '补边界和复杂度'],
    backend: ['写流程伪代码', '说明状态存储', '补并发和幂等判断', '补失败恢复和取舍'],
    algorithm: ['写关键代码', '说明数据结构', '补极端输入', '说明时间/空间复杂度']
  }[codeKind] || ['写关键实现', '解释核心判断', '补边界', '说明复杂度'];
}

function getCodeModePlaceholder(codeKind) {
  return {
    sql: 'SELECT ...\nFROM ...\nWHERE ...\nGROUP BY ...\nORDER BY ...\n\n说明：过滤条件是... 分组/排序是... 索引风险是...',
    frontend: 'function solve(input) {\n  // 写关键实现\n  return result;\n}\n\n说明：输入输出、边界、副作用和复杂度...',
    backend: '流程伪代码：\n1. 接收请求，校验参数\n2. 读取/写入状态\n3. 判断幂等、并发或失败场景\n4. 返回结果或触发补偿\n\n取舍：...',
    algorithm: 'function solve(input) {\n  // 初始化数据结构\n  // 主循环/递归\n  return result;\n}\n\n复杂度：时间 O(...)，空间 O(...)\n边界：...'
  }[codeKind] || '写关键代码或伪代码：\n...\n\n解释：...';
}

function renderCodeAnswerChecklist(items) {
  const checklist = Array.isArray(items) && items.length
    ? items
    : ['先讲解题思路', '写伪代码或关键代码', '补边界条件', '说明复杂度或取舍'];

  return `
    <div class="code-answer-checklist" aria-label="代码题作答清单">
      ${checklist.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
    </div>
  `;
}

function getAnswerGuide(question) {
  const typeLabel = getPlanTypeLabel(question);
  const codeGuides = {
    sql: {
      title: `当前答题方式：${typeLabel}`,
      detail: '可以直接写 SQL 或伪 SQL，再解释筛选条件、分组统计、排序和边界情况。',
      points: ['SQL/伪 SQL', '字段含义', '边界数据', '性能考虑'],
      checklist: ['先写查询思路', '给 SQL 或伪 SQL', '说明空值/重复/时间边界', '补索引和性能风险'],
      placeholder: '示例结构：\nSELECT ...\nFROM ...\nWHERE ...\nGROUP BY ...\nORDER BY ...\n\n解释：我这样写是因为... 边界上要注意...',
      rows: 8
    },
    frontend: {
      title: `当前答题方式：${typeLabel}`,
      detail: '可以写 JS 代码、伪代码或关键流程，重点讲清输入输出、核心机制和异常边界。',
      points: ['输入输出', '核心代码', '边界情况', '复杂度/副作用'],
      checklist: ['定义输入输出', '写关键代码或伪代码', '补 this/参数/异步边界', '说明复杂度和副作用'],
      placeholder: '示例结构：\nfunction demo(...) {\n  // 写关键实现或伪代码\n}\n\n解释：核心点是... 边界情况是...',
      rows: 8
    },
    backend: {
      title: `当前答题方式：${typeLabel}`,
      detail: '按请求流程、数据结构或存储、伪代码、异常边界和方案取舍来回答。',
      points: ['流程步骤', '存储/状态', '伪代码', '异常与取舍'],
      checklist: ['先画请求流程', '说明状态存储', '写伪代码或关键判断', '补并发/失败恢复/取舍'],
      placeholder: '示例结构：\n1. 请求进来先...\n2. 关键状态存在...\n3. 伪代码：...\n4. 异常边界和取舍：...',
      rows: 8
    },
    algorithm: {
      title: `当前答题方式：${typeLabel}`,
      detail: '先说思路和复杂度，再写伪代码或关键代码，最后补充边界条件。',
      points: ['解题思路', '关键代码', '复杂度', '边界条件'],
      checklist: ['先说核心思路', '写伪代码或关键代码', '说明时间/空间复杂度', '补空输入和极端输入'],
      placeholder: '示例结构：\n思路：...\n伪代码/代码：...\n复杂度：时间 O(...)，空间 O(...)\n边界：...',
      rows: 8
    }
  };

  if (question.type === 'algorithm') {
    return codeGuides[question.codeKind] || codeGuides.algorithm;
  }

  if (question.type === 'project') {
    return {
      title: `当前答题方式：${typeLabel}`,
      detail: '按背景、你的职责、关键动作、落地结果来讲，避免只说“我们团队”。',
      points: ['项目背景', '个人职责', '关键动作', '结果证据'],
      placeholder: '建议结构：这个项目解决什么问题；我具体负责什么；我做了哪些关键动作；最后带来了什么结果。',
      rows: 5
    };
  }

  if (question.type === 'system-design') {
    return {
      title: `当前答题方式：${typeLabel}`,
      detail: '先明确目标和约束，再给方案、关键链路、风险边界和取舍。',
      points: ['目标约束', '核心方案', '风险边界', '方案取舍'],
      placeholder: '建议结构：先确认目标和约束；再讲整体方案；然后说明关键链路、异常处理和取舍。',
      rows: 5
    };
  }

  return {
    title: `当前答题方式：${typeLabel}`,
    detail: '先给结论，再解释原理、使用场景、常见坑和你在项目里的理解。',
    points: ['先结论', '讲原理', '说场景', '补边界'],
    placeholder: '建议结构：结论是什么；核心原理是什么；什么场景下会用；有哪些边界或常见坑。',
    rows: 5
  };
}

function renderStyleHint(style) {
  const hints = {
    normal: {
      title: '常规面试',
      detail: '接近真实技术面节奏：先问基础技术题，回答足够完整就进入下一题，回答偏泛时会适度追问。'
    },
    pressure: {
      title: '压力面试',
      detail: '追问更紧，重点压边界条件、取舍原因、排查顺序和真实细节；适合练抗压和补漏洞。'
    },
    coaching: {
      title: '教练模式',
      detail: '仍按面试标准提问，但会给更明确的引导，帮助你练结构、补关键点和形成可复述答案。'
    }
  };
  const hint = hints[style] || hints.normal;

  styleHint.innerHTML = `
    <strong>${escapeHtml(hint.title)}</strong>
    <span>${escapeHtml(hint.detail)}</span>
  `;
}

function renderPlanPreview() {
  if (!planPreviewEl) return;

  const formData = new FormData(setupForm);
  const roleLabel = getSelectLabel('role', formData.get('role')) || '当前方向';
  const levelLabel = getSelectLabel('level', formData.get('level')) || '当前级别';
  const styleLabel = getSelectLabel('style', formData.get('style')) || '常规面试';
  const questionCount = Math.max(3, Math.min(6, Number(formData.get('questionCount') || 5)));
  const analysis = analyzeProfileText(formData.get('resume') || '');
  const stages = createPlanPreviewStages(questionCount, analysis);
  const previewReasons = createPlanPreviewReasons(analysis);
  const focus = analysis.hasInput
    ? (analysis.focusTopics[0] || analysis.recommendedTracks[0] || '结合 JD/简历做定制追问')
    : '快速练习会从通用基础八股题开始，再进入追问和项目/场景题。';

  planPreviewEl.className = 'plan-preview';
  planPreviewEl.innerHTML = `
    <div class="plan-preview-header">
      <strong>本轮训练计划预览</strong>
      <span>${escapeHtml(`${roleLabel} · ${levelLabel} · ${styleLabel}`)}</span>
    </div>
    <div class="plan-preview-steps">
      ${stages.map((stage, index) => `
        <span>${escapeHtml(`${index + 1}. ${stage}`)}</span>
      `).join('')}
    </div>
    <div class="section-label">安排原因</div>
    <div class="plan-preview-reasons">
      ${previewReasons.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}
    </div>
    <p>${escapeHtml(`训练重点：${focus}`)}</p>
    <p>${escapeHtml('提示：预览只展示面试节奏，不提前暴露具体题目和参考答案。')}</p>
  `;
}

function createPlanPreviewReasons(analysis) {
  if (!analysis?.hasInput) {
    return [
      '先用基础八股题校准技术准确性。',
      '通过追问观察回答完整度和表达结构。',
      '再进入项目/场景题验证真实落地能力。'
    ];
  }

  const reasons = [];
  if (analysis.isQuestionDrill) {
    reasons.push('这是从单题报告发起的专项重练，本轮会先补齐该题薄弱点。');
  }
  (analysis.riskQuestionMappings || []).slice(0, 3).forEach((item) => {
    reasons.push(`因「${item.risk}」，本轮会安排${item.questionType}。`);
  });

  if (analysis.focusTopics?.length) {
    reasons.push(`围绕「${analysis.focusTopics[0]}」安排基础题和追问，验证掌握深度。`);
  }

  if ((analysis.recommendedTracks || []).some((item) => /代码题|SQL题|算法题|前端代码题|后端场景题/.test(item))) {
    reasons.push('包含轻量代码题训练，重点看思路、边界和复杂度表达。');
  }

  return [...new Set(reasons)].slice(0, 4);
}

function createPlanPreviewStages(questionCount, analysis) {
  if (analysis?.isQuestionDrill) {
    return createTrainingStagePreview({
      questionCount,
      hasCodeTrack: (analysis.recommendedTracks || []).some((item) => /代码题|SQL题|算法题|前端代码题|后端场景题/.test(item)),
      includeScenario: true,
      followUpLabel: '定点追问',
      scenarioLabel: '项目化表达',
      codeLabel: '同类代码题',
      finalLabel: '本题复盘'
    });
  }

  const hasCodeTrack = (analysis.recommendedTracks || []).some((item) => /代码题|SQL题|算法题|前端代码题|后端场景题/.test(item));
  return createTrainingStagePreview({
    questionCount,
    hasCodeTrack,
    includeScenario: true,
    followUpLabel: '追问',
    scenarioLabel: '场景设计题',
    codeLabel: '代码题',
    finalLabel: '复盘准备'
  });
}

function createTrainingStagePreview({
  questionCount = 5,
  hasCodeTrack = false,
  includeScenario = true,
  followUpLabel = '追问',
  scenarioLabel = '场景设计题',
  codeLabel = '代码题',
  finalLabel = '复盘报告'
} = {}) {
  const stages = ['基础八股题', followUpLabel, '项目经历题'];
  if (includeScenario || !hasCodeTrack) stages.push(scenarioLabel);
  if (hasCodeTrack) stages.push(codeLabel);
  stages.push(finalLabel);

  return stages.slice(0, questionCount).concat(questionCount > stages.length ? ['复盘准备'] : []).slice(0, questionCount);
}

function renderProfileAnalysis(text) {
  if (!profileAnalysisEl) return;

  const analysis = analyzeProfileText(text);
  if (!analysis.hasInput) {
    profileAnalysisEl.className = 'profile-analysis empty-profile';
    profileAnalysisEl.innerHTML = '<p>不填也可以直接快速练习；填写 JD、简历或项目背景后，会在这里分析岗位关键词和推荐考点。</p>';
    return;
  }

  profileAnalysisEl.className = 'profile-analysis';
  profileAnalysisEl.innerHTML = `
    <div class="profile-analysis-header">
      <strong>定制分析</strong>
      <span>${escapeHtml(analysis.mode)}</span>
    </div>
    <div class="section-label">岗位关键词</div>
    <div class="meta-row">${renderPills(analysis.keywords, '暂无明显关键词')}</div>
    <div class="section-label">高频考点</div>
    <div class="meta-row">${renderPills(analysis.focusTopics, '按通用技术面推进')}</div>
    <div class="section-label">能力要求</div>
    ${renderList(analysis.capabilities, '暂未识别出明确能力要求。')}
    <div class="section-label">面试风险点</div>
    ${renderList(analysis.risks, '暂未发现明显风险点。')}
    <div class="section-label">风险对应题型</div>
    ${renderRiskQuestionMapping(analysis.riskQuestionMappings)}
    <div class="section-label">推荐题目方向</div>
    ${renderList(analysis.recommendedTracks, '先从基础八股题开始。')}
  `;
}

function analyzeProfileText(text) {
  const source = String(text || '').trim();
  if (!source) {
    return {
      hasInput: false,
      mode: '快速练习',
      keywords: [],
      focusTopics: [],
      capabilities: [],
      risks: [],
      recommendedTracks: []
    };
  }

  const normalized = source.toLowerCase();
  const isQuestionDrill = /报告单题重练|本题薄弱点|单题专项重练|原题：|优先补齐要点/.test(source);
  const keywordRules = [
    ['Java', ['java', 'spring', 'spring boot', 'jvm', 'mybatis']],
    ['Go', ['go', 'golang', 'gin', 'goroutine', 'channel']],
    ['Python', ['python', 'django', 'flask', 'fastapi', 'celery']],
    ['前端', ['react', 'vue', 'webpack', 'vite', 'typescript', 'javascript', '前端', '防抖', '节流', '数组扁平化', 'promise']],
    ['MySQL', ['mysql', 'sql', 'sql题', '索引', '事务', 'innodb', '窗口函数', '分组统计']],
    ['Redis', ['redis', '缓存', '分布式锁', '缓存穿透']],
    ['消息队列', ['mq', 'rabbitmq', 'kafka', 'rocketmq', '消息队列']],
    ['微服务', ['微服务', 'dubbo', 'grpc', '服务治理']],
    ['测试', ['测试', 'qa', '自动化测试', '接口测试', '性能测试', '测试开发', '回归测试']],
    ['运维', ['运维', 'linux', 'shell', '网络', '监控', '巡检', '数据库备份', 'dba']],
    ['DevOps', ['devops', 'sre', 'ci/cd', 'jenkins', 'gitlab ci', 'docker', 'k8s', 'kubernetes', '可观测性']],
    ['数据', ['数据开发', 'etl', '数仓', 'hive', 'spark', 'flink', 'airflow', '数据治理']],
    ['AI', ['ai', '算法', '机器学习', '深度学习', '大模型', 'rag', '向量数据库', '特征工程', '模型部署']],
    ['安全', ['安全', '渗透', '漏洞', 'xss', 'sql注入', 'csrf', 'waf', '权限控制', '加固']],
    ['架构', ['架构', '技术经理', '研发经理', '技术总监', '治理', '容灾', '高可用', '演进']],
    ['算法', ['算法', '复杂度', 'leetcode', '链表', '二叉树', '边界条件', '数据结构']],
    ['系统设计', ['系统设计', '架构', '高并发', '限流', '限流器', '接口幂等', '幂等', '缓存穿透', '熔断', '分布式']]
  ];
  const keywords = keywordRules
    .filter(([, tokens]) => tokens.some((token) => normalized.includes(token.toLowerCase())))
    .map(([label]) => label);

  const hasAny = (tokens) => tokens.some((token) => normalized.includes(token.toLowerCase()));
  const focusTopics = [
    isQuestionDrill ? '单题薄弱点专项重练' : '',
    hasAny(['mysql', '索引', '事务', 'sql']) ? '数据库索引与事务' : '',
    hasAny(['sql题', '分组统计', '窗口函数']) ? 'SQL 代码题与查询表达' : '',
    hasAny(['redis', '缓存', '分布式锁', '缓存穿透']) ? '缓存一致性与 Redis 排障' : '',
    hasAny(['jvm', 'java', 'spring']) ? 'JVM / Spring / Java 基础' : '',
    hasAny(['react', 'vue', '前端', 'webpack', 'vite']) ? '前端工程化与性能优化' : '',
    hasAny(['防抖', '节流', '数组扁平化', 'promise']) ? '前端 JS 手写代码题' : '',
    hasAny(['mq', '消息', 'kafka', 'rabbitmq']) ? '异步消息、幂等和补偿' : '',
    hasAny(['测试', 'qa', '自动化测试', '接口测试', '性能测试']) ? '测试设计与自动化策略' : '',
    hasAny(['运维', 'linux', 'shell', '网络', '监控', 'dba']) ? 'Linux / 网络 / 数据库运维排障' : '',
    hasAny(['devops', 'sre', 'ci/cd', 'docker', 'k8s', 'kubernetes']) ? 'DevOps 与稳定性治理' : '',
    hasAny(['数据开发', 'etl', '数仓', 'hive', 'spark', 'flink']) ? '数据链路与数仓建模' : '',
    hasAny(['ai', '机器学习', '深度学习', '大模型', 'rag', '向量数据库']) ? 'AI 建模与推理工程化' : '',
    hasAny(['安全', '渗透', '漏洞', 'xss', 'sql注入', 'csrf']) ? '应用安全与漏洞防护' : '',
    hasAny(['架构', '治理', '高可用', '容灾', '技术经理']) ? '架构设计与技术治理' : '',
    hasAny(['高并发', '限流', '限流器', '接口幂等', '幂等', '缓存穿透', '熔断', '分布式']) ? '高并发场景设计' : '',
    hasAny(['算法', '复杂度', 'leetcode', '边界条件', '数据结构']) ? '算法复杂度与边界条件' : ''
  ].filter(Boolean);

  const capabilities = [
    isQuestionDrill ? '需要把本题按可通过标准重答，并接受同类定点追问。' : '',
    hasAny(['负责', '主导', '设计', '落地']) ? '需要讲清个人职责、关键判断和落地结果。' : '',
    hasAny(['优化', '性能', '慢', '延迟', 'qps', '耗时']) ? '需要准备性能定位、指标变化和优化取舍。' : '',
    hasAny(['排查', '故障', '线上', '事故', '白屏']) ? '需要准备线上问题排查顺序和止血方案。' : '',
    hasAny(['高并发', '库存', '支付', '订单', '一致性', '幂等', '缓存穿透', '限流']) ? '需要准备一致性、幂等、重试、限流和缓存保护链路。' : '',
    hasAny(['测试', 'qa', '自动化测试', '测试开发']) ? '需要准备测试策略、自动化分层和质量门禁。' : '',
    hasAny(['运维', '监控', 'dba', '巡检', '网络']) ? '需要准备故障排查顺序、容量评估和稳定性基线。' : '',
    hasAny(['devops', 'sre', 'ci/cd', 'k8s']) ? '需要准备发布流水线、可观测性和故障恢复机制。' : '',
    hasAny(['数据开发', 'etl', '数仓', '指标']) ? '需要准备口径一致性、调度依赖和数据质量控制。' : '',
    hasAny(['ai', '机器学习', '大模型', 'rag']) ? '需要准备模型效果评估、数据质量和推理成本控制。' : '',
    hasAny(['安全', '渗透', '漏洞', '权限']) ? '需要准备漏洞原理、修复方案和安全基线。' : '',
    hasAny(['架构', '技术经理', '治理', '高可用']) ? '需要准备架构取舍、演进路径和团队协作治理。' : '',
    hasAny(['协作', '跨团队', '推进']) ? '需要说明沟通协作边界和推进结果。' : ''
  ].filter(Boolean);

  const risks = [
    isQuestionDrill ? '本题曾暴露要点缺口或表达不稳，下一轮会先检查是否真正补齐。' : '',
    keywords.length < 2 ? '技术关键词偏少，面试可能只能按通用题推进，建议补充具体技术栈。' : '',
    !hasAny(['负责', '主导', '我做', '我设计', '我实现']) ? '个人贡献信号不足，项目题容易被追问“你具体做了什么”。' : '',
    !hasAny(['提升', '降低', '减少', 'qps', '耗时', '成功率', '明显', '指标', '数据']) ? '结果证据不足，建议补充上线效果或量化变化。' : '',
    hasAny(['熟悉', '了解']) && !hasAny(['项目', '落地', '线上', '生产']) ? '描述偏简历关键词，缺少真实场景，容易被追问落地细节。' : ''
  ].filter(Boolean);

  const recommendedTracks = createRecommendedTracks({
    keywords,
    focusTopics,
    capabilities,
    hasProjectRisk: risks.some((item) => item.includes('个人贡献')),
    hasMetricsRisk: risks.some((item) => item.includes('结果证据'))
  });

  return {
    hasInput: true,
    mode: source.length >= 80 ? '定制练习' : '轻量定制',
    isQuestionDrill,
    keywords: keywords.length ? keywords : ['通用技术面'],
    focusTopics: focusTopics.length ? focusTopics : ['基础八股题', '项目表达'],
    capabilities: capabilities.length ? capabilities : ['先按岗位方向考察基础知识、项目表达和追问承压。'],
    risks: risks.length ? risks : ['当前背景信息较完整，面试会优先验证技术细节和真实落地。'],
    riskQuestionMappings: createRiskQuestionMappings(risks, focusTopics),
    recommendedTracks
  };
}

function createSerializableProfileAnalysis(text) {
  const analysis = analyzeProfileText(text);
  if (!analysis.hasInput) return null;

  return {
    isQuestionDrill: analysis.isQuestionDrill,
    keywords: analysis.keywords,
    focusTopics: analysis.focusTopics,
    capabilities: analysis.capabilities,
    risks: analysis.risks,
    riskQuestionMappings: analysis.riskQuestionMappings,
    recommendedTracks: analysis.recommendedTracks
  };
}

function renderRiskQuestionMapping(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<p>当前会按通用基础题、项目表达和场景追问推进。</p>';
  }

  return `
    <div class="risk-question-map">
      ${items.map((item) => `
        <article>
          <strong>${escapeHtml(item.risk)}</strong>
          <span>${escapeHtml(item.questionType)}</span>
        </article>
      `).join('')}
    </div>
  `;
}

function createRiskQuestionMappings(risks, focusTopics) {
  const source = [...(risks || []), ...(focusTopics || [])].join(' ');
  const mappings = [
    {
      match: /单题薄弱点|本题曾暴露|重练本题/,
      risk: '本题薄弱点未补齐',
      questionType: '同类基础题 + 定点追问 + 本题复盘'
    },
    {
      match: /技术关键词偏少|基础八股|通用题/,
      risk: '技术栈不够明确',
      questionType: '基础八股题 + 广度追问'
    },
    {
      match: /个人贡献|项目表达/,
      risk: '个人职责不够清楚',
      questionType: '项目经历题 + 个人职责追问'
    },
    {
      match: /结果证据|指标|上线效果|量化/,
      risk: '结果证据不足',
      questionType: '项目复盘题 + 指标结果追问'
    },
    {
      match: /真实场景|落地细节|线上|排查/,
      risk: '落地细节不足',
      questionType: '线上排查题 + 场景追问'
    },
    {
      match: /高并发|一致性|幂等|限流|缓存穿透|补偿/,
      risk: '高并发链路风险',
      questionType: '后端场景题 + 代码/伪代码题'
    },
    {
      match: /前端 JS|算法复杂度|代码题/,
      risk: '代码表达风险',
      questionType: '轻量代码题 + 边界复杂度追问'
    }
  ];

  return mappings
    .filter((item) => item.match.test(source))
    .map(({ risk, questionType }) => ({ risk, questionType }))
    .slice(0, 4);
}

function createRecommendedTracks({ keywords, focusTopics, capabilities, hasProjectRisk, hasMetricsRisk }) {
  const tracks = [];
  const hasKeyword = (value) => keywords.includes(value);

  if (focusTopics.some((item) => item.includes('单题薄弱点'))) tracks.push('单题专项：同类基础题、定点追问、项目化表达和本题复盘。');
  if (hasKeyword('MySQL')) tracks.push('MySQL 索引、事务、慢查询定位。');
  if (focusTopics.some((item) => item.includes('SQL 代码题'))) tracks.push('SQL题：分组统计、窗口函数、索引性能。');
  if (hasKeyword('Redis')) tracks.push('Redis 缓存一致性、热 key、大 key 和延迟排查。');
  if (hasKeyword('Java')) tracks.push('Java 集合、JVM、线程池和 Spring 事务边界。');
  if (hasKeyword('前端')) tracks.push('前端首屏性能、状态管理、组件抽象和线上白屏排查。');
  if (focusTopics.some((item) => item.includes('前端 JS'))) tracks.push('前端代码题：防抖节流、Promise、数组扁平化。');
  if (hasKeyword('Go')) tracks.push('Go goroutine 协作、context 超时取消和限流背压。');
  if (hasKeyword('Python')) tracks.push('Python worker、任务队列、GIL 与性能排查。');
  if (hasKeyword('测试')) tracks.push('测试岗：测试用例设计、自动化框架、回归策略和质量门禁。');
  if (hasKeyword('运维')) tracks.push('运维岗：Linux 排障、网络诊断、数据库备份恢复和监控告警。');
  if (hasKeyword('DevOps')) tracks.push('DevOps/SRE：CI/CD、K8s 发布、可观测性、容量和故障演练。');
  if (hasKeyword('数据')) tracks.push('数据岗：ETL 稳定性、数仓分层、指标口径和数据质量。');
  if (hasKeyword('AI')) tracks.push('AI 岗：模型训练、评估指标、特征/向量检索和推理部署。');
  if (hasKeyword('安全')) tracks.push('安全岗：常见漏洞原理、修复验证、权限模型和纵深防御。');
  if (hasKeyword('架构')) tracks.push('架构/管理岗：高可用架构、容量规划、技术债治理和团队决策。');
  if (focusTopics.some((item) => item.includes('高并发'))) tracks.push('高并发场景题：限流、幂等、补偿和降级。');
  if (focusTopics.some((item) => item.includes('高并发')) || hasKeyword('系统设计')) tracks.push('后端场景题：限流器、接口幂等、缓存穿透处理。');
  if (hasKeyword('算法')) tracks.push('算法题：复杂度、边界条件和数据结构选择。');
  if (hasProjectRisk) tracks.push('项目经历题：按背景、职责、动作、结果重构回答。');
  if (hasMetricsRisk) tracks.push('结果复盘题：准备指标、上线效果和改进空间。');

  return tracks.length ? [...new Set(tracks)].slice(0, 6) : ['基础八股题 -> 项目追问 -> 场景题 -> 复盘报告。'];
}

function renderPills(items, fallback) {
  if (!Array.isArray(items) || !items.length) {
    return `<span class="pill">${escapeHtml(fallback)}</span>`;
  }

  return items.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join('');
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `请求失败（${response.status}）`);
  }

  return data;
}

function renderMessages(messages) {
  if (!messages.length) {
    messagesEl.className = 'messages empty-state';
    messagesEl.innerHTML = '<p>完整面试记录会显示在这里。</p>';
    return;
  }

  messagesEl.className = 'messages';
  messagesEl.innerHTML = messages.map((message) => {
    const roleLabel = message.role === 'candidate' ? '候选人' : '面试官';
    const provider = message.provider ? ` | ${message.provider}` : '';
    const timestamp = message.createdAt ? formatTime(message.createdAt) : '';

    return `
      <article class="message ${escapeHtml(message.role)}">
        <div class="message-header">
          <strong>${roleLabel}</strong>
          <span>${escapeHtml(timestamp)}${escapeHtml(provider)}</span>
        </div>
        <div class="message-content">${escapeHtml(message.content || '')}</div>
      </article>
    `;
  }).join('');

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderLiveCoach(snapshot) {
  if (!snapshot) {
    latestLiveCoachSnapshot = null;
    liveCoachEl.className = 'live-coach empty-state';
    liveCoachEl.innerHTML = '<p>暂无实时面试提示。</p>';
    return;
  }

  latestLiveCoachSnapshot = snapshot;
  const normalizedSnapshot = translateLiveCoachSnapshot(snapshot);
  const badgeClass = getLiveCoachStageClass(snapshot.stage);
  const followUpMeta = normalizedSnapshot.followUpCount
    ? `<span class="pill ${badgeClass}">${escapeHtml(`已追问 ${normalizedSnapshot.followUpCount} 次`)}</span>`
    : '';
  const stagnationMeta = normalizedSnapshot.stagnantFollowUpCount
    ? `<span class="pill amber">${escapeHtml(`弱回答重复 ${normalizedSnapshot.stagnantFollowUpCount} 次`)}</span>`
    : '';
  const missingSignals = Array.isArray(normalizedSnapshot.missingSignals) && normalizedSnapshot.missingSignals.length
    ? normalizedSnapshot.missingSignals.map((item) => `<span class="pill amber">${escapeHtml(item)}</span>`).join('')
    : '<span class="pill green">暂无明显缺失信号</span>';
  const stress = calculateStressLevel(normalizedSnapshot);
  const toggleText = liveCoachDetailsOpen ? '隐藏提示' : '查看提示';
  const detailsHtml = liveCoachDetailsOpen
    ? `
        <div class="live-coach-details">
          <div class="section-label">面试官正在考察</div>
          <p>${escapeHtml(normalizedSnapshot.target || '暂无')}</p>
          <div class="section-label">当前缺口</div>
          <p>${escapeHtml(normalizedSnapshot.focus || '暂无')}</p>
          <div class="section-label">压力来源</div>
          <p>${escapeHtml(normalizedSnapshot.pressureReason || '暂无')}</p>
          <div class="section-label">缺失信号</div>
          <div class="meta-row">${missingSignals}</div>
          <div class="section-label">为什么重要</div>
          <p>${escapeHtml(normalizedSnapshot.risk || '暂无')}</p>
          <div class="section-label">下一步最佳回答</div>
          <p>${escapeHtml(normalizedSnapshot.suggestedMove || '暂无')}</p>
        </div>
      `
    : '';

  liveCoachEl.className = 'live-coach';
  liveCoachEl.innerHTML = `
    <div class="live-coach-header">
      <div>
        <strong>实时面试官雷达</strong>
        <p>${escapeHtml(normalizedSnapshot.currentQuestion || '暂无进行中的问题')}</p>
      </div>
      <div class="meta-row">
        <span class="pill ${badgeClass}">${escapeHtml(normalizedSnapshot.stageLabel || '实时')}</span>
        ${followUpMeta}
        ${stagnationMeta}
      </div>
    </div>
    <div class="stress-gauge echart-card">
      <div id="stressGaugeChart" class="echart-gauge" aria-label="追问压力仪表盘"></div>
      <strong>${escapeHtml(stress.label)}</strong>
      <p>${escapeHtml(stress.detail)}</p>
    </div>
    <div class="live-coach-actions">
      <button type="button" class="ghost-button live-coach-toggle" data-live-coach-toggle aria-expanded="${liveCoachDetailsOpen}">
        ${toggleText}
      </button>
    </div>
    ${detailsHtml}
  `;
  renderStressGaugeChart(stress);
}

function calculateStressLevel(snapshot) {
  const followUps = Number(snapshot.followUpCount || 0);
  const stagnant = Number(snapshot.stagnantFollowUpCount || 0);
  const missing = Array.isArray(snapshot.missingSignals) ? snapshot.missingSignals.length : 0;
  const stagePressure = /pressure|pin_down/.test(String(snapshot.stage || '')) ? 1 : 0;
  const score = Math.min(100, followUps * 24 + stagnant * 18 + missing * 10 + stagePressure * 22);
  const angle = Math.round(-58 + score * 1.16);

  if (score >= 72) {
    return {
      score,
      angle,
      label: '高压追问区',
      detail: '回答已经触发连续深挖，下一句要直接补关键缺口。'
    };
  }

  if (score >= 38) {
    return {
      score,
      angle,
      label: '承压观察区',
      detail: '面试官正在确认细节稳定性，建议补边界、指标和取舍。'
    };
  }

  return {
    score,
    angle,
    label: '正常推进区',
    detail: '当前节奏平稳，先保持结论清楚和回答密度。'
  };
}

function renderStressGaugeChart(stress) {
  requestAnimationFrame(() => {
    const target = document.querySelector('#stressGaugeChart');
    if (!target || !window.echarts) return;

    const chart = window.echarts.getInstanceByDom(target) || window.echarts.init(target, null, { renderer: 'svg' });
    chart.setOption({
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        radius: '96%',
        center: ['50%', '62%'],
        splitNumber: 4,
        progress: {
          show: true,
          width: 14,
          roundCap: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#28a745' },
                { offset: 0.52, color: '#f6b73c' },
                { offset: 1, color: '#ff4d5e' }
              ]
            }
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 14,
            color: [[1, 'rgba(255, 255, 255, 0.08)']]
          }
        },
        axisTick: {
          distance: -22,
          splitNumber: 2,
          lineStyle: {
            width: 1,
            color: 'rgba(244, 247, 251, 0.18)'
          }
        },
        splitLine: {
          distance: -26,
          length: 10,
          lineStyle: {
            width: 2,
            color: 'rgba(244, 247, 251, 0.26)'
          }
        },
        axisLabel: {
          show: false
        },
        pointer: {
          icon: 'path://M4,0 L-4,0 L0,-78 Z',
          length: '62%',
          width: 10,
          offsetCenter: [0, '5%'],
          itemStyle: {
            color: '#f4f7fb',
            shadowBlur: 8,
            shadowColor: 'rgba(255,255,255,0.45)'
          }
        },
        anchor: {
          show: true,
          size: 13,
          itemStyle: {
            color: '#f4f7fb',
            borderColor: '#101115',
            borderWidth: 3
          }
        },
        detail: {
          valueAnimation: true,
          offsetCenter: [0, '56%'],
          color: '#f4f7fb',
          fontFamily: 'Cascadia Code, Consolas, monospace',
          fontSize: 22,
          fontWeight: 800,
          formatter: '{value}'
        },
        data: [{ value: stress.score }]
      }]
    });
    chart.resize();
  });
}

function renderInterviewProgress(plan, currentId, completed = false) {
  if (!interviewProgressEl) return;

  if (!Array.isArray(plan) || !plan.length) {
    interviewProgressEl.className = 'interview-progress empty-progress';
    interviewProgressEl.innerHTML = '<p>开始后会展示本轮面试路线：基础题、追问、项目题、场景题和复盘。</p>';
    return;
  }

  const currentIndex = completed ? plan.length : Math.max(0, plan.findIndex((item) => item.id === currentId));
  const progressText = completed
    ? `已完成 ${plan.length}/${plan.length} 题，进入复盘`
    : `当前第 ${currentIndex + 1}/${plan.length} 题`;
  const phaseText = completed ? '复盘阶段' : getPlanTypeLabel(plan[currentIndex]);
  const itemsHtml = plan.map((item, index) => {
    const state = completed || index < currentIndex
      ? 'done'
      : index === currentIndex
        ? 'current'
        : 'pending';
    const stateLabel = {
      done: '已完成',
      current: '当前',
      pending: '待开始'
    }[state];
    const planReason = item.planReason || '按本轮训练节奏安排。';
    const isQuestionDrill = isQuestionDrillPlanReason(planReason);
    const drillBadge = isQuestionDrill
      ? '<span class="progress-drill-badge">单题重练目标</span>'
      : '';
    const drillHint = isQuestionDrill
      ? '<p class="progress-drill-hint">来自单题报告重练，本题会重点检查薄弱点是否补齐。</p>'
      : '';

    return `
      <article class="progress-step ${state} ${isQuestionDrill ? 'question-drill' : ''}">
        <div class="progress-step-index">${index + 1}</div>
        <div>
          <strong>${escapeHtml(getPlanTypeLabel(item))}</strong>
          ${drillBadge}
          <span>${escapeHtml(`${item.category || '综合'} · ${getDifficultyLabel(item.difficulty)} · ${stateLabel}`)}</span>
          <p>安排原因：${escapeHtml(planReason)}</p>
          ${drillHint}
        </div>
      </article>
    `;
  }).join('');

  interviewProgressEl.className = 'interview-progress';
  interviewProgressEl.innerHTML = `
    <div class="progress-header">
      <div>
        <strong>本轮面试路线</strong>
        <span>${escapeHtml(progressText)}</span>
      </div>
      <span class="pill ${completed ? 'green' : ''}">${escapeHtml(phaseText)}</span>
    </div>
    <div class="progress-steps">${itemsHtml}</div>
  `;
}

function isQuestionDrillPlanReason(planReason) {
  return /单题报告重练|本题薄弱点|单题专项/.test(String(planReason || ''));
}

function getPlanTypeLabel(itemOrType) {
  const type = typeof itemOrType === 'object' ? itemOrType?.type : itemOrType;
  const codeKind = typeof itemOrType === 'object' ? itemOrType?.codeKind : null;
  if (type === 'algorithm') {
    return {
      sql: 'SQL题',
      frontend: '前端代码题',
      backend: '后端场景题',
      algorithm: '算法题'
    }[codeKind] || '代码思路题';
  }

  return {
    knowledge: '基础八股题',
    project: '项目经历题',
    'system-design': '场景设计题',
  }[type] || '综合追问题';
}

function getDifficultyLabel(value) {
  return {
    1: '基础',
    2: '中等',
    3: '进阶'
  }[Number(value)] || '中等';
}

function translateLiveCoachSnapshot(snapshot) {
  return {
    ...snapshot,
    stageLabel: translateLiveCoachText(snapshot.stageLabel),
    currentQuestion: translateLiveCoachText(snapshot.currentQuestion),
    target: translateLiveCoachText(snapshot.target),
    focus: translateLiveCoachText(snapshot.focus),
    pressureReason: translateLiveCoachText(snapshot.pressureReason),
    risk: translateLiveCoachText(snapshot.risk),
    suggestedMove: translateLiveCoachText(snapshot.suggestedMove),
    missingSignals: Array.isArray(snapshot.missingSignals)
      ? snapshot.missingSignals.map(translateLiveCoachText)
      : snapshot.missingSignals
  };
}

function translateLiveCoachText(value) {
  const text = String(value || '').trim();
  if (!text) return '';

  const exactTranslations = {
    'New question': '新问题',
    'Interview complete': '面试完成',
    'Ready to move on': '可以进入下一题',
    'Pressure follow-up': '压力追问',
    'Pin-down follow-up': '定点追问',
    'Clarifying follow-up': '澄清追问',
    'The interviewer is checking whether you can turn a project into a credible ownership story instead of a team summary.': '面试官正在判断你能不能把项目讲成可信的个人负责经历，而不是团队流水账。',
    'The interviewer is checking whether you can structure the main path first, then explain key components, bottlenecks, and tradeoffs.': '面试官正在看你能不能先搭出主链路，再讲清核心组件、瓶颈和取舍。',
    'The interviewer is checking whether you can state the approach, key data structure, and complexity before wandering into details.': '面试官正在看你能不能先说清解法、关键数据结构和复杂度，再展开细节。',
    'The interviewer is checking whether you have a real diagnostic sequence, not just concept recall.': '面试官正在看你有没有真实排查顺序，而不是只背概念。',
    'Lead with the conclusion, then add mechanism, scenario, and result.': '先给结论，再补机制、场景和结果。',
    'The first answer decides whether this becomes a normal question or a pressure follow-up.': '第一轮回答会决定这题是正常推进，还是进入压力追问。',
    'If the opening answer stays at “we built this”, the interviewer will immediately push for your own role, decision, and outcome.': '如果开场还停留在“我们做了什么”，面试官会立刻追问你的个人职责、关键判断和最终结果。',
    'Answer in this order: background -> your scope -> key action -> result.': '按这个顺序回答：背景、你的职责范围、关键动作、结果。',
    'Answer in this order: main path -> components -> traffic/risk -> tradeoff.': '按这个顺序回答：主链路、核心组件、流量或风险、取舍。',
    'Answer in this order: solution -> data structure -> complexity -> edge cases.': '按这个顺序回答：解法、数据结构、复杂度、边界情况。',
    'Keep answer density': '保持回答密度',
    'Prepare next question': '准备进入下一题',
    'personal ownership': '个人职责',
    tradeoff: '取舍判断',
    'real scene': '真实场景',
    'result evidence': '结果证据',
    'diagnostic order': '排查顺序'
  };

  if (exactTranslations[text]) return exactTranslations[text];

  const landMatch = text.match(/^Land these first: (.+)\.$/);
  if (landMatch) {
    return `先把这些关键点讲出来：${landMatch[1].replaceAll(' / ', '、')}。`;
  }

  const levelMatch = text.match(/^At (.+) level, the interviewer is checking whether your first answer already covers the core idea plus supporting detail\.$/);
  if (levelMatch) {
    return `按照${levelMatch[1].replaceAll(' / ', ' / ')}的要求，面试官会看你的首轮回答是否已经覆盖核心思路和支撑细节。`;
  }

  const weakMatch = text.match(/^At this level, weak first-pass answers quickly trigger follow-ups around (.+)\.$/);
  if (weakMatch) {
    return `这个级别下，首轮回答偏虚时，面试官很快会围绕${weakMatch[1]}继续追问。`;
  }

  return text
    .replaceAll(' / ', '、')
    .replaceAll(' -> ', '、');
}

function savePracticeHistory(report) {
  if (!report?.overview) return;

  const overview = report.overview;
  const previousRecords = loadPracticeHistory();
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    role: overview.role || '未设置方向',
    level: overview.level || '未设置级别',
    style: overview.style || '未设置风格',
    score: Number.isFinite(Number(overview.score)) ? Number(overview.score) : null,
    answeredQuestions: overview.answeredQuestions || 0,
    totalQuestions: overview.totalQuestions || 0,
    readiness: overview.readiness || '',
    hireSignal: overview.hireSignal?.label || '',
    weakAreas: Array.isArray(report.weakAreas) ? report.weakAreas.slice(0, 5) : [],
    dimensionAverages: calculateAverageDimensionScores(report.questions),
    questions: Array.isArray(report.questions)
      ? report.questions.slice(0, 8).map((item) => ({
        questionId: item.questionId || '',
        question: item.question || '',
        category: item.category || '',
        skill: item.skill || item.category || '',
        type: item.type || '',
        codeKind: item.codeKind || '',
        planReason: item.planReason || '',
        questionDrillTarget: item.questionDrillTarget || null,
        score: Number.isFinite(Number(item.score)) ? Number(item.score) : null,
        followUpCount: item.followUpCount || 0,
        userAnswerSummary: item.userAnswerSummary || '',
        expectedPoints: Array.isArray(item.expectedPoints) ? item.expectedPoints : [],
        expectedPointCoverage: Array.isArray(item.expectedPointCoverage) ? item.expectedPointCoverage : [],
        referenceAnswer: item.referenceAnswer || '',
        commonMistakes: Array.isArray(item.commonMistakes) ? item.commonMistakes : [],
        dimensionScores: Array.isArray(item.dimensionScores) ? item.dimensionScores : [],
        codeReviewModeSuggestion: createStoredCodeReviewModeSuggestion(item)
      }))
      : [],
    uncoveredQuestions: Array.isArray(report.uncoveredQuestions)
      ? report.uncoveredQuestions.slice(0, 5).map((item) => ({
        questionId: item.id || '',
        question: item.question || '',
        category: item.category || '',
        type: item.type || '',
        codeKind: item.codeKind || '',
        planReason: item.planReason || '',
        preparationHint: item.preparationHint || '',
        risk: item.risk || ''
      }))
      : [],
    nextPractice: Array.isArray(report.nextPractice)
      ? report.nextPractice.slice(0, 2).map((item) => item.title || item.goal || item.action).filter(Boolean)
      : []
  };
  record.nextSessionRecommendation = createStoredNextSessionRecommendation(
    createNextSessionRecommendation(record, [record, ...previousRecords])
  );
  const records = [record, ...previousRecords].slice(0, PRACTICE_HISTORY_LIMIT);

  try {
    localStorage.setItem(PRACTICE_HISTORY_KEY, JSON.stringify(records));
  } catch {
    // 浏览器隐私模式或存储空间不足时，不影响本次面试报告展示。
  }
}

function loadPracticeHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PRACTICE_HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function renderPracticeHistory() {
  if (!practiceHistoryEl) return;

  const records = loadPracticeHistory();
  if (!records.length) {
    practiceHistoryEl.className = 'practice-history empty-history';
    practiceHistoryEl.innerHTML = '<p>完成第一轮面试后，这里会记录练习次数、平均分和薄弱点。</p>';
    return;
  }

  const scoredRecords = records.filter((item) => Number.isFinite(Number(item.score)));
  const averageScore = scoredRecords.length
    ? Math.round(scoredRecords.reduce((sum, item) => sum + Number(item.score), 0) / scoredRecords.length)
    : '-';
  const latest = records[0];
  const weakAreaCounts = records.flatMap((item) => item.weakAreas || [])
    .reduce((map, area) => map.set(area, (map.get(area) || 0) + 1), new Map());
  const topWeakAreas = [...weakAreaCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([area, count]) => `<span class="pill amber">${escapeHtml(`${area} x${count}`)}</span>`)
    .join('');
  const recentRecords = records.slice(0, 3).map(renderHistoryRecord).join('');
  const weakSkillHtml = renderHistoryWeakSkills(records);
  const weakQuestionsHtml = renderHistoryWeakQuestions(records);
  const unfinishedTargetsHtml = renderHistoryUnfinishedTargets(records);
  const questionDrillProgressHtml = renderHistoryQuestionDrillProgress(records);
  const dimensionTrendHtml = renderHistoryDimensionTrend(records);
  const frequentFollowUpsHtml = renderFrequentFollowUps(records);
  const nextSessionHtml = renderNextSessionRecommendation(records);
  const missedPointsHtml = renderHistoryMissedPoints(records);
  const commonMistakesHtml = renderHistoryCommonMistakes(records);
  const codeModeSuggestionsHtml = renderHistoryCodeModeSuggestions(records);

  practiceHistoryEl.className = 'practice-history';
  practiceHistoryEl.innerHTML = `
    <div class="history-header">
      <div>
        <strong>训练仪表盘</strong>
        <span>${escapeHtml(`最近 ${records.length} 场，最多保留 ${PRACTICE_HISTORY_LIMIT} 场`)}</span>
      </div>
      <button type="button" class="mini-button subtle-button" data-clear-history>清空历史</button>
    </div>
    <div class="history-stats">
      <div>
        <span>累计练习</span>
        <strong>${records.length}</strong>
      </div>
      <div>
        <span>平均分</span>
        <strong>${averageScore}</strong>
      </div>
      <div>
        <span>最近一次</span>
        <strong>${escapeHtml(latest.score ?? '-')}</strong>
      </div>
    </div>
    <div class="section-label">高频薄弱点</div>
    <div class="meta-row">${topWeakAreas || '<span class="pill green">暂无重复薄弱点</span>'}</div>
    <div class="section-label">最弱技能点</div>
    ${weakSkillHtml}
    <div class="section-label">高频薄弱题目</div>
    ${weakQuestionsHtml}
    <div class="section-label">未完成训练目标</div>
    ${unfinishedTargetsHtml}
    <div class="section-label">专项重练完成情况</div>
    ${questionDrillProgressHtml}
    <div class="section-label">推荐下一场面试</div>
    ${nextSessionHtml}
    <div class="section-label">能力趋势</div>
    ${dimensionTrendHtml}
    <div class="section-label">最常被追问的问题</div>
    ${frequentFollowUpsHtml}
    <div class="section-label">高频未覆盖要点</div>
    ${missedPointsHtml}
    <div class="section-label">高频扣分点</div>
    ${commonMistakesHtml}
    <div class="section-label">代码题作答模式建议</div>
    ${codeModeSuggestionsHtml}
    <div class="section-label">最近记录</div>
    <div class="history-list">${recentRecords}</div>
    <p>${escapeHtml(latest.nextPractice?.[0] ? `下一步：${latest.nextPractice[0]}` : '继续完成几轮面试后，会形成更稳定的提升趋势。')}</p>
  `;
}

function clearPracticeHistory() {
  const confirmed = window.confirm('确定清空本地历史记录吗？当前面试不会受影响。');
  if (!confirmed) return;

  localStorage.removeItem(PRACTICE_HISTORY_KEY);
  renderPracticeHistory();
  statusText.textContent = '本地历史记录已清空，可以重新开始积累训练数据。';
}

function deleteHistoryRecord(recordId) {
  if (!recordId) return;
  const confirmed = window.confirm('确定删除这条历史记录吗？当前面试不会受影响。');
  if (!confirmed) return;

  const records = loadPracticeHistory().filter((item) => item.id !== recordId);
  localStorage.setItem(PRACTICE_HISTORY_KEY, JSON.stringify(records));
  renderPracticeHistory();
  statusText.textContent = '这条历史记录已删除，Dashboard 已重新计算。';
}

function renderHistoryRecord(record) {
  return `
    <details class="history-item history-record">
      <summary>
        <div>
          <strong>${escapeHtml(record.role || '未设置方向')}</strong>
          <span>${escapeHtml(`${record.level || '未设置级别'} · ${formatDateTime(record.createdAt)}`)}</span>
          <small>${escapeHtml(createHistoryRecommendationSummary(record))}</small>
        </div>
        <b>${escapeHtml(record.score ?? '-')}</b>
      </summary>
      <div class="history-record-body">
        <div class="section-label">本轮题目回看</div>
        ${renderHistoryRecordQuestions(record.questions)}
        <div class="section-label">本轮薄弱点</div>
        <div class="meta-row">${renderPills(record.weakAreas || [], '暂无明显薄弱点')}</div>
        <div class="section-label">当时推荐</div>
        <p>${escapeHtml(createHistoryRecommendationSummary(record))}</p>
        <div class="history-record-actions">
          <button type="button" class="mini-button" data-apply-history-record="${escapeHtml(record.id || '')}">重练这轮薄弱题</button>
          <button type="button" class="mini-button subtle-button" data-delete-history-record="${escapeHtml(record.id || '')}">删除这条记录</button>
        </div>
      </div>
    </details>
  `;
}

function renderHistoryRecordQuestions(questions) {
  const items = Array.isArray(questions) ? questions.slice(0, 5) : [];
  if (!items.length) {
    return '<p>这轮暂未保存逐题记录。</p>';
  }

  return `
    <div class="history-record-questions">
      ${items.map((question, index) => `
        <article class="history-record-question">
          <div class="meta-row">
            <span class="pill">${escapeHtml(`${index + 1}. ${question.skill || question.category || '综合能力'}`)}</span>
            <span class="${getDimensionScoreClass(question.score)}">${escapeHtml(`得分 ${question.score ?? '-'}`)}</span>
            <span class="pill amber">${escapeHtml(`追问 ${question.followUpCount || 0}`)}</span>
          </div>
          <p>${escapeHtml(question.question || '暂无题目')}</p>
          <small>${escapeHtml(question.planReason ? `安排原因：${question.planReason}` : '安排原因：按本轮训练节奏安排。')}</small>
          ${renderQuestionDrillTarget(question.questionDrillTarget)}
        </article>
      `).join('')}
    </div>
  `;
}

function calculateAverageDimensionScores(questions) {
  if (!Array.isArray(questions) || !questions.length) return [];

  const totals = new Map();
  for (const question of questions) {
    for (const item of question.dimensionScores || []) {
      if (!item?.label || !Number.isFinite(Number(item.score))) continue;
      const current = totals.get(item.label) || { label: item.label, total: 0, count: 0 };
      current.total += Number(item.score);
      current.count += 1;
      totals.set(item.label, current);
    }
  }

  return [...totals.values()].map((item) => ({
    label: item.label,
    score: Math.round(item.total / item.count)
  }));
}

function renderHistoryDimensionTrend(records) {
  const latestWithDimensions = records.find((record) => Array.isArray(record.dimensionAverages) && record.dimensionAverages.length);
  if (!latestWithDimensions) {
    return '<p>完成带四维评分的面试后，会显示技术准确性、完整度、表达结构和技术深度趋势。</p>';
  }

  const previousRecords = records
    .filter((record) => record !== latestWithDimensions && Array.isArray(record.dimensionAverages) && record.dimensionAverages.length)
    .slice(0, 5);
  const previousAverageByLabel = new Map();

  for (const record of previousRecords) {
    for (const item of record.dimensionAverages || []) {
      if (!item?.label || !Number.isFinite(Number(item.score))) continue;
      const current = previousAverageByLabel.get(item.label) || { total: 0, count: 0 };
      current.total += Number(item.score);
      current.count += 1;
      previousAverageByLabel.set(item.label, current);
    }
  }

  return `
    <div class="history-dimensions">
      ${latestWithDimensions.dimensionAverages.map((item) => {
        const previous = previousAverageByLabel.get(item.label);
        const previousAverage = previous ? Math.round(previous.total / previous.count) : null;
        const delta = previousAverage === null ? null : Number(item.score) - previousAverage;
        const deltaText = delta === null ? '新指标' : `${delta >= 0 ? '+' : ''}${delta}`;
        return `
          <article class="history-dimension">
            <div class="dimension-head">
              <strong>${escapeHtml(item.label)}</strong>
              <span class="${getDimensionScoreClass(item.score)}">${escapeHtml(item.score)}</span>
            </div>
            <div class="dimension-bar" aria-hidden="true">
              <i style="width: ${escapeHtml(clampPercent(item.score))}%"></i>
            </div>
            <p>${escapeHtml(`相对前几场：${deltaText}`)}</p>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderHistoryWeakSkills(records) {
  const weakSkills = calculateWeakSkills(records).slice(0, 4);

  if (!weakSkills.length) {
    return '<p>完成带技能点的面试后，这里会显示平均分最低的技能方向。</p>';
  }

  return `
    <div class="history-skills">
      ${weakSkills.map((item) => `
        <article class="history-skill">
          <div class="dimension-head">
            <strong>${escapeHtml(item.skill)}</strong>
            <span class="${getDimensionScoreClass(item.averageScore)}">${escapeHtml(item.averageScore)}</span>
          </div>
          <div class="dimension-bar" aria-hidden="true">
            <i style="width: ${escapeHtml(clampPercent(item.averageScore))}%"></i>
          </div>
          <p>${escapeHtml(`练过 ${item.count} 题，最低分 ${item.minScore}，累计追问 ${item.followUps} 次`)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function calculateWeakSkills(records) {
  const grouped = records
    .flatMap((record) => record.questions || [])
    .filter((question) => question.skill || question.category)
    .reduce((map, question) => {
      const skill = question.skill || question.category || '综合能力';
      const score = Number.isFinite(Number(question.score)) ? Number(question.score) : null;
      const current = map.get(skill) || {
        skill,
        count: 0,
        total: 0,
        scoredCount: 0,
        minScore: 100,
        followUps: 0
      };
      current.count += 1;
      current.followUps += question.followUpCount || 0;
      if (score !== null) {
        current.total += score;
        current.scoredCount += 1;
        current.minScore = Math.min(current.minScore, score);
      }
      map.set(skill, current);
      return map;
    }, new Map());

  return [...grouped.values()]
    .filter((item) => item.scoredCount > 0)
    .map((item) => ({
      ...item,
      averageScore: Math.round(item.total / item.scoredCount)
    }))
    .sort((left, right) => left.averageScore - right.averageScore || right.followUps - left.followUps);
}

function renderHistoryWeakQuestions(records) {
  const weakQuestions = calculateWeakQuestions(records).slice(0, 3);

  if (!weakQuestions.length) {
    return '<p>完成几轮带评分的面试后，这里会显示反复低分或经常被追问的具体题目。</p>';
  }

  return `
    <div class="history-list">
      ${weakQuestions.map((item) => `
        <article class="history-weak-question">
          <div class="meta-row">
            <span class="${getDimensionScoreClass(item.averageScore)}">${escapeHtml(`均分 ${item.averageScore}`)}</span>
            <span class="pill amber">${escapeHtml(`最低 ${item.minScore}`)}</span>
            <span class="pill">${escapeHtml(item.skill || item.category)}</span>
          </div>
          <p>${escapeHtml(item.question)}</p>
          <small>${escapeHtml(`出现 ${item.count} 次，累计追问 ${item.followUps} 次`)}</small>
        </article>
      `).join('')}
    </div>
  `;
}

function calculateWeakQuestions(records) {
  const grouped = records
    .flatMap((record) => record.questions || [])
    .filter((question) => Number.isFinite(Number(question.score)))
    .reduce((map, question) => {
      const key = question.questionId || question.question || `${question.category || '未分类'}-${question.skill || ''}`;
      const score = Number(question.score);
      const current = map.get(key) || {
        question: question.question || '未知题目',
        category: question.category || '未分类',
        skill: question.skill || question.category || '综合能力',
        count: 0,
        total: 0,
        minScore: score,
        followUps: 0
      };
      current.count += 1;
      current.total += score;
      current.minScore = Math.min(current.minScore, score);
      current.followUps += question.followUpCount || 0;
      map.set(key, current);
      return map;
    }, new Map());

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      averageScore: Math.round(item.total / item.count)
    }))
    .filter((item) => item.averageScore < 75 || item.followUps >= 2)
    .sort((left, right) => left.averageScore - right.averageScore || right.followUps - left.followUps);
}

function renderHistoryUnfinishedTargets(records) {
  const targets = calculateUnfinishedTargets(records).slice(0, 3);

  if (!targets.length) {
    return '<p>当前没有累计未完成训练目标；继续保持完整答完每轮计划题。</p>';
  }

  return `
    <div class="history-list">
      ${targets.map((item) => `
        <article class="history-unfinished-target">
          <div class="meta-row">
            <span class="pill amber">${escapeHtml(`${item.count} 次未完成`)}</span>
            <span class="pill">${escapeHtml(item.category || '计划题')}</span>
          </div>
          <p>${escapeHtml(item.question || '暂无题目')}</p>
          <small>${escapeHtml(item.planReason ? `安排原因：${item.planReason}` : '安排原因：按本轮训练节奏安排。')}</small>
          <small>${escapeHtml(item.preparationHint ? `补练提示：${item.preparationHint}` : '补练提示：先按 90 秒结构化回答补齐。')}</small>
          <button type="button" class="mini-button" data-apply-unfinished-target="${escapeHtml(item.key)}">补练这个目标</button>
        </article>
      `).join('')}
    </div>
  `;
}

function calculateUnfinishedTargets(records) {
  const grouped = records
    .flatMap((record) => record.uncoveredQuestions || [])
    .filter((item) => item?.question || item?.category)
    .reduce((map, item) => {
      const key = item.questionId || item.question || `${item.category || '未分类'}-${item.planReason || ''}`;
      const current = map.get(key) || {
        key,
        question: item.question || '暂无题目',
        category: item.category || '未分类',
        type: item.type || '',
        codeKind: item.codeKind || '',
        planReason: item.planReason || '',
        preparationHint: item.preparationHint || '',
        risk: item.risk || '',
        count: 0
      };
      current.count += 1;
      map.set(key, current);
      return map;
    }, new Map());

  return [...grouped.values()]
    .sort((left, right) => right.count - left.count || String(left.category).localeCompare(String(right.category), 'zh-Hans-CN'));
}

function renderHistoryQuestionDrillProgress(records) {
  const targets = calculateQuestionDrillProgress(records).slice(0, 3);

  if (!targets.length) {
    return '<p>完成从单题报告发起的专项重练后，这里会显示目标是否再次作答、分数是否提升。</p>';
  }

  return `
    <div class="history-list">
      ${targets.map((item) => `
        <article class="history-question-drill">
          <div class="meta-row">
            <span class="pill ${item.passed ? 'green' : 'amber'}">${escapeHtml(item.passed ? '已达标' : '继续补练')}</span>
            <span class="${getDimensionScoreClass(item.latestScore)}">${escapeHtml(`最近 ${item.latestScore ?? '-'}`)}</span>
            <span class="pill">${escapeHtml(`重练 ${item.count} 次`)}</span>
          </div>
          <strong>${escapeHtml(item.target || '本题薄弱点')}</strong>
          <p>${escapeHtml(item.reminder || '继续围绕该目标重答并接受同类追问。')}</p>
          <p>${escapeHtml(item.passStandard)}</p>
          <p>${escapeHtml(item.weakestDimensionText)}</p>
          <small>${escapeHtml(`最高分 ${item.bestScore ?? '-'}，最近题目：${item.latestQuestion || '暂无题目'}`)}</small>
          ${item.passed ? '' : `<button type="button" class="mini-button" data-apply-question-drill="${escapeHtml(item.key)}">继续补练这个目标</button>`}
        </article>
      `).join('')}
    </div>
  `;
}

function calculateQuestionDrillProgress(records) {
  const grouped = records
    .flatMap((record) => {
      return (record.questions || []).map((question) => ({
        ...question,
        recordTime: record.createdAt || ''
      }));
    })
    .filter((question) => question.questionDrillTarget?.source)
    .reduce((map, question) => {
      const target = question.questionDrillTarget || {};
      const key = `${target.source || '单题报告重练'}-${target.target || question.skill || question.category || '本题薄弱点'}-${target.missedPoint || ''}`;
      const score = Number.isFinite(Number(question.score)) ? Number(question.score) : null;
      const current = map.get(key) || {
        key,
        source: target.source || '单题报告重练',
        target: target.target || question.skill || question.category || '本题薄弱点',
        missedPoint: target.missedPoint || '',
        reminder: target.reminder || '',
        count: 0,
        bestScore: score,
        latestScore: score,
        latestQuestion: question.question || '',
        latestTime: question.recordTime || '',
        latestDimensionScores: [],
        dimensionTotals: new Map()
      };
      current.count += 1;
      collectQuestionDrillDimensionScores(current, question.dimensionScores);
      if (score !== null) {
        current.bestScore = current.bestScore === null ? score : Math.max(current.bestScore, score);
        if (!current.latestTime || String(question.recordTime || '') >= String(current.latestTime)) {
          current.latestScore = score;
          current.latestQuestion = question.question || current.latestQuestion;
          current.latestTime = question.recordTime || current.latestTime;
          current.latestDimensionScores = normalizeQuestionDrillDimensionScores(question.dimensionScores);
        }
      }
      map.set(key, current);
      return map;
    }, new Map());

  return [...grouped.values()]
    .map((item) => ({
      ...item,
      passed: Number.isFinite(Number(item.bestScore)) && Number(item.bestScore) >= 75,
      passStandard: createQuestionDrillPassStandard(item),
      weakestDimension: findQuestionDrillWeakestDimension(item),
      weakestDimensionText: createQuestionDrillWeakestDimensionText(item)
    }))
    .sort((left, right) => Number(left.passed) - Number(right.passed) || (right.latestTime || '').localeCompare(left.latestTime || ''));
}

function collectQuestionDrillDimensionScores(target, dimensionScores) {
  for (const item of normalizeQuestionDrillDimensionScores(dimensionScores)) {
    const current = target.dimensionTotals.get(item.label) || { label: item.label, total: 0, count: 0 };
    current.total += item.score;
    current.count += 1;
    target.dimensionTotals.set(item.label, current);
  }
}

function normalizeQuestionDrillDimensionScores(dimensionScores) {
  return (Array.isArray(dimensionScores) ? dimensionScores : [])
    .filter((item) => item?.label && Number.isFinite(Number(item.score)))
    .map((item) => ({
      label: item.label,
      score: Number(item.score)
    }));
}

function findQuestionDrillWeakestDimension(item) {
  const latestScores = normalizeQuestionDrillDimensionScores(item.latestDimensionScores);
  const sourceScores = latestScores.length
    ? latestScores
    : [...(item.dimensionTotals || new Map()).values()]
      .filter((score) => score.count)
      .map((score) => ({
        label: score.label,
        score: Math.round(score.total / score.count)
      }));

  return sourceScores
    .sort((left, right) => left.score - right.score || String(left.label).localeCompare(String(right.label), 'zh-Hans-CN'))[0] || null;
}

function createQuestionDrillPassStandard(item) {
  const scoreText = Number.isFinite(Number(item.bestScore)) ? `当前最高 ${item.bestScore} 分` : '当前还没有有效得分';
  const nextStep = item.passed ? '可以进入下一轮巩固追问。' : '建议继续补练到 75 分以上。';
  return `达标标准：最高分达到 75 分，表示该薄弱点已能较稳定覆盖核心要点；${scoreText}，${nextStep}`;
}

function createQuestionDrillWeakestDimensionText(item) {
  const weakest = item.weakestDimension || findQuestionDrillWeakestDimension(item);
  if (!weakest) {
    return '当前最弱维度：暂无四维评分，完成一次专项重练后会自动识别。';
  }
  return `当前最弱维度：${weakest.label} ${weakest.score} 分，下次回答优先补齐这一项。`;
}

function renderFrequentFollowUps(records) {
  const followUpQuestions = records
    .flatMap((record) => record.questions || [])
    .filter((question) => (question.followUpCount || 0) > 0);

  if (!followUpQuestions.length) {
    return '<p>暂时还没有形成高频追问记录。</p>';
  }

  const grouped = followUpQuestions.reduce((map, item) => {
    const key = item.question || item.category || '未知问题';
    const current = map.get(key) || {
      question: item.question || '未知问题',
      category: item.category || '未分类',
      count: 0,
      followUps: 0,
      minScore: Number.isFinite(Number(item.score)) ? Number(item.score) : 100
    };
    current.count += 1;
    current.followUps += item.followUpCount || 0;
    if (Number.isFinite(Number(item.score))) {
      current.minScore = Math.min(current.minScore, Number(item.score));
    }
    map.set(key, current);
    return map;
  }, new Map());

  const topItems = [...grouped.values()]
    .sort((left, right) => right.followUps - left.followUps || left.minScore - right.minScore)
    .slice(0, 3);

  return `
    <div class="history-list">
      ${topItems.map((item) => `
        <article class="history-followup">
          <div class="meta-row">
            <span class="pill amber">${escapeHtml(`${item.followUps} 次追问`)}</span>
            <span class="pill">${escapeHtml(item.category)}</span>
          </div>
          <p>${escapeHtml(item.question)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderNextSessionRecommendation(records) {
  const latest = records[0];
  if (!latest) {
    return '<p>完成一轮面试后，会推荐下一场训练配置。</p>';
  }

  const recommendation = latest.nextSessionRecommendation || createNextSessionRecommendation(latest, records);

  return `
    <article class="next-session-card">
      <div>
        <strong>${escapeHtml(`${recommendation.roleLabel} · ${recommendation.levelLabel}`)}</strong>
        <span>${escapeHtml(`${recommendation.styleLabel} · ${recommendation.levelSuggestion}`)}</span>
      </div>
      <p>${escapeHtml(`优先训练：${recommendation.weakArea}`)}</p>
      <p>${escapeHtml(`本轮任务：${recommendation.practiceFocus}`)}</p>
      <p>${escapeHtml(`训练方式：${recommendation.drillPrompt}`)}</p>
      <div class="next-session-stages" aria-label="下一场阶段预览">
        ${recommendation.previewStages.map((stage, index) => `<span>${escapeHtml(`${index + 1}. ${stage}`)}</span>`).join('')}
      </div>
      <button type="button" class="mini-button" data-apply-next-session>应用到左侧配置</button>
    </article>
  `;
}

function createStoredNextSessionRecommendation(recommendation) {
  return {
    roleValue: recommendation.roleValue,
    roleLabel: recommendation.roleLabel,
    levelValue: recommendation.levelValue,
    levelLabel: recommendation.levelLabel,
    styleValue: recommendation.styleValue,
    styleLabel: recommendation.styleLabel,
    questionCount: recommendation.questionCount,
    previewStages: Array.isArray(recommendation.previewStages) ? recommendation.previewStages : [],
    weakArea: recommendation.weakArea,
    practiceFocus: recommendation.practiceFocus,
    drillPrompt: recommendation.drillPrompt,
    levelSuggestion: recommendation.levelSuggestion
  };
}

function createHistoryRecommendationSummary(record) {
  const recommendation = record.nextSessionRecommendation;
  if (recommendation?.weakArea && recommendation?.practiceFocus) {
    return `当时建议：${recommendation.weakArea} · ${recommendation.practiceFocus}`;
  }

  return record.nextPractice?.[0]
    ? `当时建议：${record.nextPractice[0]}`
    : '当时建议：继续完成下一轮训练';
}

function createNextSessionRecommendation(latest, records = loadPracticeHistory()) {
  const score = Number(latest?.score);
  const roleValue = inferRoleValue(latest?.role);
  const levelValue = inferNextLevelValue(latest?.level, score);
  const styleValue = Number.isFinite(score) && score >= 78 ? 'pressure' : 'coaching';
  const levelSuggestion = Number.isFinite(score) && score >= 82
    ? '难度可上调一档'
    : Number.isFinite(score) && score < 68
      ? '先保持当前难度，补基础和表达'
      : '保持当前难度，增加追问强度';
  const uncoveredQuestion = findPriorityUncoveredQuestion(latest);
  const weakestSkill = calculateWeakSkills(records)[0] || null;
  const weakestQuestion = calculateWeakQuestions(records)[0] || null;
  const weakArea = uncoveredQuestion
    ? `补齐未覆盖：${uncoveredQuestion.category || '计划题'}`
    : weakestQuestion?.skill || weakestSkill?.skill || latest?.weakAreas?.[0] || latest?.questions?.find((item) => item.category)?.category || '核心基础题';
  const weakQuestionTitle = summarizeWeakQuestionTitle(weakestQuestion?.question);
  const practiceFocus = (uncoveredQuestion ? createUncoveredPracticeFocus(uncoveredQuestion) : '')
    || (weakestQuestion ? `围绕“${weakQuestionTitle}”重练，先把均分从 ${weakestQuestion.averageScore} 提到 75 分以上，并减少追问次数。` : '')
    || (weakestSkill ? `围绕 ${weakestSkill.skill} 重练最低分题，目标把平均分从 ${weakestSkill.averageScore} 提到 75 分以上。` : '')
    || latest?.nextPractice?.[0]
    || latest?.questions?.find((item) => (item.commonMistakes || []).length)?.commonMistakes?.[0]
    || '先把本轮最低分题按参考答案重答一遍';
  const drillPrompt = uncoveredQuestion
    ? createUncoveredQuestionDrillPrompt(uncoveredQuestion)
    : weakestQuestion
    ? createWeakQuestionDrillPrompt(records, weakestQuestion)
    : createSkillDrillPrompt(records, weakestSkill?.skill || weakArea);

  return {
    roleValue,
    roleLabel: getSelectLabel('role', roleValue) || latest?.role || '当前方向',
    levelValue,
    levelLabel: getSelectLabel('level', levelValue) || latest?.level || '当前级别',
    styleValue,
    styleLabel: getSelectLabel('style', styleValue) || '教练模式',
    questionCount: 5,
    previewStages: createRecommendedSessionStages(uncoveredQuestion || weakestQuestion),
    weakArea,
    practiceFocus,
    drillPrompt,
    levelSuggestion
  };
}

function findPriorityUncoveredQuestion(record) {
  const questions = Array.isArray(record?.uncoveredQuestions) ? record.uncoveredQuestions : [];
  return questions.find((item) => item?.question || item?.category) || null;
}

function createUncoveredPracticeFocus(question) {
  const title = summarizeWeakQuestionTitle(question.question);
  const reason = question.planReason || '这道题原本用于补齐本轮训练路线。';
  return `优先补齐上一轮未覆盖的“${title}”，先完成 90 秒结构化回答；原安排原因：${reason}`;
}

function createUncoveredQuestionDrillPrompt(question) {
  const skill = question.category || '未覆盖计划题';
  const hint = question.preparationHint || '先按结论、原理/方案、边界和取舍组织回答。';
  return `围绕“${skill}”安排基础题和定点追问，先按未覆盖题重答：${hint}`;
}

function createRecommendedSessionStages(weakestQuestion) {
  const hasCodeTrack = weakestQuestion?.type === 'algorithm' || weakestQuestion?.codeKind;
  return createTrainingStagePreview({
    questionCount: 5,
    hasCodeTrack,
    includeScenario: !hasCodeTrack,
    followUpLabel: '定点追问',
    scenarioLabel: '场景/代码题',
    codeLabel: '代码题复盘',
    finalLabel: '复盘报告'
  });
}

function summarizeWeakQuestionTitle(question) {
  const text = String(question || '').replace(/\s+/g, ' ').trim();
  if (!text) return '上一轮最低分题';
  return text.length > 34 ? `${text.slice(0, 34)}...` : text;
}

function createWeakQuestionDrillPrompt(records, weakQuestion) {
  const skill = weakQuestion?.skill || weakQuestion?.category || '核心基础题';
  const relatedQuestions = records
    .flatMap((record) => record.questions || [])
    .filter((question) => {
      const key = question.questionId || question.question || '';
      const weakKey = weakQuestion?.questionId || weakQuestion?.question || '';
      return key && weakKey && key === weakKey;
    });
  const missedPoint = relatedQuestions
    .flatMap((question) => question.expectedPointCoverage || [])
    .find((item) => item && item.covered === false && item.point)?.point;
  const commonMistake = relatedQuestions
    .flatMap((question) => question.commonMistakes || [])
    .find(Boolean);

  if (missedPoint) {
    return `围绕“${skill}”安排同类题，必须先补齐“${missedPoint}”，再用追问检查边界、取舍和项目化表达。`;
  }

  if (commonMistake) {
    return `围绕“${skill}”安排同类题，重点避免“${commonMistake}”，并要求每次回答给出原因和边界。`;
  }

  return `围绕“${skill}”安排同类题，要求先重答上一轮薄弱题，再进入追问和场景题。`;
}

function createReportQuestionDrillPrompt(question) {
  const skill = question?.skill || question?.category || '本题薄弱点';
  const missedPoint = findFirstMissedExpectedPoint(question);
  const commonMistake = Array.isArray(question?.commonMistakes) ? question.commonMistakes.find(Boolean) : '';

  if (missedPoint && commonMistake) {
    return `围绕“${skill}”重练本题，必须补齐“${missedPoint}”，并避免“${commonMistake}”。`;
  }

  if (missedPoint) {
    return `围绕“${skill}”重练本题，先把“${missedPoint}”主动讲出来，再接受定点追问。`;
  }

  if (commonMistake) {
    return `围绕“${skill}”安排同类题，重点避免“${commonMistake}”，并补充原因、边界和取舍。`;
  }

  return `围绕“${skill}”安排同类题，先按结论、机制、场景、边界和取舍重答本题。`;
}

function findFirstMissedExpectedPoint(question) {
  return (Array.isArray(question?.expectedPointCoverage) ? question.expectedPointCoverage : [])
    .find((item) => item && item.covered === false && item.point)?.point || '';
}

function createSkillDrillPrompt(records, skill) {
  const relatedQuestions = records
    .flatMap((record) => record.questions || [])
    .filter((question) => {
      const currentSkill = question.skill || question.category || '';
      return !skill || currentSkill === skill || question.category === skill;
    });
  const missedPoint = relatedQuestions
    .flatMap((question) => question.expectedPointCoverage || [])
    .find((item) => item && item.covered === false && item.point)?.point;
  const commonMistake = relatedQuestions
    .flatMap((question) => question.commonMistakes || [])
    .find(Boolean);

  if (missedPoint && commonMistake) {
    return `围绕“${skill}”连续追问，必须补齐“${missedPoint}”，并避免“${commonMistake}”。`;
  }

  if (missedPoint) {
    return `围绕“${skill}”安排基础题和追问，重点检查是否能主动讲出“${missedPoint}”。`;
  }

  if (commonMistake) {
    return `围绕“${skill}”安排相似题，重点避免“${commonMistake}”。`;
  }

  return `围绕“${skill || '核心基础题'}”安排基础题、追问和场景题，要求回答先讲结论，再补原理、边界和取舍。`;
}

function applyNextSessionRecommendation() {
  const records = loadPracticeHistory();
  const latest = records[0];
  if (!latest) return;

  const recommendation = latest.nextSessionRecommendation || createNextSessionRecommendation(latest, records);
  applyRecommendationToSetup(recommendation, [
    `下一轮训练重点：${recommendation.weakArea}`,
    `本轮任务：${recommendation.practiceFocus}`,
    `技能训练要求：${recommendation.drillPrompt}`,
    '请优先安排基础八股题、追问、项目题和场景/代码题，重点检查上一轮暴露的问题。'
  ], '已把推荐下一场面试应用到左侧配置，可以直接开始新一轮练习。');
}

function applyHistoryRecordDrill(recordId) {
  const records = loadPracticeHistory();
  const record = records.find((item) => item.id === recordId);
  if (!record) return;

  const relatedRecords = [record, ...records.filter((item) => item.id !== record.id)];
  const recommendation = record.nextSessionRecommendation || createNextSessionRecommendation(record, relatedRecords);
  const weakestQuestion = findLowestScoreQuestion(record.questions);
  const questionLine = weakestQuestion?.question
    ? `上一轮最低分题：${weakestQuestion.question}`
    : '上一轮最低分题：暂无逐题记录';
  const scoreLine = weakestQuestion
    ? `最低分题信息：${weakestQuestion.skill || weakestQuestion.category || '综合能力'}，得分 ${weakestQuestion.score ?? '-'}，追问 ${weakestQuestion.followUpCount || 0} 次`
    : '最低分题信息：请围绕当时薄弱点安排同类题。';

  applyRecommendationToSetup(recommendation, [
    `重练历史记录：${formatDateTime(record.createdAt)}`,
    questionLine,
    scoreLine,
    `当时建议：${recommendation.practiceFocus}`,
    `技能训练要求：${recommendation.drillPrompt}`,
    '请优先安排同类基础题、定点追问、项目题和场景/代码题，重点重练这轮薄弱题。'
  ], '已把这轮历史记录的薄弱题写入左侧配置，可以开始针对性重练。');
}

function applyUnfinishedTargetDrill(targetKey) {
  const records = loadPracticeHistory();
  const target = calculateUnfinishedTargets(records).find((item) => item.key === targetKey);
  const latest = records[0];
  if (!target || !latest) return;

  const recommendation = createNextSessionRecommendation({
    ...latest,
    uncoveredQuestions: [target]
  }, records);

  applyRecommendationToSetup(recommendation, [
    `未完成训练目标：${target.category || '计划题'}`,
    `原计划题：${target.question || '暂无题目'}`,
    `安排原因：${target.planReason || '按本轮训练节奏安排。'}`,
    `补练提示：${target.preparationHint || '先按 90 秒结构化回答补齐。'}`,
    `风险提醒：${target.risk || '如果后半段遇到同类题，容易暴露准备空白。'}`,
    '请优先安排同类基础题、定点追问、项目题和场景/代码题，先补齐这个未完成目标。'
  ], '已把未完成训练目标写入左侧配置，可以开始补练这一块。');
}

function applyQuestionDrillProgressDrill(targetKey) {
  const records = loadPracticeHistory();
  const target = calculateQuestionDrillProgress(records).find((item) => item.key === targetKey);
  const latest = records[0];
  if (!target || !latest) return;

  const recommendation = {
    ...createNextSessionRecommendation(latest, records),
    weakArea: `${target.target || '本题薄弱点'} · 专项重练`,
    practiceFocus: `继续补练“${target.target || '本题薄弱点'}”，目标把最高分从 ${target.bestScore ?? '-'} 提到 75 分以上。`,
    drillPrompt: target.missedPoint
      ? `围绕单题专项安排同类基础题和定点追问，必须主动补齐“${target.missedPoint}”。`
      : '围绕单题专项安排同类基础题和定点追问，先按结论、机制、边界和取舍重答。',
    previewStages: createTrainingStagePreview({
      questionCount: 5,
      hasCodeTrack: false,
      includeScenario: true,
      followUpLabel: '定点追问',
      scenarioLabel: '项目化表达',
      codeLabel: '同类代码题',
      finalLabel: '本题复盘'
    })
  };

  applyRecommendationToSetup(recommendation, [
    `报告单题重练：${target.target || '本题薄弱点'}`,
    `原题：${target.latestQuestion || '暂无题目'}`,
    target.missedPoint ? `优先补齐要点：${target.missedPoint}` : '优先补齐要点：按结论、机制、边界和取舍重答。',
    `专项重练记录：已重练 ${target.count} 次，最高分 ${target.bestScore ?? '-'}，最近分 ${target.latestScore ?? '-'}`,
    `下一轮追问方向：${target.reminder || '继续围绕该目标重答并接受同类追问。'}`,
    '请优先安排同类基础题、定点追问、项目化表达和本题复盘，直到该目标达到 75 分以上。'
  ], '已把专项重练目标写入左侧配置，可以继续补练这个目标。');
}

function applyCodeModeSuggestionDrill(modeKey) {
  const records = loadPracticeHistory();
  const target = calculateCodeModeSuggestions(records).find((item) => item.key === modeKey);
  const latest = records[0];
  if (!target || !latest) return false;

  const practiceKeywords = getCodeKindPracticeKeywords(target.codeKind);
  const recommendation = {
    ...createNextSessionRecommendation(latest, records),
    weakArea: `${getCodeKindLabel(target.codeKind)}代码题`,
    practiceFocus: `围绕代码题作答模式「${target.label}」补练，结合${practiceKeywords}，先把上一轮暴露的表达缺口补成稳定模板。`,
    drillPrompt: `下一轮遇到${getCodeKindLabel(target.codeKind)}代码题时，优先切到「${target.label}」模式；重点覆盖${practiceKeywords}；${target.reason}`,
    previewStages: createTrainingStagePreview({
      questionCount: 5,
      hasCodeTrack: true,
      includeScenario: false,
      followUpLabel: '代码追问',
      scenarioLabel: '场景题',
      codeLabel: '代码题复盘',
      finalLabel: '复盘报告'
    })
  };

  applyRecommendationToSetup(recommendation, [
    `代码题补练模式：${target.label}`,
    `代码题类型：${getCodeKindLabel(target.codeKind)}`,
    `补练关键词：${practiceKeywords}`,
    `模式原因：${target.reason}`,
    target.lowestScore === null ? '历史得分：暂无' : `历史最低代码题得分：${target.lowestScore}`,
    '请优先安排轻量代码题，要求回答时先选对作答模式，再补思路、伪代码/代码、边界和复杂度。'
  ], '已把代码题作答模式建议写入左侧配置，可以开始按这个模式补练。');
  return true;
}

function applyReportQuestionDrill(questionIndex) {
  const index = Number(questionIndex);
  const question = Array.isArray(latestReport?.questions) ? latestReport.questions[index] : null;
  if (!question) return false;

  const recommendationRecord = createRecommendationRecordFromReport(latestReport);
  if (!recommendationRecord) return false;

  const questionRecord = {
    ...recommendationRecord,
    weakAreas: [question.skill || question.category || '本题薄弱点', ...(recommendationRecord.weakAreas || [])].filter(Boolean),
    questions: [{
      questionId: question.questionId || '',
      question: question.question || '',
      category: question.category || '',
      skill: question.skill || question.category || '',
      type: question.type || '',
      codeKind: question.codeKind || '',
      planReason: question.planReason || '',
      score: Number.isFinite(Number(question.score)) ? Number(question.score) : null,
      followUpCount: question.followUpCount || 0,
      expectedPointCoverage: Array.isArray(question.expectedPointCoverage) ? question.expectedPointCoverage : [],
      commonMistakes: Array.isArray(question.commonMistakes) ? question.commonMistakes : []
    }]
  };
  const missedPoint = findFirstMissedExpectedPoint(question);
  const commonMistake = Array.isArray(question.commonMistakes) ? question.commonMistakes.find(Boolean) : '';
  const questionTitle = summarizeWeakQuestionTitle(question.question);
  const skill = question.skill || question.category || '本题薄弱点';
  const recommendation = {
    ...createNextSessionRecommendation(questionRecord, [questionRecord, ...loadPracticeHistory()]),
    weakArea: `${skill} · 本题重练`,
    practiceFocus: `围绕“${questionTitle}”重练，先补齐本题差距，再进入同类追问。`,
    drillPrompt: createReportQuestionDrillPrompt(question),
    previewStages: createRecommendedSessionStages(questionRecord.questions[0])
  };

  applyRecommendationToSetup(recommendation, [
    `报告单题重练：${skill}`,
    `原题：${question.question || '暂无题目'}`,
    `本题安排原因：${question.planReason || '按本轮训练节奏安排。'}`,
    missedPoint ? `优先补齐要点：${missedPoint}` : '优先补齐要点：先按结论、机制、场景、边界组织回答。',
    commonMistake ? `避免扣分点：${commonMistake}` : '避免扣分点：不要只背概念，要补充原因、边界和取舍。',
    question.nextFollowUp ? `下一轮追问方向：${question.nextFollowUp}` : '下一轮追问方向：围绕本题同类知识点做定点追问。',
    '请优先安排同类基础题、定点追问、项目/场景题，目标是把这道题重答到可通过水平。'
  ], '已把本题薄弱点写入左侧配置，可以开始单题专项重练。');
  return true;
}

function applyRecommendationToSetup(recommendation, resumeLines, statusMessage) {
  resetSessionForNewSetup();
  setSelectValue('role', recommendation.roleValue);
  setSelectValue('level', recommendation.levelValue);
  setSelectValue('style', recommendation.styleValue);
  const questionCountInput = setupForm.querySelector('input[name="questionCount"]');
  if (questionCountInput) questionCountInput.value = String(recommendation.questionCount);
  resumeInput.value = resumeLines.join('\n');
  renderStyleHint(styleSelect.value);
  renderProfileAnalysis(resumeInput.value);
  renderPlanPreview();
  statusText.textContent = statusMessage;
  setWorkflowStep('setup');
  setupForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function applyReportRoutePlan(routeIndex) {
  const index = Number(routeIndex);
  const record = createRecommendationRecordFromReport(latestReport);
  if (!record || !Number.isFinite(index)) return;

  const base = createNextSessionRecommendation(record, [record, ...loadPracticeHistory()]);
  const routes = [
    {
      styleValue: 'normal',
      focus: `${base.weakArea || '核心基础'}专项突破`,
      prompt: base.drillPrompt || '先把最低分题按参考答案重答，再接受同类追问。'
    },
    {
      styleValue: 'pressure',
      focus: '项目架构深挖与抗压追问',
      prompt: '围绕项目职责、架构取舍、指标结果和线上风险连续追问，要求回答必须落到个人贡献。'
    },
    {
      styleValue: 'coaching',
      focus: '算法与复杂场景设计补齐',
      prompt: '用提示式追问补齐解题思路、伪代码、边界条件、复杂度和方案取舍。'
    }
  ];
  const route = routes[index] || routes[0];
  const recommendation = {
    ...base,
    styleValue: route.styleValue,
    styleLabel: getSelectLabel('style', route.styleValue) || base.styleLabel,
    weakArea: route.focus,
    practiceFocus: route.prompt,
    drillPrompt: route.prompt
  };

  applyRecommendationToSetup(recommendation, [
    `通关路线图：第 ${index + 1} 轮`,
    `训练重点：${route.focus}`,
    `训练方式：${route.prompt}`,
    '请按本轮路线图安排基础题、项目深挖、场景设计和代码/算法表达。'
  ], '已把路线图配置导入左侧，可以直接开启下一轮面试。');
}

function findLowestScoreQuestion(questions) {
  const scoredQuestions = (Array.isArray(questions) ? questions : [])
    .filter((question) => Number.isFinite(Number(question.score)));
  if (!scoredQuestions.length) return null;

  return scoredQuestions
    .slice()
    .sort((left, right) => Number(left.score) - Number(right.score) || (right.followUpCount || 0) - (left.followUpCount || 0))[0];
}

function inferRoleValue(label) {
  const text = String(label || '');
  if (/Java/.test(text)) return 'java';
  if (/前端/.test(text)) return 'frontend';
  if (/全栈/.test(text)) return 'fullstack';
  if (/Go/.test(text)) return 'go';
  if (/Python/.test(text)) return 'python';
  return 'backend';
}

function inferNextLevelValue(label, score) {
  const current = String(label || '');
  if (Number.isFinite(score) && score >= 82) {
    if (/初级/.test(current)) return 'middle';
    if (/中级/.test(current)) return 'senior';
  }
  if (/高级/.test(current)) return 'senior';
  if (/初级/.test(current)) return 'junior';
  return 'middle';
}

function setSelectValue(name, value) {
  const select = setupForm.querySelector(`select[name="${name}"]`);
  if (select && [...select.options].some((option) => option.value === value)) {
    select.value = value;
  }
}

function getSelectLabel(name, value) {
  const select = setupForm.querySelector(`select[name="${name}"]`);
  const option = select ? [...select.options].find((item) => item.value === value) : null;
  return option?.textContent?.trim() || '';
}

function createStoredCodeReviewModeSuggestion(item) {
  if (item?.type !== 'algorithm') return null;

  const suggestion = getCodeReviewModeSuggestion(item.dimensionScores, item.codeKind);
  return {
    label: suggestion.label,
    reason: suggestion.reason,
    codeKind: item.codeKind || '',
    category: item.category || '',
    score: Number.isFinite(Number(item.score)) ? Number(item.score) : null
  };
}

function renderReportCodeModeDrillAction(item) {
  const suggestion = createStoredCodeReviewModeSuggestion(item);
  if (!suggestion?.label) return '';

  const modeKey = createCodeModeSuggestionKey(suggestion);
  const keywords = getCodeKindPracticeKeywords(suggestion.codeKind);

  return `
    <div class="report-code-mode-action">
      <div class="section-label">代码题专项补练</div>
      <p>${escapeHtml(`建议按「${suggestion.label}」模式重练本类题，重点覆盖${keywords}。`)}</p>
      <button type="button" class="mini-button" data-apply-code-mode="${escapeHtml(modeKey)}">按本题模式补练</button>
      <small data-report-code-mode-status>点击后会写入左侧配置和计划预览。</small>
    </div>
  `;
}

function renderReportQuestionDrillAction(item, index) {
  const skill = item?.skill || item?.category || '本题薄弱点';
  const missedPoint = findFirstMissedExpectedPoint(item);
  const focus = missedPoint || item?.gapAnalysis || item?.coachTip || '按本题差距重答一遍，再进入同类追问。';

  return `
    <div class="report-drill-action">
      <div class="section-label">本题薄弱点重练</div>
      <p>${escapeHtml(`围绕「${skill}」重练本题，优先处理：${focus}`)}</p>
      <button type="button" class="mini-button" data-apply-report-question="${escapeHtml(index)}">重练本题薄弱点</button>
      <small data-report-question-drill-status>点击后会写入左侧配置和计划预览。</small>
    </div>
  `;
}

function renderQuestionDrillTarget(target) {
  if (!target?.source) return '';

  return `
    <div class="question-drill-target">
      <span>${escapeHtml(target.source)}</span>
      <strong>${escapeHtml(target.target || '本题薄弱点')}</strong>
      <p>${escapeHtml(target.reminder || (target.missedPoint ? `优先补齐「${target.missedPoint}」。` : '优先验证同类题和定点追问表现。'))}</p>
    </div>
  `;
}

function renderHistoryCommonMistakes(records) {
  const mistakes = records
    .flatMap((record) => record.questions || [])
    .flatMap((question) => question.commonMistakes || [])
    .filter(Boolean)
    .reduce((map, mistake) => map.set(mistake, (map.get(mistake) || 0) + 1), new Map());

  const topMistakes = [...mistakes.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);

  if (!topMistakes.length) {
    return '<p>完成带扣分点的复盘后，这里会显示最常见的失分原因。</p>';
  }

  return `
    <div class="history-list">
      ${topMistakes.map(([mistake, count]) => `
        <article class="history-mistake">
          <span class="pill amber">${escapeHtml(`${count} 次`)}</span>
          <p>${escapeHtml(mistake)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderHistoryCodeModeSuggestions(records) {
  const suggestions = calculateCodeModeSuggestions(records).slice(0, 3);

  if (!suggestions.length) {
    return '<p>完成代码题后，这里会累计建议下次优先使用的作答模式。</p>';
  }

  return `
    <div class="history-list">
      ${suggestions.map((item) => `
        <article class="history-code-mode">
          <div class="meta-row">
            <span class="pill amber">${escapeHtml(`${item.count} 次建议`)}</span>
            <span class="pill">${escapeHtml(item.label)}</span>
            <span class="pill">${escapeHtml(getCodeKindLabel(item.codeKind))}</span>
          </div>
          <p>${escapeHtml(item.reason)}</p>
          <small>${escapeHtml(item.lowestScore === null ? '暂未记录代码题得分' : `最低代码题得分 ${item.lowestScore}`)}</small>
          <button type="button" class="mini-button" data-apply-code-mode="${escapeHtml(item.key)}">按这个模式补练</button>
        </article>
      `).join('')}
    </div>
  `;
}

function calculateCodeModeSuggestions(records) {
  const grouped = records
    .flatMap((record) => record.questions || [])
    .map((question) => question.codeReviewModeSuggestion)
    .filter((item) => item?.label)
    .reduce((map, item) => {
      const key = createCodeModeSuggestionKey(item);
      const score = Number.isFinite(Number(item.score)) ? Number(item.score) : null;
      const current = map.get(key) || {
        key,
        label: item.label,
        reason: item.reason || '按该模式补齐代码题表达。',
        codeKind: item.codeKind || '',
        count: 0,
        lowestScore: score
      };
      current.count += 1;
      if (score !== null) {
        current.lowestScore = current.lowestScore === null ? score : Math.min(current.lowestScore, score);
      }
      map.set(key, current);
      return map;
    }, new Map());

  return [...grouped.values()]
    .sort((left, right) => right.count - left.count || (left.lowestScore ?? 100) - (right.lowestScore ?? 100));
}

function createCodeModeSuggestionKey(item) {
  return `${item?.label || '代码题模式'}-${item?.codeKind || 'code'}`;
}

function getCodeKindLabel(codeKind) {
  return {
    sql: 'SQL',
    frontend: '前端',
    backend: '后端场景',
    algorithm: '算法'
  }[codeKind] || '代码题';
}

function getCodeKindPracticeKeywords(codeKind) {
  return {
    sql: 'SQL题、分组统计、窗口函数、索引性能',
    frontend: '前端 JS 手写、Promise、防抖节流、数组处理',
    backend: '后端场景伪代码、接口幂等、限流、缓存穿透',
    algorithm: '算法复杂度、边界条件、数据结构'
  }[codeKind] || '思路、伪代码、边界条件、复杂度';
}

function renderHistoryMissedPoints(records) {
  const missedPoints = records
    .flatMap((record) => record.questions || [])
    .flatMap((question) => {
      return (question.expectedPointCoverage || [])
        .filter((item) => item && item.point && item.covered === false)
        .map((item) => ({
          point: item.point,
          category: question.category || '未分类',
          score: Number.isFinite(Number(question.score)) ? Number(question.score) : 100
        }));
    })
    .reduce((map, item) => {
      const current = map.get(item.point) || {
        point: item.point,
        category: item.category,
        count: 0,
        minScore: item.score
      };
      current.count += 1;
      current.minScore = Math.min(current.minScore, item.score);
      map.set(item.point, current);
      return map;
    }, new Map());

  const topPoints = [...missedPoints.values()]
    .sort((left, right) => right.count - left.count || left.minScore - right.minScore)
    .slice(0, 4);

  if (!topPoints.length) {
    return '<p>完成带要点覆盖的复盘后，这里会显示最常漏掉的参考要点。</p>';
  }

  return `
    <div class="history-list">
      ${topPoints.map((item) => `
        <article class="history-missed-point">
          <div class="meta-row">
            <span class="pill amber">${escapeHtml(`${item.count} 次未覆盖`)}</span>
            <span class="pill">${escapeHtml(item.category)}</span>
          </div>
          <p>${escapeHtml(item.point)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderReport(report) {
  if (!report) {
    latestReport = null;
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>暂无报告数据。</p>';
    return;
  }

  latestReport = report;
  const overview = report.overview || {};
  const weakAreas = Array.isArray(report.weakAreas) ? report.weakAreas : [];
  const nextPractice = Array.isArray(report.nextPractice) ? report.nextPractice : [];
  const practicePlan = Array.isArray(report.practicePlan) ? report.practicePlan : [];
  const uncoveredQuestions = Array.isArray(report.uncoveredQuestions) ? report.uncoveredQuestions : [];
  const competencyBreakdown = Array.isArray(overview.competencyBreakdown) ? overview.competencyBreakdown : [];
  const interviewerConcerns = overview.interviewerConcerns || null;
  const interviewerConcernEvidenceHtml = Array.isArray(interviewerConcerns?.evidence) && interviewerConcerns.evidence.length
    ? renderList(interviewerConcerns.evidence, '暂无面试官顾虑证据。')
    : '<p>暂无面试官顾虑证据。</p>';
  const coachPriorityHtml = Array.isArray(overview.coachPriorities) && overview.coachPriorities.length
    ? overview.coachPriorities.map((item, index) => `
        <div class="priority-item">
          <div class="priority-rank">${index + 1}</div>
          <div class="priority-body">
            <strong>${escapeHtml(item.title || '优先提升项')}</strong>
            <p>${escapeHtml(item.detail || '')}</p>
            <p>${escapeHtml(item.rebuildPrompt ? `重答提示：${item.rebuildPrompt}` : '')}</p>
          </div>
        </div>
      `).join('')
    : '<p>继续完成更多回答后，会生成更完整的提升优先级。</p>';

  const weakAreaHtml = weakAreas.length
    ? weakAreas.map((item) => `<span class="pill amber">${escapeHtml(item)}</span>`).join('')
    : '<span class="pill">暂未发现明显薄弱点</span>';

  const nextPracticeHtml = nextPractice.length
    ? nextPractice.map((item) => `
        <article class="practice-item">
          <strong>${escapeHtml(item.title || '下一轮练习')}</strong>
          <p>${escapeHtml(item.goal || item.detail || '')}</p>
          <p>${escapeHtml(item.action || '')}</p>
        </article>
      `).join('')
    : '<p>完成更多回答后，会生成更有针对性的练习建议。</p>';
  const uncoveredQuestionsHtml = uncoveredQuestions.length
    ? uncoveredQuestions.map((item) => `
        <article class="practice-item">
          <div class="meta-row">
            <strong>${escapeHtml(item.category || '未覆盖方向')}</strong>
            <span class="pill amber">${escapeHtml(`${item.targetDuration || 90} 秒准备`)}</span>
          </div>
          <p>${escapeHtml(item.question || '')}</p>
          <p>${escapeHtml(item.planReason ? `安排原因：${item.planReason}` : '安排原因：按本轮训练节奏安排。')}</p>
          <p>${escapeHtml(item.preparationHint || '')}</p>
          <p>${escapeHtml(item.risk || '')}</p>
        </article>
      `).join('')
    : '<p>本轮计划题目都至少覆盖过一次。</p>';
  const practicePlanHtml = practicePlan.length
    ? practicePlan.map((item) => `
        <article class="plan-item">
          <strong>${escapeHtml(item.title || '练习轮次')}</strong>
          <p>${escapeHtml(`重点：${item.focus || '暂无'}`)}</p>
          <p>${escapeHtml(`任务：${item.task || '暂无'}`)}</p>
          <p>${escapeHtml(`达标标志：${item.successMark || '暂无'}`)}</p>
        </article>
      `).join('')
    : '<p>完成更多面试回答后，会生成分阶段练习计划。</p>';
  const competencyBreakdownHtml = competencyBreakdown.length
    ? competencyBreakdown.map((item) => `
        <article class="practice-item">
          <div class="meta-row">
            <strong>${escapeHtml(item.label || '能力项')}</strong>
            <span class="pill ${getCompetencyLevelChipClass(item.level)}">${escapeHtml(getCompetencyLevelText(item.level))}</span>
          </div>
          <p>${escapeHtml(item.evidence || '')}</p>
          <p>${escapeHtml(`差距：${item.gap || '暂无'}`)}</p>
          <p>${escapeHtml(`下一步练习：${item.action || '暂无'}`)}</p>
        </article>
      `).join('')
    : '<p>继续作答后，会生成能力拆解。</p>';
  const reportRadarHtml = renderReportRadar(report);
  const badSmellHtml = renderBadSmellWarnings(report);
  const routeMapHtml = renderRouteMap(report);

  const snapshotStats = [
    {
      label: '总分',
      value: overview.score ?? '-'
    },
    {
      label: '已答题',
      value: `${overview.answeredQuestions ?? 0}/${overview.totalQuestions ?? 0}`
    },
    {
      label: '面试准备度',
      value: overview.readiness || '-'
    },
    {
      label: '面试信号',
      value: overview.hireSignal?.label || '-'
    },
    {
      label: '面试结论',
      value: overview.panelDecision?.label || '-'
    }
  ].map((item) => `
      <div class="snapshot-stat">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
      </div>
    `).join('');

  const questionsHtml = (report.questions || []).map((item, index) => {
    const strengths = renderList(item.strengths, '暂无明确优势信号。');
    const weaknesses = renderList(item.weaknesses, '暂无明显短板。');
    const redFlags = renderList(item.redFlags, '暂无明显风险信号。');
    const coachChecklist = renderList(item.coachChecklist, '暂无检查清单。');
    const rehearsalDrill = renderList(item.mockInterviewDrill, '暂无模拟练习。');
    const retryBlueprint = renderRetryBlueprint(item.retryBlueprint);
    const answerRebuildPlan = renderAnswerRebuildPlan(item.answerRebuildPlan);
    const answerPlaybook = renderAnswerPlaybook(item.answerPlaybook);
    const dimensionScores = renderDimensionScores(item.dimensionScores);
    const learningMaterials = renderLearningMaterials(item);
    const codeModeDrillAction = renderReportCodeModeDrillAction(item);
    const questionDrillAction = renderReportQuestionDrillAction(item, index);
    const questionDrillTarget = renderQuestionDrillTarget(item.questionDrillTarget);

    return `
      <details class="report-card question-accordion" ${index === 0 ? 'open' : ''}>
        <summary>
          <div>
            <h3>第 ${index + 1} 题 | ${escapeHtml(item.category || '未分类')}</h3>
            <p>${escapeHtml(item.question || '')}</p>
          </div>
          <span class="${getDimensionScoreClass(item.score)}">${escapeHtml(item.score ?? '-')}</span>
        </summary>
        <div class="meta-row">
          <span class="pill">${escapeHtml(`得分 ${item.score ?? '-'}`)}</span>
          <span class="pill">${escapeHtml(`回答次数 ${item.attempts ?? 1}`)}</span>
          <span class="pill">${escapeHtml(`追问 ${item.followUpCount ?? 0}`)}</span>
        </div>
        <div class="section-label">本题安排原因</div>
        <p>${escapeHtml(item.planReason || '按本轮训练节奏安排。')}</p>
        ${questionDrillTarget}
        <div class="section-label">四维评分</div>
        ${dimensionScores}
        <div class="section-label">你的回答摘要</div>
        <p>${escapeHtml(item.userAnswerSummary || item.userAnswer || '暂无')}</p>
        <div class="answer-compare-grid">
          <article>
            <div class="section-label">我的回答</div>
            <p>${highlightVagueWords(item.userAnswer || item.userAnswerSummary || '暂无')}</p>
          </article>
          <article>
            <div class="section-label">参考答案</div>
            <p>${escapeHtml(item.referenceAnswer || '暂无')}</p>
          </article>
        </div>
        <div class="section-label">差距分析</div>
        <p>${escapeHtml(item.gapAnalysis || '暂无')}</p>
        ${learningMaterials}
        ${questionDrillAction}
        ${codeModeDrillAction}
        <div class="section-label">面试官判断</div>
        <div class="meta-row">
          <span class="pill ${getVerdictChipClass(item.interviewerVerdict)}">${escapeHtml(item.interviewerVerdict?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.interviewerVerdict?.detail || '暂无面试官判断。')}</p>
        <div class="section-label">通过线建议</div>
        <div class="meta-row">
          <span class="pill ${getPassBarChipClass(item.passBarSignal)}">${escapeHtml(item.passBarSignal?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.passBarSignal?.detail || '暂无通过线建议。')}</p>
        <div class="section-label">面试官还想听到什么</div>
        <p>${escapeHtml(item.passBarDelta?.headline || '暂无通过线差距。')}</p>
        <p>${escapeHtml(item.passBarDelta?.detail || '')}</p>
        ${renderList(item.passBarDelta?.mustLand, '暂无具体补充目标。')}
        <p>${escapeHtml(item.passBarDelta?.nextSentence ? `下一句应该补：${item.passBarDelta.nextSentence}` : '')}</p>
        <p>${escapeHtml(item.passBarDelta?.risk || '')}</p>
        <div class="section-label">简历支撑</div>
        <div class="meta-row">
          <span class="pill ${getResumeChipClass(item.resumeSupport)}">${escapeHtml(item.resumeSupport?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.resumeSupport?.detail || '暂无简历支撑分析。')}</p>
        <div class="section-label">优势</div>
        ${strengths}
        <div class="section-label">薄弱点</div>
        ${weaknesses}
        <div class="section-label">风险信号</div>
        ${redFlags}
        <div class="section-label">面试官可能形成的印象</div>
        <p>${escapeHtml(item.interviewerSignal || '暂无')}</p>
        <div class="section-label">能力信号</div>
        <div class="meta-row">
          <span class="pill ${getCompetencyChipClass(item.interviewerCompetencySignal)}">${escapeHtml(item.interviewerCompetencySignal?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.interviewerCompetencySignal?.detail || '暂无能力信号。')}</p>
        <div class="section-label">追问目标</div>
        <p>${escapeHtml(item.followUpObjective || '暂无')}</p>
        <div class="section-label">追问压力</div>
        <p>${escapeHtml(item.followUpPressure || '暂无')}</p>
        <div class="section-label">最可能的下一问</div>
        <p>${escapeHtml(item.nextFollowUp || '暂无')}</p>
        <div class="section-label">教练建议</div>
        <p>${escapeHtml(item.coachTip || '暂无')}</p>
        <div class="section-label">教练检查清单</div>
        ${coachChecklist}
        <div class="section-label">回答策略</div>
        ${answerPlaybook}
        <div class="section-label">复述练习脚本</div>
        <p>${escapeHtml(item.rehearsalAnswer || '暂无')}</p>
        <div class="section-label">模拟练习</div>
        ${rehearsalDrill}
        <div class="section-label">重答蓝图</div>
        ${retryBlueprint}
        <div class="section-label">重答计划</div>
        ${answerRebuildPlan}
        <div class="section-label">练习任务</div>
        <p>${escapeHtml(item.practiceDrill || '暂无')}</p>
      </details>
    `;
  }).join('');

  reportEl.className = 'report';
  reportEl.innerHTML = `
    <article class="report-card snapshot-card">
      <div class="report-card-header">
        <h3>教练总览</h3>
        <button type="button" class="mini-button" data-copy-report>复制复盘报告</button>
      </div>
      <div class="snapshot-grid">${snapshotStats}</div>
      ${reportRadarHtml}
      <div class="section-label">总体总结</div>
      <p>${escapeHtml(overview.summary || '暂无')}</p>
      <div class="section-label">面试官印象</div>
      <p>${escapeHtml(overview.interviewerImpression || '暂无')}</p>
      <div class="section-label">面试官可能的顾虑</div>
      <p>${escapeHtml(interviewerConcerns?.headline || '暂无')}</p>
      <p>${escapeHtml(interviewerConcerns?.summary || '暂无面试官顾虑总结。')}</p>
      ${interviewerConcernEvidenceHtml}
      <p>${escapeHtml(interviewerConcerns?.practice ? `优先练习：${interviewerConcerns.practice}` : '')}</p>
      <div class="section-label">面试结论</div>
      <div class="meta-row">
        <span class="pill ${getPanelDecisionChipClass(overview.panelDecision)}">${escapeHtml(overview.panelDecision?.label || '暂无')}</span>
      </div>
      <p>${escapeHtml(overview.panelDecision?.detail || '暂无面试结论。')}</p>
      <div class="section-label">能力总结</div>
      <p>${escapeHtml(overview.competencySummary || '暂无')}</p>
      <div class="section-label">能力拆解</div>
      ${competencyBreakdownHtml}
      <div class="section-label">辅导重点</div>
      <p>${escapeHtml(overview.coachingFocus || '继续作答后，会形成更明确的辅导主题。')}</p>
      <div class="section-label">练习总结</div>
      <p>${escapeHtml(overview.practiceSummary || '继续作答后，会生成结构化练习总结。')}</p>
      <div class="section-label">回答目标</div>
      <p>${escapeHtml(overview.answerTargetSummary || '继续作答后，会生成更清晰的通过线目标。')}</p>
      <div class="section-label">未覆盖的计划题目</div>
      <p>${escapeHtml(overview.uncoveredQuestionSummary || '暂无')}</p>
      ${uncoveredQuestionsHtml}
      <div class="section-label">真实面试风险</div>
      <p>${escapeHtml(overview.riskSummary || '继续作答后，会估算真实面试风险。')}</p>
      <div class="section-label">简历支撑覆盖度</div>
      <p>${escapeHtml(overview.resumeCoverage || '暂无')}</p>
      <p>${escapeHtml(overview.resumeGrounding || '暂无')}</p>
      <div class="section-label">级别要求</div>
      <p>${escapeHtml(overview.levelExpectation || '暂无')}</p>
      <div class="section-label">最高优先级提升项</div>
      <div class="priority-list">${coachPriorityHtml}</div>
      <div class="section-label">薄弱领域</div>
      <div class="meta-row">${weakAreaHtml}</div>
    </article>
    ${questionsHtml}
    <article class="report-card">
      <h3>差距、误区与改进建议</h3>
      <div class="section-label">常见误区警示</div>
      ${badSmellHtml}
      <div class="section-label">薄弱领域与下一轮推荐</div>
      <div class="meta-row">${weakAreaHtml}</div>
      ${nextPracticeHtml}
    </article>
    <article class="report-card">
      <h3>通关路线图</h3>
      ${routeMapHtml}
      <div class="section-label">分阶段计划</div>
      ${practicePlanHtml}
    </article>
  `;
  renderReportRadarChart(report);
}

function createReportRadarDimensions(report) {
  const overview = report?.overview || {};
  const questions = Array.isArray(report?.questions) ? report.questions : [];
  const averages = calculateAverageDimensionScores(questions);
  const fallback = [
    { label: '基础八股', score: overview.score ?? 0 },
    { label: '项目深度', score: averages[0]?.score ?? overview.score ?? 0 },
    { label: '工程架构', score: averages[1]?.score ?? overview.score ?? 0 },
    { label: '抗压沟通', score: averages[2]?.score ?? overview.score ?? 0 }
  ];
  const dimensions = averages.length
    ? averages.slice(0, 4).map((item, index) => ({
        label: ['基础八股', '项目深度', '工程架构', '抗压沟通'][index] || item.label,
        score: item.score
      }))
    : fallback;

  return dimensions;
}

function renderReportRadar(report) {
  const dimensions = createReportRadarDimensions(report);

  return `
    <div class="radar-card">
      <div id="reportRadarChart" class="echart-radar" aria-label="四维能力雷达图"></div>
      <div class="dimension-grid">
        ${dimensions.map((item) => `
          <article class="dimension-item">
            <div class="dimension-head">
              <strong>${escapeHtml(item.label)}</strong>
              <span class="${getDimensionScoreClass(item.score)}">${escapeHtml(item.score ?? '-')}</span>
            </div>
            <div class="dimension-bar" aria-hidden="true">
              <i style="width: ${escapeHtml(clampPercent(item.score))}%"></i>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReportRadarChart(report) {
  requestAnimationFrame(() => {
    const target = document.querySelector('#reportRadarChart');
    if (!target || !window.echarts) return;

    const dimensions = createReportRadarDimensions(report);
    const chart = window.echarts.getInstanceByDom(target) || window.echarts.init(target, null, { renderer: 'svg' });
    chart.setOption({
      backgroundColor: 'transparent',
      radar: {
        center: ['50%', '52%'],
        radius: '68%',
        splitNumber: 4,
        indicator: dimensions.map((item) => ({
          name: item.label,
          max: 100
        })),
        axisName: {
          color: '#c8d0de',
          fontSize: 12,
          fontWeight: 700
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 123, 255, 0.24)'
          }
        },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(40, 167, 69, 0.14)',
              'rgba(0, 123, 255, 0.14)',
              'rgba(0, 123, 255, 0.22)',
              'rgba(40, 167, 69, 0.26)'
            ]
          }
        },
        splitArea: {
          areaStyle: {
            color: [
              'rgba(40, 167, 69, 0.03)',
              'rgba(0, 123, 255, 0.04)',
              'rgba(0, 123, 255, 0.07)',
              'rgba(40, 167, 69, 0.08)'
            ]
          }
        }
      },
      series: [{
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          width: 2,
          color: '#007bff'
        },
        areaStyle: {
          color: 'rgba(0, 123, 255, 0.34)'
        },
        itemStyle: {
          color: '#28a745',
          borderColor: '#d9ffe2',
          borderWidth: 1
        },
        data: [{
          value: dimensions.map((item) => Number(item.score) || 0),
          name: '本轮能力画像'
        }]
      }]
    });
    chart.resize();
  });
}

function renderBadSmellWarnings(report) {
  const mistakes = (report?.questions || [])
    .flatMap((item) => item.commonMistakes || [])
    .filter(Boolean)
    .slice(0, 5);
  const redFlags = (report?.questions || [])
    .flatMap((item) => item.redFlags || [])
    .filter(Boolean)
    .slice(0, 5);
  const items = [...new Set([...mistakes, ...redFlags])].slice(0, 6);

  if (!items.length) {
    return '<p>本轮暂未出现明显黑话误用或常识性扣分点。</p>';
  }

  return `
    <div class="history-list">
      ${items.map((item) => `
        <article class="history-mistake bad-smell">
          <strong>Bad Smell</strong>
          <p>${escapeHtml(item)}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderRouteMap(report) {
  const record = createRecommendationRecordFromReport(report);
  if (!record) {
    return '<p>完成报告后，会生成 3 轮定制练习计划。</p>';
  }

  const base = createNextSessionRecommendation(record, [record, ...loadPracticeHistory()]);
  const plans = [
    {
      title: `${base.weakArea || '核心基础'}专项突破面试`,
      styleValue: 'normal',
      styleLabel: '常规风格',
      focus: base.practiceFocus || '先把最低分题按通过线重答一遍。'
    },
    {
      title: '大厂项目架构深挖硬核面试',
      styleValue: 'pressure',
      styleLabel: '压力风格',
      focus: '围绕项目职责、指标结果、架构取舍和线上风险连续追问。'
    },
    {
      title: '算法与复杂场景设计模拟',
      styleValue: 'coaching',
      styleLabel: '教练风格',
      focus: '用提示式追问补齐思路、伪代码、边界条件和复杂度表达。'
    }
  ];

  return `
    <div class="route-map">
      ${plans.map((plan, index) => `
        <article class="route-card">
          <span class="pill">${escapeHtml(`第 ${index + 1} 轮 · ${plan.styleLabel}`)}</span>
          <strong>${escapeHtml(plan.title)}</strong>
          <p>${escapeHtml(plan.focus)}</p>
          <button type="button" class="mini-button" data-apply-report-route="${escapeHtml(index)}">一键导入配置并开启</button>
        </article>
      `).join('')}
    </div>
  `;
}

function highlightVagueWords(text) {
  const escaped = escapeHtml(text || '');
  return escaped.replace(/(可能|大概|比较|差不多|应该|感觉|就是|然后)/g, '<mark>$1</mark>');
}

async function copyReportMarkdown(report) {
  const markdown = createReportMarkdown(report);
  try {
    await navigator.clipboard.writeText(markdown);
    statusText.textContent = '复盘报告已复制，可以粘贴到笔记或文档里。';
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.setAttribute('readonly', 'readonly');
    textarea.className = 'clipboard-fallback';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    statusText.textContent = copied
      ? '复盘报告已复制，可以粘贴到笔记或文档里。'
      : '复制失败，请手动选中报告内容保存。';
  }
}

function createReportMarkdown(report) {
  const overview = report?.overview || {};
  const recommendationRecord = createRecommendationRecordFromReport(report);
  const recommendation = recommendationRecord
    ? createNextSessionRecommendation(recommendationRecord, [recommendationRecord, ...loadPracticeHistory()])
    : null;
  const lines = [
    '# 程序员模拟面试复盘报告',
    '',
    `- 面试方向：${overview.role || '未设置'}`,
    `- 面试级别：${overview.level || '未设置'}`,
    `- 面试风格：${overview.style || '未设置'}`,
    `- 总分：${overview.score ?? '-'}`,
    `- 已答题：${overview.answeredQuestions ?? 0}/${overview.totalQuestions ?? 0}`,
    `- 面试准备度：${overview.readiness || '暂无'}`,
    `- 面试结论：${overview.panelDecision?.label || '暂无'}`,
    '',
    '## 总体总结',
    overview.summary || '暂无',
    '',
    '## 薄弱领域',
    formatMarkdownList(report.weakAreas, '暂未发现明显薄弱点'),
    '',
    '## 逐题复盘'
  ];

  for (const [index, item] of (report.questions || []).entries()) {
    lines.push(
      '',
      `### 第 ${index + 1} 题：${item.category || '未分类'}`,
      item.question || '暂无题目',
      '',
      `- 得分：${item.score ?? '-'}`,
      `- 安排原因：${item.planReason || '按本轮训练节奏安排。'}`,
      ...formatQuestionDrillTargetMarkdown(item.questionDrillTarget),
      `- 回答摘要：${item.userAnswerSummary || item.userAnswer || '暂无'}`,
      `- 差距分析：${item.gapAnalysis || '暂无'}`,
      `- 最可能的下一问：${item.nextFollowUp || '暂无'}`,
      '',
      '四维评分：',
      formatMarkdownList((item.dimensionScores || []).map((score) => `${score.label} ${score.score}：${score.detail}`), '暂无四维评分'),
      '',
      ...(item.type === 'algorithm'
        ? [
          '代码题清单缺口：',
          formatMarkdownList(getCodeChecklistGaps(item.dimensionScores), '思路、伪代码、边界和复杂度/取舍表达较完整'),
          `建议下次模式：${formatCodeReviewModeSuggestion(item.dimensionScores, item.codeKind)}`,
          ''
        ]
        : []),
      '参考要点：',
      formatMarkdownList(item.expectedPoints, '暂无参考要点'),
      '',
      '要点覆盖：',
      formatMarkdownList((item.expectedPointCoverage || []).map((entry) => `${entry.covered ? '已覆盖' : '未覆盖'}：${entry.point}`), '暂无要点覆盖分析'),
      '',
      '常见扣分点：',
      formatMarkdownList(item.commonMistakes, '暂无常见扣分点'),
      '',
      '参考答案：',
      item.referenceAnswer || '暂无',
      '',
      '优秀回答示例：',
      item.excellentAnswer || '暂无'
    );
  }

  const uncoveredQuestions = Array.isArray(report.uncoveredQuestions) ? report.uncoveredQuestions : [];
  if (uncoveredQuestions.length) {
    lines.push(
      '',
      '## 未覆盖的计划题目'
    );

    for (const [index, item] of uncoveredQuestions.entries()) {
      lines.push(
        '',
        `### 未覆盖 ${index + 1}：${item.category || '未分类'}`,
        item.question || '暂无题目',
        '',
        `- 安排原因：${item.planReason || '按本轮训练节奏安排。'}`,
        `- 准备提示：${item.preparationHint || '先按核心考点组织 90 秒回答。'}`,
        `- 风险提醒：${item.risk || '如果后半段遇到同类题，容易暴露准备空白。'}`
      );
    }
  }

  lines.push(
    '',
    '## 下一步练习',
    formatMarkdownList((report.nextPractice || []).map((item) => item.title || item.goal || item.action).filter(Boolean), '暂无下一步建议'),
    '',
    '## 推荐下一场面试',
    ...formatNextSessionMarkdown(recommendation)
  );

  return lines.join('\n');
}

function createRecommendationRecordFromReport(report) {
  const overview = report?.overview || {};
  if (!overview.role && !overview.score && !Array.isArray(report?.questions)) return null;

  return {
    role: overview.role || '未设置方向',
    level: overview.level || '未设置级别',
    style: overview.style || '未设置风格',
    score: Number.isFinite(Number(overview.score)) ? Number(overview.score) : null,
    weakAreas: Array.isArray(report.weakAreas) ? report.weakAreas : [],
    questions: Array.isArray(report.questions)
      ? report.questions.map((item) => ({
        questionId: item.questionId || '',
        question: item.question || '',
        category: item.category || '',
        skill: item.skill || item.category || '',
        type: item.type || '',
        codeKind: item.codeKind || '',
        planReason: item.planReason || '',
        questionDrillTarget: item.questionDrillTarget || null,
        score: Number.isFinite(Number(item.score)) ? Number(item.score) : null,
        followUpCount: item.followUpCount || 0,
        expectedPointCoverage: Array.isArray(item.expectedPointCoverage) ? item.expectedPointCoverage : [],
        commonMistakes: Array.isArray(item.commonMistakes) ? item.commonMistakes : []
      }))
      : [],
    uncoveredQuestions: Array.isArray(report.uncoveredQuestions)
      ? report.uncoveredQuestions.map((item) => ({
        questionId: item.id || '',
        question: item.question || '',
        category: item.category || '',
        type: item.type || '',
        codeKind: item.codeKind || '',
        planReason: item.planReason || '',
        preparationHint: item.preparationHint || '',
        risk: item.risk || ''
      }))
      : [],
    nextPractice: Array.isArray(report.nextPractice)
      ? report.nextPractice.map((item) => item.title || item.goal || item.action).filter(Boolean)
      : []
  };
}

function formatNextSessionMarkdown(recommendation) {
  if (!recommendation) return ['- 暂无推荐配置'];

  return [
    `- 方向：${recommendation.roleLabel}`,
    `- 难度：${recommendation.levelLabel}`,
    `- 风格：${recommendation.styleLabel}`,
    `- 题量：${recommendation.questionCount} 题`,
    `- 优先训练：${recommendation.weakArea}`,
    `- 本轮任务：${recommendation.practiceFocus}`,
    `- 训练方式：${recommendation.drillPrompt}`,
    `- 阶段预览：${recommendation.previewStages.join(' -> ')}`
  ];
}

function formatQuestionDrillTargetMarkdown(target) {
  if (!target?.source) return [];

  return [
    `- 单题重练来源：${target.source}`,
    `- 单题重练目标：${target.target || '本题薄弱点'}`,
    `- 单题重练提醒：${target.reminder || (target.missedPoint ? `优先补齐「${target.missedPoint}」。` : '优先验证同类题和定点追问表现。')}`
  ];
}

function formatMarkdownList(items, fallback) {
  if (!Array.isArray(items) || !items.length) return `- ${fallback}`;
  return items.map((item) => `- ${item}`).join('\n');
}

function renderList(items, fallback) {
  if (!Array.isArray(items) || !items.length) {
    return `<p>${escapeHtml(fallback)}</p>`;
  }

  return `<ul class="compact-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderLearningMaterials(item) {
  const codeReviewFocus = item.type === 'algorithm'
    ? renderCodeReviewFocus(item)
    : '';

  return `
    <details class="learning-materials">
      <summary>查看参考答案、优秀表达和扣分点</summary>
      ${codeReviewFocus}
      <div class="section-label">参考要点</div>
      ${renderList(item.expectedPoints, '暂无参考要点。')}
      <div class="section-label">要点覆盖</div>
      ${renderExpectedPointCoverage(item.expectedPointCoverage)}
      <div class="section-label">参考答案</div>
      <p>${escapeHtml(item.referenceAnswer || '暂无')}</p>
      <div class="section-label">优秀回答示例</div>
      <p>${escapeHtml(item.excellentAnswer || '暂无')}</p>
      <div class="section-label">常见扣分点</div>
      ${renderList(item.commonMistakes, '暂无常见扣分点。')}
      <div class="section-label">优化后的回答</div>
      <p>${escapeHtml(item.improvedUserAnswer || '暂无')}</p>
    </details>
  `;
}

function renderExpectedPointCoverage(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<p>暂无要点覆盖分析。</p>';
  }

  return `
    <div class="coverage-list">
      ${items.map((item) => `
        <article class="coverage-item ${item.covered ? 'covered' : 'missed'}">
          <span>${escapeHtml(item.covered ? '已覆盖' : '未覆盖')}</span>
          <p>${escapeHtml(item.point || '')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCodeReviewFocus(item) {
  const checklistGaps = renderCodeChecklistGaps(item.dimensionScores, item.codeKind);

  return `
    <div class="code-review-focus">
      <div class="section-label">代码题复盘重点</div>
      <div class="meta-row">
        ${renderPills(getCodeReviewFocusPoints(item.codeKind), '补充思路、实现、边界和复杂度')}
      </div>
      ${checklistGaps}
    </div>
  `;
}

function renderCodeChecklistGaps(dimensionScores, codeKind) {
  const gaps = getCodeChecklistGaps(dimensionScores);
  const modeSuggestion = getCodeReviewModeSuggestion(dimensionScores, codeKind);

  return `
    <div class="code-review-gap">
      <strong>按作答清单补齐</strong>
      <div class="meta-row">
        ${renderPills(gaps, '继续保持思路、伪代码、边界和取舍完整表达')}
      </div>
      <p>${escapeHtml(`建议下次优先使用「${modeSuggestion.label}」：${modeSuggestion.reason}`)}</p>
    </div>
  `;
}

function getCodeChecklistGaps(dimensionScores) {
  const gapRules = [
    {
      labels: ['解题思路'],
      text: '先补清解题思路'
    },
    {
      labels: ['实现完整度'],
      text: '补伪代码或关键实现'
    },
    {
      labels: ['边界覆盖'],
      text: '补边界条件'
    },
    {
      labels: ['性能意识', '副作用控制', '方案取舍', '复杂度表达'],
      text: '补复杂度或方案取舍'
    }
  ];
  const scores = Array.isArray(dimensionScores) ? dimensionScores : [];

  return gapRules
    .filter((rule) => scores.some((item) => rule.labels.includes(item.label) && Number(item.score) < 75))
    .map((rule) => rule.text);
}

function getCodeReviewModeSuggestion(dimensionScores, codeKind) {
  const scores = Array.isArray(dimensionScores) ? dimensionScores : [];
  const lowLabels = scores
    .filter((item) => Number(item.score) < 75)
    .map((item) => item.label);

  if (lowLabels.some((label) => ['实现完整度', '边界覆盖'].includes(label))) {
    return {
      label: codeKind === 'sql' ? 'SQL 代码' : codeKind === 'backend' ? '流程伪代码' : '伪代码',
      reason: '先把主流程、关键判断和边界写出来，避免只停留在口头思路。'
    };
  }

  if (lowLabels.some((label) => ['性能意识', '副作用控制', '方案取舍', '复杂度表达'].includes(label))) {
    return {
      label: '思路说明',
      reason: '先补清复杂度、性能代价、失败恢复或方案取舍，再进入实现细节。'
    };
  }

  if (lowLabels.includes('解题思路')) {
    return {
      label: '思路说明',
      reason: '先说清输入输出、核心思路和为什么这样做，再写伪代码。'
    };
  }

  return {
    label: codeKind === 'sql' ? 'SQL 代码' : codeKind === 'frontend' ? 'JS/代码' : '伪代码',
    reason: '本题主线较完整，下次可以直接用代码或伪代码巩固表达密度。'
  };
}

function formatCodeReviewModeSuggestion(dimensionScores, codeKind) {
  const suggestion = getCodeReviewModeSuggestion(dimensionScores, codeKind);
  return `${suggestion.label}，${suggestion.reason}`;
}

function getCodeReviewFocusPoints(codeKind) {
  return {
    sql: ['SQL 形态', '过滤与聚合', '索引/性能', '金额和时间边界'],
    frontend: ['输入输出', '关键代码', 'this/参数/副作用', '边界和复杂度'],
    backend: ['请求流程', '状态存储', '并发边界', '失败恢复', '方案取舍'],
    algorithm: ['核心思路', '数据结构', '复杂度', '极端输入']
  }[codeKind] || ['核心思路', '实现完整度', '边界条件', '复杂度表达'];
}

function renderDimensionScores(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<p>暂无四维评分。</p>';
  }

  return `
    <div class="dimension-grid">
      ${items.map((item) => `
        <article class="dimension-item">
          <div class="dimension-head">
            <strong>${escapeHtml(item.label || '能力项')}</strong>
            <span class="${getDimensionScoreClass(item.score)}">${escapeHtml(item.score ?? '-')}</span>
          </div>
          <div class="dimension-bar" aria-hidden="true">
            <i style="width: ${escapeHtml(clampPercent(item.score))}%"></i>
          </div>
          <p>${escapeHtml(item.detail || '暂无说明。')}</p>
        </article>
      `).join('')}
    </div>
  `;
}

function renderAnswerRebuildPlan(plan) {
  if (!plan) {
    return '<p>暂无重答计划。</p>';
  }

  return [
    `<p>${escapeHtml(plan.opening || '暂无')}</p>`,
    `<p>${escapeHtml(plan.structure || '暂无')}</p>`,
    renderList(plan.checkpoints, '暂无具体重构检查点。'),
    `<p>${escapeHtml(plan.emphasis || '')}</p>`,
    `<p>${escapeHtml(plan.closing || '')}</p>`,
    `<p>${escapeHtml(plan.rehearsalPrompt ? `复述练习提示：${plan.rehearsalPrompt}` : '')}</p>`,
    `<p>${escapeHtml(plan.avoid ? `避免这样说：${plan.avoid}` : '')}</p>`
  ].join('');
}

function renderRetryBlueprint(blueprint) {
  if (!blueprint) {
    return '<p>暂无重答蓝图。</p>';
  }

  const rows = [
    ['开场句', blueprint.openingLine],
    ['回答结构', blueprint.structure],
    ['保留锚点', blueprint.anchor],
    ['需要补充', blueprint.addEvidence],
    ['避坑提醒', blueprint.avoidTrap]
  ].filter(([, value]) => value);

  if (!rows.length) {
    return '<p>暂无重答蓝图。</p>';
  }

  return `
    <div class="retry-blueprint">
      ${rows.map(([label, value]) => `
        <div class="retry-row">
          <strong>${escapeHtml(label)}</strong>
          <p>${escapeHtml(value)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAnswerPlaybook(playbook) {
  if (!playbook) {
    return '<p>暂无回答策略。</p>';
  }

  return [
    `<p>${escapeHtml(playbook.interviewerIntent || '暂无')}</p>`,
    `<p>${escapeHtml(playbook.first30Seconds ? `前 30 秒：${playbook.first30Seconds}` : '')}</p>`,
    renderList(playbook.proofPoints, '暂无具体证明点。'),
    `<p>${escapeHtml(playbook.likelyPushback ? `可能追问：${playbook.likelyPushback}` : '')}</p>`,
    `<p>${escapeHtml(playbook.recoveryLine ? `补救句：${playbook.recoveryLine}` : '')}</p>`,
    `<p>${escapeHtml(playbook.doNotSay ? `不要这样说：${playbook.doNotSay}` : '')}</p>`
  ].join('');
}

function getLiveCoachStageClass(stage) {
  return {
    ready: 'green',
    completed: 'green',
    pressure: 'amber',
    pin_down: 'amber',
    clarify: '',
    opening: ''
  }[stage] || '';
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '时间未知';
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getProviderText(provider) {
  return {
    mock: '本地模拟面试官',
    gemini: 'Gemini',
    openrouter: 'OpenRouter',
    ollama: 'Ollama'
  }[provider] || provider || '本地模拟面试官';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getResumeChipClass(resumeSupport) {
  if (!resumeSupport) return '';
  if (resumeSupport.status === 'grounded') return 'green';
  if (resumeSupport.status === 'missed') return 'amber';
  return '';
}

function getVerdictChipClass(verdict) {
  if (!verdict) return '';
  if (verdict.level === 'strong') return 'green';
  if (verdict.level === 'risk') return 'amber';
  return '';
}

function getCompetencyChipClass(signal) {
  if (!signal) return '';
  if (signal.level === 'strong') return 'green';
  if (signal.level === 'risk') return 'amber';
  return '';
}

function getCompetencyLevelChipClass(level) {
  if (level === 'strong') return 'green';
  if (level === 'risk') return 'amber';
  return '';
}

function getCompetencyLevelText(level) {
  return {
    strong: '高于通过线',
    watch: '需要观察',
    risk: '低于通过线'
  }[level] || '需要观察';
}

function getPassBarChipClass(signal) {
  if (!signal) return '';
  if (signal.level === 'strong') return 'green';
  if (signal.level === 'risk') return 'amber';
  return '';
}

function getPanelDecisionChipClass(signal) {
  if (!signal) return '';
  if (signal.level === 'strong') return 'green';
  if (signal.level === 'risk') return 'amber';
  return '';
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

function getDimensionScoreClass(score) {
  const number = Number(score);
  if (number >= 80) return 'dimension-score strong';
  if (number >= 65) return 'dimension-score watch';
  return 'dimension-score risk';
}
