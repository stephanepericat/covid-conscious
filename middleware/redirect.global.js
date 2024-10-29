import { protectedPages } from '~/assets/constants/protected-pages'

export default defineNuxtRouteMiddleware((to) => {
  // const user = useSupabaseUser()
  // const localePath = useLocalePath()
  // const [pageName] = to?.name?.split('___')

  // if(!user.value && protectedPages.includes(pageName)) {
  //   return navigateTo(localePath('/login'))
  // }
})
