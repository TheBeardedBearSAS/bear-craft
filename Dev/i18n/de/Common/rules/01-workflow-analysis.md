# Analyse vor dem Code

Vor jeder Änderung (Feature, Fix, Refactoring) zuerst analysieren. Verpflichtend.

1. **Verstehen**: Ziel, Akzeptanzkriterien, Einschränkungen, Auswirkungen auf Nutzer.
2. **Analysieren**: betroffene Dateien, ihre Abhängigen, Tests und Migrationen lesen.
3. **Dokumentieren**: betroffene Dateien, Breaking Changes, Datenbankmigration, Risiken + Gegenmaßnahmen, zu schreibende TDD-Tests.
4. **Validieren** je nach Risiko:
   - Niedrig (1 Datei, < 1 h): umsetzen.
   - Mittel (2 bis 5 Dateien, Migration, < 4 h): Freigabe durch den Nutzer.
   - Hoch (> 5 Dateien, Breaking Changes, Architektur): detaillierter Plan + verpflichtende Freigabe.

Danach mit TDD umsetzen (Regel 07). Nie Code schreiben, ohne den bestehenden Code, seine Abhängigkeiten und seine Tests gelesen zu haben.

Details und Vorlagen: `.claude/references/base/workflow-analysis.md`
