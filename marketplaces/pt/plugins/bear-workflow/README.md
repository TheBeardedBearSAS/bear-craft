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

- `/bear-workflow:auto-sprint` — Orquestrador de sprint de ponta a ponta (início, implementação, PR, CI, revisão, retro, merge)
- `/bear-workflow:design` — Executar a fase de Design - gerar a especificação técnica ou a constituição (--constitution)
- `/bear-workflow:implement` — Executar a fase de Implementação - desenvolvimento TDD/BDD de sprint, epic, story ou fila batch
- `/bear-workflow:init` — Analisar o contexto do projeto e recomendar o track de desenvolvimento ideal
- `/bear-workflow:plan` — Executar a fase de Planejamento - pesquisa (--research), PRD e backlog SCRUM (--only=prd|backlog)
- `/bear-workflow:retro` — Facilitação de Retrospectiva
- `/bear-workflow:review` — Preparação da Sprint Review
- `/bear-workflow:start` — Preparação do início de sprint: pasta do sprint, sprint-status.yaml e decomposição em tarefas
- `/bear-workflow:status` — Onde estou + próxima ação: fase, métricas do sprint, Kanban, fila, stand-up e gates

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
