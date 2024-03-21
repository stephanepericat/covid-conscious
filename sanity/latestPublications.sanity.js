import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
{
  //COMMUNITY
  "community": *[(_type == "community") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // EDUCATION
  "learn": *[(_type == "education") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, null),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // NEWS
  "news": *[(_type == "link") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
    title,
    "published": _createdAt,
    "link": url,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
    "locked": coalesce(premiumAccess, false),
    "limited": coalesce(limitedAccess, false),
  },
  // PRODUCTS
  "products": *[(_type == "product") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, ''),
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // VIDEOS
  "videos": *[_type == 'video' && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
    "id": _id,
    title,
    embedCode,
    "published": _createdAt,
    "author": author-> { nickname, "slug": uri.current },
    "date": publicationDate,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "summary": coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, ""),
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
    "thumbnail": visual.asset._ref,
  },
  // SCIENTIFIC LIBRARY
  "library": *[(_type == "scientific-library") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
    title,
    "published": _createdAt,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "summary": array::join(string::split(coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, ""), "")[0..255], "") + "...",
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
    "locked": coalesce(premiumAccess, false),
    "limited": coalesce(limitedAccess, false),
  },
  // RESOURCES
  "resources": *[(_type == "resource") && !(_id in path('drafts.**')) && (language == $locale)] | order(_createdAt desc)[0..4]{
    title,
    "published": _createdAt,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "summary": array::join(string::split(coalesce(summary[_key == $locale][0].value, summary[_key == '${baseLanguage}'][0].value, summary[_key == ^.language][0].value, ""), "")[0..127], "") + "...",
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // EVENTS
  "events": *[_type == 'event' && !(_id in path('drafts.**')) && string(eventDate) >= string::split(string(now()), "T")[0]] | order(eventDate desc) {
    "id": _id,
    title,
    "date": eventDate,
    "end": endDate,
    "summary": array::join(string::split(coalesce(eventInfo[_key == $locale][0].value, eventInfo[_key == ^.language][0].value, ''), '')[0..255], '') + "...",
    isEventFree,
    language,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
}
`