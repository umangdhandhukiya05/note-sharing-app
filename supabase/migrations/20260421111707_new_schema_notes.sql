-- notes schema
create table public.notes (
  id uuid           primary key default gen_random_uuid(),
  owner_id uuid     references auth.users(id) on delete cascade,
  title             text default 'Untitled',
  content           text default '',
  is_public         boolean default false,
  created_at        timestamp with time zone default now(),
  updated_at        timestamp with time zone default now()
);

--shared-note schema
create table public.note_shares (
  id uuid       primary key default gen_random_uuid(),
  note_id uuid  references public.notes(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  permission    text check (permission in ('view', 'edit')) not null default 'view',
  created_at    timestamp with time zone default now(),
  unique (note_id, user_id)
);

--updated at automatically function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_notes_updated_at
before update on public.notes
for each row
execute procedure public.update_updated_at();

-- enable RLS
alter table public.notes enable row level security;

-- remove old policies (important)
drop policy if exists "owner full access" on public.notes;
drop policy if exists "public read" on public.notes;
drop policy if exists "shared view" on public.notes;
drop policy if exists "shared edit" on public.notes;

-- owner: full access
create policy "owner full access"
on public.notes
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- public notes: anyone can read
create policy "public read"
on public.notes
for select
using (is_public = true);

-- shared users: can view
create policy "shared view"
on public.notes
for select
using (
  exists (
    select 1
    from public.note_shares ns
    where ns.note_id = notes.id
    and ns.user_id = auth.uid()
  )
);

-- shared users: can edit only if permission = 'edit'
create policy "shared edit"
on public.notes
for update
using (
  exists (
    select 1
    from public.note_shares ns
    where ns.note_id = notes.id
    and ns.user_id = auth.uid()
    and ns.permission = 'edit'
  )
);
