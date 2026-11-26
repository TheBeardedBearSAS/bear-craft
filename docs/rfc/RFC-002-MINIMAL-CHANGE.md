# RFC-002 : Changement minimal — faire aussi bien que Ponytail (ou mieux)

**Statut** : Draft — en attente de validation
**Créé** : 2026-11-26
**Auteur** : The Bearded Bear
**Branche** : `feat/minimal-change-rfc`

---

## Résumé

[Ponytail](https://github.com/DietrichGebert/ponytail) (MIT) est un prompt de 3,5 Ko qui pousse l'agent vers le plus petit changement complet. Son benchmark agentique
(585 sessions `claude -p`, Opus 5.5, 39 tâches) mesure, contre l'agent sans skill :
**−53 % de lignes, −45 % de tokens de sortie, −26 % de coût, −41 % de temps**, correction égale (96,7 % vs 95,6 % sur les contrôles cachés) et davantage de tests là où la logique en demande (98 % vs 68 %).

Bear Craft promeut les mêmes principes (règles 05 KISS/DRY/YAGNI et 23 Karpathy), mais ne les applique pas efficacement côté utilisateur. Cette RFC propose 5 phases pour combler l'écart, **mesurées par un benchmark avant/après**.

## Constats (vérifiés le 2026-11-26)

| Point | Ponytail | Bear Craft installé |
|---|---|---|
| Consigne de comportement au démarrage | 3,5 Ko, impérative | ≈ 109 Ko de règles Common en `.claude/rules/`, surtout descriptives ; mesuré : ~57 000 tokens au premier appel (vs ~4 000 sans config, ~6 000 Ponytail) |
| Règle 23 (Karpathy) | — | **Non distribuée** : présente uniquement dans le `.claude/` du dépôt |
| Ordre de décision « réutiliser d'abord » | Échelle en 6 échelons | Absent (YAGNI expliqué, pas opérationnalisé) |
| Liste « ne jamais couper » | Oui | Dispersée (11-security, 07-testing) |
| Carte du code existant | Injectée au `SessionStart` (budget 3 s) | `session-init.sh` détecte la stack seulement |
| Sous-agents | Hook `SubagentStart` réinjecte la consigne | **Aucune injection** — or `implement`, `team:delivery` et les reviewers passent par des sous-agents |
| Fin de réponse | « sauté / non vérifié / risques » | Aucune convention |
| Mesure | Harness publié et reproductible | **Aucun benchmark de comportement** |

Leçon tirée du benchmark de coût de Ponytail : un jeu de règles toujours chargé et volumineux **annule** le gain sur certains modèles. Ajouter sans retirer serait contre-productif.

## Mesure de référence (phase 0, 2026-11-26)

144 sessions (16 tâches × 3 configurations × 3 runs, Opus 5.5), méthode Ponytail. Contre « sans configuration » :

| | Ponytail | Bear Craft 10.1.2 |
|---|--:|--:|
| Lignes livrées | −62 % [−75..−46] | −24 % [−33..−13] |
| Coût | −31 % [−45..−13] | **+285 %** [+211..+378] |
| Contexte traité (entrée + cache) | −22 % | **+262 %** |
| Contrôles cachés | 24/24 | 22/24 (sans config : 23/24) |

Les règles réduisent le code, mais le contexte de démarrage (~57 000 tokens au premier appel) multiplie le coût par ~3,9 en session courte à froid :
≈ 0,46 $ fixes par session pour l'écriture en cache (tarif 1 h). À cache chaud, le surcoût tombe à ~+0,09 $/session (n = 1).
Les 3 échecs sont tous sur `scope-rename` (fixtures/tests oubliés). **La phase 2 (allègement) devient la priorité n° 1.**
Détail : `bear-craft-bench/content/2026-11-26-phase0-results.md`.

## Décision d'arbitrage

En cas de conflit, **les règles actuelles prévalent** : SOLID, TDD, couverture ≥ 80 %. Le minimalisme porte sur la **portée** :

- pas de fonctionnalité, option, configuration ou flexibilité non demandée ;
- réutiliser l'existant (code du dépôt → stdlib/plateforme → dépendance installée) avant d'écrire ;
- pas de nouvelle dépendance pour quelques lignes ;
- pas d'abstraction spéculative (règle des 3, déjà dans la règle 05).

Conséquence attendue : un gain en lignes **inférieur** à celui de Ponytail (nos tests restent obligatoires et ne sont pas comptés comme code source) ; le gain coût/contexte viendra surtout de la phase 2.

## Phases (une PR par phase)

### Phase 0 — Mesure de référence

- Adapter le harness agentique de Ponytail (MIT, attribution conservée) dans le dépôt séparé `bear-craft-bench`.
- Bras : `baseline` (aucune config), `ponytail` (plugin), `bearcraft-10` (installation actuelle).
- Isolation : workspace temporaire, `CLAUDE_CONFIG_DIR` temporaire (pas de `~/.claude/CLAUDE.md` personnel). Le harness Ponytail coupe le chargement de `CLAUDE.md` : pour le bras Bear Craft, il faut l'**autoriser** et installer Bear Craft dans le workspace (`--hooks=default`).
- Exécution dans Docker (Python + Claude CLI), clé API via `.env` non commitée.

### Phase 1 — Règle « minimal-change » et sous-agents (réalisée 2026-11-26, branche `feat/minimal-change-rule`)

Mesure préalable (sonde `subagent_probe.py`) : `general-purpose` et les agents personnalisés chargent déjà `.claude/rules/` ; `Explore` et `Plan` non.
Le hook `SubagentStart` est donc limité à `Plan` (qui décide du périmètre) ; `Explore` est en lecture seule. Vérifié de bout en bout : `Plan` cite la règle 24 avec le hook, « NONE » sans.
La règle 23 du dépôt n'est pas distribuée ; ses principes sont couverts par la règle 24.

- Nouvelle règle `Dev/i18n/<lang>/Common/rules/24-minimal-change.md`, **≤ 4 Ko**, impérative (voir annexe A), 5 langues.
- La règle 23 est fusionnée dedans (ses 3 principes) au lieu d'être distribuée telle quelle ; `.claude/rules/23-karpathy-principles.md` du dépôt pointe vers la nouvelle règle.
- Script `Dev/i18n/base/Common/hooks/scripts/subagent-init.sh` (hook `SubagentStart`) qui injecte le contenu de la règle 24 dans chaque sous-agent ; ajouté à `hooks.default.json` et `hooks.full.json` (merge non destructif existant).
- Tests (rédigés d'abord) : taille ≤ 4 Ko par langue, parité i18n, schéma du hook, sortie JSON `additionalContext` du script, test bats.

### Phase 2 — Allègement du contexte de démarrage (réalisée 2026-11-26, branche `feat/rules-diet`)

Résultat mesuré (ablation, installation réelle python+react) : premier appel 68 796 → **24 605 tokens** ; surplus vs projet vide +51 722 → **+7 531 (−85 %)**.
Règles 43 920 → 2 608 ; `CLAUDE.md` 3 078 → 587 ; plugins 4 688 → 4 312 (descriptions ≤ 100 caractères : gain faible, comme prévu).
Run de pilotage (8 tâches × 3, prototype anglais) : coût +250 % → +40 % vs sans config, lignes −32 % → −37 %, contrôles cachés 12/12.
Témoin sans règles : −28 % de lignes — l'essentiel de l'effet « code » ne venait pas du texte long des règles.
Branche réelle (8 tâches × 3, 2026-11-26) : coût +43 % vs sans config (10.1.2 : +250 %), 0,276 $/session (−57 %), lignes −29 %, contrôles cachés 12/12, tests écrits 83 %.
Mise à jour d'un projet 10.1.2 (`bear-craft update`) : règles 109 Ko → 6 Ko, références installées, `CLAUDE.md` racine conservé (fichier utilisateur) → ≈ −80 %.
Reporté : les agents d'audit et `checks/*.md` citent les règles comme checklist et tombent sur la version courte (qui pointe vers la référence) ; à recibler vers `references/base/` dans une PR suivante.

- Cible : surplus du premier appel vs projet vide **≤ +10 000 tokens** (`ablate.py` ; 10.1.2 : +51 722, Ponytail ≈ +2 000).
  Leviers : règles Common (≈ 109 Ko), `CLAUDE.md` racine (6,2 Ko, orienté gestion de projet), listes d'agents/skills des 10 plugins (≈ 25 Ko) — chacun mesuré séparément avant de trancher.
- Chaque règle Common devient une quick-ref courte (comme celles du `.claude/rules/` du dépôt) ; le détail part en `.claude/references/base/` (lu à la demande) ou derrière `paths:`.
- Priorité : 12-context-management (≈ 30 Ko), 11-security (≈ 19 Ko), 05, 04, 09, 07.
- Tests : budget de taille cumulée par langue (nouveau test de contenu), liens quick-ref → référence valides, parité 0,80 maintenue.

### Phase 3 — Carte du code et revue (réalisée 2026-11-26, branche `feat/review-protocol`)

- **Carte du code : non livrée.** Prototype (`bear-craft-bench/proto/session-map.sh`) mesuré sur 3 tâches `tmpl-*` × 3 : lignes −56 % contre −66 % sans carte, tours +13 % contre +28 %, coût +9 % contre +12 % (intervalles très larges).
  Gain non démontré pour ~600 tokens par session : écartée.
- **Protocole de revue : livré**, additif (grilles et formats inchangés) ; checklists et agents Common reciblés vers `references/base/`.
  Effet non mesuré : sur une casse plantée hors du diff, l'ancien et le nouveau reviewer la trouvent 2/2 (test trop facile pour départager) ; la revue coûte 0,07 $ contre 0,29 $ grâce à la phase 2.

- **Carte** : `session-init.sh` ajoute une liste compacte (≤ 2 Ko) des composants/helpers/services et dépendances installées ; budget 3 s, échec silencieux, désactivable (`BEAR_MAP=0`).
- **Revue** : les 11 reviewers et `/bear-gate:check` lisent le code touché hors diff (appelants, imports) et structurent chaque constat : *ce que fait le code / ce qui casse / correctif / risque si ignoré*, classés « à corriger / à envisager / optionnel ».

### Phase 4 — Mesure finale (réalisée 2026-11-26)

240 sessions (20 tâches × 4 configurations × 3 runs, un seul run). Candidat (phases 1-3) contre sans config : coût **+51 %** (10.1.2 : +300 %), 0,263 $/session contre 0,646 $ (**−59 %**),
lignes −31 % (−25 % hors tâches `tmpl-fe-datepicker` et `scope-rename`, contre −24 % pour 10.1.2), contrôles cachés 27/27 (10.1.2 : 25/27), tests écrits 77 %.
Ponytail : lignes −58 %, coût −32 %. **Objectif « aussi bien que Ponytail » non atteint sur la taille et le coût** ; atteint sur la correction, dépassé sur les tests.
Détail : `bear-craft-bench/content/2026-11-26-phase4-final.md`.

**Qualité des tests (mutation, hors ligne sur les mêmes workspaces, 11 tâches Python × 3 runs)** : bugs injectés attrapés par les tests de l'agent —
Bear Craft candidat **81 %** [60..96], 10.1.2 80 %, Ponytail 43 %, sans config 41 % ; meilleur que Ponytail sur 7/11 tâches, pire sur 0 (p = 0,016).
La refonte garde la qualité des tests intacte pour un coût par session divisé par 2,5. Détail : `bear-craft-bench/content/2026-11-26-test-quality.md`.

#### Plan initial

- Rejouer le benchmark **en un seul run** avec 4 bras (`baseline`, `ponytail`, `bearcraft-10`, `bearcraft-next`) pour neutraliser la dérive du modèle.
- Publier `docs/benchmarks/2026-12-minimal-change.md` : méthode, tableaux par tâche, limites. Aucune promesse marketing non mesurée.

## Benchmark : protocole et budget (plafond 150 $)

| | Phase 0 | Phase 4 |
|---|--:|--:|
| Tâches | 20 (sous-ensemble : 8 tickets template, 8 chirurgicales à contrôles cachés, 4 « build me ») | idem |
| Bras × runs | 3 × 3 | 4 × 3 |
| Sessions | 180 | 240 |
| Coût estimé (Opus 5.5, ≈ 0,20–0,30 $/session) | 36–54 $ | 48–72 $ |

Total estimé : **84–126 $** + juges (< 5 $). Arrêt automatique du harness si la dépense cumulée dépasse 140 $.

**Critères de succès** (`bearcraft-next` vs `baseline`, moyenne géométrique, IC 95 %) :

1. Contrôles cachés : ≥ baseline (aucune régression de sécurité).
2. Tests présents là où la logique en demande : ≥ 90 %.
3. Coût : ≤ −15 % ; lignes source : ≤ −30 %.
4. `bearcraft-next` meilleur que `bearcraft-10` sur coût **et** lignes.

« Aussi bien que Ponytail » = critères 1–2 égaux ou meilleurs, critère 3 dans l'IC de Ponytail.

**Angles morts** : un prompt `claude -p` isolé lance rarement des sous-agents et jamais de reviewer ; l'injection `SubagentStart` (phase 1) et la revue (phase 3) ne sont donc pas mesurées par ce benchmark.
Le critère 2 repose sur le tri manuel des tâches de Ponytail (« logique qui exige un test ») ; `run.py` ne mesure que `wrote_tests_rate` — à reproduire avant de garder ce critère.

**Constat d'installation (10.1.2, `--tech=python,react`)** : 109 200 octets de `.claude/rules/` + `CLAUDE.md` racine (6,4 Ko, orienté gestion de projet) + `AGENTS.md` (2,9 Ko) + `.claude/CLAUDE.md`, chargés à chaque session.

## Risques

| Risque | Mitigation |
|---|---|
| La phase 2 casse des liens/tests i18n | Tests de liens + parité avant fusion |
| `SubagentStart` ralentit chaque sous-agent | Script < 50 ms, simple `cat` d'un fichier |
| Gain non reproduit à cause de TDD/80 % | Mesure explicite ; résultats publiés tels quels |
| Benchmark biaisé par nos tâches | Reprendre celles de Ponytail, pas les nôtres |
| Dépassement du budget | Plafond dur dans le harness |

## Décisions (2026-11-26)

1. Harness : **dépôt séparé** `bear-craft-bench` (dépôt principal gardé léger).
2. Règle 24 : **un seul niveau**.
3. Ordre : phase 0 démarrée en premier.

## Question ouverte

- Version cible : 10.2.0 (phases 1+3) puis 11.0.0 (phase 2, changement de structure des règles) ?

---

## Annexe A — Brouillon de la règle 24 (version en)

```markdown
# Minimal Change

Solve the whole task with the least new scope. SOLID, TDD and the 80% coverage
rules still apply; this rule limits WHAT you build, not how well.

## Before writing
Read the task and the code it touches. List every place the change must reach:
callers, tests, fixtures, config, exports. That is the scope. Extra features are not.

## Pick the first option that fully works
1. Does it need to exist? Skip features, options and flexibility nobody asked
   for; name them in one line.
2. Already in this codebase (helper, component, service, pattern)? Reuse it the
   way the surrounding code does.
3. Standard library or platform feature? Use it, unless the project has its own.
4. Installed dependency? Use it. Never add a dependency for a few lines.
5. Otherwise: the minimum code that works, following the project architecture.

## Rules
- No abstraction, wrapper, option or config until a third real use (rule 05).
- Finish everything the change breaks: callers, tests, fixtures.
- Bug fix: find every caller first, fix the root cause once.
- Known limit taken on purpose: `shortcut: <limit>, <when to upgrade>`.
- Never cut: validation at trust boundaries, error handling against data loss,
  security, accessibility, tests required by rule 07.

## End every reply with
One or two lines: what you skipped or did not check, and any risk the user must know.
```
