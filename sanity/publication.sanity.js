import groq from "groq";

export default groq`
*[_type == $type && category->uri.current == $category && uri.current == $slug][0] {
  "id": _id,
  "title": title[$locale],
  "author": author-> { nickname, "slug": uri.current, "avatar": visual.asset._ref },
  "published": _createdAt,
  "updated": _updatedAt,
  "body": description[$locale],
  "category": category->name[$locale],
  "info": contactInfo {
    "street1": streetAdressOne,
    "street2": streetAdressTwo,
    city,
    zipCode,
    "country": coalesce(country->name[$locale], country->name['en'], null),
    "phone": phoneNumber,
    email,
    website,
  },
  "link": url,
}
`