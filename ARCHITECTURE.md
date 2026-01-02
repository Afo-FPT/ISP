# SIMS-AI Architecture Documentation

## Overview

SIMS-AI follows a **strict MVC (Model-View-Controller) architecture** with clear separation of concerns. The project is organized as a monorepo with independent frontend and backend applications.

## Project Structure

```
sims-ai/
├── apps/
│   ├── backend/              # Backend API (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── app/api/      # API route definitions
│   │   │   ├── controllers/  # Request/Response handlers
│   │   │   ├── services/     # Business logic
│   │   │   ├── repositories/ # Database access
│   │   │   ├── models/       # Domain entities
│   │   │   ├── dtos/         # Data Transfer Objects (from api-contract)
│   │   │   ├── validators/   # Request validation
│   │   │   └── lib/          # Utilities & Prisma client
│   │   ├── prisma/
│   │   │   └── schema.prisma # Database schema
│   │   └── package.json
│   │
│   └── frontend/             # Frontend (Next.js + TypeScript)
│       ├── src/
│       │   ├── app/          # Next.js App Router
│       │   ├── components/   # React components
│       │   ├── services/     # API client functions
│       │   ├── hooks/        # Custom React hooks
│       │   ├── types/        # TypeScript types
│       │   └── lib/          # Utilities
│       └── package.json
│
├── packages/
│   └── api-contract/         # Shared DTOs & OpenAPI schema
│       ├── dto/              # Zod schemas & TypeScript types
│       └── openapi.yaml      # OpenAPI specification
│
└── docs/                     # Documentation
    ├── ERD/                  # Entity Relationship Diagrams
    ├── ClassDiagram/         # Class Diagrams
    └── SRS/                  # Software Requirements Specification
```

## Layer Responsibilities

### Backend Layers

#### 1. Controllers (`apps/backend/src/controllers/`)
**Responsibility:**
- Handle HTTP requests and responses ONLY
- Extract data from request (params, body, query)
- Call appropriate service methods
- Return formatted responses with proper HTTP status codes
- Handle errors and return appropriate error responses

**DO NOT:**
- ❌ Access database directly
- ❌ Implement business logic
- ❌ Perform data validation (use validators middleware)

**Example:**
```typescript
export class ProductController {
  constructor(private productService: ProductService) {}

  async getProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await this.productService.getProduct(id);
    res.json(product);
  }
}
```

#### 2. Services (`apps/backend/src/services/`)
**Responsibility:**
- Contains ALL business logic
- Coordinates between controllers and repositories
- Handles external integrations (e.g., n8n webhooks for AI)
- Data transformation and validation
- Business rules enforcement
- Transaction management

**DO NOT:**
- ❌ Access database directly (use repositories)
- ❌ Handle HTTP requests/responses (controllers do this)

**Example:**
```typescript
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private n8nService: N8nService
  ) {}

  async createProduct(data: CreateProductDto) {
    // Business logic
    const product = await this.productRepository.create(data);
    
    // External integration
    await this.n8nService.triggerForecast(product);
    
    return product;
  }
}
```

#### 3. Repositories (`apps/backend/src/repositories/`)
**Responsibility:**
- ONLY layer that accesses the database
- Uses Prisma client for database operations
- Returns domain models
- Handles database-specific logic (queries, transactions)

**DO NOT:**
- ❌ Implement business logic (services do this)
- ❌ Handle HTTP requests/responses
- ❌ Perform data validation beyond database constraints

**Example:**
```typescript
export class ProductRepository {
  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  async create(data: CreateProductDto) {
    return prisma.product.create({ data });
  }
}
```

#### 4. Models (`apps/backend/src/models/`)
**Responsibility:**
- Domain entities and types
- Represents business objects
- Type definitions for domain concepts

#### 5. DTOs (`apps/backend/src/dtos/`)
**Responsibility:**
- Import DTOs from `@sims-ai/api-contract` package
- Re-export for convenience if needed
- DO NOT define DTOs here - use packages/api-contract

#### 6. Validators (`apps/backend/src/validators/`)
**Responsibility:**
- Validate incoming request data
- Use Zod schemas from `packages/api-contract`
- Return validation errors in consistent format
- Middleware functions for Express routes

**Example:**
```typescript
export const validateCreateProduct = (req, res, next) => {
  try {
    CreateProductDto.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation failed' });
  }
};
```

#### 7. Lib (`apps/backend/src/lib/`)
**Responsibility:**
- Shared helper functions
- Configuration files
- Prisma client instance
- External service clients (e.g., n8n client)

### Frontend Layers

#### 1. App (`apps/frontend/src/app/`)
**Responsibility:**
- Next.js App Router pages and layouts
- Route definitions
- Server components (if needed)
- Page-level components

#### 2. Components (`apps/frontend/src/components/`)
**Responsibility:**
- Reusable React components
- UI components
- Feature-specific components
- Presentational components

#### 3. Services (`apps/frontend/src/services/`)
**Responsibility:**
- API client functions
- HTTP request handling
- Uses DTOs from `@sims-ai/api-contract`
- Handles API errors

**Example:**
```typescript
export const productService = {
  async getProduct(id: string): Promise<ProductDto> {
    const response = await fetch(`/api/products/${id}`);
    return response.json();
  }
};
```

#### 4. Hooks (`apps/frontend/src/hooks/`)
**Responsibility:**
- Custom React hooks
- Reusable stateful logic
- API data fetching hooks (e.g., useQuery, useMutation)

#### 5. Types (`apps/frontend/src/types/`)
**Responsibility:**
- Frontend-specific TypeScript types
- Component prop types
- Shared types with backend via `packages/api-contract`

#### 6. Lib (`apps/frontend/src/lib/`)
**Responsibility:**
- Helper functions
- Configuration
- Constants
- Utility functions

### Shared Package

#### API Contract (`packages/api-contract/`)
**Responsibility:**
- Shared DTOs (Data Transfer Objects) between frontend and backend
- Zod schemas for validation
- TypeScript types
- OpenAPI specification
- Ensures type safety across the monorepo

**Usage:**
- Backend: Import DTOs for validation and type safety
- Frontend: Import DTOs for API calls and type safety

## Data Flow

### Request Flow (Frontend → Backend)

1. **Frontend Component** → Calls service function
2. **Service** → Makes HTTP request to backend API
3. **Backend Route** → Receives request
4. **Validator** → Validates request data (Zod)
5. **Controller** → Extracts data, calls service
6. **Service** → Implements business logic, calls repository
7. **Repository** → Accesses database via Prisma
8. **Service** → Returns result to controller
9. **Controller** → Returns HTTP response
10. **Frontend Service** → Returns data to component

### Response Flow (Backend → Frontend)

1. **Repository** → Returns database result
2. **Service** → Transforms data, applies business logic
3. **Controller** → Formats response
4. **Frontend Service** → Receives JSON response
5. **Component** → Updates UI with data

## Architecture Rules

### ✅ DO

1. **Frontend NEVER accesses database** - All data access goes through backend API
2. **Backend exposes REST APIs only** - No direct database access from frontend
3. **Business logic MUST be in services** - Controllers delegate to services
4. **Controllers only handle request/response** - No business logic in controllers
5. **Database access ONLY via repositories** - Services use repositories, not Prisma directly
6. **DTOs must be shared via packages/api-contract** - Ensures type safety between frontend and backend
7. **Use clean code and separation of concerns** - Each layer has a single responsibility
8. **Validate requests using Zod** - Use schemas from api-contract package
9. **Handle errors consistently** - Use proper HTTP status codes and error formats

### ❌ DON'T

1. ❌ Access database from frontend
2. ❌ Put business logic in controllers
3. ❌ Access database directly from services (use repositories)
4. ❌ Define DTOs in backend or frontend (use api-contract package)
5. ❌ Mix concerns between layers
6. ❌ Skip validation
7. ❌ Return raw database models to frontend (use DTOs)

## AI Integration (n8n)

AI logic is handled externally by n8n via webhook:

1. **Backend Service** → Calls n8n webhook with data
2. **n8n** → Processes AI logic
3. **n8n** → Returns result to backend (webhook callback or polling)
4. **Backend Service** → Updates database with AI results

## Development Workflow

1. **Define DTOs** in `packages/api-contract/dto/`
2. **Build backend** - Repository → Service → Controller → Route
3. **Build frontend** - Service → Hook → Component
4. **Test** - Both apps can be developed and tested independently

## Example: Adding a New Feature

### Step 1: Define DTOs
```typescript
// packages/api-contract/dto/product.ts
export const CreateProductDto = z.object({ ... });
```

### Step 2: Create Repository
```typescript
// apps/backend/src/repositories/product.repository.ts
export class ProductRepository {
  async create(data: CreateProductDto) { ... }
}
```

### Step 3: Create Service
```typescript
// apps/backend/src/services/product.service.ts
export class ProductService {
  async createProduct(data: CreateProductDto) {
    // Business logic
    return this.productRepository.create(data);
  }
}
```

### Step 4: Create Controller
```typescript
// apps/backend/src/controllers/product.controller.ts
export class ProductController {
  async create(req: Request, res: Response) {
    const product = await this.productService.createProduct(req.body);
    res.status(201).json(product);
  }
}
```

### Step 5: Create Route
```typescript
// apps/backend/src/app/api/routes/product.routes.ts
router.post('/', validateCreateProduct, productController.create);
```

### Step 6: Create Frontend Service
```typescript
// apps/frontend/src/services/product.service.ts
export const productService = {
  async create(data: CreateProductDto) {
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
```

### Step 7: Use in Component
```typescript
// apps/frontend/src/components/ProductForm.tsx
const handleSubmit = async (data: CreateProductDto) => {
  await productService.create(data);
};
```

## Conclusion

This architecture ensures:
- **Separation of concerns** - Each layer has a clear responsibility
- **Type safety** - Shared DTOs between frontend and backend
- **Maintainability** - Easy to understand and modify
- **Testability** - Each layer can be tested independently
- **Scalability** - Easy to add new features following the same pattern

