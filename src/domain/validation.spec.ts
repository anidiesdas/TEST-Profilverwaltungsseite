import { describe, expect, it } from 'vitest'
import { pickEditable } from './fieldPolicy'
import { normalizeUpdate, validateProfileUpdate } from './validation'
import { SEED_STUDENT } from '@/services/mockData'

const valid = () => pickEditable(SEED_STUDENT)

describe('normalizeUpdate', () => {
  it('trimmt, fasst Leerzeichen zusammen und normalisiert E-Mail/Land', () => {
    const u = valid()
    u.personal.firstName = '  Mira   Lou '
    u.personal.privateEmail = ' Mira@Example.ORG '
    u.address.country = 'de'
    u.address.postalCode = '124 59'
    const n = normalizeUpdate(u)
    expect(n.personal.firstName).toBe('Mira Lou')
    expect(n.personal.privateEmail).toBe('mira@example.org')
    expect(n.address.country).toBe('DE')
    expect(n.address.postalCode).toBe('12459')
  })
})

describe('validateProfileUpdate', () => {
  it('akzeptiert den Seed-Datensatz', () => {
    expect(validateProfileUpdate(valid())).toEqual({})
  })

  it('verlangt Vor- und Nachname', () => {
    const u = valid()
    u.personal.firstName = ''
    u.personal.lastName = ''
    const errors = validateProfileUpdate(u)
    expect(errors['personal.firstName']).toBeDefined()
    expect(errors['personal.lastName']).toBeDefined()
  })

  it('erlaubt Namen mit Umlauten, Bindestrich und Apostroph', () => {
    const u = valid()
    u.personal.firstName = "Zoë-Anne"
    u.personal.lastName = "O'Brien Müller"
    expect(validateProfileUpdate(u)).toEqual({})
  })

  it('prüft deutsche PLZ streng, ausländische generisch', () => {
    const u = valid()
    u.address.postalCode = '1234'
    expect(validateProfileUpdate(u)['address.postalCode']).toMatch(/5 Ziffern/)
    u.address.country = 'GB'
    u.address.postalCode = 'SW1A 1AA'
    expect(validateProfileUpdate(u)['address.postalCode']).toBeUndefined()
  })

  it('lehnt HTW-Adresse als private E-Mail ab', () => {
    const u = valid()
    u.personal.privateEmail = 'x@htw-berlin.de'
    expect(validateProfileUpdate(u)['personal.privateEmail']).toBeDefined()
  })

  it('lehnt unbekannte Länder ab', () => {
    const u = valid()
    u.address.country = 'XX'
    expect(validateProfileUpdate(u)['address.country']).toBeDefined()
  })
})
