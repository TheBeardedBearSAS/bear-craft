# Review-Protokoll

Gemeinsam genutzt von den Stack-Reviewern (Agenten `*-reviewer`) und Code-Reviews. Additiv: Jeder Reviewer behält sein 100-Punkte-Raster und sein Berichtsformat.

1. **Über den Diff hinaus lesen.** Für jede geänderte Funktion, jedes Feld, jede Route, jedes Event oder jeden Export mit Grep die Aufrufer und Importe suchen und lesen. Eine Umbenennung oder ein geänderter Rückgabewert bricht meist eine Datei, die der Diff nicht zeigt.
2. **In dieser Reihenfolge prüfen:** Bugs und gebrochene Aufrufer; Sicherheit (Regel 11); Verhalten unter realer Last (N+1-Abfragen, unbegrenzte Schleifen oder Listen, fehlende Paginierung, Timeouts); riskante Logik ohne Test (Regel 07); langsame Pfade; unnötiger Code (Regel 24).
3. **Jeden Befund so formulieren:** Ort (`Datei:Zeile`) · was der Code tut · was schiefgeht (eine konkrete Eingabe und das falsche Ergebnis) · die Korrektur · das Risiko, wenn sie unterbleibt.
4. **Einstufen:** *Muss behoben werden* (falsches Ergebnis, Absturz, Datenverlust, Sicherheitslücke) · *Sollte behoben werden* · *Optional*. *Muss* zuerst auflisten und „keine“ schreiben, wenn es keine gibt.
5. **Weglassen,** was Linter und Formatter bereits erzwingen.
