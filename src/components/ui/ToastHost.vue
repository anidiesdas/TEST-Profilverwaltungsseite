<script setup lang="ts">
import { useToasts } from '@/composables/useToasts'

const { toasts, dismiss } = useToasts()
</script>

<template>
  <div class="toast-host" role="region" aria-label="Benachrichtigungen">
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
