# KISS, DRY, YAGNI

Obrigatórios.

- **KISS**: métodos < 10 linhas (limite 20), complexidade ciclomática ≤ 10, indentação ≤ 3 níveis, ≤ 4 parâmetros, classes ≤ 200 linhas. Early returns, sem else aninhados, nomes explícitos, composição em vez de herança.
- **DRY**: cada regra de negócio em um único lugar. Regra de três: não abstrair antes da terceira ocorrência. A duplicação é aceitável nos testes e na configuração por ambiente.
- **YAGNI**: construir apenas o que a tarefa precisa agora. Nenhuma funcionalidade, opção, configuração ou abstração «para depois». Sem otimização prematura, gold plating nem generalidade especulativa.

Detalhes e antipadrões: `${CLAUDE_PLUGIN_ROOT}/references/base/kiss-dry-yagni.md`
