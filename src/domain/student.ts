/**
 * Domänenmodell der Studierendenprofile.
 * Datumswerte sind ISO-8601-Strings; formatiert wird ausschließlich in der UI.
 */
export type ISODate = string

export type CountryCode = string

export interface Address {
  street: string
  houseNumber: string
  addressSupplement: string
  postalCode: string
  city: string
  country: CountryCode
}

export interface PersonalData {
  firstName: string
  lastName: string
  /** Rufname, der im Portal statt des Vornamens angezeigt wird. */
  preferredName: string
  pronouns: string
  /** Gesperrt – Änderung nur über den Studierendenservice. */
  birthDate: ISODate
  privateEmail: string
  phone: string
}

export type EnrollmentStatus = 'immatrikuliert' | 'beurlaubt' | 'exmatrikuliert'

export type SemesterStatus = 'abgeschlossen' | 'laufend' | 'geplant'

export interface SemesterRecord {
  /** z. B. "WiSe 2024/25" */
  term: string
  number: number
  ects: number
  status: SemesterStatus
}

export interface DegreeProgram {
  name: string
  degree: string
  faculty: string
  campus: string
  standardPeriod: number
  ectsTotal: number
}

export interface StudyInfo {
  matriculationNumber: string
  htwAccount: string
  htwEmail: string
  program: DegreeProgram
  enrollmentStatus: EnrollmentStatus
  enrolledSince: ISODate
  currentSemester: number
  semesterFeePaid: boolean
  semesters: readonly SemesterRecord[]
}

export interface Student {
  /** Technische ID – niemals editierbar. */
  id: string
  /** Für Optimistic Concurrency; wird bei jedem Speichern erhöht. */
  version: number
  updatedAt: ISODate
  personal: PersonalData
  address: Address
  study: StudyInfo
}
