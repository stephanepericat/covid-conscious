export const useReviews = () => {
  const supabase = useSupabaseClient()

  const reviewsLoading = ref(false)

  const checkUserReview = async (productId, userId = null) => {
    if(!userId || !productId) {
      return false
    }

    try {
      const { data, error } = await supabase.rpc('has_user_reviewed_product', { pid: productId, userid: userId })
      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  const getUserReview = async (productId, userId) => {
    try {
      const { data, error } = await supabase
        .from('review')
        .select(`
          id,
          body,
          rating
        `)
        .eq('product_id', productId)
        .eq('author_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

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
          updated_at,
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
      const { data: rating, error } = await supabase.rpc('get_rating_average', { pid: productId })
      if (error) throw error
      return rating
    } catch (e) {
      console.error(e)
      return ""
    }
  }

  const createReview = async (payload) => {
    return await supabase
      .from('review')
      .insert(payload)
      .select(`
        id,
        body,
        rating,
        created_at,
        updated_at,
        profiles ( id, username )
      `)
      .single()
  }

  const updateReview = async (payload, reviewId) => {
    return await supabase
      .from('review')
      .update(payload)
      .eq('id', reviewId)
      .select(`
        id,
        body,
        rating,
        created_at,
        updated_at,
        profiles ( id, username )
      `)
      .single()
  }

  return {
    checkUserReview,
    createReview,
    getRatingsAverage,
    getReviews,
    getReviewsCount,
    getUserReview,
    reviewsLoading,
    updateReview,
  }
}