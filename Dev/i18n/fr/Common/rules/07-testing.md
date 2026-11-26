# Tests (TDD/BDD)

Obligatoires. Couverture ≥ 80 %.

- **TDD** : Red (test qui échoue) → Green (code minimal) → Refactor (les tests restent verts).
- **Correctif** : d'abord un test qui reproduit le bug, puis la correction.
- **Pyramide** : ~70 % unitaires, ~20 % intégration, ~10 % E2E.
- **Chaque test** : Arrange-Act-Assert, nom explicite, indépendant (ses propres données via factories), teste le comportement, pas l'implémentation.
- **Jamais** : test sans assertion, test commenté, test instable (injecter le temps, pas de sleep), mocks excessifs.
- **BDD** : Given/When/Then (Gherkin) pour les user stories.

Détails, outils et exemples : `.claude/references/base/testing.md`
