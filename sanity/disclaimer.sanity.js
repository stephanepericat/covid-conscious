import groq from "groq";

export default groq`
*[_type == "disclaimer"][0] {
  "title": title[$locale],
  "website": website[$locale],
  "links": links[$locale],
  "professional": professional[$locale],
  "testimonials": testimonials[$locale],
  "updated": _updatedAt,
}
`;
