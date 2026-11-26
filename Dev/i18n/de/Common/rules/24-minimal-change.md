# Minimale Änderung

Nur bauen, was die Aufgabe braucht. SOLID, TDD und die 80-%-Abdeckung der Regeln 04, 05 und 07 gelten weiterhin: Diese Regel begrenzt, WAS gebaut wird, nicht wie gut.

Vor dem Schreiben den betroffenen Code lesen und alles auflisten, was die Änderung erreichen muss: Aufrufer, Tests, Fixtures, Konfiguration, Exporte. Das ist der Umfang; zusätzliche Features gehören nicht dazu.

Die erste Option wählen, die vollständig funktioniert:
1. Nicht verlangt? Weglassen und in einer Zeile erwähnen.
2. Schon im Code vorhanden (Helper, Komponente, Service)? Wiederverwenden wie der umgebende Code.
3. Standardbibliothek oder Plattformfunktion? Verwenden.
4. Bereits installierte Abhängigkeit? Verwenden. Nie eine neue Abhängigkeit für ein paar Zeilen.
5. Sonst der minimale funktionierende Code, innerhalb der Projektarchitektur.

- Alles fertigstellen, was die Änderung bricht: Aufrufer, Tests, Fixtures, umbenannte Felder.
- Bugfix: zuerst alle Aufrufer finden, dann die Ursache einmal beheben.
- Eine bewusste Grenze bekommt einen Kommentar: `shortcut: <Grenze>, <wann verbessern>`.
- Nie kürzen: Validierung an Vertrauensgrenzen, Fehlerbehandlung gegen Datenverlust, Sicherheit, Barrierefreiheit, von Regel 07 verlangte Tests.

Jede Antwort mit ein oder zwei Zeilen beenden: was weggelassen oder nicht geprüft wurde und jedes Risiko, das der Nutzer kennen muss.

Details und Beispiele: `.claude/references/base/minimal-change.md`
