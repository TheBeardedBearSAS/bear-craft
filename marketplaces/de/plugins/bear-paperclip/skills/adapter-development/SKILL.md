---
name: adapter-development
description: Paperclip-Extension erstellen (Plugin-SDK oder Built-in-Adapter). Beim Hinzufügen von AI-Runtimes.
---

# Paperclip-Extension-Development

Zwei Oberflächen: **Adapter** (AI-Runtimes, `packages/adapters/<name>/`, exportieren `type/label/models/agentConfigurationDoc`) und **Plugins** (Features, `@paperclipai/plugin-sdk`, `definePlugin({setup(ctx)})`). Adapter und Plugins halten niemals Governance-Zustand — der Server setzt Budgets, Approvals und Tenancy durch.

Siehe ../../rules/12-adapter-protocol.md für den vollständigen Vertrag und Beispiele.
