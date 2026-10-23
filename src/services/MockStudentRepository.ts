import {
  ConflictError,
  findForbiddenKeys,
  ForbiddenFieldError,
  hasErrors,
  NetworkError,
  normalizeUpdate,
  pickEditable,
  validateProfileUpdate,
  ValidationError,
  type ProfileUpdate,
  type Student,
} from '@/domain'
import { SEED_STUDENT } from './mockData'
import type { StudentRepository } from './StudentRepository'

export const STORAGE_KEY = 'htw.portal.profile.v1'

export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

export interface MockRepositoryOptions {
  storage: KeyValueStorage
  /** Simulierte Netzwerklatenz in ms. */
  latencyMs?: number
  /** Wahrscheinlichkeit (0–1) für einen simulierten Netzwerkfehler. */
  failureRate?: number
  random?: () => number
  now?: () => Date
}

function isStudent(value: unknown): value is Student {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Partial<Student>
  return (
    typeof v.id === 'string' &&
    typeof v.version === 'number' &&
    typeof v.personal?.firstName === 'string' &&
    typeof v.address?.street === 'string' &&
    typeof v.study?.matriculationNumber === 'string' &&
    Array.isArray(v.study?.semesters)
  )
}

const clone = <T>(value: T): T => structuredClone(value)

/**
 * Stellvertreter für das künftige Backend. Verhält sich wie ein Server:
 * Whitelist-Prüfung, Normalisierung, Validierung, Versionsprüfung.
 */
export class MockStudentRepository implements StudentRepository {
  private readonly latencyMs: number
  private readonly failureRate: number
  private readonly random: () => number
  private readonly now: () => Date

  constructor(private readonly options: MockRepositoryOptions) {
    this.latencyMs = options.latencyMs ?? 0
    this.failureRate = options.failureRate ?? 0
    this.random = options.random ?? Math.random
    this.now = options.now ?? (() => new Date())
  }

  async getProfile(): Promise<Student> {
    await this.simulateNetwork()
    return clone(this.read())
  }

  async updateProfile(update: ProfileUpdate, expectedVersion: number): Promise<Student> {
    await this.simulateNetwork()

    const forbidden = findForbiddenKeys(update)
    if (forbidden.length) throw new ForbiddenFieldError(forbidden)

    const current = this.read()
    if (current.version !== expectedVersion) throw new ConflictError(current.version)

    const normalized = normalizeUpdate(pickEditable(update))
    const errors = validateProfileUpdate(normalized)
    if (hasErrors(errors)) throw new ValidationError(errors)

    const next: Student = {
      ...current,
      version: current.version + 1,
      updatedAt: this.now().toISOString(),
      personal: { ...current.personal, ...normalized.personal },
      address: { ...current.address, ...normalized.address },
    }
    this.options.storage.setItem(STORAGE_KEY, JSON.stringify(next))
    return clone(next)
  }

  private read(): Student {
    const raw = this.options.storage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw)
        if (isStudent(parsed)) return parsed
      } catch {
        // korrupte Daten → Fallback auf Seed
      }
    }
    return clone(SEED_STUDENT)
  }

  private async simulateNetwork(): Promise<void> {
    if (this.latencyMs > 0) await new Promise((resolve) => setTimeout(resolve, this.latencyMs))
    if (this.random() < this.failureRate) throw new NetworkError()
  }
}
