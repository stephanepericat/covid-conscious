export const getSHA256Hash = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input)
  const hashBuffer = await global.crypto.subtle.digest('SHA-256', textAsBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')

  return hash
}
