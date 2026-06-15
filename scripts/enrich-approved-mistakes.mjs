import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../data/approved-questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const GENERIC_MISTAKES = [
  '只背结论，不解释机制、边界和取舍。',
  '没有结合真实项目或线上排查场景说明影响。',
  '忽略异常情况、性能风险或维护成本。'
];

const GENERIC_FOLLOWUP_RE = /^如果在真实项目里遇到/;

function shorten(text, max = 18) {
  const value = String(text || '').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

function deriveMistakes(question) {
  const mustHave = question.scoringRubric?.mustHave || question.expectedPoints?.slice(0, 4) || [];
  const goodToHave = question.scoringRubric?.goodToHave || question.expectedPoints?.slice(4) || [];
  const mistakes = [];

  if (mustHave.length >= 2) {
    mistakes.push(
      `只背「${shorten(mustHave[0])}」结论，说不清${shorten(mustHave[1])}的机制、边界或取舍。`
    );
  } else if (mustHave.length === 1) {
    mistakes.push(`只回答「${shorten(mustHave[0])}」，不解释原理和适用场景。`);
  }

  if (goodToHave.length) {
    mistakes.push(`忽略${goodToHave.slice(0, 2).map((item) => shorten(item, 12)).join('、')}等工程细节。`);
  } else if (question.skill) {
    mistakes.push(`在${question.skill}场景里只讲概念，缺少线上排查或落地经验。`);
  }

  mistakes.push('回答停留在背诵层，缺少真实项目案例、指标或验证方式。');

  return [...new Set(mistakes)].slice(0, 3);
}

function deriveFollowUps(question) {
  const topic = question.skill || question.category || '该问题';
  const mustHave = question.scoringRubric?.mustHave || question.expectedPoints?.slice(0, 3) || [];

  const followUps = [
    `在真实${topic}场景里，你通常会先观察哪些现象或指标？`,
    mustHave.length
      ? `很多人会在「${shorten(mustHave[0])}」这里理解偏了，你会怎么澄清？`
      : `这个问题最容易踩的边界或误区是什么？`,
    '如果面试官要求你给出落地方案，你会如何设计验证步骤？'
  ];

  return followUps;
}

function refineReferenceAnswer(question) {
  let answer = question.referenceAnswer || '';
  if (/索引失效/.test(question.question || '') && /常见索引失效/.test(answer)) {
    answer = answer.replace(
      '常见索引失效包括',
      '优化器未选择预期索引的常见原因包括'
    );
    if (!/小表|全表扫描可能更便宜/.test(answer)) {
      answer += ' 也要注意小表或低选择性场景下全表扫描未必是问题，需结合执行计划和扫描行数判断。';
    }
  }
  return answer;
}

let updatedMistakes = 0;
let updatedFollowUps = 0;
let updatedReference = 0;

for (const question of data.questions) {
  const isGenericMistakes = JSON.stringify(question.commonMistakes) === JSON.stringify(GENERIC_MISTAKES);
  const hasGenericFollowUp = (question.followUps || []).some((item) => GENERIC_FOLLOWUP_RE.test(item));

  if (isGenericMistakes) {
    const mistakes = deriveMistakes(question);
    question.commonMistakes = mistakes;
    if (question.scoringRubric) {
      question.scoringRubric.redFlags = [...mistakes];
    }
    updatedMistakes += 1;
  }

  if (hasGenericFollowUp) {
    question.followUps = deriveFollowUps(question);
    updatedFollowUps += 1;
  }

  const refined = refineReferenceAnswer(question);
  if (refined !== question.referenceAnswer) {
    question.referenceAnswer = refined;
    updatedReference += 1;
  }
}

data.updatedAt = new Date().toISOString();
fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ updatedMistakes, updatedFollowUps, updatedReference }, null, 2));
