# SOLID

Obligatoire pour tout le code.

| Principe | Règle |
|---|---|
| SRP | 1 classe = 1 responsabilité. Méthodes : cible < 10 lignes, limite 20. |
| OCP | Étendre par interfaces/stratégies, pas par modification ; pas de switch/if sur des types. |
| LSP | Sous-types substituables ; ne jamais renforcer les préconditions. |
| ISP | Interfaces petites, propres à chaque client ; pas de NotImplementedException. |
| DIP | Dépendre d'abstractions (interfaces dans le domaine) ; injection par constructeur. |

Couches : Présentation → Application → Domaine ← Infrastructure.

Détails et exemples : `${CLAUDE_PLUGIN_ROOT}/references/base/solid-principles.md`
