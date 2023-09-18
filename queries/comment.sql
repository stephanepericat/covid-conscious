-- 1. Create Comments table
create table public.comment (
  id               serial primary key,
  author_id        uuid not null references public.profiles(id),
  post_id          serial not null references public.post(id) on delete cascade,
  body             text,
  created_at       timestamp default now()
);

comment on table public.comment is 'A post comment written by a user.';
comment on column public.comment.id is 'The primary key for the comment.';
comment on column public.comment.author_id is 'The id of the author user.';
comment on column public.comment.post_id is 'The id of the post.';
comment on column public.comment.body is 'The main body text of our comment.';
comment on column public.comment.created_at is 'The time this post was created.';

-- 2. Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.comment
  enable row level security;

-- 3. Creating policies
create policy "Public comments are viewable by everyone." on public.comment
  for select using (true);

create policy "Users can insert their own comment." on public.comment
  for insert with check (auth.uid() = author_id);

create policy "Users can update own comment." on public.comment
  for update using (auth.uid() = author_id);

create policy "Users can delete own comment." on public.comment
  for delete using (auth.uid() = author_id);

-- 4. Create a total count function
create function public.get_comments_count(pid integer)
returns integer as $$
begin
  return(select count(*) from public.comment where post_id = pid);
end;
$$ language plpgsql stable;
