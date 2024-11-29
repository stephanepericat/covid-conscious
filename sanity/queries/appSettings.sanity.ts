import groq from 'groq'
// import { baseLanguage } from '~/assets/constants/base-language'

const APP_SETTINGS_QUERY = groq`
*[_type == 'appSettings'] {
  key,
  "value": coalesce(valueString, valueBoolean, valueNumber, null)
}
`

export {
  APP_SETTINGS_QUERY as default
}