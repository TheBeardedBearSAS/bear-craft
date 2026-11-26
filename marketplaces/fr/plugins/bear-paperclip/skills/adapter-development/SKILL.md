---
name: adapter-development
description: Créer un plugin ou un adaptateur Paperclip. À utiliser pour ajouter un runtime IA ou un plugin.
---

# Développement d'extensions Paperclip

Deux surfaces : **adaptateurs** (runtimes IA, `packages/adapters/<name>/`, exports `type/label/models/agentConfigurationDoc`) et **plugins** (fonctionnalités, `@paperclipai/plugin-sdk`, `definePlugin({setup(ctx)})`). Ni les adaptateurs ni les plugins ne détiennent d'état de gouvernance — le serveur applique les budgets, les approbations et la tenance.

Voir ../../rules/12-adapter-protocol.md pour le contrat complet et les exemples.
