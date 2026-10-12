import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <nav className="nav">
        <span className="brand">Week4 · Lab6</span>
        <Link to="/users">Usuarios</Link>
        <Link to="/contacts">Contactos</Link>
        <Link to="/profile">Perfil</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}