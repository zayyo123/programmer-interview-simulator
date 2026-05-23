import { levelLabels, questionBank, roleLabels, styleLabels } from './questions.js';

const roleTopics = {
  backend: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  frontend: ['项目经历', '前端', '算法'],
  fullstack: ['项目经历', '前端', 'MySQL', 'Redis', '系统设计'],
  java: ['项目经历', 'Java', 'MySQL', 'Redis', '系统设计', '算法'],
  go: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  python: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法']
};

const fillerWords = ['然后', '就是', '那个', '可能', '感觉', '大概', '比较', '这个', '那个时候'];

export function createInterviewPlan(config) {
  const topics = roleTopics[config.role] || roleTopics.backend;
  const selected = [];

  for (const topic of topics) {
    const match = questionBank.find((item) => {
      return item.category === topic
        && item.roles.includes(config.role)
        && item.levels.includes(config.level)
        && !selected.some((selectedItem) => selectedItem.id === item.id);
    });

    if (match) selected.push(match);
  }

  return selected.slice(0, Number(config.questionCount || 5));
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return;
  }

  currentEntry.answer = mergeAnswerAttempts(currentEntry.answer, normalizedAnswer);
  currentEntry.attempts += 1;
  currentEntry.updatedAt = new Date().toISOString();
}

export function buildInterviewPrompt({ session, answer }) {
  const question = getCurrentQuestion(session);
  const nextQuestion = session.plan[session.currentIndex + 1];
  const evaluation = evaluateAnswer(answer, question);
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

  const evaluation = evaluateAnswer(answer, question);
  if (!evaluation.readyToMoveNext) {
    return createFollowUpReply(question, evaluation, session.config.style);
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
  if (!shouldMoveToNextQuestion(answer, question)) return;
  if (session.currentIndex < session.plan.length - 1) {
    session.currentIndex += 1;
  }
}

export function createReport(session) {
  const answersByQuestion = session.answers.map((entry) => {
    const evaluation = evaluateAnswer(entry.answer, entry.question);

    return {
      question: entry.question.question,
      category: entry.question.category,
      attempts: entry.attempts || 1,
      userAnswer: entry.answer,
      userAnswerSummary: summarizeAnswer(entry.answer),
      referenceAnswer: entry.question.referenceAnswer,
      excellentAnswer: entry.question.excellentAnswer,
      score: evaluation.score,
      strengths: evaluation.strengths,
      gapAnalysis: createGapAnalysis(entry.question, evaluation),
      improvedUserAnswer: improveAnswer(entry.answer, entry.question, evaluation),
      nextFollowUp: evaluation.followUpFocus || '这一题可以继续围绕实现细节、边界情况和方案取舍做深挖。'
    };
  });

  const weakAreas = answersByQuestion
    .filter((item) => item.score < 75 || item.gapAnalysis.includes('还需要补强'))
    .map((item) => item.category);

  return {
    overview: {
      role: roleLabels[session.config.role] || session.config.role,
      level: levelLabels[session.config.level] || session.config.level,
      style: styleLabels[session.config.style] || session.config.style,
      answeredQuestions: session.answers.length,
      totalQuestions: session.plan.length,
      score: estimateScore(answersByQuestion),
      readiness: describeReadiness(answersByQuestion),
      summary: createOverallSummary(session, answersByQuestion)
    },
    questions: answersByQuestion,
    weakAreas: [...new Set(weakAreas)],
    nextPractice: createNextPractice(answersByQuestion, weakAreas)
  };
}

function evaluateAnswer(answer, question) {
  if (!question) {
    return {
      score: 100,
      readyToMoveNext: true,
      hitKeywords: [],
      missingKeywords: [],
      strengths: [],
      weaknesses: [],
      followUpFocus: '',
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

  const normalized = normalizeText(answer);
  const rubric = question.scoringRubric || { mustHave: [], goodToHave: [], redFlags: [] };
  const hitKeywords = question.keywords.filter((keyword) => normalized.includes(normalizeText(keyword)));
  const missingKeywords = question.keywords.filter((keyword) => !normalized.includes(normalizeText(keyword)));
  const mustHaveHits = rubric.mustHave.filter((item) => normalized.includes(normalizeText(item)));
  const goodToHaveHits = rubric.goodToHave.filter((item) => normalized.includes(normalizeText(item)));
  const communication = {
    hasStructure: /首先|然后|最后|一方面|另一方面|先|再|总结/.test(answer),
    hasMetrics: /\d+|百分之|ms|秒|qps|tps|延迟|吞吐|成功率|耗时/.test(answer),
    hasTradeoff: /因为|所以|权衡|取舍|代价|收益|风险|边界/.test(answer),
    hasExample: /比如|例如|项目|线上|生产|场景|案例|当时/.test(answer)
  };
  const fillerCount = fillerWords.reduce((count, word) => count + countOccurrences(answer, word), 0);
  const concisePenalty = answer.trim().length < 40 ? 12 : 0;
  const fillerPenalty = fillerCount >= 6 ? 6 : 0;
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
  const score = clamp(keywordScore + mustHaveScore + goodToHaveScore + communicationScore - concisePenalty - fillerPenalty, 0, 100);
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
    followUpFocus: createFollowUpFocus(question, rubric, mustHaveHits, missingKeywords, communication),
    rubricHits: {
      mustHave: mustHaveHits,
      goodToHave: goodToHaveHits
    },
    communication
  };
}

function createFollowUpReply(question, evaluation, style) {
  const prefix = {
    normal: '我想继续确认一个关键点：',
    pressure: '这个回答还不够落地，我继续追问：',
    coaching: '先把这块补完整：'
  }[style] || '我想继续确认一个关键点：';

  const suggestedFollowUp = selectFollowUp(question, evaluation);
  return `${prefix}${suggestedFollowUp}`;
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

  const parts = [];
  if (missingMustHave.length) parts.push(`还需要补强的核心点：${missingMustHave.join('、')}`);
  if (missingGoodToHave.length) parts.push(`还能继续拉开差距的点：${missingGoodToHave.join('、')}`);
  if (communicationGaps.length) parts.push(`表达层面建议：${communicationGaps.join('、')}`);

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
    return `重练 ${item.category}：围绕“${item.question}”补齐 ${item.nextFollowUp}`;
  });

  if (!weakAreas.length) {
    suggestions.push('继续提高回答密度，把项目题练到 2 分钟内讲清背景、职责、方案、结果和复盘。');
    suggestions.push('增加压力面追问练习，重点训练边界情况、定位过程和技术取舍。');
    return suggestions.slice(0, 3);
  }

  suggestions.push(`专项复习 ${[...new Set(weakAreas)].join('、')}，把核心概念、原理、场景和边界问题串起来。`);
  return [...new Set(suggestions)].slice(0, 3);
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
    return !normalizeTextArray(question.keywords).includes(normalizeText(item))
      || missingKeywords.some((keyword) => normalizeText(keyword).includes(normalizeText(item)));
  });

  if (missingKeywords.length) weaknesses.push(`缺少关键词：${missingKeywords.join('、')}`);
  if (missingMustHave.length) weaknesses.push(`需要更明确点出：${missingMustHave.join('、')}`);
  if (!communication.hasStructure) weaknesses.push('回答结构松散');
  if (!communication.hasTradeoff && question.type !== 'algorithm') weaknesses.push('没有展开取舍或原因');
  if (!communication.hasMetrics && ['project', 'system-design'].includes(question.type)) weaknesses.push('缺少量化结果');

  return weaknesses;
}

function createFollowUpFocus(question, rubric, mustHaveHits, missingKeywords, communication) {
  const missingMustHave = rubric.mustHave.filter((item) => !mustHaveHits.includes(item));
  if (missingMustHave.length) {
    return `把 ${missingMustHave[0]} 说具体，最好结合真实场景展开。`;
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

function selectFollowUp(question, evaluation) {
  const directFocus = evaluation.followUpFocus;
  if (directFocus) return directFocus;

  return question.followUps.find((item) => {
    return !evaluation.hitKeywords.some((keyword) => item.includes(keyword));
  }) || question.followUps[0] || '你再展开一下刚才的方案和关键细节。';
}

function normalizeText(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, '');
}

function normalizeTextArray(values) {
  return values.map((item) => normalizeText(item));
}

function countOccurrences(text, token) {
  const matches = String(text).match(new RegExp(token, 'g'));
  return matches ? matches.length : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
