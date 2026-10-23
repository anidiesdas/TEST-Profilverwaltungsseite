<script setup lang="ts">
import { computed } from 'vue'
import { studyProgress, type StudyInfo } from '@/domain'
import DataItem from '@/components/ui/DataItem.vue'
import LockedField from '@/components/ui/LockedField.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import { formatDate } from '@/components/ui/format'
import EctsProgress from './EctsProgress.vue'
import SemesterTimeline from './SemesterTimeline.vue'

const props = defineProps<{ study: StudyInfo }>()
const progress = computed(() => studyProgress(props.study))
const LOCK_REASON = 'Wird vom Studierendenservice verwaltet'
</script>

<template>
  <SectionCard heading-id="sec-study" title="Studium" description="Diese Angaben verwaltet die Hochschule. Fehler? Melde dich beim Studierendenservice.">
    <div class="study">
      <EctsProgress :progress="progress" />
      <dl class="data-grid">
        <LockedField label="Matrikelnummer" :value="study.matriculationNumber" :reason="LOCK_REASON" copyable mono />
        <LockedField label="HTW-Account" :value="study.htwAccount" :reason="LOCK_REASON" copyable mono />
        <LockedField label="HTW-E-Mail" :value="study.htwEmail" :reason="LOCK_REASON" copyable />
        <DataItem label="Studiengang" :value="`${study.program.name} (${study.program.degree})`" />
        <DataItem label="Fachbereich" :value="study.program.faculty" />
        <DataItem label="Standort" :value="study.program.campus" />
        <DataItem label="Status" :value="study.enrollmentStatus">
          <span class="status-badge" :class="`status-badge--${study.enrollmentStatus}`">{{ study.enrollmentStatus }}</span>
        </DataItem>
        <DataItem label="Immatrikuliert seit" :value="formatDate(study.enrolledSince)" />
        <DataItem label="Fachsemester" :value="`${study.currentSemester}. von ${study.program.standardPeriod} (Regelstudienzeit)`" />
        <DataItem label="Semesterbeitrag" :value="study.semesterFeePaid ? 'bezahlt' : 'offen'" />
      </dl>
    </div>
    <h3 class="subheading">Semesterverlauf</h3>
    <SemesterTimeline :semesters="study.semesters" :standard-period="study.program.standardPeriod" />
  </SectionCard>
</template>
