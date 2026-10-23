# Architektur – Profilverwaltung HTW-Portal (Entwurf v1, zur Review)

## Kontext
- Fiktiver Auftrag der HTW Berlin: Profilseite für Studierende im (noch nicht existierenden) Hochschulportal.
- Kein Backend, keine DB vorhanden → Datenzugriff hinter einer Repository-Schnittstelle, aktuell mit Mock-Implementierung (localStorage + simulierte Latenz).
- Verbindlicher Stack: Vue 3 (Composition API, `<script setup>`), TypeScript (strict), Vite, reines CSS (Custom Properties, keine UI-Library).

## Leitprinzipien
1. **Trennung von UI, Zustand und Fachlogik**
   - `domain/` – reines TypeScript, framework-frei: Typen, Validierung, Feld-Policy (welche Felder editierbar sind), Profil-Vollständigkeit.
   - `services/` – Datenzugriff (Repository-Pattern). UI kennt nur das Interface.
   - `stores/` – Anwendungszustand (reaktiver Store auf Basis von `reactive`/`readonly`, kein Pinia, um beim Pflicht-Stack zu bleiben).
   - `composables/` – UI-nahe Logik (Formular-Draft, Dirty-Tracking, Toasts, Shortcuts).
   - `components/` – Darstellung; erhalten Daten per Props, melden per Events.
2. **Kritische IDs sind nie editierbar** – Matrikelnummer, HTW-Kennung/-Mail, Studiengang, Immatrikulationsstatus, Geburtsdatum. Durchsetzung doppelt: (a) Domain-Typ `EditableProfile` enthält diese Felder nicht, (b) Repository-`update` akzeptiert nur `ProfileUpdate` und whitelisted Felder zur Laufzeit.
3. **Austauschbarkeit** – Wechsel auf echte REST-API = neue Klasse `HttpStudentRepository implements StudentRepository`, Umschaltung in `services/index.ts`.

## Ordnerstruktur
```
src/
├─ main.ts                    # Bootstrap, Store-Provider
├─ App.vue                    # Shell (Header, Layout, Toast-Region)
├─ domain/
│  ├─ student.ts              # Typen: Student, PersonalData, Address, StudyInfo, ProfileUpdate
│  ├─ fieldPolicy.ts          # EDITABLE_FIELDS (Whitelist), pickEditable()
│  ├─ validation.ts           # reine Validierungsregeln (PLZ, E-Mail, Telefon, Pflichtfelder)
│  └─ profileInsights.ts      # Vollständigkeit, ECTS-Fortschritt, Regelstudienzeit
├─ services/
│  ├─ StudentRepository.ts    # Interface
│  ├─ MockStudentRepository.ts# localStorage + Latenz + Fehlersimulation
│  ├─ mockData.ts             # Seed-Datensatz
│  └─ index.ts                # Factory/DI
├─ stores/
│  └─ profileStore.ts         # state: student, status (idle|loading|saving|error), load(), save()
├─ composables/
│  ├─ useProfileForm.ts       # Draft-Kopie, isDirty, errors, reset, submit
│  ├─ useToast.ts
│  └─ useUnsavedChangesGuard.ts
├─ components/
│  ├─ ui/                     # BaseButton, BaseField, BaseCard, StatusBadge, ToastHost, Icon
│  └─ profile/                # ProfileHero, PersonalDataSection, AddressSection,
│                             # StudySection, EctsProgress, SemesterTimeline,
│                             # ProfileEditPanel, LockedField
├─ views/
│  └─ ProfileView.vue         # Orchestriert Store + Sections
├─ styles/
│  ├─ tokens.css              # Design-Tokens (HTW-Farben, Spacing, Typo, Radius)
│  └─ base.css
└─ assets/brand/htw-logo.svg
tests/ (vitest)               # Domain- und Composable-Tests
```

## Datenfluss
`ProfileView` → `profileStore.load()` → `repository.getProfile()` → State.
Bearbeiten: `useProfileForm(store.student)` erzeugt Draft → Validierung über `domain/validation` → `store.save(pickEditable(draft))` → `repository.updateProfile()` → State ersetzt → Toast.

## Kreative Funktionen (Vorschlag)
- ECTS-Fortschrittsring + Semester-Zeitstrahl
- Profil-Vollständigkeit mit Hinweisen
- Änderungsvorschau (Diff alt → neu) vor dem Speichern
- Gesperrte Felder mit Schloss + Erklärung, wie sie geändert werden können
- Bevorzugter Name & Pronomen (inklusiv)
- Ungespeicherte-Änderungen-Schutz, Strg/Cmd+S
- Dark Mode via `prefers-color-scheme`

## Qualität
- `vue-tsc --noEmit` (strict), `vitest` für domain/ und composables/
- Barrierefreiheit: semantisches HTML, Labels, `aria-live` für Status, Fokus-Management, Kontraste WCAG AA
