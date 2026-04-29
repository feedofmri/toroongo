# Toroongo Frontend

React + Vite storefront client.

## Environment setup

1. Copy `.env.example` to `.env`.
2. Update backend URL values for your environment.

### Variables

- `VITE_API_BASE_URL`: Backend origin, without trailing slash.
- `VITE_API_PREFIX`: API prefix used by the client (default `/api`).
- `VITE_STORAGE_PREFIX`: Prefix for localStorage fallback auth keys.
- `VITE_AUTH_TOKEN_STORAGE_KEY`: Token storage key override.
- `VITE_AUTH_USER_STORAGE_KEY`: User storage key override.
- `VITE_USE_CREDENTIALS`: Set `true` only for cookie-based auth.

## Scripts

- `npm run dev`: Start dev server.
- `npm run build`: Build production bundle and generate `dist/.htaccess`.
- `npm run preview`: Preview production bundle.
- `npm run lint`: Run ESLint.

## cPanel deployment (new.toroongo.com)

Use these production values in `.env`:

- `VITE_API_BASE_URL=https://api.toroongo.com`
- `VITE_API_PREFIX=/api`
- `VITE_USE_CREDENTIALS=false` (token auth mode)

Build output now auto-generates `dist/.htaccess` for SPA routing on Apache/cPanel.
