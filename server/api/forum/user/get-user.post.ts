import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  try {
    return await prisma.user.findUniqueOrThrow({
      where: {
        email
      }
    })
  } catch (e) {
    consola.error(e)
    return null
  }
})