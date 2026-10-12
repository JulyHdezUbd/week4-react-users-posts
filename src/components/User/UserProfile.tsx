import { useUserContext } from "../../context/useUserContext";

export default function UserProfile() {
    const { user } = useUserContext();
    return (
    <div className="card">
    <h2>Mi perfil</h2>
    <div><strong>{user.name}</strong> (@{user.username})</div>
    <div className="muted">{user.email}</div>
    <div className="muted">{user.phone}</div>
    </div>)
}