import groq from "groq";

export default groq`
  {
    "entries": *[_type in ["product", "link", "education", "community"]][0..10] | order(_updatedAt desc) {
      "id": _id,
      "type": _type,
      "title": title[$locale],
      "description": array::join(string::split((pt::text(description[$locale])), "")[0..255], "") + "...",
      "publishedAt": _createdAt,
      "updatedAt": _updatedAt,
      "link": url,
      "slug": "/" + _type + "/" + category->uri.current + "/" + uri.current,
      "source": source,
      "category": category->name[$locale],
      "image": visual.asset->url,
      "author": author-> { "name": nickname },
    },
    "settings": *[_type == "feedSettings"][0] {
      "title": title,
      "description": description[$locale],
      "image": logo.asset->url,
      "author": {
        "email": author.email,
        "name": author.name,
      },
    },
  }
`;
