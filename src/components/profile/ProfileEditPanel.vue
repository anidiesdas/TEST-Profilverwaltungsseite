<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { COUNTRIES, FIELD_LABELS, type FieldPath } from '@/domain'
import type { ProfileForm } from '@/composables/useProfileForm'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseField from '@/components/ui/BaseField.vue'
import ChangePreview from './ChangePreview.vue'

const props = defineProps<{ open: boolean; form: ProfileForm; saving: boolean; focus?: FieldPath }>()
const emit = defineEmits<{ close: []; submit: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const confirmDiscard = ref(false)
const countryOptions = COUNTRIES.map((c) => ({ value: c.code, label: c.name }))

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    if (open && !dialog.value?.open) {
      dialog.value?.showModal()
      focusField(props.focus ?? 'personal.firstName')
    }
    if (!open && dialog.value?.open) dialog.value.close()
    confirmDiscard.value = false
  },
)

/** Kontextsensitiver Einstieg: springt direkt zum angeklickten Feld. */
function focusField(path: FieldPath) {
  const control = dialog.value?.querySelector<HTMLElement>(`[data-field="${path}"] .field__control`)
  control?.focus()
  control?.scrollIntoView({ block: 'center' })
}

function requestClose() {
  if (props.saving) return
  if (props.form.isDirty.value && !confirmDiscard.value) {
    confirmDiscard.value = true
    return
  }
  props.form.reset()
  emit('close')
}

function onCancel(event: Event) {
  event.preventDefault() // Esc → gleiche Logik wie „Abbrechen“
  requestClose()
}

const err = (path: FieldPath) => props.form.errors.value[path]
const label = (path: FieldPath) => FIELD_LABELS[path]
</script>

<template>
  <dialog ref="dialog" class="panel" aria-labelledby="panel-title" @cancel="onCancel">
    <form class="panel__form" novalidate @submit.prevent="emit('submit')">
      <header class="panel__header">
        <div>
          <p class="card__eyebrow">Mein Profil</p>
          <h2 id="panel-title" class="panel__title">Profil bearbeiten</h2>
          <p class="panel__subtitle">Felder mit * sind Pflicht. Matrikelnummer, HTW-Account und Studiendaten verwaltet die Hochschule.</p>
        </div>
        <button type="button" class="icon-btn" aria-label="Schließen" @click="requestClose">
          <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="m4 4 8 8M12 4l-8 8"/></svg>
        </button>
      </header>

      <div class="panel__body">
        <div v-if="form.conflict.value" class="notice notice--warning" role="alert">
          <p><strong>Dein Profil wurde inzwischen an anderer Stelle geändert</strong> (z. B. in einem anderen Tab).</p>
          <div class="notice__actions">
            <BaseButton size="sm" variant="secondary" @click="form.resolveConflictKeepMine()">Neuesten Stand laden, meine Änderungen behalten</BaseButton>
            <BaseButton size="sm" variant="ghost" @click="form.resolveConflictDiscard()">Meine Änderungen verwerfen</BaseButton>
          </div>
        </div>

        <fieldset class="fieldset">
          <legend class="fieldset__legend">Name</legend>
          <div class="form-grid">
            <BaseField data-field="personal.firstName" v-model="form.draft.personal.firstName" :label="label('personal.firstName')" :error="err('personal.firstName')" autocomplete="given-name" required @blur="form.touch('personal.firstName')" />
            <BaseField data-field="personal.lastName" v-model="form.draft.personal.lastName" :label="label('personal.lastName')" :error="err('personal.lastName')" autocomplete="family-name" required @blur="form.touch('personal.lastName')" />
            <BaseField data-field="personal.preferredName" v-model="form.draft.personal.preferredName" :label="label('personal.preferredName')" :error="err('personal.preferredName')" autocomplete="nickname" hint="Wird im Portal statt deines Vornamens angezeigt." @blur="form.touch('personal.preferredName')" />
            <BaseField data-field="personal.pronouns" v-model="form.draft.personal.pronouns" :label="label('personal.pronouns')" :error="err('personal.pronouns')" placeholder="z. B. sie/ihr, er/ihm, they/them" @blur="form.touch('personal.pronouns')" />
          </div>
          <p class="fieldset__note">Für Zeugnisse und Urkunden gilt dein amtlicher Name. Namensänderungen bitte zusätzlich mit Nachweis beim Studierendenservice einreichen.</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset__legend">Kontakt</legend>
          <div class="form-grid">
            <BaseField data-field="personal.privateEmail" v-model="form.draft.personal.privateEmail" type="email" :label="label('personal.privateEmail')" :error="err('personal.privateEmail')" autocomplete="email" @blur="form.touch('personal.privateEmail')" />
            <BaseField data-field="personal.phone" v-model="form.draft.personal.phone" type="tel" :label="label('personal.phone')" :error="err('personal.phone')" autocomplete="tel" placeholder="+49 30 …" @blur="form.touch('personal.phone')" />
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset__legend">Anschrift</legend>
          <div class="form-grid form-grid--address">
            <BaseField data-field="address.street" v-model="form.draft.address.street" class="span-3" :label="label('address.street')" :error="err('address.street')" autocomplete="address-line1" required @blur="form.touch('address.street')" />
            <BaseField data-field="address.houseNumber" v-model="form.draft.address.houseNumber" :label="label('address.houseNumber')" :error="err('address.houseNumber')" required @blur="form.touch('address.houseNumber')" />
            <BaseField data-field="address.addressSupplement" v-model="form.draft.address.addressSupplement" class="span-4" :label="label('address.addressSupplement')" :error="err('address.addressSupplement')" autocomplete="address-line2" placeholder="c/o, Etage, Wohnheimzimmer …" @blur="form.touch('address.addressSupplement')" />
            <BaseField data-field="address.postalCode" v-model="form.draft.address.postalCode" :label="label('address.postalCode')" :error="err('address.postalCode')" autocomplete="postal-code" required @blur="form.touch('address.postalCode')" />
            <BaseField data-field="address.city" v-model="form.draft.address.city" class="span-3" :label="label('address.city')" :error="err('address.city')" autocomplete="address-level2" required @blur="form.touch('address.city')" />
            <BaseField data-field="address.country" v-model="form.draft.address.country" class="span-4" :label="label('address.country')" :error="err('address.country')" :options="countryOptions" autocomplete="country" required @blur="form.touch('address.country')" />
          </div>
        </fieldset>
      </div>

      <footer class="panel__footer">
        <ChangePreview v-if="form.isDirty.value" :changes="form.changes.value" />
        <p v-else class="panel__pristine">Noch keine Änderungen</p>

        <div v-if="confirmDiscard" class="notice notice--inline" role="alert">
          <span>Ungespeicherte Änderungen verwerfen?</span>
          <BaseButton size="sm" variant="danger" @click="requestClose">Verwerfen</BaseButton>
          <BaseButton size="sm" variant="ghost" @click="confirmDiscard = false">Weiter bearbeiten</BaseButton>
        </div>
        <div v-else class="panel__actions">
          <span class="kbd-hint" aria-hidden="true"><kbd>Strg</kbd> <kbd>S</kbd></span>
          <BaseButton variant="ghost" :disabled="saving" @click="requestClose">Abbrechen</BaseButton>
          <BaseButton type="submit" :loading="saving" :disabled="!form.isDirty.value">
            {{ saving ? 'Speichert …' : 'Änderungen speichern' }}
          </BaseButton>
        </div>
      </footer>
    </form>
  </dialog>
</template>
