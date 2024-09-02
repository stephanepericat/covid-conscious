import { covidnetTypes } from "../constants/covidnet-types"

export const useCovidnet = () => {
  const hasBlogRssURL = ({ contentType, blogRssURL }) => contentType === covidnetTypes.BLOG && blogRssURL

  const hasFeaturedContent = ({ blogFeaturedURLs, twitterFeaturedPosts }) => blogFeaturedURLs?.length || twitterFeaturedPosts?.length

  return {
    covidnetTypes,
    hasBlogRssURL,
    hasFeaturedContent,
  }
}
