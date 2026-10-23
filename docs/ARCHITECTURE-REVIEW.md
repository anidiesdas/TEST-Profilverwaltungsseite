# Peer-Review: Architekturentwurf v1

**Reviewer:** Senior Software Architect · **Urteil:** Approve with changes · **Status:** alle MUST/SHOULD-Punkte umgesetzt (siehe ARCHITECTURE.md v2)

| # | Prio | Forderung | Umsetzung |
|---|------|-----------|-----------|
| 1 | MUST | Store als Factory + `provide/inject` statt Modul-Singleton | `createProfileStore(repo)` + typisierter `ProfileStoreKey`; `useProfileStore()` wirft, wenn nicht bereitgestellt. Einzige DI-Stelle: `main.ts`. |
| 2 | MUST | Optimistic Concurrency | `Student.version`; `updateProfile(update, expectedVersion)`; Mock wirft `ConflictError`; UI bietet „Neu laden“ bzw. „Meine Änderungen erneut anwenden“. |
| 3 | MUST | Typisierte Fehler, klare Speicher-Semantik | `NetworkError`, `ValidationError` (feldweise), `ConflictError`, `NotFoundError`; getrennte `loadError`/`saveError`; Draft bleibt bei Fehler erhalten; Doppel-Submit gesperrt. |
| 4 | MUST | Whitelist ehrlich einordnen & schärfen | `EDITABLE_FIELDS as const` als Single Source of Truth, `ProfileUpdate` abgeleitet; Mock lehnt unbekannte Schlüssel ab. Dokumentiert: Client-Whitelist = UX, echte Durchsetzung serverseitig. |
| 5 | MUST | Validierung auch im Repository | Mock (= Server-Stellvertreter) führt `validateProfileUpdate` nach `normalize` aus; PLZ-Regel länderabhängig (DE 5-stellig, sonst generisch). |
| 6 | SHOULD | „Name bearbeiten“ fachlich klären | Lastenheft fordert Name editierbar → Vor-/Nachname editierbar, zusätzlich *bevorzugter Name* und Pronomen; Hinweis in UI, dass amtliche Namensänderungen für Zeugnisse beim Studierendenservice nachzuweisen sind. |
| 7 | SHOULD | localStorage versionieren, Lesen validieren | Schlüssel `htw.portal.profile.v1`, Strukturprüfung via Type-Guard, Fallback auf Seed. |
| 8 | SHOULD | Ordnerschnitt | `LockedField` → `ui/`; Tests co-located `*.spec.ts`; Store-Test mit Fake-Repository. |
| 9 | SHOULD | Datumsformat | ISO-Strings in Domain, Formatierung nur in `ui/format.ts`. |
| 10 | COULD | Extras nach MVP priorisieren | Reihenfolge übernommen; Akzeptanzkriterien in README. |
| 11 | COULD | Guard ohne Router | Nur `beforeunload` + Abbrechen-Bestätigung. |
| 12 | COULD | Keine Icon-Komponente | Inline-SVGs. |
| 13 | COULD | `ProfileView` behalten | Behalten für spätere Portal-Integration. |
