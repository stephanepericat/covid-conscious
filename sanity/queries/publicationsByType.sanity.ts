import groq from 'groq'
import { baseLanguage } from '../../assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
const PUBLICATION_BY_TYPE_QUERY = groq`
{
  "results": *[_type == $articleType] | order(publicationDate desc, _createdAt desc){
    // "id": _id,
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title[_key == ^.language][0].value, title[$locale], title['${baseLanguage}'], title, null),
    name,
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, eventDate, null),
    "end": endDate,
    "published": _createdAt,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "categoryUri": tags[0]->uri.current,
    "shortDescription": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${baseLanguage}'][0].value, [])), "")[0..512], "") + "...",
    "link": url,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "contentType": coalesce(contentType, null),
    "uri": uri.current,
    "countryCode": contactInfo.country->code,
    "countryName": coalesce(contactInfo.country->name[_key == $locale][0].value, contactInfo.country->name[_key == '${baseLanguage}'][0].value, null),
    "city": contactInfo.city,
    "language": coalesce(language, null),
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "locked": coalesce(premiumAccess, false),
    "limited": coalesce(limitedAccess, false),
    "onlineOnly": onlineOnly,
    "free": isEventFree,
  },
  "total": count(*[_type == $articleType])
}
`

export { PUBLICATION_BY_TYPE_QUERY as default }
