import { describe, expect, it } from 'vitest'
import { diffProfile, displayName, profileCompleteness, studyProgress } from './profileInsights'
import { pickEditable } from './fieldPolicy'
import { SEED_STUDENT } from '@/services/mockData'

describe('studyProgress', () => {
  it('summiert ECTS abgeschlossener Semester und vergleicht mit dem Plan', () => {
    const p = studyProgress(SEED_STUDENT.study)
    expect(p.ectsAchieved).toBe(180)
    expect(p.ectsExpected).toBe(180)
    expect(p.ectsDelta).toBe(0)
    expect(p.ectsPercent).toBe(86)
    expect(p.ectsRemaining).toBe(30)
  })
})

describe('profileCompleteness', () => {
  it('listet fehlende optionale Angaben', () => {
    const c = profileCompleteness(SEED_STUDENT)
    expect(c.missing.map((m) => m.label)).toEqual(['Rufname', 'Telefon'])
    expect(c.percent).toBe(50)
  })
})

describe('diffProfile', () => {
  it('liefert nur geänderte Felder mit Label', () => {
    const before = pickEditable(SEED_STUDENT)
    const after = pickEditable(SEED_STUDENT)
    after.address.city = 'Potsdam'
    expect(diffProfile(before, after)).toEqual([
      { path: 'address.city', label: 'Ort', from: 'Berlin', to: 'Potsdam' },
    ])
  })
})

describe('displayName', () => {
  it('bevorzugt den Rufnamen', () => {
    expect(displayName({ firstName: 'Miriam', lastName: 'S', preferredName: 'Mira' })).toBe('Mira S')
  })
})
