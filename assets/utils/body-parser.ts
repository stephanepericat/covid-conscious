export const parseBody = (body) =>
  Object.keys(body).reduce((acc, val) => {
    if (body[val].value) {
      acc[val] = body[val].value || null
    }

    return acc
  }, {})
