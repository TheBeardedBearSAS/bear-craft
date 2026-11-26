# Minimale Änderung — Referenz

Volltext von Regel 24 (`.claude/rules/24-minimal-change.md`).

## Warum

Gemessen mit einem headless Claude-Code-Benchmark (RFC-002, 2026-11-26, Opus 5.5): Ohne Vorgabe baut der Agent oft mehr als verlangt, zum Beispiel eine Zwischenablage-Bibliothek samt Wrapper-Komponente, wo `navigator.clipboard.writeText()` gereicht hätte. Der häufigste Fehler war das Gegenteil: eine Umbenennung im Code, aber nicht in Fixtures und Tests. Diese Regel zielt auf beides: weniger Umfang, aber eine vollständige Änderung.

Sie lockert die anderen Regeln nicht: SOLID (04), KISS/DRY/YAGNI (05), TDD und die 80-%-Abdeckung (07) sowie Sicherheit (11) haben bei Konflikten Vorrang.

## Die Leiter, mit Beispielen

| Schritt | Frage | Beispiel |
|---|---|---|
| 1 | Wurde es verlangt? | „Einen Kopieren-Button hinzufügen“: kein Toast-System, kein Kopierverlauf. |
| 2 | Schon im Code vorhanden? | Das vorhandene `Input`, `formatMoney()`, `UserService` wiederverwenden. |
| 3 | Standardbibliothek / Plattform? | `navigator.clipboard`, `functools.lru_cache`, `Intl.NumberFormat`. |
| 4 | Installierte Abhängigkeit? | Das Projekt hat bereits `date-fns`: verwenden, nicht `moment` hinzufügen. |
| 5 | Minimaler Code | In den Schichten und Konventionen des Projekts, mit Test. |

## Die Änderung abschließen

Vor dem Bearbeiten auflisten, was die Änderung erreichen muss: Aufrufer (`grep` auf Funktion oder Feld), Tests, Fixtures, Konfiguration, Exporte, Dokumentation. Eine Änderung ist fertig, wenn alles nachgezogen ist.

## Abkürzungen

Eine bewusste Grenze wird dort notiert, wo sie lebt:

```python
# shortcut: Rate Limit im Speicher, pro Prozess; bei mehreren Workern auf Redis umstellen
```

## Antwortende

Ein bis zwei Zeilen: was weggelassen oder nicht geprüft wurde, und die Risiken. Beispiel: „Weggelassen: Paginierung (nicht verlangt). Nicht geprüft: mobile Ansicht. Risiko: Die Migration sperrt die Tabelle `orders` einige Sekunden.“

## Quellen

- Leiter und „Nie kürzen“-Liste nach Ponytail (MIT), https://github.com/DietrichGebert/ponytail
- Bear Craft RFC-002, `docs/rfc/RFC-002-MINIMAL-CHANGE.md`
