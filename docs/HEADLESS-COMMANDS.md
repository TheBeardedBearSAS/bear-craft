# Headless (`claude -p`) workflow commands

`/bear-workflow:design`, `/bear-workflow:implement` and `/bear-workflow:plan --only=prd` carry explicit
headless guidance: no plan mode, no `ScheduleWakeup`, no `AskUserQuestion`, the design plan is written to
`project-management/design-plan.md`, and the PRD/spec gates are either run through `/bear-gate:check` or
reported as NOT RUN.

## What CI can and cannot prove

The real behaviour of `claude -p` (model decisions, tool calls, looping) is **not testable in CI**: a fake
`claude` binary cannot execute the logic described in a command file, and Bear Craft deliberately has no live
smoke test. The guarantee is therefore **static**: the command text is checked, not what a model does with it.

Two test files cover every layer (`.claude/`, `Dev/i18n/*`, `marketplaces/*`):

- `tests/content/workflow-headless.test.mjs` checks that the expected strings are present (headless mention,
  `claude -p`, `ScheduleWakeup`, the design plan path, the gate commands and a NOT RUN statement).
- `tests/content/headless-commands-lint.test.mjs` (pure functions in `tests/content/headless-lint.mjs`) parses
  the markdown and checks, for `design` and `implement`:
  - exactly one headless blockquote exists, mentions `claude -p` and names both `ScheduleWakeup` and
    `AskUserQuestion`;
  - across the whole command file, every `ScheduleWakeup` / `AskUserQuestion` mention is covered by a closed
    list of per-language prohibition formulas ("do not call", "ne pas appeler", "no llamar", "nicht aufrufen",
    "não chamar", "must never be called"...), including enumerations ("do not call A and B"). A bare "no" or
    "nicht", or a later positive call ("..., call X"), is a failure. This is a heuristic, not a parser of
    natural language: a new phrasing must be added to the list;
  - `ScheduleWakeup` appears nowhere outside the headless block;
  - `design` writes its plan to `project-management/design-plan.md` (inside the headless block).

  For `design` (spec gate) and `plan` (PRD gate) it also checks that one line carries both the gate command
  (`/bear-gate:check spec` / `/bear-gate:check prd`) and a NOT RUN fallback. Cross-language consistency is
  limited to the literal commands, paths and tool names quoted in backticks inside the headless block and on
  that gate line; other prose is not compared.

The linter itself is tested with positive and negative fixtures, so a regression in the guidance turns it red.
