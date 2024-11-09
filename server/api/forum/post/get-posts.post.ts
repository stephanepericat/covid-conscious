import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event) 

  if(!user) {
    throw createError({
      status: 403,
      message: "Unauthorized",
      statusMessage: "You are not authorized to access this resource",
    });
  }

  try {
    return await prisma
      .post
      .findMany({
        where: {
          published: true, // only get published posts
        },
        omit: {
          authorId: true,
          published: true,
        },
        take: 5,
        orderBy: {
          published: 'desc',
        },
        include: {
          author: {
            omit: {
              email: true,
              role: true,
            },
            include: {
              profile: {
                omit: {
                  bio: true,
                  website: true,
                  id: true,
                  userId: true,
                }
              },
            },
          },
          categories: true,
        },
        cacheStrategy: {
          ttl: 60,
          swr: 5,
          tags: ['get_posts']
        }
      })
      .withAccelerateInfo()
  } catch (e) {
    consola.error(e)
    return null
  }
})