# API Conventions & Specifications

## Base URL

- Local Development: `http://localhost:5000/api/v1`
- Android Emulator Host: `http://10.0.2.2:5000/api/v1`

## Standard Response Format

### Success Response (`2xx`)

```json
{
  "success": true,
  "message": "Optional human-readable message",
  "data": { ... },
  "timestamp": "2026-09-10T06:00:00.000Z"
}
```

### Error Response (`4xx`, `5xx`)

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable error description",
    "details": null
  },
  "timestamp": "2026-09-10T06:00:00.000Z"
}
```

## System Endpoints (Phase 1 Setup)

- `GET /api/v1/health`: Service health and database connectivity status.
