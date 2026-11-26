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

- `/bear-project:backlog` — Gerenciar o backlog: EPICs, User Stories e Tarefas, próxima story, status e regras de roteamento
- `/bear-project:migrate` — Migração pontual de um backlog existente para BMAD v6 (análise, migração, stories, ressincronização)
- `/bear-project:report` — Relatórios do projeto: burndown do sprint, métricas, grafo de dependências e caminho crítico
- `/bear-project:reverse` — Engenharia reversa brownfield: derivar do código um PRD rascunho, user stories e análise de lacunas
- `/bear-project:trace` — Matriz de rastreabilidade (requisito → story → código → testes); --gaps e --by-priority (MoSCoW)

## Agents

`product-owner`, `tech-lead`

## About

Part of [Bear Craft](https://github.com/TheBeardedBearSAS/bear-craft) by The Bearded Bear. Each plugin is generated from the framework installers (`npm run plugins:generate`); do not edit it by hand.

License: MIT. Author: The Bearded Bear.
