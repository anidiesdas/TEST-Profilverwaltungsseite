<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  value: string
  /** Erklärung, warum/wo das Feld geändert werden kann. */
  reason?: string
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
      {{ label }}
      <span class="lock" :title="reason" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12"><path fill="currentColor" d="M5 7V5a3 3 0 1 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5Zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2Z"/></svg>
      </span>
      <span class="visually-hidden">(gesperrt{{ reason ? `: ${reason}` : '' }})</span>
    </dt>
    <dd class="data-item__value" :class="{ 'is-mono': mono }">
      <span>{{ value }}</span>
      <button v-if="copyable" type="button" class="copy-btn" :aria-label="`${label} kopieren`" @click="copy">
        {{ copied ? 'Kopiert' : 'Kopieren' }}
      </button>
    </dd>
  </div>
</template>
