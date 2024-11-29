import { protectedPages } from '~/assets/constants/protected-pages'

export default defineNuxtRouteMiddleware(({ name }) => {
  const { user } = useUserSession()
  // @ts-ignore
  const [pageName] = name?.split('___')

  if(!user.value && protectedPages.includes(pageName)) {
    return navigateTo('/auth/auth0', { external: true, redirectCode: 403 })
  }
})
