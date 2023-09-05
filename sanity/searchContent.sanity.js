import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[[coalesce(title[$locale], title['en'], ''), coalesce(description[$locale], description['en'], [])[0].children[0].text] match $searchTerm] | order(_createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['en'], null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "category": category->name[$locale],
    "categoryUri": category->uri.current,
    "link": url,
    "path": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
  },
  "total": count(*[[coalesce(title[$locale], title['en']), coalesce(description[$locale], description['en'])[0].children[0].text] match $searchTerm])
}
`