import { protectedPages } from '~/assets/constants/protected-pages'

export default defineNuxtRouteMiddleware((to) => {
  // const user = useSupabaseUser()
  const { user } = useUserSession()
  // const localePath = useLocalePath()
  const [pageName] = to?.name?.split('___')

  if(!user.value && protectedPages.includes(pageName)) {
    // return navigateTo(localePath('/login'))
    return navigateTo('/auth/auth0', { external: true, redirectCode: 403 })
  }
})
