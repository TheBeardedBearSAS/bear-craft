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

- `/bear-project:backlog` — Manage the backlog - EPICs, User Stories and Tasks, next story, status moves and routing rules
- `/bear-project:migrate` — One-shot migration of an existing backlog to BMAD v6 (analyze, migrate, fill stories, resync)
- `/bear-project:report` — Project analytics reports - sprint burndown, metrics dashboard, dependency graph and critical path
- `/bear-project:reverse` — Brownfield reverse-engineering - scan the codebase, derive a draft PRD, stories and spec-code gaps
- `/bear-project:trace` — Traceability matrix (requirement → story → code → tests); --gaps for uncovered, --by-priority MoSCoW

## Agents

`product-owner`, `tech-lead`

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
