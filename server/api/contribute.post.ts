import emailjs from '@emailjs/nodejs'
import { parseBody } from '../../assets/utils/body-parser'

export default eventHandler(async (event) => {
  const { valid, errors, ...rest } = await readBody(event)
  const body = parseBody(rest)
  
  if(!valid) {
    return { ok: false }
  }

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID as string,
      process.env.EMAILJS_TEMPLATE_ID as string,
      body,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY as string,
        privateKey: process.env.EMAILJS_PRIVATE_KEY as string,
      },
    )

    return { ok: true }
  } catch(e) {
    const { message } = e as Error
    console.error(message, body)
    sendError(
      event,
      createError({ statusCode: 500, statusMessage: message, data: body })
    )
  }
})