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

- `/bear-workflow:auto-sprint` — End-to-End-Sprint-Orchestrator (Start -> Zerlegung -> Implementierung -> PR -> CI -> Merge)
- `/bear-workflow:design` — Designphase (Solutioning) durchführen - Tech-Spezifikation (Standard) oder Constitution erzeugen
- `/bear-workflow:implement` — Implementierungsphase durchführen - TDD/BDD-Entwicklung von Sprint, Epic, Story oder Batch-Queue
- `/bear-workflow:init` — Projektkontext analysieren und den optimalen Entwicklungs-Workflow-Track empfehlen
- `/bear-workflow:plan` — Planungsphase ausführen - Recherche (--research), PRD (--only=prd), Backlog (--only=backlog)
- `/bear-workflow:retro` — Retrospektiven-Facilitation
- `/bear-workflow:review` — Sprint Review Vorbereitung
- `/bear-workflow:start` — Sprint-Start-Vorbereitung: Sprint-Ordner, sprint-status.yaml-Einträge und Zerlegung in Tasks
- `/bear-workflow:status` — Wo stehe ich + nächste Aktion: Workflow-Phase, Sprint-Metriken, Kanban-Board, Stand-up, Gates

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
