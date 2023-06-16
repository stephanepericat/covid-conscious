import { parseBody } from "../../assets/utils/body-parser";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const parsed = parseBody(body);
  console.log("body", parsed);

  return { ok: true };
});