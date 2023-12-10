import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// DEPRECATED !
// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[_type == $articleType && category->uri.current == $articleCategory] | order(_createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "description": coalesce(description[$locale], description['${baseLanguage}'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    "categoryUri": category->uri.current,
    "link": url,
    "path": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
  },
  "categoryLabel": *[_type == $categoryTable && uri.current == $articleCategory][0] {
    "label": coalesce(name[$locale], name['${baseLanguage}'], null),
  },
  "total": count(*[_type == $articleType && category->uri.current == $articleCategory])
}
`