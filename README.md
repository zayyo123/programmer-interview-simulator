# 程序员面试模拟器 / Programmer Interview Simulator

<p align="center">
  <a href="#readme-zh"><strong>中文</strong></a>
  &nbsp;·&nbsp;
  <a href="#readme-en"><strong>English</strong></a>
</p>

---

<span id="readme-zh"></span>

> **中文** — [English](#readme-en)

一个面向程序员求职训练的 AI 模拟面试项目。

它不是简单地“随机出题 + 显示答案”，而是尽量模拟真实技术面试节奏：先根据岗位和级别安排题目路线，再结合你的回答决定继续追问还是切换下一题，最后生成包含评分、差距分析、参考答案、优秀回答示例和下一轮训练建议的复盘报告。

当前仓库已经包含一个可直接运行的 Node.js MVP，无需安装第三方 npm 依赖，适合本地快速启动、验证交互流程、继续扩展题库，或者接入你自己的 AI 提供商。

## 这个项目能做什么

- 模拟不同岗位方向的程序员技术面试
- 支持不同级别：初级、中级、高级
- 支持不同面试风格：常规、压力、教练模式
- 支持输入简历或项目背景，让题目和追问更贴近你的经历
- 支持基础题、项目题、系统设计题、代码题混合编排
- 支持实时追问，而不是一次性把题目全给出来
- 支持生成完整复盘报告
- 支持切换 AI 提供商：`mock`、`Gemini`、`OpenRouter`、`Ollama`

## 适合谁

- 正在准备后端、前端、全栈、Java、Go、Python 技术面试的同学
- 想把“背过八股”练成“能开口讲清楚”的同学
- 想把项目经历、系统设计和代码题放到同一个训练流程里的同学
- 想基于现有 MVP 继续开发更完整产品的开发者

## 当前 MVP 的核心特点

### 1. 真实面试节奏

系统不是一次性发出 5 道题，而是：

1. 创建本轮面试计划
2. 提出第一个问题
3. 根据你的回答判断是否追问
4. 回答合格则推进下一题
5. 全部结束后生成报告

这种方式更接近真实面试，而不是刷题网站。

### 2. 简历/项目驱动

如果你填写了简历或项目背景，系统会尝试：

- 提取关键词和经历信号
- 将题目向相关方向倾斜
- 在复盘里判断你是否真的把回答落回到了真实项目

### 3. 代码题不止给结果

代码题支持多种表达方式：

- 只讲思路
- 写伪代码
- 直接写代码或 SQL

这对“不会完整写代码，但知道解题方向”的练习场景很友好。

### 4. 报告不只给分数

报告会尽量回答这些问题：

- 你这轮大概处于什么水平
- 哪类题最容易被追问住
- 哪些关键点没答到
- 哪些内容虽然会，但没有表达出来
- 下一轮应该重点练什么

## 当前技术实现

当前仓库是一个“零依赖 Node.js Web MVP”：

- 后端：原生 Node.js `http` 服务
- 前端：原生 HTML/CSS/JavaScript
- 存储：当前为内存会话
- 题库：本地内置题库
- AI：通过配置接入外部模型，或使用本地 `mock` 模式

这意味着：

- 启动非常轻
- 适合本地验证和快速迭代
- 不依赖数据库即可跑通主流程
- 也意味着当前数据不会持久化到数据库

## 运行环境要求

- Node.js `>= 18`
- 推荐版本：`18.20.8`
- npm：任意随 Node 18 附带的版本即可
- Windows 下如果你使用的是 `nvm-windows`，可以直接按下面步骤切换版本

仓库已附带：

- `.nvmrc`
- `.env`

其中：

- `.nvmrc` 用于标记推荐 Node 版本
- `.env` 默认已配置 `mock` 模式，开箱即跑

## 用 nvm 配置 Node 环境

如果你是 Windows + `nvm` 用户，推荐这样做：

```powershell
nvm install 18.20.8
nvm use 18.20.8
node -v
npm -v
```

你应该至少看到：

```text
v18.x.x
```

本项目在本机已验证可运行的版本是：

```text
Node v18.20.8
npm 10.8.2
```

## 快速开始

### 方式一：直接启动

```powershell
npm run dev
```

然后打开：

```text
http://localhost:3000
```

### 方式二：如果你不想走 npm script

```powershell
node src/server.js
```

## 启动前你需要知道的事

这个项目当前 **不需要执行 `npm install`**。

原因是它没有依赖第三方 npm 包，全部基于 Node.js 内置模块实现。

`package.json` 中的核心脚本如下：

```json
{
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js",
    "score:smoke": "node scripts/score-smoke.mjs",
    "smoke": "node scripts/question-bank-check.mjs && node scripts/score-smoke.mjs && node scripts/smoke-test.js"
  }
}
```

## 环境变量说明

默认 `.env` 已经可用：

```env
AI_PROVIDER=mock
PORT=3000
```

### 1. mock 模式

最适合先跑通项目：

```env
AI_PROVIDER=mock
```

特点：

- 不需要 API Key
- 不依赖外网
- 适合本地调 UI、流程和题库
- 回答由本地规则逻辑生成，不是真正的大模型回复

### 2. Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-1.5-flash
```

### 3. OpenRouter

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/auto
```

### 4. Ollama

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

### 5. auto 模式

如果你把 `AI_PROVIDER` 省略，或者设置为 `auto`，系统会按顺序寻找可用提供商：

```text
Gemini -> OpenRouter -> Ollama -> Mock
```

## 我已经帮你完成的本地环境配置

当前仓库里已经补充了以下文件，方便你直接运行：

```text
.nvmrc   推荐 Node 版本：18.20.8
.env     默认本地 mock 配置
```

并且本地已经验证：

- `node -v` 为 `v18.20.8`
- `npm -v` 为 `10.8.2`
- `http://localhost:3000/api/health` 返回 `{"ok":true}`

## 使用流程说明

启动后，页面大致分为三栏：

### 左侧：面试配置

你可以设置：

- 面试方向
- 面试级别
- 面试风格
- 题目数量
- 简历或项目背景

系统会根据这些输入生成一轮训练计划预览。

### 中间：面试对话

这里会显示：

- 面试官开场
- 当前问题
- 你的回答
- 追问或下一题
- 当前题目的答题建议

### 右侧：复盘报告

点击“结束并生成报告”后，会在右侧生成本轮复盘，包括：

- 总体结论
- 各题评分
- 维度分析
- 参考答案
- 优秀回答
- 常见扣分点
- 下一轮训练建议

## 项目结构详解

```text
public/
  index.html        前端页面结构
  styles.css        页面样式
  app.js            前端交互逻辑、调用接口、渲染报告

src/
  server.js         HTTP 服务入口、接口路由、静态资源服务
  config.js         读取 .env 并决定当前 AI 提供商
  ai.js             AI 适配层：Gemini / OpenRouter / Ollama / mock 回退
  interview.js      面试流程核心：题目规划、追问判断、评分与报告
  questions.js      内置题库、参考答案、优秀回答、评分规则

scripts/
  question-bank-check.mjs  题库检查脚本
  score-smoke.mjs          评分流程 smoke test
  smoke-test.js            基础流程 smoke test
```

## 核心模块说明

### `src/server.js`

这是项目入口，负责：

- 启动 HTTP 服务
- 处理面试相关 API
- 管理内存中的会话
- 返回静态页面资源

当前主要接口有：

- `GET /api/health`
- `POST /api/interviews`
- `POST /api/interviews/:id/answer`
- `POST /api/interviews/:id/finish`

### `src/config.js`

负责读取 `.env`，并决定当前实际使用哪个 AI 提供商。

如果你之后想新增新的模型平台，通常会先改这里和 `src/ai.js`。

### `src/ai.js`

这是模型调用适配层。

逻辑大致是：

- 根据配置选择 provider
- 尝试调用对应平台
- 如果失败，则回退到 `mock`

这让项目在开发阶段更稳，不会因为某个外部服务异常导致整个流程不可用。

### `src/interview.js`

这是项目最核心的文件，负责：

- 生成面试计划
- 生成开场话术
- 判断当前回答是否达标
- 决定继续追问还是进入下一题
- 汇总最终报告

如果你后续想增强“智能感”，大概率主要改这个文件。

### `src/questions.js`

这里维护题库数据，例如：

- 题目文本
- 题目分类
- 岗位适用范围
- 级别适用范围
- 关键词
- 参考答案
- 优秀回答
- 评分要点

如果你想扩题库、补某一类题型、增加新的岗位方向，这里是最直接的入口。

## 一次完整请求的流程

可以把项目理解成下面这个链路：

```text
用户配置面试
-> 创建 session
-> 生成题目计划
-> 返回开场和第一题
-> 用户提交回答
-> 系统评估回答质量
-> 追问 或 进入下一题
-> 重复直到结束
-> 生成整场报告
```

## 为什么这个 MVP 值得继续做

因为它已经覆盖了“可用产品原型”最难的几件事：

- 有实际可运行的前后端
- 有完整的单轮面试流程
- 有题库和评分逻辑
- 有模型抽象层
- 有报告输出

后续你可以在这个基础上继续扩展：

- 接数据库做历史记录持久化
- 接登录系统
- 接真正的简历解析
- 接语音输入输出
- 接代码编辑器和运行沙箱
- 增加管理后台与题库维护工具
- 支持多轮训练画像和成长曲线

## 常见问题

### 1. 为什么没有 `node_modules`？

因为当前版本没有外部 npm 依赖，所以不需要安装包。

### 2. 为什么我配置了 AI Key，但还是像本地规则在说话？

先检查：

- `.env` 是否真的生效
- `AI_PROVIDER` 是否写对
- Key 是否有效
- 网络是否能访问对应平台

如果调用失败，系统会自动回退到 `mock` 模式。

### 3. 为什么刷新页面后面试记录没了？

因为当前会话存在内存里，服务重启或刷新后不会持久保存到数据库。

### 4. 这个项目适合直接上线吗？

更准确地说，它适合作为 MVP、演示版和开发起点。

如果要上线，通常还需要补：

- 用户系统
- 数据持久化
- 鉴权与限流
- 日志与监控
- 错误告警
- 题库管理后台
- 成本控制与模型调用治理

## 开发建议

如果你接下来准备继续开发，我建议优先顺序是：

1. 先把历史记录持久化
2. 再做用户体系和多轮训练
3. 然后接更稳定的 AI Provider
4. 最后再加语音、代码执行、简历解析等增强功能

## 本地验证

当前仓库已本地验证通过：

```text
node -v              -> v18.20.8
npm -v               -> 10.8.2
GET /api/health      -> 200 {"ok":true}
```

---

<span id="readme-en"></span>

> **English** — [中文](#readme-zh)

## Overview

This is an AI-powered mock interview simulator for programmers. It supports role-based interview plans, follow-up questions, answer evaluation, and post-interview reports with reference answers and improvement guidance.

The current repository already includes a runnable zero-dependency Node.js MVP:

- Native Node.js HTTP server
- Native HTML/CSS/JavaScript frontend
- Built-in question bank
- Configurable AI providers: `mock`, `Gemini`, `OpenRouter`, `Ollama`
- Post-interview scoring and report generation

## Quick Start

Use Node.js 18 or above, preferably `18.20.8`.

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

This project currently does not require `npm install`.

## Environment

Default local config:

```env
AI_PROVIDER=mock
PORT=3000
```

You can switch providers with `.env`:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-1.5-flash
```

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_key
OPENROUTER_MODEL=openrouter/auto
```

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

If `AI_PROVIDER` is omitted or set to `auto`, the server tries:

```text
Gemini -> OpenRouter -> Ollama -> Mock
```

## Project Structure

```text
src/server.js       HTTP server and routes
src/config.js       environment loading and provider selection
src/ai.js           provider adapters and fallback logic
src/interview.js    interview flow, evaluation, and report generation
src/questions.js    built-in question bank and scoring metadata
public/             frontend UI
scripts/            smoke checks
```
