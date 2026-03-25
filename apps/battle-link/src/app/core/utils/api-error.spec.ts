import { HttpErrorResponse } from '@angular/common/http';
import { getApiError } from './api-error';

describe('getApiError', () => {
  it('should return string message from HttpErrorResponse.error.message', () => {
    const err = new HttpErrorResponse({ error: { message: 'Email already exists' }, status: 400 });
    expect(getApiError(err)).toBe('Email already exists');
  });

  it('should return first element when message is an array', () => {
    const err = new HttpErrorResponse({ error: { message: ['Validation error 1', 'Validation error 2'] }, status: 422 });
    expect(getApiError(err)).toBe('Validation error 1');
  });

  it('should return error.error when message is absent', () => {
    const err = new HttpErrorResponse({ error: { error: 'Unauthorized' }, status: 401 });
    expect(getApiError(err)).toBe('Unauthorized');
  });

  it('should return fallback for HttpErrorResponse with no useful message', () => {
    const err = new HttpErrorResponse({ status: 500 });
    expect(getApiError(err)).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
  });

  it('should use custom fallback when provided', () => {
    const err = new HttpErrorResponse({ status: 503 });
    expect(getApiError(err, 'Custom fallback')).toBe('Custom fallback');
  });

  it('should return Error.message for plain Error instances', () => {
    const err = new Error('Something went wrong');
    expect(getApiError(err)).toBe('Something went wrong');
  });

  it('should return fallback for unknown error types', () => {
    expect(getApiError('string error')).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
    expect(getApiError(null)).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
    expect(getApiError(undefined)).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
    expect(getApiError(42)).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
  });

  it('should ignore empty array message and use fallback', () => {
    const err = new HttpErrorResponse({ error: { message: [] }, status: 400 });
    expect(getApiError(err)).toBe('Ha ocurrido un error. Inténtalo de nuevo.');
  });
});
