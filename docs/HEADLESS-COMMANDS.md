# Headless (`claude -p`) workflow commands

`/bear-workflow:design`, `/bear-workflow:implement` and `/bear-workflow:plan --only=prd` carry explicit
headless guidance: no plan mode, no `ScheduleWakeup`, no `AskUserQuestion`, the design plan is written to
`project-management/design-plan.md`, and the PRD/spec gates are either run through `/bear-gate:check` or
reported as NOT RUN.

## What CI can and cannot prove

The real behaviour of `claude -p` (model decisions, tool calls, looping) is **not testable in CI**: a fake
`claude` binary cannot execute the logic described in a command file, and Bear Craft deliberately has no live
smoke test. The guarantee is therefore **static**.

`tests/content/headless-commands-lint.test.mjs` (pure functions in `tests/content/headless-lint.mjs`) lints
every layer (`.claude/`, `Dev/i18n/*`, `marketplaces/*`) by block and sentence:

- the headless block exists and mentions `claude -p`;
- `ScheduleWakeup` and `AskUserQuestion` only appear in a prohibition sentence (never as a positive instruction);
- `design` writes the plan to `project-management/design-plan.md`;
- `plan --only=prd` and `design` invoke `/bear-gate:check prd` / `spec` and carry a NOT RUN fallback;
- literal commands and paths are identical across languages.

The linter is itself tested with positive and negative fixtures, so a regression in the guidance turns it red.
