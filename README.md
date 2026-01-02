# SIMS-AI - Smart Inventory Management System

AI-powered Inventory Management System with Web and Mobile interfaces.

## Project Structure

```
sims-ai/
├── apps/
│   ├── backend/          # Backend API (Express + TypeScript)
│   └── frontend/         # Frontend (Next.js + TypeScript)
├── packages/
│   └── api-contract/     # Shared DTOs and API contracts
└── docs/                 # Documentation
```

## Architecture

### Backend (MVC Pattern)
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Repositories**: Database access (Prisma)
- **Models**: Domain entities
- **DTOs**: Data Transfer Objects (from packages/api-contract)
- **Validators**: Request validation (Zod)

### Frontend (Next.js)
- **app/**: Next.js App Router pages
- **components/**: React components
- **services/**: API client functions
- **hooks/**: Custom React hooks
- **types/**: TypeScript types
- **lib/**: Utility functions

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm (or pnpm >= 8.0.0)
- PostgreSQL (for backend)

### Installation

```bash
# Install dependencies
npm install

# Setup backend
cd apps/backend
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate

# Run development servers
npm run dev
```

### Development

```bash
# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Run both
npm run dev
```

## Architecture Rules

1. **Frontend NEVER accesses database** - All data access goes through backend API
2. **Backend exposes REST APIs only** - No direct database access from frontend
3. **Business logic MUST be in services** - Controllers delegate to services
4. **Controllers only handle request/response** - No business logic in controllers
5. **Database access ONLY via repositories** - Services use repositories, not Prisma directly
6. **DTOs must be shared via packages/api-contract** - Ensures type safety between frontend and backend
7. **Use clean code and separation of concerns** - Each layer has a single responsibility

## AI Integration

AI logic is handled externally by n8n via webhook. The backend calls n8n webhooks for AI processing.

## License

Private project
