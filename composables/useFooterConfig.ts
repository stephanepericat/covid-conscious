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
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.tcl.contact'),
          href: '/contact',
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.tcl.contribute'),
          href: '/contribute',
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.tcl.mobile'),
          href: '/mobile',
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.tcl.rss'),
          href: '/rss/feed',
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.tcl.support'),
          href: '/support',
          target: '_self',
        },
      ],
    },
    {
      title: t('footer.social.title'),
      contents: [
        {
          icon: 'tabler:brand-bluesky',
          label: 'Bluesky',
          href: 'https://bsky.app/profile/thatcovidlife.bsky.social',
          target: '_blank',
        },
        {
          icon: 'tabler:brand-facebook',
          label: 'Facebook',
          href: 'https://facebook.com/thatcovidlife',
          target: '_blank',
        },
        {
          icon: 'tabler:brand-instagram',
          label: 'Instagram',
          href: 'https://www.instagram.com/thatcovid.life',
          target: '_blank',
        },
        {
          icon: 'tabler:brand-reddit',
          label: 'Reddit',
          href: 'https://www.reddit.com/r/thatcovidlife/',
          target: '_blank',
        },
        {
          icon: 'tabler:brand-threads',
          label: 'Threads',
          href: 'https://www.threads.net/@thatcovid.life',
          target: '_blank',
        },
        {
          icon: 'tabler:brand-x',
          label: 'X / Twitter',
          href: 'https://x.com/thatcovidlife',
          target: '_blank',
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
          target: '_self',
        },
        // {
        //   icon: null,
        //   label: t('footer.legal.forum'),
        //   href: '/legal/forum-guidelines',
        //   target: '_self',
        // },
        {
          icon: null,
          label: t('footer.legal.privacy'),
          href: '/legal/privacy-policy',
          target: '_self',
        },
        {
          icon: null,
          label: t('footer.legal.terms'),
          href: '/legal/terms-conditions',
          target: '_self',
        },
      ],
    },
  ])

  return { config }
}
