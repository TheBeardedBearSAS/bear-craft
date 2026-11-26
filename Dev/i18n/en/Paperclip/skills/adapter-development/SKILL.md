---
name: adapter-development
description: Build a Paperclip plugin (plugin-sdk) or built-in adapter. Use when adding AI runtimes or plugins.
---

# Paperclip Extension Development

Two surfaces: **adapters** (AI runtimes, `packages/adapters/<name>/`, export `type/label/models/agentConfigurationDoc`) and **plugins** (features, `@paperclipai/plugin-sdk`, `definePlugin({setup(ctx)})`). Adapters and plugins never hold governance state — the server enforces budgets, approvals, and tenancy.

See ../../rules/12-adapter-protocol.md for the full contract and examples.
