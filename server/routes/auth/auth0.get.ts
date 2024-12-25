export default defineOAuthAuth0EventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const locale = getCookie(event, 'i18n_redirected')

    await setUserSession(event, {
      user,
      loggedInAt: Date.now(),
    })

    return sendRedirect(
      event,
      `${locale && locale !== 'en' ? `/${locale}` : ''}/user/account`,
    )
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Auth0 OAuth error:', error)
    const locale = getCookie(event, 'i18n_redirected')
    // TODO: redirect to error page?
    return sendRedirect(
      event,
      `${locale && locale !== 'en' ? `/${locale}` : '/'}`,
    )
  },
})
