import { createApp } from 'vue'
import App from './App.vue'
import { MockStudentRepository } from '@/services'
import { createProfileStore, ProfileStoreKey } from '@/stores/profileStore'
import { createToaster, ToasterKey } from '@/composables/useToasts'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'

/**
 * Einzige Stelle für Dependency Injection.
 * Demo-Schalter über URL: ?fehlerquote=0.5 simuliert Netzwerkfehler, ?latenz=0 deaktiviert Verzögerung.
 */
const params = new URLSearchParams(window.location.search)
const repository = new MockStudentRepository({
  storage: window.localStorage,
  latencyMs: Number(params.get('latenz') ?? 450),
  failureRate: Number(params.get('fehlerquote') ?? 0),
})

createApp(App)
  .provide(ProfileStoreKey, createProfileStore(repository))
  .provide(ToasterKey, createToaster())
  .mount('#app')
