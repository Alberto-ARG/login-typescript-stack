/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 es un módulo nativo: no debe ser empaquetado por el bundler,
  // se carga directamente desde node_modules en el servidor.
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
