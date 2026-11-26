# Workflow Git

GitHub Flow + Conventional Commits, obligatoires.

- **Commits** : `<type>(<scope>): <description>`, sujet ≤ 72 caractères, un changement logique par commit. Types : feat, fix, docs, style, refactor, perf, test, build, ci, chore. Breaking change : `!` ou pied `BREAKING CHANGE:`.
- **Branches** : `<type>/<description-courte>` depuis un `main` à jour, courte durée (< 3 jours).
- **PR** : revue obligatoire, CI verte, couverture ≥ 80 %, squash merge. `main` reste déployable.

Détails, template de PR et checklist de revue : `.claude/references/base/git-workflow.md`
