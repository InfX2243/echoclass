const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiConfig = {
  baseUrl: apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : '',
};

export function buildApiUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiConfig.baseUrl}${normalizedPath}`;
}
