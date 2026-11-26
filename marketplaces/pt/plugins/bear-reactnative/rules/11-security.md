# Segurança

Prioridade absoluta. Referência: OWASP Top 10:2025.

| # | Ameaça | Defesa |
|---|---|---|
| A01 | Broken Access Control (inclui SSRF) | Verificar permissões em cada requisição, negar por padrão |
| A02 | Security Misconfiguration | Hardening, erros genéricos em produção |
| A03 | Software Supply Chain Failures | Dependências fixadas e auditadas; SBOM; artefatos assinados |
| A04 | Cryptographic Failures | TLS 1.3, Argon2id para senhas, segredos em um vault |
| A05 | Injection | Consultas parametrizadas, validação |
| A06 | Insecure Design | Threat modeling, rate limiting |
| A07 | Authentication Failures | MFA, proteção contra força bruta, invalidar sessões no logout |
| A08 | Software or Data Integrity Failures | Verificar assinaturas/checksums, CI/CD seguro |
| A09 | Security Logging and Alerting Failures | Registrar eventos de segurança, alertar sobre anomalias |
| A10 | Mishandling of Exceptional Conditions | Registrar os erros, nunca expor stack traces |

Inegociável: validar toda entrada no servidor; nunca concatenar SQL; nunca MD5/SHA1 para senhas; tokens em cookies HTTP-only, secure, SameSite (nunca localStorage); JWT com expiração curta e algoritmo fixado no verificador; nunca segredos no código; nunca registrar senhas, tokens ou dados pessoais completos.

Detalhes (headers, supply chain, MCP/plugins, checklists): `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
