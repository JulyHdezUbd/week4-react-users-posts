import { useState } from 'react';
import type { FormEvent } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

/** Formulario de inicio de sesión (controlado). */
export default function LoginForm({ onLogin, loading = false, error = null }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="field">
        <label htmlFor="login-user">Usuario</label>
        <input
          id="login-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          placeholder="emilys"
        />
      </div>
      <div className="field">
        <label htmlFor="login-pass">Contraseña</label>
        <input
          id="login-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••"
        />
      </div>
      {error ? (
        <p role="alert" className="error">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
