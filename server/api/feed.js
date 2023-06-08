export default eventHandler((event) => {
  const query = getQuery(event);
  const locale = query?.lang || "en";
  const { origin } = getRequestURL(event);
  console.log("info", {locale, origin});

  setHeader(event, "Content-Type", "application/xml");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <note>
      <to>Tove</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>`;
});
