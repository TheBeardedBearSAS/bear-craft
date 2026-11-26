# Sécurité

Priorité absolue. Référence : OWASP Top 10:2025.

| # | Menace | Défense |
|---|---|---|
| A01 | Broken Access Control (inclut SSRF) | Vérifier les permissions à chaque requête, refus par défaut |
| A02 | Security Misconfiguration | Durcissement, erreurs génériques en production |
| A03 | Software Supply Chain Failures | Dépendances épinglées et auditées ; SBOM ; artefacts signés |
| A04 | Cryptographic Failures | TLS 1.3, Argon2id pour les mots de passe, secrets dans un vault |
| A05 | Injection | Requêtes paramétrées, validation |
| A06 | Insecure Design | Threat modeling, rate limiting |
| A07 | Authentication Failures | MFA, protection brute-force, sessions invalidées à la déconnexion |
| A08 | Software or Data Integrity Failures | Vérifier signatures/checksums, CI/CD sécurisé |
| A09 | Security Logging and Alerting Failures | Journaliser les événements de sécurité, alerter sur les anomalies |
| A10 | Mishandling of Exceptional Conditions | Journaliser les erreurs, ne jamais exposer de stack trace |

Non négociable : valider toute entrée côté serveur ; jamais de concaténation SQL ; jamais MD5/SHA1 pour les mots de passe ; jetons en cookies HTTP-only, secure, SameSite (jamais localStorage) ; JWT à expiration courte, algorithme épinglé côté vérifieur ; jamais de secret dans le code ; ne jamais journaliser mots de passe, jetons ou données personnelles complètes.

Détails (headers, supply chain, MCP/plugins, checklists) : `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
