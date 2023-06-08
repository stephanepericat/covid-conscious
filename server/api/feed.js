import rssFeedQuery from "../../sanity/rssFeed.sanity";

export default eventHandler(async (event) => {
  const { fetch } = useSanity();

  const query = getQuery(event);
  const locale = query?.lang || "en";

  const { origin } = getRequestURL(event);

  try {
    const { entries, settings } = await fetch(rssFeedQuery, { locale });
    // console.log("settings", settings);
    // console.log("entries", entries);

    setHeader(event, "Content-Type", "application/xml");

    return `<?xml version="1.0" encoding="UTF-8"?>
      <note>
        <to>Tove</to>
        <from>Jani</from>
        <heading>Reminder</heading>
        <body>Don't forget me this weekend!</body>
      </note>`;
  } catch(e) {
    console.log("error", e.message);
  }
});
