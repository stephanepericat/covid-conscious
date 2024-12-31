export const useFooterConfig = () => {
  const { t } = useI18n()

  const config = computed(() => [
    {
      title: t('footer.tcl.title'),
      contents: [
        {
          icon: null,
          label: t('footer.tcl.about'),
          href: '/about',
        },
        {
          icon: null,
          label: t('footer.tcl.contact'),
          href: '/contact',
        },
        {
          icon: null,
          label: t('footer.tcl.contribute'),
          href: '/contribute',
        },
        {
          icon: null,
          label: t('footer.tcl.mobile'),
          href: '/mobile',
        },
        {
          icon: null,
          label: t('footer.tcl.rss'),
          href: '/rss/feed',
        },
        {
          icon: null,
          label: t('footer.tcl.support'),
          href: '/support',
        },
      ],
    },
    {
      title: t('footer.social.title'),
      contents: [
        {
          icon: 'tabler:brand-bluesky',
          label: 'Bluesky',
          href: '/about',
        },
        {
          icon: 'tabler:brand-facebook',
          label: 'Facebook',
          href: '/about',
        },
        {
          icon: 'tabler:brand-instagram',
          label: 'Instagram',
          href: '/about',
        },
        {
          icon: 'tabler:brand-reddit',
          label: 'Reddit',
          href: '/about',
        },
        {
          icon: 'tabler:brand-threads',
          label: 'Threads',
          href: '/about',
        },
        {
          icon: 'tabler:brand-x',
          label: 'X / Twitter',
          href: '/about',
        },
      ],
    },
    {
      title: t('footer.legal.title'),
      contents: [
        {
          icon: null,
          label: t('footer.legal.disclaimer'),
          href: '/legal/disclaimer',
        },
        {
          icon: null,
          label: t('footer.legal.forum'),
          href: '/legal/forum-guidelines',
        },
        {
          icon: null,
          label: t('footer.legal.privacy'),
          href: '/legal/privacy-policy',
        },
        {
          icon: null,
          label: t('footer.legal.terms'),
          href: '/legal/terms-conditions',
        },
      ],
    },
  ])

  return { config }
}
