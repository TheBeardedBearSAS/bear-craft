---
name: testing-paperclip
description: Estrategia de testing de Paperclip (Vitest, Postgres real). Usar al escribir o revisar sus tests.
---

# Testing de Paperclip

Vitest (unit + integración + cobertura); tests de plugin usan `createTestHarness` de `@paperclipai/plugin-sdk/testing`; tests de integración golpean un Postgres real (nunca mockeado); tests de aislamiento cross-tenant requeridos por módulo de servidor; cobertura ≥ 80% globalmente y más estricta en paths críticos de gobernanza (agents, approvals, costs).

Ver ../../rules/07-testing-paperclip.md para documentación detallada.
