// Cliente mínimo para hablar con el backend a través del proxy de Astro (/api).
// `credentials: 'include'` asegura que la cookie de sesión viaje en cada request.

export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
  }
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<AuthUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),

  me: () => request<AuthUser>('/auth/me'),
};
