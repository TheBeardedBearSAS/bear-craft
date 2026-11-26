# SOLID

Obrigatório para todo o código.

| Princípio | Regra |
|---|---|
| SRP | 1 classe = 1 responsabilidade. Métodos: meta < 10 linhas, limite 20. |
| OCP | Estender por interfaces/estratégias, não por modificação; sem switch/if sobre tipos. |
| LSP | Subtipos substituíveis; nunca reforçar as pré-condições. |
| ISP | Interfaces pequenas e específicas de cada cliente; sem NotImplementedException. |
| DIP | Depender de abstrações (interfaces no domínio); injeção por construtor. |

Camadas: Apresentação → Aplicação → Domínio ← Infraestrutura.

Detalhes e exemplos: `${CLAUDE_PLUGIN_ROOT}/references/base/solid-principles.md`
