export interface Country {
  code: string
  name: string
}

/** Auswahl gängiger Länder; erweiterbar, sobald ein Stammdatendienst existiert. */
export const COUNTRIES: readonly Country[] = [
  { code: 'DE', name: 'Deutschland' },
  { code: 'AT', name: 'Österreich' },
  { code: 'CH', name: 'Schweiz' },
  { code: 'PL', name: 'Polen' },
  { code: 'FR', name: 'Frankreich' },
  { code: 'NL', name: 'Niederlande' },
  { code: 'IT', name: 'Italien' },
  { code: 'ES', name: 'Spanien' },
  { code: 'TR', name: 'Türkei' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'GB', name: 'Vereinigtes Königreich' },
  { code: 'US', name: 'Vereinigte Staaten' },
]

export function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code
}

export function isKnownCountry(code: string): boolean {
  return COUNTRIES.some((c) => c.code === code)
}
