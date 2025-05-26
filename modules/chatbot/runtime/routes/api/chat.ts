export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    // const body = await readBody(event)
    // return {
    //   message: `Hello ${body.name}!`,
    // }
    return {
      ok: true,
    }
  })
})
