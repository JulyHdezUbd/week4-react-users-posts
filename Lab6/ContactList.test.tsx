import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ContactList from '../src/components/ContactList';
import type { Contact } from '../src/types/api';

const CONTACTS: Contact[] = [
  { id: 1, firstName: 'Emily', lastName: 'Johnson', email: 'emily@x.com', phone: '111' },
  { id: 2, firstName: 'Michael', lastName: 'Smith', email: 'michael@x.com', phone: '222' },
];

const noopEdit = () => {};
const noopDelete = () => {};

describe('ContactList', () => {
  it('muestra nombre, email y teléfono de cada contacto', () => {
    render(<ContactList contacts={CONTACTS} onEdit={noopEdit} onDelete={noopDelete} />);
    const list = screen.getByRole('list', { name: /lista-contactos/i });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Emily Johnson')).toBeInTheDocument();
    expect(screen.getByText('emily@x.com')).toBeInTheDocument();
    expect(screen.getByText('111')).toBeInTheDocument();
    expect(screen.getByText('Michael Smith')).toBeInTheDocument();
  });

  it('muestra estado vacío cuando no hay contactos', () => {
    render(<ContactList contacts={[]} onEdit={noopEdit} onDelete={noopDelete} />);
    expect(screen.getByText(/no hay contactos/i)).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: /lista-contactos/i })).not.toBeInTheDocument();
  });

  it('Editar llama a onEdit con el contacto', () => {
    const onEdit = vi.fn();
    render(<ContactList contacts={CONTACTS} onEdit={onEdit} onDelete={noopDelete} />);
    fireEvent.click(screen.getAllByRole('button', { name: /editar/i })[0]);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(CONTACTS[0]);
  });

  it('Eliminar llama a onDelete con el id', () => {
    const onDelete = vi.fn();
    render(<ContactList contacts={CONTACTS} onEdit={noopEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[1]);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it('desactiva Eliminar y muestra Eliminando en el contacto en borrado', () => {
    render(<ContactList contacts={CONTACTS} deletingId={1} onEdit={noopEdit} onDelete={noopDelete} />);
    expect(screen.getByRole('button', { name: /eliminando/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /^eliminar$/i })).toBeEnabled();
  });
});
