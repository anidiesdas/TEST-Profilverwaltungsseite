import type { FieldErrors } from './validation'

/** Typisierte Fehler des Datenzugriffs – gemeinsamer Vertrag für Services, Store und UI. */
export abstract class AppError extends Error {
  abstract readonly kind: 'network' | 'validation' | 'conflict' | 'not-found' | 'forbidden'
}

export class NetworkError extends AppError {
  readonly kind = 'network'
  constructor(message = 'Der Server ist gerade nicht erreichbar.') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  readonly kind = 'validation'
  constructor(readonly fieldErrors: FieldErrors) {
    super('Einige Angaben sind ungültig.')
    this.name = 'ValidationError'
  }
}

export class ConflictError extends AppError {
  readonly kind = 'conflict'
  constructor(readonly currentVersion: number) {
    super('Dein Profil wurde zwischenzeitlich an anderer Stelle geändert.')
    this.name = 'ConflictError'
  }
}

export class NotFoundError extends AppError {
  readonly kind = 'not-found'
  constructor(message = 'Profil nicht gefunden.') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ForbiddenFieldError extends AppError {
  readonly kind = 'forbidden'
  constructor(readonly fields: string[]) {
    super(`Diese Felder dürfen nicht geändert werden: ${fields.join(', ')}`)
    this.name = 'ForbiddenFieldError'
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  return new NetworkError(error instanceof Error ? error.message : undefined)
}
