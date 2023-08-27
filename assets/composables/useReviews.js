export const useReviews = () => {
  const supabase = useSupabaseClient()

  const reviewsLoading = ref(false)

  const getReviews = async (productId, start = 0, end = 3) => {
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

  const getReviewsCount = async (productId) => {
    try {
      const { data, error } = await supabase.rpc('get_reviews_count', { pid: productId })
      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  const getRatingsAverage = async (productId) => {
    try {
      const { data, error } = await supabase.rpc('get_rating_average', { pid: productId })
      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  return {
    getRatingsAverage,
    getReviews,
    getReviewsCount,
    reviewsLoading,
  }
}