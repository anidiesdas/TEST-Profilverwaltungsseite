<script setup lang="ts">
import { useTheme, type ThemePreference } from '@/composables/useTheme'

const theme = useTheme()

/** Übergänge kurz aussetzen, damit beim Wechsel nicht jede Fläche einzeln „nachblendet“. */
function select(preference: ThemePreference) {
  const root = document.documentElement
  root.classList.add('is-theme-switching')
  theme.setPreference(preference)
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-theme-switching')))
}

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
]
</script>

<template>
  <fieldset class="theme-switch">
    <legend class="visually-hidden">Farbschema</legend>
    <label
      v-for="option in OPTIONS"
      :key="option.value"
      class="theme-switch__option"
      :class="{ 'is-active': theme.preference.value === option.value }"
      :title="option.value === 'system' ? 'Wie im Betriebssystem eingestellt' : `Immer ${option.label.toLowerCase()}`"
    >
      <input
        type="radio"
        name="theme"
        class="visually-hidden"
        :value="option.value"
        :checked="theme.preference.value === option.value"
        @change="select(option.value)"
      />
      <svg v-if="option.value === 'system'" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M5.5 14h5M8 11.5V14"/></svg>
      <svg v-else-if="option.value === 'light'" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M8 1.25v1.5M8 13.25v1.5M1.25 8h1.5M13.25 8h1.5M3.2 3.2l1.06 1.06M11.74 11.74l1.06 1.06M3.2 12.8l1.06-1.06M11.74 4.26l1.06-1.06"/></svg>
      <svg v-else viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="M13.5 9.6A5.75 5.75 0 0 1 6.4 2.5a5.75 5.75 0 1 0 7.1 7.1Z"/></svg>
      <span class="theme-switch__label">{{ option.label }}</span>
    </label>
  </fieldset>
</template>
