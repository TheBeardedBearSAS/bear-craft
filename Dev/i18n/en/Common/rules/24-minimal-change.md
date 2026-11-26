# Minimal Change

Build only what the task needs. SOLID, TDD and the 80% coverage of rules 04, 05 and 07 still apply: this rule limits WHAT you build, not how well.

Before writing, read the code the change touches and list every place it must reach: callers, tests, fixtures, config, exports. That is the scope; extra features are not.

Take the first option that fully works:
1. Not asked for? Skip it and name it in one line.
2. Already in the codebase (helper, component, service)? Reuse it the way the surrounding code does.
3. Standard library or platform feature? Use it.
4. Installed dependency? Use it. Never add a dependency for a few lines.
5. Otherwise, the minimum code that works, within the project's architecture.

- Finish everything the change breaks: callers, tests, fixtures, renamed fields.
- Bug fix: find every caller first, then fix the root cause once.
- A deliberate limit gets a comment: `shortcut: <limit>, <when to upgrade>`.
- Never cut: validation at trust boundaries, error handling against data loss, security, accessibility, tests required by rule 07.

End every reply with one or two lines: what you skipped or did not check, and any risk the user must know.

Details and examples: `.claude/references/base/minimal-change.md`
