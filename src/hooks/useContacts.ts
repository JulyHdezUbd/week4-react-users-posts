import { useCallback, useEffect, useState } from 'react';
import { createContact, deleteContact, fetchContacts, updateContact } from '../services/contacts';
import type { Contact, ContactInput } from '../types/api';

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Error desconocido';
}

/**
 * Hook personalizado que centraliza el estado de la agenda:
 * carga inicial, alta, edición y baja de contactos.
 */
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      setContacts(await fetchContacts());
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async (input: ContactInput): Promise<Contact> => {
    const created = await createContact(input);
    setContacts((prev) => [created, ...prev]);
    return created;
  };

  const update = async (id: number, input: ContactInput): Promise<Contact> => {
    const updated = await updateContact(id, input);
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const remove = async (id: number): Promise<void> => {
    await deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return { contacts, loading, error, reload: load, add, update, remove };
}
