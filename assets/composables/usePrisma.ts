import consola from 'consola'

export const usePrisma = () => {
  const getUser = async (email: string) => {
    try {
      const { data, error } = 
        useFetch('/api/forum/user/get-user', {
          method: 'POST',
          body: { email }
        })
      if(error.value) throw error.value
      return data.value || null
    } catch(e) {
      consola.error(e)
      return null
    }
  }

  return {
    getUser,
  }
}