<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    size?: 'md' | 'sm'
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false, size: 'md' },
)
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>
