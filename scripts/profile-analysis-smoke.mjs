import { extractProfileSignals } from '../shared/profileAnalysis.js';
import { buildLocalProfileAnalysis } from '../shared/profileAnalyzeLocal.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const frontendResume = '负责 Web 前端监控平台，技术栈 Vue3、TypeScript、Vite、ECharts。主导组件库沉淀、首屏性能优化。';
const frontendSignals = extractProfileSignals(frontendResume, { role: 'frontend' });
assert(frontendSignals.terms.includes('Vue 3'), 'should detect Vue 3');
assert(frontendSignals.terms.includes('TypeScript'), 'should detect TypeScript');
assert(frontendSignals.categories.includes('前端'), 'should detect frontend category');
assert(!frontendSignals.categories.includes('Go'), 'should not mis-detect Go from unrelated text');

const frontendAnalysis = buildLocalProfileAnalysis(frontendResume, 'frontend');
assert(frontendAnalysis.focusTopics.includes('前端工程化与性能优化'), 'frontend resume should surface frontend focus topic');
assert(!frontendAnalysis.focusTopics.includes('JVM / Spring / Java 基础'), 'frontend resume should not surface Java focus topic');
assert(!frontendAnalysis.focusTopics.includes('数据库索引与事务'), 'frontend resume should not surface MySQL focus topic');

const falsePositiveText = 'I am going to email the architect about training.';
const falsePositiveSignals = extractProfileSignals(falsePositiveText, { role: 'backend' });
assert(!falsePositiveSignals.categories.includes('Go'), 'should not treat go/email as Go');
assert(!falsePositiveSignals.categories.includes('AI'), 'should not treat random ai substring as AI');

const javaResume = '负责 Java 交易履约系统，Spring Boot、MySQL、Redis、RocketMQ，做过慢 SQL 优化。';
const javaSignals = extractProfileSignals(javaResume, { role: 'java' });
assert(javaSignals.terms.includes('Spring Boot'), 'should detect Spring Boot');
assert(javaSignals.terms.includes('Redis'), 'should detect Redis');
assert(javaSignals.categories.includes('Java'), 'should detect Java category');

const javaAnalysis = buildLocalProfileAnalysis(javaResume, 'java');
assert(javaAnalysis.focusTopics.includes('JVM / Spring / Java 基础'), 'java resume should surface Java focus topic');
assert(javaAnalysis.focusTopics.includes('缓存一致性与 Redis 排障'), 'java resume should surface Redis focus topic');
assert(javaAnalysis.focusTopics.length <= 5, 'focus topics should be capped at 5');

const javaAsFrontend = buildLocalProfileAnalysis(javaResume, 'frontend');
assert(!javaAsFrontend.focusTopics.includes('JVM / Spring / Java 基础'), 'frontend role should filter out Java focus topic');
assert(!javaAsFrontend.focusTopics.includes('数据库索引与事务'), 'frontend role should filter out MySQL focus topic');

const goResume = '负责 Go 微服务网关，Gin、Goroutine、Redis、Kafka，处理高并发下单。';
const goAnalysis = buildLocalProfileAnalysis(goResume, 'go');
assert(goAnalysis.focusTopics.includes('Go 并发与微服务治理'), 'go resume should surface Go focus topic');

console.log('profile analysis smoke passed');
