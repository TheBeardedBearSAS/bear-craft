---
name: testing-paperclip
description: Paperclip-Testing — Vitest, Plugin-Harness, Postgres-Integration. Beim Schreiben von Tests nutzen.
---

# Paperclip-Testing

Vitest (Unit + Integration + Coverage); Plugin-Tests verwenden `createTestHarness` aus `@paperclipai/plugin-sdk/testing`; Integration-Tests treffen echtes Postgres (niemals gemockt); Cross-Tenant-Isolation-Tests pro Server-Modul erforderlich; Coverage ≥ 80% global und strenger auf governance-kritischen Pfaden (agents, approvals, costs).

Siehe ../../rules/07-testing-paperclip.md für ausführliche Dokumentation.
