import { describe, expect, it } from 'vitest'
import { createThemeController, THEME_STORAGE_KEY, type ThemeEnvironment } from './useTheme'

function setup(stored: string | null = null, systemDark = false) {
  const data = new Map<string, string>()
  if (stored !== null) data.set(THEME_STORAGE_KEY, stored)
  let listener: ((event: { matches: boolean }) => void) | undefined
  const env = {
    storage: {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    },
    root: { dataset: {} as DOMStringMap } as HTMLElement,
    systemDark: {
      matches: systemDark,
      addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => (listener = fn),
    },
  } as unknown as ThemeEnvironment
  const theme = createThemeController(env)
  return { theme, data, root: env.root, emitSystem: (matches: boolean) => listener?.({ matches }) }
}

describe('createThemeController', () => {
  it('folgt standardmäßig dem System', () => {
    const { theme, root, emitSystem } = setup(null, true)
    expect(theme.preference.value).toBe('system')
    expect(theme.resolved.value).toBe('dark')
    expect(root.dataset.theme).toBeUndefined()
    emitSystem(false)
    expect(theme.resolved.value).toBe('light')
  })

  it('übernimmt eine gespeicherte Wahl und setzt data-theme', () => {
    const { theme, root } = setup('light', true)
    expect(theme.preference.value).toBe('light')
    expect(theme.resolved.value).toBe('light')
    expect(root.dataset.theme).toBe('light')
  })

  it('speichert die Wahl und entfernt sie bei „system“ wieder', () => {
    const { theme, data, root } = setup()
    theme.setPreference('dark')
    expect(data.get(THEME_STORAGE_KEY)).toBe('dark')
    expect(root.dataset.theme).toBe('dark')
    theme.setPreference('system')
    expect(data.has(THEME_STORAGE_KEY)).toBe(false)
    expect(root.dataset.theme).toBeUndefined()
  })

  it('ignoriert ungültige gespeicherte Werte', () => {
    expect(setup('neon').theme.preference.value).toBe('system')
  })
})
