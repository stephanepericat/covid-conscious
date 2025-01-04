import groq from 'groq'
import { BASE_LANGUAGE } from '../../assets/constants/base-language'

const LATEST_PUBLICATIONS_QUERY = groq`
  {
    "blog": *[(_type == "blog") && !(_id in path('drafts.**'))] | order(_createdAt asc)[0..2] {
      "id": _id,
      "date": _createdAt,
      "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
      "description": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${BASE_LANGUAGE}'][0].value, description[_key == ^.language][0].value)), "")[0..127], "") + "...",
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "tags": tags[]-> { "name": coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), "uri": uri.current },
      "title": coalesce(title[$locale], title['${BASE_LANGUAGE}'], ''),
      "type": _type,
      "visual": visual.asset._ref,
    },
    "events": *[_type == 'event' && !(_id in path('drafts.**')) && (string(eventDate) >= string::split(string(now()), 'T')[0] || string(endDate) >= string::split(string(now()), 'T')[0])] | order(eventDate asc) {
      "id": _id,
      "date": eventDate,
      "description": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${BASE_LANGUAGE}'][0].value)), '')[0..255], '') + '...',
      "end": endDate,
      "free": coalesce(isEventFree, false),
      "link": '/' + _type + '/' + tags[0]->uri.current + '/' + uri.current,
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "tags": tags[]-> { 'label': coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current },
      "title": title,
      "visual": visual.asset._ref,
    },
    "library": *[(_type == "scientific-library") && !(_id in path('drafts.**')) && (language == $locale)] | order(publicationDate desc)[0..4]{
      "id": _id,
      "date": publicationDate,
      "description": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${BASE_LANGUAGE}'][0].value, [])), "")[0..255], "") + "...",
      "limited": coalesce(limitedAccess, false),
      "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "premium": coalesce(premiumAccess, false),
      "tags": tags[]-> { 'label': coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current },
      "title": title,
      "visual": visual.asset._ref,
    },
    "news": *[_type == 'news' && !(_id in path('drafts.**')) && language == $locale] | order(publicationDate desc)[0..5] {
      "id": _id,
      "date": publicationDate,
      "limited": coalesce(limitedAccess, false),
      "link": url,
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "premium": coalesce(premiumAccess, false),
      "tags": tags[]-> { 'label': coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current },
      "title": title,
      "visual": visual.asset._ref,
    },
    "phw": *[_type == 'public-health' && !(_id in path('drafts.**')) && language == $locale] | order(publicationDate desc)[0..4] {
      "id": _id,
      "date": publicationDate,
      "description": null,
      "limited": coalesce(limitedAccess, false),
      "link": url,
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "premium": coalesce(premiumAccess, false),
      "tags": tags[]-> { 'label': coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current },
      "title": title,
      "visual": visual.asset._ref,
    },
    "showcase": *[_type in ['news', 'scientific-library', 'public-health', 'video'] && !(_id in path('drafts.**')) && language == $locale] | order(_createdAt desc)[0..4] {
      "id": _id,
      "link": url,
      "title": title,
      "visual": visual.asset->url,
    },
    "videos": *[_type == 'video' && !(_id in path('drafts.**')) && (language == $locale) ] | order(publicationDate desc)[0..5]{
      "id": _id,
      "date": publicationDate,
      "description": array::join(string::split(pt::text(coalesce(description[_key == $locale][0].value, description[_key == ^.language][0].value, description[_key == '${BASE_LANGUAGE}'][0].value)), '')[0..255], '') + '...',
      "link": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
      "metadata": visual.asset->metadata.dimensions { aspectRatio, height, width },
      "tags": tags[]-> { 'label': coalesce(name[$locale], name['${BASE_LANGUAGE}'], ''), 'slug': uri.current },
      "title": title,
      "visual": visual.asset._ref,
    },
  }
`

export { LATEST_PUBLICATIONS_QUERY as default }
