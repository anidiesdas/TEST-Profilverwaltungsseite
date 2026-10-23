import { onBeforeUnmount, onMounted } from 'vue'

/** Registriert Strg/Cmd + <key>, z. B. Strg+S zum Speichern. */
export function useModShortcut(key: string, handler: () => void, enabled: () => boolean = () => true) {
  const listener = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === key && enabled()) {
      event.preventDefault()
      handler()
    }
  }
  onMounted(() => window.addEventListener('keydown', listener))
  onBeforeUnmount(() => window.removeEventListener('keydown', listener))
}
