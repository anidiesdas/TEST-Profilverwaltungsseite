# UI/UX-Review & Designkonzept

**Rolle:** Senior UI/UX · **Grundlage:** funktionaler Stand (Commit „feat: Profilverwaltung …“), Screenshots Desktop 1360 px, Mobile 390 px
**Vorgabe:** Neues Designkonzept erlaubt, nur Logo und Farben gemäß HTW-CI.

## Befunde am funktionalen Stand

| # | Schwere | Befund | Maßnahme |
|---|---------|--------|----------|
| 1 | hoch | Logo wird im Header abgeschnitten („BERLI…“). | Wortmarke neu gesetzt (viewBox), auf hellem Grund platziert. |
| 2 | hoch | Hierarchie: Das Wichtigste (Studienfortschritt) steht ganz unten; der Hero wirkt wie jede andere Karte. | Neue Seitenarchitektur: Intro-Band → digitaler Ausweis + Studienfortschritt → Detailkarten. |
| 3 | hoch | Raster unausgewogen: „Persönliche Angaben“ ist eine lange Spalte, „Anschrift“ hat viel Leerraum, rechts bleibt ein Loch. | 12-Spalten-Raster mit bewusst unterschiedlichen Kartenbreiten (7/5), Daten zweispaltig. |
| 4 | mittel | Bearbeiten-Modal verdeckt den Kontext und hat lange Scrollwege; Felder im Raster springen (Hint verschiebt Nachbarfeld). | Seitliches Sheet (Drawer) statt Modal, auf Mobile Vollbild; `align-items: start`; Abschnitts-Sprungmarken. |
| 5 | mittel | „Bearbeiten“ in einer Karte öffnet immer oben im Formular. | Kontextsensitiv: Fokus springt auf den ersten Wert des angeklickten Abschnitts. |
| 6 | mittel | Vollständigkeits-Hinweis ist nur Text („Noch offen: …“). | Klickbare Chips „+ Telefon ergänzen“ öffnen den Editor direkt im richtigen Feld. |
| 7 | mittel | Änderungsvorschau kodiert alt/neu nur über Rot/Grün (Farbfehlsichtigkeit). | Zusätzliche Text-Labels „bisher“/„neu“ und Durchstreichung. |
| 8 | mittel | Gesperrte Felder: Schloss ohne erklärenden Text, „Kopieren“-Buttons wirken roh. | Einheitliche Kartenzone „Von der Hochschule verwaltet“ mit Erklärung + dezente Icon-Buttons mit Feedback. |
| 9 | mittel | Kein Dark Mode, keine Reduced-Motion-Unterstützung. | Token-basiertes Theme hell/dunkel, `prefers-reduced-motion` respektiert. |
| 10 | niedrig | Grün `#76B900` als Textfarbe auf Weiß hat nur ~2,3:1 Kontrast. | Grün als Flächen-/Akzentfarbe, für Text/Buttons abgedunkelte Stufe der CI-Farbe (AA ≥ 4,5:1). |

## Designkonzept „Campus-Ausweis“

- **Idee:** Das Profil *ist* der Ausweis. Oben steht ein digitaler Studierendenausweis in HTW-Grün – das vertraute Objekt aus dem Studienalltag wird zum Einstieg in die eigenen Daten.
- **Farben (CI):** HTW-Grün `#76B900` (Primär), Anthrazit `#3C3C3B` (Struktur/Text), Orange `#FF5F00` (Hinweise/Konflikte, sparsam). Abgeleitete Stufen nur für Barrierefreiheit.
- **Typografie:** Systemschrift (keine externen Requests, DSGVO-freundlich), Tabellenziffern für IDs/ECTS, klare Größenstufen 12/14/16/20/28/40.
- **Form:** großzügige Radien (Karten 20 px, Felder 12 px), feine Linien statt Schatten, Grün nur dort, wo es Bedeutung trägt (Fortschritt, primäre Aktion, Status).
- **Bewegung:** kurze, ruhige Übergänge (≤ 220 ms), Sheet gleitet von rechts, Ring füllt sich beim Laden; alles abschaltbar über `prefers-reduced-motion`.

## Barrierefreiheit (geprüft)
- Kontraste AA für Text und Bedienelemente, sichtbarer Fokusring in CI-Grün
- Native `<dialog>` (Fokusfalle, Esc), `aria-live` für Toasts, Fehlermeldungen per `aria-describedby`
- Tastaturbedienung vollständig, Skip-Link, semantische Landmarks und Überschriftenhierarchie
