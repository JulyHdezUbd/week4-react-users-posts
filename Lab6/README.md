# Lab6 — Actividad #1: Aplicación React Lista para Producción

> **URL de la aplicación en producción:** _(pendiente — completar después del deploy)_

Todo el trabajo está integrado en este único proyecto (`week4-react-users-posts`).
Esta carpeta `Lab6/` contiene la **suite de pruebas** del entregable + este README.

## Qué se agregó al proyecto

**Agenda de contactos** (agregar, ver, editar, eliminar: nombre, apellido, teléfono, email):

- Rutas nuevas en `src/App.tsx`: `/login` y `/contacts` (protegida con `ProtectedRoute`).
- `src/services/auth.ts` — login/logout/token contra API REST real (DummyJSON):
  1. `POST /auth/login` → guarda `accessToken` en `localStorage`.
  2. `authFetch()` envía `Authorization: Bearer <token>` en cada request CRUD.
  3. Ante `401` limpia la sesión; `logout()` borra el token.
- `src/services/contacts.ts` — CRUD (`GET/POST /users`, `PUT/DELETE /users/:id`).
- `src/context/AuthContext*` + `src/hooks/useContacts.ts` (hook personalizado).
- `src/components/`: `LoginForm`, `ContactForm`, `ContactList`, `ProtectedRoute`,
  `Auth/LoginPage`, `Contacts/ContactsPage`.
- Cuenta demo: `emilys` / `emilyspass`.

## Pruebas (en esta carpeta, `fetch` simulado)

| Archivo | Qué cubre |
|---|---|
| `LoginForm.test.tsx` (6) | render campos, escritura, submit con valores, loading, error, type=password |
| `ContactForm.test.tsx` (7) | render, precarga en edición, validación bloquea envío, submit recortado, error servidor, submitting, cancelar |
| `ContactList.test.tsx` (5) | render datos, estado vacío, editar, eliminar, estado eliminando |
| `useContacts.test.tsx` (5) | carga inicial, error API, add, update, remove (hook personalizado) |
| `auth.test.ts` (6) | login guarda token, login falla, logout, clearSession, header Bearer, 401 limpia sesión |

```bash
npm test    # 29 tests, 5 archivos
npm run build
```

Nota: se usa **Vitest** (misma API que Jest: `describe/it/expect/vi.fn()`),
porque el proyecto es Vite — Jest puro no encaja sin babel extra.
Mismo setup ya usado en `test-react/`.

## Deploy

**Netlify:** Build `npm run build` · Publish `dist` (ver `netlify.toml` en la raíz —
ya incluye redirect SPA `/* → /index.html`).

**Vercel:** Framework `Vite` (ver `vercel.json` en la raíz para rewrites SPA).

Después del deploy, pegar la URL pública al inicio de este README (entregable).
