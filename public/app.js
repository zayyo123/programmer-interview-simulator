const setupForm = document.querySelector('#setupForm');
const answerForm = document.querySelector('#answerForm');
const answerInput = document.querySelector('#answerInput');
const messagesEl = document.querySelector('#messages');
const liveCoachEl = document.querySelector('#liveCoach');
const reportEl = document.querySelector('#report');
const providerText = document.querySelector('#providerText');
const statusText = document.querySelector('#statusText');
const finishButton = document.querySelector('#finishButton');
const answerSubmitButton = answerForm.querySelector('button[type="submit"]');

let sessionId = null;
let busy = false;
let latestLiveCoachSnapshot = null;
let liveCoachDetailsOpen = false;

liveCoachEl.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-live-coach-toggle]');
  if (!toggle || !latestLiveCoachSnapshot) return;

  liveCoachDetailsOpen = !liveCoachDetailsOpen;
  renderLiveCoach(latestLiveCoachSnapshot);
});

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
  statusText.textContent = '正在开始面试...';

  try {
    const data = await requestJson('/api/interviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    sessionId = data.sessionId;
    liveCoachDetailsOpen = false;
    providerText.textContent = getProviderText(data.provider);
    renderMessages(data.messages || []);
    renderLiveCoach(data.liveCoach);
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>面试正在进行中。结束后会生成针对性的复盘反馈。</p>';
    statusText.textContent = '面试已开始。请像真实技术面一样回答。';
    answerInput.value = '';
    answerInput.disabled = false;
    answerSubmitButton.disabled = false;
    finishButton.disabled = false;
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
    answerInput.disabled = true;
    answerSubmitButton.disabled = true;
    finishButton.disabled = true;
    statusText.textContent = '报告已生成。请查看总览和逐题差距。';
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
    <div class="live-coach-actions">
      <button type="button" class="ghost-button live-coach-toggle" data-live-coach-toggle aria-expanded="${liveCoachDetailsOpen}">
        ${toggleText}
      </button>
    </div>
    ${detailsHtml}
  `;
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

function renderReport(report) {
  if (!report) {
    reportEl.className = 'report empty-state';
    reportEl.innerHTML = '<p>暂无报告数据。</p>';
    return;
  }

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

    return `
      <article class="report-card">
        <h3>第 ${index + 1} 题 | ${escapeHtml(item.category || '未分类')}</h3>
        <p>${escapeHtml(item.question || '')}</p>
        <div class="meta-row">
          <span class="pill">${escapeHtml(`得分 ${item.score ?? '-'}`)}</span>
          <span class="pill">${escapeHtml(`回答次数 ${item.attempts ?? 1}`)}</span>
          <span class="pill">${escapeHtml(`追问 ${item.followUpCount ?? 0}`)}</span>
        </div>
        <div class="section-label">你的回答摘要</div>
        <p>${escapeHtml(item.userAnswerSummary || item.userAnswer || '暂无')}</p>
        <div class="section-label">参考答案</div>
        <p>${escapeHtml(item.referenceAnswer || '暂无')}</p>
        <div class="section-label">优秀回答示例</div>
        <p>${escapeHtml(item.excellentAnswer || '暂无')}</p>
        <div class="section-label">差距分析</div>
        <p>${escapeHtml(item.gapAnalysis || '暂无')}</p>
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
        <div class="section-label">优化后的回答</div>
        <p>${escapeHtml(item.improvedUserAnswer || '暂无')}</p>
        <div class="section-label">练习任务</div>
        <p>${escapeHtml(item.practiceDrill || '暂无')}</p>
      </article>
    `;
  }).join('');

  reportEl.className = 'report';
  reportEl.innerHTML = `
    <article class="report-card snapshot-card">
      <h3>教练总览</h3>
      <div class="snapshot-grid">${snapshotStats}</div>
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
      <h3>下一步练习</h3>
      <div class="section-label">分阶段计划</div>
      ${practicePlanHtml}
      <div class="section-label">建议练习</div>
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

function getProviderText(provider) {
  return {
    mock: '本地模拟面试官',
    gemini: 'Gemini',
    openrouter: 'OpenRouter',
    ollama: 'Ollama'
  }[provider] || provider || '本地模拟面试官';
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
