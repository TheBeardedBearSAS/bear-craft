# Testes (TDD/BDD)

Obrigatórios. Cobertura ≥ 80 %.

- **TDD**: Red (teste que falha) → Green (código mínimo) → Refactor (os testes continuam verdes).
- **Correção de bug**: primeiro um teste que reproduz o bug, depois a correção.
- **Pirâmide**: ~70 % unitários, ~20 % integração, ~10 % E2E.
- **Cada teste**: Arrange-Act-Assert, nome explícito, independente (seus próprios dados via factories), testa o comportamento, não a implementação.
- **Nunca**: testes sem asserções, testes comentados, testes instáveis (injetar o tempo, sem sleep), mocks excessivos.
- **BDD**: Given/When/Then (Gherkin) para as histórias de usuário.

Detalhes, ferramentas e exemplos: `${CLAUDE_PLUGIN_ROOT}/references/base/testing.md`
