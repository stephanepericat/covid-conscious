import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == $type && tags[0]->uri.current == $category && uri.current == $slug][0] {
  "id": _id,
  "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title[_key == ^.language][0].value, title, ''),
  "author": author-> { nickname, "slug": uri.current, "avatar": visual.asset._ref },
  "published": _createdAt,
  "date": coalesce(publicationDate, eventDate),
  "end": endDate,
  "updated": _updatedAt,
  "body": coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${baseLanguage}'][0].value, []),
  "summary": coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, eventInfo[_key == $locale][0].value, eventInfo[_key == ^.language][0].value, ''),
  "description": array::join(string::split((pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, null))), "")[0..252], ""),
  "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
  "info": contactInfo {
    "street1": streetAdressOne,
    "street2": streetAdressTwo,
    city,
    zipCode,
    "country": coalesce(country->name[_key == $locale][0].value, country->name[_key == '${baseLanguage}'][0].value, null),
    "phone": phoneNumber,
    email,
    website,
  },
  "link": url,
  embedCode,
  language,
  location,
  onlineOnly,
  "free": isEventFree,
  "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
  "promos": *[(_type == "promo") && !(_id in path('drafts.**')) && (enabled)] {
    "external": isExternalLink,
    name,
    url,
    "visual": visual.asset._ref,
    "zoneId": zoneId.current,
  },
  "image": visual.asset->url,
}
`