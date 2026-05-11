# Project Context

# Goal

This repository is a small engineering evaluation MVP for Cursor Cloud Agents.

The goal is NOT to build a production SaaS application.

The goal is to evaluate:
- AI-assisted engineering workflows
- PR workflows
- Docker workflows
- PostgreSQL integration
- Playwright testing
- parallel feature execution

---

# Tech Stack

Frontend:
- Next.js
- TailwindCSS
- shadcn/ui

Backend:
- NestJS

Database:
- PostgreSQL

Infrastructure:
- Docker Compose

Testing:
- Playwright

---

# MVP Scope

Only implement:
- create task
- list tasks
- complete task
- delete task

Task fields:
- id
- title
- status
- createdAt

---

# Important Constraints

Do NOT add:
- authentication
- microservices
- CQRS
- event systems
- Redis
- Kubernetes
- advanced caching
- advanced abstractions

Keep implementation intentionally small and readable.