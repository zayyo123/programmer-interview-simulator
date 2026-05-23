const setupForm = document.querySelector('#setupForm');
const answerForm = document.querySelector('#answerForm');
const answerInput = document.querySelector('#answerInput');
const messagesEl = document.querySelector('#messages');
const reportEl = document.querySelector('#report');
const providerText = document.querySelector('#providerText');
const statusText = document.querySelector('#statusText');
const finishButton = document.querySelector('#finishButton');
const answerSubmitButton = answerForm.querySelector('button[type="submit"]');

let sessionId = null;
let busy = false;

setupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;

  const formData = new FormData(setupForm);
  const payload = {
    role: formData.get('role'),
    level: formData.get('level'),
    style: formData.get('style'),
    questionCount: Number(formData.get('questionCount') || 5),
    resume: formData.get('resume') || ''
  };

  setBusy(true);
  statusText.textContent = '正在初始化面试...';

  try {
    const data = await requestJson('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    sessionId = data.sessionId;
    providerText.textContent = data.provider || 'mock';
    renderMessages(data.messages || []);
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>面试进行中，结束后这里会生成复盘报告。</p>';
    statusText.textContent = '面试已开始，按真实面试方式回答当前问题。';
    answerInput.value = '';
    answerInput.disabled = false;
    answerSubmitButton.disabled = false;
    finishButton.disabled = false;
    answerInput.focus();
  } catch (error) {
    statusText.textContent = `启动失败：${error.message}`;
  } finally {
    setBusy(false);
  }
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !sessionId) return;

  const answer = answerInput.value.trim();
  if (!answer) {
    statusText.textContent = '请先输入回答内容。';
    return;
  }

  setBusy(true);
  statusText.textContent = '面试官正在追问...';

  try {
    const data = await requestJson(`/api/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });

    providerText.textContent = data.provider || 'mock';
    renderMessages(data.messages || []);
    statusText.textContent = data.currentQuestion
      ? '继续回答当前问题或下一个问题。'
      : '题目已经完成，可以结束面试生成报告。';
    answerInput.value = '';
    answerInput.focus();
  } catch (error) {
    statusText.textContent = `提交失败：${error.message}`;
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
    answerInput.disabled = true;
    answerSubmitButton.disabled = true;
    finishButton.disabled = true;
    statusText.textContent = '复盘报告已生成，可直接查看本次训练结果。';
  } catch (error) {
    statusText.textContent = `生成报告失败：${error.message}`;
  } finally {
    setBusy(false);
  }
});

function setBusy(nextBusy) {
  busy = nextBusy;
  setupForm.querySelector('button[type="submit"]').disabled = nextBusy;
  answerInput.disabled = nextBusy || !sessionId;
  answerSubmitButton.disabled = nextBusy || !sessionId;
  finishButton.disabled = nextBusy || !sessionId;
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
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

function renderMessages(messages) {
  if (!messages.length) {
    messagesEl.className = 'messages empty-state';
    messagesEl.innerHTML = '<p>面试开始后，这里会显示完整对话。</p>';
    return;
  }

  messagesEl.className = 'messages';
  messagesEl.innerHTML = messages.map((message) => {
    const roleLabel = message.role === 'candidate' ? '候选人' : 'AI 面试官';
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

function renderReport(report) {
  if (!report) {
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>暂无报告数据。</p>';
    return;
  }

  const overview = report.overview || {};
  const weakAreas = Array.isArray(report.weakAreas) ? report.weakAreas : [];
  const nextPractice = Array.isArray(report.nextPractice) ? report.nextPractice : [];
  const coachPriorityHtml = Array.isArray(overview.coachPriorities) && overview.coachPriorities.length
    ? overview.coachPriorities.map((item, index) => `
        <div class="priority-item">
          <div class="priority-rank">${index + 1}</div>
          <div class="priority-body">
            <strong>${escapeHtml(item.title || '训练重点')}</strong>
            <p>${escapeHtml(item.detail || '')}</p>
          </div>
        </div>
      `).join('')
    : '<p>完成更多回答后会生成优先补强顺序。</p>';

  const weakAreaHtml = weakAreas.length
    ? weakAreas.map((item) => `<span class="pill amber">${escapeHtml(item)}</span>`).join('')
    : '<span class="pill">暂无明显薄弱方向</span>';

  const nextPracticeHtml = nextPractice.length
    ? nextPractice.map((item) => `
        <article class="practice-item">
          <strong>${escapeHtml(item.title || '下一步练习')}</strong>
          <p>${escapeHtml(item.detail || '')}</p>
        </article>
      `).join('')
    : '<p>继续完成更多面试题后会生成下一步训练建议。</p>';

  const questionsHtml = (report.questions || []).map((item, index) => {
    const strengths = renderList(item.strengths, '暂无明显亮点。');
    const weaknesses = renderList(item.weaknesses, '暂无明显短板。');
    const redFlags = renderList(item.redFlags, '暂无明显红旗信号。');

    return `
      <article class="report-card">
        <h3>问题 ${index + 1} · ${escapeHtml(item.category || '未分类')}</h3>
        <p>${escapeHtml(item.question || '')}</p>
        <div class="meta-row">
          <span class="pill">${escapeHtml(`得分 ${item.score ?? '-'}`)}</span>
          <span class="pill">${escapeHtml(`回答次数 ${item.attempts ?? 1}`)}</span>
          <span class="pill">${escapeHtml(`追问次数 ${item.followUpCount ?? 0}`)}</span>
        </div>
        <div class="section-label">回答总结</div>
        <p>${escapeHtml(item.userAnswerSummary || item.userAnswer || '暂无')}</p>
        <div class="section-label">参考答案</div>
        <p>${escapeHtml(item.referenceAnswer || '暂无')}</p>
        <div class="section-label">优秀回答示例</div>
        <p>${escapeHtml(item.excellentAnswer || '暂无')}</p>
        <div class="section-label">差距分析</div>
        <p>${escapeHtml(item.gapAnalysis || '暂无')}</p>
        <div class="section-label">面试官结论</div>
        <div class="meta-row">
          <span class="pill ${getVerdictChipClass(item.interviewerVerdict)}">${escapeHtml(item.interviewerVerdict?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.interviewerVerdict?.detail || '暂无面试官结论。')}</p>
        <div class="section-label">简历绑定判断</div>
        <div class="meta-row">
          <span class="pill ${getResumeChipClass(item.resumeSupport)}">${escapeHtml(item.resumeSupport?.label || '暂无')}</span>
        </div>
        <p>${escapeHtml(item.resumeSupport?.detail || '暂无简历绑定判断。')}</p>
        <div class="section-label">亮点</div>
        ${strengths}
        <div class="section-label">问题</div>
        ${weaknesses}
        <div class="section-label">风险信号</div>
        ${redFlags}
        <div class="section-label">面试官可能的判断</div>
        <p>${escapeHtml(item.interviewerSignal || '暂无')}</p>
        <div class="section-label">追问目标</div>
        <p>${escapeHtml(item.followUpObjective || '暂无')}</p>
        <div class="section-label">下一步追问焦点</div>
        <p>${escapeHtml(item.nextFollowUp || '暂无')}</p>
        <div class="section-label">训练建议</div>
        <p>${escapeHtml(item.coachTip || '暂无')}</p>
        <div class="section-label">改写后的更优回答</div>
        <p>${escapeHtml(item.improvedUserAnswer || '暂无')}</p>
        <div class="section-label">专项练习</div>
        <p>${escapeHtml(item.practiceDrill || '暂无')}</p>
      </article>
    `;
  }).join('');

  reportEl.className = 'report';
  reportEl.innerHTML = `
    <article class="report-card">
      <h3>整体表现</h3>
      <div class="meta-row">
        <span class="pill">${escapeHtml(overview.role || '未设置岗位')}</span>
        <span class="pill">${escapeHtml(overview.level || '未设置级别')}</span>
        <span class="pill">${escapeHtml(overview.style || '未设置风格')}</span>
        <span class="pill">${escapeHtml(`总分 ${overview.score ?? '-'}`)}</span>
      </div>
      <div class="section-label">准备度</div>
      <p>${escapeHtml(overview.readiness || '暂无')}</p>
      <div class="section-label">整体总结</div>
      <p>${escapeHtml(overview.summary || '暂无')}</p>
      <div class="section-label">面试官整体印象</div>
      <p>${escapeHtml(overview.interviewerImpression || '暂无')}</p>
      <div class="section-label">通过信号</div>
      <div class="meta-row">
        <span class="pill ${getVerdictChipClass(overview.hireSignal)}">${escapeHtml(overview.hireSignal?.label || '暂无')}</span>
      </div>
      <p>${escapeHtml(overview.hireSignal?.detail || '暂无通过信号判断。')}</p>
      <div class="section-label">训练重点</div>
      <p>${escapeHtml(overview.coachingFocus || '完成更多回答后会生成训练重点。')}</p>
      <div class="section-label">真实面试风险</div>
      <p>${escapeHtml(overview.riskSummary || '完成更多回答后会生成风险判断。')}</p>
      <div class="section-label">简历绑定情况</div>
      <div class="meta-row">
        <span class="pill ${getResumeChipClass(overview.resumeSummary ? { status: 'grounded' } : null)}">${escapeHtml(overview.resumeSummary ? '已加入简历背景' : '未提供简历')}</span>
      </div>
      <p>${escapeHtml(overview.resumeCoverage || '暂无简历绑定评估。')}</p>
      <p>${escapeHtml(overview.resumeGrounding || '暂无简历绑定判断。')}</p>
      <div class="section-label">级别要求</div>
      <p>${escapeHtml(overview.levelExpectation || '暂无')}</p>
      <div class="section-label">优先补强顺序</div>
      <div class="priority-list">${coachPriorityHtml}</div>
      <div class="section-label">薄弱方向</div>
      <div class="meta-row">${weakAreaHtml}</div>
    </article>
    ${questionsHtml}
    <article class="report-card">
      <h3>下一步练习建议</h3>
      ${nextPracticeHtml}
    </article>
  `;
}

function renderList(items, fallback) {
  if (!Array.isArray(items) || !items.length) {
    return `<p>${escapeHtml(fallback)}</p>`;
  }

  return `<ul class="compact-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value || '')
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
