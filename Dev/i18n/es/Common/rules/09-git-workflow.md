# Flujo de trabajo Git

GitHub Flow + Conventional Commits, obligatorios.

- **Commits**: `<type>(<scope>): <description>`, asunto ≤ 72 caracteres, un cambio lógico por commit. Tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Breaking change: `!` o pie `BREAKING CHANGE:`.
- **Ramas**: `<type>/<descripcion-corta>` desde un `main` actualizado, de corta duración (< 3 días).
- **PR**: revisión obligatoria, CI en verde, cobertura ≥ 80 %, squash merge. `main` siempre desplegable.

Detalles, plantilla de PR y checklist de revisión: `.claude/references/base/git-workflow.md`
