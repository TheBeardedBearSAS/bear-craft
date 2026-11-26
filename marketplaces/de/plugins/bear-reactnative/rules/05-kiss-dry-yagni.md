# KISS, DRY, YAGNI

Verpflichtend.

- **KISS**: Methoden < 10 Zeilen (Grenze 20), zyklomatische Komplexität ≤ 10, Einrückung ≤ 3 Ebenen, ≤ 4 Parameter, Klassen ≤ 200 Zeilen. Early Returns, keine verschachtelten else, sprechende Namen, Komposition vor Vererbung.
- **DRY**: jede Geschäftsregel an genau einer Stelle. Dreierregel: nicht vor dem dritten Vorkommen abstrahieren. Duplikation ist in Tests und umgebungsspezifischer Konfiguration in Ordnung.
- **YAGNI**: nur bauen, was die Aufgabe jetzt braucht. Kein Feature, keine Option, Konfiguration oder Abstraktion „für später“. Keine vorzeitige Optimierung, kein Gold Plating, keine spekulative Allgemeinheit.

Details und Anti-Patterns: `${CLAUDE_PLUGIN_ROOT}/references/base/kiss-dry-yagni.md`
