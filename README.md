# Deno BFF GraphQL React

A type-safe GraphQL BFF (Backend for Frontend) application using Deno + Pothos +
GraphQL Yoga + React + urql + GenQL. Provides data storage with Deno KV,
type-safe GraphQL client with GenQL, and authentication with Firebase Auth.

## Overview

This project uses Deno as the backend, defines GraphQL schemas with Pothos,
builds an API server with GraphQL Yoga, and implements the frontend with React +
urql. By using GenQL, you can execute GraphQL queries and mutations in a
type-safe manner. Authentication is handled by Firebase Auth with email/password
and email verification.

## Getting Started

### Prerequisites

- Deno 2.5 or higher
- Node.js (required for GenQL generation)
- Firebase project (for authentication)

### 1. Clone the Repository

```bash
git clone https://github.com/webshoten/deno_bff_graphql_react.git
cd deno_bff_graphql_react
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable **Authentication** > **Sign-in method** > **Email/Password**
4. Go to **Project Settings** > **General** > **Your apps**
5. Click "Add app" > Web app
6. Copy the Firebase configuration values

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase configuration:

```bash
cp .env.example .env
```

Edit `.env`:

```
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Start the Development Server

```bash
deno task dev
```

This will start:

- GraphQL API server (port 4000)
- File watching and automatic build
- Schema file change monitoring and automatic regeneration

Open `http://localhost:4000` in your browser.

### 5. Other Tasks

```bash
# Generate GraphQL SDL from schema
deno task generate-schema

# Generate GenQL type definitions
deno task generate-genql

# Build for production
deno task build
```

## Project Structure

```text
.
├── src/
│   ├── schema/          # GraphQL schema definitions (Pothos)
│   ├── kv/              # Deno KV data access layer
│   ├── generate/        # Schema generation scripts
│   ├── server.ts        # GraphQL API server
│   └── build.ts         # React app build
├── public/              # Frontend (React)
│   ├── App.tsx
│   ├── main.tsx
│   ├── firebase/        # Firebase configuration and auth
│   └── generated/       # GenQL generated files
├── schema/              # GraphQL SDL files
└── dist/                # Build output
```

## Deploy to Deno Deploy

### Using GitHub Actions (Recommended)

1. Push your code to GitHub
2. Go to your repository **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
4. Create a project in Deno Deploy dashboard
5. Link your GitHub repository
6. Deployment will run automatically on push to `main` branch

### Manual Deploy

1. Create a project in Deno Deploy dashboard
2. Configure the following:
   - **Entrypoint**: `src/server.ts`
   - **Import Map**: `import_map.json`
   - **Environment Variables**: `DENO_ENV=production`

Note: For manual deploy, you need to build locally with environment variables
set.

## Tech Stack

- **Backend**: Deno, Pothos, GraphQL Yoga, Hono
- **Frontend**: React, urql
- **Database**: Deno KV
- **Authentication**: Firebase Auth
- **Type Safety**: GenQL
- **Build**: esbuild
