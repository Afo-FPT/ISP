# SIMS-AI Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Backend

```bash
cd apps/backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/sims_ai?schema=public"

# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate
```

### 3. Setup Frontend

```bash
cd apps/frontend

# Copy environment file (if needed)
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Build API Contract Package

```bash
cd packages/api-contract
pnpm build
```

### 5. Run Development Servers

From root directory:

```bash
# Run both frontend and backend
pnpm dev

# Or run separately:
pnpm dev:frontend  # Frontend on http://localhost:3000
pnpm dev:backend   # Backend on http://localhost:3001
```

## Project Structure Summary

```
sims-ai/
├── apps/
│   ├── backend/              ✅ MVC structure ready
│   │   ├── src/
│   │   │   ├── controllers/  ✅ Request/Response handlers
│   │   │   ├── services/     ✅ Business logic
│   │   │   ├── repositories/ ✅ Database access
│   │   │   ├── models/       ✅ Domain entities
│   │   │   ├── validators/   ✅ Request validation
│   │   │   └── lib/          ✅ Utilities & Prisma
│   │   └── prisma/           ✅ Database schema
│   │
│   └── frontend/             ✅ Next.js structure ready
│       ├── src/
│       │   ├── app/          ✅ Next.js pages
│       │   ├── components/   ✅ React components (copied)
│       │   ├── services/     ✅ API clients
│       │   ├── hooks/        ✅ Custom hooks
│       │   ├── types/        ✅ TypeScript types
│       │   └── lib/          ✅ Utilities
│
├── packages/
│   └── api-contract/         ✅ Shared DTOs
│       ├── dto/              ✅ Zod schemas
│       └── openapi.yaml      ✅ API specification
│
└── docs/                     ✅ Documentation folders
    ├── ERD/
    ├── ClassDiagram/
    └── SRS/
```

## Next Steps

1. **Define your database schema** in `apps/backend/prisma/schema.prisma`
2. **Create DTOs** in `packages/api-contract/dto/` for your entities
3. **Build backend features** following the MVC pattern:
   - Repository → Service → Controller → Route
4. **Build frontend features**:
   - Service → Hook → Component
5. **Update OpenAPI spec** in `packages/api-contract/openapi.yaml`

## Architecture Rules Reminder

✅ **DO:**
- Put business logic in services
- Access database only via repositories
- Use shared DTOs from api-contract
- Validate requests with Zod

❌ **DON'T:**
- Access database from frontend
- Put business logic in controllers
- Access database directly from services
- Define DTOs outside api-contract

See `ARCHITECTURE.md` for detailed documentation.

