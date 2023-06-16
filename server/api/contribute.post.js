import emailjs from '@emailjs/nodejs';
import { parseBody } from "../../assets/utils/body-parser";

export default eventHandler(async (event) => {
  const { valid, errors, ...rest } = await readBody(event);
  const body = parseBody(rest);
  
  if(!valid) {
    return { ok: false, errors };
  }

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      body,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      },
    );

    return { ok: true, errors: null };
  } catch(e) {
    console.error(e.text, body);
    return { ok: false, errors: [e.text] };
  }
});