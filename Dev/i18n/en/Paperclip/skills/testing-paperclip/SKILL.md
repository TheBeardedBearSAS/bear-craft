---
name: testing-paperclip
description: Paperclip testing — Vitest, plugin harness, Postgres integration. Use when writing Paperclip tests.
---

# Paperclip Testing

Vitest (unit + integration + coverage); plugin tests use `createTestHarness` from `@paperclipai/plugin-sdk/testing`; integration tests hit a real Postgres (never mocked); cross-tenant isolation tests required per server module; coverage ≥ 80% globally and stricter on governance-critical paths (agents, approvals, costs).

See ../../rules/07-testing-paperclip.md for detailed documentation.
