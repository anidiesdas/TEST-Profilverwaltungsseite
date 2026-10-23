import type { Student } from '@/domain'

/** Fiktiver Seed-Datensatz – keine realen Personendaten. */
export const SEED_STUDENT: Student = {
  id: 'stu_7f3c2a',
  version: 1,
  updatedAt: '2026-09-28T10:14:00.000Z',
  personal: {
    firstName: 'Mira',
    lastName: 'Okonkwo-Schulz',
    preferredName: '',
    pronouns: 'sie/ihr',
    birthDate: '2003-04-17',
    privateEmail: 'mira.os@example.org',
    phone: '',
  },
  address: {
    street: 'Wilhelminenhofstraße',
    houseNumber: '42b',
    addressSupplement: 'WG, 3. OG',
    postalCode: '12459',
    city: 'Berlin',
    country: 'DE',
  },
  study: {
    matriculationNumber: '0587341',
    htwAccount: 's0587341',
    htwEmail: 'mira.okonkwo-schulz@student.htw-berlin.de',
    program: {
      name: 'Angewandte Informatik',
      degree: 'Bachelor of Science',
      faculty: 'Fachbereich 4 – Informatik, Kommunikation und Wirtschaft',
      campus: 'Campus Wilhelminenhof',
      standardPeriod: 7,
      ectsTotal: 210,
    },
    enrollmentStatus: 'immatrikuliert',
    enrolledSince: '2023-10-01',
    currentSemester: 7,
    semesterFeePaid: true,
    semesters: [
      { term: 'WiSe 2023/24', number: 1, ects: 30, status: 'abgeschlossen' },
      { term: 'SoSe 2024', number: 2, ects: 30, status: 'abgeschlossen' },
      { term: 'WiSe 2024/25', number: 3, ects: 25, status: 'abgeschlossen' },
      { term: 'SoSe 2025', number: 4, ects: 35, status: 'abgeschlossen' },
      { term: 'WiSe 2025/26', number: 5, ects: 30, status: 'abgeschlossen' },
      { term: 'SoSe 2026', number: 6, ects: 30, status: 'abgeschlossen' },
      { term: 'WiSe 2026/27', number: 7, ects: 0, status: 'laufend' },
    ],
  },
}
