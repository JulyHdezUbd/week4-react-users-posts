import type { Contact } from '../types/api';

interface ContactListProps {
  contacts: Contact[];
  deletingId?: number | null;
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
}

/** Ver: lista de contactos con acciones editar / eliminar. */
export default function ContactList({
  contacts,
  deletingId = null,
  onEdit,
  onDelete,
}: ContactListProps) {
  if (contacts.length === 0) {
    return <p>No hay contactos todavía. Agrega el primero.</p>;
  }

  return (
    <ul aria-label="lista-contactos" className="list">
      {contacts.map((c) => (
        <li key={c.id}>
          <div>
            <strong>
              {c.firstName} {c.lastName}
            </strong>
            <div className="muted">{c.email}</div>
            <div className="muted">{c.phone}</div>
          </div>
          <div className="row">
            <button type="button" className="secondary" onClick={() => onEdit(c)}>
              Editar
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(c.id)}
              disabled={deletingId === c.id}
            >
              {deletingId === c.id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
