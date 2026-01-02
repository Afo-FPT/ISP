# Layer Responsibilities - Quick Reference

## Backend Layers

### 🎮 Controllers (`apps/backend/src/controllers/`)
**What they do:**
- Handle HTTP requests and responses
- Extract data from request (params, body, query)
- Call service methods
- Return formatted responses

**What they DON'T do:**
- ❌ Access database
- ❌ Implement business logic
- ❌ Validate data (use validators)

---

### 💼 Services (`apps/backend/src/services/`)
**What they do:**
- Contain ALL business logic
- Coordinate between controllers and repositories
- Handle external integrations (n8n webhooks)
- Transform and validate data
- Enforce business rules

**What they DON'T do:**
- ❌ Access database directly (use repositories)
- ❌ Handle HTTP requests/responses

---

### 🗄️ Repositories (`apps/backend/src/repositories/`)
**What they do:**
- ONLY layer that accesses database
- Use Prisma client
- Return domain models
- Handle database queries

**What they DON'T do:**
- ❌ Implement business logic
- ❌ Handle HTTP requests/responses
- ❌ Validate beyond database constraints

---

### 📋 Models (`apps/backend/src/models/`)
**What they do:**
- Define domain entities
- Represent business objects
- Type definitions

---

### 📦 DTOs (`apps/backend/src/dtos/`)
**What they do:**
- Import DTOs from `@sims-ai/api-contract`
- Re-export for convenience

**Note:** DTOs are defined in `packages/api-contract`, not here!

---

### ✅ Validators (`apps/backend/src/validators/`)
**What they do:**
- Validate incoming request data
- Use Zod schemas from api-contract
- Return validation errors

**What they DON'T do:**
- ❌ Implement business logic
- ❌ Access database

---

### 🛠️ Lib (`apps/backend/src/lib/`)
**What they do:**
- Shared utilities
- Configuration
- Prisma client instance
- External service clients

---

## Frontend Layers

### 📱 App (`apps/frontend/src/app/`)
**What they do:**
- Next.js App Router pages
- Route definitions
- Layouts

---

### 🧩 Components (`apps/frontend/src/components/`)
**What they do:**
- Reusable React components
- UI components
- Presentational components

---

### 🌐 Services (`apps/frontend/src/services/`)
**What they do:**
- API client functions
- HTTP request handling
- Use DTOs from api-contract
- Handle API errors

---

### 🪝 Hooks (`apps/frontend/src/hooks/`)
**What they do:**
- Custom React hooks
- Reusable stateful logic
- API data fetching

---

### 📝 Types (`apps/frontend/src/types/`)
**What they do:**
- Frontend-specific TypeScript types
- Component prop types

---

### 🛠️ Lib (`apps/frontend/src/lib/`)
**What they do:**
- Helper functions
- Configuration
- Constants
- Utilities

---

## Shared Package

### 📄 API Contract (`packages/api-contract/`)
**What they do:**
- Define shared DTOs
- Zod schemas for validation
- TypeScript types
- OpenAPI specification
- Ensure type safety across monorepo

**Used by:**
- Backend: For validation and type safety
- Frontend: For API calls and type safety

---

## Data Flow Example

```
User Action
    ↓
Frontend Component
    ↓
Frontend Service (API call)
    ↓
Backend Route
    ↓
Validator (Zod validation)
    ↓
Controller (extract data)
    ↓
Service (business logic)
    ↓
Repository (database access)
    ↓
Prisma (database)
    ↓
Repository (return model)
    ↓
Service (transform data)
    ↓
Controller (format response)
    ↓
Frontend Service (receive JSON)
    ↓
Component (update UI)
```

---

## Key Rules

1. **Frontend NEVER accesses database** → Use backend API
2. **Business logic in services ONLY** → Not in controllers
3. **Database access via repositories ONLY** → Not directly from services
4. **DTOs in api-contract ONLY** → Shared between frontend and backend
5. **Controllers handle HTTP only** → No business logic
6. **Services coordinate everything** → Business logic hub
7. **Repositories access database** → Single source of database access

