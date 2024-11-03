import consola from 'consola'

export const usePrisma = () => {
  const getUser = async (email: string) => {
    try {
      return await $fetch('/api/forum/user/get-user', {
        method: 'POST',
        body: { email }
      })
    } catch(e) {
      consola.error(e)
      return null
    }
  }

  return {
    getUser,
  }
}