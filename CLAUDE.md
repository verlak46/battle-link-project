# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Battle Link is a wargaming social platform with two sub-projects:
- **`battle-link/`** — Angular 21 + Ionic 8 frontend (PWA/mobile app)
- **`battle-link-api/`** — NestJS + MongoDB (Mongoose) backend

## Commands

### Frontend (`battle-link/`)

```bash
# Local dev (API at localhost:3000)
npm run start:local

# Dev server (API at deployed backend)
npm run start:dev

# Run all tests (Vitest + jsdom via @angular/build:unit-test)
npm test

# Run a single test file
npx ng test --include="**/login.spec.ts"

# Build for production
npm run build:prod
```

### Backend (`battle-link-api/`)

```bash
# Local dev with hot reload
npm run start:local        # uses .env.local
npm run start:dev          # uses .env

# Build + production
npm run build
npm start

# Swagger UI (while dev server is running)
# http://localhost:3000/api/docs
```

The backend requires a `.env` or `.env.local` file with `MONGO_URI` and `JWT_SECRET`. Firebase credentials are loaded from `data/serviceAccountKey.json`.

## Architecture

### Frontend

**Environment configs** in `src/environments/` drive the API URL and Firebase config. `environment.local.ts` points to `localhost:3000`; `environment.ts` (default/prod) points to the deployed API on Render.

**Auth flow:**
1. Firebase is initialized once in `app.config.ts` (exported `auth` and `firestore` instances used across the app).
2. `AuthService` (`core/services/auth.service.ts`) manages a JWT session stored in `localStorage` under key `battle-link-auth`. It exposes a `user` signal and a `ready` Promise that resolves after session restore.
3. `authGuard` waits on `auth.ready` before evaluating; redirects unauthenticated users to `/login` and users without completed onboarding to `/onboarding`. `guestGuard` is the inverse — it protects `/login` by redirecting already-authenticated users to `/` or `/onboarding`.
4. `authInterceptor` automatically attaches `Authorization: Bearer <token>` to all non-auth API requests.
5. Google login uses Firebase popup → gets an ID token → sends it to `/api/auth/google` → receives a custom JWT → Firebase session is immediately signed out (Firebase is only used as an OAuth bridge).

**Routing:** Lazy-loaded standalone components. Main app shell is a tabs layout (`layout/tabs/`) with five tabs: `mapa`, `buscar`, `nuevo`, `chat`, `perfil`. Outside the tabs shell: `login`, `onboarding`, `forgot-password`, and `reset-password` (the last one reads a `?token=` query param).

**`ApiService`** (`core/services/api.service.ts`) is the single HTTP client wrapper for all backend calls. All types for the API (AuthUser, Wargame, etc.) are defined there or in `shared/models/`.

### Backend

**NestJS modular structure** under `src/`:
- `auth/` — `AuthModule`: login con Google (Firebase ID token), registro y login local. DTOs con `class-validator`. `JwtStrategy` (passport-jwt) valida tokens en rutas protegidas.
- `users/` — `UsersModule`: perfil, onboarding y actualización de datos. Exporta el modelo `User` para que `AuthModule` pueda usarlo.
- `wargames/` — `WargamesModule`: listado de wargames.
- `common/` — `JwtAuthGuard`, `@CurrentUser()` decorator, `ResponseInterceptor` (envuelve respuestas en `{ statusCode, message, data }`), `HttpExceptionFilter` (errores uniformes).
- `config/` — validación del `.env` con Joi al arrancar; inicialización de Firebase Admin como singleton.

**API base paths:** `/api/auth`, `/api/user`, `/api/wargames` (prefijo `/api` en `main.ts`)

**Auth strategy:** `@nestjs/jwt` + `passport-jwt`. Google OAuth verifica el Firebase ID token con `firebase-admin` (credenciales en `data/serviceAccountKey.json`) y devuelve un JWT propio. Contraseñas hasheadas con `bcrypt`.

**User schema** tiene índice `2dsphere` en `location`. `favoriteGames` almacena strings con el `id` del modelo `Wargame` (ej. `"warhammer40k"`), no ObjectIds.

**File naming:** Feature components use `feature-name.ts` / `.html` / `.scss` without a `.component` infix (e.g., `login.ts`, not `login.component.ts`). Specs mirror the source file name (e.g., `login.spec.ts`).

## Angular Coding Standards (from `angular-20.mdc`)

- **Standalone components only** — no NgModules. Do not write `standalone: true` explicitly (it's implied).
- **Signals** for local/shared state; `computed()` for derived state. Never use `mutate()` — use `update()` or `set()`.
- **`inject()` function** over constructor injection.
- **`input()` / `output()` functions** over `@Input()` / `@Output()` decorators.
- **`ChangeDetectionStrategy.OnPush`** on all components.
- **Native control flow** (`@if`, `@for`, `@switch`) — not `*ngIf`, `*ngFor`.
- **Native class/style bindings** — not `[ngClass]` or `[ngStyle]`.
- Avoid `any`; prefer strict types. Use `unknown` when type is uncertain.
- Lazy-load all feature routes.
