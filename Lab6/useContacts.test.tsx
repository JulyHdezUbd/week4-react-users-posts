import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { useContacts } from '../src/hooks/useContacts';
import type { Contact } from '../src/types/api';

const CONTACTS: Contact[] = [
  { id: 1, firstName: 'Emily', lastName: 'Johnson', email: 'emily@x.com', phone: '111' },
];

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

describe('useContacts', () => {
  it('empieza en loading y luego guarda los contactos', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ users: CONTACTS, total: 1 }),
    });
    const { result } = renderHook(() => useContacts());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.contacts).toEqual(CONTACTS);
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/users'), expect.anything());
  });

  it('guarda error si la API falla', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.contacts).toEqual([]);
    expect(result.current.error).toMatch(/500/);
  });

  it('add() crea y agrega el contacto al inicio', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ users: CONTACTS, total: 1 }),
    });
    const created: Contact = { id: 209, firstName: 'Ana', lastName: 'López', email: 'ana@x.com', phone: '999' };
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => created });
    let saved: Contact | undefined;
    await act(async () => {
      saved = await result.current.add({
        firstName: 'Ana',
        lastName: 'López',
        email: 'ana@x.com',
        phone: '999',
      });
    });
    expect(saved).toEqual(created);
    expect(result.current.contacts[0]).toEqual(created);
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('/users/add'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('update() reemplaza el contacto editado', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ users: CONTACTS, total: 1 }),
    });
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const updated: Contact = { ...CONTACTS[0], phone: '000' };
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => updated });
    await act(async () => {
      await result.current.update(1, {
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@x.com',
        phone: '000',
      });
    });
    expect(result.current.contacts).toEqual([updated]);
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('remove() elimina el contacto de la lista', async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ users: CONTACTS, total: 1 }),
    });
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.loading).toBe(false));

    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ isDeleted: true }) });
    await act(async () => {
      await result.current.remove(1);
    });
    expect(result.current.contacts).toEqual([]);
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({ method: 'DELETE' }),
    );
  });
});
