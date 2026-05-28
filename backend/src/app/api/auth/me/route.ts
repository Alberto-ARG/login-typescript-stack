import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function GET() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);
    return NextResponse.json({
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name,
    });
  } catch {
    // Token expirado, firma inválida, etc.
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
  }
}
