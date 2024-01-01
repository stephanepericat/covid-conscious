import { useToast } from '@inkline/inkline';

export const useSignOut = (user) => {
  const localePath = useLocalePath()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const toast = useToast()
  const { t } = useI18n()

  const onLogoutSuccess = () => {
    user.value = null
    router.push(localePath('/login'))
  }

  const onError = () => {
    toast.show({
      title: t('forum.auth.toast.error.title'),
      message: t('forum.auth.toast.error.message'),
      color: 'danger'
    })
  }

  const signOut = async () => {
    try {
      let { error } = await supabase.auth.signOut()
      if (error) throw error
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