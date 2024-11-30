export const useTags = () => {
  const localePath = useLocalePath()
  const router = useRouter()

  const onTagClick = ({ uri }) => {
    router.push({ path: localePath(`/tags/${uri}`) })
  }

  return {
    onTagClick,
  }
}
