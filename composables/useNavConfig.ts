import type { MobileNavItem, NavConfig } from '@/lib/types'

export const useNavConfig = () => {
  const { t } = useI18n()

  const config = computed(
    () =>
      [
        {
          id: 'latest',
          title: t('topNav.latest.title'),
          display: {
            title: t('topNav.latest.display.title'),
            icon: 'ion:newspaper-outline',
            description: t('topNav.latest.display.description'),
          },
          children: [
            {
              id: 'publications-news',
              title: t('topNav.latest.children.news.title'),
              description: t('topNav.latest.children.news.description'),
              link: '/news',
            },
            {
              id: 'publications-library',
              title: t('topNav.latest.children.library.title'),
              description: t('topNav.latest.children.library.description'),
              link: '/scientific-library',
            },
            {
              id: 'publications-videos',
              title: t('topNav.latest.children.videos.title'),
              description: t('topNav.latest.children.videos.description'),
              link: '/video',
            },
            {
              id: 'publications-phw',
              title: t('topNav.latest.children.phw.title'),
              description: t('topNav.latest.children.phw.description'),
              link: '/public-health',
            },
            {
              id: 'publications-events',
              title: t('topNav.latest.children.events.title'),
              description: t('topNav.latest.children.events.description'),
              link: '/event',
            },
          ],
        },
        {
          id: 'other',
          title: t('topNav.other.title'),
          children: [
            {
              id: 'other-covidnet',
              title: t('topNav.other.children.covidnet.title'),
              description: t('topNav.other.children.covidnet.description'),
              link: '/covidnet',
            },
            {
              id: 'other-directory',
              title: t('topNav.other.children.directory.title'),
              description: t('topNav.other.children.directory.description'),
              link: '/directory',
              premium: true,
            },
            {
              id: 'other-products',
              title: t('topNav.other.children.products.title'),
              description: t('topNav.other.children.products.description'),
              link: '/product',
            },
            {
              id: 'other-resources',
              title: t('topNav.other.children.resources.title'),
              description: t('topNav.other.children.resources.description'),
              link: '/resource',
            },
          ],
        },
        {
          id: 'forum',
          title: t('topNav.forum.title'),
          link: '/forum',
        },
        {
          id: 'blog',
          title: t('topNav.blog.title'),
          link: '/blog',
        },
      ] as NavConfig[],
  )

  const mobileConfig = computed(
    () =>
      [
        {
          id: 'mobile-news',
          link: '/news',
          premium: false,
          title: t('topNav.latest.children.news.title'),
        },
        {
          id: 'mobile-library',
          link: '/scientific-library',
          premium: false,
          title: t('topNav.latest.children.library.title'),
        },
        {
          id: 'mobile-videos',
          link: '/video',
          premium: false,
          title: t('topNav.latest.children.videos.title'),
        },
        {
          id: 'mobile-phw',
          title: t('topNav.latest.children.phw.title'),
          link: '/public-health',
          premium: false,
        },
        {
          id: 'mobile-events',
          title: t('topNav.latest.children.events.title'),
          link: '/event',
          premium: false,
        },
        {
          id: 'mobile-covidnet',
          title: t('topNav.other.children.covidnet.title'),
          link: '/covidnet',
          premium: false,
        },
        {
          id: 'mobile-directory',
          title: t('topNav.other.children.directory.title'),
          link: '/directory',
          premium: true,
        },
        {
          id: 'mobile-products',
          title: t('topNav.other.children.products.title'),
          link: '/product',
          premium: false,
        },
        {
          id: 'mobile-resources',
          title: t('topNav.other.children.resources.title'),
          link: '/resource',
          premium: false,
        },
        {
          id: 'forum',
          title: t('topNav.forum.title'),
          link: '/forum',
          premium: false,
        },
        {
          id: 'blog',
          title: t('topNav.blog.title'),
          link: '/blog',
          premium: false,
        },
      ] as MobileNavItem[],
  )

  return {
    config,
    mobileConfig,
  }
}