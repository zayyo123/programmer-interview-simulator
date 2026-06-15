const QUESTION_USAGE_LEDGER_KEY = 'programmer-interview-question-usage-v1';
const DEVICE_ID_KEY = 'programmer-interview-device-id-v1';

const ROLE_LABEL_TO_VALUE = {
  '后端开发': 'backend',
  '前端开发': 'frontend',
  '全栈开发': 'fullstack',
  'Java 后端': 'java',
  'Go 后端': 'go',
  'Python 后端': 'python',
  '测试开发 / QA': 'qa',
  '运维 / DBA / 网络': 'ops',
  'DevOps / SRE': 'devops',
  '数据开发 / 数仓': 'data',
  'AI / 算法工程师': 'ai',
  '安全工程师': 'security',
  '架构师 / 技术管理': 'architect'
};

const LEVEL_LABEL_TO_VALUE = {
  初级: 'junior',
  中级: 'middle',
  高级: 'senior'
};

export function buildQuestionScopeKey(role, level) {
  return `${String(role || '').trim()}:${String(level || '').trim()}`;
}

function createEmptyLedger() {
  return {
    version: 1,
    deviceId: getOrCreateDeviceId(),
    scopes: {}
  };
}

function getOrCreateDeviceId() {
  try {
    const existing = localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;
    const next = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, next);
    return next;
  } catch {
    return `device-${Date.now()}`;
  }
}

export function loadQuestionUsageLedger() {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUESTION_USAGE_LEDGER_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return createEmptyLedger();
    return {
      ...createEmptyLedger(),
      ...parsed,
      deviceId: parsed.deviceId || getOrCreateDeviceId(),
      scopes: parsed.scopes && typeof parsed.scopes === 'object' ? parsed.scopes : {}
    };
  } catch {
    return createEmptyLedger();
  }
}

export function saveQuestionUsageLedger(ledger) {
  try {
    localStorage.setItem(QUESTION_USAGE_LEDGER_KEY, JSON.stringify(ledger));
  } catch {
    // 隐私模式或存储满时忽略，不影响本轮面试。
  }
}

function normalizeScope(scope = {}) {
  const usedQuestionIds = [...new Set(
    (Array.isArray(scope.usedQuestionIds) ? scope.usedQuestionIds : [])
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  )];

  return {
    usedQuestionIds,
    cycle: Math.max(1, Number(scope.cycle) || 1),
    sessions: Array.isArray(scope.sessions) ? scope.sessions.slice(-40) : [],
    exhaustedAt: scope.exhaustedAt || null,
    updatedAt: scope.updatedAt || null
  };
}

function ensureScope(ledger, scopeKey) {
  if (!ledger.scopes[scopeKey]) {
    ledger.scopes[scopeKey] = normalizeScope();
  } else {
    ledger.scopes[scopeKey] = normalizeScope(ledger.scopes[scopeKey]);
  }
  return ledger.scopes[scopeKey];
}

export function inferRoleValueFromLabel(label) {
  const text = String(label || '').trim();
  if (!text) return '';
  if (ROLE_LABEL_TO_VALUE[text]) return ROLE_LABEL_TO_VALUE[text];
  const option = [...document.querySelectorAll('select[name="role"] option')].find((item) => item.textContent === text);
  return option?.value || '';
}

export function inferLevelValueFromLabel(label) {
  const text = String(label || '').trim();
  if (!text) return '';
  if (LEVEL_LABEL_TO_VALUE[text]) return LEVEL_LABEL_TO_VALUE[text];
  const option = [...document.querySelectorAll('select[name="level"] option')].find((item) => item.textContent === text);
  return option?.value || '';
}

export function backfillQuestionUsageFromHistory(records = []) {
  const ledger = loadQuestionUsageLedger();
  let changed = false;

  for (const record of records) {
    const role = record.roleValue || inferRoleValueFromLabel(record.role);
    const level = record.levelValue || inferLevelValueFromLabel(record.level);
    if (!role || !level) continue;

    const scopeKey = buildQuestionScopeKey(role, level);
    const scope = ensureScope(ledger, scopeKey);
    const before = scope.usedQuestionIds.length;

    const questionIds = [
      ...(Array.isArray(record.questions) ? record.questions.map((item) => item.questionId) : []),
      ...(Array.isArray(record.uncoveredQuestions) ? record.uncoveredQuestions.map((item) => item.questionId) : [])
    ]
      .map((item) => String(item || '').trim())
      .filter(Boolean);

    scope.usedQuestionIds = [...new Set([...scope.usedQuestionIds, ...questionIds])];
    if (scope.usedQuestionIds.length !== before) changed = true;
  }

  if (changed) saveQuestionUsageLedger(ledger);
  return ledger;
}

export function getQuestionUsageState(role, level, poolSize = null) {
  const scopeKey = buildQuestionScopeKey(role, level);
  const ledger = loadQuestionUsageLedger();
  const scope = ensureScope(ledger, scopeKey);
  const used = scope.usedQuestionIds.length;
  const total = Number.isFinite(Number(poolSize)) ? Number(poolSize) : null;
  const remaining = total == null ? null : Math.max(0, total - used);

  return {
    scopeKey,
    cycle: scope.cycle,
    used,
    total,
    remaining,
    usedQuestionIds: [...scope.usedQuestionIds]
  };
}

export function peekSessionQuestionExcludes({
  role,
  level,
  poolSize,
  reuseAllowedQuestionIds = []
}) {
  const state = getQuestionUsageState(role, level, poolSize);
  const reuse = new Set(
    (Array.isArray(reuseAllowedQuestionIds) ? reuseAllowedQuestionIds : [])
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  );
  const excludeQuestionIds = state.usedQuestionIds.filter((id) => !reuse.has(id));
  const total = state.total ?? 0;
  const remaining = total > 0 ? Math.max(0, total - excludeQuestionIds.length) : null;

  return {
    excludeQuestionIds,
    reuseAllowedQuestionIds: [...reuse],
    cycle: state.cycle,
    used: excludeQuestionIds.length,
    total: state.total,
    remaining,
    scopeKey: state.scopeKey
  };
}

export function resolveSessionQuestionExcludes({
  role,
  level,
  questionCount,
  poolSize,
  reuseAllowedQuestionIds = []
}) {
  const needed = Math.max(1, Math.floor(Number(questionCount) || 1));
  let peek = peekSessionQuestionExcludes({ role, level, poolSize, reuseAllowedQuestionIds });
  let cycleReset = false;

  if (peek.total > 0 && (peek.remaining ?? 0) < needed && peek.total >= needed) {
    const scopeKey = buildQuestionScopeKey(role, level);
    const ledger = loadQuestionUsageLedger();
    const scope = ensureScope(ledger, scopeKey);
    const reuse = new Set(peek.reuseAllowedQuestionIds);
    scope.usedQuestionIds = [...reuse];
    scope.cycle += 1;
    scope.exhaustedAt = new Date().toISOString();
    scope.updatedAt = scope.exhaustedAt;
    ledger.scopes[scopeKey] = scope;
    saveQuestionUsageLedger(ledger);
    cycleReset = true;
    peek = peekSessionQuestionExcludes({ role, level, poolSize, reuseAllowedQuestionIds });
  }

  return {
    ...peek,
    cycleReset
  };
}

export function recordSessionQuestionUsage({
  role,
  level,
  sessionId,
  questionIds = []
}) {
  const scopeKey = buildQuestionScopeKey(role, level);
  const ledger = loadQuestionUsageLedger();
  const scope = ensureScope(ledger, scopeKey);
  const normalizedIds = [...new Set(
    questionIds.map((item) => String(item || '').trim()).filter(Boolean)
  )];

  if (!normalizedIds.length) return scope;

  scope.usedQuestionIds = [...new Set([...scope.usedQuestionIds, ...normalizedIds])];
  scope.sessions = [
    {
      sessionId: sessionId || '',
      at: new Date().toISOString(),
      questionIds: normalizedIds
    },
    ...scope.sessions
  ].slice(0, 40);
  scope.updatedAt = new Date().toISOString();
  ledger.scopes[scopeKey] = scope;
  saveQuestionUsageLedger(ledger);
  return scope;
}

export function resetQuestionUsageScope(role, level) {
  const scopeKey = buildQuestionScopeKey(role, level);
  const ledger = loadQuestionUsageLedger();
  ledger.scopes[scopeKey] = normalizeScope({ cycle: 1 });
  saveQuestionUsageLedger(ledger);
}

export function extractReuseQuestionIdsFromResume(resumeText = '') {
  const text = String(resumeText || '');
  const ids = [];
  const lineMatch = text.match(/^题目ID[：:]\s*(\S+)/m);
  if (lineMatch?.[1]) ids.push(lineMatch[1].trim());
  return [...new Set(ids.filter(Boolean))];
}
