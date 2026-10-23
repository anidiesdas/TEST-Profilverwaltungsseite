<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProfileStore } from '@/stores/profileStore'
import { useProfileForm } from '@/composables/useProfileForm'
import { useToasts } from '@/composables/useToasts'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { useModShortcut } from '@/composables/useKeyboardShortcut'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDateTime } from '@/components/ui/format'
import ProfileHero from '@/components/profile/ProfileHero.vue'
import PersonalDataSection from '@/components/profile/PersonalDataSection.vue'
import AddressSection from '@/components/profile/AddressSection.vue'
import StudySection from '@/components/profile/StudySection.vue'
import ProfileEditPanel from '@/components/profile/ProfileEditPanel.vue'

const store = useProfileStore()
const form = useProfileForm(store)
const toasts = useToasts()
const editing = ref(false)

useUnsavedChangesGuard(form.isDirty)
useModShortcut('s', () => void save(), () => editing.value)

onMounted(() => store.load())

function openEditor() {
  form.reset()
  editing.value = true
}

async function save() {
  const outcome = await form.submit()
  switch (outcome) {
    case 'saved':
      editing.value = false
      toasts.show({ tone: 'success', title: 'Profil gespeichert', message: 'Deine Änderungen sind ab sofort im Portal sichtbar.' })
      break
    case 'invalid':
      toasts.show({ tone: 'error', title: 'Bitte prüfe die markierten Felder.' })
      break
    case 'failed':
      toasts.show({
        tone: 'error',
        title: 'Speichern fehlgeschlagen',
        message: `${store.state.saveError?.message ?? ''} Deine Eingaben bleiben erhalten – versuch es gleich noch einmal.`,
      })
      break
    case 'unchanged':
      toasts.show({ tone: 'info', title: 'Keine Änderungen zum Speichern.' }, 2500)
      break
    case 'conflict':
      break
  }
}
</script>

<template>
  <div class="profile-view">
    <div v-if="store.state.loadStatus === 'loading' && !store.state.student" class="skeleton" aria-busy="true" aria-label="Profil wird geladen">
      <div class="skeleton__block skeleton__block--hero" />
      <div class="skeleton__block" />
      <div class="skeleton__block" />
    </div>

    <div v-else-if="store.state.loadStatus === 'error'" class="state-error" role="alert">
      <h1>Profil konnte nicht geladen werden</h1>
      <p>{{ store.state.loadError?.message }}</p>
      <BaseButton @click="store.load()">Erneut versuchen</BaseButton>
    </div>

    <template v-else-if="store.state.student">
      <ProfileHero :student="store.state.student" @edit="openEditor" />
      <div class="profile-grid">
        <PersonalDataSection :student="store.state.student" @edit="openEditor" />
        <AddressSection :address="store.state.student.address" @edit="openEditor" />
        <StudySection class="span-full" :study="store.state.student.study" />
      </div>
      <p class="meta-line">Zuletzt aktualisiert: {{ formatDateTime(store.state.student.updatedAt) }}</p>

      <ProfileEditPanel :open="editing" :form="form" :saving="store.state.saving" @close="editing = false" @submit="save" />
    </template>
  </div>
</template>
