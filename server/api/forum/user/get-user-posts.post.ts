import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  if(!email) {
    throw createError({
      status: 400,
      message: "Bad request",
      statusMessage: "Email is missing",
    })
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email
      },
      include: {
        posts: {
          where: {
            published: true,
          },
          include: {
            author: {
              omit: {
                role: true,
              },
              include: {
                profile: {
                  omit: {
                    id: true,
                    bio: true,
                    website: true,
                    userId: true,
                  },
                },
              },
            },
          },
          omit: {
            authorId: true,
            updatedAt: true,
            published: true,
          },
        },
      },
      cacheStrategy: {
        ttl: 60,
        tags: ['get_user']
      }
    })
    .withAccelerateInfo()

    consola.info('GET USER POSTS - ', user.info)

    return user.data?.posts || []
  } catch (e) {
    consola.error(e)
    return []
  }
})