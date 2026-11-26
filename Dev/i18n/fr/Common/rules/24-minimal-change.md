# Changement minimal

Ne construire que ce dont la tâche a besoin. SOLID, TDD et la couverture de 80 % des règles 04, 05 et 07 s'appliquent toujours : cette règle limite CE QUE l'on construit, pas sa qualité.

Avant d'écrire, lire le code touché et lister tout ce que le changement doit atteindre : appelants, tests, fixtures, configuration, exports. C'est le périmètre ; les fonctionnalités en plus n'en font pas partie.

Prendre la première option qui fonctionne entièrement :
1. Non demandé ? Ne pas le faire, le signaler en une ligne.
2. Déjà dans le code (helper, composant, service) ? Le réutiliser comme le fait le code voisin.
3. Bibliothèque standard ou fonctionnalité de la plateforme ? L'utiliser.
4. Dépendance déjà installée ? L'utiliser. Jamais de nouvelle dépendance pour quelques lignes.
5. Sinon, le code minimal qui fonctionne, dans l'architecture du projet.

- Terminer tout ce que le changement casse : appelants, tests, fixtures, champs renommés.
- Correctif : trouver d'abord tous les appelants, puis corriger la cause racine une seule fois.
- Une limite assumée reçoit un commentaire : `shortcut: <limite>, <quand l'améliorer>`.
- Ne jamais couper : validation aux frontières de confiance, gestion d'erreurs contre la perte de données, sécurité, accessibilité, tests exigés par la règle 07.

Terminer chaque réponse par une ou deux lignes : ce qui a été laissé de côté ou non vérifié, et tout risque que l'utilisateur doit connaître.

Détails et exemples : `.claude/references/base/minimal-change.md`
