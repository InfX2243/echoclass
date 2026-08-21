import { cognitoAuth } from '@/lib/auth/cognito';
import { buildApiUrl } from './config';
import { createApiError } from './errors';

export type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & { body?: unknown; headers?: HeadersInit };

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (response.status === 204) return undefined;
  if (contentType.includes('application/json')) { try { return await response.json(); } catch { return undefined; } }
  return response.text();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...init } = options;
  const accessToken = cognitoAuth.getAccessToken();
  const response = await fetch(buildApiUrl(path), { ...init, credentials: 'include', headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  const payload = await parseResponse(response);
  if (!response.ok) { const message = typeof payload === 'object' && payload !== null && 'message' in payload ? String(payload.message) : `API request failed with status ${response.status}`; throw createApiError(response.status, message, payload); }
  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
