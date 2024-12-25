import consola from 'consola'
import { defineSitemapEventHandler } from '#imports'
import sitemapQuery from '@/sanity/queries/sitemap.sanity'
import { SITEMAP_QUERYResult } from '@/sanity/types'

const pages = [
  '/',
  '/about',
  '/contribute',
  '/create-account',
  '/disclaimer',
  '/forum',
  '/forum-guidelines',
  '/login',
  '/mobile',
  '/privacy-policy',
  '/reset-password',
  '/support',
  '/terms-conditions',
  '/update-password',
]

const formatUrl = (path: string, origin: string, locale: string | null) =>
  `${origin}${locale ? `/${locale}` : ''}${path}`

export default defineSitemapEventHandler(async (event) => {
  const { locale = null } = getQuery(event)
  const { origin } = getRequestURL(event)
  const { fetch } = useSanity()

  try {
    const posts = await fetch<SITEMAP_QUERYResult>(sitemapQuery)
    return [
      ...pages.map((p) => ({
        loc: formatUrl(p, origin, locale as string | null),
      })),
      ...posts.map((p) => ({
        lastmod: p.lastmod,
        loc: formatUrl(p.loc as string, origin, locale as string | null),
        images: p.images || [],
      })),
    ]
  } catch (e) {
    consola.error(e)
    return []
  }
})
