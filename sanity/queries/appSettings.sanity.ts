import groq from 'groq'
// import { BASE_LANGUAGE } from '~/assets/constants/base-language'

const APP_SETTINGS_QUERY = groq`
*[_type == 'appSettings'] {
  key,
  "value": coalesce(valueString, valueBoolean, valueNumber, null)
}
`

export { APP_SETTINGS_QUERY as default }
