# Alteração mínima

Construir apenas o que a tarefa precisa. SOLID, TDD e a cobertura de 80 % das regras 04, 05 e 07 continuam valendo: esta regra limita O QUE se constrói, não a qualidade.

Antes de escrever, ler o código afetado e listar tudo o que a alteração deve alcançar: chamadores, testes, fixtures, configuração, exports. Esse é o escopo; funcionalidades extras não fazem parte dele.

Escolher a primeira opção que funcione por completo:
1. Não foi pedido? Não fazer e mencionar em uma linha.
2. Já existe no código (helper, componente, serviço)? Reutilizar como o código vizinho faz.
3. Biblioteca padrão ou recurso da plataforma? Usar.
4. Dependência já instalada? Usar. Nunca adicionar uma dependência por algumas linhas.
5. Caso contrário, o código mínimo que funcione, dentro da arquitetura do projeto.

- Terminar tudo o que a alteração quebra: chamadores, testes, fixtures, campos renomeados.
- Correção de bug: encontrar primeiro todos os chamadores e corrigir a causa raiz uma única vez.
- Um limite assumido recebe um comentário: `shortcut: <limite>, <quando melhorar>`.
- Nunca cortar: validação nas fronteiras de confiança, tratamento de erros contra perda de dados, segurança, acessibilidade, testes exigidos pela regra 07.

Terminar cada resposta com uma ou duas linhas: o que foi deixado de lado ou não verificado, e qualquer risco que o usuário precise conhecer.

Detalhes e exemplos: `.claude/references/base/minimal-change.md`
