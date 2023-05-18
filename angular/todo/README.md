# Todo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Supabase

This project uses supabase for auth and database, for auth, you'll need to enable it and then handle profiles in their own table, supabase has a template for this called User Management Starter:

```
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

For database, you'll need a todos table with the right schema and row level security policies defined, you can do so with the following queries:

```
-- Create a table called "todos"
create table
  todos (
    -- "id" column with integer data type and primary key constraint
    id integer primary key generated always as identity,
    -- "task" column with text data type
    task text,
    -- "user_id" column with integer data type and foreign key constraint referencing "id" column of "profiles" table
    user_id uuid references profiles (id),
    -- "is_done" column with boolean data type
    is_done boolean,
    -- "inserted_at" column with timestamp data type and default value of current timestamp
    inserted_at timestamp default current_timestamp,
    -- "updated_at" column with timestamp data type and default value of current timestamp
    updated_at timestamp default current_timestamp
  );
```

```
-- add row level security policies
alter table todos enable row level security;

create policy "Individuals can create todos." on todos for
    insert with check (auth.uid() = user_id);

create policy "Individuals can view their own todos. " on todos for
    select using (auth.uid() = user_id);

create policy "Individuals can update their own todos." on todos for
    update using (auth.uid() = user_id);
```

```
-- Make the updated at actually update dynamically with this function and trigger
create
or replace function update_todos_updated_at () returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger todos_updated_at_trigger before
update on todos for each row
execute function update_todos_updated_at ();
```

```
-- update many todos in one go (useful for archive functionality but supabase is bugging and not finding existing fn)
create
or replace function public.archive_todos (payload jsonb) returns void as $$
begin
  update todo
  set is_archived = true
  where id = any((payload ->> 'ids')::int[]);
end;
$$ language plpgsql;
```