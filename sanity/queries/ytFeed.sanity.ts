import groq from 'groq'
// import { covidnetTypes } from '../../assets/constants/covidnet-types'

const YT_FEED_QUERY = groq`
  *[_type == 'covidnet' && contentType == 'YouTube' && !(_id in path('drafts.**'))] {
    "feedURL": "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID,
  }
`

export { YT_FEED_QUERY as default }
