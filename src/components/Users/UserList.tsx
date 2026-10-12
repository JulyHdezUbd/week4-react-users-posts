import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../services/api';
import type { User } from '../../types/api';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul className="list">
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}/posts`}>
              {user.name} (@{user.username})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}