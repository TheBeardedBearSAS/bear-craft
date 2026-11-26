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

- `/bear-workflow:auto-sprint` — Orquestador de sprint completo (inicio -> implementación -> PR -> CI -> revisión -> merge)
- `/bear-workflow:design` — Fase de Diseño (Solutioning) - especificación técnica (por defecto) o constitución (--constitution)
- `/bear-workflow:implement` — Fase de Implementación - desarrollo TDD/BDD de un sprint, epic, story o la cola batch
- `/bear-workflow:init` — Analizar el contexto del proyecto y recomendar el flujo de trabajo de desarrollo optimo
- `/bear-workflow:plan` — Fase de Planificación - investigación (--research), PRD (--only=prd) y backlog (--only=backlog)
- `/bear-workflow:retro` — Facilitación de la Retrospectiva
- `/bear-workflow:review` — Preparación de la Sprint Review
- `/bear-workflow:start` — Preparación del inicio de sprint: carpeta, entradas de sprint-status.yaml y descomposición en tareas
- `/bear-workflow:status` — Dónde estoy + siguiente acción: fase, métricas del sprint, Kanban, cola, daily y gates

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
