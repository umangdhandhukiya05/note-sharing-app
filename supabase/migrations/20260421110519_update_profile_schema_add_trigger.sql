-- rls for profile
create policy "update own profile"
on public.profiles
for update
using (auth.uid() = id);

create policy "public read profiles"
on public.profiles
for select
using (true);

-- function for create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'display_name',
      split_part(new.email, '@', 1)
    )
  );

  return new;
end;
$$;

--trigger added
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();