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

## Repository Status

This repository starts as a product and architecture draft. Implementation can begin with the text interview MVP.
