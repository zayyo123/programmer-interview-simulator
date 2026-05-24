import { evaluateAnswerForTest } from '../src/interview.js';
import { questionBank } from '../src/questions.js';

const answer = '我最近参与的是订单系统，业务目标是提升下单后库存确认的稳定性。我负责订单状态流转、库存扣减和消息补偿。技术栈是 Spring Boot、MySQL、Redis 和 RabbitMQ。关键难点是订单创建和库存扣减的一致性，我通过本地消息表、幂等消费和定时补偿保证最终一致性，异常订单处理量明显降低。';
const question = questionBank.find((item) => item.id === 'project_001');
const evaluation = evaluateAnswerForTest(answer, question, {
  level: 'middle'
});

console.log(JSON.stringify({
  score: evaluation.score,
  readyToMoveNext: evaluation.readyToMoveNext,
  hitKeywords: evaluation.hitKeywords,
  mustHave: evaluation.rubricHits.mustHave,
  goodToHave: evaluation.rubricHits.goodToHave,
  communication: evaluation.communication,
  redFlags: evaluation.redFlags
}, null, 2));

if (evaluation.score < 60) {
  throw new Error(`Expected project answer score >= 60, got ${evaluation.score}`);
}
