import { loadRuntimeQuestionBank } from '../src/questionGovernance.js';
import { roleLabels } from '../src/questions.js';

const roleMinimums = {
  frontend: { total: 100, category: '前端', categoryMinimum: 90 },
  java: { total: 120, category: 'Java', categoryMinimum: 25 },
  go: { total: 120, category: 'Go', categoryMinimum: 25 },
  python: { total: 120, category: 'Python', categoryMinimum: 25 },
  qa: { total: 50, category: '测试', categoryMinimum: 50 },
  ops: { total: 100, category: '运维', categoryMinimum: 90 },
  devops: { total: 50, category: 'DevOps', categoryMinimum: 50 },
  data: { total: 120, category: '数据', categoryMinimum: 75 },
  ai: { total: 100, category: 'AI', categoryMinimum: 90 },
  security: { total: 100, category: '安全', categoryMinimum: 90 },
  architect: { total: 120, category: '系统设计', categoryMinimum: 75 }
};

const questionBank = await loadRuntimeQuestionBank();
const failures = [];

for (const [role, rule] of Object.entries(roleMinimums)) {
  const roleQuestions = questionBank.filter((question) => question.roles?.includes(role));
  const totalCount = roleQuestions.length;
  const categoryCount = roleQuestions.filter((question) => question.category === rule.category).length;
  if (totalCount < rule.total) {
    failures.push(`${roleLabels[role] || role}: 总题量 ${totalCount}/${rule.total}`);
  }
  if (categoryCount < rule.categoryMinimum) {
    failures.push(`${roleLabels[role] || role}: ${rule.category} 专项题 ${categoryCount}/${rule.categoryMinimum}`);
  }
}

if (failures.length) {
  console.error(`专项岗位题库覆盖不足：${failures.join('；')}`);
  process.exit(1);
}

console.log(
  `专项岗位题库覆盖通过：${Object.entries(roleMinimums)
    .map(([role, rule]) => {
      const roleQuestions = questionBank.filter((question) => question.roles?.includes(role));
      const totalCount = roleQuestions.length;
      const categoryCount = roleQuestions.filter((question) => question.category === rule.category).length;
      return `${roleLabels[role] || role} 总题量 ${totalCount}/${rule.total}，${rule.category} 专项 ${categoryCount}/${rule.categoryMinimum}`;
    })
    .join('；')}`
);
