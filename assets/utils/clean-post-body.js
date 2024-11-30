export const cleanPostBody = (str) =>
  `${str.replace(/(<([^>]+)>)/gi, '').substr(0, 255)}...`
