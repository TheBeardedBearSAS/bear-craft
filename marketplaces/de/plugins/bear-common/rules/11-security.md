# Sicherheit

Absolute Priorität. Referenz: OWASP Top 10:2025.

| # | Bedrohung | Abwehr |
|---|---|---|
| A01 | Broken Access Control (inkl. SSRF) | Berechtigungen bei jeder Anfrage prüfen, standardmäßig verweigern |
| A02 | Security Misconfiguration | Härtung, generische Fehlermeldungen in Produktion |
| A03 | Software Supply Chain Failures | Gepinnte, geprüfte Abhängigkeiten; SBOM; signierte Artefakte |
| A04 | Cryptographic Failures | TLS 1.3, Argon2id für Passwörter, Secrets in einem Vault |
| A05 | Injection | Parametrisierte Abfragen, Validierung |
| A06 | Insecure Design | Threat Modeling, Rate Limiting |
| A07 | Authentication Failures | MFA, Brute-Force-Schutz, Sitzungen beim Logout invalidieren |
| A08 | Software or Data Integrity Failures | Signaturen/Prüfsummen verifizieren, sichere CI/CD |
| A09 | Security Logging and Alerting Failures | Sicherheitsereignisse protokollieren, bei Anomalien alarmieren |
| A10 | Mishandling of Exceptional Conditions | Fehler protokollieren, nie Stack Traces offenlegen |

Nicht verhandelbar: jede Eingabe serverseitig validieren; nie SQL verketten; nie MD5/SHA1 für Passwörter; Tokens in HTTP-only-, Secure-, SameSite-Cookies (nie localStorage); JWT mit kurzer Laufzeit und beim Prüfer festgelegtem Algorithmus; nie Secrets im Code; nie Passwörter, Tokens oder vollständige personenbezogene Daten protokollieren.

Details (Header, Supply Chain, MCP/Plugins, Checklisten): `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
