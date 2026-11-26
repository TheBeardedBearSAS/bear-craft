# Alteração mínima — Referência

Texto completo da regra 24 (`.claude/rules/24-minimal-change.md`).

## Por quê

Medido em um benchmark headless do Claude Code (RFC-002, 2026-11-26, Opus 5.5): sem orientação, o agente costuma construir mais do que o pedido, por exemplo uma biblioteca de área de transferência e um componente de encapsulamento onde bastava `navigator.clipboard.writeText()`. A falha mais frequente era a oposta: uma renomeação aplicada ao código, mas não às fixtures nem aos testes. Esta regra mira as duas: menos escopo, mas uma alteração completa.

Ela não flexibiliza as outras regras: SOLID (04), KISS/DRY/YAGNI (05), TDD e a cobertura de 80 % (07) e a segurança (11) prevalecem em caso de conflito.

## A escada, com exemplos

| Passo | Pergunta | Exemplo |
|---|---|---|
| 1 | Foi pedido? | «Adicionar um botão copiar»: sem sistema de toasts nem histórico de cópias. |
| 2 | Já existe no código? | Reutilizar o `Input`, `formatMoney()`, `UserService` existentes. |
| 3 | Biblioteca padrão / plataforma? | `navigator.clipboard`, `functools.lru_cache`, `Intl.NumberFormat`. |
| 4 | Dependência instalada? | O projeto já tem `date-fns`: usá-la, não adicionar `moment`. |
| 5 | Código mínimo | Escrito nas camadas e convenções do projeto, com seu teste. |

## Terminar a alteração

Antes de editar, listar o que a alteração deve alcançar: chamadores (`grep` na função ou no campo), testes, fixtures, configuração, exports, documentação. Uma alteração está terminada quando tudo acompanha.

## Atalhos

Um limite assumido é escrito onde ele vive:

```python
# shortcut: rate limit em memória, por processo; migrar para Redis com vários workers
```

## Fim da resposta

Uma ou duas linhas: o que foi deixado de lado ou não verificado, e os riscos. Exemplo: «Deixado de lado: a paginação (não pedida). Não verificado: a exibição mobile. Risco: a migração trava a tabela `orders` por alguns segundos.»

## Fontes

- Escada e lista «nunca cortar» adaptadas do Ponytail (MIT), https://github.com/DietrichGebert/ponytail
- RFC-002 do Bear Craft, `docs/rfc/RFC-002-MINIMAL-CHANGE.md`
