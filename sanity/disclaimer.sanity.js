import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == "disclaimer"][0] {
  "title": coalesce(title[$locale], title['${baseLanguage}'], null),
  "website": coalesce(website[$locale], website['${baseLanguage}'], null),
  "links": coalesce(links[$locale], links['${baseLanguage}'], null),
  "professional": coalesce(professional[$locale], professional['${baseLanguage}'], null),
  "testimonials": coalesce(testimonials[$locale], testimonials['${baseLanguage}'], null),
  "updated": _updatedAt,
}
`;
