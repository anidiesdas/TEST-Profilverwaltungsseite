<script setup lang="ts">
import { computed } from 'vue'
import { displayName, initials, profileCompleteness, type Student } from '@/domain'

const props = defineProps<{ student: Student }>()
defineEmits<{ edit: [] }>()

const name = computed(() => displayName(props.student.personal))
const avatar = computed(() => initials(props.student.personal))
const completeness = computed(() => profileCompleteness(props.student))
</script>

<template>
  <section class="hero" aria-labelledby="hero-name">
    <div class="hero__avatar" aria-hidden="true">{{ avatar }}</div>
    <div class="hero__main">
      <p class="hero__eyebrow">{{ student.study.program.degree }} · {{ student.study.currentSemester }}. Fachsemester</p>
      <h1 id="hero-name" class="hero__name">
        {{ name }}
        <span v-if="student.personal.pronouns" class="hero__pronouns">({{ student.personal.pronouns }})</span>
      </h1>
      <p class="hero__program">{{ student.study.program.name }}</p>
    </div>
    <div class="hero__aside">
      <div class="completeness">
        <p class="completeness__label">Profil zu {{ completeness.percent }} % vollständig</p>
        <div class="completeness__bar" role="progressbar" :aria-valuenow="completeness.percent" aria-valuemin="0" aria-valuemax="100" aria-label="Profilvollständigkeit">
          <span :style="{ width: `${completeness.percent}%` }" />
        </div>
        <p v-if="completeness.missing.length" class="completeness__hint">
          Noch offen: {{ completeness.missing.map((m) => m.label).join(', ') }}
        </p>
      </div>
      <button type="button" class="btn btn--primary btn--md" @click="$emit('edit')">Profil bearbeiten</button>
    </div>
  </section>
</template>
