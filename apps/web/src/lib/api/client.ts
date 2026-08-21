const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';

export async function apiRequest<T>(path: string, options: RequestInit = {}, accessToken: string): Promise<T> {
  if (!apiBaseUrl) throw new Error('VITE_API_BASE_URL is not configured');
  if (!accessToken) throw new Error('No authenticated access token is available');

  const response = await fetch(`${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
      authorization: `Bearer ${accessToken}`,
    },
  });

  const raw = await response.text();
  let payload: T | { error?: { code?: string; message?: string } } | null = null;
  if (raw) {
    try { payload = JSON.parse(raw) as T | { error?: { code?: string; message?: string } }; }
    catch { payload = null; }
  }

  if (!response.ok) {
    const apiError = payload as { error?: { code?: string; message?: string } } | null;
    const detail = apiError?.error?.message ? `: ${apiError.error.message}` : raw ? `: ${raw.slice(0, 300)}` : '';
    throw new Error(`API request failed (${response.status})${detail}`);
  }

  if (payload === null) throw new Error(`API returned an empty response (${response.status})`);
  return payload as T;
}

export const apiClient = {
  get: <T>(path: string, accessToken: string) => apiRequest<T>(path, { method: 'GET' }, accessToken),
  post: <T>(path: string, body: unknown, accessToken: string) => apiRequest<T>(path, { method: 'POST', body: JSON.stringify(body) }, accessToken),
  patch: <T>(path: string, body: unknown, accessToken: string) => apiRequest<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, accessToken),
  delete: <T>(path: string, accessToken: string) => apiRequest<T>(path, { method: 'DELETE' }, accessToken),
};
