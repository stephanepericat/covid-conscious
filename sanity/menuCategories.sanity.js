import groq from "groq";

export default groq`
  *[(_type  in ["communityCategory", "educationCategory", "productCategory"]) && !(_id in path('drafts.**'))] | order(_type asc) | order(name[$locale] asc) {
    "name": name[$locale],
    "slug": uri.current,
    "category": _type,
  }
`;
