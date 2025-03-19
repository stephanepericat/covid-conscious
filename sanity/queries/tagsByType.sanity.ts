import groq from 'groq'

const TAGS_BY_TYPE_QUERY = groq`
  {
  "tags": array::unique(*[_type == $type] {
    "tags": tags[]->uri.current
  }
  .tags[])
  } | {
    "t": *[_type == 'tag' && uri.current in ^.tags] | order(name[$locale], "desc") {
      "id": uri.current,
      "name": name[$locale]
    }
  }.t[]
`

export { TAGS_BY_TYPE_QUERY as default }
