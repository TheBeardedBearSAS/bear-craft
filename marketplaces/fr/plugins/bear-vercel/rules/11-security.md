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

Mots de passe : Argon2id (minimum OWASP 19 MiB, t=2, p=1 ; ici 128 MiB, t≥3, p=1) ; bcrypt uniquement en repli legacy (coût ≥ 12) ; 15 caractères minimum (8 au sein d'un MFA), accepter ≥ 64, bloquer les mots de passe courants/compromis. Sessions expirées après 15 à 30 min d'inactivité. JWT : access token de 15 min, refresh token ≤ 7 jours stocké de façon sûre, jamais HS256 avec un secret faible. Headers obligatoires : CSP, X-Content-Type-Options nosniff, X-Frame-Options DENY, HSTS, Referrer-Policy stricte, COOP/COEP/CORP, Permissions-Policy.

Détails (headers, supply chain, MCP/plugins, checklists) : `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
