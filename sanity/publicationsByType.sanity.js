import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[_type == $articleType] | order(publicationDate desc, _createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, null),
    "published": _createdAt,
    "category": coalesce(category->name[$locale], category->name['${baseLanguage}'], null),
    "categoryUri": category->uri.current,
    "summary": coalesce(summary[$locale], summary['${baseLanguage}'], summary, null),
    "link": url,
    "path": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
    "countryCode": contactInfo.country->code,
    "countryName": coalesce(contactInfo.country->name[$locale], contactInfo.country->name['${baseLanguage}'], null),
    "city": contactInfo.city,
    "language": coalesce(language, null)
  },
  "total": count(*[_type == $articleType])
}
`