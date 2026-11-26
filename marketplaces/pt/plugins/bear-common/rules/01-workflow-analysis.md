# Análise antes do código

Antes de qualquer alteração (funcionalidade, correção, refatoração), analisar primeiro. Obrigatório.

1. **Compreender**: objetivo, critérios de aceitação, restrições, impacto no usuário.
2. **Analisar**: ler os arquivos envolvidos, seus dependentes, os testes e as migrações.
3. **Documentar**: arquivos impactados, breaking changes, migração de banco de dados, riscos + mitigações, testes TDD a escrever.
4. **Validar** conforme o risco:
   - Baixo (1 arquivo, < 1 h): prosseguir.
   - Médio (2 a 5 arquivos, migração, < 4 h): validação do usuário.
   - Alto (> 5 arquivos, breaking changes, arquitetura): plano detalhado + validação obrigatória.

Depois, implementar com TDD (regra 07). Nunca programar sem ter lido o código existente, suas dependências e seus testes.

Detalhes e templates: `${CLAUDE_PLUGIN_ROOT}/references/base/workflow-analysis.md`
