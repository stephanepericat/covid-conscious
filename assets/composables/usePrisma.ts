import consola from 'consola'

export const usePrisma = () => {
  const getUser = async (email: string): Promise<any> => {
    try {
      const { data } = 
        useFetch('/api/forum/user/get-user', {
          method: 'POST',
          body: { email }
        })
      return data
    } catch(e) {
      consola.error(e)
      return null
    }
  }

  return {
    getUser,
  }
}