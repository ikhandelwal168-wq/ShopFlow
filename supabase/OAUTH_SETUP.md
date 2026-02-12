# Google OAuth + Supabase Auth Setup

## 1) Supabase Auth Provider
In Supabase Dashboard:
- Go to `Authentication -> Providers -> Google`
- Enable Google provider
- Add your Google OAuth `Client ID` and `Client Secret`

## 2) Google Cloud Console OAuth client
In Google Cloud Console (OAuth client for web app), add this **Authorized redirect URI**:
- `https://fxankcmlzcninrotwrhv.supabase.co/auth/v1/callback`

## 3) Supabase URL config
In Supabase Dashboard -> `Authentication -> URL Configuration`:
- Site URL (local dev): `http://localhost:5173`
- Additional Redirect URLs:
  - `http://localhost:5173/dashboard`
  - `http://127.0.0.1:5173/dashboard`
  - `https://YOUR_PROD_DOMAIN/dashboard`

## 4) Frontend env
In project `.env`:
- `VITE_SUPABASE_URL=https://fxankcmlzcninrotwrhv.supabase.co`
- `VITE_SUPABASE_ANON_KEY=...`

## 5) Verify login flow
- Start app: `npm run dev`
- Open `/login`
- Click `Sign in with Google`
- On return, app should land on `/dashboard`

