import { chooseProvider } from './config.js';
import { generateConcreteReferenceAnswer } from './ai.js';
import { createReport } from './interview.js';
import { isGenericTemplateReferenceAnswer, resolveQuestionAnswers } from '../shared/referenceAnswerResolver.js';

export async function finalizeReport(session, config) {
  const report = createReport(session);
  if (chooseProvider(config) === 'mock') {
    return report;
  }

  for (const item of report.questions) {
    if (!isGenericTemplateReferenceAnswer(item.referenceAnswer)) {
      continue;
    }

    const entry = session.answers.find((answer) => answer.question.id === item.questionId);
    const question = entry?.question || {
      id: item.questionId,
      category: item.category,
      skill: item.skill,
      type: item.type,
      question: item.question,
      scoringRubric: entry?.question?.scoringRubric
    };

    const generated = await generateConcreteReferenceAnswer({ config, question });
    if (generated) {
      item.referenceAnswer = generated.referenceAnswer;
      item.excellentAnswer = generated.excellentAnswer;
      continue;
    }

    const resolved = resolveQuestionAnswers(question);
    if (!isGenericTemplateReferenceAnswer(resolved.referenceAnswer)) {
      item.referenceAnswer = resolved.referenceAnswer;
      item.excellentAnswer = resolved.excellentAnswer;
    }
  }

  return report;
}
