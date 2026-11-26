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

- `/bear-workflow:auto-sprint` — End-to-end sprint orchestrator (start -> decompose -> implement -> PR -> CI -> review -> merge)
- `/bear-workflow:design` — Run the Design (Solutioning) phase - tech spec (default) or project constitution (--constitution)
- `/bear-workflow:implement` — Run the Implementation phase - TDD/BDD development of a sprint, epic, story or the batch queue
- `/bear-workflow:init` — Analyze project context and recommend the optimal development workflow track
- `/bear-workflow:plan` — Run the Planning phase - research (--research), PRD (--only=prd) and SCRUM backlog (--only=backlog)
- `/bear-workflow:retro` — Retrospective Facilitation
- `/bear-workflow:review` — Sprint Review Preparation
- `/bear-workflow:start` — Sprint Start Preparation: sprint folder, sprint-status.yaml entries and task decomposition
- `/bear-workflow:status` — Where am I + next action - workflow phase, sprint metrics, board, queue, stand-up and gates

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
