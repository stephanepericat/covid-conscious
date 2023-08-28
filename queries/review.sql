-- 1. Create Reviews table
create table public.review (
  id               serial primary key,
  author_id        uuid not null references public.profiles(id),
  product_id       uuid not null,
  body             text not null,
  rating           integer not null,
  created_at       timestamp default now()
);

comment on table public.review is 'A product review written by a user.';
comment on column public.review.id is 'The primary key for the review.';
comment on column public.review.author_id is 'The id of the author user.';
comment on column public.review.product_id is 'The id of the product article.';
comment on column public.review.body is 'The main body text of our review.';
comment on column public.review.rating is 'The rating of our review.';
comment on column public.review.created_at is 'The time this post was created.';

-- 2. Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table public.review
  enable row level security;

-- 3. Creating policies
create policy "Public reviews are viewable by everyone." on public.review
  for select using (true);

create policy "Users can insert their own review." on public.review
  for insert with check (auth.uid() = author_id);

create policy "Users can update own review." on public.review
  for update using (auth.uid() = author_id);

-- 4. Create a total count function
create function public.get_reviews_count(pid uuid)
returns integer as $$
begin
  return(select count(*) from public.review where product_id = pid);
end;
$$ language plpgsql stable;

-- 5. Create a rating average function
create function public.get_rating_average(pid uuid)
returns text as $$
begin
  return(select AVG(rating)::numeric(10,2) from public.review where product_id = pid);
end;
$$ language plpgsql stable;

-- 6. Create a function to check that a user has posted a review
create function public.has_user_reviewed_product(pid uuid, userid uuid)
returns boolean as $$
begin
  return(select count(*) from public.review where product_id = pid and author_id = userid);
end;
$$ language plpgsql stable;
