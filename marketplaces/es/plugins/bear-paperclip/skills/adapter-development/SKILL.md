---
name: adapter-development
description: Construir un plugin o adaptador Paperclip. Usar al agregar runtimes de IA o plugins.
---

# Desarrollo de Extensiones Paperclip

Dos superficies: **adaptadores** (runtimes de IA, `packages/adapters/<name>/`, exportan `type/label/models/agentConfigurationDoc`) y **plugins** (funcionalidades, `@paperclipai/plugin-sdk`, `definePlugin({setup(ctx)})`). Los adaptadores y plugins nunca mantienen estado de gobernanza — el servidor aplica presupuestos, aprobaciones y tenencia.

Ver ../../rules/12-adapter-protocol.md para el contrato completo y ejemplos.
