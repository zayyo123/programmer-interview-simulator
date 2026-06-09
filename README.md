# 程序员面试模拟器 / Programmer Interview Simulator

<p align="center">
  <a href="#readme-zh"><strong>中文</strong></a>
  &nbsp;·&nbsp;
  <a href="#readme-en"><strong>English</strong></a>
</p>

---

<span id="readme-zh"></span>

> **中文** - [English](#readme-en)

一个用于程序员求职训练的本地 AI 模拟面试系统。

它不是简单的题库浏览器，而是按真实技术面试节奏工作：先根据岗位、级别、面试风格和候选人背景生成题目路线，再根据回答质量决定追问或推进下一题，最后输出逐题评分、差距分析、参考答案、优秀回答示例和下一轮训练建议。

当前版本是一个可直接运行的 Node.js Web MVP，适合本地练习、演示、扩展题库、验证面试流程，或继续接入更完整的 AI / 数据 / 用户系统。

## 核心能力

- 多岗位方向：后端、前端、全栈、Java、Go、Python、测试、运维、DevOps/SRE、数据、AI、安全、架构等。
- 多级别与风格：初级 / 中级 / 高级，常规面试 / 压力面试 / 教练模式。
- 简历与项目驱动：支持粘贴或上传材料，前端会提取关键词、能力点、风险点和推荐考点。
- 本地题库与 AI 出题：默认使用本地题库，也可以请求 AI 动态生成题目；AI 不可用时自动回退本地题库。
- 实时追问与推进：回答偏泛时会继续追问，回答达标后进入下一题。
- 代码题作答模式：支持思路说明、伪代码、代码 / SQL 片段和边界复杂度说明。
- 实时教练面板：展示当前面试官正在考察的目标、缺口、压力等级和建议补充方向。
- 复盘报告：包含总体结论、逐题评分、维度分析、常见扣分点、参考答案、优秀回答和下一轮路线。
- 训练历史：浏览器本地保存最近练习记录、薄弱技能、高频薄弱题、未完成目标和专项重练建议。
- 题库治理：支持题库质量门禁、岗位覆盖检查、外部题源同步、候选题筛选、草稿导入和人工审核。

## 技术栈

| 层级 | 实现 |
| --- | --- |
| 后端 | 原生 Node.js `http` 服务，ES Modules |
| 前端 | 原生 HTML / CSS / JavaScript |
| 图表 | ECharts，本地 `public/vendor/echarts.min.js` |
| 会话 | 服务端内存 Map，刷新或重启会丢失进行中的面试 |
| 训练历史 | 浏览器 `localStorage` |
| 题库 | `src/questions.js` 内置题库 + `data/approved-questions.json` 人工审核题 |
| AI Provider | `mock`、Gemini、OpenRouter、Ollama |

## 快速开始

环境要求：

- Node.js `>= 18`
- 推荐 Node.js `18.20.8`，仓库已提供 `.nvmrc`
- npm 随 Node 安装即可

首次拉取或依赖缺失时先安装依赖：

```powershell
npm install
```

启动本地服务：

```powershell
npm run dev
```

然后打开：

```text
http://localhost:3000
```

也可以直接运行：

```powershell
node src/server.js
```

如果使用 `nvm-windows`：

```powershell
nvm install 18.20.8
nvm use 18.20.8
node -v
npm -v
```

## 环境变量

新环境可以从示例文件创建配置：

```powershell
Copy-Item .env.example .env
```

默认 mock 模式无需 API Key：

```env
AI_PROVIDER=mock
PORT=3000
```

### Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-1.5-flash
```

### OpenRouter

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/auto
```

### Ollama

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

### auto 模式

如果 `AI_PROVIDER` 为空或设置为 `auto`，服务端会按顺序选择：

```text
Gemini -> OpenRouter -> Ollama -> Mock
```

注意：页面里的 “AI 引擎 / API Key” 控件当前只用于前端状态提示；真正影响后端模型调用的是服务端 `.env` 配置。

## 使用流程

1. 在配置页选择面试方向、级别、风格、题目数量和题目来源。
2. 粘贴或上传简历、JD、项目材料，让系统生成训练节奏预览。
3. 点击“开启全面面试”，进入模拟面试工作台。
4. 按当前题型提示回答，系统会根据回答决定追问或进入下一题。
5. 点击“提前结束面试，生成报告”或完成流程后查看复盘。
6. 根据报告中的下一轮建议，继续做弱项专项重练。

## 项目结构

```text
public/
  index.html                  页面结构
  styles.css                  页面样式
  app.js                      前端交互、状态、报告、训练历史和题库运营面板
  vendor/echarts.min.js       本地图表库

src/
  server.js                   HTTP 服务入口、API 路由、静态资源服务、会话管理
  config.js                   .env 读取与 AI provider 选择
  ai.js                       Gemini / OpenRouter / Ollama / mock 适配与 AI 出题
  interview.js                面试计划、追问判断、评分、报告生成
  questions.js                内置题库、岗位/级别标签、评分元数据
  externalSources.js          外部题源同步、授权策略、外部草稿生成
  questionGovernance.js       运行时题库、质量门禁、候选题筛选、草稿审核

scripts/
  smoke-test.js                       端到端 smoke test
  score-smoke.mjs                     评分逻辑 smoke test
  question-bank-check.mjs             题库结构检查
  question-quality-check.mjs          题库质量检查
  question-governance-gate.mjs        反模板化与语义门禁
  role-coverage-check.mjs             专项岗位覆盖检查
  sync-external-sources.mjs           同步外部题源草稿
  promote-external-drafts.mjs         从外部草稿生成候选题报告
  import-promoted-candidates.mjs      将候选题导入待审核草稿
  auto-screen-question-candidates.mjs 自动同步并筛选候选题

data/
  external-question-drafts.json       外部题源缓存
  promoted-question-candidates.json   候选题筛选报告
  question-drafts.json                待审核草稿
  approved-questions.json             人工审核通过题
```

## 常用脚本

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm start` | 启动服务，等同于 `dev` |
| `npm run score:smoke` | 验证评分逻辑的基础行为 |
| `npm run smoke` | 运行题库结构、质量、治理、覆盖、评分和 API smoke test |
| `npm run sync:external` | 同步外部题源到 `data/external-question-drafts.json` |
| `npm run promote:drafts -- --limit=30 --min-score=70` | 从外部草稿生成候选题报告 |
| `npm run import:candidates -- --ranks=1,2` | 将候选题导入 `data/question-drafts.json` 待审核 |
| `npm run screen:candidates -- --limit=40 --min-score=72` | 同步题源并自动筛选候选题 |

常见筛选参数：

```powershell
npm run promote:drafts -- --limit=50 --min-score=75 --category=Java
npm run screen:candidates -- --sync=false --limit=30 --min-score=72
npm run import:candidates -- --top=5
```

## API 概览

### 面试流程

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 健康检查 |
| `POST` | `/api/interviews` | 创建一轮面试 |
| `POST` | `/api/interviews/:id/answer` | 提交当前题回答 |
| `POST` | `/api/interviews/:id/finish` | 结束面试并生成报告 |
| `POST` | `/api/question-paper` | 根据配置生成组卷蓝图 |

### 题库治理

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/question-bank` | 查看运行时题库摘要、筛选项和待审核草稿 |
| `GET` | `/api/question-bank/quality` | 查看题库质量报告 |
| `POST` | `/api/question-bank/drafts` | 提交人工题目草稿 |
| `POST` | `/api/question-bank/drafts/:id/review` | 审核草稿，支持 approve / reject |

### 外部题源

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/external-question-drafts` | 读取外部题源缓存 |
| `POST` | `/api/external-question-drafts/sync` | 同步外部题源 |
| `GET` | `/api/external-question-candidates` | 生成外部候选题报告 |
| `POST` | `/api/external-question-candidates/auto-screen` | 自动同步并筛选候选题 |
| `POST` | `/api/external-question-candidates/import` | 将候选题导入待审核草稿 |

## 题库治理流程

推荐的题库扩展链路：

```text
同步外部题源
-> 生成候选题报告
-> 按分数、分类、来源筛选
-> 导入待审核草稿
-> 人工审核 approve / reject
-> 进入运行时题库
-> 跑 smoke 门禁
```

命令示例：

```powershell
npm run sync:external
npm run promote:drafts -- --limit=30 --min-score=70
npm run import:candidates -- --ranks=1,2,3
npm run smoke
```

外部题源策略：

- MIT / Apache-2.0 / CC0 等可转写来源会标记为 `can-transform`，但正式入库前仍需人工改写、去重和审核。
- Stack Exchange / Stack Overflow 等 CC BY-SA 来源默认标记为 `signal-only`，只保存标题、标签、链接和热度，不直接搬运正文。
- 人工审核通过的题会进入 `data/approved-questions.json`，运行时会和内置题库合并。

## 当前限制

- 面试会话保存在服务端内存中，刷新页面或重启服务会丢失进行中的面试。
- 训练历史保存在浏览器 `localStorage`，不是跨设备数据。
- 当前没有登录、鉴权、限流、数据库、后台管理和生产级日志监控。
- 外部题源同步需要网络，并可能受 GitHub / Stack Exchange API 限制影响。
- AI Provider 由服务端 `.env` 控制，页面输入的 Key 当前不会写入后端配置。
- 这是 MVP / 本地训练工具，不建议不加改造直接上线。

## 开发建议

如果继续产品化，可以优先做这些方向：

1. 持久化面试会话、报告和训练历史。
2. 增加用户系统、鉴权、限流和模型调用成本控制。
3. 给题库治理做独立后台和更严格的人工审核流。
4. 接入更可靠的简历解析、JD 解析和岗位画像。
5. 增加代码编辑器、代码运行沙箱、语音输入输出。
6. 把 AI Provider 配置从 `.env` 扩展为安全的服务端配置管理。

## 常见问题

### 为什么现在需要 `npm install`？

项目当前依赖 `echarts`，用于前端报告和实时教练图表。仓库里也有本地 vendor 文件，但新环境仍建议先执行 `npm install`，确保依赖和 lockfile 一致。

### 不配置 API Key 能运行吗？

可以。默认 `AI_PROVIDER=mock`，本地规则会保证面试流程、追问和报告可运行。

### 为什么选择 AI 动态出题后仍然回到本地题库？

常见原因包括 `.env` 未配置、Provider 不可用、网络异常、模型返回格式不符合题目 JSON 结构。服务端会自动回退到本地题库，避免整轮面试失败。

### 刷新页面后当前面试为什么没了？

当前面试 session 在服务端内存中，页面刷新后前端不会恢复这轮进行中的会话。完成后的训练记录会保存在浏览器 `localStorage`。

### 如何确认当前项目可运行？

```powershell
npm run smoke
```

也可以启动服务后访问：

```text
http://localhost:3000/api/health
```

返回 `{"ok":true}` 表示服务正常。

---

<span id="readme-en"></span>

> **English** - [中文](#readme-zh)

## Overview

Programmer Interview Simulator is a local web MVP for practicing technical interviews. It creates role-aware interview plans, asks follow-up questions based on answer quality, and produces post-interview reports with scores, gaps, reference answers, strong-answer examples, and next-session recommendations.

## Quick Start

Requirements:

- Node.js `>= 18`
- Recommended: Node.js `18.20.8`

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Default local mode:

```env
AI_PROVIDER=mock
PORT=3000
```

## Features

- Role support for backend, frontend, fullstack, Java, Go, Python, QA, ops, DevOps/SRE, data, AI, security, and architecture tracks.
- Junior / middle / senior levels and normal / pressure / coaching interview styles.
- Resume, JD, and project-background driven interview planning.
- Local question bank by default, optional AI-generated question plans with fallback to local questions.
- Live follow-ups, live coach hints, coding-answer modes, post-interview reports, browser-local practice history.
- Question governance workflow for external source sync, candidate screening, draft import, manual review, and quality gates.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local server |
| `npm start` | Start the local server |
| `npm run smoke` | Run structure, quality, governance, coverage, scoring, and API checks |
| `npm run score:smoke` | Run scoring smoke check |
| `npm run sync:external` | Sync external question-source drafts |
| `npm run promote:drafts -- --limit=30 --min-score=70` | Generate promoted question candidates |
| `npm run import:candidates -- --ranks=1,2` | Import candidates into pending review drafts |
| `npm run screen:candidates -- --limit=40 --min-score=72` | Sync and screen external candidates |

## Notes

- Active interview sessions are stored in server memory.
- Practice history is stored in browser `localStorage`.
- Server-side AI provider selection is controlled by `.env`; the current UI provider controls are informational.
- This is an MVP and local training tool, not a production-ready hosted service.
