# Shared Notes

A modern, real-time collaborative note-taking web application. Built with Next.js and Supabase, it allows users to manage their personal notes and seamlessly collaborate with others in real-time.

## Features

- **Authentication:** Secure user sign-up and login powered by Supabase Auth.
- **Personal Dashboard:** Manage all your personal notes and collaborative notes in one unified view.
- **Real-Time Collaboration:** Share notes with other registered users via their email. View live changes synced in real-time.
- **Access Control:** Grant shared users either `Read-only` or `Writeable` permissions.
- **Version History:** Track the edit history of your notes and restore them to previous versions at any time.
- **Modern UI:** Clean, responsive, and dynamic interface built with Tailwind CSS and Ant Design.

## Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **UI Library:** React 19
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Realtime Channels, Edge Functions)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [Ant Design](https://ant.design/)
- **API Client:** Axios

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun
- Supabase CLI (for local database setup or managing migrations)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd shared-notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root of the project and add your Supabase project keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=your-supabase-functions-url
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. **Database Setup:**
   You will need to link your local project to your Supabase instance and run the migrations:
   ```bash
   npx supabase link --project-ref your-project-ref
   npx supabase db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages including authentication (`(auth)`), dashboard (`page.tsx`), and note details (`note/[id]`).
- `components/`: Reusable UI components for layout and note interactions (e.g., NoteCard, SharedModal).
- `hooks/`: Custom React hooks for managing state and fetching data from Supabase.
- `utils/`: Utility functions, including the Supabase client setup.
- `supabase/migrations/`: PostgreSQL migration files for database schema, triggers, and RLS policies.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Ant Design Components](https://ant.design/components/overview/)
