import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export const COOKIE_NAME = 'auth_token';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-change-me',
);

export interface SessionPayload extends JWTPayload {
  sub: string; // id del usuario
  email: string;
  name: string;
}

export async function signToken(
  payload: Omit<SessionPayload, keyof JWTPayload>,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify<SessionPayload>(token, secret);
  return payload;
}

/** Opciones de la cookie de sesión (httpOnly, no accesible desde JS del cliente). */
export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};
