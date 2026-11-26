# KISS, DRY, YAGNI

Obligatoires.

- **KISS** : méthodes < 10 lignes (limite 20), complexité cyclomatique ≤ 10, indentation ≤ 3 niveaux, ≤ 4 paramètres, classes ≤ 200 lignes. Early returns, pas de else imbriqué, nommage explicite, composition plutôt qu'héritage.
- **DRY** : chaque règle métier à un seul endroit. Règle des 3 : ne pas abstraire avant la troisième occurrence. Duplication acceptable dans les tests et la config par environnement.
- **YAGNI** : ne construire que ce dont la tâche a besoin maintenant. Pas de feature, d'option, de config ou d'abstraction « pour plus tard ». Pas d'optimisation prématurée, de gold plating ni de généralité spéculative.

Détails et anti-patterns : `.claude/references/base/kiss-dry-yagni.md`
