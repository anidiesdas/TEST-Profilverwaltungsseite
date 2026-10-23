import type { ProfileUpdate, Student } from '@/domain'

/**
 * Vertrag für den Profil-Datenzugriff. Die UI kennt nur dieses Interface;
 * ein späteres `HttpStudentRepository` ersetzt den Mock ohne UI-Änderungen.
 *
 * Fehler werden als `AppError`-Unterklassen geworfen (siehe domain/errors).
 */
export interface StudentRepository {
  getProfile(): Promise<Student>
  /**
   * Speichert ausschließlich freigegebene Felder.
   * @param expectedVersion Version, auf der die Änderung basiert (Optimistic Concurrency).
   * @throws ConflictError wenn das Profil inzwischen eine andere Version hat.
   * @throws ValidationError bei ungültigen Feldwerten.
   * @throws ForbiddenFieldError bei nicht freigegebenen Feldern.
   */
  updateProfile(update: ProfileUpdate, expectedVersion: number): Promise<Student>
}
