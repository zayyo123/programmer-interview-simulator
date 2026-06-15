import { questionBank } from '../src/questions.js';
import { isGenericTemplateReferenceAnswer } from './referenceAnswerResolver.js';

function normalizeText(text = '') {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\u4e00-\u9fffa-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text = '') {
  return [...new Set(normalizeText(text).split(' ').filter((token) => token.length >= 2))];
}

function overlapTokens(left = [], right = []) {
  return left.filter((token) => right.includes(token)).length;
}

function scoreQuestionMatch(candidate, target) {
  let score = 0;
  if (candidate.category && target.category && candidate.category === target.category) score += 3;
  if (candidate.skill && target.skill && candidate.skill === target.skill) score += 4;

  const candidateTokens = tokenize(`${candidate.question} ${candidate.skill} ${candidate.category}`);
  const targetTokens = tokenize(`${target.question} ${target.skill} ${target.category}`);
  const overlap = candidateTokens.filter((token) => targetTokens.includes(token)).length;
  score += overlap * 2;

  const candidateNorm = normalizeText(candidate.question);
  const targetNorm = normalizeText(target.question);
  if (candidateNorm && targetNorm) {
    if (candidateNorm === targetNorm) score += 12;
    else if (candidateNorm.includes(targetNorm) || targetNorm.includes(candidateNorm)) score += 6;
  }

  return score;
}

export function findQuestionBankReferenceMatch(question = {}) {
  let best = null;
  let bestScore = 0;

  for (const bankQuestion of questionBank) {
    const score = scoreQuestionMatch(question, bankQuestion);
    if (score > bestScore) {
      bestScore = score;
      best = bankQuestion;
    }
  }

  if (!best || bestScore < 8) return null;

  const candidateTokens = tokenize(`${question.question} ${question.skill} ${question.category}`);
  const targetTokens = tokenize(`${best.question} ${best.skill} ${best.category}`);
  const overlap = overlapTokens(candidateTokens, targetTokens);
  if (bestScore < 10 && overlap < 3) return null;

  if (isGenericTemplateReferenceAnswer(best.referenceAnswer)) return null;

  return {
    referenceAnswer: best.referenceAnswer,
    excellentAnswer: best.excellentAnswer || best.referenceAnswer,
    matchedQuestionId: best.id,
    score: bestScore
  };
}
