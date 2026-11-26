# Testing (TDD/BDD)

Mandatory. Coverage ≥ 80%.

- **TDD**: Red (failing test) → Green (minimum code) → Refactor (tests stay green).
- **Bug fix**: first a test that reproduces the bug, then the fix.
- **Pyramid**: ~70% unit, ~20% integration, ~10% E2E.
- **Each test**: Arrange-Act-Assert, explicit name, independent (own data via factories), tests behavior not implementation.
- **Never**: tests without assertions, commented-out tests, flaky tests (inject time, no sleep), excessive mocks.
- **BDD**: Given/When/Then (Gherkin) for user stories.

Details, tools and examples: `${CLAUDE_PLUGIN_ROOT}/references/base/testing.md`
