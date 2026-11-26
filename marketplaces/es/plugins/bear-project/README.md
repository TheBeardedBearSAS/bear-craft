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

- `/bear-project:backlog` — Gestionar el backlog: EPICs, User Stories y Tareas, próxima story, estados y reglas de enrutamiento
- `/bear-project:migrate` — Migración puntual de un backlog existente a BMAD v6 (análisis, migración, resincronización)
- `/bear-project:report` — Informes del proyecto: burndown del sprint, métricas, grafo de dependencias y ruta crítica
- `/bear-project:reverse` — Ingeniería inversa brownfield: escanear el código y derivar PRD, historias y brechas spec vs código
- `/bear-project:trace` — Matriz de trazabilidad (requisito → historia → código → pruebas); --gaps, --by-priority (MoSCoW)

## Agents

`product-owner`, `tech-lead`

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
