# Protocolo de revisión

Compartido por los revisores de stack (agentes `*-reviewer`) y las revisiones de código. Aditivo: cada revisor conserva su escala de 100 puntos y su formato de informe.

1. **Leer más allá del diff.** Para cada función, campo, ruta, evento o export modificado, buscar con Grep sus llamadores e imports, y leerlos. Un renombrado o un valor de retorno modificado suele romper un archivo que el diff no muestra.
2. **Verificar, en este orden:** bugs y llamadores rotos; seguridad (regla 11); comportamiento bajo carga real (consultas N+1, bucles o listas sin límite, paginación ausente, timeouts); lógica arriesgada sin test (regla 07); rutas lentas; código innecesario (regla 24).
3. **Redactar cada hallazgo así:** ubicación (`archivo:línea`) · qué hace el código · qué falla (una entrada concreta y el resultado erróneo) · la corrección · el riesgo si se omite.
4. **Clasificar:** *Corregir* (resultado erróneo, caída, pérdida de datos, fallo de seguridad) · *Conviene corregir* · *Opcional*. Listar primero los *Corregir* y escribir «ninguno» si no hay.
5. **Omitir** lo que los linters y formateadores ya imponen.
