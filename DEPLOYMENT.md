# Deployment Setup

## Supabase

1. Create a Supabase project.
2. Open the SQL editor or Supabase CLI migrations.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Copy these values into local `.env.local` and Vercel project environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the service role key only on the server. Never expose it in browser code.

## Admin Users

Create each Admin in Supabase Authentication first, then add a matching `worker_profiles` row.

```sql
insert into public.worker_profiles (
  farm_id,
  auth_user_id,
  full_name,
  phone,
  role,
  access_area,
  status
)
values (
  'YOUR_FARM_ID',
  'VIGNESH_AUTH_USER_ID',
  'Vignesh Pandian',
  null,
  'admin',
  'All sections',
  'active'
);
```

Use lowercase `admin` because `role` is a PostgreSQL enum.

## Vercel

1. Import the GitHub repository into Vercel.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. Output directory: leave default.
5. Add the Supabase environment variables in Vercel.
6. Push to `main` to deploy.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
