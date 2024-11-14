import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { productId, skip } = await readBody(event)

  if(!productId) {
    throw createError({
      status: 400,
      message: "Bad request",
      statusMessage: "Product ID is missing",
    })
  }

  try {
    const reviews = await prisma
      .review
      .findMany({
        where: {
          productId,
          published: true, // only get published posts
        },
        omit: {
          authorId: true,
          published: true,
        },
        take: 5,
        skip,
        orderBy: {
          createdAt: 'desc',
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
        },
        cacheStrategy: {
          ttl: 60,
          swr: 5,
          tags: ['get_reviews']
        },
      }).withAccelerateInfo()

      consola.info('GET REVIEWS - ', reviews.info)

      const reviewCount = await prisma.review.count({
        where: {
          published: true,
        },
        cacheStrategy: {
          ttl: 60,
          swr: 5,
          tags: ['get_reviews_count']
        },
      }).withAccelerateInfo()

      consola.info('GET REVIEWS COUNT - ', reviewCount.info)

      return { entries: reviews.data || [], total: reviewCount.data || 0 }
  } catch (e) {
    consola.error(e)
    return { entries: [], total: 0 }
  }
})