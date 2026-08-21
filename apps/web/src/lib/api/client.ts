const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';

export async function apiRequest<T>(path: string, options: RequestInit = {}, accessToken: string): Promise<T> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured');
  const response = await fetch(`${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
      authorization: `Bearer ${accessToken}`,
    },
  });
  const payload = await response.json().catch(() => null) as T | { error?: { message?: string } } | null;
  if (!response.ok) throw new Error((payload as { error?: { message?: string } } | null)?.error?.message ?? `API request failed (${response.status})`);
  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, accessToken: string) => apiRequest<T>(path, { method: 'GET' }, accessToken),
  post: <T>(path: string, body: unknown, accessToken: string) => apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }, accessToken),
  patch: <T>(path: string, body: unknown, accessToken: string) => apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, accessToken),
  delete: <T>(path: string, accessToken: string) => apiRequest<T>(path, { method: 'DELETE' }, accessToken),
};
