# Cambio mínimo

Construir solo lo que la tarea necesita. SOLID, TDD y la cobertura del 80 % de las reglas 04, 05 y 07 siguen aplicándose: esta regla limita QUÉ se construye, no su calidad.

Antes de escribir, leer el código afectado y listar todo lo que el cambio debe alcanzar: llamadores, tests, fixtures, configuración, exports. Ese es el alcance; las funcionalidades extra no lo son.

Tomar la primera opción que funcione por completo:
1. ¿No se ha pedido? No hacerlo y mencionarlo en una línea.
2. ¿Ya existe en el código (helper, componente, servicio)? Reutilizarlo como lo hace el código vecino.
3. ¿Biblioteca estándar o funcionalidad de la plataforma? Usarla.
4. ¿Dependencia ya instalada? Usarla. Nunca añadir una dependencia por unas pocas líneas.
5. Si no, el código mínimo que funcione, dentro de la arquitectura del proyecto.

- Terminar todo lo que el cambio rompe: llamadores, tests, fixtures, campos renombrados.
- Corrección de bug: encontrar primero todos los llamadores y corregir la causa raíz una sola vez.
- Un límite asumido lleva un comentario: `shortcut: <límite>, <cuándo mejorarlo>`.
- Nunca recortar: validación en las fronteras de confianza, manejo de errores contra la pérdida de datos, seguridad, accesibilidad, tests exigidos por la regla 07.

Terminar cada respuesta con una o dos líneas: lo que se omitió o no se verificó, y cualquier riesgo que el usuario deba conocer.

Detalles y ejemplos: `.claude/references/base/minimal-change.md`
