# System Architecture Overview

## Chicken Ordering Platform — Phase 1

### High-Level Architecture

The platform follows a clean, decoupled client-server architecture built as a monorepo:

```
+------------------------------------+      +------------------------------------+
|        Customer Mobile App         |      |       Shop Owner Mobile App        |
|      (React Native / Expo)         |      |       (React Native / Expo)        |
+-----------------+------------------+      +-----------------+------------------+
                  |                                           |
                  |                HTTPS / JSON               |
                  +---------------------+---------------------+
                                        |
                                        v
                       +---------------------------------+
                       |        Backend REST API         |
                       |    (Node.js / Express / TS)     |
                       +----------------+----------------+
                                        |
                                        v
                       +---------------------------------+
                       |      PostgreSQL Database        |
                       |         (Prisma ORM)            |
                       +---------------------------------+
```

### Core Architecture Principles

1. **Single Source of Truth**: The Backend API is the authoritative source for all data, business logic, authentication, and status transitions.
2. **Separation of Apps**: Customer App and Shop Owner App are strictly independent applications with dedicated navigation, UI tokens, and user contexts.
3. **Lean Shared Foundation**: Code sharing is limited to contract types (`packages/shared-types`), validation primitives (`packages/validation`), and API client utilities (`packages/api-client`).
4. **Clean Layered Backend**:
   - `controllers/`: HTTP request handling, response formatting.
   - `services/`: Business logic.
   - `repositories/`: Database abstraction via Prisma.
   - `middleware/`: Auth, error handling, validation.
   - `config/`: Validated environment variables, database connections.
5. **Phase 1 Boundaries**:
   - No Delivery Partner app.
   - Single-shop operation.
   - No real-time GPS tracking or complex analytics.
