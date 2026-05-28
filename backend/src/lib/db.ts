import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';

export interface UserRow {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

function createDb(): Database.Database {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const db = new Database(path.join(dataDir, 'app.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT UNIQUE NOT NULL,
      name          TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedAdmin(db);
  return db;
}

function seedAdmin(db: Database.Database): void {
  const email = 'admin@demo.com';
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return;
  const hash = bcrypt.hashSync('123456', 10);
  db.prepare(
    'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
  ).run(email, 'Admin Demo', hash);
  console.log('[db] Usuario semilla creado: admin@demo.com / 123456');
}

// En dev, Next.js recarga los módulos en caliente. Reusamos una única conexión
// guardándola en globalThis para no abrir una nueva en cada recarga.
const globalForDb = globalThis as unknown as { __db?: Database.Database };
const db = globalForDb.__db ?? createDb();
if (process.env.NODE_ENV !== 'production') globalForDb.__db = db;

export default db;
