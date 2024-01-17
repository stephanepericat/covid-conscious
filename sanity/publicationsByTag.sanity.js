import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[$slug in tags[]->uri.current] | order(publicationDate desc, _createdAt desc){
    // "id": _id,
    "title": coalesce(title[$locale], title['${baseLanguage}'], title, null),
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, null),
    "published": _createdAt,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "categoryUri": tags[0]->uri.current,
    "summary": array::join(string::split(coalesce(summary[$locale], summary['${baseLanguage}'], summary, ""), "")[0..512], "") + "...",
    "link": url,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
    "countryCode": contactInfo.country->code,
    "countryName": coalesce(contactInfo.country->name[$locale], contactInfo.country->name['${baseLanguage}'], null),
    "city": contactInfo.city,
    "language": coalesce(language, $locale),
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
  },
  "metadata": *[_type == "tag" && uri.current == $slug][0] {
    "label": coalesce(name[$locale], name['${baseLanguage}'], ''),
  },
  "total": count(*[$slug in tags[]->uri.current])
}
`