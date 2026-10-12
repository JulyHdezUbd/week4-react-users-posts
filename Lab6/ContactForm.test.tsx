import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import ContactForm from '../src/components/ContactForm';

const noop = () => {};

describe('ContactForm', () => {
  it('muestra los campos Nombre, Apellido, Email, Teléfono y Guardar', () => {
    render(<ContactForm onSubmit={noop} onCancel={noop} />);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar contacto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('precarga los valores iniciales en modo edición', () => {
    render(
      <ContactForm
        initial={{ firstName: 'Emily', lastName: 'Johnson', email: 'emily@x.com', phone: '123' }}
        onSubmit={noop}
        onCancel={noop}
      />,
    );
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Emily');
    expect(screen.getByLabelText(/apellido/i)).toHaveValue('Johnson');
    expect(screen.getByLabelText(/email/i)).toHaveValue('emily@x.com');
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue('123');
  });

  it('bloquea el envío y muestra alerta si falta un campo', () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} onCancel={noop} />);
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Emily' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar contacto/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/completa todos/i);
  });

  it('llama a onSubmit con los valores recortados al enviar válido', () => {
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} onCancel={noop} />);
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: '  Emily ' } });
    fireEvent.change(screen.getByLabelText(/apellido/i), { target: { value: 'Johnson' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'emily@x.com' } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '555-1234' } });
    fireEvent.click(screen.getByRole('button', { name: /guardar contacto/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily@x.com',
      phone: '555-1234',
    });
  });

  it('muestra el error del servidor en role=alert', () => {
    render(<ContactForm onSubmit={noop} onCancel={noop} serverError="Error de la API (500)" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error de la API (500)');
  });

  it('desactiva Guardar y muestra Guardando cuando submitting es true', () => {
    render(<ContactForm onSubmit={noop} onCancel={noop} submitting={true} />);
    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
  });

  it('Cancelar llama a onCancel', () => {
    const onCancel = vi.fn();
    render(<ContactForm onSubmit={noop} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
