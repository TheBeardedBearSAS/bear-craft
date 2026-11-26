# SOLID

Mandatory for all code.

| Principle | Rule |
|---|---|
| SRP | One class = one responsibility. Methods: target < 10 lines, limit 20. |
| OCP | Extend through interfaces/strategies, not by modifying; no switch/if on types. |
| LSP | Subtypes are substitutable; never strengthen preconditions. |
| ISP | Small client-specific interfaces; no NotImplementedException. |
| DIP | Depend on abstractions (interfaces in the domain); constructor injection. |

Layers: Presentation → Application → Domain ← Infrastructure.

Details and examples: `${CLAUDE_PLUGIN_ROOT}/references/base/solid-principles.md`
