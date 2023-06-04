import groq from "groq";

export default groq`
*[_type == $type && category->uri.current == $category && uri.current == $slug][0] {
  "id": _id,
  "title": title[$locale],
  "author": author-> { nickname, "slug": uri.current, "avatar": visual.asset->url },
  "published": _createdAt,
  "updated": _updatedAt,
  "body": description[$locale],
  "category": category->name[$locale],
  // "thumbnail": visual.asset->url,
  "info": contactInfo {
    "street1": streetAdressOne,
    "street2": streetAdressTwo,
    city,
    zipCode,
    "phone": phoneNumber,
    email,
    website,
  },
}
`