import { levelLabels, questionBank, roleLabels, styleLabels } from './questions.js';

const roleTopics = {
  backend: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  frontend: ['项目经历', '前端', '算法'],
  fullstack: ['项目经历', '前端', 'MySQL', 'Redis', '系统设计'],
  java: ['项目经历', 'Java', 'MySQL', 'Redis', '系统设计', '算法'],
  go: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法'],
  python: ['项目经历', 'MySQL', 'Redis', '系统设计', '算法']
};

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
    ? '我也会结合你提供的简历或项目经历做一些追问。'
    : '如果涉及项目经历，你可以按真实面试的方式补充背景。';

  const styleLine = {
    normal: '我会按真实技术面试的节奏提问，并根据你的回答继续追问。',
    pressure: '这轮我会更关注细节、边界情况和技术取舍，如果回答比较笼统，我会继续深挖。',
    coaching: '这轮偏练习性质，我会适当用追问帮你把回答补充得更完整。'
  }[config.style] || '我会按真实技术面试的节奏提问，并根据你的回答继续追问。';

  return [
    `你好，我们开始一场${level}${role}模拟面试。`,
    `本次面试风格是${style}，预计会覆盖项目经历、基础知识、工程实践和必要的算法或系统设计。`,
    resumeLine,
    styleLine,
    '请像真实面试一样回答，不需要一次说得完美，但要尽量讲清楚你的思路。',
    `第一个问题：${firstQuestion.question}`
  ].join('\n');
}

export function getCurrentQuestion(session) {
  return session.plan[session.currentIndex] || null;
}

export function buildInterviewPrompt({ session, answer }) {
  const question = getCurrentQuestion(session);
  const nextQuestion = session.plan[session.currentIndex + 1];
  const canMoveNext = shouldMoveToNextQuestion(answer, question);
  const history = session.messages
    .slice(-8)
    .map((message) => `${message.role === 'candidate' ? '候选人' : '面试官'}：${message.content}`)
    .join('\n');

  return [
    '你是一名资深程序员技术面试官。',
    '你的任务是根据候选人的回答，判断是否需要追问，并保持真实面试节奏。',
    '不要透露参考答案，不要直接给标准答案。',
    '如果回答明显不完整，优先追问一个最关键的问题。',
    '如果回答已经较完整，可以简短确认并提出下一道题。',
    '输出必须是中文，语气自然，像真实面试官。',
    '',
    `岗位：${roleLabels[session.config.role] || session.config.role}`,
    `级别：${levelLabels[session.config.level] || session.config.level}`,
    `面试风格：${styleLabels[session.config.style] || session.config.style}`,
    `当前问题：${question?.question || '无'}`,
    `当前题目关键词：${question?.keywords?.join('、') || '无'}`,
    `可选追问：${question?.followUps?.join('；') || '无'}`,
    `系统判断是否进入下一题：${canMoveNext ? '是' : '否'}`,
    `下一题：${nextQuestion?.question || '无'}`,
    '',
    '最近对话：',
    history,
    '',
    `候选人最新回答：${answer}`,
    '',
    canMoveNext && nextQuestion
      ? '请简短确认当前回答，然后提出“下一题”中的问题。'
      : '请针对当前回答提出一个关键追问，或者在没有下一题时提示可以结束面试。',
    '请输出面试官下一句。'
  ].join('\n');
}

export function shouldMoveToNextQuestion(answer, question) {
  if (!question) return true;

  const normalized = answer.toLowerCase();
  const hitCount = question.keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length;
  const enoughLength = answer.trim().length >= 80;

  return hitCount >= Math.min(2, question.keywords.length) || enoughLength;
}

export function createFallbackInterviewerReply({ session, answer }) {
  const question = getCurrentQuestion(session);
  if (!question) {
    return '好的，这轮问题已经结束。你可以点击结束面试，我会为你生成复盘报告。';
  }

  if (!shouldMoveToNextQuestion(answer, question)) {
    return `你这个回答提到了部分方向，但还不够展开。我追问一下：${question.followUps[0]}`;
  }

  const nextQuestion = session.plan[session.currentIndex + 1];
  if (!nextQuestion) {
    return '好的，这个问题先到这里。本轮主要问题已经问完，你可以点击结束面试生成报告。';
  }

  return `好的，这个问题先到这里。下一题：${nextQuestion.question}`;
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
    const missing = entry.question.keywords.filter((keyword) => {
      return !entry.answer.toLowerCase().includes(keyword.toLowerCase());
    });

    return {
      question: entry.question.question,
      category: entry.question.category,
      userAnswer: entry.answer,
      userAnswerSummary: summarizeAnswer(entry.answer),
      referenceAnswer: entry.question.referenceAnswer,
      excellentAnswer: entry.question.excellentAnswer,
      gapAnalysis: missing.length
        ? `你的回答还可以补充：${missing.join('、')}。`
        : '你的回答覆盖了题目中的主要关键词，可以继续加强表达结构和项目化例子。',
      improvedUserAnswer: improveAnswer(entry.answer, entry.question)
    };
  });

  const weakAreas = answersByQuestion
    .filter((item) => item.gapAnalysis.includes('还可以补充'))
    .map((item) => item.category);

  return {
    overview: {
      role: roleLabels[session.config.role] || session.config.role,
      level: levelLabels[session.config.level] || session.config.level,
      style: styleLabels[session.config.style] || session.config.style,
      answeredQuestions: session.answers.length,
      totalQuestions: session.plan.length,
      score: estimateScore(session)
    },
    questions: answersByQuestion,
    weakAreas: [...new Set(weakAreas)],
    nextPractice: createNextPractice(weakAreas)
  };
}

function summarizeAnswer(answer) {
  const trimmed = answer.trim();
  if (trimmed.length <= 90) return trimmed;
  return `${trimmed.slice(0, 90)}...`;
}

function improveAnswer(answer, question) {
  const hasExample = answer.includes('项目') || answer.includes('系统') || answer.includes('业务');
  const prefix = hasExample
    ? '可以把你的回答整理成更清晰的结构：'
    : '建议补充一个项目或工程场景，让回答更像真实面试：';

  return `${prefix}${question.excellentAnswer}`;
}

function estimateScore(session) {
  if (!session.answers.length) return 0;

  const scores = session.answers.map((entry) => {
    const hits = entry.question.keywords.filter((keyword) => {
      return entry.answer.toLowerCase().includes(keyword.toLowerCase());
    }).length;
    const keywordScore = Math.min(70, Math.round((hits / entry.question.keywords.length) * 70));
    const lengthScore = Math.min(30, Math.round(entry.answer.trim().length / 8));
    return keywordScore + lengthScore;
  });

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function createNextPractice(weakAreas) {
  if (!weakAreas.length) {
    return ['继续练习更高难度追问', '尝试加入真实项目指标', '练习 3 分钟内结构化表达'];
  }

  return [...new Set(weakAreas)].map((area) => `专项复习 ${area}，重点补齐概念、原理、场景和边界问题`);
}
