/**
 * Servicio de autenticación contra API REST real (DummyJSON).
 *
 * Flujo con token:
 *  1. `login(usuario, clave)` -> POST /auth/login -> guarda accessToken en localStorage.
 *  2. `authFetch()` -> adjunta `Authorization: Bearer <token>` en cada request.
 *  3. `logout()` -> borra el token (cierre de sesión).
 */

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

const API_URL = 'https://dummyjson.com';
const TOKEN_KEY = 'lab6_token';
const USER_KEY = 'lab6_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function setSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** Inicia sesión y persiste el token. Lanza Error si las credenciales fallan. */
export async function login(username: string, password: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  if (!response.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  const data = (await response.json()) as LoginResponse;
  const user: AuthUser = {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };
  setSession(data.accessToken, user);
  return user;
}

/** Cierra sesión: elimina el token almacenado. */
export function logout(): void {
  clearSession();
}

/** fetch autenticado: envía el token y limpia la sesión ante un 401. */
export async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  };
  const token = getToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    clearSession();
    throw new Error('Sesión expirada. Inicia sesión de nuevo.');
  }
  if (!response.ok) {
    throw new Error(`Error de la API (${response.status})`);
  }
  return (await response.json()) as T;
}
