import consola from "consola";
import { Feed } from "feed";
import { parseStringPromise } from 'xml2js'

import ytFeedQuery from "~/sanity/ytFeed.sanity";

type YtFeed = {
  feedURL: string;
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
        return feed
      } catch(e) {
        return {}
      }
    })
    const feeds = await Promise.all(calls)
    console.log(feeds)
  } catch(e) {
    consola.error(e)
    return null
  }

  return {ok: true }
})