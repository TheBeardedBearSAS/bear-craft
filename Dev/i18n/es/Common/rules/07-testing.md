# Tests (TDD/BDD)

Obligatorios. Cobertura ≥ 80 %.

- **TDD**: Red (test que falla) → Green (código mínimo) → Refactor (los tests siguen en verde).
- **Corrección de bug**: primero un test que reproduce el bug, después la corrección.
- **Pirámide**: ~70 % unitarios, ~20 % integración, ~10 % E2E.
- **Cada test**: Arrange-Act-Assert, nombre explícito, independiente (sus propios datos vía factories), prueba el comportamiento, no la implementación.
- **Nunca**: tests sin aserciones, tests comentados, tests inestables (inyectar el tiempo, sin sleep), mocks excesivos.
- **BDD**: Given/When/Then (Gherkin) para las historias de usuario.

Detalles, herramientas y ejemplos: `.claude/references/base/testing.md`
