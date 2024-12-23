import consola from 'consola'
import { usePrisma } from '~/composables/usePrisma'

export type UserInfo = {
  id?: number
  profile?: {
    id: number
    name: string | null
    bio: string | null
    website: string | null
    userId: number
  } | null
  email?: string
  role?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({ info: null as UserInfo | null }),
  getters: {
    canPost: ({ info }: { info: UserInfo }) => {
      if (!info) {
        return false
      }

      return !!info?.profile?.name
    },
    email: ({ info }: { info: UserInfo | null }) => info?.email || null,
    username: ({ info }: { info: UserInfo | null }) => info?.profile?.name || null,
  },
  actions: {
    async updateUserInfo(payload: UserInfo['profile'] | undefined) {
      const { user } = useUserSession()

      if (!user.value) {
        // @ts-expect-error 
        this.info = null
        return
      }

      if (payload) {
        // @ts-expect-error 
        this.info = {
          // @ts-expect-error 
          ...this.info,
          // @ts-expect-error 
          profile: { ...this.info?.profile, ...payload },
        }
        return
      }

      const { getOrCreateUser } = usePrisma()

      try {
        const info = await getOrCreateUser(user.value.email as string)
        // @ts-expect-error 
        this.info = info
      } catch (e) {
        consola.error(e)
        // @ts-expect-error 
        this.info = null
      }
    },
  },
})
