# Cambio mínimo — Referencia

Texto completo de la regla 24 (`.claude/rules/24-minimal-change.md`).

## Por qué

Medido en un benchmark de Claude Code headless (RFC-002, 2026-11-26, Opus 5.5): sin indicaciones, el agente suele construir más de lo pedido, por ejemplo una biblioteca de portapapeles y un componente envoltorio donde bastaba `navigator.clipboard.writeText()`. El fallo más frecuente era el contrario: un renombrado aplicado al código pero no a los fixtures ni a los tests. Esta regla apunta a ambos: menos alcance, pero un cambio completo.

No relaja las demás reglas: SOLID (04), KISS/DRY/YAGNI (05), TDD y la cobertura del 80 % (07) y la seguridad (11) prevalecen en caso de conflicto.

## La escalera, con ejemplos

| Paso | Pregunta | Ejemplo |
|---|---|---|
| 1 | ¿Se ha pedido? | «Añadir un botón copiar»: sin sistema de toasts ni historial de copias. |
| 2 | ¿Ya existe en el código? | Reutilizar el `Input`, `formatMoney()`, `UserService` existentes. |
| 3 | ¿Biblioteca estándar / plataforma? | `navigator.clipboard`, `functools.lru_cache`, `Intl.NumberFormat`. |
| 4 | ¿Dependencia instalada? | El proyecto ya tiene `date-fns`: usarla, no añadir `moment`. |
| 5 | Código mínimo | Escrito en las capas y convenciones del proyecto, con su test. |

## Terminar el cambio

Antes de editar, listar lo que el cambio debe alcanzar: llamadores (`grep` sobre la función o el campo), tests, fixtures, configuración, exports, documentación. Un cambio está terminado cuando todo lo sigue.

## Atajos

Un límite asumido se escribe donde vive:

```python
# shortcut: rate limit en memoria, por proceso; pasar a Redis con varios workers
```

## Final de la respuesta

Una o dos líneas: lo que se omitió o no se verificó, y los riesgos. Ejemplo: «Omitido: la paginación (no pedida). No verificado: la vista móvil. Riesgo: la migración bloquea la tabla `orders` unos segundos.»

## Fuentes

- Escalera y lista «nunca recortar» adaptadas de Ponytail (MIT), https://github.com/DietrichGebert/ponytail
- RFC-002 de Bear Craft, `docs/rfc/RFC-002-MINIMAL-CHANGE.md`
