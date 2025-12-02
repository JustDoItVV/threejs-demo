import { ModelSource } from '../types';

export function logModelState(source: ModelSource, state: unknown) {
  console.group('Model Loader State');
  console.log('Source:', source);
  console.log('State:', state);
  console.groupEnd();
}

export function formatErrorForDisplay(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Unknown error occurred';
}
