import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/** Warnt beim Schließen/Neuladen des Tabs, solange ungespeicherte Änderungen bestehen. */
export function useUnsavedChangesGuard(isDirty: Readonly<Ref<boolean>>) {
  const handler = (event: BeforeUnloadEvent) => {
    if (!isDirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }
  onMounted(() => window.addEventListener('beforeunload', handler))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', handler))
}
