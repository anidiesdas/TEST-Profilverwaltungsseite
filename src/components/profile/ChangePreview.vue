<script setup lang="ts">
import { countryName, type FieldChange } from '@/domain'

defineProps<{ changes: FieldChange[] }>()

const show = (change: FieldChange, value: string) =>
  change.path === 'address.country' ? countryName(value) : value || 'leer'
</script>

<template>
  <details class="changes" :open="changes.length <= 3">
    <summary class="changes__summary">
      {{ changes.length }} {{ changes.length === 1 ? 'Änderung' : 'Änderungen' }} prüfen
    </summary>
    <ul class="changes__list">
      <li v-for="change in changes" :key="change.path" class="changes__item">
        <span class="changes__label">{{ change.label }}</span>
        <del class="changes__from">{{ show(change, change.from) }}</del>
        <span aria-hidden="true">→</span>
        <ins class="changes__to">{{ show(change, change.to) }}</ins>
      </li>
    </ul>
  </details>
</template>
