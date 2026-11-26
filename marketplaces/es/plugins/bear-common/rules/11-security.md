# Seguridad

Prioridad absoluta. Referencia: OWASP Top 10:2025.

| # | Amenaza | Defensa |
|---|---|---|
| A01 | Broken Access Control (incluye SSRF) | Verificar permisos en cada petición, denegar por defecto |
| A02 | Security Misconfiguration | Hardening, errores genéricos en producción |
| A03 | Software Supply Chain Failures | Dependencias fijadas y auditadas; SBOM; artefactos firmados |
| A04 | Cryptographic Failures | TLS 1.3, Argon2id para contraseñas, secretos en un vault |
| A05 | Injection | Consultas parametrizadas, validación |
| A06 | Insecure Design | Threat modeling, rate limiting |
| A07 | Authentication Failures | MFA, protección contra fuerza bruta, invalidar sesiones al cerrar sesión |
| A08 | Software or Data Integrity Failures | Verificar firmas/checksums, CI/CD seguro |
| A09 | Security Logging and Alerting Failures | Registrar los eventos de seguridad, alertar ante anomalías |
| A10 | Mishandling of Exceptional Conditions | Registrar los errores, nunca exponer stack traces |

Innegociable: validar toda entrada en el servidor; nunca concatenar SQL; nunca MD5/SHA1 para contraseñas; tokens en cookies HTTP-only, secure, SameSite (nunca localStorage); JWT con expiración corta y algoritmo fijado en el verificador; nunca secretos en el código; nunca registrar contraseñas, tokens ni datos personales completos.

Detalles (headers, supply chain, MCP/plugins, checklists): `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
