export const useTags = () => {
  const localePath = useLocalePath()
  const router = useRouter()
  
  const onTagClick = ({ uri }) => {
    console.log('tag clicked: ', uri)
    router.push({ path: localePath(`/tags/${uri}`) })
  }

  return {
    onTagClick,
  }
} 