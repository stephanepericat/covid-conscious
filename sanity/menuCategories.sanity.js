import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
  *[(_type  in ["communityCategory", "educationCategory", "productCategory"]) && !(_id in path('drafts.**'))] | order(_type asc) | order(coalesce(name[$locale], name['${baseLanguage}']) asc) {
    "name": coalesce(name[$locale], name['${baseLanguage}'], null),
    "slug": uri.current,
    "type": _type,
  }
`;
