# Protocolo de revisão

Compartilhado pelos revisores de stack (agentes `*-reviewer`) e pelas revisões de código. Aditivo: cada revisor mantém sua escala de 100 pontos e seu formato de relatório.

1. **Ler além do diff.** Para cada função, campo, rota, evento ou export alterado, buscar com Grep seus chamadores e imports, e lê-los. Uma renomeação ou um valor de retorno alterado quebra, na maioria das vezes, um arquivo que o diff não mostra.
2. **Verificar, nesta ordem:** bugs e chamadores quebrados; segurança (regra 11); comportamento sob carga real (consultas N+1, laços ou listas sem limite, paginação ausente, timeouts); lógica arriscada sem teste (regra 07); caminhos lentos; código desnecessário (regra 24).
3. **Redigir cada achado assim:** localização (`arquivo:linha`) · o que o código faz · o que dá errado (uma entrada concreta e o resultado errado) · a correção · o risco se for ignorado.
4. **Classificar:** *Corrigir* (resultado errado, falha, perda de dados, brecha de segurança) · *Convém corrigir* · *Opcional*. Listar primeiro os *Corrigir* e escrever «nenhum» se não houver.
5. **Ignorar** o que linters e formatadores já impõem.
