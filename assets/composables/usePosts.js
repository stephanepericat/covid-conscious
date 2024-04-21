/* eslint-disable no-useless-escape */

import _ from "lodash"
import { getGravatarUrl } from "../utils/gravatar"

export const usePosts = () => {
  const supabase = useSupabaseClient()

  const getEmailById = async (id) => {
    try {
      const { data, error } = await supabase.rpc('get_user_email_by_id', { id })
      if(error) throw error
      return data
    } catch(e) {
      return null
    }
  }

  const getAvatarUrl = async (id) => {
    if(!id) return null

    try {
      const userEmail = await getEmailById(id)
      const url = await getGravatarUrl(userEmail)

      return url
    } catch(e) {
      console.error(e)
    }
  }

  const getAvatars = async (data) =>  {
    const profiles = _.uniq(data.map(({profiles}) => profiles.id))

    return await profiles.reduce(async (acc, userId) => {
      console.log('userId', userId)
      acc[userId] = await getAvatarUrl(userId)
      return acc
    }, {})
  }



  const createComment = async (payload) => {
    return await supabase
      .from('comment')
      .insert(payload)
      .select(`
        id,
        body,
        created_at,
        profiles ( id, username )
      `)
      .single()
  }

  const createPost = async (payload) => {
    return await supabase
      .from('post')
      .insert(payload)
  }

  const getTotalCount = async () => {
    try {
      const { data, error } = await supabase.rpc('get_post_count')
      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  const getCommentsCount = async (postId) => {
    try {
      const { data, error } = await supabase.rpc('get_comments_count', { pid: postId })
      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  const getTopics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_topics')
      if (error) throw error
      return data?.replace(/[\{\}]/gi, '').split(',') || []
    } catch (e) {
      console.error(e)
    }
  }

  const loading = ref(false)

  const getPost = async (postId) => {
    loading.value = true;

    try {
      let { data, error } = await supabase
        .from('post')
        .select(`
          headline,
          body,
          topic,
          created_at,
          profiles ( id, username )
        `)
        .eq('id', postId)
        .single()

      if (error) throw error

      const avatar = await getAvatarUrl(data.profiles.id)

      return { ...data, avatar }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getPosts =  async(start = 0, end = 3) => {
    loading.value = true
    
    try {
      let { data, error } = await supabase
        .from('post')
        .select(`
          id,
          headline,
          body,
          topic,
          created_at,
          profiles ( id, username )
        `)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) throw error

      const profileUrls = await getAvatars(data)

      return data.map((post) => ({...post, avatar: profileUrls[post.profiles.id]}))
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getUserById = async (userId) => {
    if(!userId) return null

    loading.value = true

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single()

      if(error) throw error
      return data
    } catch(e) {
      return null
    } finally {
      loading.value = false
    }
  }

  const getUserPosts =  async(userId, start = 0, end = 9) => {
    loading.value = true
    
    try {
      let { data, error } = await supabase
        .from('post')
        .select(`
          id,
          headline,
          topic,
          created_at
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) throw error

      return data
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getUserPostsCount =  async() => {
    try {
      const { data, error } = await supabase.rpc('get_user_post_count')
      if(error) throw error
      return data
    } catch(e) {
      console.error(e)
      return 0
    }
  }

  const deleting = ref(false)

  const deleteUserPosts = async (posts = []) => {
    deleting.value = true

    try {
      const { error } = await supabase
        .from('post')
        .delete()
        .in('id', posts)

      if(error) throw error
      return true
    } catch(e) {
      throw e
    } finally {
      deleting.value = false
    }
  }

  const deleteComment = async (commentId) => {
    deleting.value = true

    try {
      const { error } = await supabase
        .from('comment')
        .delete()
        .eq('id', commentId)

      if(error) throw error
      return true
    } catch(e) {
      throw e
    } finally {
      deleting.value = false
    }
  }

  const commentsLoading = ref(false)

  const getComments = async(postId, start = 0, end = 3) => {
    commentsLoading.value = true
    
    try {
      let { data, error } = await supabase
        .from('comment')
        .select(`
          id,
          body,
          created_at,
          profiles ( id, username )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
    } finally {
      commentsLoading.value = false
    }
  }

  const searchPosts = async (search) => {
    loading.value = true

    try {
      const { data, error } = await supabase.rpc('search_posts', { search })
      if(error) throw error

      const posts = data.map((post) => {
        const { id, headline, created_at, topic, author_id, username } = post
        return {
          created_at,
          headline,
          id,
          topic,
          profiles: {
            id: author_id,
            username,
          },
        }
      })

      const profileUrls = await getAvatars(posts)

      return posts.map((post) => ({...post, avatar: profileUrls[post.profiles.id]}))
    } catch(e) {
      console.error(e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    commentsLoading,
    createComment,
    createPost,
    deleteComment,
    deleteUserPosts,
    deleting,
    getAvatarUrl,
    getAvatars,
    getComments,
    getCommentsCount,
    getEmailById,
    getPost,
    getPosts,
    getTotalCount,
    getTopics,
    getUserById,
    getUserPosts,
    getUserPostsCount,
    loading,
    searchPosts,
  }
}