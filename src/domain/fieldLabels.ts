import type { FieldPath } from './fieldPolicy'

/** Fachliche Bezeichnungen – genutzt für Formulare, Validierung und Änderungsvorschau. */
export const FIELD_LABELS: Record<FieldPath, string> = {
  'personal.firstName': 'Vorname',
  'personal.lastName': 'Nachname',
  'personal.preferredName': 'Rufname',
  'personal.pronouns': 'Pronomen',
  'personal.privateEmail': 'Private E-Mail',
  'personal.phone': 'Telefon',
  'address.street': 'Straße',
  'address.houseNumber': 'Hausnummer',
  'address.addressSupplement': 'Adresszusatz',
  'address.postalCode': 'PLZ',
  'address.city': 'Ort',
  'address.country': 'Land',
}
