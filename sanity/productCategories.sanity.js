import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
  *[_type  == "productCategory"] | order(coalesce(name[$locale], name['${baseLanguage}']) asc)
`;
