# KISS, DRY, YAGNI

Obligatorios.

- **KISS**: métodos < 10 líneas (límite 20), complejidad ciclomática ≤ 10, indentación ≤ 3 niveles, ≤ 4 parámetros, clases ≤ 200 líneas. Early returns, sin else anidados, nombres explícitos, composición antes que herencia.
- **DRY**: cada regla de negocio en un único lugar. Regla de tres: no abstraer antes de la tercera aparición. La duplicación es aceptable en los tests y en la configuración por entorno.
- **YAGNI**: construir solo lo que la tarea necesita ahora. Ninguna funcionalidad, opción, configuración o abstracción «para más adelante». Sin optimización prematura, gold plating ni generalidad especulativa.

Detalles y antipatrones: `${CLAUDE_PLUGIN_ROOT}/references/base/kiss-dry-yagni.md`
