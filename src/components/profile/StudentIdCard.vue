<script setup lang="ts">
import { computed } from 'vue'
import { displayName, initials, type Student } from '@/domain'
import BrandLogo from '@/components/ui/BrandLogo.vue'

const props = defineProps<{ student: Student }>()
defineEmits<{ edit: [] }>()

const name = computed(() => displayName(props.student.personal))
const avatar = computed(() => initials(props.student.personal))
const currentTerm = computed(
  () => props.student.study.semesters.find((s) => s.status === 'laufend')?.term ?? '–',
)
</script>

<template>
  <article class="id-card" aria-labelledby="id-card-name">
    <div class="id-card__pattern" aria-hidden="true" />
    <header class="id-card__top">
      <span class="id-card__logo"><BrandLogo :height="26" /></span>
      <span class="id-card__kind">Studierendenausweis · digital</span>
    </header>
    <div class="id-card__body">
      <div class="id-card__avatar" aria-hidden="true">{{ avatar }}</div>
      <div class="id-card__identity">
        <h2 id="id-card-name" class="id-card__name">{{ name }}</h2>
        <p v-if="student.personal.pronouns" class="id-card__pronouns">{{ student.personal.pronouns }}</p>
        <p class="id-card__program">{{ student.study.program.name }} · {{ student.study.program.degree }}</p>
      </div>
    </div>
    <dl class="id-card__facts">
      <div><dt>Matrikel-Nr.</dt><dd class="is-mono">{{ student.study.matriculationNumber }}</dd></div>
      <div><dt>Semester</dt><dd>{{ currentTerm }}</dd></div>
      <div>
        <dt>Status</dt>
        <dd><span class="status-dot" :class="`status-dot--${student.study.enrollmentStatus}`" aria-hidden="true" />{{ student.study.enrollmentStatus }}</dd>
      </div>
    </dl>
    <button type="button" class="id-card__edit" @click="$emit('edit')">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="M10.5 2.5 13.5 5.5 5.5 13.5H2.5v-3l8-8Z"/></svg>
      Profil bearbeiten
    </button>
  </article>
</template>
