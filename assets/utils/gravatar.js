import { getSHA256Hash } from './encryption'

export const getGravatarUrl = async (email, size = 200) => {
  const hash = await getSHA256Hash(email.trim().toLowerCase())
  return `https://gravatar.com/avatar/${hash}?s=${size}`
}
