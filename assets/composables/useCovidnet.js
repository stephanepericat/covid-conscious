import { covidnetTypes } from '../constants/covidnet-types'

export const useCovidnet = () => {
  const videosMapper = (v) => ({
    id: v['yt:videoId'][0],
    date: v.published[0].split('T')[0],
    description:
      v['media:group'][0]['media:description'][0].substr(0, 255) + '...',
    thumbnail: v['media:group'][0]['media:thumbnail'][0].$.url,
    title: v.title[0],
    url: v.link[0].$.href,
  })

  const getChannelFeed = async (channelID, maxLength = 3) => {
    try {
      const { data, error } = await useFetch(
        `/api/external/feeds/youtube/${channelID}`,
      )
      if (error.value) throw error.value
      return (data.value?.entry || []).splice(0, maxLength).map(videosMapper)
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const getBlogOg = async (posts = []) => {
    try {
      const { data, error } = await useFetch('/api/external/feeds/blog/og', {
        method: 'POST',
        body: {
          posts,
        },
      })

      if (error.value) throw error.value

      return data.value
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const isFeaturedContentLoading = ref(false)

  const getFeaturedContent = async ({
    blogFeaturedURLs,
    contentType,
    twitterFeaturedPosts,
  }) => {
    let content = []

    switch (contentType) {
      case covidnetTypes.BLOG:
        isFeaturedContentLoading.value = true
        content = await getBlogOg(blogFeaturedURLs)
        break
      case covidnetTypes.TWITTER:
        content = twitterFeaturedPosts
        break
    }

    isFeaturedContentLoading.value = false

    return content
  }

  const hasBlogRssURL = ({ contentType, blogRssURL }) =>
    contentType === covidnetTypes.BLOG && blogRssURL

  const hasFeaturedContent = ({ blogFeaturedURLs, twitterFeaturedPosts }) =>
    blogFeaturedURLs?.length || twitterFeaturedPosts?.length

  return {
    covidnetTypes,
    getChannelFeed,
    getFeaturedContent,
    hasBlogRssURL,
    hasFeaturedContent,
    isFeaturedContentLoading,
  }
}
