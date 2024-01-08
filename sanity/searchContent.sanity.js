import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[[coalesce(title[$locale], title['${baseLanguage}'], title, ''), coalesce(summary[$locale], summary['${baseLanguage}'], summary, null), coalesce(description[$locale], description['${baseLanguage}'], [])[0].children[0].text] match $searchTerm] | order(publicationDate desc, _createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, null),
    "published": _createdAt,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], category->name[$locale], category->name['${baseLanguage}'], null),
    "categoryUri": coalesce(tags[0]->uri.current, category->uri.current),
    "summary": coalesce(summary[$locale], summary['${baseLanguage}'], summary, null),
    "link": url,
    "path": "/" + _type + "/" + coalesce(tags[0]->uri.current, category->uri.current) + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
  },
  "total": count(*[[coalesce(title[$locale], title['${baseLanguage}']), coalesce(summary[$locale], summary['${baseLanguage}'], summary, null), coalesce(description[$locale], description['${baseLanguage}'])[0].children[0].text] match $searchTerm])
}
`