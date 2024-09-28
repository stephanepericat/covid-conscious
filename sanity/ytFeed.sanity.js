import groq from 'groq'
import { covidnetTypes } from '~/assets/constants/covidnet-types';

export default groq`
  *[_type == 'covidnet' && contentType == "${covidnetTypes.YOUTUBE}" && !(_id in path('drafts.**'))] {
    "feedURL": "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelID,
  }
`;
