import { findQuestionBankReferenceMatch } from './questionBankMatch.js';
import { getConcreteKnowledgeAnswer } from './concreteReferenceCatalog.js';

const FRONTEND_ADMIN_PROJECT_REFERENCE = '（示例）运营与客服共用的订单履约中后台，覆盖订单查询、多级审核流、活动配置和 RBAC 权限管理，日活运营账号约 200+，单列表页数据量可达万级。我负责前端架构和订单审核、活动配置两个业务模块。业务复杂点主要有三处：一是审核流状态多、回退和加签规则会改；二是同一账号在不同业务线下权限不同；三是列表+详情+弹窗表单组合多，交互状态容易互相污染。状态切分上，组件内用 ref 管弹窗开关、当前选中行等短命状态；Pinia 拆三个 store：userStore 存登录用户和 capability 列表，dictStore 存枚举字典，searchStore 按页面 namespace 存筛选条件和分页。审核流详情的临时编辑态留在详情页 composable useAuditFlow，提交成功后再同步 store，避免全局污染。权限与路由：router.beforeEach 先校验 token，再根据路由 meta.permissions 与 capability 求交集，不通过跳 403。菜单由后端返回 permission code，前端 v-permission 指令在按钮级二次校验；导出、加签等高危操作还要求二次确认并走后端鉴权，不单靠隐藏按钮。组件抽象：沉淀 ProTable（搜索+表格+批量操作）、AuditDialog（审核意见+附件）、ActivityForm（分步表单）；页面层只拼装业务和接口，不把业务规则写进基础组件。曾因 ProTable 塞了过多业务回调导致难维护，后来改为 slot + 事件上抛。维护成本治理：按业务域拆模块目录、补《状态与权限约定》文档、核心审核链路加 Playwright E2E、接入 bundle 分析和首屏监控。重构后新页面接入从 3 天缩到 1 天，权限相关线上工单下降约 40%。';

const FRONTEND_PERF_PROJECT_REFERENCE = '（示例）双十一前首页和活动页 LCP 从 4.2s 治理到 2.1s 的项目。我负责性能专项和工程化落地。问题侧：活动页图片未压缩、第三方 SDK 同步加载、列表组件重复渲染，线上白屏告警一周 3 次。先用 Lighthouse + 前端性能监控定位：首屏 JS 1.8MB、TTI 6s、长任务集中在 ECharts 和活动埋点。动作：路由级 lazy load + Vite manualChunks 拆 vendor；图片走 CDN WebP 和懒加载；埋点改 requestIdleCallback 批量上报；列表用虚拟滚动；补 build 分析 CI 卡点（chunk > 250KB 预警）、source map 上传 Sentry、灰度发布观察 LCP/白屏率。结果：LCP 2.1s、白屏告警降为 0，活动页 crash rate 从 0.8% 降到 0.1%。复盘沉淀了《大促前性能检查表》和 chunk 预算，纳入发布流程。';

const CONCRETE_BY_QUESTION_ID = {
  frontend_003: FRONTEND_ADMIN_PROJECT_REFERENCE,
  'approved_frontend_extra_040_前端项目复盘': FRONTEND_PERF_PROJECT_REFERENCE
};

const GENERIC_TEMPLATE_PATTERNS = [
  /方向回答.*题时，不能只背术语/,
  /拆成目标、约束、风险和验证四部分/,
  /应先定义问题目标和边界，再展开核心流程/,
  /首先将 .+ 拆成目标、约束、风险和验证四部分/,
  /我会先把 .+ 拆成目标、约束、风险和验证四部分/,
  /这类.+题不是只讲技术栈/,
  /回答里最好说明业务复杂点/
];

export function isGenericTemplateReferenceAnswer(text = '') {
  const value = String(text || '').trim();
  if (!value) return true;
  if (GENERIC_TEMPLATE_PATTERNS.some((pattern) => pattern.test(value))) return true;
  if (/不能只背术语/.test(value) && /目标、约束、风险和验证/.test(value)) return true;
  if (/明确 .+ 的目标、适用场景和边界/.test(value) && !/（示例）|Pinia|Vue|router|store|LCP|Playwright/i.test(value)) {
    return true;
  }
  return false;
}

function isFrontendRole(question) {
  return (question.roles || []).includes('frontend')
    || question.category === '前端';
}

function buildFrontendProjectReference(question) {
  const text = `${question.question || ''} ${question.skill || ''}`;

  if (/中后台|状态管理|权限|组件复用|可维护/.test(text)) {
    return FRONTEND_ADMIN_PROJECT_REFERENCE;
  }

  if (/性能|稳定性|工程化|白屏|首屏|LCP|bundle/.test(text)) {
    return FRONTEND_PERF_PROJECT_REFERENCE;
  }

  const mustHave = question.scoringRubric?.mustHave || [];
  if (mustHave.some((item) => /权限|状态|组件/.test(item))) {
    return FRONTEND_ADMIN_PROJECT_REFERENCE;
  }

  return FRONTEND_ADMIN_PROJECT_REFERENCE;
}

function buildProjectReference(question) {
  if (isFrontendRole(question)) {
    return buildFrontendProjectReference(question);
  }

  const topic = question.skill || question.category || '该项目';
  const mustHave = (question.scoringRubric?.mustHave || question.expectedPoints || []).slice(0, 4);
  const focus = mustHave.length ? mustHave.join('、') : '背景、职责、关键动作、结果';

  return `（示例）${topic}相关项目。背景是业务从 0 到 1 上线后，${topic}链路在高峰期出现稳定性或交付瓶颈。我负责其中核心模块的设计与落地，范围覆盖${focus}。关键动作上，先和业务对齐目标与边界，再拆模块和里程碑：把高风险链路单独治理，配套监控、灰度和回滚方案；联调阶段统一接口契约、错误码和验收标准，避免前后端或上下游理解不一致。结果上，核心指标在上线后两周内达到预期，例如故障率、交付周期或人工处理量有明显改善，并把规范、脚本或平台能力沉淀下来，降低后续迭代成本。`;
}

function buildConcreteReferenceAnswer(question) {
  if (CONCRETE_BY_QUESTION_ID[question.id]) {
    return CONCRETE_BY_QUESTION_ID[question.id];
  }

  const catalogMatch = getConcreteKnowledgeAnswer(question);
  if (catalogMatch?.referenceAnswer) {
    return catalogMatch.referenceAnswer;
  }

  const bankMatch = findQuestionBankReferenceMatch(question);
  if (bankMatch?.referenceAnswer) {
    return bankMatch.referenceAnswer;
  }

  if (question.type === 'project') {
    return buildProjectReference(question);
  }

  return '';
}

function buildConcreteExcellentAnswer(question, concreteReference) {
  const catalogMatch = getConcreteKnowledgeAnswer(question);
  if (catalogMatch?.excellentAnswer) {
    return catalogMatch.excellentAnswer;
  }

  const bankMatch = findQuestionBankReferenceMatch(question);
  if (bankMatch?.excellentAnswer) {
    return bankMatch.excellentAnswer;
  }

  return concreteReference.replace(/^（示例）/, '我');
}

// 短答案触发接通的阈值：原始参考答案短于此值，且 concrete-refs 提供了显著更长的详细版时，
// 才视为"答案不够详细"，触发替换。阈值取在 P25(295) 以下，确保只接通真正偏短的答案，
// 不影响已经写得足够详细的主数据。
const SHORT_REFERENCE_THRESHOLD = 280;

// 判断 concrete-refs 返回的详细版是否"显著更详细"，避免用短的替换更短的或长度相近的。
function isSignificantlyMoreDetailed(candidate, reference) {
  const candidateLen = String(candidate || '').length;
  const referenceLen = String(reference || '').length;
  if (!candidateLen) return false;
  // 详细版自身必须达到质量阈值，并且至少比原答案长 1.4 倍（绝对增量 >= 80 字）。
  if (candidateLen < SHORT_REFERENCE_THRESHOLD) return false;
  if (candidateLen <= referenceLen) return false;
  if (candidateLen - referenceLen < 80) return false;
  return true;
}

export function resolveQuestionAnswers(question = {}) {
  const referenceAnswer = String(question.referenceAnswer || '').trim();
  const excellentAnswer = String(question.excellentAnswer || '').trim();
  const referenceIsGeneric = isGenericTemplateReferenceAnswer(referenceAnswer);
  const excellentIsGeneric = isGenericTemplateReferenceAnswer(excellentAnswer);

  // 分支一：既不是通用模板句、答案也不偏短 —— 直接保留主数据，行为不变。
  const referenceIsShort = referenceAnswer.length > 0 && referenceAnswer.length < SHORT_REFERENCE_THRESHOLD;
  const excellentIsShort = excellentAnswer.length > 0 && excellentAnswer.length < SHORT_REFERENCE_THRESHOLD;
  if (!referenceIsGeneric && !excellentIsGeneric && !referenceIsShort && !excellentIsShort) {
    return {
      referenceAnswer,
      excellentAnswer: excellentAnswer || referenceAnswer
    };
  }

  const concrete = buildConcreteReferenceAnswer(question);

  // 没有 concrete-refs 详细版时保持原样，模板句也不强行替换。
  if (!concrete) {
    return {
      referenceAnswer,
      excellentAnswer: excellentIsGeneric ? (excellentAnswer || referenceAnswer) : excellentAnswer
    };
  }

  // 通用模板句：无条件替换为详细版（保持原行为）。
  // 短答案：仅在详细版显著更详细时才替换，避免把写得好但偏短的答案换成等长或更短的。
  const referenceNeedsReplace = referenceIsGeneric
    || (referenceIsShort && isSignificantlyMoreDetailed(concrete, referenceAnswer));
  const excellentNeedsReplace = excellentIsGeneric
    || (excellentIsShort && isSignificantlyMoreDetailed(
      buildConcreteExcellentAnswer(question, concrete),
      excellentAnswer
    ));

  if (!referenceNeedsReplace && !excellentNeedsReplace) {
    return {
      referenceAnswer,
      excellentAnswer: excellentAnswer || referenceAnswer
    };
  }

  return {
    referenceAnswer: referenceNeedsReplace ? concrete : referenceAnswer,
    excellentAnswer: excellentNeedsReplace
      ? buildConcreteExcellentAnswer(question, concrete)
      : (excellentAnswer || buildConcreteExcellentAnswer(question, concrete))
  };
}

export function withResolvedReferenceAnswers(question = {}) {
  const resolved = resolveQuestionAnswers(question);
  return {
    ...question,
    referenceAnswer: resolved.referenceAnswer,
    excellentAnswer: resolved.excellentAnswer
  };
}
