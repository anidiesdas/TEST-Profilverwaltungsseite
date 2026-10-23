<script setup lang="ts">
import { computed } from 'vue'
import { studyProgress, type StudyInfo } from '@/domain'
import EctsProgress from './EctsProgress.vue'
import SemesterTimeline from './SemesterTimeline.vue'

const props = defineProps<{ study: StudyInfo }>()
const progress = computed(() => studyProgress(props.study))

const planText = computed(() => {
  const d = progress.value.ectsDelta
  if (d === 0) return 'Genau im Regelstudienplan'
  return d > 0 ? `${d} ECTS vor dem Plan` : `${Math.abs(d)} ECTS hinter dem Plan`
})
const planTone = computed(() => (progress.value.ectsDelta >= 0 ? 'good' : 'warn'))
</script>

<template>
  <section class="card progress-card" aria-labelledby="sec-progress">
    <header class="card__header">
      <div class="card__heading">
        <p class="card__eyebrow">Studienfortschritt</p>
        <h2 id="sec-progress" class="card__title">{{ progress.ectsPercent }} % deines Studiums geschafft</h2>
      </div>
    </header>
    <div class="progress-card__body">
      <EctsProgress :progress="progress" />
      <ul class="stat-list">
        <li class="stat">
          <span class="stat__value">{{ progress.ectsRemaining }}</span>
          <span class="stat__label">ECTS bis zum Abschluss</span>
        </li>
        <li class="stat">
          <span class="stat__value">{{ study.currentSemester }}<small>/{{ study.program.standardPeriod }}</small></span>
          <span class="stat__label">Fachsemester (Regelstudienzeit)</span>
        </li>
        <li class="stat" :class="`stat--${planTone}`">
          <span class="stat__value stat__value--text">{{ planText }}</span>
          <span class="stat__label">Vergleich: 30 ECTS je Semester</span>
        </li>
      </ul>
    </div>
    <h3 class="subheading">Semesterverlauf</h3>
    <SemesterTimeline :semesters="study.semesters" :standard-period="study.program.standardPeriod" />
  </section>
</template>
