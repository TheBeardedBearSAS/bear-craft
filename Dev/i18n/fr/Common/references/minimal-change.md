# Changement minimal — Référence

Texte complet de la règle 24 (`.claude/rules/24-minimal-change.md`).

## Pourquoi

Mesuré sur un benchmark Claude Code headless (RFC-002, 2026-11-26, Opus 5.5) : sans consigne, l'agent construit souvent plus que demandé, par exemple un calendrier fait main (335 lignes) là où l'`Input` du dépôt avec `type="date"` suffisait (10 lignes). L'échec le plus fréquent était l'inverse : un renommage appliqué au code mais pas aux fixtures ni aux tests. Cette règle vise les deux : moins de périmètre, mais un changement complet.

Elle n'assouplit pas les autres règles : SOLID (04), KISS/DRY/YAGNI (05), TDD et la couverture de 80 % (07) et la sécurité (11) l'emportent en cas de conflit.

## L'échelle, avec des exemples

| Étape | Question | Exemple |
|---|---|---|
| 1 | Est-ce demandé ? | « Ajouter un filtre par date » : pas d'export, pas de préréglages enregistrés. |
| 2 | Déjà dans le code ? | Réutiliser l'`Input`, `formatMoney()`, `UserService` existants. |
| 3 | Bibliothèque standard / plateforme ? | `<input type="date">`, `functools.lru_cache`, `Intl.NumberFormat`. |
| 4 | Dépendance installée ? | Le projet a déjà `date-fns` : l'utiliser, ne pas ajouter `moment`. |
| 5 | Code minimal | Écrit dans les couches et conventions du projet, avec son test. |

## Terminer le changement

Avant de modifier, lister ce que le changement doit atteindre : appelants (`grep` sur la fonction ou le champ), tests, fixtures, configuration, exports, documentation. Un changement est terminé quand tout suit.

## Raccourcis

Une limite assumée est écrite là où elle se trouve :

```python
# shortcut: rate limit en mémoire, par processus ; passer à Redis avec plusieurs workers
```

## Fin de réponse

Une ou deux lignes : ce qui a été laissé de côté ou non vérifié, et les risques. Exemple : « Laissé de côté : la pagination (non demandée). Non vérifié : l'affichage mobile. Risque : la migration verrouille la table `orders` quelques secondes. »

## Sources

- Échelle et liste « ne jamais couper » adaptées de Ponytail (MIT), https://github.com/DietrichGebert/ponytail
- RFC-002 de Bear Craft, `docs/rfc/RFC-002-MINIMAL-CHANGE.md`
