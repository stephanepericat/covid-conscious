import consola from 'consola';
import { Feed } from 'feed';
import { parseStringPromise } from 'xml2js'
import _ from 'lodash'

import ytFeedQuery from '~/sanity/ytFeed.sanity'

type YtFeed = {
  feedURL: string;
}

type Entry = {
  author: string;
  description: string;
  link: string;
  publicationDate: Date;
  title: string;
  thumbnail: string;
}

const mapEntries = (entry: any): Entry => {
  return {
    author: entry.author[0].name[0],
    description: entry['media:group'][0]['media:description'][0].split('').slice(0, 252).join('') + '...',
    link: entry.link[0].$.href,
    publicationDate: new Date(entry.published[0]),
    title: entry.title[0],
    thumbnail: entry['media:group'][0]['media:thumbnail'][0].$.url,
  }
}

export default defineEventHandler(async (event) => {
  const { fetch: sanityFetch } = useSanity()

  try {
    const feedUrls: YtFeed[] = await sanityFetch(ytFeedQuery)
    const calls = feedUrls.map(async ({ feedURL }) => {
      try {
        const data = await fetch(feedURL);
        const xml = await data.text()
        const { feed } = await parseStringPromise(xml)
        return feed.entry.map(mapEntries)
      } catch(e) {
        consola.error(e)
        return {}
      }
    })
    const feeds = await Promise.all(calls)
    const sorted = _.orderBy(feeds.flat(), 'publicationDate', 'desc')
    const feedEntries = sorted.slice(0, 20);
    console.log('feedEntries', feedEntries, feedEntries.length)
  } catch(e) {
    consola.error(e)
    return null
  }

  return {ok: true }
})