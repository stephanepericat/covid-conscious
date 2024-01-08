import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == $type && (category->uri.current == $category || tags[0]->uri.current == $category) && uri.current == $slug][0] {
  "id": _id,
  "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
  "author": author-> { nickname, "slug": uri.current, "avatar": visual.asset._ref },
  "published": _createdAt,
  "updated": _updatedAt,
  "body": coalesce(description[$locale], description['${baseLanguage}'], []),
  "summary": coalesce(summary[$locale], summary['${baseLanguage}'], ''),
  "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], category->name[$locale], category->name['${baseLanguage}'], null),
  "info": contactInfo {
    "street1": streetAdressOne,
    "street2": streetAdressTwo,
    city,
    zipCode,
    "country": coalesce(country->name[$locale], country->name['${baseLanguage}'], null),
    "phone": phoneNumber,
    email,
    website,
  },
  "link": url,
  embedCode,
  language,
  "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
}
`