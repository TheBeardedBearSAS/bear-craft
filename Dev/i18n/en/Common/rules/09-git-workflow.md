# Git Workflow

GitHub Flow + Conventional Commits, mandatory.

- **Commits**: `<type>(<scope>): <description>`, subject ≤ 72 chars, one logical change per commit. Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Breaking change: `!` or `BREAKING CHANGE:` footer.
- **Branches**: `<type>/<short-description>` from an up-to-date `main`, short-lived (< 3 days).
- **PR**: mandatory review, green CI, coverage ≥ 80%, squash merge. `main` stays deployable.

Details, PR template and review checklist: `.claude/references/base/git-workflow.md`
