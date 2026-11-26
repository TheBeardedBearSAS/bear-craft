# KISS, DRY, YAGNI

Mandatory.

- **KISS**: methods < 10 lines (limit 20), cyclomatic complexity ≤ 10, indentation ≤ 3 levels, ≤ 4 parameters, classes ≤ 200 lines. Early returns, no nested else, explicit names, composition over inheritance.
- **DRY**: each business rule in one place. Rule of three: do not abstract before the third occurrence. Duplication is fine in tests and per-environment config.
- **YAGNI**: build only what the task needs now. No feature, option, config or abstraction "for later". No premature optimization, gold plating or speculative generality.

Details and anti-patterns: `.claude/references/base/kiss-dry-yagni.md`
