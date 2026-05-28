# Auth Demo — Next.js + SQLite + Astro/React

Ejemplo de login completo con **dos apps separadas**:

| Carpeta     | Stack                          | Puerto | Rol                          |
| ----------- | ------------------------------ | ------ | ---------------------------- |
| `backend/`  | Next.js 15 (App Router) + SQLite | 3000   | API de autenticación + datos |
| `frontend/` | Astro 5 + React 19             | 4321   | UI (login, registro, dashboard) |

## Cómo funciona la autenticación

1. El usuario envía email/contraseña al backend.
2. El backend verifica contra SQLite (contraseñas hasheadas con **bcrypt**).
3. Si es válido, firma un **JWT (jose, HS256)** y lo devuelve en una cookie
   **httpOnly** (`auth_token`) — no accesible desde el JS del navegador, lo que
   protege contra XSS.
4. Las rutas protegidas (`/api/auth/me`) leen y verifican esa cookie.

El frontend Astro **proxea `/api` hacia el backend** (ver `astro.config.mjs`),
así el navegador ve todo en el mismo origen (`localhost:4321`): la cookie queda
como first-party (`SameSite=Lax`) y no hace falta configurar CORS.

## Cómo levantarlo

Necesitás **dos terminales**.

### 1) Backend

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
```

La primera vez crea `backend/data/app.db` y siembra un usuario de prueba:

```
admin@demo.com / 123456
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:4321
```

Abrí **http://localhost:4321** y entrá con el usuario de prueba (o registrá uno
nuevo).

## Endpoints del backend

| Método | Ruta                 | Descripción                          |
| ------ | -------------------- | ------------------------------------ |
| POST   | `/api/auth/register` | Crea usuario y deja la sesión activa |
| POST   | `/api/auth/login`    | Valida credenciales y setea cookie   |
| POST   | `/api/auth/logout`   | Borra la cookie de sesión            |
| GET    | `/api/auth/me`       | Devuelve el usuario actual (protegido) |

## Notas para producción

- Definí `JWT_SECRET` (ver `backend/.env.example`) con un valor largo y aleatorio.
- En producción la cookie usa `Secure` automáticamente (requiere HTTPS).
- El guard del dashboard es del lado del cliente (suficiente para el demo).
  Para protección real-real conviene además validar la sesión en el servidor
  (middleware de Next.js o SSR en Astro reenviando la cookie).

## Docker + Nginx (un solo puerto publico)

Ahora hay un `nginx` al frente para exponer **solo un puerto** al host:

- `nginx`: `http://localhost` (puerto 80)
- `frontend`: interno en `frontend:4321` (no expuesto al host)
- `backend`: interno en `backend:3000` (no expuesto al host)

Levantar todo:

```bash
docker compose up --build
```

Abrir la app en:

```text
http://localhost
```
