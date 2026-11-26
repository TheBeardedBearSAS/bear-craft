---
name: testing-paperclip
description: Testes Paperclip — Vitest, harness de plugin, Postgres real, isolamento de tenants. Use ao testar.
---

# Testes Paperclip

Vitest (unit + integration + coverage); testes plugin usam `createTestHarness` de `@paperclipai/plugin-sdk/testing`; testes integracao batem em Postgres real (nunca mockado); testes isolamento cross-tenant requeridos por modulo server; cobertura ≥ 80% globalmente e mais estrito em paths criticos governanca (agents, approvals, costs).

Veja ../../rules/07-testing-paperclip.md para documentacao detalhada.
