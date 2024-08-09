import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const ok = password && password === process.env.APP_PASSWORD

  if(ok) {
    const token = await jwt.sign({ id: process.env.APP_ID }, process.env.APP_SECRET as string)
    setCookie(event, process.env.APP_COOKIE as string, token)
  }

  return {
    ok,
  }
})