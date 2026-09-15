# 🚀 How to Run — WeMeat Platform

This guide provides step-by-step instructions for running the **Backend API**, **Customer Mobile App**, and **Shop Owner Mobile App** on Android Emulators, physical devices, and web.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Initial Setup (One-Time)](#2-initial-setup-one-time)
3. [Running the Backend API](#3-running-the-backend-api)
4. [Running the Customer Mobile App](#4-running-the-customer-mobile-app)
5. [Running the Shop Owner Mobile App](#5-running-the-shop-owner-mobile-app)
6. [Running Everything Together](#6-running-everything-together)
7. [Useful Quality & Testing Commands](#7-useful-quality--testing-commands)
8. [Troubleshooting & FAQs](#8-troubleshooting--faqs)

---

## 1. Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: `v20+` or `v22+`
- **Bun**: `v1.2+` or `v1.3+` (run `bun -v` to check)
- **Expo Go** app on your physical phone (available on Google Play Store / Apple App Store) **OR** **Android Studio** with an Android Emulator.

---

## 2. Initial Setup (One-Time)

### Step 2.1: Install Dependencies

From the repository root (`c:/WeMeat`):

```bash
bun install
```

### Step 2.2: Setup Environment Files

Copy the `.env.example` templates to `.env`:

**Windows (PowerShell):**

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item apps\customer-app\.env.example apps\customer-app\.env
Copy-Item apps\shop-owner-app\.env.example apps\shop-owner-app\.env
```

**macOS / Linux / Git Bash:**

```bash
cp backend/.env.example backend/.env
cp apps/customer-app/.env.example apps/customer-app/.env
cp apps/shop-owner-app/.env.example apps/shop-owner-app/.env
```

### Step 2.3: Generate Prisma Client (Backend)

```bash
cd backend
bunx prisma generate
cd ..
```

---

## 3. Running the Backend API

### Start the Backend Server

From the project root:

```bash
bun run dev:backend
```

_Or from `backend/`:_

```bash
cd backend
bun run dev
```

- **API Base URL**: `http://localhost:5000/api/v1`
- **Health Check Endpoint**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 4. Running the Customer Mobile App

### Start the Expo Dev Server

From the project root:

```bash
bun run dev:customer
```

_Or from `apps/customer-app/`:_

```bash
cd apps/customer-app
bun run start
```

### How to Open the App:

- **On Physical Android/iOS Device**: Open the **Expo Go** app and scan the QR code displayed in your terminal.
- **On Android Emulator**: Press `a` in the terminal (ensure Android Studio emulator is running).
- **On Web Browser**: Press `w` in the terminal to view in browser.

> [!NOTE]
> **Connecting to Backend from Mobile:**
>
> - On **Android Emulator**: The app connects to the backend via `http://10.0.2.2:5000/api/v1`.
> - On **Physical Device**: Update `EXPO_PUBLIC_API_BASE_URL` in `apps/customer-app/.env` to your computer's local Wi-Fi IP (e.g., `http://192.168.1.X:5000/api/v1`).

---

## 5. Running the Shop Owner Mobile App

### Start the Expo Dev Server

From the project root:

```bash
bun run dev:shop
```

_Or from `apps/shop-owner-app/`:_

```bash
cd apps/shop-owner-app
bun run start
```

### How to Open the App:

- **On Physical Android/iOS Device**: Open the **Expo Go** app and scan the terminal QR code.
- **On Android Emulator**: Press `a` in the terminal.
- **On Web Browser**: Press `w` in the terminal.

---

## 6. Running Everything Together

Open **3 separate terminal tabs** in the project root:

| Terminal Tab   | Command                | Purpose                                       |
| :------------- | :--------------------- | :-------------------------------------------- |
| **Terminal 1** | `bun run dev:backend`  | Runs the Backend API server on port 5000      |
| **Terminal 2** | `bun run dev:customer` | Runs Customer App Metro bundler (port 8081)   |
| **Terminal 3** | `bun run dev:shop`     | Runs Shop Owner App Metro bundler (port 8082) |

---

## 7. Useful Quality & Testing Commands

```bash
# Typecheck all apps and packages
bun run typecheck

# Format code with Prettier
bun run format

# Verify formatting without writing
bun run format:check

# Run backend unit & integration tests
cd backend && bun test
```

---

## 8. Troubleshooting & FAQs

### Port already in use (e.g. 5000 or 8081)

- **Backend (Port 5000)**: Update `PORT=5001` in `backend/.env`.
- **Expo (Port 8081)**: Expo will automatically prompt to use another port (e.g., 8082), or you can pass `bun run start -- --port 8083`.

### Clear Expo Metro Cache

If you encounter bundler or dependency issues:

```bash
cd apps/customer-app && bunx expo start -c
cd apps/shop-owner-app && bunx expo start -c
```

### Reset Monorepo Dependencies

If packages or modules ever get out of sync:

```bash
# Remove lock & node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules backend/node_modules
bun install
```
