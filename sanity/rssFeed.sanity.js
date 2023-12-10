import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
  {
    "entries": *[_type in ["product", "link", "education", "community", "scientific-library"]][0..10] | order(_updatedAt desc) {
      "id": _id,
      "type": _type,
      "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
      // TODO: fix description for library items
      "description": array::join(string::split((pt::text(coalesce(description[$locale], description['${baseLanguage}'], null))), "")[0..255], "") + "...",
      "publishedAt": _createdAt,
      "updatedAt": _updatedAt,
      "link": url,
      "slug": "/" + _type + "/" + category->uri.current + "/" + uri.current,
      "source": source,
      "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
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
  }
`;
