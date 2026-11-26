---
name: testing-paperclip
description: Tests Paperclip (Vitest, harness plugin, vrai Postgres). À utiliser pour écrire ou revoir les tests.
---

# Tests Paperclip

Vitest (unit + intégration + couverture) ; les tests de plugin utilisent `createTestHarness` de `@paperclipai/plugin-sdk/testing` ; les tests d'intégration ciblent un vrai Postgres (jamais mocké) ; un test d'isolation multi-tenant est obligatoire par module serveur ; couverture ≥ 80 % globalement et plus stricte sur les chemins critiques de gouvernance (agents, approbations, coûts).

Voir ../../rules/07-testing-paperclip.md pour la documentation détaillée.
