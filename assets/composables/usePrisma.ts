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

  const getUsername = async (email: string) => {
    try {
      const user = await $fetch('/api/forum/user/get-user', {
        method: 'POST',
        body: { email }
      })

      if(!user) {
        throw new Error('User not found')
      }

      return user.profile?.name || null;
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

  const updateUserProfile = async (body: { data: any, profileId: number }) => {
    try {
      return await $fetch('/api/forum/user/update-profile', {
        method: 'POST',
        body,
      })
    } catch(e) {
      consola.error(e)
      return null
    }
  }

  return {
    createUser,
    getOrCreateUser,
    getUser,
    getUsername,
    updateUserProfile,
  }
}