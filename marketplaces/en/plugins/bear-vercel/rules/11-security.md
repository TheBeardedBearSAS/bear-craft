# Security

Absolute priority. Reference: OWASP Top 10:2025.

| # | Threat | Defense |
|---|---|---|
| A01 | Broken Access Control (incl. SSRF) | Check permissions on every request, deny by default |
| A02 | Security Misconfiguration | Hardening, generic errors in production |
| A03 | Software Supply Chain Failures | Pinned, audited dependencies; SBOM; signed artifacts |
| A04 | Cryptographic Failures | TLS 1.3, Argon2id for passwords, secrets in a vault |
| A05 | Injection | Parameterized queries, validation |
| A06 | Insecure Design | Threat modeling, rate limiting |
| A07 | Authentication Failures | MFA, brute-force protection, invalidate sessions on logout |
| A08 | Software or Data Integrity Failures | Verify signatures/checksums, secure CI/CD |
| A09 | Logging and Alerting Failures | Log security events, alert on anomalies |
| A10 | Mishandling of Exceptional Conditions | Log errors, never expose stack traces |

Non-negotiable: validate all input server-side; never concatenate SQL; never MD5/SHA1 for passwords; tokens in HTTP-only, secure, SameSite cookies (never localStorage); JWT with short expiry and the algorithm pinned on the verifier; secrets never in code; never log passwords, tokens or full personal data.

Passwords: Argon2id (OWASP minimum 19 MiB, t=2, p=1; here 128 MiB, t≥3, p=1); bcrypt only as a legacy fallback (cost ≥ 12); minimum 15 characters (8 within MFA), accept ≥ 64, block common/breached passwords. Sessions expire after 15-30 min of inactivity. JWT: 15 min access tokens, refresh tokens ≤ 7 days stored securely, never HS256 with a weak secret. Mandatory headers: CSP, X-Content-Type-Options nosniff, X-Frame-Options DENY, HSTS, strict Referrer-Policy, COOP/COEP/CORP, Permissions-Policy.

Details (headers, supply chain, MCP/plugins, checklists): `${CLAUDE_PLUGIN_ROOT}/references/base/security.md`
