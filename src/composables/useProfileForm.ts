import { computed, reactive, ref, watch } from 'vue'
import {
  diffProfile,
  EDITABLE_PATHS,
  hasErrors,
  normalizeUpdate,
  pickEditable,
  validateProfileUpdate,
  ValidationError,
  type FieldErrors,
  type FieldPath,
  type ProfileUpdate,
} from '@/domain'
import type { ProfileStore } from '@/stores/profileStore'

export type SubmitOutcome = 'saved' | 'invalid' | 'conflict' | 'failed' | 'unchanged'

const EMPTY: ProfileUpdate = pickEditable({
  personal: { firstName: '', lastName: '', preferredName: '', pronouns: '', privateEmail: '', phone: '' },
  address: { street: '', houseNumber: '', addressSupplement: '', postalCode: '', city: '', country: 'DE' },
})

/**
 * Formularlogik: Draft-Kopie, Dirty-Tracking, Validierung, Submit.
 * Kennt den Store, aber keine Komponenten.
 */
export function useProfileForm(store: ProfileStore) {
  const baseline = computed<ProfileUpdate>(() =>
    store.state.student ? pickEditable(store.state.student) : EMPTY,
  )
  const draft = reactive<ProfileUpdate>(structuredClone(baseline.value))
  const touched = ref(new Set<FieldPath>())
  const submitAttempted = ref(false)
  const serverErrors = ref<FieldErrors>({})
  const conflict = ref(false)

  const normalizedDraft = computed(() => normalizeUpdate(draft))
  const changes = computed(() => diffProfile(normalizeUpdate(baseline.value), normalizedDraft.value))
  const isDirty = computed(() => changes.value.length > 0)
  const validationErrors = computed(() => validateProfileUpdate(normalizedDraft.value))
  const isValid = computed(() => !hasErrors(validationErrors.value))

  /** Fehler werden erst nach Verlassen des Feldes bzw. Submit angezeigt. */
  const visibleErrors = computed<FieldErrors>(() => {
    const result: FieldErrors = {}
    for (const path of EDITABLE_PATHS) {
      const message = validationErrors.value[path] ?? serverErrors.value[path]
      if (message && (submitAttempted.value || touched.value.has(path))) result[path] = message
    }
    return result
  })

  function assignDraft(source: ProfileUpdate) {
    Object.assign(draft.personal, structuredClone(source.personal))
    Object.assign(draft.address, structuredClone(source.address))
  }

  function reset() {
    assignDraft(baseline.value)
    touched.value = new Set()
    submitAttempted.value = false
    serverErrors.value = {}
    conflict.value = false
    store.clearSaveError()
  }

  // Neue Serverdaten übernehmen, solange nichts bearbeitet wurde.
  watch(baseline, (next) => {
    if (!isDirty.value) assignDraft(next)
  })

  function touch(path: FieldPath) {
    touched.value = new Set(touched.value).add(path)
    if (serverErrors.value[path]) {
      const { [path]: _removed, ...rest } = serverErrors.value
      serverErrors.value = rest
    }
  }

  async function submit(): Promise<SubmitOutcome> {
    submitAttempted.value = true
    if (!isDirty.value) return 'unchanged'
    if (!isValid.value) return 'invalid'

    const result = await store.save(normalizedDraft.value)
    if (result.ok) {
      reset()
      return 'saved'
    }
    switch (result.error.kind) {
      case 'validation':
        serverErrors.value = result.error instanceof ValidationError ? result.error.fieldErrors : {}
        return 'invalid'
      case 'conflict':
        conflict.value = true
        return 'conflict'
      default:
        return 'failed'
    }
  }

  /** Konflikt: neueste Serverversion laden, eigene Änderungen behalten. */
  async function resolveConflictKeepMine() {
    const mine = structuredClone(normalizedDraft.value)
    await store.load()
    assignDraft(mine)
    conflict.value = false
    store.clearSaveError()
  }

  /** Konflikt: eigene Änderungen verwerfen und Serverstand übernehmen. */
  async function resolveConflictDiscard() {
    await store.load()
    reset()
  }

  return {
    draft,
    changes,
    isDirty,
    isValid,
    errors: visibleErrors,
    conflict,
    touch,
    reset,
    submit,
    resolveConflictKeepMine,
    resolveConflictDiscard,
  }
}

export type ProfileForm = ReturnType<typeof useProfileForm>
