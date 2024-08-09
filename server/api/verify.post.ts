import jwt from 'jsonwebtoken'

type Payload = {
  id: string
}

export default defineEventHandler(async (event) => {
  const { token } = await readBody(event)

  if(!token) {
    return {
      ok: false,
    }
  }

  const decoded = jwt.verify(token, process.env.APP_SECRET as string) as Payload

  return {
    ok: decoded && decoded.id === process.env.APP_ID,
  }
})