import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == "policy" && title['${baseLanguage}'] == $policyType] {
  "title": coalesce(title[$locale], title['${baseLanguage}'], ''),
  "contents": coalesce(contents[$locale], contents['${baseLanguage}'], ''),
}
`