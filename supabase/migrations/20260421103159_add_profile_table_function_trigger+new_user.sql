-- table schema
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamp with time zone default now()
);

-- trigger when new user is register
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  display_name text;
begin
  -- get display_name from metadata
  display_name := new.raw_user_meta_data->>'display_name';

  -- if not provided, extract from email
  if display_name is null or display_name = '' then
    display_name := split_part(new.email, '@', 1);
  end if;

  insert into public.profiles (id, email, name)
  values (new.id, new.email, display_name);

  return new;
end;
$$;