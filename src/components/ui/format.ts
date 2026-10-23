const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short' })

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date)
}

export function formatDateTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return Number.isNaN(date.getTime()) ? String(iso) : dateTimeFormatter.format(date)
}

export function orDash(value: string | null | undefined): string {
  return value && value.trim() ? value : '–'
}
