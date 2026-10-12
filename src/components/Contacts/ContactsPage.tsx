import { useState } from 'react';
import ContactForm from '../ContactForm';
import ContactList from '../ContactList';
import { useAuth } from '../../context/useAuth';
import { useContacts } from '../../hooks/useContacts';
import type { Contact, ContactInput } from '../../types/api';

function toInput(c: Contact): ContactInput {
  return { firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone };
}

/** Agenda Lab6: ver, agregar, editar y eliminar contactos (requiere login). */
export default function ContactsPage() {
  const { user, logout } = useAuth();
  const { contacts, loading, error, reload, add, update, remove } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const openNew = (): void => {
    setEditing(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (contact: Contact): void => {
    setEditing(contact);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = (): void => {
    setShowForm(false);
    setEditing(null);
    setFormError(null);
  };

  const handleSubmit = async (input: ContactInput): Promise<void> => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editing) {
        await update(editing.id, input);
      } else {
        await add(input);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar el contacto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    setDeletingId(id);
    setActionError(null);
    try {
      await remove(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo eliminar el contacto');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="header">
        <div>
          <h2>Contactos</h2>
          <p className="muted">
            Hola, {user?.firstName ?? 'usuario'} ({user?.username ?? ''})
          </p>
        </div>
        <button type="button" className="secondary" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <button type="button" onClick={openNew}>
        Agregar contacto
      </button>

      {loading ? <p>Cargando contactos...</p> : null}
      {error ? (
        <p role="alert" className="error">
          {error}{' '}
          <button
            type="button"
            className="secondary"
            onClick={() => {
              void reload();
            }}
          >
            Reintentar
          </button>
        </p>
      ) : null}
      {actionError ? (
        <p role="alert" className="error">
          {actionError}
        </p>
      ) : null}

      {!loading && !error ? (
        <ContactList
          contacts={contacts}
          deletingId={deletingId}
          onEdit={openEdit}
          onDelete={(id) => {
            void handleDelete(id);
          }}
        />
      ) : null}

      {showForm ? (
        <div>
          <h3>{editing ? 'Editar contacto' : 'Nuevo contacto'}</h3>
          <ContactForm
            initial={editing ? toInput(editing) : undefined}
            submitting={submitting}
            serverError={formError}
            onSubmit={(input) => {
              void handleSubmit(input);
            }}
            onCancel={closeForm}
          />
        </div>
      ) : null}
    </div>
  );
}
