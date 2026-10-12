import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ContactInput } from '../types/api';

interface ContactFormProps {
  initial?: ContactInput;
  submitting?: boolean;
  serverError?: string | null;
  onSubmit: (input: ContactInput) => void;
  onCancel: () => void;
}

const EMPTY: ContactInput = { firstName: '', lastName: '', email: '', phone: '' };

/** Formulario de alta/edición de contacto con validación de requeridos. */
export default function ContactForm({
  initial = EMPTY,
  submitting = false,
  serverError = null,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Completa todos los campos');
      return;
    }
    setFormError(null);
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  const message = formError ?? serverError;

  return (
    <form onSubmit={handleSubmit} aria-label="formulario-contacto" className="card">
      <div className="field">
        <label htmlFor="contact-first">Nombre</label>
        <input id="contact-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="contact-last">Apellido</label>
        <input id="contact-last" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="contact-phone">Teléfono</label>
        <input
          id="contact-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      {message ? (
        <p role="alert" className="error">
          {message}
        </p>
      ) : null}
      <div className="row">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar contacto'}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
