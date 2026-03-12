import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae el mensaje de error de la API.
 * El backend devuelve { statusCode, message, data } via HttpExceptionFilter.
 * NestJS class-validator puede devolver `message` como array de strings.
 */
export function getApiError(
  err: unknown,
  fallback = 'Ha ocurrido un error. Inténtalo de nuevo.',
): string {
  if (err instanceof HttpErrorResponse) {
    const message = err.error?.message || err.error?.error;
    if (Array.isArray(message) && message.length) return message[0] as string;
    if (typeof message === 'string' && message) return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
