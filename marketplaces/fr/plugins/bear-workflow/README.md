# Bear Craft — Workflow

BMAD v6 sprint workflow: init, plan, design, start, implement, review, retro and status.

## Installation

Inside Claude Code:

```
/plugin marketplace add TheBeardedBearSAS/bear-craft
/plugin install bear-workflow@bear-craft
```

Requires Claude Code 2.1.325 or later. Version 10.1.2.

## Commands

- `/bear-workflow:auto-sprint` — Orchestrateur de sprint de bout en bout (démarrage, implémentation, PR, CI, revue, rétro, merge)
- `/bear-workflow:design` — Exécuter la phase de Conception - spécification technique ou constitution du projet (--constitution)
- `/bear-workflow:implement` — Exécuter la phase d'Implémentation - TDD/BDD d'un sprint, epic, story ou de la file batch
- `/bear-workflow:init` — Analyser le contexte du projet et recommander le track de workflow optimal
- `/bear-workflow:plan` — Exécuter la phase de Planification - recherche, PRD et backlog SCRUM
- `/bear-workflow:retro` — Facilitation Rétrospective
- `/bear-workflow:review` — Préparation Sprint Review
- `/bear-workflow:start` — Préparation du début de sprint : dossier, entrées sprint-status.yaml et décomposition en tâches
- `/bear-workflow:status` — Où en suis-je + prochaine action : phase, métriques du sprint, Kanban, file batch, stand-up, gates

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
