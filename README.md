# WeMeat Platform — Phase 1

A modern monorepo for the **WeMeat Platform**, containing the Customer Mobile App, Shop Owner Mobile App, Backend API, and Shared Packages.

---

## 📁 Repository Structure

```
wemeat/
├── apps/
│   ├── customer-app/          # React Native / Expo (Customer Mobile App)
│   └── shop-owner-app/        # React Native / Expo (Shop Owner Mobile App)
│
├── backend/                   # Node.js + Express + TypeScript + Prisma + PostgreSQL
│   ├── src/
│   │   ├── config/            # Env validation, Prisma client, Logger
│   │   ├── controllers/       # Base & Health controllers
│   │   ├── middleware/        # Error handler, Request logger, Zod validator
│   │   ├── repositories/      # Base repository pattern
│   │   ├── routes/            # API routing & Health endpoints
│   │   ├── services/          # Business logic layer
│   │   ├── types/             # Express & auth types
│   │   ├── utils/             # Api responses & Custom AppError
│   │   ├── app.ts             # Express app instance & middleware
│   │   └── server.ts          # Server entrypoint & graceful shutdown
│   ├── prisma/
│   │   ├── schema.prisma      # PostgreSQL schema & connection check model
│   │   └── seed.ts            # Seed script
│   ├── tests/                 # Supertest API tests
│   └── .env.example           # Backend environment template
│
├── packages/
│   ├── shared-types/          # Domain enums, API contracts, Pagination types
│   ├── api-client/            # Lean HTTP client foundation with error wrapping
│   └── validation/            # Shared Zod validation schemas
│
├── docs/
│   ├── architecture/          # Architecture overview & guidelines
│   ├── api/                   # API contracts and specifications
│   └── requirements/          # Scope and requirements breakdown
│
├── .gitignore
├── .prettierrc
├── tsconfig.json
└── package.json               # Monorepo root workspace config
```

---

## 🛠️ Technology Stack & Versions

- **Monorepo Manager**: Bun Workspaces (with npm compatibility)
- **Backend**: Node.js (v22+), Express.js (v4.21+), TypeScript (v5.7+), Prisma ORM (v6.4+), PostgreSQL
- **Mobile Apps**: React Native (v0.87+), Expo (v57+), Expo Router (v57+), TypeScript
- **Validation**: Zod (v3.24+)
- **Testing**: Jest (v29+), Supertest (v7+)

---

## 🚀 Getting Started

### 1. Install Dependencies

From the repository root:

```bash
bun install
```

### 2. Environment Setup

Copy `.env.example` templates to `.env` in the respective workspaces:

```bash
# Backend
cp backend/.env.example backend/.env

# Customer App
cp apps/customer-app/.env.example apps/customer-app/.env

# Shop Owner App
cp apps/shop-owner-app/.env.example apps/shop-owner-app/.env
```

### 3. Generate Prisma Client

```bash
cd backend
bunx prisma generate
```

---

## 💻 Running Projects

| Project            | Command                | Description                                                      |
| :----------------- | :--------------------- | :--------------------------------------------------------------- |
| **Backend API**    | `bun run dev:backend`  | Starts Express server with hot-reload on `http://localhost:5000` |
| **Customer App**   | `bun run dev:customer` | Starts Expo dev server for the Customer Mobile App               |
| **Shop Owner App** | `bun run dev:shop`     | Starts Expo dev server for the Shop Owner Mobile App             |

---

## 🧪 Quality & Verification Commands

```bash
# Type-check all packages, backend, and apps
bun run typecheck

# Lint all packages
bun run lint

# Format codebase
bun run format

# Run Backend Tests
cd backend && bun test
```

---

## 🔒 Security & Secrets Policy

- Never commit `.env` or secret keys to Git.
- All `.env.example` files contain only safe placeholders.
