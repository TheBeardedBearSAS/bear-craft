# Analyse avant le code

Avant toute modification (feature, correctif, refactoring), analyser d'abord. Obligatoire.

1. **Comprendre** : objectif, critères d'acceptation, contraintes, impact utilisateur.
2. **Analyser** : lire les fichiers concernés, leurs dépendants, les tests et les migrations.
3. **Documenter** : fichiers impactés, breaking changes, migration de base, risques + mitigations, tests TDD à écrire.
4. **Valider** selon le risque :
   - Faible (1 fichier, < 1 h) : procéder.
   - Moyen (2 à 5 fichiers, migration, < 4 h) : validation utilisateur.
   - Fort (> 5 fichiers, breaking changes, architecture) : plan détaillé + validation obligatoire.

Puis implémenter en TDD (règle 07). Ne jamais coder sans avoir lu le code existant, ses dépendances et ses tests.

Détails et templates : `${CLAUDE_PLUGIN_ROOT}/references/base/workflow-analysis.md`
