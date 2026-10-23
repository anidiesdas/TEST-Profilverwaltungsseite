<script setup lang="ts">
import { countryName, type FieldChange } from '@/domain'

defineProps<{ changes: FieldChange[] }>()

const show = (change: FieldChange, value: string) =>
  change.path === 'address.country' ? countryName(value) : value || '(leer)'
</script>

<template>
  <details class="changes">
    <summary class="changes__summary">
      <span class="changes__count">{{ changes.length }}</span>
      {{ changes.length === 1 ? 'Änderung' : 'Änderungen' }} prüfen
    </summary>
    <ul class="changes__list">
      <li v-for="change in changes" :key="change.path" class="changes__item">
        <span class="changes__label">{{ change.label }}</span>
        <span class="changes__values">
          <span class="changes__from"><span class="changes__tag">bisher</span> <del>{{ show(change, change.from) }}</del></span>
          <span class="changes__to"><span class="changes__tag">neu</span> <ins>{{ show(change, change.to) }}</ins></span>
        </span>
      </li>
    </ul>
  </details>
</template>
