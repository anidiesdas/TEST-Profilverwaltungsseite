<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  value: string
  copyable?: boolean
  mono?: boolean
}>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 1600)
  } catch {
    // Clipboard nicht verfügbar – stillschweigend ignorieren
  }
}
</script>

<template>
  <div class="data-item data-item--locked">
    <dt class="data-item__label">
      <svg class="data-item__lock" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M5 7V5a3 3 0 1 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z"/></svg>
      {{ label }}
      <span class="visually-hidden">(nicht änderbar)</span>
    </dt>
    <dd class="data-item__value" :class="{ 'is-mono': mono }">
      <span class="data-item__text">{{ value }}</span>
      <button v-if="copyable" type="button" class="copy-btn" :class="{ 'is-copied': copied }" :aria-label="`${label} kopieren`" @click="copy">
        <svg v-if="!copied" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M5.5 5.5V3.25c0-.97.78-1.75 1.75-1.75h5.5c.97 0 1.75.78 1.75 1.75v5.5c0 .97-.78 1.75-1.75 1.75H10.5M3.25 5.5h5.5c.97 0 1.75.78 1.75 1.75v5.5c0 .97-.78 1.75-1.75 1.75h-5.5c-.97 0-1.75-.78-1.75-1.75v-5.5c0-.97.78-1.75 1.75-1.75Z"/></svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="m3 8.5 3 3 7-7"/></svg>
        <span class="copy-btn__text" aria-live="polite">{{ copied ? 'Kopiert' : '' }}</span>
      </button>
    </dd>
  </div>
</template>
