-- Svapna accounts: run once in the Supabase SQL Editor.
-- A member can read and change only their own rows. Membership itself can be set only by the server.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  country text check (char_length(country) = 2),
  done jsonb not null default '{}'::jsonb,
  is_member boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null check (char_length(question_id) <= 40),
  answer text not null check (char_length(answer) <= 40),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.profiles enable row level security;
alter table public.answers enable row level security;

drop policy if exists "own profile: read" on public.profiles;
create policy "own profile: read" on public.profiles for select using (auth.uid() = id);
drop policy if exists "own profile: change" on public.profiles;
create policy "own profile: change" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own answers: all" on public.answers;
create policy "own answers: all" on public.answers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A member may change their name, country and stickers, and nothing else: not whether they are a member.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, country, done) on public.profiles to authenticated;
revoke all on public.answers from anon;
grant select, insert, update, delete on public.answers to authenticated;

-- Every new account gets an empty profile. The name from the sign-in provider is not copied.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- "Delete my account": removes the account and, through the references above, everything stored with it.
create or replace function public.delete_my_account() returns void language sql security definer set search_path = public as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
