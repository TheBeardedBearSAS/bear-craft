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

- `/bear-project:backlog` — Backlog verwalten: EPICs, Stories und Tasks bearbeiten, nächste Story wählen, Status ändern
- `/bear-project:migrate` — Einmalige Migration eines bestehenden Backlogs nach BMAD v6 (Analyse, Migration, Resync)
- `/bear-project:report` — Projektberichte: Sprint-Burndown, Metrik-Dashboard, Story-Abhängigkeitsgraph, kritischer Pfad
- `/bear-project:reverse` — Brownfield-Reverse-Engineering: Codebasis scannen, PRD-Entwurf, Stories und Lückenanalyse ableiten
- `/bear-project:trace` — Traceability-Matrix (Anforderung → Story → Code → Tests); --gaps zeigt Lücken, --by-priority MoSCoW

## Agents

`product-owner`, `tech-lead`

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
