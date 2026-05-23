const setupForm = document.querySelector('#setupForm');
const answerForm = document.querySelector('#answerForm');
const answerInput = document.querySelector('#answerInput');
const finishButton = document.querySelector('#finishButton');
const messagesEl = document.querySelector('#messages');
const reportEl = document.querySelector('#report');
const statusText = document.querySelector('#statusText');
const providerText = document.querySelector('#providerText');

let sessionId = null;

setupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setBusy(true, '正在创建面试...');

  const formData = new FormData(setupForm);
  const payload = Object.fromEntries(formData.entries());
  payload.questionCount = Number(payload.questionCount || 5);

  const data = await postJson('/api/interviews', payload);
  sessionId = data.sessionId;

  providerText.textContent = data.provider || 'pending';
  renderMessages(data.messages);
  reportEl.className = 'report empty-state';
  reportEl.innerHTML = '<p>面试进行中，结束后会生成复盘报告。</p>';
  answerInput.disabled = false;
  answerForm.querySelector('button').disabled = false;
  finishButton.disabled = false;
  statusText.textContent = `本轮计划 ${data.plan.length} 道题。请直接回答面试官的问题。`;
  answerInput.focus();
  setBusy(false);
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!sessionId) return;

  const answer = answerInput.value.trim();
  if (!answer) return;

  setBusy(true, '面试官正在思考追问...');
  answerInput.value = '';

  const data = await postJson(`/api/interviews/${sessionId}/answer`, { answer });
  providerText.textContent = data.provider;
  renderMessages(data.messages);
  statusText.textContent = data.currentQuestion
    ? '继续回答当前问题或下一题。'
    : '题目已经完成，可以结束面试生成报告。';
  setBusy(false);
  answerInput.focus();
});

finishButton.addEventListener('click', async () => {
  if (!sessionId) return;

  setBusy(true, '正在生成复盘报告...');
  const data = await postJson(`/api/interviews/${sessionId}/finish`, {});
  renderMessages(data.messages);
  renderReport(data.report);
  statusText.textContent = '面试已结束，复盘报告已生成。';
  answerInput.disabled = true;
  answerForm.querySelector('button').disabled = true;
  finishButton.disabled = true;
  setBusy(false);
});

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function renderMessages(messages) {
  messagesEl.className = 'messages';
  messagesEl.innerHTML = messages.map((message) => {
    const roleLabel = message.role === 'candidate' ? '候选人' : 'AI 面试官';
    const provider = message.provider ? ` · ${message.provider}` : '';
    return `
      <article class="message ${escapeHtml(message.role)}">
        <div class="message-header">
          <strong>${roleLabel}${provider}</strong>
          <span>${formatTime(message.createdAt)}</span>
        </div>
        <div class="message-content">${escapeHtml(message.content)}</div>
      </article>
    `;
  }).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderReport(report) {
  reportEl.className = 'report';
  const overview = report.overview;
  const weakAreas = report.weakAreas.length
    ? report.weakAreas.map((item) => `<span class="pill amber">${escapeHtml(item)}</span>`).join('')
    : '<span class="pill green">暂无明显短板</span>';

  reportEl.innerHTML = `
    <article class="report-card">
      <h3>总体表现</h3>
      <div class="meta-row">
        <span class="pill">${escapeHtml(overview.role)}</span>
        <span class="pill">${escapeHtml(overview.level)}</span>
        <span class="pill">${escapeHtml(overview.style)}</span>
        <span class="pill green">评分 ${overview.score}/100</span>
        <span class="pill amber">${escapeHtml(overview.readiness || '待评估')}</span>
        <span class="pill">${overview.answeredQuestions}/${overview.totalQuestions} 题</span>
      </div>
      <div class="section-label">整体判断</div>
      <p>${escapeHtml(overview.summary || '完成更多回答后会生成整体判断。')}</p>
      <div class="section-label">薄弱方向</div>
      <div class="meta-row">${weakAreas}</div>
    </article>

    ${report.questions.map((item, index) => `
      <article class="report-card">
        <h3>${index + 1}. ${escapeHtml(item.question)}</h3>
        <div class="meta-row">
          <span class="pill">${escapeHtml(item.category)}</span>
          <span class="pill green">本题 ${item.score}/100</span>
        </div>
        <div class="section-label">你的回答摘要</div>
        <p>${escapeHtml(item.userAnswerSummary)}</p>
        <div class="section-label">表现亮点</div>
        ${renderList(item.strengths)}
        <div class="section-label">参考答案</div>
        <p>${escapeHtml(item.referenceAnswer)}</p>
        <div class="section-label">面试版优秀回答</div>
        <p>${escapeHtml(item.excellentAnswer)}</p>
        <div class="section-label">差距分析</div>
        <p>${escapeHtml(item.gapAnalysis)}</p>
        <div class="section-label">下一步追问焦点</div>
        <p>${escapeHtml(item.nextFollowUp)}</p>
        <div class="section-label">优化后的表达</div>
        <p>${escapeHtml(item.improvedUserAnswer)}</p>
      </article>
    `).join('')}

    <article class="report-card">
      <h3>下一次练习建议</h3>
      ${report.nextPractice.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}
    </article>
  `;
}

function setBusy(isBusy, text) {
  setupForm.querySelector('button').disabled = isBusy;
  if (sessionId) {
    answerForm.querySelector('button').disabled = isBusy;
    finishButton.disabled = isBusy;
  }
  if (text) statusText.textContent = text;
}

function renderList(items = []) {
  if (!items.length) {
    return '<p>暂无明显亮点，建议先补齐核心主线。</p>';
  }

  return `<ul class="compact-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function formatTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
