import groq from 'groq'

const SITEMAP_QUERY = groq`
*[_type in ['education', 'product', 'resource', 'scientific-library', 'video', 'covidnet', 'brand'] && !(_id in path('drafts.**'))] | order(_updatedAt desc) {
  "id": _id,
  "lastmod": _updatedAt,
  "loc": "/" + _type + "/" + tags[0]->uri.current + "/" + uri.current,
  "images": *[_type == ^._type && _id == ^._id && defined(visual.asset)] {
    "loc": visual.asset->url,
  },
}
`

export { SITEMAP_QUERY as default }
