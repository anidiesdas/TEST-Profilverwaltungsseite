import { describe, expect, it } from 'vitest'
import { findForbiddenKeys, pickEditable } from './fieldPolicy'
import { SEED_STUDENT } from '@/services/mockData'

describe('pickEditable', () => {
  it('enthält keine kritischen IDs', () => {
    const picked = pickEditable(SEED_STUDENT) as unknown as Record<string, Record<string, unknown>>
    expect(Object.keys(picked)).toEqual(['personal', 'address'])
    expect(picked.personal).not.toHaveProperty('birthDate')
    expect(picked).not.toHaveProperty('study')
    expect(picked).not.toHaveProperty('id')
  })
})

describe('findForbiddenKeys', () => {
  it('akzeptiert reine Whitelist-Payloads', () => {
    expect(findForbiddenKeys(pickEditable(SEED_STUDENT))).toEqual([])
  })

  it('meldet verbotene Sektionen und verschachtelte Felder', () => {
    const payload = {
      ...pickEditable(SEED_STUDENT),
      study: { matriculationNumber: '1' },
      personal: { firstName: 'A', birthDate: '2000-01-01' },
    }
    expect(findForbiddenKeys(payload)).toEqual(expect.arrayContaining(['study', 'personal.birthDate']))
  })
})
