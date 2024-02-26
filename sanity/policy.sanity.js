import groq from 'groq'
import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == "policy" && title[_key == '${baseLanguage}'][0].value == $policyType] {
  "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, ''),
  "contents": coalesce(contents[_key == $locale][0].value, contents[_key == '${baseLanguage}'][0].value, []),
}
`