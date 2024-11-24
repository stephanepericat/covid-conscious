import consola from 'consola'
import { usePrisma } from '../composables/usePrisma'

export type UserInfo = {
  id?: number;
  profile?: {
      id: number;
      name: string | null;
      bio: string | null;
      website: string | null;
      userId: number;
  } | null;
  email?: string;
  role?: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({ info: null as UserInfo | null }),
  getters: {
    canPost: ({ info }) => {
      if (!info) {
        return false
      }

      return !!info?.profile?.name
    },
    username: ({ info }) => info?.profile?.name || null,
  },
  actions: {
    async updateUserInfo(payload: UserInfo | undefined) {
      const { user } = useUserSession()

      if (!user.value) {
        this.info = null
        return
      }

      if(payload) {
        this.info = { ...this.info, ...payload }
        return
      }

      const { getUser } = usePrisma()

      try {
        const info = await getUser(user.value.email as string)
        this.info = info
      } catch(e) {
        consola.error(e)
        this.info = null
      }
    },
  },
})
