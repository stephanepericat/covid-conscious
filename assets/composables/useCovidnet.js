import { covidnetTypes } from "../constants/covidnet-types"

export const useCovidnet = () => {
  const videosMapper = (v) => ({
    id: v['yt:videoId'][0],
    author: v.author[0].name[0],
    description: v['media:group'][0]['media:description'][0].substr(0, 255) + '...',
    link: v.link[0].$.href,
    published: v.published[0],
    thumbnail: v['media:group'][0]['media:thumbnail'][0].$,
    title: v.title[0],
  })

  const getChannelFeed = async (channelID, maxLength = 3) => {
    try {
      const { data, error } = await useFetch(`/api/external/feeds/youtube/${channelID}`)
      if(error.value) throw error.value
      return (data.value?.entry || [])
        .splice(0, maxLength)
        .map(videosMapper)
    } catch(e) {
      console.error(e)
      return []
    }
  }

  const hasBlogRssURL = ({ contentType, blogRssURL }) => contentType === covidnetTypes.BLOG && blogRssURL

  const hasFeaturedContent = ({ blogFeaturedURLs, twitterFeaturedPosts }) => blogFeaturedURLs?.length || twitterFeaturedPosts?.length

  return {
    covidnetTypes,
    getChannelFeed,
    hasBlogRssURL,
    hasFeaturedContent,
  }
}
