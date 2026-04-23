create table public.note_versions (
  id uuid        primary key default gen_random_uuid(),
  note_id uuid   references public.notes(id) on delete cascade,
  title          text,
  content        text,
  created_at     timestamp with time zone default now()
);

--auto save 
create or replace function save_note_version()
returns trigger as $$
begin
  insert into note_versions (note_id, title, content)
  values (OLD.id, OLD.title, OLD.content);

  return NEW;
end;
$$ language plpgsql;

create trigger note_version_trigger
before update on notes
for each row
execute function save_note_version();

--rls policy
drop policy if exists "read versions" on note_versions;

create policy "read versions"
on note_versions
for select
using (
  note_id in (
    select id from notes
    where (
      owner_id = auth.uid()
      OR is_public = true
      OR id in (
        select note_id from note_shares
        where user_id = auth.uid()
      )
    )
  )
);

--rls policy
create policy "insert versions"
on note_versions
for insert
with check (
  note_id in (
    select id from notes
    where owner_id = auth.uid()
  )
);