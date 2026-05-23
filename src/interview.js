import { levelLabels, questionBank, roleLabels, styleLabels } from './questions.js';

const roleTopics = {
  backend: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  frontend: ['项目经历', '前端', '算法'],
  fullstack: ['项目经历', '前端', 'MySQL', 'Redis', '系统设计'],
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
  frontend: ['project', 'knowledge', 'knowledge', 'knowledge', 'algorithm'],
  fullstack: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  java: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  go: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm'],
  python: ['project', 'knowledge', 'knowledge', 'system-design', 'algorithm']
};

export function createInterviewPlan(config) {
  const role = config.role || 'backend';
  const level = config.level || 'middle';
  const targetCount = clamp(Number(config.questionCount || 5), 3, 8);
  const topics = roleTopics[role] || roleTopics.backend;
  const stages = roleStageBlueprints[role] || roleStageBlueprints.backend;
  const difficultyTargets = levelDifficultyTargets[level] || levelDifficultyTargets.middle;
  const available = buildCandidateQuestionPool(role, level);
  const selected = [];

  for (let index = 0; index < Math.min(targetCount, topics.length); index += 1) {
    const match = selectBestQuestion({
      available,
      selected,
      preferredCategory: topics[index],
      preferredType: stages[index] || stages[stages.length - 1] || 'knowledge',
      targetDifficulty: difficultyTargets[index] || difficultyTargets[difficultyTargets.length - 1] || 2
    });

    if (match) selected.push(match);
  }

  while (selected.length < Math.min(targetCount, available.length)) {
    const match = selectBestQuestion({
      available,
      selected,
      preferredCategory: null,
      preferredType: stages[selected.length] || 'knowledge',
      targetDifficulty: difficultyTargets[selected.length] || difficultyTargets[difficultyTargets.length - 1] || 2
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
  const evaluation = evaluateAnswer(effectiveAnswer, question);
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
    followUpCount: answerEntry?.followUpCount || 0
  });
  if (!evaluation.readyToMoveNext) {
    return createFollowUpReply(question, evaluation, session.config.style, answerEntry?.followUpCount || 0);
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
  if (!shouldMoveToNextQuestion(effectiveAnswer, question)) return;
  if (session.currentIndex < session.plan.length - 1) {
    session.currentIndex += 1;
  }
}

export function createReport(session) {
  const answersByQuestion = session.answers.map((entry) => {
    const followUpCount = entry.followUpCount || Math.max(0, (entry.attempts || 1) - 1);
    const evaluation = evaluateAnswer(entry.answer, entry.question, { followUpCount });

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
      confidence: describeAnswerConfidence(evaluation, entry.attempts || 1),
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      redFlags: evaluation.redFlags,
      followUpCategory: evaluation.followUpCategory,
      followUpSignal: createFollowUpSignal(evaluation, entry.attempts || 1),
      coachTip: createCoachTip(entry.question, evaluation),
      gapAnalysis: createGapAnalysis(entry.question, evaluation),
      interviewerSignal: createInterviewerSignal(entry.question, evaluation, entry.attempts || 1),
      improvedUserAnswer: improveAnswer(entry.answer, entry.question, evaluation),
      nextFollowUp: evaluation.followUpFocus || '这一题可以继续围绕实现细节、边界情况和方案取舍做深挖。',
      practiceDrill: createPracticeDrill(entry.question, evaluation)
    };
  });

  const weakAreas = answersByQuestion
    .filter((item) => item.score < 75 || item.gapAnalysis.includes('还需要补强'))
    .map((item) => item.category);
  const coachPriorities = createCoachPriorities(answersByQuestion);

  return {
    overview: {
      role: roleLabels[session.config.role] || session.config.role,
      level: levelLabels[session.config.level] || session.config.level,
      style: styleLabels[session.config.style] || session.config.style,
      answeredQuestions: session.answers.length,
      totalQuestions: session.plan.length,
      score: estimateScore(answersByQuestion),
      readiness: describeReadiness(answersByQuestion),
      summary: createOverallSummary(session, answersByQuestion),
      coachingFocus: createCoachingFocus(answersByQuestion),
      riskSummary: createRiskSummary(answersByQuestion),
      coachPriorities
    },
    questions: answersByQuestion,
    weakAreas: [...new Set(weakAreas)],
    nextPractice: createNextPractice(answersByQuestion, weakAreas)
  };
}

function evaluateAnswer(answer, question, context = {}) {
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
      communication: {
        hasStructure: true,
        hasMetrics: false,
        hasTradeoff: false,
        hasExample: false
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
  const fillerCount = fillerWords.reduce((count, word) => count + countOccurrences(answer, word), 0);
  const concisePenalty = answer.trim().length < 40 ? 12 : 0;
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
  const rawScore = clamp(keywordScore + mustHaveScore + goodToHaveScore + communicationScore - concisePenalty - fillerPenalty - redFlagPenalty, 0, 100);
  const score = clamp(rawScore - depthPenalty, 0, 100);
  const followUpCategory = classifyFollowUpCategory(question, rubric, mustHaveHits, missingKeywords, communication);
  const readyToMoveNext = mustHaveHits.length >= Math.max(1, Math.ceil(rubric.mustHave.length * 0.6))
    && (hitKeywords.length >= Math.min(3, question.keywords.length) || answer.trim().length >= 120)
    && score >= 68;

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
    communication
  };
}

function createFollowUpReply(question, evaluation, style, followUpCount = 0) {
  const prefix = {
    normal: '我想继续确认一个关键点：',
    pressure: '这个回答还不够落地，我继续追问：',
    coaching: '先把这块补完整：'
  }[style] || '我想继续确认一个关键点：';

  const escalation = followUpCount >= 2
    ? '这已经是这题的连续追问了，别再讲概念，直接讲你做过的判断、细节和结果。'
    : '';
  const suggestedFollowUp = selectFollowUp(question, evaluation, followUpCount);
  return `${prefix}${escalation}${suggestedFollowUp}`;
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
  if (missingMustHave.length) parts.push(`还需要补强的核心点：${missingMustHave.join('、')}`);
  if (missingGoodToHave.length) parts.push(`还能继续拉开差距的点：${missingGoodToHave.join('、')}`);
  if (communicationGaps.length) parts.push(`表达层面建议：${communicationGaps.join('、')}`);
  if (evaluation.followUpCategory !== 'complete') parts.push(`当前最像真实面试追问的缺口：${describeFollowUpCategory(evaluation.followUpCategory)}`);

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
  const supplement = evaluation.followUpFocus
    ? ` 补充时尤其注意：${evaluation.followUpFocus}`
    : '';

  return `${opening}${question.excellentAnswer}${supplement}`;
}

function estimateScore(answersByQuestion) {
  if (!answersByQuestion.length) return 0;
  const total = answersByQuestion.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / answersByQuestion.length);
}

function createNextPractice(answersByQuestion, weakAreas) {
  const lowest = [...answersByQuestion].sort((a, b) => a.score - b.score).slice(0, 2);
  const suggestions = lowest.map((item) => {
    return {
      title: `重练 ${item.category}`,
      goal: item.interviewerSignal,
      action: `围绕“${item.question}”补齐 ${item.nextFollowUp}`
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
    return suggestions.slice(0, 3);
  }

  suggestions.push({
    title: `专项复习 ${[...new Set(weakAreas)].join('、')}`,
    goal: '把零散知识点串成可被追问的完整主线。',
    action: '把核心概念、原理、场景和边界问题串起来。'
  });
  return dedupePracticeSuggestions(suggestions).slice(0, 3);
}

function createCoachTip(question, evaluation) {
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

  return `围绕“${question.category}”先收敛主线，再主动补一个场景或取舍细节。`;
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
      question: item.question,
      category: item.category,
      signal: item.followUpSignal,
      interviewerSignal: item.interviewerSignal,
      drill: item.practiceDrill,
      target: item.nextFollowUp
    }));
}

function createOverallSummary(session, answersByQuestion) {
  if (!answersByQuestion.length) {
    return '本轮没有有效回答，建议先完成一次完整模拟再看复盘。';
  }

  const strongCount = answersByQuestion.filter((item) => item.score >= 80).length;
  const weakCount = answersByQuestion.filter((item) => item.score < 70).length;
  const role = roleLabels[session.config.role] || session.config.role;

  if (strongCount === answersByQuestion.length) {
    return `这轮 ${role} 面试回答整体比较完整，已经接近真实面试中可继续深挖的水平。`;
  }

  if (weakCount >= Math.ceil(answersByQuestion.length / 2)) {
    return `这轮 ${role} 面试里基础主线还不够稳定，尤其需要补强回答结构、关键原理和场景化表达。`;
  }

  return `这轮 ${role} 面试的基础是有的，但稳定性一般，容易在追问时暴露细节、取舍和场景表达不足。`;
}

function createCoachingFocus(answersByQuestion) {
  if (!answersByQuestion.length) return '先完成一轮完整作答，再根据复盘安排训练。';

  const highestRisk = [...answersByQuestion]
    .sort((a, b) => a.score - b.score || b.attempts - a.attempts)[0];

  return `当前最该优先修的，是 ${highestRisk.category} 题里的“${highestRisk.nextFollowUp}”这类追问。`;
}

function createRiskSummary(answersByQuestion) {
  if (!answersByQuestion.length) return '暂无风险判断。';

  const repeated = answersByQuestion.filter((item) => item.attempts >= 2).length;
  const lowConfidence = answersByQuestion.filter((item) => item.confidence.level !== 'high').length;
  const redFlagged = answersByQuestion.filter((item) => (item.redFlags || []).length > 0).length;

  if (redFlagged >= Math.max(1, Math.ceil(answersByQuestion.length / 2))) {
    return '当前最大风险是面试官会把你判断成“概念听过，但真实落地和判断过程站不住”。需要用具体职责、取舍和结果证据把答案讲实。';
  }

  if (repeated >= 2 || lowConfidence >= Math.ceil(answersByQuestion.length / 2)) {
    return '当前主要风险不是完全不会，而是被追问两层后容易暴露主线不稳、细节不足。';
  }

  return '当前主要风险集中在少数题目的深挖稳定性，基础回答已经具备。';
}

function describeReadiness(answersByQuestion) {
  const average = estimateScore(answersByQuestion);
  if (average >= 85) return '接近真实面试通过线';
  if (average >= 75) return '具备基础竞争力，但追问稳定性不足';
  if (average >= 60) return '主线初步具备，需要系统补强';
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
    hasExample: /比如|例如|项目|线上|生产|场景|案例|当时/.test(answer)
  };
}

function describeAnswerConfidence(evaluation, attempts) {
  if (evaluation.score >= 82 && attempts <= 1) {
    return {
      level: 'high',
      label: '高把握',
      detail: '首轮回答已经能撑住真实面试里的继续深挖。'
    };
  }

  if (evaluation.score >= 68) {
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

function createPracticeDrill(question, evaluation) {
  const focus = evaluation.followUpFocus || question.followUps?.[0] || '把关键细节讲具体';
  const firstMissing = evaluation.weaknesses[0] || '把回答组织得更像真实面试口述';

  return `下次练这题时，先用 90 秒讲完主线，再单独针对“${focus}”做一次追问演练，重点按“${describeFollowUpCategory(evaluation.followUpCategory)}”这类压力补强，修正“${firstMissing}”。`;
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

function createFollowUpFocus(question, rubric, mustHaveHits, missingKeywords, communication, followUpCategory) {
  const missingMustHave = rubric.mustHave.filter((item) => !mustHaveHits.includes(item));
  if (missingMustHave.length) {
    return `把 ${missingMustHave[0]} 说具体，最好结合真实场景展开。`;
  }

  if (followUpCategory === 'ownership') {
    return '别只讲团队方案，明确说你自己负责哪部分、做了什么判断、落了什么代码或方案。';
  }

  if (!communication.hasTradeoff && question.type !== 'algorithm') {
    return '补充你为什么这么设计，以及方案的收益和代价。';
  }

  if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) {
    return '补充结果指标、量化收益或线上效果。';
  }

  if (missingKeywords.length) {
    return `补充 ${missingKeywords[0]} 相关细节，不要只停留在概念层。`;
  }

  return question.followUps?.[0] || '';
}

function selectFollowUp(question, evaluation, followUpCount = 0) {
  if (followUpCount >= 2 && evaluation.followUpCategory === 'evidence') {
    return '不要泛泛而谈，直接举一个你亲自处理过的线上或项目场景，按背景、动作、结果讲清楚。';
  }

  if (followUpCount >= 2 && evaluation.followUpCategory === 'tradeoff') {
    return '把你的取舍讲透：为什么选这个方案，不选什么，代价和边界分别是什么？';
  }

  const directFocus = evaluation.followUpFocus;
  if (directFocus) return directFocus;

  return question.followUps.find((item) => {
    return !evaluation.hitKeywords.some((keyword) => item.includes(keyword));
  }) || question.followUps[0] || '你再展开一下刚才的方案和关键细节。';
}

function classifyFollowUpCategory(question, rubric, mustHaveHits, missingKeywords, communication) {
  const missingMustHave = rubric.mustHave.filter((item) => !mustHaveHits.includes(item));

  if (missingMustHave.length) return 'core';
  if (question.type === 'project' && !communication.hasExample) return 'ownership';
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

function selectBestQuestion({ available, selected, preferredCategory, preferredType, targetDifficulty }) {
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
        selectedCategories
      })
    }))
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.item || null;
}

function buildCandidateQuestionPool(role, level) {
  const exactMatches = questionBank.filter((item) => item.roles.includes(role) && item.levels.includes(level));
  const sameRoleFallback = questionBank.filter((item) => item.roles.includes(role) && !exactMatches.includes(item));
  const adjacentRoleFallback = questionBank.filter((item) => {
    return !exactMatches.includes(item)
      && !sameRoleFallback.includes(item)
      && item.levels.includes(level)
      && sharesInterviewTrack(role, item.roles);
  });

  return [...exactMatches, ...sameRoleFallback, ...adjacentRoleFallback];
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

function scoreQuestionFit(item, { preferredCategory, preferredType, targetDifficulty, selectedCategories }) {
  let score = 0;

  if (preferredCategory && item.category === preferredCategory) score += 50;
  if (preferredType && item.type === preferredType) score += 20;
  if (!selectedCategories.has(item.category)) score += 12;
  score -= Math.abs((item.difficulty || 2) - targetDifficulty) * 6;

  if (item.type === 'project' && selectedCategories.size === 0) score += 8;
  if (item.type === 'algorithm' && selectedCategories.size >= 3) score += 5;
  if (item.type === 'system-design' && targetDifficulty >= 3) score += 5;

  return score;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
