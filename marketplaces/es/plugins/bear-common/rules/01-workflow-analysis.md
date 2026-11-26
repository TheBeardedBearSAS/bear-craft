# Análisis antes del código

Antes de cualquier cambio (funcionalidad, corrección, refactorización), analizar primero. Obligatorio.

1. **Comprender**: objetivo, criterios de aceptación, restricciones, impacto en el usuario.
2. **Analizar**: leer los archivos implicados, sus dependientes, los tests y las migraciones.
3. **Documentar**: archivos afectados, breaking changes, migración de base de datos, riesgos + mitigaciones, tests TDD a escribir.
4. **Validar** según el riesgo:
   - Bajo (1 archivo, < 1 h): proceder.
   - Medio (2 a 5 archivos, migración, < 4 h): validación del usuario.
   - Alto (> 5 archivos, breaking changes, arquitectura): plan detallado + validación obligatoria.

Después, implementar con TDD (regla 07). Nunca programar sin haber leído el código existente, sus dependencias y sus tests.

Detalles y plantillas: `${CLAUDE_PLUGIN_ROOT}/references/base/workflow-analysis.md`
