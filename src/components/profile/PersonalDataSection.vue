<script setup lang="ts">
import type { Student } from '@/domain'
import DataItem from '@/components/ui/DataItem.vue'
import LockedField from '@/components/ui/LockedField.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import { formatDate, orDash } from '@/components/ui/format'

defineProps<{ student: Student }>()
defineEmits<{ edit: [] }>()
</script>

<template>
  <SectionCard heading-id="sec-personal" title="Persönliche Angaben" description="So erscheinst du im Portal und so erreichen wir dich.">
    <template #actions>
      <button type="button" class="btn btn--ghost btn--sm" @click="$emit('edit')">Bearbeiten</button>
    </template>
    <dl class="data-grid">
      <DataItem label="Vorname" :value="student.personal.firstName" />
      <DataItem label="Nachname" :value="student.personal.lastName" />
      <DataItem label="Rufname" :value="orDash(student.personal.preferredName)" :muted="!student.personal.preferredName" />
      <DataItem label="Pronomen" :value="orDash(student.personal.pronouns)" :muted="!student.personal.pronouns" />
      <LockedField label="Geburtsdatum" :value="formatDate(student.personal.birthDate)" reason="Änderung nur mit Nachweis beim Studierendenservice" />
      <DataItem label="Private E-Mail" :value="orDash(student.personal.privateEmail)" :muted="!student.personal.privateEmail" />
      <DataItem label="Telefon" :value="orDash(student.personal.phone)" :muted="!student.personal.phone" />
    </dl>
  </SectionCard>
</template>
