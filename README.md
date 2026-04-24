# Shared Notes

Shared Notes is a collaborative note-taking app built with Next.js and Supabase. It supports personal notes, shared notes, permission-based collaboration, and note version history.

## Features

- Email/password authentication with Supabase Auth
- Personal dashboard for owned and shared notes
- Real-time updates using Supabase Realtime
- Share by user email with role-based access
- Version history with restore support
- Responsive UI built with Tailwind CSS and Ant Design

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (Postgres, Auth, Realtime, Edge Functions)
- Axios
- Tailwind CSS v4
- Ant Design v6

## Requirements

- Node.js 20+
- npm
- Supabase CLI (for migrations and edge functions)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

If there is no `.env.example` in your environment, create `.env.local` manually with these keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=your_supabase_functions_base_url
```

3. Link Supabase and apply database changes:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

4. Start development server:

```bash
npm run dev
```

Open http://localhost:3000.

## Available Scripts

- `npm run dev` - run Next.js in development mode
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Supabase Edge Functions

Edge functions are located under `supabase/functions/` and include note operations such as:

- create, edit, delete note
- fetch note(s)
- share and update sharing permissions
- fetch and restore versions

To deploy functions (example):

```bash
npx supabase functions deploy create-note
```

## Project Structure

- `app/` - routes and pages (dashboard, auth, note details)
- `components/` - UI and interaction components
- `hooks/` - data and state hooks for notes and details
- `utils/` - axios + Supabase client utilities
- `types/` - shared TypeScript types
- `supabase/migrations/` - SQL migrations
- `supabase/functions/` - edge function handlers

## Notes

- This project uses Next.js 16 and React 19.
- Ensure your Supabase policies and migrations are applied before testing collaboration flows.

## License

Private project.
