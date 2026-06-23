import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveQuestionAnswers } from '../shared/referenceAnswerResolver.js';
import { getConcreteKnowledgeAnswer } from '../shared/concreteReferenceCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, '../data/approved-questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const PATCHES = {
  'approved_system_multi_region_001': {
    referenceAnswer:
      '跨机房高可用要先明确 RTO、RPO、读写模型和故障范围，并区分读链路与强一致写链路——写链路跨地域多活成本很高，通常选同城双活 + 单主写、异步复制和快速切换；读链路可更积极做多地缓存和读副本。流量切换分层：入口 DNS/GSLB/网关就近与故障切流，服务层无状态或状态外置，数据层按场景选主备、异步复制、单元化多活，并量化冲突处理成本。故障检测不能只看机器存活，要看业务成功率、延迟、错误率和依赖健康；切换要有 fencing、版本号、幂等、回放、预案、权限和回滚。最难的是数据冲突和故障误判，平时必须用演练验证 RTO/RPO，而不是只在文档里写高可用。'
  }
};

function pickAnswers(question, resolved) {
  const patch = PATCHES[question.id];
  const catalog = getConcreteKnowledgeAnswer(question);

  let referenceAnswer = patch?.referenceAnswer ?? resolved.referenceAnswer;
  let excellentAnswer = resolved.excellentAnswer;

  // 目录版显著更长时，同步写入主题库（避免运行时与主数据长期不一致）
  if (!patch && catalog?.referenceAnswer) {
    const current = String(question.referenceAnswer || '').trim();
    const candidate = String(catalog.referenceAnswer || '').trim();
    if (candidate.length >= current.length + 20 && candidate !== current) {
      referenceAnswer = candidate;
      if (catalog.excellentAnswer && catalog.excellentAnswer.length >= String(question.excellentAnswer || '').length) {
        excellentAnswer = catalog.excellentAnswer;
      }
    }
  }

  if (question.id === 'approved_security_011_sql_注入') {
    referenceAnswer = String(referenceAnswer).replace(/含占位符/g, '使用 ? 或 :name 等绑定参数');
    referenceAnswer = referenceAnswer.replace(/与数量匹配的占位符/g, '与数量匹配的绑定参数');
  }

  if (question.id === 'approved_frontend_extra_019_大列表虚拟滚动') {
    referenceAnswer = String(referenceAnswer).replace(/空白占位/g, '空白区域');
  }

  if (question.id === 'approved_frontend_extra_031_弱网优化') {
    referenceAnswer = String(referenceAnswer).replace(/页面结构占位/g, '页面骨架布局');
    if (excellentAnswer.length < 40) {
      excellentAnswer =
        '我会设超时和指数退避重试，骨架屏降低等待感知，Service Worker 缓存离线可用，弱网下降级图片和视频优先保证核心内容。';
    }
  }

  return { referenceAnswer, excellentAnswer };
}

let upgraded = 0;

data.questions = data.questions.map((question) => {
  const resolved = resolveQuestionAnswers(question);
  const { referenceAnswer, excellentAnswer } = pickAnswers(question, resolved);

  const changed =
    referenceAnswer !== question.referenceAnswer
    || excellentAnswer !== question.excellentAnswer;

  if (changed) upgraded += 1;

  return changed
    ? { ...question, referenceAnswer, excellentAnswer }
    : question;
});

data.updatedAt = new Date().toISOString();
fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ upgraded }, null, 2));
