import type { Address, PersonalData, Student } from './student'

/**
 * Single Source of Truth für bearbeitbare Felder.
 *
 * Wichtig: Diese Whitelist im Client ist UX (sie bestimmt, was angeboten und
 * gesendet wird) – kein Sicherheitsmechanismus. Die verbindliche Durchsetzung
 * muss serverseitig erfolgen; der MockStudentRepository bildet das nach.
 */
export const EDITABLE_FIELDS = {
  personal: ['firstName', 'lastName', 'preferredName', 'pronouns', 'privateEmail', 'phone'],
  address: ['street', 'houseNumber', 'addressSupplement', 'postalCode', 'city', 'country'],
} as const

export type EditableSection = keyof typeof EDITABLE_FIELDS
export type EditablePersonalKey = (typeof EDITABLE_FIELDS.personal)[number]
export type EditableAddressKey = (typeof EDITABLE_FIELDS.address)[number]

export interface ProfileUpdate {
  personal: Pick<PersonalData, EditablePersonalKey>
  address: Pick<Address, EditableAddressKey>
}

export type FieldPath =
  | `personal.${EditablePersonalKey}`
  | `address.${EditableAddressKey}`

export const EDITABLE_PATHS: readonly FieldPath[] = [
  ...EDITABLE_FIELDS.personal.map((k) => `personal.${k}` as const),
  ...EDITABLE_FIELDS.address.map((k) => `address.${k}` as const),
]

function pickKeys<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) result[key] = source[key]
  return result
}

/** Extrahiert ausschließlich die freigegebenen Felder (tiefe Kopie primitiver Werte). */
export function pickEditable(source: Pick<Student, 'personal' | 'address'> | ProfileUpdate): ProfileUpdate {
  return {
    personal: pickKeys(source.personal as PersonalData, EDITABLE_FIELDS.personal),
    address: pickKeys(source.address as Address, EDITABLE_FIELDS.address),
  }
}

/**
 * Liefert alle Schlüssel eines beliebigen Payloads, die nicht auf der Whitelist
 * stehen (inkl. verschachtelter Pfade). Leeres Array = Payload ist zulässig.
 */
export function findForbiddenKeys(payload: unknown): string[] {
  if (typeof payload !== 'object' || payload === null) return ['<root>']
  const forbidden: string[] = []
  for (const [section, value] of Object.entries(payload)) {
    if (!(section in EDITABLE_FIELDS)) {
      forbidden.push(section)
      continue
    }
    const allowed = EDITABLE_FIELDS[section as EditableSection] as readonly string[]
    if (typeof value !== 'object' || value === null) {
      forbidden.push(section)
      continue
    }
    for (const key of Object.keys(value)) {
      if (!allowed.includes(key)) forbidden.push(`${section}.${key}`)
    }
  }
  return forbidden
}

export function getFieldValue(update: ProfileUpdate, path: FieldPath): string {
  const [section, key] = path.split('.') as [EditableSection, string]
  return (update[section] as Record<string, string>)[key] ?? ''
}
