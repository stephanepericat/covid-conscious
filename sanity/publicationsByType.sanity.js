import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[_type == $articleType] | order(_createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], null),
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
    "countryCode": contactInfo.country->code,
    "countryName": coalesce(contactInfo.country->name[$locale], contactInfo.country->name['${baseLanguage}'], null),
    "city": contactInfo.city,
  },
  "total": count(*[_type == $articleType])
}
`