<script setup lang="ts">
import { computed } from 'vue'
import { profileCompleteness, type FieldPath, type Student } from '@/domain'

const props = defineProps<{ student: Student }>()
defineEmits<{ edit: [focus?: FieldPath] }>()

const completeness = computed(() => profileCompleteness(props.student))
const greetingName = computed(() => props.student.personal.preferredName || props.student.personal.firstName)
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Guten Morgen'
  if (hour < 18) return 'Hallo'
  return 'Guten Abend'
})
</script>

<template>
  <div class="intro">
    <div class="intro__text">
      <p class="intro__crumbs"><span>Hochschulportal</span><span aria-hidden="true">/</span><span>Mein Profil</span></p>
      <h1 class="intro__title">{{ greeting }}, {{ greetingName }}.</h1>
      <p class="intro__lead">Hier siehst du, was die HTW über dich gespeichert hat – und hältst deine Kontaktdaten aktuell.</p>
    </div>
    <div class="intro__completeness" :class="{ 'is-complete': !completeness.missing.length }">
      <div class="meter" role="progressbar" :aria-valuenow="completeness.percent" aria-valuemin="0" aria-valuemax="100" aria-label="Profilvollständigkeit">
        <span class="meter__fill" :style="{ width: `${completeness.percent}%` }" />
      </div>
      <p class="intro__meter-label">
        <strong>Profil {{ completeness.percent }} % vollständig</strong>
        <template v-if="!completeness.missing.length"> – alles da, danke!</template>
      </p>
      <ul v-if="completeness.missing.length" class="chip-list" aria-label="Fehlende Angaben ergänzen">
        <li v-for="item in completeness.missing" :key="item.path">
          <button type="button" class="chip" @click="$emit('edit', item.path)">
            <span aria-hidden="true">+</span> {{ item.label }} ergänzen
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
