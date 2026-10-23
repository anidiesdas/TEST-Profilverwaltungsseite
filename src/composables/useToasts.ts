import { inject, reactive, readonly, type InjectionKey } from 'vue'

export type ToastTone = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  tone: ToastTone
  title: string
  message?: string
}

export interface Toaster {
  toasts: readonly Readonly<Toast>[]
  show(toast: Omit<Toast, 'id'>, durationMs?: number): number
  dismiss(id: number): void
}

export function createToaster(defaultDurationMs = 5000): Toaster {
  const toasts = reactive<Toast[]>([])
  let nextId = 1

  function dismiss(id: number) {
    const index = toasts.findIndex((t) => t.id === id)
    if (index >= 0) toasts.splice(index, 1)
  }

  function show(toast: Omit<Toast, 'id'>, durationMs = defaultDurationMs) {
    const id = nextId++
    toasts.push({ id, ...toast })
    if (durationMs > 0) setTimeout(() => dismiss(id), durationMs)
    return id
  }

  return { toasts: readonly(toasts) as readonly Readonly<Toast>[], show, dismiss }
}

export const ToasterKey: InjectionKey<Toaster> = Symbol('Toaster')

export function useToasts(): Toaster {
  const toaster = inject(ToasterKey)
  if (!toaster) throw new Error('Toaster wurde nicht bereitgestellt.')
  return toaster
}
