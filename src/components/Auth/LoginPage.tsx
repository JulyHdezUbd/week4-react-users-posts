import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { useAuth } from '../../context/useAuth';

export default function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (token) {
    return <Navigate to="/contacts" replace />;
  }

  const handleLogin = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/contacts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="narrow">
      <h2>Iniciar sesión</h2>
      <p className="muted">
        Cuenta demo: <code>emilys</code> / <code>emilyspass</code>
      </p>
      <LoginForm
        onLogin={(u, p) => {
          void handleLogin(u, p);
        }}
        loading={loading}
        error={error}
      />
    </div>
  );
}
