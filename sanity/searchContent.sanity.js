import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[_type != "feedSettings" && [coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title, null), coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, null), coalesce(eventInfo[_key == $locale][0].value, eventInfo[_key == ^.language][0].value, ''), coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, [])[0].children[0].text] match $searchTerm] | order(publicationDate desc, _createdAt desc){
    "id": _id,
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title, null),
    "author": author-> { nickname, "slug": uri.current },
    "date": coalesce(publicationDate, eventDate, null),
    "end": endDate,
    "published": _createdAt,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "categoryUri": tags[0]->uri.current,
    "summary": array::join(string::split(coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_keyy == ^.language][0].value, eventInfo[_key == $locale][0].value, eventInfo[_key == ^.language][0].value, ""), "")[0..512], "") + "...",
    "link": url,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
    "language": coalesce(language, $locale),
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
  },
  "total": count(*[_type != "feedSettings" && [coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title, null), coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, null), coalesce(eventInfo[_key == $locale][0].value, eventInfo[_key == ^.language][0].value, ''), coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, [])[0].children[0].text] match $searchTerm])
}
`