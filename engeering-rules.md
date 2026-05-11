# Engineering Rules

# Core Principle

Humans own architecture.
AI agents assist implementation.

---

# Rules

- Keep PRs small
- Keep prompts scoped
- One branch = one responsibility
- No direct merges to main
- Docker validation required before merge
- Playwright validation required before main merge
- Avoid unnecessary dependencies
- Avoid modifying unrelated files
- Avoid overengineering

---

# AI Responsibilities

Allowed:
- CRUD
- DTOs
- UI implementation
- Playwright tests
- boilerplate

Forbidden:
- architecture redesign
- introducing frameworks
- large refactors
- resolving large merge conflicts