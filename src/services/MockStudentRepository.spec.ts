import { beforeEach, describe, expect, it } from 'vitest'
import { ConflictError, ForbiddenFieldError, NetworkError, pickEditable, ValidationError, type ProfileUpdate } from '@/domain'
import { MockStudentRepository, STORAGE_KEY, type KeyValueStorage } from './MockStudentRepository'

class MemoryStorage implements KeyValueStorage {
  data = new Map<string, string>()
  getItem(key: string) {
    return this.data.get(key) ?? null
  }
  setItem(key: string, value: string) {
    this.data.set(key, value)
  }
}

let storage: MemoryStorage
let repo: MockStudentRepository

beforeEach(() => {
  storage = new MemoryStorage()
  repo = new MockStudentRepository({ storage })
})

describe('MockStudentRepository', () => {
  it('liefert den Seed, wenn nichts gespeichert ist', async () => {
    expect((await repo.getProfile()).personal.firstName).toBe('Mira')
  })

  it('fällt bei korrupten Daten auf den Seed zurück', async () => {
    storage.setItem(STORAGE_KEY, '{kaputt')
    expect((await repo.getProfile()).version).toBe(1)
  })

  it('speichert normalisiert und erhöht die Version', async () => {
    const student = await repo.getProfile()
    const update = pickEditable(student)
    update.address.city = '  Potsdam '
    const saved = await repo.updateProfile(update, student.version)
    expect(saved.version).toBe(2)
    expect(saved.address.city).toBe('Potsdam')
    expect(saved.study.matriculationNumber).toBe(student.study.matriculationNumber)
    expect((await repo.getProfile()).address.city).toBe('Potsdam')
  })

  it('erkennt Versionskonflikte', async () => {
    const student = await repo.getProfile()
    await repo.updateProfile(pickEditable(student), student.version)
    await expect(repo.updateProfile(pickEditable(student), student.version)).rejects.toBeInstanceOf(ConflictError)
  })

  it('lehnt nicht freigegebene Felder ab', async () => {
    const student = await repo.getProfile()
    const payload = { ...pickEditable(student), study: { matriculationNumber: '0000001' } } as unknown as ProfileUpdate
    await expect(repo.updateProfile(payload, 1)).rejects.toBeInstanceOf(ForbiddenFieldError)
  })

  it('validiert serverseitig', async () => {
    const student = await repo.getProfile()
    const update = pickEditable(student)
    update.address.postalCode = 'abc'
    await expect(repo.updateProfile(update, 1)).rejects.toBeInstanceOf(ValidationError)
  })

  it('simuliert Netzwerkfehler', async () => {
    const flaky = new MockStudentRepository({ storage, failureRate: 1 })
    await expect(flaky.getProfile()).rejects.toBeInstanceOf(NetworkError)
  })
})
