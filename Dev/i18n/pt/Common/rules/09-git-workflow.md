# Fluxo de trabalho Git

GitHub Flow + Conventional Commits, obrigatórios.

- **Commits**: `<type>(<scope>): <description>`, assunto ≤ 72 caracteres, uma alteração lógica por commit. Tipos: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Breaking change: `!` ou rodapé `BREAKING CHANGE:`.
- **Branches**: `<type>/<descricao-curta>` a partir de um `main` atualizado, de curta duração (< 3 dias).
- **PR**: revisão obrigatória, CI verde, cobertura ≥ 80 %, squash merge. `main` sempre implantável.

Detalhes, template de PR e checklist de revisão: `.claude/references/base/git-workflow.md`
