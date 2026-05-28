import { useEffect, useState } from 'react';
import { api, type AuthUser } from '../lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Guard de ruta del lado del cliente: pedimos /api/auth/me y si no hay
  // sesión válida redirigimos al login.
  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = '/';
      });
  }, []);

  async function handleLogout() {
    await api.logout();
    window.location.href = '/';
  }

  if (loading) {
    return <p className="muted">Verificando sesión…</p>;
  }

  return (
    <div>
      <h1>Hola, {user?.name} 👋</h1>
      <p className="muted" style={{ textAlign: 'left' }}>
        Estás viendo una ruta protegida. Tus datos de sesión:
      </p>
      <pre
        style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: '0.8rem',
          fontSize: '0.8rem',
          overflowX: 'auto',
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
      <button className="secondary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
