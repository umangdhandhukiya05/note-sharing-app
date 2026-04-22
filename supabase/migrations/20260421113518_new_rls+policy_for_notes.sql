-- Enable RLS for note_shares (notes already enabled in previous migration)
alter table public.note_shares enable row level security;

-- 1. Create helper functions to securely check permissions WITHOUT triggering recursive RLS loops
-- Using SECURITY DEFINER bypasses RLS on the underlying queries and prevents "infinite recursion detected in policy"

-- Function to check if the current user is the owner of a given note
create or replace function public.is_note_owner(check_note_id uuid)
returns boolean
language sql security definer set search_path = ''
as $$
  select exists (
    select 1 
    from public.notes 
    where id = check_note_id 
    and owner_id = auth.uid()
  );
$$;

-- Function to check if a note is shared with the current user, optionally with a specific permission
create or replace function public.is_shared_with_user(check_note_id uuid, required_permission text default null)
returns boolean
language sql security definer set search_path = ''
as $$
  select exists (
    select 1 
    from public.note_shares 
    where note_id = check_note_id 
    and user_id = auth.uid()
    and (required_permission is null or permission = required_permission)
  );
$$;

-- 2. Drop existing policies (clean state for production policies)
drop policy if exists "owner full access" on public.notes;
drop policy if exists "public read" on public.notes;
drop policy if exists "shared view" on public.notes;
drop policy if exists "shared edit" on public.notes;

drop policy if exists "owner read shares" on public.note_shares;
drop policy if exists "owner can share" on public.note_shares;
drop policy if exists "owner can delete share" on public.note_shares;
drop policy if exists "owner update share" on public.note_shares;

-- 3. Production policies for `notes`
create policy "Notes are viewable by owner, shared users, or if public"
on public.notes for select
using (
  owner_id = auth.uid()
  OR is_public = true
  OR public.is_shared_with_user(id)
);

create policy "Notes can be inserted by authenticated user"
on public.notes for insert
with check (
  auth.uid() = owner_id
);

create policy "Notes can be updated by owner or shared users with edit permission"
on public.notes for update
using (
  owner_id = auth.uid()
  OR public.is_shared_with_user(id, 'edit')
);

create policy "Notes can be deleted only by owner"
on public.notes for delete
using (
  owner_id = auth.uid()
);

-- 4. Production policies for `note_shares`
create policy "Users can view their own shares or shares of their notes"
on public.note_shares for select
using (
  user_id = auth.uid()
  OR public.is_note_owner(note_id)
);

create policy "Only note owners can create shares"
on public.note_shares for insert
with check (
  public.is_note_owner(note_id)
);

create policy "Only note owners can update shares"
on public.note_shares for update
using (
  public.is_note_owner(note_id)
)
with check (
  public.is_note_owner(note_id)
);

create policy "Note owners or shared users can delete shares (leave note)"
on public.note_shares for delete
using (
  public.is_note_owner(note_id) 
  OR user_id = auth.uid()
);

-- 5. Enable real-time replication for both tables
-- REPLICA IDENTITY FULL ensures DELETE and UPDATE events send all previous data to clients
alter table public.notes replica identity full;
alter table public.note_shares replica identity full;

-- Safely add tables to the supabase_realtime publication
DO $$
BEGIN
  -- Create publication if it doesn't even exist yet
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- Add table public.notes to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
  END IF;

  -- Add table public.note_shares to publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'note_shares'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.note_shares;
  END IF;
END $$;
