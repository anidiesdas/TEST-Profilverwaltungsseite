<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { displayName, type FieldPath } from '@/domain'
import { useProfileStore } from '@/stores/profileStore'
import { useProfileForm } from '@/composables/useProfileForm'
import { useToasts } from '@/composables/useToasts'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { useModShortcut } from '@/composables/useKeyboardShortcut'
import BaseButton from '@/components/ui/BaseButton.vue'
import { formatDateTime } from '@/components/ui/format'
import ProfileIntro from '@/components/profile/ProfileIntro.vue'
import StudentIdCard from '@/components/profile/StudentIdCard.vue'
import StudyProgressPanel from '@/components/profile/StudyProgressPanel.vue'
import PersonalDataSection from '@/components/profile/PersonalDataSection.vue'
import AddressSection from '@/components/profile/AddressSection.vue'
import StudySection from '@/components/profile/StudySection.vue'
import ProfileEditPanel from '@/components/profile/ProfileEditPanel.vue'

const store = useProfileStore()
const form = useProfileForm(store)
const toasts = useToasts()
const editing = ref(false)
const editFocus = ref<FieldPath | undefined>()

const student = computed(() => store.state.student)
const recipient = computed(() => (student.value ? `${student.value.personal.firstName} ${student.value.personal.lastName}` : ''))

useUnsavedChangesGuard(form.isDirty)
useModShortcut('s', () => void save(), () => editing.value)

onMounted(() => store.load())

function openEditor(focus?: FieldPath) {
  form.reset()
  editFocus.value = focus
  editing.value = true
}

async function save() {
  if (store.state.saving) return
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
    <div v-if="store.state.loadStatus !== 'error' && !student" class="skeleton" aria-busy="true" aria-label="Profil wird geladen">
      <div class="skeleton__band" />
      <div class="layout">
        <div class="skeleton__block col-5" />
        <div class="skeleton__block col-7" />
      </div>
    </div>

    <div v-else-if="store.state.loadStatus === 'error'" class="state-error" role="alert">
      <h1 class="state-error__title">Dein Profil konnte nicht geladen werden</h1>
      <p>{{ store.state.loadError?.message }} Bitte prüfe deine Verbindung.</p>
      <BaseButton @click="store.load()">Erneut versuchen</BaseButton>
    </div>

    <template v-else-if="student">
      <div class="band">
        <div class="band__inner">
          <ProfileIntro :student="student" @edit="openEditor" />
        </div>
      </div>

      <div class="layout layout--overlap">
        <StudentIdCard class="col-5" :student="student" @edit="openEditor()" />
        <StudyProgressPanel class="col-7" :study="student.study" />
        <PersonalDataSection class="col-7" :student="student" @edit="openEditor" />
        <AddressSection class="col-5" :address="student.address" :recipient="recipient" @edit="openEditor" />
        <StudySection class="col-12" :study="student.study" />
      </div>

      <p class="meta-line">
        Zuletzt aktualisiert am {{ formatDateTime(student.updatedAt) }} · Profil von {{ displayName(student.personal) }}
      </p>

      <ProfileEditPanel :open="editing" :form="form" :saving="store.state.saving" :focus="editFocus" @close="editing = false" @submit="save" />
    </template>
  </div>
</template>
