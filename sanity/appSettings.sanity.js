import groq from 'groq'
// import { baseLanguage } from '~/assets/constants/base-language'

export default groq`
*[_type == 'appSettings'] {
  key,
  "value": coalesce(valueString, valueBoolean, valueNumber, null)
}
`