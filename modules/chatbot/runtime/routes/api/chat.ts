export default defineLazyEventHandler(() => {
  return defineEventHandler(async (event) => {
    // make sure user is authenticated
    await requireUserSession(event)

    // const body = await readBody(event)
    // return {
    //   message: `Hello ${body.name}!`,
    // }
    return {
      ok: true,
    }
  })
})
