import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db, { type UserRow } from '@/lib/db';
import { signToken, cookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  let body: { email?: string; name?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const password = body.password;

  if (!email || !name || !password) {
    return NextResponse.json(
      { error: 'Nombre, email y contraseña son obligatorios' },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos 6 caracteres' },
      { status: 400 },
    );
  }

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email) as Pick<UserRow, 'id'> | undefined;
  if (existing) {
    return NextResponse.json(
      { error: 'Ya existe un usuario con ese email' },
      { status: 409 },
    );
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')
    .run(email, name, hash);

  const id = Number(result.lastInsertRowid);
  const token = await signToken({ sub: String(id), email, name });

  // Registro exitoso => dejamos al usuario logueado seteando la cookie.
  const res = NextResponse.json({ id, email, name }, { status: 201 });
  res.cookies.set(COOKIE_NAME, token, cookieOptions);
  return res;
}
