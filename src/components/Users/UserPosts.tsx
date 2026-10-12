import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserPosts } from '../../services/api';
import type { Post } from '../../types/api';

export default function UserPosts() {
  const { id } = useParams<{ id: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchUserPosts(Number(id))
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Cargando posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h2>Posts del Usuario {id}</h2>
      <Link to="/users">← Volver a usuarios</Link>
      <ul className="list">
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}