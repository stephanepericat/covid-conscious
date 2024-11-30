import ogs from 'open-graph-scraper'

export default defineEventHandler(async (event) => {
  const { posts } = await readBody(event)

  try {
    const info = await Promise.all(posts.map((url: string) => ogs({ url })))

    return info
      .map(({ result }) => result || null)
      .filter((r) => r !== null && r.success)
      .map((info) => ({
        description: info.ogDescription,
        image: info.ogImage[0],
        locale: info.ogLocale,
        siteName: info.ogSiteName,
        title: info.ogTitle,
        type: info.ogType,
        url: info.ogUrl,
      }))
  } catch (e) {
    throw e
  }
})
