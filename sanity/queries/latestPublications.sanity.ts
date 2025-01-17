import groq from 'groq'
import { baseLanguage } from '../../assets/constants/base-language'

const LATEST_PUBLICATIONS_QUERY = groq`
{
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
  "news": *[(_type == "news") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
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
  // "products": *[(_type == "product") && !(_id in path('drafts.**'))] | order(_createdAt desc)[0..4]{
  //   "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, ''),
  //   "author": author-> { nickname, "slug": uri.current },
  //   "published": _createdAt,
  //   "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
  //   "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
  //   "thumbnail": visual.asset._ref,
  //   "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
  //   "type": _type,
  // },
  // VIDEOS
  "videos": *[_type == 'video' && !(_id in path('drafts.**')) && (language == $locale) ] | order(publicationDate desc, _createdAt desc)[0..2]{
    "id": _id,
    title,
    embedCode,
    "published": _createdAt,
    "author": author-> { nickname, "slug": uri.current },
    "date": publicationDate,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, description[_key == ^.language][0].value)), "")[0..255], "") + "...",
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
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${baseLanguage}'][0].value, [])), "")[0..255], "") + "...",
    "date": publicationDate,
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
    "locked": coalesce(premiumAccess, false),
    "limited": coalesce(limitedAccess, false),
  },
  // RESOURCES
  "resources": *[(_type == "resource") && !(_id in path('drafts.**')) && (language == $locale)] | order(title asc)[0..4]{
    title,
    "published": _createdAt,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, description[_key == ^.language][0].value)), "")[0..127], "") + "...",
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // EVENTS
  "events": *[_type == 'event' && !(_id in path('drafts.**')) && (string(eventDate) >= string::split(string(now()), "T")[0] || string(endDate) >= string::split(string(now()), "T")[0])] | order(eventDate asc) {
    "id": _id,
    title,
    "date": eventDate,
    "end": endDate,
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value)), '')[0..255], '') + "...",
    isEventFree,
    language,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
    "visual": visual.asset._ref,
  },
  // PUBLIC HEALTH
  "health": *[(_type == "public-health") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc, _createdAt desc)[0..4]{
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
  // DIRECTORY
  "directory": *[(_type == "directory") && !(_id in path('drafts.**')) && (language == $locale)] | order(title asc)[0..4]{
    title,
    "published": _createdAt,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    onlineOnly,
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, description[_key == ^.language][0].value, null)), "")[0..127], "") + "...",
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  },
  // PROMOTIONAL ZONES
  "promos": *[(_type == "promo") && !(_id in path('drafts.**')) && (enabled)] {
    "external": isExternalLink,
    name,
    url,
    "visual": visual.asset._ref,
    "zoneId": zoneId.current,
  },
  // BLOG
  "blog": *[(_type == "blog") && !(_id in path('drafts.**'))] | order(_createdAt asc)[0..2] {
    "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, ''),
    "published": _createdAt,
    "path": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
    "category": coalesce(tags[0]->name[$locale], tags[0]->name['${baseLanguage}'], null),
    source,
    "summary": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, description[_key == ^.language][0].value)), "")[0..127], "") + "...",
    "thumbnail": visual.asset._ref,
    "tags": tags[]-> { "name": coalesce(name[$locale], name['${baseLanguage}'], ''), "uri": uri.current },
    "type": _type,
  }
}
`

export { LATEST_PUBLICATIONS_QUERY as default }
