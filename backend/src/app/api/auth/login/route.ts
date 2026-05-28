import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db, { type UserRow } from '@/lib/db';
import { signToken, cookieOptions, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y contraseña son obligatorios' },
      { status: 400 },
    );
  }

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as UserRow | undefined;

  // Mismo mensaje genérico para usuario inexistente o contraseña incorrecta:
  // evita filtrar qué emails están registrados.
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 },
    );
  }

  const token = await signToken({
    sub: String(user.id),
    email: user.email,
    name: user.name,
  });

  const res = NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  res.cookies.set(COOKIE_NAME, token, cookieOptions);
  return res;
}
