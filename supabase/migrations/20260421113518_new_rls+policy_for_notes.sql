-- enable RLS
alter table public.note_shares enable row level security;

-- remove old policies
drop policy if exists "owner can share note" on public.note_shares;
drop policy if exists "owner can delete share" on public.note_shares;
drop policy if exists "user can see shared notes" on public.note_shares;
drop policy if exists "owner can see shares" on public.note_shares;

-- user can see their own shares
create policy "user can see own shares"
on public.note_shares
for select
using (user_id = auth.uid());

-- owner can insert (share note)
create policy "owner can share"
on public.note_shares
for insert
with check (
  exists (
    select 1
    from public.notes n
    where n.id = note_shares.note_id
    and n.owner_id = auth.uid()
  )
);

-- owner can delete share
create policy "owner can delete share"
on public.note_shares
for delete
using (
  exists (
    select 1
    from public.notes n
    where n.id = note_shares.note_id
    and n.owner_id = auth.uid()
  )
);