import { URL_REGEX } from "../constants/url-validation-regex";

export const urlValidator = (v) => {
  if(!v.length) {
    return true;
  }

  return URL_REGEX.test(v);
};
