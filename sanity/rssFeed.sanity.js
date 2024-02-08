import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
  {
    "all_entries": *[(_type in ["link", "scientific-library", "video", "resource", "product", "community", "education"]) && !(_id in path('drafts.**'))]| order(_createdAt desc) {
      "id": _id,
      "type": _type,
      "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
      "description": array::join(string::split((pt::text(coalesce(description[$locale], description['${baseLanguage}'], null))), "")[0..252], "") + "...",
      "summary": array::join(string::split(coalesce(summary[$locale], summary['${baseLanguage}'], summary, ''), '')[0..252], ''),
      "publishedAt": _createdAt,
      "updatedAt": _updatedAt,
      "link": url,
      "slug": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
      "source": source,
      "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
      "image": visual.asset->url,
      "author": author-> { "name": nickname },
    },
    "settings": *[_type == "feedSettings"][0] {
      "title": title,
      "description": coalesce(description[$locale], description['${baseLanguage}'], null),
      "image": logo.asset->url,
      "author": {
        "email": author.email,
        "name": author.name,
      },
    },
  } | {
    "entries": all_entries[0..20],
    "settings": settings
  }
`;
