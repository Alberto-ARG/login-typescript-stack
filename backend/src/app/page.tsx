export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Auth Demo · Backend</h1>
      <p>Servidor de API Next.js + SQLite. Endpoints disponibles:</p>
      <ul>
        <li>
          <code>POST /api/auth/register</code> — registro
        </li>
        <li>
          <code>POST /api/auth/login</code> — inicio de sesión
        </li>
        <li>
          <code>POST /api/auth/logout</code> — cierre de sesión
        </li>
        <li>
          <code>GET /api/auth/me</code> — usuario actual (protegido)
        </li>
      </ul>
      <p>El frontend (Astro + React) corre por separado en el puerto 4321.</p>
    </main>
  );
}
