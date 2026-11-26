---
name: architecture-paperclip
description: Arquitectura de dos capas de Paperclip. Usar al diseñar o revisar límites de módulo/adaptador.
---

# Arquitectura Paperclip

Sistema de dos capas: control plane (servidor + web + DB) mantiene todo el estado de gobernanza; los adaptadores ejecutan trabajo y reportan. Los adaptadores nunca deciden presupuestos o aprobaciones.

Ver ../../rules/02-architecture-paperclip.md para documentación detallada.
