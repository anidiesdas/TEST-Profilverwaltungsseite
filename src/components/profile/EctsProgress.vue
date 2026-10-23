<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { StudyProgress } from '@/domain'

const props = defineProps<{ progress: StudyProgress }>()

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const mounted = ref(false)
onMounted(() => requestAnimationFrame(() => (mounted.value = true)))

const dashOffset = computed(() =>
  CIRCUMFERENCE * (1 - (mounted.value ? props.progress.ectsPercent : 0) / 100),
)
</script>

<template>
  <figure class="ects">
    <svg class="ects__ring" viewBox="0 0 120 120" role="img" :aria-label="`${progress.ectsAchieved} von ${progress.ectsTotal} ECTS erreicht, ${progress.ectsPercent} Prozent`">
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
      <text x="60" y="60" class="ects__number">{{ progress.ectsAchieved }}</text>
      <text x="60" y="78" class="ects__unit">von {{ progress.ectsTotal }} ECTS</text>
    </svg>
  </figure>
</template>
