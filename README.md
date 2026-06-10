# user-service — Servicio de Perfiles

Microservicio NestJS que gestiona los **perfiles de usuario** (datos personales + `monthly_income`).
Complementa a `user-login`: este último crea la cuenta/identidad; aquí se guardan los datos del cliente.

- **Puerto:** 3000 · **Prefijo:** `/api/v1` · **Swagger:** http://localhost:3000/api/docs
- **BD:** PostgreSQL `user-service-db` (puerto host 5432)
- **Auth:** actualmente **no valida JWT** (se confía en la red interna / gateway). Si se añade,
  `JWT_SECRET` debe coincidir con el resto.

## Rol dentro del sistema
```
frontend ─► POST /profiles (tras registrarse en user-login)
loan-service ─► GET /profiles/:id            (capacidad de endeudamiento)
admin-service ─► GET /profiles, /profiles/document/:doc  (métricas / análisis)
```
Es **consumido** por loan-service y admin-service vía HTTP. No llama a otros servicios.

## Entidad `Profile`
`id_profile` (UUID), `id_user` (UUID → user-login), `first_name`, `last_name`, `document_type`,
`document_number`, `phone` (único, normalizado a `+57XXXXXXXXXX`), `address`,
`monthly_income` (decimal, usado por el análisis crediticio).

## Endpoints (`/api/v1/profiles`)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/profiles` | Lista (paginación `page`/`limit`) |
| POST | `/profiles` | Crea perfil (valida documento/teléfono únicos, normaliza teléfono) |
| GET | `/profiles/validate/document/:documentNumber` | ¿Documento disponible? |
| GET | `/profiles/validate/phone/:phone` | ¿Teléfono disponible? |
| GET | `/profiles/document/:documentNumber` | Buscar por documento |
| GET | `/profiles/phone/:phone` | Buscar por teléfono |
| GET | `/profiles/:id` | Obtener por `id_user` |
| PUT | `/profiles/:id` | Actualizar datos editables |
| GET | `/health/liveness` · `/health/readiness` | Healthchecks (readiness verifica BD) |

Respuestas con forma `{ message, data }`.

## Funciones básicas / reglas
- Normalización colombiana de teléfono: 10 dígitos → `+57XXXXXXXXXX` (regex `^\+57\d{10}$`).
- Unicidad de documento y teléfono al crear y actualizar.
- **Validación de disponibilidad fiable:** `validate/document` y `validate/phone` ya **no** devuelven
  `available:true` ante errores de BD (antes ocultaban fallos); un error real propaga 500.

## Variables de entorno (ver `.env.example`)
`NODE_ENV`, `PORT=3000`, `DATABASE_*`, `CORS_ORIGINS`, `THROTTLE_TTL`, `THROTTLE_LIMIT`.

## Cómo testear
Vía `../loans-software` (`docker compose up`) o standalone:
```bash
npm install && cp .env.example .env && npm run start:dev
npm run build
```
```bash
# Crear perfil (id_user = el devuelto por user-login al registrar)
curl -X POST http://localhost:3000/api/v1/profiles -H "Content-Type: application/json" \
  -d '{"id_user":"<UUID>","first_name":"Juan","last_name":"Perez","document_type":"CC","document_number":"1020304050","phone":"3001234567","address":"Calle 1"}'
curl http://localhost:3000/api/v1/profiles/validate/document/1020304050
```

## Notas para nuevos administradores del código
- Estructura hexagonal: `domain/` (entidad + ports), `application/services/profile.service.ts`
  (lógica + normalización), `infrastructure/adapters/in` (controller) / `out` (repositorio TypeORM).
- `synchronize` ya viene en `false`; en dev las tablas se crean por el ciclo de TypeORM/migraciones.
- Cross-cutting activo: throttler, helmet, logs pino, healthchecks terminus, versionado `/api/v1`.
