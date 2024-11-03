import consola from 'consola'

export const usePrisma = () => {
  const createUser = async (email: string) => {
    try {
      return await $fetch('/api/forum/user/create-user', {
        method: 'POST',
        body: { email }
      })
    } catch(e) {
      consola.error(e)
      return null
    }
  }

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

  const getOrCreateUser = async (email: string) => {
    try {
      const user = await getUser(email)
      if(user) return user

      return await createUser(email)
    } catch(e) {
      consola.error(e)
      return null
    }
  }

  return {
    createUser,
    getOrCreateUser,
    getUser,
  }
}