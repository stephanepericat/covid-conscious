import groq from "groq";

// TODO: pagination when dataset gets too large... https://www.sanity.io/docs/paginating-with-groq
export default groq`
{
  "results": *[_type == $articleType] | order(_createdAt desc){
    // "id": _id,
    "title": title[$locale],
    "author": author-> { nickname, "slug": uri.current },
    "published": _createdAt,
    "category": category->name[$locale],
    "categoryUri": category->uri.current,
    "link": url,
    "path": "/" + _type + "/" + category->uri.current + "/" + uri.current,
    "source": source,
    "thumbnail": visual.asset._ref,
    "type": _type,
    "uri": uri.current,
  },
  "total": count(*[_type == $articleType])
}
`