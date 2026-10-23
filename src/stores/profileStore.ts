import { inject, reactive, readonly, type InjectionKey } from 'vue'
import { toAppError, type AppError, type ProfileUpdate, type Student } from '@/domain'
import type { StudentRepository } from '@/services'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface ProfileState {
  student: Student | null
  loadStatus: LoadStatus
  loadError: AppError | null
  saving: boolean
  saveError: AppError | null
  lastSavedAt: Date | null
}

export type SaveResult = { ok: true; student: Student } | { ok: false; error: AppError }

/**
 * Anwendungszustand der Profilseite. Factory statt Singleton:
 * jede Instanz erhält ihr Repository explizit (testbar, austauschbar).
 */
export function createProfileStore(repository: StudentRepository) {
  const state = reactive<ProfileState>({
    student: null,
    loadStatus: 'idle',
    loadError: null,
    saving: false,
    saveError: null,
    lastSavedAt: null,
  })

  async function load(): Promise<void> {
    state.loadStatus = 'loading'
    state.loadError = null
    try {
      state.student = await repository.getProfile()
      state.loadStatus = 'ready'
    } catch (error) {
      state.loadError = toAppError(error)
      state.loadStatus = state.student ? 'ready' : 'error'
    }
  }

  /** Speichert ein Update. Bei Fehler bleibt `student` unverändert. */
  async function save(update: ProfileUpdate): Promise<SaveResult> {
    if (!state.student) return { ok: false, error: toAppError(new Error('Kein Profil geladen.')) }
    if (state.saving) return { ok: false, error: toAppError(new Error('Speichern läuft bereits.')) }

    state.saving = true
    state.saveError = null
    try {
      const student = await repository.updateProfile(update, state.student.version)
      state.student = student
      state.lastSavedAt = new Date()
      return { ok: true, student }
    } catch (error) {
      const appError = toAppError(error)
      state.saveError = appError
      return { ok: false, error: appError }
    } finally {
      state.saving = false
    }
  }

  function clearSaveError(): void {
    state.saveError = null
  }

  return { state: readonly(state), load, save, clearSaveError }
}

export type ProfileStore = ReturnType<typeof createProfileStore>

export const ProfileStoreKey: InjectionKey<ProfileStore> = Symbol('ProfileStore')

export function useProfileStore(): ProfileStore {
  const store = inject(ProfileStoreKey)
  if (!store) throw new Error('ProfileStore wurde nicht bereitgestellt (provide fehlt in main.ts).')
  return store
}
