# Actividad #1 — Aplicación React Lista para Producción



Agenda de **contactos** (agregar, ver, editar, eliminar: nombre, apellido, teléfono, email)
con autenticación por token contra API REST real, suite de pruebas y lista para deploy.

Cuenta demo: `emilys` / `emilyspass`

## Qué incluye

- Rutas: `/login`, `/contacts` (protegida), `/users`, `/users/:id/posts`, `/profile`.
- Auth con token (`src/services/auth.ts`): login guarda `accessToken` en `localStorage`,
  cada request sale con `Authorization: Bearer`, 401 limpia la sesión, logout borra el token.
- CRUD de contactos (`src/services/contacts.ts`, `src/hooks/useContacts.ts`).
- Pruebas en `Lab6/` (29 tests, `fetch` simulado): `LoginForm`, `ContactForm`,
  `ContactList`, hook `useContacts`, servicio `auth`.

## Comandos

```bash
npm install
npm run dev    # desarrollo
npm test       # pruebas
npm run build  # producción
```
