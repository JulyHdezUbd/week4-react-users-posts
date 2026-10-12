/**
 * CRUD de contactos contra la API REST (`/users` de DummyJSON).
 * Todas las llamadas viajan autenticadas vía `authFetch` (header Bearer).
 */
import { authFetch } from './auth';
import type { Contact, ContactInput } from '../types/api';

interface UsersResponse {
  users: Contact[];
  total: number;
}

const SELECT = 'id,firstName,lastName,email,phone';

/** Ver: lista de contactos. */
export async function fetchContacts(): Promise<Contact[]> {
  const data = await authFetch<UsersResponse>(`/users?limit=30&select=${SELECT}`);
  return data.users;
}

/** Agregar: crea un contacto. */
export async function createContact(input: ContactInput): Promise<Contact> {
  return authFetch<Contact>('/users/add', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Editar: actualiza un contacto por id. */
export async function updateContact(id: number, input: ContactInput): Promise<Contact> {
  return authFetch<Contact>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/** Eliminar: borra un contacto por id. */
export async function deleteContact(id: number): Promise<void> {
  await authFetch<unknown>(`/users/${id}`, { method: 'DELETE' });
}
