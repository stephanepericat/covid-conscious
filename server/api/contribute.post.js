export default eventHandler(async (event) => {
  const body = await readBody(event);

  console.log("body", body);

  return { ok: true };
});