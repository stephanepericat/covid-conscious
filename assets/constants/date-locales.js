import { enUS, fr, es, ptBR } from 'date-fns/locale'
import { baseLanguage } from './base-language'

export const locales = {
  'en': enUS,
  'es': es,
  'fr': fr,
  'pt': ptBR
}

export const getDateLocale = (locale) => locales[locale] || locale[baseLanguage]
