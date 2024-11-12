import consola from 'consola'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  const { authorId, postId } = await readBody(event)

  if(!postId || !authorId) {
    throw createError({
      status: 400,
      message: "Bad request",
      statusMessage: "Post ID is missing",
    })
  }

  if(!user) {
    throw createError({
      status: 403,
      message: "Unauthorized",
      statusMessage: "You are not authorized to access this resource",
    })
  }

  try {
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
        author: {
          email: user.email,
        },
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
          },
        },
      }
    })

    if (!post) {
      throw createError({
        status: 404,
        message: "Not Found",
        statusMessage: "This post is not in our database",
      })
    }

    if(post.id !== postId || post.author?.id !== authorId) {
      throw createError({
        status: 403,
        message: "Unauthorized",
        statusMessage: "You are not authorized to access this resource",
      })
    }

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        published: false, // unpublish the post
      },
    })

    return true
  } catch (e) {
    consola.error(e)
    return false
  }
})
