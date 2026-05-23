# Programmer Interview Simulator

AI-powered mock interview system for programmers. It helps candidates practice technical interviews, answer follow-up questions, write code, and review reference answers after each session.

## Core Ideas

- Simulate realistic programmer interviews by role, level, and topic.
- Ask one question at a time and continue with context-aware follow-up questions.
- Save the user's answer, code, and interviewer feedback for every question.
- Generate a post-interview report with reference answers and improved answer examples.

## MVP Scope

- Text-based mock interview
- Role, seniority, and topic selection
- Interview transcript storage
- Per-question reference answer after the interview
- Gap analysis between user answer and reference answer
- Improved answer example based on the user's response

## Suggested Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI or NestJS
- Database: PostgreSQL
- Cache and session state: Redis
- Code editor: Monaco Editor
- Code execution: Docker sandbox
- AI: LLM interviewer, evaluator, code reviewer, and coach agents

## Report Structure

Each interview report should include:

- Overall score
- Question list
- User answer summary
- Reference answer
- Excellent interview-style answer
- Gap analysis
- Improved version of the user's answer
- Weak knowledge areas
- Next practice recommendations

## Current MVP

The repository now includes a zero-dependency Node.js MVP:

- Local web UI for interview configuration and answering questions
- Built-in programmer interview question bank
- Dynamic interview opening by role, level, and style
- Follow-up or next-question flow
- Post-interview report with reference answers, gap analysis, and improved answers
- Switchable AI providers: Gemini, OpenRouter, Ollama, or local mock mode

## Quick Start

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

No package installation is required for the current MVP.

## Free AI Options

The app works without an API key by using local mock mode:

```env
AI_PROVIDER=mock
```

To try free or low-cost AI providers, copy `.env.example` to `.env` and configure one provider.

Gemini free tier:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-1.5-flash
```

OpenRouter free models:

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openrouter/auto
```

Local Ollama:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

If `AI_PROVIDER` is omitted or set to `auto`, the server uses the first configured provider in this order:

```text
Gemini -> OpenRouter -> Ollama -> Mock
```

## Project Structure

```text
src/server.js       HTTP server and API routes
src/interview.js    interview plan, opening, flow, and report logic
src/questions.js    built-in question bank and reference answers
src/ai.js           Gemini, OpenRouter, Ollama, and mock provider adapter
public/             browser UI
```
