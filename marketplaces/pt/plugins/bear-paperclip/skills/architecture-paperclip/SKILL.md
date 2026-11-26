---
name: architecture-paperclip
description: Arquitetura em duas camadas do Paperclip (control plane + adapters). Use ao projetar ou revisar.
---

# Arquitetura Paperclip

Sistema duas camadas: control plane (server + web + DB) mantem todo estado governanca; adapters executam trabalho e reportam. Adapters nunca decidem orcamentos ou aprovacoes.

Veja ../../rules/02-architecture-paperclip.md para documentacao detalhada.
