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
  statusText.textContent = 'Starting the interview...';

  try {
    const data = await requestJson('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    sessionId = data.sessionId;
    providerText.textContent = data.provider || 'mock';
    renderMessages(data.messages || []);
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>The interview is in progress. Finish the session to generate coaching feedback.</p>';
    statusText.textContent = 'Interview started. Answer as if you were in a real technical screen.';
    answerInput.value = '';
    answerInput.disabled = false;
    answerSubmitButton.disabled = false;
    finishButton.disabled = false;
    answerInput.focus();
  } catch (error) {
    statusText.textContent = `Failed to start the interview: ${error.message}`;
  } finally {
    setBusy(false);
  }
});

answerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy || !sessionId) return;

  const answer = answerInput.value.trim();
  if (!answer) {
    statusText.textContent = 'Enter an answer before sending.';
    return;
  }

  setBusy(true);
  statusText.textContent = 'The interviewer is responding...';

  try {
    const data = await requestJson(`/api/interviews/${sessionId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    });

    providerText.textContent = data.provider || 'mock';
    renderMessages(data.messages || []);
    if (data.completed || !data.currentQuestion) {
      statusText.textContent = 'All planned questions are covered. You can finish to generate the report.';
      answerInput.disabled = true;
      answerSubmitButton.disabled = true;
    } else {
      statusText.textContent = 'Keep going. The interviewer may still be probing the same topic.';
      answerInput.disabled = false;
      answerSubmitButton.disabled = false;
    }
    answerInput.value = '';
    if (!answerInput.disabled) {
      answerInput.focus();
    }
  } catch (error) {
    statusText.textContent = `Failed to submit the answer: ${error.message}`;
  } finally {
    setBusy(false);
  }
});

finishButton.addEventListener('click', async () => {
  if (busy || !sessionId) return;

  setBusy(true);
  statusText.textContent = 'Building the coaching report...';

  try {
    const data = await requestJson(`/api/interviews/${sessionId}/finish`, {
      method: 'POST'
    });

    renderMessages(data.messages || []);
    renderReport(data.report);
    answerInput.disabled = true;
    answerSubmitButton.disabled = true;
    finishButton.disabled = true;
    statusText.textContent = 'Report ready. Review the coach snapshot and the question-by-question gaps.';
  } catch (error) {
    statusText.textContent = `Failed to build the report: ${error.message}`;
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
    messagesEl.innerHTML = '<p>The full interview transcript will appear here.</p>';
    return;
  }

  messagesEl.className = 'messages';
  messagesEl.innerHTML = messages.map((message) => {
    const roleLabel = message.role === 'candidate' ? 'Candidate' : 'Interviewer';
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
    reportEl.innerHTML = '<p>No report data is available.</p>';
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
            <strong>${escapeHtml(item.title || 'Priority area')}</strong>
            <p>${escapeHtml(item.detail || '')}</p>
          </div>
        </div>
      `).join('')
    : '<p>Add more interview answers to generate a stronger coaching priority list.</p>';

  const weakAreaHtml = weakAreas.length
    ? weakAreas.map((item) => `<span class="pill amber">${escapeHtml(item)}</span>`).join('')
    : '<span class="pill">No obvious weak area yet</span>';

  const nextPracticeHtml = nextPractice.length
    ? nextPractice.map((item) => `
        <article class="practice-item">
          <strong>${escapeHtml(item.title || 'Next drill')}</strong>
          <p>${escapeHtml(item.detail || '')}</p>
        </article>
      `).join('')
    : '<p>Complete more answers to generate targeted next-practice recommendations.</p>';

  const snapshotStats = [
    {
      label: 'Overall score',
      value: overview.score ?? '-'
    },
    {
      label: 'Answered',
      value: `${overview.answeredQuestions ?? 0}/${overview.totalQuestions ?? 0}`
    },
    {
      label: 'Readiness',
      value: overview.readiness || '-'
    },
    {
      label: 'Interview signal',
      value: overview.hireSignal?.label || '-'
    }
  ].map((item) => `
      <div class="snapshot-stat">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
      </div>
    `).join('');

  const questionsHtml = (report.questions || []).map((item, index) => {
    const strengths = renderList(item.strengths, 'No clear strength captured.');
    const weaknesses = renderList(item.weaknesses, 'No major weakness captured.');
    const redFlags = renderList(item.redFlags, 'No obvious red flag.');

    return `
      <article class="report-card">
        <h3>Question ${index + 1} | ${escapeHtml(item.category || 'Uncategorized')}</h3>
        <p>${escapeHtml(item.question || '')}</p>
        <div class="meta-row">
          <span class="pill">${escapeHtml(`Score ${item.score ?? '-'}`)}</span>
          <span class="pill">${escapeHtml(`Attempts ${item.attempts ?? 1}`)}</span>
          <span class="pill">${escapeHtml(`Follow-ups ${item.followUpCount ?? 0}`)}</span>
        </div>
        <div class="section-label">Your answer summary</div>
        <p>${escapeHtml(item.userAnswerSummary || item.userAnswer || 'N/A')}</p>
        <div class="section-label">Reference answer</div>
        <p>${escapeHtml(item.referenceAnswer || 'N/A')}</p>
        <div class="section-label">Strong interview answer example</div>
        <p>${escapeHtml(item.excellentAnswer || 'N/A')}</p>
        <div class="section-label">Gap analysis</div>
        <p>${escapeHtml(item.gapAnalysis || 'N/A')}</p>
        <div class="section-label">Interviewer verdict</div>
        <div class="meta-row">
          <span class="pill ${getVerdictChipClass(item.interviewerVerdict)}">${escapeHtml(item.interviewerVerdict?.label || 'N/A')}</span>
        </div>
        <p>${escapeHtml(item.interviewerVerdict?.detail || 'No interviewer verdict available.')}</p>
        <div class="section-label">Resume grounding</div>
        <div class="meta-row">
          <span class="pill ${getResumeChipClass(item.resumeSupport)}">${escapeHtml(item.resumeSupport?.label || 'N/A')}</span>
        </div>
        <p>${escapeHtml(item.resumeSupport?.detail || 'No resume grounding analysis available.')}</p>
        <div class="section-label">Strengths</div>
        ${strengths}
        <div class="section-label">Weak spots</div>
        ${weaknesses}
        <div class="section-label">Risk signals</div>
        ${redFlags}
        <div class="section-label">Likely interviewer takeaway</div>
        <p>${escapeHtml(item.interviewerSignal || 'N/A')}</p>
        <div class="section-label">Competency signal</div>
        <div class="meta-row">
          <span class="pill ${getCompetencyChipClass(item.interviewerCompetencySignal)}">${escapeHtml(item.interviewerCompetencySignal?.label || 'N/A')}</span>
        </div>
        <p>${escapeHtml(item.interviewerCompetencySignal?.detail || 'No competency signal available.')}</p>
        <div class="section-label">Follow-up objective</div>
        <p>${escapeHtml(item.followUpObjective || 'N/A')}</p>
        <div class="section-label">Most likely next follow-up</div>
        <p>${escapeHtml(item.nextFollowUp || 'N/A')}</p>
        <div class="section-label">Coach tip</div>
        <p>${escapeHtml(item.coachTip || 'N/A')}</p>
        <div class="section-label">Improved answer</div>
        <p>${escapeHtml(item.improvedUserAnswer || 'N/A')}</p>
        <div class="section-label">Practice drill</div>
        <p>${escapeHtml(item.practiceDrill || 'N/A')}</p>
      </article>
    `;
  }).join('');

  reportEl.className = 'report';
  reportEl.innerHTML = `
    <article class="report-card snapshot-card">
      <h3>Coach snapshot</h3>
      <div class="snapshot-grid">${snapshotStats}</div>
      <div class="section-label">Overall summary</div>
      <p>${escapeHtml(overview.summary || 'N/A')}</p>
      <div class="section-label">Interviewer impression</div>
      <p>${escapeHtml(overview.interviewerImpression || 'N/A')}</p>
      <div class="section-label">Competency summary</div>
      <p>${escapeHtml(overview.competencySummary || 'N/A')}</p>
      <div class="section-label">Coaching focus</div>
      <p>${escapeHtml(overview.coachingFocus || 'Add more answers to surface coaching themes.')}</p>
      <div class="section-label">Real interview risk</div>
      <p>${escapeHtml(overview.riskSummary || 'Add more answers to estimate interview risk.')}</p>
      <div class="section-label">Resume grounding coverage</div>
      <p>${escapeHtml(overview.resumeCoverage || 'N/A')}</p>
      <p>${escapeHtml(overview.resumeGrounding || 'N/A')}</p>
      <div class="section-label">Level expectation</div>
      <p>${escapeHtml(overview.levelExpectation || 'N/A')}</p>
      <div class="section-label">Top coaching priorities</div>
      <div class="priority-list">${coachPriorityHtml}</div>
      <div class="section-label">Weak areas</div>
      <div class="meta-row">${weakAreaHtml}</div>
    </article>
    ${questionsHtml}
    <article class="report-card">
      <h3>Next practice</h3>
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
  return date.toLocaleTimeString('en-US', {
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

function getCompetencyChipClass(signal) {
  if (!signal) return '';
  if (signal.level === 'strong') return 'green';
  if (signal.level === 'risk') return 'amber';
  return '';
}
