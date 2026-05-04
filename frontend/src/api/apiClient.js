import { getToken } from './tokenStorage';

const DEFAULT_BASE_URL = 'http://localhost:8080';

const getBaseUrl = () =>
  (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

const buildUrl = (path) => {
  if (!path) return getBaseUrl();
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const apiRequest = async (path, options = {}) => {
  const { method = 'GET', body, headers, auth = true } = options;
  const finalHeaders = { ...headers };
  const token = auth ? getToken() : null;

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const isJsonBody = body && typeof body === 'object' && !(body instanceof FormData);
  if (isJsonBody && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: isJsonBody ? JSON.stringify(body) : body,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const message = data && typeof data === 'object' && data.message
      ? data.message
      : (typeof data === 'string' && data.trim() ? data : 'Request failed');
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
