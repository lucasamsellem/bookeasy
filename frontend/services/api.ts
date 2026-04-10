const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useUser } from '@/store/useUser';

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);

type ApiFetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const url = `${API_URL}/api${path}`;
  const token = useUser.getState().token;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const contentType = res.headers.get('Content-Type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === 'object' && data?.message ? data.message : res.statusText;
    throw new Error(message || 'Request failed');
  }

  return data as T;
}
