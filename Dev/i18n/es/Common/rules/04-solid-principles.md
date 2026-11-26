# SOLID

Obligatorio para todo el código.

| Principio | Regla |
|---|---|
| SRP | 1 clase = 1 responsabilidad. Métodos: objetivo < 10 líneas, límite 20. |
| OCP | Extender mediante interfaces/estrategias, no modificando; sin switch/if sobre tipos. |
| LSP | Subtipos sustituibles; nunca reforzar las precondiciones. |
| ISP | Interfaces pequeñas y propias de cada cliente; sin NotImplementedException. |
| DIP | Depender de abstracciones (interfaces en el dominio); inyección por constructor. |

Capas: Presentación → Aplicación → Dominio ← Infraestructura.

Detalles y ejemplos: `.claude/references/base/solid-principles.md`
