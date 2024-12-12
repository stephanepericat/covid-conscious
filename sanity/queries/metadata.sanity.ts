import groq from 'groq'
import { baseLanguage } from '../../assets/constants/base-language'

const METADATA_QUERY = groq`
*[_type == $type && tags[0]->uri.current == $category && uri.current == $slug][0] {
  "title": coalesce(title[_key == $locale][0].value, title[_key == '${baseLanguage}'][0].value, title[_key == ^.language][0].value, title[$locale], title['${baseLanguage}'], title, ''),
  "description": array::join(string::split((pt::text(coalesce(description[_key == $locale][0].value, description[_key == '${baseLanguage}'][0].value, null))), "")[0..252], "") + '...',
  "image": visual.asset->url,
  "name": coalesce(name, null),
}
`

export { METADATA_QUERY as default }
