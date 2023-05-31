import groq from "groq";

export default groq`
*[[title[$locale], description[$locale][0].children[0].text] match $searchTerm] | order(_createdAt desc){
  "title": title[$locale],
  "author": author-> { nickname, "slug": uri.current },
  "published": _createdAt,
  "category": category->name[$locale],
  "categoryUri": category->uri.current,
  "link": url,
  "source": source,
  "thumbnail": visual.asset->url,
  "type": _type,
  "uri": uri.current,
}
`