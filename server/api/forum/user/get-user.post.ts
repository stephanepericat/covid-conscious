import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  const { email } = await readBody(event)

  if(!email) {
    throw createError({
      status: 400,
      message: "Bad request",
      statusMessage: "Email is missing",
    });
  }

  if(!user || user.email !== email) {
    throw createError({
      status: 403,
      message: "Unauthorized",
      statusMessage: "You are not authorized to access this resource",
    });
  }

  try {
    return await prisma.user.findUniqueOrThrow({
      where: {
        email
      },
      include: {
        profile: true,
      },
      cacheStrategy: {
        ttl: 60,
        tags: ['get_user']
      }
    })
    .withAccelerateInfo()
  } catch (e) {
    consola.error(e)
    return null
  }
})