# Architektur – Profilverwaltung HTW-Portal (v2, nach Peer-Review)

> v1 wurde vom Senior Software Architect mit „Approve with changes“ bewertet. Alle MUST/SHOULD-Punkte sind eingearbeitet – siehe [ARCHITECTURE-REVIEW.md](./ARCHITECTURE-REVIEW.md). Die Abschnitte unten beschreiben den umgesetzten Stand.

## Kontext
- Fiktiver Auftrag der HTW Berlin: Profilseite für Studierende im (noch nicht existierenden) Hochschulportal.
- Kein Backend, keine DB vorhanden → Datenzugriff hinter einer Repository-Schnittstelle, aktuell mit Mock-Implementierung (localStorage + simulierte Latenz).
- Verbindlicher Stack: Vue 3 (Composition API, `<script setup>`), TypeScript (strict), Vite, reines CSS (Custom Properties, keine UI-Library).

## Leitprinzipien
1. **Trennung von UI, Zustand und Fachlogik**
   - `domain/` – reines TypeScript, framework-frei: Typen, Validierung, Feld-Policy (welche Felder editierbar sind), Profil-Vollständigkeit.
   - `services/` – Datenzugriff (Repository-Pattern). UI kennt nur das Interface.
   - `stores/` – Anwendungszustand: `createProfileStore(repository)` (Factory, `reactive`/`readonly`, kein Pinia) – bereitgestellt per `provide/inject` mit typisiertem `InjectionKey`.
   - `composables/` – UI-nahe Logik (Formular-Draft, Dirty-Tracking, Toasts, Shortcuts).
   - `components/` – Darstellung; erhalten Daten per Props, melden per Events.
2. **Kritische IDs sind nie editierbar** – Matrikelnummer, HTW-Account/-Mail, Studiengang, Status, Geburtsdatum. `EDITABLE_FIELDS as const` ist die einzige Quelle der Wahrheit; `ProfileUpdate` wird daraus abgeleitet. Der Mock (Server-Stellvertreter) lehnt unbekannte/gesperrte Schlüssel mit `ForbiddenFieldError` ab. **Hinweis:** Die Client-Whitelist ist UX, kein Sicherheitsmechanismus – ein echtes Backend muss sie selbst durchsetzen.
4. **Optimistic Concurrency** – `Student.version`; `updateProfile(update, expectedVersion)` wirft `ConflictError`, die UI bietet „neuesten Stand laden & eigene Änderungen behalten“ oder „verwerfen“.
5. **Typisierte Fehler** – `NetworkError`, `ValidationError` (feldweise), `ConflictError`, `NotFoundError`, `ForbiddenFieldError`; Lade- und Speicherfehler getrennt; bei Fehlern bleibt der Entwurf erhalten.
3. **Austauschbarkeit** – Wechsel auf echte REST-API = neue Klasse `HttpStudentRepository implements StudentRepository`, Umschaltung in `services/index.ts`.

## Ordnerstruktur
```
src/
├─ main.ts                       # einzige DI-Stelle: Repository → Store, Toaster
├─ App.vue                       # Shell: Header, Main, Footer, Toast-Region
├─ domain/                       # reines TypeScript, framework-frei
│  ├─ student.ts                 # Typen (ISO-Datumsstrings)
│  ├─ fieldPolicy.ts             # EDITABLE_FIELDS, ProfileUpdate, pickEditable, findForbiddenKeys
│  ├─ validation.ts              # normalizeUpdate, validateProfileUpdate (Client + „Server“)
│  ├─ profileInsights.ts         # Vollständigkeit, ECTS-Fortschritt, Diff, Anzeigename
│  ├─ errors.ts · countries.ts · fieldLabels.ts
│  └─ *.spec.ts
├─ services/
│  ├─ StudentRepository.ts       # Interface (Vertrag)
│  ├─ MockStudentRepository.ts   # localStorage (htw.portal.profile.v1), Latenz, Fehlerquote
│  └─ mockData.ts                # fiktiver Seed
├─ stores/profileStore.ts        # Factory + InjectionKey + useProfileStore()
├─ composables/                  # useProfileForm, useToasts, useUnsavedChangesGuard, useModShortcut
├─ components/
│  ├─ ui/                        # BaseButton, BaseField, DataItem, LockedField, SectionCard, BrandLogo, ToastHost, format.ts
│  └─ profile/                   # ProfileIntro, StudentIdCard, StudyProgressPanel, EctsProgress,
│                                # SemesterTimeline, PersonalDataSection, AddressSection,
│                                # StudySection, ProfileEditPanel, ChangePreview
├─ views/ProfileView.vue         # orchestriert Store, Formular und Sections
└─ styles/                       # tokens.css (CI + Dark Mode), base.css, layout.css, components.css
```

## Datenfluss
`ProfileView` → `profileStore.load()` → `repository.getProfile()` → State.
Bearbeiten: `useProfileForm(store)` erzeugt Draft → `normalizeUpdate` + `validateProfileUpdate` (live, Anzeige nach Blur/Submit) → `store.save(update)` → `repository.updateProfile(update, version)` (Whitelist, Validierung, Versionsprüfung) → State ersetzt → Toast. Fehler: State unverändert, Draft bleibt, Feldfehler des Servers werden ins Formular gemappt.

## Kreative Funktionen (umgesetzt)
- ECTS-Fortschrittsring + Semester-Zeitstrahl
- Profil-Vollständigkeit mit Hinweisen
- Änderungsvorschau (Diff alt → neu) vor dem Speichern
- Gesperrte Felder mit Schloss + Erklärung, wie sie geändert werden können
- Bevorzugter Name & Pronomen (inklusiv)
- Ungespeicherte-Änderungen-Schutz (`beforeunload` + Verwerfen-Bestätigung), Strg/Cmd+S
- Kontextsensitives Bearbeiten (Chips „+ Telefon ergänzen“ springen direkt ins Feld)
- Digitaler Studierendenausweis, Anschrift als Briefumschlag
- Dark Mode via `prefers-color-scheme`, `prefers-reduced-motion`

## Qualität
- `vue-tsc --noEmit` (strict), `vitest` für domain/ und composables/
- Barrierefreiheit: semantisches HTML, Labels, `aria-live` für Status, Fokus-Management, Kontraste WCAG AA
