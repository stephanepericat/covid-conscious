export const useReviews = () => {
  const supabase = useSupabaseClient()

  const reviewsLoading = ref(false)

  const getReviews = async (productId, start = 0, end = 10) => {
    reviewsLoading.value = true
    
    try {
      let { data, error } = await supabase
        .from('review')
        .select(`
          id,
          body,
          rating,
          created_at,
          profiles ( id, username )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .range(start, end)

      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
    } finally {
      reviewsLoading.value = false
    }
  }

  return {
    getReviews,
    reviewsLoading,
  }
}