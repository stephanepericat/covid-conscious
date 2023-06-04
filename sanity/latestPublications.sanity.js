import groq from "groq";

export default groq`
{
  "community": *[(_type == "community") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": title[$locale],
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": category->name[$locale],
    "thumbnail": visual.asset._ref,
  },
  "learn": *[(_type == "education") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": title[$locale],
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": category->name[$locale],
    "thumbnail": visual.asset._ref,
  },
  "news": *[(_type == "link") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": title[$locale],
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": url,
    "category": category->name[$locale],
    source,
    "thumbnail": visual.asset._ref,
  },
  "products": *[(_type == "product") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": title[$locale],
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": category->name[$locale],
    "thumbnail": visual.asset._ref,
  },
}
`