export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
}

export function createApiError(status: number, message: string, details?: unknown): ApiError {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  error.details = details;
  return error;
}
