---
name: adapter-development
description: Construir um plugin ou adapter Paperclip (plugin-sdk). Use ao adicionar runtimes de IA ou plugins.
---

# Desenvolvimento de Extensoes Paperclip

Duas superficies: **adapters** (runtimes AI, `packages/adapters/<name>/`, exporta `type/label/models/agentConfigurationDoc`) e **plugins** (features, `@paperclipai/plugin-sdk`, `definePlugin({setup(ctx)})`). Adapters e plugins nunca mantem estado governanca — o server forca orcamentos, aprovacoes, e tenancy.

Veja ../../rules/12-adapter-protocol.md para o contrato completo e exemplos.
