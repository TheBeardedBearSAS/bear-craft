# Tests (TDD/BDD)

Verpflichtend. Abdeckung ≥ 80 %.

- **TDD**: Red (fehlschlagender Test) → Green (minimaler Code) → Refactor (Tests bleiben grün).
- **Bugfix**: zuerst ein Test, der den Bug reproduziert, dann die Korrektur.
- **Pyramide**: ~70 % Unit, ~20 % Integration, ~10 % E2E.
- **Jeder Test**: Arrange-Act-Assert, sprechender Name, unabhängig (eigene Daten über Factories), testet Verhalten, nicht Implementierung.
- **Niemals**: Tests ohne Assertions, auskommentierte Tests, instabile Tests (Zeit injizieren, kein sleep), übermäßige Mocks.
- **BDD**: Given/When/Then (Gherkin) für User Stories.

Details, Werkzeuge und Beispiele: `${CLAUDE_PLUGIN_ROOT}/references/base/testing.md`
