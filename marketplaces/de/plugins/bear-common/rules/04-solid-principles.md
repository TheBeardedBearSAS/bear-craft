# SOLID

Verpflichtend für den gesamten Code.

| Prinzip | Regel |
|---|---|
| SRP | 1 Klasse = 1 Verantwortung. Methoden: Ziel < 10 Zeilen, Grenze 20. |
| OCP | Über Interfaces/Strategien erweitern, nicht durch Ändern; kein switch/if auf Typen. |
| LSP | Subtypen sind austauschbar; Vorbedingungen nie verschärfen. |
| ISP | Kleine, clientspezifische Interfaces; keine NotImplementedException. |
| DIP | Von Abstraktionen abhängen (Interfaces in der Domäne); Konstruktorinjektion. |

Schichten: Präsentation → Anwendung → Domäne ← Infrastruktur.

Details und Beispiele: `${CLAUDE_PLUGIN_ROOT}/references/base/solid-principles.md`
