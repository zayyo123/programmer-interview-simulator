import { levelLabels, questionBank, roleLabels, styleLabels } from './questions.js';

const roleTopics = {
  backend: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  frontend: ['项目经历', '前端', '前端', '算法', '前端'],
  fullstack: ['项目经历', '项目经历', '前端', '系统设计', '算法'],
  java: ['项目经历', 'Java', 'MySQL', 'Redis', '系统设计', '算法'],
  go: ['项目经历', 'Go', 'MySQL', 'Redis', '系统设计', '算法'],
  python: ['项目经历', 'Python', 'MySQL', 'Redis', '系统设计', '算法']
};

const fillerWords = ['然后', '就是', '那个', '可能', '感觉', '大概', '比较', '这个', '那个时候'];

const levelDifficultyTargets = {
  junior: [1, 2, 2, 2, 2],
  middle: [2, 2, 3, 2, 3],
  senior: [2, 3, 3, 3, 3]
};

const roleStageBlueprints = {
  backend: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  frontend: ['project', 'project', 'knowledge', 'algorithm', 'knowledge'],
  fullstack: ['project', 'project', 'knowledge', 'system-design', 'algorithm'],
  java: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  go: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  python: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm']
};

const levelExpectations = {
  junior: {
    minScoreToMoveNext: 62,
    minMustHaveRatio: 0.5,
    minKeywordHits: 2,
    preferredAnswerLength: 80,
    labels: ['能把基础主线讲清楚', '能说出自己做过的内容'],
    focus: '先把背景、职责、原理和结果讲顺',
    riskThreshold: '基础题如果连续追问两轮还答不稳，容易被判断为经验偏浅'
  },
  middle: {
    minScoreToMoveNext: 68,
    minMustHaveRatio: 0.6,
    minKeywordHits: 3,
    preferredAnswerLength: 120,
    labels: ['主线完整', '能解释取舍和落地方式'],
    focus: '补强取舍、边界和场景化表达',
    riskThreshold: '一旦追到实现细节和取舍，稳定性会直接影响通过率'
  },
  senior: {
    minScoreToMoveNext: 74,
    minMustHaveRatio: 0.75,
    minKeywordHits: 4,
    preferredAnswerLength: 150,
    labels: ['不只会结论，还能讲判断过程', '能说明指标、风险和治理'],
    focus: '回答里要带上判断顺序、权衡和结果证据',
    riskThreshold: '如果缺少定位顺序、取舍或指标，面试官会直接下调级别判断'
  }
};

export function createInterviewPlan(config) {
  const role = config.role || 'backend';
  const level = config.level || 'middle';
  const targetCount = clamp(Number(config.questionCount || 5), 3, 8);
  const topics = roleTopics[role] || roleTopics.backend;
  const stages = roleStageBlueprints[role] || roleStageBlueprints.backend;
  const difficultyTargets = levelDifficultyTargets[level] || levelDifficultyTargets.middle;
  const resumeSignals = extractResumeSignals(config.resume);
  const available = buildCandidateQuestionPool(role, level, resumeSignals);
  const selected = [];

  for (let index = 0; index < Math.min(targetCount, topics.length); index += 1) {
    const match = selectBestQuestion({
      available,
      selected,
      preferredCategory: topics[index],
      preferredType: stages[index] || stages[stages.length - 1] || 'knowledge',
      targetDifficulty: difficultyTargets[index] || difficultyTargets[difficultyTargets.length - 1] || 2,
      resumeSignals
    });

    if (match) selected.push(match);
  }

  while (selected.length < Math.min(targetCount, available.length)) {
    const match = selectBestQuestion({
      available,
      selected,
      preferredCategory: null,
      preferredType: stages[selected.length] || 'knowledge',
      targetDifficulty: difficultyTargets[selected.length] || difficultyTargets[difficultyTargets.length - 1] || 2,
      resumeSignals
    });

    if (!match) break;
    selected.push(match);
  }

  return selected;
}

export function createOpening(config, firstQuestion) {
  const role = roleLabels[config.role] || config.role;
  const level = levelLabels[config.level] || config.level;
  const style = styleLabels[config.style] || '正常';
  const resumeLine = config.resume?.trim()
    ? '我会结合你提供的简历或项目经历来追问细节，重点看你的真实贡献、技术判断和复盘能力。'
    : '如果涉及项目经历，请按真实面试方式补充背景、职责和结果。';

  const styleLine = {
    normal: '我会按真实技术面试节奏推进，回答完整时切题进入下一题，回答泛泛时会继续追问。',
    pressure: '这轮我会更关注边界条件、取舍原因和问题定位过程，如果回答不够扎实，我会持续深挖。',
    coaching: '这轮以训练为主。我会用更明确的追问帮你补齐结构，但仍然按真实面试标准评估。'
  }[config.style] || '我会按真实技术面试节奏推进，回答完整时切题进入下一题，回答泛泛时会继续追问。';

  return [
    `你好，我们开始一场${level}${role}模拟面试。`,
    `本次面试风格是${style}，会覆盖项目经历、基础知识、工程实践，以及必要的算法或系统设计。`,
    resumeLine,
    styleLine,
    '回答时尽量结构化，优先说明结论、关键原理、方案取舍和实际场景。',
    `第一个问题：${firstQuestion.question}`
  ].join('\n');
}

export function getCurrentQuestion(session) {
  if (session.completed) return null;
  return session.plan[session.currentIndex] || null;
}

export function recordAnswerForCurrentQuestion(session, answer) {
  const question = getCurrentQuestion(session);
  if (!question) return;

  const normalizedAnswer = String(answer || '').trim();
  if (!normalizedAnswer) return;

  const currentEntry = session.answers.find((entry) => entry.question.id === question.id);
  if (!currentEntry) {
    session.answers.push({
      question,
      answer: normalizedAnswer,
      attempts: 1,
      followUpCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return;
  }

  currentEntry.answer = mergeAnswerAttempts(currentEntry.answer, normalizedAnswer);
  currentEntry.attempts += 1;
  currentEntry.followUpCount = Math.max(0, currentEntry.attempts - 1);
  currentEntry.updatedAt = new Date().toISOString();
}

export function getRecordedAnswerForCurrentQuestion(session) {
  const question = getCurrentQuestion(session);
  if (!question) return '';

  const entry = session.answers.find((item) => item.question.id === question.id);
  return entry?.answer || '';
}

export function buildInterviewPrompt({ session, answer }) {
  const question = getCurrentQuestion(session);
  const nextQuestion = session.plan[session.currentIndex + 1];
  const effectiveAnswer = getRecordedAnswerForCurrentQuestion(session) || answer;
  const evaluation = evaluateAnswer(effectiveAnswer, question, {
    level: session.config.level
  });
  const history = session.messages
    .slice(-8)
    .map((message) => `${message.role === 'candidate' ? '候选人' : '面试官'}：${message.content}`)
    .join('\n');

  return [
    '你是一名资深程序员技术面试官。',
    '你的任务是根据候选人的回答，判断是否需要追问，并保持真实面试节奏。',
    '不要透露参考答案，不要直接给标准答案。',
    '如果回答明显不完整，优先追问最关键的缺口。',
    '如果回答比较完整，先给简短反馈，再进入下一题。',
    '输出必须是中文，语气自然，像真实技术面试官，不要像助教讲解。',
    '',
    `岗位：${roleLabels[session.config.role] || session.config.role}`,
    `级别：${levelLabels[session.config.level] || session.config.level}`,
    `面试风格：${styleLabels[session.config.style] || session.config.style}`,
    `当前问题：${question?.question || '无'}`,
    `当前题目关键词：${question?.keywords?.join('、') || '无'}`,
    `命中要点：${evaluation.hitKeywords.join('、') || '无'}`,
    `待补充要点：${evaluation.missingKeywords.join('、') || '无'}`,
    `追问建议：${evaluation.followUpFocus || '无'}`,
    `系统判断是否进入下一题：${evaluation.readyToMoveNext ? '是' : '否'}`,
    `下一题：${nextQuestion?.question || '无'}`,
    '',
    '最近对话：',
    history,
    '',
    `候选人最新回答：${answer}`,
    '',
    evaluation.readyToMoveNext && nextQuestion
      ? '请先用一句话评价当前回答，再自然地切到下一题。'
      : '请只追问一个最关键的问题，逼近真实面试中的澄清与深挖。',
    '请输出面试官下一句。'
  ].join('\n');
}

export function shouldMoveToNextQuestion(answer, question) {
  return evaluateAnswer(answer, question).readyToMoveNext;
}

export function createFallbackInterviewerReply({ session, answer }) {
  const question = getCurrentQuestion(session);
  if (!question) {
    return '好的，这轮问题已经结束。你可以点击结束面试，我会为你生成复盘报告。';
  }

  const answerEntry = session.answers.find((entry) => entry.question.id === question.id);
  const effectiveAnswer = answerEntry?.answer || answer;
  const evaluation = evaluateAnswer(effectiveAnswer, question, {
    followUpCount: answerEntry?.followUpCount || 0,
    level: session.config.level
  });
  if (!evaluation.readyToMoveNext) {
    return createFollowUpReply(
      question,
      evaluation,
      session.config.style,
      answerEntry?.followUpCount || 0,
      session.config.level
    );
  }

  const nextQuestion = session.plan[session.currentIndex + 1];
  if (!nextQuestion) {
    return createClosingReply(evaluation);
  }

  return createNextQuestionReply(nextQuestion, evaluation, session.config.style);
}

export function maybeAdvanceQuestion(session, answer) {
  const question = getCurrentQuestion(session);
  if (!question) return;
  const effectiveAnswer = getRecordedAnswerForCurrentQuestion(session) || answer;
  if (!evaluateAnswer(effectiveAnswer, question, { level: session.config.level }).readyToMoveNext) return;
  if (session.currentIndex < session.plan.length - 1) {
    session.currentIndex += 1;
    return;
  }

  session.currentIndex = session.plan.length;
  session.completed = true;
  session.completedAt = new Date().toISOString();
}

export function createReport(session) {
  const levelProfile = getLevelExpectation(session.config.level);
  const resumeSummary = summarizeResumeForInterview(session.config.resume);
  const answersByQuestion = session.answers.map((entry) => {
    const followUpCount = entry.followUpCount || Math.max(0, (entry.attempts || 1) - 1);
    const evaluation = evaluateAnswer(entry.answer, entry.question, {
      followUpCount,
      level: session.config.level
    });

    return {
      question: entry.question.question,
      category: entry.question.category,
      attempts: entry.attempts || 1,
      followUpCount,
      userAnswer: entry.answer,
      userAnswerSummary: summarizeAnswer(entry.answer),
      referenceAnswer: entry.question.referenceAnswer,
      excellentAnswer: entry.question.excellentAnswer,
      score: evaluation.score,
      confidence: describeAnswerConfidence(evaluation, entry.attempts || 1, levelProfile),
      interviewerVerdict: createInterviewerVerdict(entry.question, evaluation, entry.attempts || 1, levelProfile),
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      redFlags: evaluation.redFlags,
      followUpCategory: evaluation.followUpCategory,
      followUpObjective: createFollowUpObjective(entry.question, evaluation),
      followUpSignal: createFollowUpSignal(evaluation, entry.attempts || 1),
      coachTip: createCoachTip(entry.question, evaluation, levelProfile),
      gapAnalysis: createGapAnalysis(entry.question, evaluation),
      resumeSupport: createResumeSupport(entry.question, entry.answer, session.config.resume),
      interviewerSignal: createInterviewerSignal(entry.question, evaluation, entry.attempts || 1),
      interviewerCompetencySignal: createInterviewerCompetencySignal(
        entry.question,
        evaluation,
        entry.attempts || 1,
        levelProfile
      ),
      improvedUserAnswer: improveAnswer(entry.answer, entry.question, evaluation),
      nextFollowUp: buildSuggestedFollowUp(entry.question, evaluation, {
        followUpCount,
        level: session.config.level,
        style: session.config.style
      }) || '这一题可以继续围绕实现细节、边界情况和方案取舍做深挖。',
      practiceDrill: createPracticeDrill(entry.question, evaluation)
    };
  });

  const weakAreas = answersByQuestion
    .filter((item) => item.score < 75 || item.gapAnalysis.includes('还需要补强'))
    .map((item) => item.category);
  const coachPriorities = createCoachPriorities(answersByQuestion);
  const interviewPatterns = summarizeInterviewPatterns(answersByQuestion);

  return {
    overview: {
      role: roleLabels[session.config.role] || session.config.role,
      level: levelLabels[session.config.level] || session.config.level,
      style: styleLabels[session.config.style] || session.config.style,
      answeredQuestions: session.answers.length,
      totalQuestions: session.plan.length,
      score: estimateScore(answersByQuestion),
      readiness: describeReadiness(answersByQuestion, levelProfile),
      summary: createOverallSummary(session, answersByQuestion, levelProfile, interviewPatterns),
      interviewerImpression: createInterviewerImpression(session, answersByQuestion, levelProfile, interviewPatterns),
      hireSignal: createHiringSignal(answersByQuestion, levelProfile, interviewPatterns),
      competencySummary: summarizeCompetencySignals(answersByQuestion, levelProfile),
      coachingFocus: createCoachingFocus(answersByQuestion, levelProfile, interviewPatterns),
      riskSummary: createRiskSummary(answersByQuestion, levelProfile, interviewPatterns),
      resumeSummary,
      resumeCoverage: createResumeCoverageSummary(session, answersByQuestion),
      resumeGrounding: createResumeGroundingOverview(answersByQuestion, resumeSummary),
      levelExpectation: createLevelExpectationSummary(levelProfile),
      coachPriorities
    },
    questions: answersByQuestion,
    weakAreas: [...new Set(weakAreas)],
    nextPractice: createNextPractice(answersByQuestion, weakAreas, interviewPatterns)
  };
}

function evaluateAnswer(answer, question, context = {}) {
  const levelProfile = getLevelExpectation(context.level);
  if (!question) {
    return {
      score: 100,
      readyToMoveNext: true,
      hitKeywords: [],
      missingKeywords: [],
      strengths: [],
      weaknesses: [],
      followUpCategory: 'complete',
      followUpFocus: '',
      redFlags: [],
      rubricHits: {
        mustHave: [],
        goodToHave: []
      },
      levelProfile,
      communication: {
        hasStructure: true,
        hasMetrics: false,
        hasTradeoff: false,
        hasExample: false,
        hasOwnership: false,
        hasDiagnosisFlow: false
      }
    };
  }

  const rubric = question.scoringRubric || { mustHave: [], goodToHave: [], redFlags: [] };
  const hitKeywords = question.keywords.filter((keyword) => matchesConcept(answer, keyword));
  const missingKeywords = question.keywords.filter((keyword) => !matchesConcept(answer, keyword));
  const mustHaveHits = rubric.mustHave.filter((item) => matchesConcept(answer, item));
  const goodToHaveHits = rubric.goodToHave.filter((item) => matchesConcept(answer, item));
  const communication = communicationHints(answer);
  const redFlags = detectRedFlags(answer, question, rubric, communication);
  const requiresOwnership = question.type === 'project';
  const requiresEvidence = ['project', 'system-design'].includes(question.type);
  const requiresTradeoff = levelProfile !== levelExpectations.junior && question.type !== 'algorithm';
  const requiresDiagnosisFlow = question.type === 'knowledge'
    && question.difficulty >= 3
    && question.keywords.some((keyword) => matchesConcept(keyword, '先定位'));
  const fillerCount = fillerWords.reduce((count, word) => count + countOccurrences(answer, word), 0);
  const concisePenalty = answer.trim().length < Math.max(40, levelProfile.preferredAnswerLength - 40) ? 12 : 0;
  const fillerPenalty = fillerCount >= 6 ? 6 : 0;
  const redFlagPenalty = Math.min(12, redFlags.length * 4);
  const keywordScore = question.keywords.length
    ? Math.round((hitKeywords.length / question.keywords.length) * 35)
    : 35;
  const mustHaveScore = rubric.mustHave.length
    ? Math.round((mustHaveHits.length / rubric.mustHave.length) * 35)
    : 35;
  const goodToHaveScore = rubric.goodToHave.length
    ? Math.round((goodToHaveHits.length / rubric.goodToHave.length) * 10)
    : 10;
  const communicationScore = [
    communication.hasStructure,
    communication.hasMetrics,
    communication.hasTradeoff,
    communication.hasExample
  ].filter(Boolean).length * 5;
  const depthPenalty = (context.followUpCount || 0) >= 2 && mustHaveHits.length < rubric.mustHave.length ? 4 : 0;
  const levelPenalty = calculateLevelPenalty(question, communication, levelProfile);
  const realismPenalty = [
    requiresOwnership && !communication.hasOwnership ? 8 : 0,
    requiresEvidence && !communication.hasExample ? 6 : 0,
    requiresTradeoff && !communication.hasTradeoff ? 4 : 0,
    requiresDiagnosisFlow && !communication.hasDiagnosisFlow ? 6 : 0
  ].reduce((sum, value) => sum + value, 0);
  const rawScore = clamp(
    keywordScore + mustHaveScore + goodToHaveScore + communicationScore
      - concisePenalty - fillerPenalty - redFlagPenalty - levelPenalty - realismPenalty,
    0,
    100
  );
  const score = clamp(rawScore - depthPenalty, 0, 100);
  const followUpCategory = classifyFollowUpCategory(question, rubric, mustHaveHits, missingKeywords, communication);
  const readyToMoveNext = mustHaveHits.length >= Math.max(1, Math.ceil(rubric.mustHave.length * levelProfile.minMustHaveRatio))
    && (hitKeywords.length >= Math.min(levelProfile.minKeywordHits, question.keywords.length) || answer.trim().length >= levelProfile.preferredAnswerLength)
    && (!requiresOwnership || communication.hasOwnership)
    && (!requiresEvidence || communication.hasExample)
    && (!requiresTradeoff || communication.hasTradeoff)
    && (!requiresDiagnosisFlow || communication.hasDiagnosisFlow)
    && score >= levelProfile.minScoreToMoveNext;

  return {
    score,
    readyToMoveNext,
    hitKeywords,
    missingKeywords,
    strengths: collectStrengths(question, mustHaveHits, goodToHaveHits, communication),
    weaknesses: collectWeaknesses(question, rubric, communication, missingKeywords),
    redFlags,
    followUpCategory,
    followUpFocus: createFollowUpFocus(question, rubric, mustHaveHits, missingKeywords, communication, followUpCategory),
    rubricHits: {
      mustHave: mustHaveHits,
      goodToHave: goodToHaveHits
    },
    levelProfile,
    communication
  };
}

function createFollowUpReply(question, evaluation, style, followUpCount = 0, level = 'middle') {
  const prefix = {
    normal: '我想继续确认一个关键点：',
    pressure: '这个回答还不够落地，我继续追问：',
    coaching: '先把这块补完整：'
  }[style] || '我想继续确认一个关键点：';

  const escalation = followUpCount >= 2
    ? '这已经是这题的连续追问了，别再讲概念，直接讲你做过的判断、细节和结果。'
    : '';
  const objective = createFollowUpObjective(question, evaluation);
  const suggestedFollowUp = buildSuggestedFollowUp(question, evaluation, {
    followUpCount,
    level,
    style
  });
  const objectiveLead = objective && followUpCount < 2 ? `${objective} ` : '';
  return `${prefix}${escalation}${objectiveLead}${suggestedFollowUp}`;
}

function createNextQuestionReply(nextQuestion, evaluation, style) {
  const feedback = createPositiveFeedback(evaluation, style);
  return `${feedback}下一题：${nextQuestion.question}`;
}

function createClosingReply(evaluation) {
  const feedback = createPositiveFeedback(evaluation, 'normal');
  return `${feedback}这轮主要问题已经问完，你可以点击结束面试生成复盘报告。`;
}

function createPositiveFeedback(evaluation, style) {
  if (style === 'pressure') {
    return evaluation.score >= 82
      ? '这题核心点基本说到了，但表达还可以更紧凑。'
      : '这题先到这里，后面复盘里我会继续指出缺口。';
  }

  if (style === 'coaching') {
    return evaluation.score >= 82
      ? '这题回答方向是对的，而且已经有一定结构。'
      : '这题先到这里，你的主线有了，但复盘里还会给你更具体的补强建议。';
  }

  return evaluation.score >= 82
    ? '好的，这题核心点回答得比较完整。'
    : '好的，这题先到这里，主线基本有了。';
}

function createGapAnalysis(question, evaluation) {
  const missingMustHave = question.scoringRubric.mustHave.filter((item) => {
    return !evaluation.rubricHits.mustHave.includes(item);
  });
  const missingGoodToHave = question.scoringRubric.goodToHave.filter((item) => {
    return !evaluation.rubricHits.goodToHave.includes(item);
  });
  const communicationGaps = [];

  if (!evaluation.communication.hasStructure) communicationGaps.push('表达结构不够清晰');
  if (!evaluation.communication.hasTradeoff && question.type !== 'algorithm') communicationGaps.push('缺少方案取舍或原因');
  if (!evaluation.communication.hasExample && question.type !== 'knowledge') communicationGaps.push('缺少真实场景或案例');
  if (!evaluation.communication.hasMetrics && ['project', 'system-design'].includes(question.type)) communicationGaps.push('缺少结果指标或量化信息');
  if (evaluation.redFlags.length) communicationGaps.push(`面试官容易警惕这些风险信号：${evaluation.redFlags.join('、')}`);

  const parts = [];
  if (missingMustHave.length) parts.push(`这题先丢分在核心点没答实：${missingMustHave.join('、')}`);
  if (missingGoodToHave.length) parts.push(`如果想把这题从“能答”拉到“能打”，继续补：${missingGoodToHave.join('、')}`);
  if (communicationGaps.length) parts.push(`表达上最影响说服力的是：${communicationGaps.join('、')}`);
  if (evaluation.followUpCategory !== 'complete') {
    parts.push(`真实面试里最可能被继续追问的是：${describeFollowUpCategory(evaluation.followUpCategory)}`);
    parts.push(`下一句就该补：${createImmediateFix(question, evaluation)}`);
  }

  return parts.length
    ? `${parts.join('；')}。`
    : '回答已经覆盖主要考点，下一步重点是把表达再压缩得更像真实面试里的高质量口述。';
}

function summarizeAnswer(answer) {
  const trimmed = answer.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= 100) return trimmed;
  return `${trimmed.slice(0, 100)}...`;
}

function mergeAnswerAttempts(previousAnswer, latestAnswer) {
  const previous = String(previousAnswer || '').trim();
  const latest = String(latestAnswer || '').trim();

  if (!previous) return latest;
  if (!latest || previous === latest) return previous;

  return `${previous}\n[补充回答]\n${latest}`;
}

function improveAnswer(answer, question, evaluation) {
  const opening = evaluation.communication.hasStructure
    ? '可以继续把这段回答压缩成更像面试口述的版本：'
    : '建议按“结论 -> 原理/方案 -> 场景/结果”的顺序重组回答：';
  const framework = buildAnswerFramework(question, evaluation);
  const supplement = framework
    ? ` 你可以直接按这个框架重讲：${framework}`
    : '';

  return `${opening}${question.excellentAnswer}${supplement}`;
}

function createInterviewerVerdict(question, evaluation, attempts, levelProfile = getLevelExpectation('middle')) {
  const missingMustHave = question.scoringRubric.mustHave.filter((item) => {
    return !evaluation.rubricHits.mustHave.includes(item);
  });
  const concernCount = missingMustHave.length + evaluation.redFlags.length;
  const repeatedPressure = attempts >= 3 && evaluation.followUpCategory !== 'complete';

  if (evaluation.score >= levelProfile.minScoreToMoveNext + 12 && attempts <= 1 && !concernCount) {
    return {
      level: 'strong',
      label: '面试官判断：这一题能站住',
      detail: '首轮回答就覆盖了核心考点，继续深挖时更可能考察你的上限，而不是补基础。'
    };
  }

  if (repeatedPressure || concernCount >= 3) {
    return {
      level: 'risk',
      label: '面试官判断：这一题会明显扣分',
      detail: `连续追问后仍暴露“${describeFollowUpCategory(evaluation.followUpCategory)}”问题，面试官通常会把它记成稳定性风险。`
    };
  }

  if (evaluation.readyToMoveNext) {
    return {
      level: 'borderline',
      label: '面试官判断：能过题，但说服力一般',
      detail: '主线基本成立，但更像补出来的答案；真实面试里通常不会把这题算成明显亮点。'
    };
  }

  if (missingMustHave.length) {
    return {
      level: 'risk',
      label: '面试官判断：核心点没答实',
      detail: `这题最危险的是 ${missingMustHave[0]} 没有答实，面试官往往会据此怀疑基础是否真的掌握。`
    };
  }

  return {
    level: 'borderline',
    label: '面试官判断：回答还不够稳',
    detail: `当前主要卡在“${describeFollowUpCategory(evaluation.followUpCategory)}”，如果同类题连续出现，整体评价会被拉低。`
  };
}

function estimateScore(answersByQuestion) {
  if (!answersByQuestion.length) return 0;
  const total = answersByQuestion.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / answersByQuestion.length);
}

function createNextPractice(answersByQuestion, weakAreas, interviewPatterns = summarizeInterviewPatterns([])) {
  const lowest = [...answersByQuestion].sort((a, b) => a.score - b.score).slice(0, 2);
  const suggestions = lowest.map((item) => {
    return {
      title: `重练 ${item.category}`,
      goal: item.interviewerSignal,
      action: `围绕“${item.question}”做一次 90 秒重答，先补 ${createImmediateFix(item.question, {
        followUpCategory: item.followUpCategory,
        followUpFocus: item.nextFollowUp,
        weaknesses: item.weaknesses
      })}`
    };
  });

  if (!weakAreas.length) {
    suggestions.push({
      title: '压缩项目表达',
      goal: '把完整经历压缩成真实面试里的高密度口述。',
      action: '继续提高回答密度，把项目题练到 2 分钟内讲清背景、职责、方案、结果和复盘。'
    });
    suggestions.push({
      title: '增加压力追问',
      goal: '避免一被深挖就只剩概念和结论。',
      action: '重点训练边界情况、定位过程和技术取舍。'
    });
    if (interviewPatterns.primary) {
      suggestions.unshift({
        title: `专项修正${interviewPatterns.primary.label}`,
        goal: interviewPatterns.primary.interviewerView,
        action: interviewPatterns.primary.practiceAction
      });
    }
    return dedupePracticeSuggestions(suggestions).slice(0, 3);
  }

  if (interviewPatterns.primary) {
    suggestions.push({
      title: `专项修正${interviewPatterns.primary.label}`,
      goal: interviewPatterns.primary.interviewerView,
      action: interviewPatterns.primary.practiceAction
    });
  }
  suggestions.push({
    title: `专项复习 ${[...new Set(weakAreas)].join('、')}`,
    goal: '把零散知识点串成可被追问的完整主线。',
    action: '每个薄弱主题至少准备一版“定义/原理 -> 场景 -> 取舍/边界 -> 结果”的口述答案。'
  });
  return dedupePracticeSuggestions(suggestions).slice(0, 3);
}

function createCoachTip(question, evaluation, levelProfile = getLevelExpectation('middle')) {
  if (evaluation.redFlags.length) {
    return `先修正这些明显风险信号：${evaluation.redFlags.join('、')}`;
  }

  if (evaluation.followUpCategory === 'ownership') {
    return '先用“背景→我的职责→具体判断→结果”的顺序回答，避免一直停留在团队视角。';
  }

  if (evaluation.followUpCategory === 'tradeoff') {
    return '把取舍讲完整：为什么这样选、不选什么、代价和边界分别是什么。';
  }

  if (evaluation.followUpCategory === 'impact') {
    return '补充结果指标，把改动前后的延迟、成功率、吞吐或人工成本变化讲出来。';
  }

  return `按“${levelProfile.focus}”这个标准，围绕“${question.category}”先收敛主线，再主动补一个场景或取舍细节。`;
}

function createFollowUpObjective(question, evaluation) {
  const objective = {
    core: '我现在不是想听更多概念，而是确认你有没有答实这题的核心考点。',
    ownership: '我现在想确认这件事到底是不是你亲自做过，而不只是团队层面的描述。',
    tradeoff: '我现在想确认你是否真的做过方案判断，而不只是记住了结论。',
    evidence: '我现在想确认你回答背后有没有真实场景支撑，而不只是泛泛而谈。',
    impact: '我现在想确认你的方案是否真的产生过结果，而不只是做过动作。',
    detail: '我现在想确认你是否掌握到了可追问的实现细节，而不只是停在表面。'
  }[evaluation.followUpCategory];

  if (!objective) return '';
  if (question.type === 'algorithm' && evaluation.followUpCategory === 'detail') {
    return '我现在想确认你的解法是不是你自己真正能写出来并解释复杂度。';
  }

  return objective;
}

function createCoachPriorities(answersByQuestion) {
  if (!answersByQuestion.length) return [];

  return [...answersByQuestion]
    .sort((left, right) => {
      const leftRisk = scoreCoachPriority(left);
      const rightRisk = scoreCoachPriority(right);
      return rightRisk - leftRisk;
    })
    .slice(0, 3)
    .map((item) => ({
      title: `${item.category} 需要补强`,
      question: item.question,
      category: item.category,
      signal: item.followUpSignal,
      interviewerSignal: item.interviewerSignal,
      drill: item.practiceDrill,
      target: createImmediateFix(item.question, {
        followUpCategory: item.followUpCategory,
        followUpFocus: item.nextFollowUp,
        weaknesses: item.weaknesses
      }),
      detail: `先修 ${describeFollowUpCategory(item.followUpCategory)}，再按这题的优秀答案重讲一遍。`
    }));
}

function createOverallSummary(session, answersByQuestion, levelProfile = getLevelExpectation('middle'), interviewPatterns = summarizeInterviewPatterns([])) {
  if (!answersByQuestion.length) {
    return '本轮没有有效回答，建议先完成一次完整模拟再看复盘。';
  }

  const strongCount = answersByQuestion.filter((item) => item.score >= 80).length;
  const weakCount = answersByQuestion.filter((item) => item.score < 70).length;
  const role = roleLabels[session.config.role] || session.config.role;
  const level = levelLabels[session.config.level] || session.config.level;

  if (strongCount === answersByQuestion.length) {
    return `这轮 ${level}${role} 面试回答整体比较完整，已经达到“${levelProfile.labels[0]}”的预期，并接近可继续深挖的水平。`;
  }

  if (weakCount >= Math.ceil(answersByQuestion.length / 2)) {
    const patternLine = interviewPatterns.primary
      ? `面试官最容易形成的判断是“${interviewPatterns.primary.interviewerView}”。`
      : '面试官会继续通过追问确认你是否真的掌握到可落地的细节。';
    return `这轮 ${level}${role} 面试里基础主线还不够稳定，距离“${levelProfile.labels.join('、')}”还有差距，尤其需要补强回答结构、关键原理和场景化表达。建议先把最低分的两题各重讲 3 遍，练到首轮就能把核心点答实。${patternLine}`;
  }

  const patternLead = interviewPatterns.primary
    ? `当前最明显的模式是${interviewPatterns.primary.label}。`
    : '当前主要问题集中在追问稳定性。';
  return `这轮 ${level}${role} 面试的基础是有的，但稳定性一般，还没有完全达到“${levelProfile.labels.join('、')}”的预期，容易在追问时暴露细节、取舍和场景表达不足。下一轮训练重点不是刷更多题，而是把已答题练成首轮就站得住。${patternLead}`;
}

function createInterviewerImpression(session, answersByQuestion, levelProfile = getLevelExpectation('middle'), interviewPatterns = summarizeInterviewPatterns([])) {
  if (!answersByQuestion.length) {
    return '还没有形成有效面试印象，先完成一次完整作答。';
  }

  const role = roleLabels[session.config.role] || session.config.role;
  const level = levelLabels[session.config.level] || session.config.level;
  const strongCount = answersByQuestion.filter((item) => item.interviewerVerdict?.level === 'strong').length;
  const riskCount = answersByQuestion.filter((item) => item.interviewerVerdict?.level === 'risk').length;
  const repeatedFollowUps = answersByQuestion.filter((item) => item.followUpCount >= 2).length;
  const primaryPattern = interviewPatterns.primary;

  if (strongCount >= Math.max(2, Math.ceil(answersByQuestion.length / 2)) && riskCount === 0) {
    return `作为 ${level}${role} 候选人，你给人的整体印象是主线清楚、追问也能接住。面试官更可能继续验证上限，而不是怀疑基础是否属实。`;
  }

  if (riskCount >= Math.max(2, Math.ceil(answersByQuestion.length / 2))) {
    const patternTail = primaryPattern
      ? `最突出的短板是“${primaryPattern.label}”。`
      : '面试官大概率会继续怀疑回答是否真的来自真实项目经历。';
    return `整体印象会偏保守：你能讲出部分主线，但一被追问就容易失去说服力。${patternTail}`;
  }

  if (repeatedFollowUps >= 2) {
    const patternTail = primaryPattern
      ? `现在最影响观感的是“${primaryPattern.label}”。`
      : '当前主要问题是追问稳定性还不够。';
    return `面试官会觉得你“不是完全不会，但答得不够稳”。${patternTail} 如果不主动补细节、取舍和结果，评价容易停在中间档。`;
  }

  return `整体印象处在可继续观察的区间：已经具备 ${levelProfile.labels[0]} 的一部分基础，但还需要把回答密度和稳定性再往上提。`;
}

function createHiringSignal(answersByQuestion, levelProfile = getLevelExpectation('middle'), interviewPatterns = summarizeInterviewPatterns([])) {
  if (!answersByQuestion.length) {
    return {
      label: '暂无法判断',
      level: 'borderline',
      detail: '没有有效作答时，系统无法模拟真实面试官的通过倾向。'
    };
  }

  const score = estimateScore(answersByQuestion);
  const strongCount = answersByQuestion.filter((item) => item.interviewerVerdict?.level === 'strong').length;
  const riskCount = answersByQuestion.filter((item) => item.interviewerVerdict?.level === 'risk').length;
  const repeatedFollowUps = answersByQuestion.filter((item) => item.followUpCount >= 2).length;
  const primaryPattern = interviewPatterns.primary;

  if (score >= levelProfile.minScoreToMoveNext + 8 && strongCount >= Math.max(2, Math.ceil(answersByQuestion.length / 2)) && riskCount === 0) {
    return {
      label: '通过信号偏强',
      level: 'strong',
      detail: '如果真实面试也保持这个稳定度，面试官更可能把你归到“可进入下一轮或继续深挖”的候选人。'
    };
  }

  if (riskCount >= Math.max(2, Math.ceil(answersByQuestion.length / 2)) || score < levelProfile.minScoreToMoveNext - 8) {
    const detail = primaryPattern
      ? `当前更像“暂不通过”信号，主要因为“${primaryPattern.label}”反复出现，面试官容易担心这个问题不是单题失误。`
      : '当前更像“暂不通过”信号，因为多道题都需要追问补主线，整体稳定性不够。';
    return {
      label: '暂不通过风险高',
      level: 'risk',
      detail
    };
  }

  const detail = repeatedFollowUps >= 2
    ? '当前更像“需要再观察”信号。你有一定基础，但面试官通常会担心继续深挖后稳定性不够。'
    : '当前更像“可继续观察”信号。主线基本能成立，但还缺少足够多的亮点题把整体评价抬上去。';

  return {
    label: '需要继续观察',
    level: 'borderline',
    detail
  };
}

function createCoachingFocus(answersByQuestion, levelProfile = getLevelExpectation('middle'), interviewPatterns = summarizeInterviewPatterns([])) {
  if (!answersByQuestion.length) return '先完成一轮完整作答，再根据复盘安排训练。';

  const highestRisk = [...answersByQuestion]
    .sort((a, b) => a.score - b.score || b.attempts - a.attempts)[0];

  if (interviewPatterns.primary) {
    return `先优先修正${interviewPatterns.primary.label}这个共性问题：${interviewPatterns.primary.coachingFocus}。然后回到 ${highestRisk.category} 题，围绕“${highestRisk.nextFollowUp}”按“${levelProfile.focus}”的标准重练。`;
  }

  return `当前最该优先修的，是 ${highestRisk.category} 题里的“${highestRisk.nextFollowUp}”这类追问。先按“${levelProfile.focus}”的标准重练。`;
}

function createRiskSummary(answersByQuestion, levelProfile = getLevelExpectation('middle'), interviewPatterns = summarizeInterviewPatterns([])) {
  if (!answersByQuestion.length) return '暂无风险判断。';

  const repeated = answersByQuestion.filter((item) => item.attempts >= 2).length;
  const lowConfidence = answersByQuestion.filter((item) => item.confidence.level !== 'high').length;
  const redFlagged = answersByQuestion.filter((item) => (item.redFlags || []).length > 0).length;

  if (redFlagged >= Math.max(1, Math.ceil(answersByQuestion.length / 2))) {
    return '当前最大风险是面试官会把你判断成“概念听过，但真实落地和判断过程站不住”。需要用具体职责、取舍和结果证据把答案讲实。';
  }

  if (interviewPatterns.primary && interviewPatterns.primary.count >= 2) {
    return `当前最稳定的风险信号是${interviewPatterns.primary.label}，它已经在 ${interviewPatterns.primary.count} 道题里重复出现。真实面试里，这会让面试官倾向于判断“${interviewPatterns.primary.interviewerView}”。`;
  }

  if (repeated >= 2 || lowConfidence >= Math.ceil(answersByQuestion.length / 2)) {
    return '当前主要风险不是完全不会，而是被追问两层后容易暴露主线不稳、细节不足。';
  }

  return `当前主要风险集中在少数题目的深挖稳定性。对于这个级别，${levelProfile.riskThreshold}。`;
}

function summarizeInterviewPatterns(answersByQuestion) {
  const patternDefinitions = {
    ownership: {
      label: '个人贡献和 ownership 不够具体',
      interviewerView: '你更像在复述团队项目，而不是讲清自己真正负责过的判断和落地',
      coachingFocus: '把项目题统一收敛到“背景、我的职责、关键判断、结果”这条主线',
      practiceAction: '针对每个项目题补一版只讲自己负责部分的 90 秒答案，明确你改了什么、为什么这样改、结果怎样'
    },
    tradeoff: {
      label: '方案取舍解释不够',
      interviewerView: '你知道结论，但方案判断过程和代价意识偏弱',
      coachingFocus: '每道非算法题都补上“为什么这样选、不选什么、代价和边界是什么”',
      practiceAction: '把常见方案题各练一遍取舍版答案，固定输出收益、代价、边界和备选方案'
    },
    evidence: {
      label: '真实案例支撑不足',
      interviewerView: '回答听起来像背过的标准答案，缺少真实经历锚点',
      coachingFocus: '把每个核心知识点都绑定到一个你做过的线上场景或排障案例',
      practiceAction: '为高频题准备一组可复用的真实案例，按背景、动作、结果复述'
    },
    impact: {
      label: '结果和指标表达偏弱',
      interviewerView: '你描述了动作，但没有证明这些动作带来了结果',
      coachingFocus: '项目和系统设计题都主动补前后指标、验证方式和风险观察',
      practiceAction: '把项目经历里的性能、成功率、吞吐、成本等结果指标整理成口述素材'
    },
    core: {
      label: '核心考点覆盖不完整',
      interviewerView: '基础概念或关键原理没有答实，继续深挖会比较危险',
      coachingFocus: '先把每题必须命中的核心点讲完整，再谈扩展内容',
      practiceAction: '按题目 rubric 回补核心考点，练到首轮回答就能覆盖主要原理'
    },
    detail: {
      label: '实现细节密度不足',
      interviewerView: '主线能讲，但一进实现细节就容易变虚',
      coachingFocus: '回答里主动补关键流程、边界处理、复杂度或异常兜底',
      practiceAction: '针对每类题准备一版深挖细节答案，专练实现流程和边界条件'
    }
  };

  const entries = Object.entries(patternDefinitions)
    .map(([key, definition]) => {
      const related = answersByQuestion.filter((item) => item.followUpCategory === key);
      return {
        key,
        ...definition,
        count: related.length,
        questions: related.map((item) => item.question)
      };
    })
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count);

  return {
    primary: entries[0] || null,
    ranked: entries
  };
}

function describeReadiness(answersByQuestion, levelProfile = getLevelExpectation('middle')) {
  const average = estimateScore(answersByQuestion);
  const passLine = levelProfile.minScoreToMoveNext + 12;
  if (average >= passLine) return '接近真实面试通过线';
  if (average >= levelProfile.minScoreToMoveNext + 4) return '具备基础竞争力，但追问稳定性不足';
  if (average >= levelProfile.minScoreToMoveNext - 8) return '主线初步具备，需要系统补强';
  return '距离真实面试要求还有明显差距';
}

function collectStrengths(question, mustHaveHits, goodToHaveHits, communication) {
  const strengths = [];

  if (mustHaveHits.length >= Math.max(1, Math.ceil(question.scoringRubric.mustHave.length * 0.6))) {
    strengths.push('核心考点覆盖度尚可');
  }
  if (goodToHaveHits.length) strengths.push(`补充到了加分项：${goodToHaveHits.join('、')}`);
  if (communication.hasStructure) strengths.push('表达有一定结构');
  if (communication.hasTradeoff) strengths.push('能说明原因或技术取舍');
  if (communication.hasExample) strengths.push('带了一些真实场景感');

  return strengths.length ? strengths : ['回答至少覆盖了题目的一部分主线'];
}

function collectWeaknesses(question, rubric, communication, missingKeywords) {
  const weaknesses = [];
  const missingMustHave = rubric.mustHave.filter((item) => {
    return missingKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item)))
      || (!question.keywords.some((keyword) => matchesConcept(item, keyword)) && !matchesConcept(question.question, item));
  });

  if (missingKeywords.length) weaknesses.push(`缺少关键词：${missingKeywords.join('、')}`);
  if (missingMustHave.length) weaknesses.push(`需要更明确点出：${missingMustHave.join('、')}`);
  if (!communication.hasStructure) weaknesses.push('回答结构松散');
  if (question.type === 'project' && !communication.hasOwnership) weaknesses.push('个人贡献和判断不够具体');
  if (question.type === 'knowledge' && question.difficulty >= 3 && !communication.hasDiagnosisFlow) weaknesses.push('缺少排查顺序或判断路径');
  if (!communication.hasTradeoff && question.type !== 'algorithm') weaknesses.push('没有展开取舍或原因');
  if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) weaknesses.push('缺少量化结果');

  return weaknesses;
}

function detectRedFlags(answer, question, rubric, communication) {
  const flags = [];

  for (const redFlag of rubric.redFlags || []) {
    if (matchesConcept(answer, redFlag)) {
      flags.push(redFlag);
    }
  }

  if (question.type === 'project' && !/我负责|我主要|我做|我写|我处理/.test(answer) && /我们|团队|大家/.test(answer)) {
    flags.push('整体停留在团队视角，个人贡献不清晰');
  }

  if (question.type === 'project' && !communication.hasOwnership) {
    flags.push('项目题缺少个人判断和亲手负责的动作');
  }

  if (question.type === 'knowledge' && question.difficulty >= 3 && !communication.hasDiagnosisFlow) {
    flags.push('高阶排障题没有体现先后排查顺序');
  }

  if (question.type !== 'algorithm' && !communication.hasTradeoff && answer.trim().length >= 80) {
    flags.push('有结论但没讲为什么这样做以及代价');
  }

  if (['project', 'system-design'].includes(question.type) && !communication.hasMetrics) {
    flags.push('缺少结果指标，难以证明改动真正生效');
  }

  return [...new Set(flags)];
}

function communicationHints(answer) {
  return {
    hasStructure: /首先|然后|最后|一方面|另一方面|先|再|总结/.test(answer),
    hasMetrics: /\d+|百分之|ms|秒|qps|tps|延迟|吞吐|成功率|耗时/.test(answer),
    hasTradeoff: /因为|所以|权衡|取舍|代价|收益|风险|边界/.test(answer),
    hasExample: /比如|例如|项目|线上|生产|场景|案例|当时/.test(answer),
    hasOwnership: /我负责|我主要|我做|我写|我处理|我排查|我推动|我设计|我改了|我加了/.test(answer),
    hasDiagnosisFlow: /先|然后|再|接着|最后|第一步|第二步|第三步|先确认|先看|再看|最后看/.test(answer)
  };
}

function describeAnswerConfidence(evaluation, attempts, levelProfile = getLevelExpectation('middle')) {
  const strongLine = levelProfile.minScoreToMoveNext + 14;
  const mediumLine = levelProfile.minScoreToMoveNext;

  if (evaluation.score >= strongLine && attempts <= 1) {
    return {
      level: 'high',
      label: '高把握',
      detail: '首轮回答已经能撑住真实面试里的继续深挖。'
    };
  }

  if (evaluation.score >= mediumLine) {
    return {
      level: 'medium',
      label: '中等把握',
      detail: attempts > 1
        ? '补充后主线基本成立，但还不够像一次成型的面试回答。'
        : '主线有了，但再追问一层仍可能出现细节断点。'
    };
  }

  return {
    level: 'low',
    label: '低把握',
    detail: '这题还停留在零散点状回答，真实面试里风险较高。'
  };
}

function createInterviewerSignal(question, evaluation, attempts) {
  if (attempts >= 3 && evaluation.followUpCategory !== 'complete') {
    return `这题连续追问 ${attempts - 1} 轮后仍卡在“${describeFollowUpCategory(evaluation.followUpCategory)}”，面试官会明显下调稳定性判断。`;
  }

  const missingMustHave = question.scoringRubric.mustHave.filter((item) => {
    return !evaluation.rubricHits.mustHave.includes(item);
  });

  if (missingMustHave.length) {
    return `面试官大概率会继续追问你是否真的掌握 ${missingMustHave[0]}。`;
  }

  if (!evaluation.communication.hasTradeoff && question.type !== 'algorithm') {
    return '面试官会怀疑你知道结论，但没有经历过方案比较和取舍。';
  }

  if (!evaluation.communication.hasExample && question.type !== 'knowledge') {
    return '面试官会继续确认你是否做过真实场景，而不只是背过答案。';
  }

  if (attempts >= 2) {
    return '这题需要多轮补充才能讲顺，真实面试里会被判断为稳定性一般。';
  }

  return '这题的主线已经比较完整，风险主要在继续深挖时的细节密度。';
}

function createInterviewerCompetencySignal(question, evaluation, attempts, levelProfile = getLevelExpectation('middle')) {
  const dimensions = [];

  if (question.type === 'project') {
    dimensions.push(
      evaluation.followUpCategory === 'ownership' || !evaluation.communication.hasExample
        ? 'ownership 不够实'
        : 'ownership 基本可信'
    );
  }

  if (question.type !== 'algorithm') {
    dimensions.push(
      evaluation.communication.hasTradeoff
        ? '有一定取舍意识'
        : '方案判断偏弱'
    );
  }

  if (['project', 'system-design'].includes(question.type)) {
    dimensions.push(
      evaluation.communication.hasMetrics
        ? '能用结果支撑结论'
        : '结果量化不足'
    );
  }

  if (attempts >= 3 && evaluation.followUpCategory !== 'complete') {
    return {
      label: '追问后稳定性风险高',
      level: 'risk',
      detail: `连续追问后仍卡在“${describeFollowUpCategory(evaluation.followUpCategory)}”，面试官更可能判断你知道概念，但还没形成稳定可复述的能力。`,
      dimensions
    };
  }

  if (evaluation.score >= levelProfile.minScoreToMoveNext + 10 && evaluation.communication.hasStructure) {
    return {
      label: '具备继续深挖价值',
      level: 'strong',
      detail: `这题会让面试官倾向于继续往更深层问，因为你已经表现出 ${dimensions.slice(0, 2).join('、') || '较好的主线和表达稳定性'}。`,
      dimensions
    };
  }

  if (evaluation.followUpCategory === 'complete') {
    return {
      label: '基础能力可感知',
      level: 'watch',
      detail: `这题已经能让面试官感知到基础能力，但如果想拿到更高评价，还需要继续补强 ${dimensions.filter((item) => /偏弱|不足|不够/.test(item)).join('、') || '细节密度和追问稳定性'}。`,
      dimensions
    };
  }

  return {
    label: '能力信号还不够稳',
    level: 'risk',
    detail: `当前更像是“知道一些点”，但面试官还无法稳定判断你的 ${dimensions.filter((item) => !/基本可信|有一定|能用/.test(item)).join('、') || '细节深度和真实经验'} 是否达标。`,
    dimensions
  };
}

function createPracticeDrill(question, evaluation) {
  const focus = evaluation.followUpFocus || question.followUps?.[0] || '把关键细节讲具体';
  const firstMissing = evaluation.weaknesses[0] || '把回答组织得更像真实面试口述';
  const drillMode = {
    core: '按 rubric 补核心点',
    ownership: '改成只讲自己负责的部分',
    tradeoff: '补方案比较和代价',
    evidence: '换成真实项目案例复述',
    impact: '补结果指标和验证方式',
    detail: '补实现细节和边界'
  }[evaluation.followUpCategory] || '做一次追问演练';

  return `下次练这题时，先用 90 秒讲完主线，再围绕“${focus}”做一次“${drillMode}”练习；最后强制自己补一句“${createImmediateFix(question, evaluation)}”，重点修正“${firstMissing}”。`;
}

function createImmediateFix(question, evaluation) {
  if (evaluation.followUpFocus) return evaluation.followUpFocus;

  const fallback = {
    core: `把 ${question.scoringRubric?.mustHave?.[0] || '核心考点'} 直接说具体，不要只停在概念上。`,
    ownership: '直接收窄到你亲手负责的部分，讲清你的判断、动作和结果。',
    tradeoff: '明确说为什么选这个方案、不选什么，以及代价和边界。',
    evidence: '换成一个你自己做过的真实项目场景来讲。',
    impact: '补改动前后指标、验证方式和线上结果。',
    detail: '补实现细节、边界情况和排查过程。'
  };

  return fallback[evaluation.followUpCategory] || question.followUps?.[0] || '把刚才最虚的那一段讲具体。';
}

function buildAnswerFramework(question, evaluation) {
  const steps = [];

  if (question.type === 'project') {
    steps.push('先交代项目背景和你的职责');
    steps.push('再说关键方案或你做的判断');
    if (!evaluation.communication.hasTradeoff) steps.push('补为什么这样选');
    if (!evaluation.communication.hasMetrics) steps.push('补结果指标和复盘');
    return steps.join('；');
  }

  if (question.type === 'system-design') {
    steps.push('先讲主链路');
    steps.push('再讲核心数据/状态怎么保证');
    steps.push('最后补容量、异常和取舍');
    return steps.join('；');
  }

  if (question.type === 'algorithm') {
    return '先给思路，再说关键数据结构和遍历顺序，最后补复杂度与边界';
  }

  steps.push('先给定义或结论');
  steps.push('再解释原理');
  if (!evaluation.communication.hasExample) steps.push('最后补一个真实场景或排查案例');
  if (!evaluation.communication.hasTradeoff && question.type !== 'knowledge') steps.push('顺手补方案取舍');
  return steps.join('；');
}

function dedupePracticeSuggestions(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.title}|${item.goal}|${item.action}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function scoreCoachPriority(item) {
  let score = 100 - item.score;

  if (item.followUpCategory && item.followUpCategory !== 'complete') score += 10;
  if ((item.attempts || 1) >= 3) score += 8;
  if (item.confidence?.level === 'low') score += 8;
  if ((item.followUpCount || 0) >= 2) score += 4;

  return score;
}

function summarizeCompetencySignals(answersByQuestion, levelProfile = getLevelExpectation('middle')) {
  if (!answersByQuestion.length) {
    return '没有有效作答时，系统还无法模拟面试官对能力维度的稳定判断。';
  }

  const riskSignals = answersByQuestion.filter((item) => item.interviewerCompetencySignal?.level === 'risk');
  const strongSignals = answersByQuestion.filter((item) => item.interviewerCompetencySignal?.level === 'strong');
  const recurringDimensions = riskSignals
    .flatMap((item) => item.interviewerCompetencySignal?.dimensions || [])
    .filter((item) => /偏弱|不足|不够/.test(item));
  const recurring = [...new Set(recurringDimensions)].slice(0, 3);

  if (strongSignals.length >= Math.ceil(answersByQuestion.length / 2) && !riskSignals.length) {
    return `从面试官视角看，你已经能较稳定地给出 ${levelProfile.labels[0]} 对应的能力信号，尤其是 ${[...new Set(strongSignals.flatMap((item) => item.interviewerCompetencySignal?.dimensions || []))].slice(0, 3).join('、')}。`;
  }

  if (riskSignals.length >= Math.ceil(answersByQuestion.length / 2)) {
    return `当前最影响评价的不是单题不会，而是能力信号不够稳。面试官更可能担心你在 ${recurring.join('、') || 'ownership、方案判断和结果证明'} 上经不起连续追问。`;
  }

  return `你已经能给出一部分可用信号，但整体还处在“可继续观察”区间。下一步优先把 ${recurring.join('、') || 'ownership、取舍 reasoning 和结果量化'} 讲得更像自己真正做过。`;
}

function createFollowUpFocus(question, rubric, mustHaveHits, missingKeywords, communication, followUpCategory) {
  const missingMustHave = rubric.mustHave.filter((item) => !mustHaveHits.includes(item));
  if (missingMustHave.length) {
    return `把 ${missingMustHave[0]} 说具体，最好结合真实场景展开。`;
  }

  if (followUpCategory === 'ownership') {
    return '别只讲团队方案，明确说你自己负责哪部分、做了什么判断、落了什么代码或方案。';
  }

  if (followUpCategory === 'evidence') {
    return '不要只给抽象总结，直接补一个你自己做过的真实场景，讲清问题、动作和结果。';
  }

  if (!communication.hasTradeoff && question.type !== 'algorithm') {
    return '补充你为什么这么设计，以及方案的收益和代价。';
  }

  if (!communication.hasDiagnosisFlow && question.type === 'knowledge' && question.difficulty >= 3) {
    return '按排查顺序重讲，先说你会先确认什么，再说如何逐步缩小范围。';
  }

  if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) {
    return '补充结果指标、量化收益或线上效果。';
  }

  if (missingKeywords.length) {
    return `补充 ${missingKeywords[0]} 相关细节，不要只停留在概念层。`;
  }

  return question.followUps?.[0] || '';
}

function buildSuggestedFollowUp(question, evaluation, context = {}) {
  const followUpCount = context.followUpCount || 0;
  const levelProfile = getLevelExpectation(context.level);
  const bankedFollowUp = selectFollowUp(question, evaluation, context);
  const basePrompt = bankedFollowUp || evaluation.followUpFocus || question.followUps?.[0] || '你再展开一下刚才的方案和关键细节。';

  if (followUpCount >= 2) {
    const repeatedPrompt = createRepeatedFollowUpPrompt(question, evaluation, levelProfile);
    if (repeatedPrompt) return repeatedPrompt;
  }

  if (evaluation.followUpCategory === 'impact' && levelProfile === levelExpectations.senior) {
    return `不要只给结论，直接补你拿什么指标判断方案有效，以及上线后怎么观察风险和收益。`;
  }

  if (evaluation.followUpCategory === 'tradeoff' && levelProfile !== levelExpectations.junior) {
    return `别停留在结论，直接讲你当时怎么比较方案、为什么这么选，以及代价是什么。`;
  }

  if (evaluation.followUpCategory === 'ownership') {
    return createOwnershipFollowUp(question);
  }

  if (evaluation.followUpCategory === 'evidence') {
    return createEvidenceFollowUp(question);
  }

  if (evaluation.followUpCategory === 'detail') {
    return createDetailFollowUp(question);
  }

  return basePrompt;
}

function createOwnershipFollowUp(question) {
  if (question.type === 'project') {
    return '把范围收窄到你亲手负责的一块，按背景、你的判断、你改了什么、最后结果怎样讲清楚。';
  }

  if (question.type === 'system-design') {
    return '别只讲标准架构，直接说如果这题落到你负责，你会先拍哪三个关键决策，为什么。';
  }

  return '不要只讲团队或常规做法，直接说你自己会怎么做、做过什么、依据是什么。';
}

function createEvidenceFollowUp(question) {
  if (question.type === 'system-design') {
    return '给我一个你实际遇到过的高并发、故障或取舍场景，说明你当时是怎么判断和落地的。';
  }

  if (question.type === 'project') {
    return '不要继续抽象总结，直接举一个你线上或项目里真的处理过的场景，按问题、动作、结果讲。';
  }

  return '举一个你自己处理过的具体场景，不要只背概念，说明当时为什么这么做。';
}

function createDetailFollowUp(question) {
  if (question.type === 'algorithm') {
    return '别只说思路，直接讲关键数据结构、遍历顺序、边界情况，以及时间和空间复杂度。';
  }

  if (question.type === 'system-design') {
    return '主线先不展开了，直接补最关键的实现细节：请求怎么流转、状态怎么保证、异常怎么兜底。';
  }

  if (question.type === 'knowledge') {
    return '别停在定义，直接补原理、关键机制和一个容易被追问的边界点。';
  }

  return '别再泛讲主线，直接补实现细节、边界条件和你当时的具体处理。';
}

function selectFollowUp(question, evaluation, context = {}) {
  const followUpCount = context.followUpCount || 0;
  if (followUpCount >= 2 && evaluation.followUpCategory === 'evidence') {
    return '不要泛泛而谈，直接举一个你亲自处理过的线上或项目场景，按背景、动作、结果讲清楚。';
  }

  if (followUpCount >= 2 && evaluation.followUpCategory === 'tradeoff') {
    return '把你的取舍讲透：为什么选这个方案，不选什么，代价和边界分别是什么？';
  }

  const directFocus = evaluation.followUpFocus;
  if (directFocus) return directFocus;

  const preferredFollowUp = pickFollowUpFromBank(question, evaluation.followUpCategory);
  if (preferredFollowUp) return preferredFollowUp;

  return question.followUps.find((item) => {
    return !evaluation.hitKeywords.some((keyword) => item.includes(keyword));
  }) || question.followUps[0] || '你再展开一下刚才的方案和关键细节。';
}

function createRepeatedFollowUpPrompt(question, evaluation, levelProfile) {
  if (evaluation.followUpCategory === 'core') {
    return `这题已经追问两轮了，直接按“结论 -> 原理 -> 你的处理方式”重答，至少把 ${question.scoringRubric.mustHave[0] || '核心考点'} 讲实。`;
  }

  if (evaluation.followUpCategory === 'ownership') {
    return '别再讲团队怎么做，直接收窄到你亲手负责的一块，说清你的判断、改动和结果。';
  }

  if (evaluation.followUpCategory === 'impact') {
    return '不要只说做了优化，直接给出前后指标、线上变化，或者你实际怎么验证效果。';
  }

  if (evaluation.followUpCategory === 'detail') {
    return `不要再泛讲主线，按这个级别的要求补细节：${levelProfile.focus}。`;
  }

  return '';
}

function pickFollowUpFromBank(question, category) {
  const followUps = question.followUps || [];
  if (!followUps.length) return '';

  const matchers = {
    core: [/什么|原理|如何|怎么/, /核心|关键|负责/],
    ownership: [/个人|你自己|负责|贡献|写的核心逻辑/],
    tradeoff: [/改进|优先|为什么|选|取舍/],
    evidence: [/场景|当时|线上|案例|做过/],
    impact: [/结果|效果|指标|增长|改进/],
    detail: [/如何|怎么|细节|排查|处理/]
  };

  const patterns = matchers[category] || [];
  return followUps.find((item) => patterns.some((pattern) => pattern.test(item))) || followUps[0];
}

function classifyFollowUpCategory(question, rubric, mustHaveHits, missingKeywords, communication) {
  const missingMustHave = rubric.mustHave.filter((item) => !mustHaveHits.includes(item));

  if (missingMustHave.length) return 'core';
  if (question.type === 'project' && !communication.hasOwnership) return 'ownership';
  if (question.type === 'project' && !communication.hasExample) return 'evidence';
  if (question.type === 'knowledge' && question.difficulty >= 3 && !communication.hasDiagnosisFlow) return 'detail';
  if (!communication.hasTradeoff && question.type !== 'algorithm') return 'tradeoff';
  if (!communication.hasExample && question.type !== 'knowledge') return 'evidence';
  if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) return 'impact';
  if (missingKeywords.length) return 'detail';
  return 'complete';
}

function describeFollowUpCategory(category) {
  return {
    core: '核心考点没答实',
    ownership: '个人贡献不清晰',
    tradeoff: '缺少方案取舍',
    evidence: '缺少真实经历证据',
    impact: '缺少结果指标',
    detail: '细节密度不够',
    complete: '回答主线完整'
  }[category] || '细节密度不够';
}

function createFollowUpSignal(evaluation, attempts) {
  if (evaluation.followUpCategory === 'complete') {
    return attempts <= 1 ? '首轮回答基本能扛住追问。' : '主线补齐后已能进入下一题。';
  }

  if (attempts >= 3) {
    return `连续追问后仍暴露“${describeFollowUpCategory(evaluation.followUpCategory)}”问题。`;
  }

  return `如果真实面试官继续深挖，最可能卡在“${describeFollowUpCategory(evaluation.followUpCategory)}”。`;
}

function getLevelExpectation(level) {
  return levelExpectations[level] || levelExpectations.middle;
}

function calculateLevelPenalty(question, communication, levelProfile) {
  let penalty = 0;

  if (levelProfile === levelExpectations.senior) {
    if (!communication.hasTradeoff && question.type !== 'algorithm') penalty += 6;
    if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) penalty += 4;
    if (!communication.hasExample && question.type !== 'knowledge') penalty += 3;
  } else if (levelProfile === levelExpectations.middle) {
    if (!communication.hasTradeoff && question.type !== 'algorithm') penalty += 3;
    if (!communication.hasExample && question.type === 'project') penalty += 2;
  }

  return penalty;
}

function createLevelExpectationSummary(levelProfile) {
  return `当前级别更看重：${levelProfile.labels.join('、')}。`;
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，。、“”‘’：；？！,.:"';!?()（）]/g, '');
}

function matchesConcept(answer, concept) {
  const normalizedAnswer = normalizeText(answer);
  const candidates = [concept, ...(conceptAliases[concept] || [])].map((item) => normalizeText(item));
  return candidates.some((candidate) => candidate && normalizedAnswer.includes(candidate));
}

function countOccurrences(text, token) {
  const matches = String(text).match(new RegExp(token, 'g'));
  return matches ? matches.length : 0;
}

function selectBestQuestion({ available, selected, preferredCategory, preferredType, targetDifficulty, resumeSignals = createEmptyResumeSignals() }) {
  const selectedIds = new Set(selected.map((item) => item.id));
  const selectedCategories = new Set(selected.map((item) => item.category));

  const ranked = available
    .filter((item) => !selectedIds.has(item.id))
    .map((item) => ({
      item,
      score: scoreQuestionFit(item, {
        preferredCategory,
        preferredType,
        targetDifficulty,
        selectedCategories,
        resumeSignals
      })
    }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.item || null;
}

function buildCandidateQuestionPool(role, level, resumeSignals = createEmptyResumeSignals()) {
  const exactMatches = questionBank.filter((item) => item.roles.includes(role) && item.levels.includes(level));
  const sameRoleFallback = questionBank.filter((item) => item.roles.includes(role) && !exactMatches.includes(item));
  const adjacentRoleFallback = questionBank.filter((item) => {
    return !exactMatches.includes(item)
      && !sameRoleFallback.includes(item)
      && item.levels.includes(level)
      && sharesInterviewTrack(role, item.roles);
  });

  return [...exactMatches, ...sameRoleFallback, ...adjacentRoleFallback]
    .sort((left, right) => scoreResumeQuestionMatch(right, resumeSignals) - scoreResumeQuestionMatch(left, resumeSignals));
}

function sharesInterviewTrack(role, roles) {
  const relatedRoles = {
    backend: ['java', 'go', 'python', 'fullstack'],
    java: ['backend', 'fullstack'],
    go: ['backend', 'fullstack'],
    python: ['backend', 'fullstack'],
    frontend: ['fullstack'],
    fullstack: ['backend', 'frontend', 'java', 'go', 'python']
  };

  return roles.includes(role) || (relatedRoles[role] || []).some((candidate) => roles.includes(candidate));
}

function scoreQuestionFit(item, { preferredCategory, preferredType, targetDifficulty, selectedCategories, resumeSignals = createEmptyResumeSignals() }) {
  let score = 0;
  const shouldEncourageCategoryVariety = item.type !== 'project' || selectedCategories.size === 0;

  if (preferredCategory && item.category === preferredCategory) score += 50;
  if (preferredType && item.type === preferredType) score += 20;
  if (!selectedCategories.has(item.category) && shouldEncourageCategoryVariety) score += 12;
  score -= Math.abs((item.difficulty || 2) - targetDifficulty) * 6;
  score += scoreResumeQuestionMatch(item, resumeSignals);

  if (item.type === 'project' && selectedCategories.size === 0) score += 8;
  if (item.type === 'algorithm' && selectedCategories.size >= 3) score += 5;
  if (item.type === 'system-design' && targetDifficulty >= 3) score += 5;

  return score;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function extractResumeSignals(resume) {
  const text = String(resume || '').trim();
  if (!text) return createEmptyResumeSignals();

  const snippets = text
    .split(/[\r\n，。,；;、]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
  const normalized = normalizeText(text);
  const categoryHints = {
    Java: ['java', 'spring', 'jvm', 'hashmap'],
    Go: ['go', 'golang', 'goroutine', 'gin'],
    Python: ['python', 'django', 'flask', 'fastapi', 'celery'],
    Redis: ['redis', 'cache', '缓存'],
    MySQL: ['mysql', 'sql', '索引', '事务'],
    '鍓嶇': ['react', 'vue', 'webpack', 'vite', '前端', '浏览器'],
    '绯荤粺璁捐': ['高并发', '架构', '系统设计', '分布式', '秒杀', '削峰'],
    '绠楁硶': ['算法', '复杂度', '哈希', '链表', '二叉树']
  };

  const categories = Object.entries(categoryHints)
    .filter(([, tokens]) => tokens.some((token) => normalized.includes(normalizeText(token))))
    .map(([category]) => category);

  return {
    text,
    snippets,
    categories,
    ownership: /(负责|主导|设计|优化|排查|实现|落地)/.test(text),
    metrics: /\d+/.test(text)
  };
}

function createEmptyResumeSignals() {
  return {
    text: '',
    snippets: [],
    categories: [],
    ownership: false,
    metrics: false
  };
}

function summarizeResumeForInterview(resume) {
  const signals = extractResumeSignals(resume);
  return signals.snippets.slice(0, 3).join('；');
}

function scoreResumeQuestionMatch(item, resumeSignals) {
  if (!resumeSignals?.text) return 0;

  let score = 0;
  if (resumeSignals.categories.includes(item.category)) score += 18;
  if (item.type === 'project' && resumeSignals.ownership) score += 8;
  if ((item.type === 'project' || item.type === 'system-design') && resumeSignals.metrics) score += 4;

  const itemText = normalizeText([item.category, item.question, ...(item.keywords || [])].join(' '));
  if (resumeSignals.snippets.some((snippet) => {
    const normalizedSnippet = normalizeText(snippet);
    return normalizedSnippet && (itemText.includes(normalizedSnippet) || normalizedSnippet.includes(itemText));
  })) {
    score += 12;
  }

  return score;
}

function createResumeSupport(question, answer, resume) {
  const signals = extractResumeSignals(resume);
  if (!signals.text || !question) {
    return {
      status: 'not_applicable',
      label: '未提供简历背景',
      detail: '本题没有额外的简历绑定要求。'
    };
  }

  const normalizedAnswer = normalizeText(answer);
  const matchedSnippet = signals.snippets.find((snippet) => {
    const normalizedSnippet = normalizeText(snippet);
    return normalizedSnippet && normalizedAnswer.includes(normalizedSnippet.slice(0, Math.min(8, normalizedSnippet.length)));
  });

  if (matchedSnippet) {
    return {
      status: 'grounded',
      label: '已落回真实经历',
      detail: `这题已经引用到你的经历：${matchedSnippet}。下一步继续补足当时的判断、取舍和结果。`
    };
  }

  if (signals.categories.includes(question.category)) {
    return {
      status: 'missed',
      label: '有背景但没用上',
      detail: `你的简历里出现过 ${question.category} 相关经历，但这题回答还没落回真实项目细节。`
    };
  }

  if (question.type === 'project') {
    return {
      status: 'missed',
      label: '项目题未绑定经历',
      detail: '这题更适合落到你的项目经历上，建议补上背景、个人负责部分和量化结果。'
    };
  }

  return {
    status: 'weak',
    label: '简历支撑偏弱',
    detail: '当前回答还没有主动借用简历里的项目或故障处理经历来增强可信度。'
  };
}

function createResumeCoverageSummary(session, answersByQuestion) {
  const resumeSummary = summarizeResumeForInterview(session.config.resume);
  if (!resumeSummary) {
    return '本轮未提供简历或项目背景，仍按通用技术面试标准评估。';
  }

  const groundedCount = answersByQuestion.filter((item) => item.resumeSupport?.status === 'grounded').length;
  const missCount = answersByQuestion.filter((item) => item.resumeSupport?.status === 'missed').length;
  const weakCount = answersByQuestion.filter((item) => item.resumeSupport?.status === 'weak').length;

  return `已根据你的背景“${resumeSummary}”安排追问；本轮有 ${groundedCount}/${answersByQuestion.length || 1} 题真正落回了真实经历，另有 ${missCount} 题错过了最该绑定项目细节的机会，${weakCount} 题支撑偏弱。`;
}

function createResumeGroundingOverview(answersByQuestion, resumeSummary) {
  if (!resumeSummary) {
    return '没有简历输入时，系统无法判断你的回答是否真正借用了过往经历。';
  }

  const groundedCount = answersByQuestion.filter((item) => item.resumeSupport?.status === 'grounded').length;
  const missedQuestions = answersByQuestion
    .filter((item) => item.resumeSupport?.status === 'missed')
    .map((item) => item.category);

  if (!answersByQuestion.length) {
    return '还没有作答，暂时无法判断你是否会把回答落回真实项目。';
  }

  if (!missedQuestions.length) {
    return `你已经把大部分回答和背景“${resumeSummary}”建立了连接，这会显著提升答案可信度。`;
  }

  return `目前只有 ${groundedCount}/${answersByQuestion.length} 题真正引用了你的经历；优先补强 ${[...new Set(missedQuestions)].join('、')} 这些题型的项目化表达。`;
}

const conceptAliases = {
  项目背景: ['背景', '业务背景', '业务目标', '目标', '为什么做', '提升'],
  个人职责: ['职责', '负责', '我负责', '我主要负责', '我主要做', '我参与'],
  职责: ['负责', '我负责', '我主要负责', '我主要做', '我参与'],
  技术栈: ['技术', 'springboot', 'spring', 'mysql', 'redis', 'rabbitmq', 'mq', 'react', 'vue', 'node', 'go', 'python'],
  关键问题: ['关键问题', '问题', '难点', '挑战', '瓶颈', '关键难点', '一致性'],
  问题: ['难点', '挑战', '瓶颈', '关键难点', '一致性'],
  结果: ['结果', '效果', '收益', '提升', '降低', '减少', '指标', '成功率'],
  指标结果: ['指标', '量化', '提升', '降低', '减少', '耗时', '成功率', '异常订单'],
  取舍原因: ['取舍', '为什么', '原因', '权衡', '因为', '所以', '代价'],
  复盘改进: ['改进', '复盘', '后续优化', '后来'],
  内存: ['内存数据库', '内存读写'],
  'I/O 多路复用': ['io多路复用', '多路复用', 'epoll', 'select', 'poll'],
  单线程模型: ['单线程', '避免锁', '锁竞争', '上下文切换'],
  单线程: ['单线程模型', '避免锁', '锁竞争'],
  数据结构: ['hash', 'skiplist', 'quicklist', '跳表', '压缩列表'],
  数据结构优化: ['数据结构', 'skiplist', 'quicklist', '跳表', 'hash'],
  协议简单: ['resp', '协议'],
  'B+ 树': ['b+树', 'b树', '树结构'],
  减少扫描范围: ['减少扫描', '少扫', '定位范围', '避免全表扫描'],
  减少扫描: ['减少扫描范围', '避免全表扫描'],
  有序: ['排序', '范围查询'],
  回表: ['二级索引回表', '回到主键索引'],
  聚簇索引: ['主键索引', '聚集索引'],
  覆盖索引: ['覆盖', '不回表'],
  数组: ['桶数组', 'table'],
  链表: ['链地址', '拉链法'],
  哈希冲突: ['hash冲突', '冲突'],
  红黑树: ['树化', 'treeify'],
  扩容: ['resize', '翻倍'],
  性能指标: ['fcp', 'lcp', 'ttfb', '指标', 'lighthouse'],
  先定位: ['定位', '排查', '分析'],
  网络: ['network', '瀑布图', '请求'],
  资源体积: ['包体积', 'js体积', 'css体积', '图片压缩'],
  渲染: ['主线程', '长任务', '阻塞'],
  缓存: ['cache', 'cdn'],
  代码分割: ['codesplit', '按需加载'],
  图片优化: ['图片压缩', '懒加载', 'webp'],
  短码生成: ['短码', 'base62', '发号器'],
  访问重定向: ['重定向', '301', '302'],
  存储映射: ['映射', '存储', '长链接'],
  短码唯一: ['唯一', '冲突'],
  高可用: ['容灾', '多副本', '降级'],
  统计: ['访问统计', '埋点'],
  限流: ['限流', '风控'],
  哈希表: ['map', 'hashmap', '字典'],
  一次遍历: ['遍历一次', '一遍'],
  差值: ['target-x', '补数', '另一个数'],
  时间复杂度: ['o(n)', '复杂度'],
  空间复杂度: ['o(n)', '额外空间'],
  重复数字处理: ['重复数字', '重复']
};
