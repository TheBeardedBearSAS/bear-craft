# Bear Craft — Project

Project management: epics, stories, tasks, backlog and sprint tracking with product-owner and tech-lead agents.

## Installation

Inside Claude Code:

```
/plugin marketplace add TheBeardedBearSAS/bear-craft
/plugin install bear-project@bear-craft
```

Requires Claude Code 2.1.325 or later. Version 10.1.2.

## Commands

- `/bear-project:backlog` — Gérer le backlog : EPICs, User Stories et Tâches, prochaine story, statuts et règles de routage
- `/bear-project:migrate` — Migration ponctuelle d'un backlog existant vers BMAD v6 (analyse, migration, resynchronisation)
- `/bear-project:report` — Rapports projet : burndown du sprint, métriques, graphe de dépendances et chemin critique
- `/bear-project:reverse` — Rétro-ingénierie brownfield : scanner le code, dériver PRD, user stories et écarts spec vs code
- `/bear-project:trace` — Matrice de traçabilité exigence → story → code → tests ; --gaps exigences non couvertes

## Agents

`product-owner`, `tech-lead`

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
