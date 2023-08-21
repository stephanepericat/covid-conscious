-- 1. Create post_topic enum
create type public.post_topic as enum (
  'recovery',
  'self-care',
  'relationships',
  'products',
  'lifestyle',
  'long-covid'
);

-- 2. Create Post table
create table public.post (
  id               serial primary key,
  author_id        uuid not null references public.profiles(id),
  headline         text not null check (char_length(headline) < 280),
  body             text,
  topic            public.post_topic,
  created_at       timestamp default now()
);

comment on table public.post is 'A forum post written by a user.';
comment on column public.post.id is 'The primary key for the post.';
comment on column public.post.headline is 'The title written by the user.';
comment on column public.post.author_id is 'The id of the author user.';
comment on column public.post.topic is 'The topic this has been posted in.';
comment on column public.post.body is 'The main body text of our post.';
comment on column public.post.created_at is 'The time this post was created.';

-- 3. Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.post
  enable row level security;

-- 4. Creating policies
create policy "Public posts are viewable by everyone." on public.post
  for select using (true);

create policy "Users can insert their own post." on public.post
  for insert with check (auth.uid() = author_id);

create policy "Users can update own post." on public.post
  for update using (auth.uid() = author_id);

create policy "Users can delete own post." on public.post
  for delete using (auth.uid() = author_id);

-- 5. Create a total count function
create function public.get_post_count()
returns integer as $$
begin
  return(select count(*) from public.post);
end;
$$ language plpgsql stable;

-- 6. Create a topics function
create function public.get_topics()
returns text as $$
begin
  return(SELECT enum_range(NULL::post_topic));
end;
$$ language plpgsql stable;


-- 7. create search function
create function public.search_posts(search text) returns TABLE(id numeric, headline text, topic text, created_at date, author_id text, username text, avatar_url text) as $$
  select post.id,
  post.headline,
  post.topic,
  post.created_at,
  post.author_id,
  author.username,
  author.avatar_url
  from public.post as post
  inner join public.profiles as author on post.author_id = author.id
  where position(lower(search) in lower(post.headline)) > 0 or position(lower(search) in lower(post.body)) > 0
$$ language sql stable;

-- 8. Create a useer posts count function
create function public.get_user_post_count()
returns integer as $$
begin
  return(select count(*) from public.post where author_id = auth.uid());
end;
$$ language plpgsql stable;
