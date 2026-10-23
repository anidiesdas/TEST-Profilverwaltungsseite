<script setup lang="ts">
import { computed } from 'vue'
import type { StudyProgress } from '@/domain'

const props = defineProps<{ progress: StudyProgress }>()

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(() => CIRCUMFERENCE * (1 - props.progress.ectsPercent / 100))
const deltaText = computed(() => {
  const d = props.progress.ectsDelta
  if (d === 0) return 'genau im Regelstudienplan'
  return d > 0 ? `${d} ECTS vor dem Plan` : `${Math.abs(d)} ECTS hinter dem Plan`
})
</script>

<template>
  <figure class="ects">
    <svg class="ects__ring" viewBox="0 0 120 120" role="img" :aria-label="`${progress.ectsAchieved} von ${progress.ectsTotal} ECTS erreicht`">
      <circle class="ects__track" cx="60" cy="60" :r="RADIUS" />
      <circle
        class="ects__value"
        cx="60"
        cy="60"
        :r="RADIUS"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="58" class="ects__number">{{ progress.ectsAchieved }}</text>
      <text x="60" y="76" class="ects__unit">von {{ progress.ectsTotal }} ECTS</text>
    </svg>
    <figcaption class="ects__caption">
      <strong>{{ progress.ectsPercent }} %</strong> geschafft · {{ deltaText }}
    </figcaption>
  </figure>
</template>
