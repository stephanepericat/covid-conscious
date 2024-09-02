import { covidnetTypes } from "../constants/covidnet-types"

export const useCovidnet = () => {
  const getChannelFeed = async (channelID, maxLength = 3) => {
    try {
      const { data, error } = await useFetch(`/api/external/feeds/youtube/${channelID}`)
      if(error.value) throw error.value

      return data.value.entry.splice(0, maxLength) || []
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
