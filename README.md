# MediConnect

Basic full-stack project structure:

- `client/`: React + Vite frontend
- `server/`: Node.js + Express backend

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

Install all dependencies from project root:

```bash
npm run setup
```

## Run (Development)

Run frontend + backend together:

```bash
npm run dev
```

You can also run each app separately:

```bash
npm run dev:server
npm run dev:client
```

## Scripts

- `npm run setup` - install server and client dependencies
- `npm run dev` - run Express + Vite in parallel
- `npm run dev:server` - run only backend
- `npm run dev:client` - run only frontend
- `npm run build` - build frontend for production
- `npm run start` - run backend in production mode

## Environment

Copy `server/.env.example` to `server/.env` when needed:

```bash
cp server/.env.example server/.env
```
