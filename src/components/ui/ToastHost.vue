<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useToasts } from '@/composables/useToasts'

const { toasts, dismiss } = useToasts()
const host = ref<HTMLElement | null>(null)

/**
 * Toasts laufen als Popover im Top-Layer, damit sie auch über dem modalen
 * Bearbeiten-Dialog sichtbar sind. Erneutes Öffnen legt sie wieder nach oben.
 */
watch(
  () => toasts.length,
  async (count, previous) => {
    await nextTick()
    const el = host.value
    if (!el || typeof el.showPopover !== 'function') return
    if (el.matches(':popover-open') && count > (previous ?? 0)) el.hidePopover()
    if (count > 0 && !el.matches(':popover-open')) el.showPopover()
    if (count === 0 && el.matches(':popover-open')) el.hidePopover()
  },
)
</script>

<template>
  <div ref="host" class="toast-host" popover="manual" role="region" aria-label="Benachrichtigungen">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast--${toast.tone}`"
        :role="toast.tone === 'error' ? 'alert' : 'status'"
      >
        <div class="toast__body">
          <p class="toast__title">{{ toast.title }}</p>
          <p v-if="toast.message" class="toast__message">{{ toast.message }}</p>
        </div>
        <button type="button" class="toast__close" aria-label="Benachrichtigung schließen" @click="dismiss(toast.id)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>
