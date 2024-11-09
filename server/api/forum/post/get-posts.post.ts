import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  try {
    const posts = await prisma
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
        },
      }).withAccelerateInfo()

      consola.info('GET POSTS - ', posts.info)

      const postCount = await prisma.post.count({
        where: {
          published: true,
        },
        cacheStrategy: {
          ttl: 60,
          swr: 5,
          tags: ['get_posts']
        },
      }).withAccelerateInfo()

      consola.info('GET POSTS COUNT - ', postCount.info)

      return { entries: posts.data || [], total: postCount.data || 0 }
  } catch (e) {
    consola.error(e)
    return null
  }
})