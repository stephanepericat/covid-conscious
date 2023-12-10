import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[[coalesce(title[$locale], title['${baseLanguage}'], title, ''), coalesce(description[$locale], description['${baseLanguage}'], [])[0].children[0].text] match $searchTerm] | order(publicationDate desc, _createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, null),
    "published": _createdAt,
    "category": category->name[$locale],
    "categoryUri": category->uri.current,
    "description": coalesce(description[$locale], description['${baseLanguage}'], description, null),
    "link": url,
    "path": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
  },
  "total": count(*[[coalesce(title[$locale], title['${baseLanguage}']), coalesce(description[$locale], description['${baseLanguage}'])[0].children[0].text] match $searchTerm])
}
`