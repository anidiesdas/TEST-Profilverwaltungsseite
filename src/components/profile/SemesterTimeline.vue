<script setup lang="ts">
import type { SemesterRecord } from '@/domain'

defineProps<{ semesters: readonly SemesterRecord[]; standardPeriod: number }>()
</script>

<template>
  <ol class="timeline" aria-label="Semesterverlauf">
    <li
      v-for="semester in semesters"
      :key="semester.number"
      class="timeline__item"
      :class="`is-${semester.status}`"
      :aria-current="semester.status === 'laufend' ? 'step' : undefined"
    >
      <span class="timeline__dot" aria-hidden="true" />
      <span class="timeline__term">{{ semester.term }}</span>
      <span class="timeline__meta">
        {{ semester.number }}. Sem. ·
        <template v-if="semester.status === 'laufend'">läuft</template>
        <template v-else>{{ semester.ects }} ECTS</template>
      </span>
    </li>
    <li v-for="n in Math.max(0, standardPeriod - semesters.length)" :key="`p${n}`" class="timeline__item is-geplant">
      <span class="timeline__dot" aria-hidden="true" />
      <span class="timeline__term">geplant</span>
      <span class="timeline__meta">{{ semesters.length + n }}. Sem.</span>
    </li>
  </ol>
</template>
