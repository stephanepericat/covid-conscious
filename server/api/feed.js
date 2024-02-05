import { Feed } from "feed";
import rssFeedQuery from "../../sanity/rssFeed.sanity";
import { isExternalLink, isNews, isLibrary } from "~/assets/utils/article-types";

export default eventHandler(async (event) => {  
  const { fetch } = useSanity();

  const query = getQuery(event);
  const locale = query?.lang || "en";

  const { origin: BASE_URL } = getRequestURL(event);

  try {
    const { entries, settings } = await fetch(rssFeedQuery, { locale });

    const feed = new Feed({
      title: settings.title,
      description: settings.description,
      id: `${BASE_URL}/`,
      link: `${BASE_URL}/`,
      language: locale,
      image: settings.image,
      favicon: BASE_URL + "/favicon.ico",
      copyright: `All rights reserved ${new Date().getFullYear()}, ${settings.author.name}.`,
      updated: entries?.[0] ? new Date(entries[0]?.updatedAt) : undefined,
      author: {
        email: settings.author.email,
        link: BASE_URL,
        name: settings.author.name,
      },
    });

    entries.forEach((entry) => {
      const title = isNews(entry.type) || isLibrary(entry.type) ? `${entry.source}: ${entry.title}` : entry.title;
      const link = isExternalLink(entry.type) ? entry.link : `${BASE_URL}${entry.slug}`;
      const author = entry.source || entry.author?.name || 'That Covid Life';

      feed.addItem({
        title,
        description: entry.description || entry.summary,
        published: new Date(entry.publishedAt),
        id: entry.id,
        link,
        date: new Date(entry.publishedAt),
        image: entry.image,
        author: [author],
        category: [{ name: entry.category }],
      });
    });

    setHeader(event, "Content-Type", "application/xml");

    return feed.rss2();
  } catch(e) {
    console.log("error", e.message);
    return {
      error: e.message
    }
  }
});
