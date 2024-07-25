import consola from 'consola'
import { asSitemapUrl, defineSitemapEventHandler } from '#imports'
import sitemapQuery from '~/sanity/sitemap.sanity'
import { SitemapUrl } from '#sitemap'

export default defineSitemapEventHandler(async (event) => {
  const { origin } = getRequestURL(event)
  const { fetch } = useSanity()

  try {
    const posts: Array<SitemapUrl> = await fetch(sitemapQuery)
    return posts.map((p) => ({ ...p, loc: origin + p.loc }))
  } catch (e) {
    consola.error(e)
    return []
  }
})