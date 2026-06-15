import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isGenericTemplateReferenceAnswer,
  resolveQuestionAnswers
} from '../shared/referenceAnswerResolver.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../data/approved-questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;
let stillGeneric = 0;

data.questions = data.questions.map((question) => {
  if (!isGenericTemplateReferenceAnswer(question.referenceAnswer)
    && !isGenericTemplateReferenceAnswer(question.excellentAnswer)) {
    return question;
  }

  const resolved = resolveQuestionAnswers(question);
  if (isGenericTemplateReferenceAnswer(resolved.referenceAnswer)) {
    stillGeneric += 1;
    return question;
  }

  updated += 1;
  return {
    ...question,
    referenceAnswer: resolved.referenceAnswer,
    excellentAnswer: resolved.excellentAnswer
  };
});

data.updatedAt = new Date().toISOString();
fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ updated, stillGeneric }, null, 2));
