import en from "./locales/en";
import es from "./locales/en";
import fr from "./locales/fr";
import pt from "./locales/pt";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: {
    en,
    es,
    fr,
    pt,
  }
}));
