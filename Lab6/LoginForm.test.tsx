import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import LoginForm from '../src/components/LoginForm';

describe('LoginForm', () => {
  it('muestra los campos Usuario, Contraseña y el botón', () => {
    render(<LoginForm onLogin={() => {}} />);
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('permite escribir usuario y contraseña', () => {
    render(<LoginForm onLogin={() => {}} />);
    const userInput = screen.getByLabelText(/usuario/i);
    const passInput = screen.getByLabelText(/contraseña/i);
    fireEvent.change(userInput, { target: { value: 'emilys' } });
    fireEvent.change(passInput, { target: { value: 'emilyspass' } });
    expect(userInput).toHaveValue('emilys');
    expect(passInput).toHaveValue('emilyspass');
  });

  it('llama a onLogin con los valores al enviar', () => {
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText(/usuario/i), { target: { value: 'emilys' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'emilyspass' } });
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onLogin).toHaveBeenCalledWith('emilys', 'emilyspass');
  });

  it('desactiva el botón y muestra Cargando cuando loading es true', () => {
    render(<LoginForm onLogin={() => {}} loading={true} />);
    const btn = screen.getByRole('button', { name: /cargando/i });
    expect(btn).toBeDisabled();
  });

  it('muestra el mensaje de error en role=alert', () => {
    render(<LoginForm onLogin={() => {}} error="Usuario o contraseña incorrectos" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Usuario o contraseña incorrectos');
  });

  it('el campo contraseña es type=password', () => {
    render(<LoginForm onLogin={() => {}} />);
    expect(screen.getByLabelText(/contraseña/i)).toHaveAttribute('type', 'password');
  });
});
