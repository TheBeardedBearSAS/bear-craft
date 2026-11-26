# Git-Workflow

GitHub Flow + Conventional Commits, verpflichtend.

- **Commits**: `<type>(<scope>): <description>`, Betreff ≤ 72 Zeichen, eine logische Änderung pro Commit. Typen: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Breaking Change: `!` oder Fußzeile `BREAKING CHANGE:`.
- **Branches**: `<type>/<kurze-beschreibung>` von einem aktuellen `main`, kurzlebig (< 3 Tage).
- **PR**: Review verpflichtend, grüne CI, Abdeckung ≥ 80 %, Squash-Merge. `main` bleibt deploybar.

Details, PR-Vorlage und Review-Checkliste: `.claude/references/base/git-workflow.md`
