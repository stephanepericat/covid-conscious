// @vitest-environment nuxt

import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from 'nuxt-vitest/utils'
import { usePosts } from '~/assets/composables/usePosts'

import mockCreateComment from '~/tests/__fixtures__/createComment.json'
import mockPost from '~/tests/__fixtures__/getPost.json'
import mockPostPayload from '~/tests/__fixtures__/createPostPayload.json'
import mockTopics from '~/tests/__fixtures__/topics.json'

const { useSupabaseClientMock } = vi.hoisted(() => {
  return {
    useSupabaseClientMock: vi.fn().mockImplementation(() => {
      return {
        from: vi.fn(),
        rpc: vi.fn(async() => ({ data: null, error: 'Something went wrong' })),
        storage: {
          from: vi.fn(() => ({ download: vi.fn(async () => ({ data: new Blob(), error: null })) }))
        },
      }
    }),
  }
})

mockNuxtImport('useSupabaseClient', () => useSupabaseClientMock)

describe('Composables > usePosts', () => {
  describe('getAvatarUrl', () => {
    it("should return null, if no file path is provided", async () => {
      const { getAvatarUrl } = usePosts()
      const url = await getAvatarUrl()
      expect(url).toBeNull()
    })

    it("should return null, if the data is not a blob", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          storage: {
            from: vi.fn(() => ({ download: vi.fn(async () => ({ data: 'foobar', error: null })) }))
          },
        }
      })

      const { getAvatarUrl } = usePosts()
      const url = await getAvatarUrl('/')
      expect(url).toBeNull()
    })

    it("should throw an error, if there is any", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          storage: {
            from: vi.fn(() => ({ download: vi.fn(async () => ({ data: null, error: 'Something went wrong' })) }))
          },
        }
      })

      const { getAvatarUrl } = usePosts()
      try {
        await getAvatarUrl('/')
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })

    it("should return an image blob", async () => {
      const { getAvatarUrl } = usePosts()
      const url = await getAvatarUrl('/')
      expect(url).toBeTypeOf('string')
      expect(url).toContain('blob:nodedata:')
    })
  })

  describe('getAvatars', () => {
    it("should return a list of avatars", async () => {
      const { getAvatars } = usePosts()
      const avatars = await getAvatars([{profiles: { id: "foo", avatar_url: '/' }}])
      expect(avatars).toBeTypeOf('object')
      // @ts-ignore
      expect(avatars.foo).toContain('blob:nodedata:')
    })
  })

  describe('createComment', () => {
    it("should create a comment and return it", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          from() {
            return {
              insert(payload: Object) {
                return {
                  select() {
                    return {
                      single: vi.fn(async () => ({ ...mockCreateComment, ...payload }))
                    }
                  }
                }
              }
            }
          }
        }
      })

      const { createComment } = usePosts()
      const payload = { body: 'vitest is awesome' }
      const comment = await createComment(payload)
      
      expect(comment).toBeTypeOf('object')
      // @ts-ignore
      expect(comment.body).toEqual(payload.body)
      // @ts-ignore
      expect(comment.id).toEqual(mockCreateComment.id)
      // @ts-ignore
      expect(comment.created_at).toEqual(mockCreateComment.created_at)
      // @ts-ignore
      expect(comment.profiles).toEqual(mockCreateComment.profiles)
    })
  })

  describe('createPost', () => {
    it('should create a post', async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          from() {
            return {
              insert: () => ({ data: null, error: null })
            }
          }
        }
      })

      const { createPost } = usePosts()
      const { data, error } = await createPost(mockPostPayload)
      
      expect(error).toBeNull()
      expect(data).toBeNull()
    })
  })

  describe('getTotalCount', () => {
    it("should return the total amount of forum posts", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          rpc: vi.fn(async() => ({ data: 3, error: null }))
        }
      })
  
      const { getTotalCount } = usePosts()
      const count = await getTotalCount()
      expect(count).toEqual(3)
    });
  
    it("should throw an error, if one is returned", async () => {
      const { getTotalCount } = usePosts()

      try {
        await getTotalCount()
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })
  })

  describe('getCommentsCount', () => {
    it("should return the total amount of comments on a post", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          rpc: vi.fn(async() => ({ data: 3, error: null }))
        }
      })
  
      const { getCommentsCount } = usePosts()
      const count = await getCommentsCount(123)
      expect(count).toEqual(3)
    })
  
    it("should throw an error, if one is returned", async () => {
      const { getCommentsCount } = usePosts()

      try {
        await getCommentsCount(123)
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })
  })

  describe('getTopics', () => {
    it("should a list of topics", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          rpc: vi.fn(async() => ({ data: mockTopics, error: null }))
        }
      })
  
      const { getTopics } = usePosts()
      const count = await getTopics()
      expect(count).toEqual(mockTopics.replace(/[\{\}]/gi, '').split(','))
    })

    it("should return an empty array, if no data is found", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          rpc: vi.fn(async() => ({ data: null, error: null }))
        }
      })
  
      const { getTopics } = usePosts()
      const count = await getTopics()
      expect(count).toEqual([])
    })
  
    it("should throw an error, if one is returned", async () => {
      const { getTopics } = usePosts()

      try {
        await getTopics()
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })
  })

  describe('getPost', () => {
    it('should return a post object', async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          from() {
            return {
              select() {
                return {
                  eq() {
                    return {
                      single: vi.fn(async () => ({ data: mockPost, error: null }))
                    }
                  }
                }
              }
            }
          },
          storage: {
            from: vi.fn(() => ({ download: vi.fn(async () => ({ data: new Blob(), error: null })) }))
          },
        }
      })

      const { getPost } = usePosts()
      const post = await getPost(123)
      
      expect(post).toBeTypeOf('object')
      expect(post?.headline).toEqual(mockPost.headline)
      expect(post?.body).toEqual(mockPost.body)
      expect(post?.created_at).toEqual(mockPost.created_at)
      expect(post?.topic).toEqual(mockPost.topic)
      expect(post?.profiles).toEqual(mockPost.profiles)
      expect(post?.avatar).toBeDefined()
    })

    it('should return an empty avatar, if no profile is set', async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          from() {
            return {
              select() {
                return {
                  eq() {
                    return {
                      single: vi.fn(async () => ({ data: { ...mockPost, profiles: { avatar_url: null } }, error: null }))
                    }
                  }
                }
              }
            }
          }
        }
      })

      const { getPost } = usePosts()
      const post = await getPost(123)
      
      expect(post?.avatar).toBeNull()
    })

    it('should throw an error, if there is any', async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          from() {
            return {
              select() {
                return {
                  eq() {
                    return {
                      single: vi.fn(async () => ({ data: null, error: 'Something went wrong' }))
                    }
                  }
                }
              }
            }
          }
        }
      })

      const { getPost } = usePosts()

      try {
        await getPost(123)
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })
  })

  describe('getUserPostsCount', () => {
    it("should return the total amount of comments on a post", async () => {
      useSupabaseClientMock.mockImplementationOnce(() => {
        return {
          rpc: vi.fn(async() => ({ data: 3, error: null }))
        }
      })
  
      const { getUserPostsCount } = usePosts()
      const count = await getUserPostsCount()
      expect(count).toEqual(3)
    })
  
    it("should throw an error, if one is returned", async () => {
      const { getUserPostsCount } = usePosts()

      try {
        await getUserPostsCount()
      } catch(e) {
        expect(e).toEqual('Something went wrong')
      }
    })
  })
})
