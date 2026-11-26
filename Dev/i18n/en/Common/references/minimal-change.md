# Minimal Change — Reference

Full text of rule 24 (`.claude/rules/24-minimal-change.md`).

## Why

Measured on a headless Claude Code benchmark (RFC-002, 2026-11-26, Opus 5.5): without guidance the agent often builds more than asked, for example a clipboard library and a wrapper component where `navigator.clipboard.writeText()` was enough. The most frequent failure was the opposite one: a rename applied to the code but not to the fixtures and tests. This rule targets both: less scope, but a complete change.

It does not relax the other rules: SOLID (04), KISS/DRY/YAGNI (05), TDD and the 80% coverage (07) and security (11) win in case of conflict.

## The ladder, with examples

| Step | Question | Example |
|---|---|---|
| 1 | Was it asked for? | "Add a copy button": no toast system, no copy history. |
| 2 | Already in the codebase? | Reuse the existing `Input`, `formatMoney()`, `UserService`. |
| 3 | Standard library / platform? | `navigator.clipboard`, `functools.lru_cache`, `Intl.NumberFormat`. |
| 4 | Installed dependency? | The project already has `date-fns`: use it, do not add `moment`. |
| 5 | Minimum code | Written in the project's layers and conventions, with its test. |

## Finishing the change

List what the change must reach before editing: callers (`grep` the function or field), tests, fixtures, config, exports, documentation. A change is finished when all of them follow.

## Shortcuts

A deliberate limit is written down where it lives:

```python
# shortcut: in-memory rate limit, per process; move to Redis when running several workers
```

## End of reply

One or two lines: what was skipped or not checked, and the risks. Example: "Skipped: pagination (not asked). Not checked: the mobile layout. Risk: the migration locks the `orders` table for a few seconds."

## Sources

- Ladder and "never cut" list adapted from Ponytail (MIT), https://github.com/DietrichGebert/ponytail
- Bear Craft RFC-002, `docs/rfc/RFC-002-MINIMAL-CHANGE.md`
