import { computed, inject, readonly, ref, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

/** Muss mit dem Inline-Skript in index.html übereinstimmen. */
export const THEME_STORAGE_KEY = 'htw.portal.theme'

const PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark']

export function isThemePreference(value: unknown): value is ThemePreference {
  return PREFERENCES.includes(value as ThemePreference)
}

export interface ThemeEnvironment {
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
  root: HTMLElement
  /** z. B. window.matchMedia('(prefers-color-scheme: dark)') */
  systemDark: Pick<MediaQueryList, 'matches' | 'addEventListener'>
}

export interface ThemeController {
  preference: Readonly<Ref<ThemePreference>>
  resolved: ComputedRef<ResolvedTheme>
  setPreference(preference: ThemePreference): void
}

/**
 * Theme-Wahl der Nutzenden. Standard ist „system“ (folgt dem Betriebssystem);
 * eine explizite Wahl wird im Browser gespeichert und über data-theme an <html> gesetzt.
 */
export function createThemeController(env: ThemeEnvironment): ThemeController {
  let stored: string | null = null
  try {
    stored = env.storage.getItem(THEME_STORAGE_KEY)
  } catch {
    // Storage blockiert (z. B. privater Modus) → Systemeinstellung
  }
  const preference = ref<ThemePreference>(isThemePreference(stored) ? stored : 'system')
  const systemIsDark = ref(env.systemDark.matches)
  env.systemDark.addEventListener('change', (event) => (systemIsDark.value = event.matches))

  const resolved = computed<ResolvedTheme>(() =>
    preference.value === 'system' ? (systemIsDark.value ? 'dark' : 'light') : preference.value,
  )

  function apply() {
    if (preference.value === 'system') delete env.root.dataset.theme
    else env.root.dataset.theme = preference.value
  }

  function setPreference(next: ThemePreference) {
    preference.value = next
    apply()
    try {
      if (next === 'system') env.storage.removeItem(THEME_STORAGE_KEY)
      else env.storage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Speichern nicht möglich → Wahl gilt nur für diese Sitzung
    }
  }

  apply()
  return { preference: readonly(preference), resolved, setPreference }
}

export const ThemeKey: InjectionKey<ThemeController> = Symbol('Theme')

export function useTheme(): ThemeController {
  const theme = inject(ThemeKey)
  if (!theme) throw new Error('ThemeController wurde nicht bereitgestellt.')
  return theme
}
