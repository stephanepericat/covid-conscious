<template>
  <ILayout class="default-layout">
    <!-- header -->
    <ILayoutHeader class="default-layout__header">
      <INavbar class="default-layout__main-nav" :collapse="false">
        <INavbarBrand :to="localePath('/')">
          <img class="default-layout__logo" :src="logoFile" />
        </INavbarBrand>
        <INav>
          <IInput
            v-model="searchTerm"
            @keydown.enter="onSearch"
            class="default-layout__search"
            :placeholder="`${$t('layout.search')}...`"
          >
            <template #append>
              <IButton color="primary" :disabled="!searchTerm.length" @click="onSearch">
                <IIcon name="ink-search" />
              </IButton>
            </template>
          </IInput>
          <IDropdown placement="bottom-end" events="hover">
            <INavItem>
              <Icon :name="currentLocale.flag" />
            </INavItem>
            <template #body>
              <IDropdownItem v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
                <span>{{ locale.name }}</span>
              </IDropdownItem>
            </template>
          </IDropdown>
          <INavItem class="default-layout__header--color-mode" @click="switchColorMode">
            <Icon :name="colorModeIcon" />
          </INavItem>
          <IDropdown placement="bottom-end" events="hover">
            <INavItem>
              <Icon name="material-symbols:account-circle" />
              <span class="default-layout__user--label">{{ $t('layout.userAccount') }}</span>
            </INavItem>
            <template #body>
              <template v-if="isLoggedIn">
                <IDropdownItem :to="localePath('/account')">
                  <span>{{ $t('layout.user.account') }}</span>
                </IDropdownItem>
                <IDropdownItem @click.prevent="signOut">
                  <span>{{ $t('layout.user.signOut') }}</span>
                </IDropdownItem>
              </template>
              <template v-else>
                <IDropdownItem :to="localePath('/login')">
                  <span>{{ $t('layout.user.signIn') }}</span>
                </IDropdownItem>
              </template>
            </template>
          </IDropdown>
      </INav>
      </INavbar>
      <INavbar class="default-layout__sub-nav">
        <INavbarCollapsible>
          <INav>
            <INavItem
              v-for="(item, index) in subNavItems"
              :key="index"
              :to="item.url"
              v-show="!item.hidden"
            >
              {{ item.label }}
            </INavItem>
          </INav>
        </INavbarCollapsible>
      </INavbar>
    </ILayoutHeader>
    <!-- content -->
    <ILayoutContent class="default-layout__content">
      <IContainer class="default-layout__content--container">
        <NuxtPage />
      </IContainer>
    </ILayoutContent>
    <!-- footer -->
    <ILayoutFooter class="default-layout__footer">
      <IContainer class="default-layout__footer--container">
        <div class="default-layout__footer--container-block">
          <h5 class="default-layout__footer--container-block-title">{{ $t('layout.contents') }}</h5>
          <ul class="default-layout__footer--list">
            <li>
              <NuxtLink :to="localePath('/news')">{{ $t('layout.news') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/resource')">{{ $t('layout.resource') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/video')">{{ $t('layout.video') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/scientific-library')">{{ $t('layout.scientific-library') }}</NuxtLink>
            </li>
            <li v-if="$appSettings.SHOW_PUBLIC_HEALTH">
              <NuxtLink :to="localePath('/public-health')">{{ $t('layout.health') }}</NuxtLink>
            </li>
            <li v-if="$appSettings.SHOW_DIRECTORY">
              <NuxtLink :to="localePath('/directory')">{{ $t('layout.directory') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/product')">{{ $t('layout.product') }}</NuxtLink>
            </li>
            <li v-if="$appSettings.SHOW_EDUCATION">
              <NuxtLink :to="localePath('/education')">{{ $t('layout.education') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/forum')">{{ $t('layout.forum') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block">
          <h5 class="default-layout__footer--container-block-title">{{ $t('layout.tcl') }}</h5>
          <ul class="default-layout__footer--list">
            <li>
              <NuxtLink :to="localePath('/about')">{{ $t('layout.about') }}</NuxtLink>
            </li>
            <li>
              <a href="mailto:contact@thatcovid.life">{{ $t('layout.contactUs') }}</a>
            </li>
            <li>
              <NuxtLink :to="localePath('/contribute')">{{ $t('layout.submitContent') }}</NuxtLink>
            </li>
            <li>
              <a :href="rssFeedUrl" target="_blank">{{ $t('layout.rss') }}</a>
            </li>
            <li>
              <NuxtLink :to="localePath('/support')">{{ $t('layout.support') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block">
          <h5 class="default-layout__footer--container-block-title">{{ $t('layout.social') }}</h5>
          <ul class="default-layout__footer--list">
            <li>
              <a href="https://bsky.app/profile/thatcovidlife.bsky.social" target="_blank">
                <icon name="tabler:brand-bluesky" />&nbsp;
                Bluesky
              </a>
            </li>
            <li>
              <a href="https://facebook.com/thatcovidlife" target="_blank">
                <icon name="tabler:brand-facebook" />&nbsp;
                Facebook
              </a>
            </li>
            <li>
              <a href="https://www.reddit.com/r/thatcovidlife/" target="_blank">
                <icon name="tabler:brand-reddit" />&nbsp;
                Reddit
              </a>
            </li>
            <li>
              <a href="https://twitter.com/thatcovidlife" target="_blank">
                <icon name="tabler:brand-twitter" />&nbsp;
                Twitter
              </a>
            </li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block">
          <h5 class="default-layout__footer--container-block-title">{{ $t('layout.legal') }}</h5>
          <ul class="default-layout__footer--list">
            <li>
              <NuxtLink :to="localePath('/disclaimer')">{{ $t('layout.disclaimer') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/forum-guidelines')">{{ $t('layout.forumGuidelines') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/privacy-policy')">{{ $t('layout.privacyPolicy') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/terms-conditions')">{{ $t('layout.terms') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block logo">
          <INavbarBrand :to="localePath('/')">
            <img class="default-layout__logo-footer" :src="logoFile" />
          </INavbarBrand>
        </div>
      </IContainer>
      <IContainer class="default-layout__footer--container">
        <div class="default-layout__footer--year">{{ $t("layout.footerLegal", { year: new Date().getFullYear() }) }}</div>
      </IContainer>
    </ILayoutFooter>
  </ILayout>
</template>
<script setup>
  import { useInkline } from '@inkline/inkline'
  import { DARK, DARK_ICON , LIGHT, LIGHT_ICON } from '~/assets/constants/inkline-modes'
  import { useSignOut } from '~/assets/composables/useSignOut'
  import { useLanguages } from '~/assets/composables/useLanguages'

  const inkline = useInkline()
  const { t } = useI18n()
  const { currentLocale, availableLocales, locale } = useLanguages()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()
  const router = useRouter()
  const { $appSettings } = useNuxtApp()

  const subNavItems = computed(() => [
    { label: t('layout.news'), url: localePath('/news') },
    { label: t('layout.resource'), url: localePath('/resource') },
    { label: t('layout.video'), url: localePath('/video') },
    { label: t('layout.scientific-library'), url: localePath('/scientific-library') },
    { label: t('layout.health'), url: localePath('/public-health'), hidden: !$appSettings.SHOW_PUBLIC_HEALTH },
    { label: t('layout.directory'), url: localePath('/directory'), hidden: !$appSettings.SHOW_DIRECTORY },
    { label: t('layout.product'), url: localePath('/product') },
    { label: t('layout.education'), url: localePath('/education'), hidden: !$appSettings.SHOW_EDUCATION },
    { label: t('layout.forum'), url: localePath('/forum') },
    { label: t('layout.submitContent'), url: localePath('/contribute') },
  ])

  // Inkline color mode
  const colorModeIcon = computed(() => inkline.options.colorMode === DARK ? LIGHT_ICON : DARK_ICON)
  const switchColorMode = () => inkline.options.colorMode = inkline.options.colorMode === DARK ? LIGHT : DARK

  // App Logo
  const logoFile = computed(() => `/covid-life-v3-${inkline.options.colorMode}.png`)

  // Search
  const searchTerm = ref("")
  const onSearch = () => {
    if (!searchTerm.value.length) {
      return
    }

    router.push({ path: localePath(`/search/${encodeURIComponent(searchTerm.value)}`)})
  }

  // Feed URL
  const rssFeedUrl = computed(() => locale?.value == "en" ? "/api/feed" : `/api/feed?lang=${locale.value}`)

  // User Menu
  const user = useSupabaseUser()
  const isLoggedIn = computed(() => !!user?.value?.id)
  const { signOut } = useSignOut(user)
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.default-layout {

  height: 100vh;

  &__header {
    position: sticky;
    top: 0;
    z-index: 1000;

    &--auth {
      &:hover {
        cursor: pointer;
      }
    }

    &--color-mode {
      &:hover {
        cursor: pointer;
      }
    }
  }

  &__user {
    &--label {
      @include eyebrow();

      font-size: 12px;
      font-weight: 600;
      margin-left: 5px;
    }
  }

  &__logo {
    height: 50px;
    width: auto;

    &-footer {
      height: 40px;
    }
  }

  &__sub-nav {
    :deep(.navbar-collapsible) {
      justify-content: center;
    }

    :deep(.nav-item) {
      @include eyebrow();

      font-size: 13px;
      font-weight: 700;
      letter-spacing: .12rem;
    }

    @include breakpoint-down('md') {
      :deep(.collapse-toggle) {
        margin-left: 10px;
      }

      :deep(.navbar-collapsible) {
        margin-top: 10px;
      }
    }
  }

  &__locale {
    margin-left: 8px;
  }

  &__search {
    margin: 0 10px;

    @include breakpoint('xs') {
      margin: 20px 0 10px 0;
      width: 100%;
    }

    :deep(input) {
      transition: width .2s;

      @include breakpoint-up('lg') {
        &:focus {
          width: 250px;
        }
      }
    }
  }

  &__content {
    &--container {
      padding: 50px;
    }

    @include breakpoint-down('md') {
      &--container {
        padding: 40px 20px;
      }
    }
  }

  &__footer {
    background-color: var(--color-light);
    padding: 30px 0 70px 0;

    &--container {
      display: flex;
      padding: 0 60px;

      &-block {
        flex-basis: 20%;

        &.logo {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }

        &-title {
          @include eyebrow();

          font-size: 13px;
          font-weight: 700;
          letter-spacing: .1rem;
        }
      }
    }

    &--list {
      font-size: 14px;
      line-height: 20px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &--year {
      border-top: 1px solid var(--border-bottom-color);
      font-size: 13px;
      margin-top: 15px;
      padding-top: 20px;
      width: 100%;
    }

    @include breakpoint-down('lg') {
      &--container {
        &-block {
          flex-basis: 25%;

          &.logo {
            display: none;
          }
        }
      }
    }

    @include breakpoint-down('md') {
      &--container {
        flex-direction: column;
        padding: 0 35px;

        &-block {
          margin-bottom: 20px;
        }
      }
    }
  }
}

.dark-theme {
  .default-layout__footer {
    background: var(--color-dark);
  }
}
</style>