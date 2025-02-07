import groq from 'groq'
import { BASE_LANGUAGE } from '../../assets/constants/base-language'

const PUBLICATION_BY_TYPE_QUERY = groq`
{
  "results": *[_type == $type && !(_id in path('drafts.**'))] | order(publicationDate desc, _createdAt desc)[$start..$end] {
    "attributes": {
      "free": coalesce(isEventFree, false),
      "limited": coalesce(limitedAccess, false),
      "onlineOnly": coalesce(onlineOnly, false),
      "premium": coalesce(premiumAccess, false),
    },
    "date": coalesce(eventDate, publicationDate, _createdAt),
    "description": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${BASE_LANGUAGE}'][0].value, [])), "")[0..512], "") + "...",
    "id": _id,
    "language": language,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), "uri": uri.current },
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${BASE_LANGUAGE}'][0].value, title[_key == ^.language][0].value, title[$locale], title['${BASE_LANGUAGE}'], title, null),
    "type": _type,
    "url": url,
    "visual": visual.asset._ref,
  },
  "info": {
    "locale": coalesce($locale, "en"),
    "start": coalesce($start, 0),
    "end": coalesce($end, 5),
    "total": coalesce(count(*[_type == $type && !(_id in path('drafts.**'))]), 0),
  },
}
`

export { PUBLICATION_BY_TYPE_QUERY as default }
