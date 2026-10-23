import { isKnownCountry } from './countries'
import { EDITABLE_FIELDS, type FieldPath, type ProfileUpdate } from './fieldPolicy'

export type FieldErrors = Partial<Record<FieldPath, string>>

const NAME_PATTERN = /^\p{L}[\p{L}\p{M}' .-]*$/u
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[0-9][0-9 ()/-]{4,22}$/
const DE_POSTAL_CODE = /^\d{5}$/
const GENERIC_POSTAL_CODE = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/
const HOUSE_NUMBER = /^[0-9A-Za-z][0-9A-Za-z /-]{0,9}$/

const collapse = (value: string) => value.trim().replace(/\s+/g, ' ')

/** Vereinheitlicht Eingaben vor Validierung und Speicherung (Client und Server). */
export function normalizeUpdate(update: ProfileUpdate): ProfileUpdate {
  const personal = { ...update.personal }
  const address = { ...update.address }
  for (const key of EDITABLE_FIELDS.personal) personal[key] = collapse(personal[key] ?? '')
  for (const key of EDITABLE_FIELDS.address) address[key] = collapse(address[key] ?? '')
  personal.privateEmail = personal.privateEmail.toLowerCase()
  address.country = address.country.toUpperCase()
  if (address.country === 'DE') address.postalCode = address.postalCode.replace(/\s/g, '')
  return { personal, address }
}

function requireText(value: string, label: string, max: number): string | undefined {
  if (!value) return `${label} ist ein Pflichtfeld.`
  if (value.length > max) return `${label} darf höchstens ${max} Zeichen lang sein.`
  return undefined
}

function nameRule(value: string, label: string, required: boolean): string | undefined {
  if (!value) return required ? `${label} ist ein Pflichtfeld.` : undefined
  if (value.length > 60) return `${label} darf höchstens 60 Zeichen lang sein.`
  if (!NAME_PATTERN.test(value)) return `${label} darf nur Buchstaben, Leerzeichen, Bindestrich und Apostroph enthalten.`
  return undefined
}

/**
 * Validiert ein (normalisiertes) Update. Leeres Objekt = gültig.
 * Wird identisch im Client und im Repository (Server-Stellvertreter) ausgeführt.
 */
export function validateProfileUpdate(update: ProfileUpdate): FieldErrors {
  const { personal: p, address: a } = update
  const errors: FieldErrors = {}
  const set = (path: FieldPath, message: string | undefined) => {
    if (message) errors[path] = message
  }

  set('personal.firstName', nameRule(p.firstName, 'Vorname', true))
  set('personal.lastName', nameRule(p.lastName, 'Nachname', true))
  set('personal.preferredName', nameRule(p.preferredName, 'Rufname', false))
  if (p.pronouns.length > 30) set('personal.pronouns', 'Pronomen dürfen höchstens 30 Zeichen lang sein.')
  if (p.privateEmail && !EMAIL_PATTERN.test(p.privateEmail)) {
    set('personal.privateEmail', 'Bitte gib eine gültige E-Mail-Adresse an, z. B. name@beispiel.de.')
  }
  if (p.privateEmail.endsWith('@htw-berlin.de')) {
    set('personal.privateEmail', 'Deine HTW-Adresse ist bereits hinterlegt – bitte eine private Adresse angeben.')
  }
  if (p.phone && !PHONE_PATTERN.test(p.phone)) {
    set('personal.phone', 'Bitte nur Ziffern, Leerzeichen, +, -, / oder Klammern verwenden.')
  }

  set('address.street', requireText(a.street, 'Straße', 80))
  if (!a.houseNumber) set('address.houseNumber', 'Hausnummer fehlt.')
  else if (!HOUSE_NUMBER.test(a.houseNumber)) set('address.houseNumber', 'Ungültige Hausnummer.')
  if (a.addressSupplement.length > 60) set('address.addressSupplement', 'Höchstens 60 Zeichen.')
  set('address.city', requireText(a.city, 'Ort', 60))
  if (!isKnownCountry(a.country)) set('address.country', 'Bitte ein Land aus der Liste wählen.')

  if (!a.postalCode) set('address.postalCode', 'PLZ fehlt.')
  else if (a.country === 'DE' && !DE_POSTAL_CODE.test(a.postalCode)) {
    set('address.postalCode', 'Deutsche PLZ haben 5 Ziffern.')
  } else if (a.country !== 'DE' && !GENERIC_POSTAL_CODE.test(a.postalCode)) {
    set('address.postalCode', 'Ungültige Postleitzahl.')
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
