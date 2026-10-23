import { FIELD_LABELS } from './fieldLabels'
import { EDITABLE_PATHS, getFieldValue, type FieldPath, type ProfileUpdate } from './fieldPolicy'
import type { Student, StudyInfo } from './student'

/** Optionale Angaben, die das Profil „vollständig“ machen. */
const COMPLETENESS_FIELDS: readonly FieldPath[] = [
  'personal.preferredName',
  'personal.pronouns',
  'personal.privateEmail',
  'personal.phone',
]

export interface Completeness {
  percent: number
  missing: { path: FieldPath; label: string }[]
}

export function profileCompleteness(student: Pick<Student, 'personal' | 'address'>): Completeness {
  const update = { personal: student.personal, address: student.address } as ProfileUpdate
  const missing = COMPLETENESS_FIELDS.filter((path) => !getFieldValue(update, path)).map((path) => ({
    path,
    label: FIELD_LABELS[path],
  }))
  const percent = Math.round(((COMPLETENESS_FIELDS.length - missing.length) / COMPLETENESS_FIELDS.length) * 100)
  return { percent, missing }
}

export interface StudyProgress {
  ectsAchieved: number
  ectsTotal: number
  ectsPercent: number
  ectsRemaining: number
  /** Erwartete ECTS nach abgeschlossenen Semestern (30 pro Semester). */
  ectsExpected: number
  /** Positiv = Vorsprung, negativ = Rückstand ggü. Regelstudienplan. */
  ectsDelta: number
  semestersRemaining: number
  withinStandardPeriod: boolean
}

export const ECTS_PER_SEMESTER = 30

export function studyProgress(study: StudyInfo): StudyProgress {
  const completed = study.semesters.filter((s) => s.status === 'abgeschlossen')
  const ectsAchieved = completed.reduce((sum, s) => sum + s.ects, 0)
  const { ectsTotal, standardPeriod } = study.program
  const ectsExpected = Math.min(completed.length * ECTS_PER_SEMESTER, ectsTotal)
  return {
    ectsAchieved,
    ectsTotal,
    ectsPercent: ectsTotal ? Math.min(100, Math.round((ectsAchieved / ectsTotal) * 100)) : 0,
    ectsRemaining: Math.max(0, ectsTotal - ectsAchieved),
    ectsExpected,
    ectsDelta: ectsAchieved - ectsExpected,
    semestersRemaining: Math.max(0, standardPeriod - study.currentSemester),
    withinStandardPeriod: study.currentSemester <= standardPeriod,
  }
}

export interface FieldChange {
  path: FieldPath
  label: string
  from: string
  to: string
}

/** Feldgenaue Differenz zweier Updates – Basis der Änderungsvorschau. */
export function diffProfile(before: ProfileUpdate, after: ProfileUpdate): FieldChange[] {
  return EDITABLE_PATHS.flatMap((path) => {
    const from = getFieldValue(before, path)
    const to = getFieldValue(after, path)
    return from === to ? [] : [{ path, label: FIELD_LABELS[path], from, to }]
  })
}

/** Anzeigename: Rufname hat Vorrang vor dem Vornamen. */
export function displayName(personal: Pick<Student['personal'], 'firstName' | 'lastName' | 'preferredName'>): string {
  return `${personal.preferredName || personal.firstName} ${personal.lastName}`.trim()
}

export function initials(personal: Pick<Student['personal'], 'firstName' | 'lastName' | 'preferredName'>): string {
  const first = (personal.preferredName || personal.firstName).charAt(0)
  return `${first}${personal.lastName.charAt(0)}`.toUpperCase()
}
