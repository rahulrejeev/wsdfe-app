# WSDFE Inventory

Mobile-first web app for WSDFE stock management. Admins manage a spreadsheet-style inventory; each stock line gets a unique QR code. Engineers scan codes on boxes to take or return stock.

## Features

- **Admin spreadsheet** — add stock lines, edit quantities, export CSV
- **QR codes** — auto-generated per item, downloadable and printable
- **Mobile scan flow** — camera scanner or direct QR link, +/- quantity updates
- **Audit log** — every scan adjustment is recorded in Supabase

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) (Postgres + realtime)
- [Tailwind CSS](https://tailwindcss.com)

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project URL and keys from **Settings → API**

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g. `http://localhost:3000` or Vercel URL) |
| `ADMIN_PASSWORD` | Password for the admin spreadsheet panel |

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

### Admin (main gaffer)

1. Go to **Admin spreadsheet** and sign in with your admin password
2. Add a stock line (e.g. "Angle boxes 20m") with starting quantity
3. Click **View QR** → download or print → stick on the box

### Engineers (field)

1. Open the app on your phone
2. Tap **Scan QR code** and point at the box label
3. Tap **− Take** when removing stock, **+ Return** when putting items back

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (required for QR codes)

## Project structure

```
src/
  app/
    admin/          Admin spreadsheet + login
    scan/           QR scanner + item update pages
    api/            REST endpoints
  components/       UI components
  lib/              Supabase, auth, types
supabase/
  schema.sql        Database schema
```
