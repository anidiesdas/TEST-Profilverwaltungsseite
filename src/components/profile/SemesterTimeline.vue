<script setup lang="ts">
import { computed } from 'vue'
import { ECTS_PER_SEMESTER, type SemesterRecord } from '@/domain'

const props = defineProps<{ semesters: readonly SemesterRecord[]; standardPeriod: number }>()

const planned = computed(() =>
  Array.from({ length: Math.max(0, props.standardPeriod - props.semesters.length) }, (_, i) => props.semesters.length + i + 1),
)
const barHeight = (ects: number) => `${Math.min(100, (ects / (ECTS_PER_SEMESTER * 1.25)) * 100)}%`
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
      <span class="timeline__bar" aria-hidden="true">
        <span class="timeline__fill" :style="{ height: semester.status === 'laufend' ? '100%' : barHeight(semester.ects) }" />
      </span>
      <span class="timeline__num">{{ semester.number }}</span>
      <span class="timeline__term">{{ semester.term }}</span>
      <span class="timeline__meta">{{ semester.status === 'laufend' ? 'läuft' : `${semester.ects} ECTS` }}</span>
    </li>
    <li v-for="n in planned" :key="`p${n}`" class="timeline__item is-geplant">
      <span class="timeline__bar" aria-hidden="true" />
      <span class="timeline__num">{{ n }}</span>
      <span class="timeline__term">geplant</span>
      <span class="timeline__meta">–</span>
    </li>
  </ol>
</template>
