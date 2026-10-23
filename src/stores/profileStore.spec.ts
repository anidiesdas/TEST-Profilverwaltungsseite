import { describe, expect, it } from 'vitest'
import { ConflictError, NetworkError, pickEditable, type ProfileUpdate, type Student } from '@/domain'
import type { StudentRepository } from '@/services'
import { SEED_STUDENT } from '@/services/mockData'
import { createProfileStore } from './profileStore'

class FakeRepository implements StudentRepository {
  student: Student = structuredClone(SEED_STUDENT)
  nextError: Error | null = null
  calls = 0

  async getProfile() {
    if (this.nextError) throw this.nextError
    return structuredClone(this.student)
  }

  async updateProfile(update: ProfileUpdate, expectedVersion: number) {
    this.calls++
    if (this.nextError) throw this.nextError
    if (expectedVersion !== this.student.version) throw new ConflictError(this.student.version)
    this.student = {
      ...this.student,
      personal: { ...this.student.personal, ...update.personal },
      address: { ...this.student.address, ...update.address },
      version: this.student.version + 1,
    }
    return structuredClone(this.student)
  }
}

describe('profileStore', () => {
  it('lädt das Profil', async () => {
    const store = createProfileStore(new FakeRepository())
    await store.load()
    expect(store.state.loadStatus).toBe('ready')
    expect(store.state.student?.personal.firstName).toBe('Mira')
  })

  it('meldet Ladefehler getrennt vom Speicherfehler', async () => {
    const repo = new FakeRepository()
    repo.nextError = new NetworkError()
    const store = createProfileStore(repo)
    await store.load()
    expect(store.state.loadStatus).toBe('error')
    expect(store.state.loadError?.kind).toBe('network')
    expect(store.state.saveError).toBeNull()
  })

  it('übernimmt das gespeicherte Profil', async () => {
    const store = createProfileStore(new FakeRepository())
    await store.load()
    const update = pickEditable(store.state.student!)
    update.address.city = 'Potsdam'
    const result = await store.save(update)
    expect(result.ok).toBe(true)
    expect(store.state.student?.address.city).toBe('Potsdam')
    expect(store.state.student?.version).toBe(2)
  })

  it('lässt den Zustand bei Fehler unverändert', async () => {
    const repo = new FakeRepository()
    const store = createProfileStore(repo)
    await store.load()
    repo.nextError = new NetworkError()
    const update = pickEditable(store.state.student!)
    update.address.city = 'Potsdam'
    const result = await store.save(update)
    expect(result.ok).toBe(false)
    expect(store.state.student?.address.city).toBe('Berlin')
    expect(store.state.saveError?.kind).toBe('network')
  })

  it('blockiert parallele Speichervorgänge', async () => {
    const repo = new FakeRepository()
    const store = createProfileStore(repo)
    await store.load()
    const update = pickEditable(store.state.student!)
    const [a, b] = await Promise.all([store.save(update), store.save(update)])
    expect([a.ok, b.ok]).toEqual([true, false])
    expect(repo.calls).toBe(1)
  })
})
