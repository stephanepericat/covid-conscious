import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
{
  "community": *[(_type == "community") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  "learn": *[(_type == "education") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  "news": *[(_type == "link") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": url,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  "products": *[(_type == "product") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  "videos": *[_type == 'video' && !(_id in path('drafts.**')) && (language == $locale) && defined(embedCode)] {
    "id": _id,
    title,
    embedCode,
    "published": _createdAt,
    "author": author-> { nickname, "slug": uri.current },
    "date": publicationDate,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  }
}
`