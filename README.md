# CodePath 🚀

> Plataforma web serverless para aprender fundamentos de programación en JavaScript e ingeniería de software, diseñada para hispanohablantes en LATAM.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

---

## ¿Qué es CodePath?

CodePath enseña programación desde cero mediante lecciones cortas, ejercicios validados automáticamente con test cases, y un sistema de gamificación (XP, rachas, badges) que mantiene la motivación. El contenido está íntegramente en español neutro para que sea accesible desde México hasta Argentina.

**Principios de diseño:**
- **Aprender haciendo:** cada lección termina en un ejercicio real, no un quiz de opciones múltiples
- **Feedback inmediato:** el código se ejecuta en el navegador (sandbox seguro) y el resultado llega en milisegundos
- **Progreso visible:** XP, rachas diarias y un mapa de progreso muestran exactamente dónde estás
- **Mobile-first:** el 70% del tráfico LATAM viene de celular — funciona desde 380px

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript estricto |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Estado global | Zustand |
| Estado del servidor | TanStack Query v5 |
| Editor de código | Monaco Editor |
| Ejecución de JS | Web Workers (sandbox seguro) |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (email + Google) |
| Hosting | Vercel |
| Analytics | PostHog + Vercel Analytics |
| Error tracking | Sentry |

---

## Setup Local

### Prerrequisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Cuenta de [Supabase](https://supabase.com) (gratuita)
- CLI de Supabase: `npm install -g supabase`

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/codepath.git
cd codepath
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Rellena los valores con tus credenciales de Supabase y PostHog (ver sección de variables más abajo).

### 3. Inicializar Supabase

```bash
# Inicializar proyecto Supabase local (opcional, para desarrollo offline)
supabase init
supabase start

# O apuntar a tu proyecto en la nube:
# Copia el schema en el SQL Editor de tu proyecto Supabase
# Archivo: supabase/migrations/001_initial_schema.sql
```

### 4. Aplicar schema y seed

```bash
# Si usas Supabase local:
supabase db push

# Si usas la nube: pega el contenido de estos archivos en el SQL Editor:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/seed.sql
```

### 5. Generar tipos de TypeScript

```bash
# Reemplaza PROJECT_ID con el ID de tu proyecto en supabase.com/dashboard
pnpm supabase:gen-types
# O manualmente:
supabase gen types typescript --project-id <PROJECT_ID> > src/shared/types/database.ts
```

### 6. Correr en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Variables de Entorno

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon pública | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo servidor) | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_POSTHOG_KEY` | API key de PostHog | PostHog → Project Settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host de PostHog | `https://app.posthog.com` |
| `SENTRY_DSN` | DSN de Sentry | Sentry → Project → Settings |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry (cliente) | Igual que arriba |

---

## Arquitectura

```
src/
├── app/                     # Next.js App Router
│   ├── (marketing)/         # Landing pública
│   ├── (auth)/              # Login, registro, recuperación
│   ├── (app)/               # Rutas autenticadas
│   └── api/                 # Route handlers (ejecución de código)
│
├── domain/                  # Lógica de negocio pura
│   ├── entities/            # User, Lesson, Exercise, Progress
│   ├── value-objects/       # XP, Streak, Level
│   ├── use-cases/           # CompleteLesson, ValidateExercise, etc.
│   └── ports/               # Interfaces (contratos)
│
├── infrastructure/          # Adaptadores externos
│   ├── supabase/            # Clientes browser + server + repositorios
│   ├── analytics/           # PostHog
│   └── code-execution/      # Web Worker + sandbox API
│
├── presentation/            # UI
│   ├── components/          # shadcn/ui + layout + shared
│   ├── features/            # Componentes por feature
│   ├── hooks/               # Hooks personalizados
│   └── stores/              # Zustand stores
│
└── shared/                  # Tipos, constantes, utils
```

El proyecto sigue **Clean Architecture**: el dominio no depende de nada externo. Los casos de uso reciben repositorios por inyección de dependencias, lo que hace el código testeable de forma aislada.

---

## Contenido Pedagógico (10 Módulos)

| # | Módulo | Lecciones | Ejercicios |
|---|--------|-----------|------------|
| 1 | Bienvenida al código | 3 | 6 |
| 2 | Variables y tipos en JS | 4 | 10 |
| 3 | Operadores y expresiones | 3 | 8 |
| 4 | Condicionales | 4 | 12 |
| 5 | Bucles | 4 | 12 |
| 6 | Funciones | 5 | 15 |
| 7 | Arrays y objetos | 5 | 15 |
| 8 | Pensamiento computacional | 3 | 9 |
| 9 | Intro a Ing. de Software | 4 | 6 |
| 10 | Capstone: To-Do App | 1 | 1 |

---

## Scripts

```bash
pnpm dev              # Servidor de desarrollo (Turbopack)
pnpm build            # Build de producción
pnpm start            # Iniciar build de producción
pnpm lint             # ESLint
pnpm type-check       # TypeScript sin emitir
pnpm test             # Vitest (unit + component)
pnpm test:e2e         # Playwright
pnpm test:coverage    # Cobertura con Vitest
pnpm supabase:gen-types  # Generar tipos desde Supabase
```

---

## Roadmap

### Semana 1 — Setup + Auth + Dashboard
- [x] Estructura del proyecto
- [x] Supabase Auth (email + Google)
- [x] Schema de base de datos
- [ ] Dashboard vacío con sidebar
- [ ] Onboarding flow

### Semana 2 — Sistema de Lecciones
- [x] Pilot lesson end-to-end
- [x] Monaco Editor integrado
- [x] Sandbox Web Worker
- [ ] Módulos 1-2 completos
- [ ] Markdown renderer con highlight

### Semana 3 — Gamificación
- [ ] Sistema de XP y niveles
- [ ] Rachas diarias con notificaciones
- [ ] Badges (8 iniciales)
- [ ] Mapa de progreso visual

### Semana 4 — Polish + Deploy
- [ ] Módulos 3-4 completos
- [ ] Perfil de usuario
- [ ] Leaderboard (Top 10)
- [ ] Deploy a Vercel + dominio custom
- [ ] PostHog funnels configurados

---

## Contribución

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b feat/mi-feature`
3. Haz tus cambios con tests
4. Asegúrate que pasan: `pnpm lint && pnpm type-check && pnpm test`
5. Abre un Pull Request describiendo qué cambia y por qué

**Convenciones de commits:** seguimos [Conventional Commits](https://www.conventionalcommits.org/).

---

## Licencia

MIT — ver [LICENSE](./LICENSE) para detalles.

---

Construido con ❤️ para la comunidad de programadores hispanohablantes.
