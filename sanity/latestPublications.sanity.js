import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
{
  "community": *[(_type == "community") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
  },
  "learn": *[(_type == "education") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
  },
  "news": *[(_type == "link") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": url,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    source,
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
  },
  "products": *[(_type == "product") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
  },
}
`