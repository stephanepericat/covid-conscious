import { useToast } from '@inkline/inkline'

export const useSignOut = (user) => {
  const localePath = useLocalePath()
  const router = useRouter()
  const toast = useToast()
  const { t } = useI18n()
  const { clear } = useUserSession()

  const onLogoutSuccess = () => {
    user.value = null
    router.push(localePath('/'))
  }

  const onError = () => {
    toast.show({
      title: t('forum.auth.toast.error.title'),
      message: t('forum.auth.toast.error.message'),
      color: 'danger',
    })
  }

  const signOut = async () => {
    try {
      await clear()
      onLogoutSuccess()
    } catch (error) {
      onError()
    }
  }

  return {
    onError,
    signOut,
  }
}
