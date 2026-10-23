<script setup lang="ts">
import type { StudyInfo } from '@/domain'
import DataItem from '@/components/ui/DataItem.vue'
import LockedField from '@/components/ui/LockedField.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import { formatDate } from '@/components/ui/format'

defineProps<{ study: StudyInfo }>()
</script>

<template>
  <SectionCard
    heading-id="sec-study"
    eyebrow="Von der Hochschule verwaltet"
    title="Studiendaten"
    description="Diese Angaben kannst du nicht selbst ändern. Stimmt etwas nicht? Wende dich an den Studierendenservice."
  >
    <template #actions>
      <a class="btn btn--ghost btn--sm" href="mailto:studierendenservice@htw-berlin.de">Studierendenservice kontaktieren</a>
    </template>
    <dl class="data-grid data-grid--wide">
      <LockedField label="Matrikelnummer" :value="study.matriculationNumber" copyable mono />
      <LockedField label="HTW-Account" :value="study.htwAccount" copyable mono />
      <LockedField label="HTW-E-Mail" :value="study.htwEmail" copyable />
      <LockedField label="Studiengang" :value="study.program.name" />
      <LockedField label="Abschluss" :value="study.program.degree" />
      <LockedField label="Fachbereich" :value="study.program.faculty" />
      <LockedField label="Standort" :value="study.program.campus" />
      <LockedField label="Immatrikuliert seit" :value="formatDate(study.enrolledSince)" />
      <DataItem label="Semesterbeitrag" :value="study.semesterFeePaid ? 'bezahlt' : 'offen'">
        <span class="badge" :class="study.semesterFeePaid ? 'badge--ok' : 'badge--warn'">{{ study.semesterFeePaid ? 'bezahlt' : 'offen' }}</span>
      </DataItem>
    </dl>
  </SectionCard>
</template>
