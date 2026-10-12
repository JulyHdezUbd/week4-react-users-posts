import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { authFetch, clearSession, getStoredUser, getToken, login, logout } from '../src/services/auth';

function mockFetch() {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock as unknown as Mock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('auth (login / token / logout)', () => {
  it('login guarda el token y retorna el usuario', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        id: 1,
        username: 'emilys',
        email: 'emily@x.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        accessToken: 'TOKEN123',
        refreshToken: 'REFRESH123',
      }),
    });

    const user = await login('emilys', 'emilyspass');

    expect(user).toEqual({
      id: 1,
      username: 'emilys',
      email: 'emily@x.com',
      firstName: 'Emily',
      lastName: 'Johnson',
    });
    expect(getToken()).toBe('TOKEN123');
    expect(getStoredUser()?.username).toBe('emilys');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('emilys') as string,
      }),
    );
  });

  it('login lanza error y no guarda nada si las credenciales fallan', async () => {
    mockFetch().mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({}) });
    await expect(login('x', 'y')).rejects.toThrow(/incorrectos/i);
    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('logout borra el token y el usuario', async () => {
    localStorage.setItem('lab6_token', 'TOKEN123');
    localStorage.setItem('lab6_user', JSON.stringify({ username: 'emilys' }));
    logout();
    expect(getToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it('clearSession borra solo las claves de sesión', () => {
    localStorage.setItem('lab6_token', 'T');
    localStorage.setItem('lab6_user', '{}');
    localStorage.setItem('otra_clave', '1');
    clearSession();
    expect(localStorage.getItem('otra_clave')).toBe('1');
  });
});

describe('authFetch (envío de token)', () => {
  it('envía Authorization Bearer con el token guardado', async () => {
    const fetchMock = mockFetch();
    localStorage.setItem('lab6_token', 'TOKEN123');
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ users: [] }) });

    await authFetch('/users');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer TOKEN123' }) as Record<string, string>,
      }),
    );
  });

  it('ante 401 limpia la sesión y lanza error de sesión expirada', async () => {
    mockFetch().mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) });
    localStorage.setItem('lab6_token', 'VIEJO');
    await expect(authFetch('/users')).rejects.toThrow(/expirada/i);
    expect(getToken()).toBeNull();
  });
});
