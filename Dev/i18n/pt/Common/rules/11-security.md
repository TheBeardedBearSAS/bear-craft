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

Senhas: Argon2id (mínimo OWASP 19 MiB, t=2, p=1; aqui 128 MiB, t≥3, p=1); bcrypt apenas como alternativa legacy (custo ≥ 12); mínimo 15 caracteres (8 dentro de um MFA), aceitar ≥ 64, bloquear senhas comuns/comprometidas. Sessões expiram após 15-30 min de inatividade. JWT: access token de 15 min, refresh token ≤ 7 dias armazenado com segurança, nunca HS256 com segredo fraco. Headers obrigatórios: CSP, X-Content-Type-Options nosniff, X-Frame-Options DENY, HSTS, Referrer-Policy estrita, COOP/COEP/CORP, Permissions-Policy.

Detalhes (headers, supply chain, MCP/plugins, checklists): `.claude/references/base/security.md`
