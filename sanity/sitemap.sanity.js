import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type in ['education', 'product', 'resource', 'scientific-library', 'video'] && !(_id in path('drafts.**'))] | order(_updatedAt desc) {
  "id": _id,
  "lastmod": _updatedAt,
  "loc": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
  "images": *[_type == ^._type && _id == ^._id && defined(visual.asset)] {
    "loc": visual.asset->url,
  },
}
`