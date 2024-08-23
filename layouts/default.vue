<template>
  <ILayout class="default-layout">
    <template v-if="$appSettings.PASSWORD_PROTECT && !authorized">
      <div class="h-screen w-screen flex justify-center	items-center">
        <div>
          <IForm
            @submit.prevent="handleLogin"
          >
            <IFormGroup>
              <IInput
                v-model="password"
                :placeholder="$t('login.labels.password')"
                type="password"
                required
              />
            </IFormGroup>
            <IFormGroup>
              <IButton
                block
                type="submit"
              >
                <Icon
                  v-if="loading"
                  name="eos-icons:loading"
                />
                {{ $t('login.buttons.signin') }}
              </IButton>
            </IFormGroup>
          </IForm>
        </div>
      </div>
    </template>

    <template v-else>
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
                <!-- <Icon :name="currentLocale.flag" /> -->
                <span v-text="currentLocale.code" class="default-layout__language--label" />
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
              <template #header v-if="isLoggedIn">
                <div class="default-layout__user--info">
                  <NuxtImg v-if="avatar" :src="avatar" width="40" height="40" class="default-layout__user--info-visual" />
                  <div>
                    <p class="default-layout__user--info-detail username">@{{ username || 'USER' }}</p>
                    <p class="default-layout__user--info-detail email">{{ user.email }}</p>
                  </div>
                </div>
              </template>
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
                  <IDropdownItem :to="localePath('/create-account')">
                    <span>{{ $t('layout.user.createAccount') }}</span>
                  </IDropdownItem>
                  <IDropdownItem :to="localePath('/reset-password')">
                    <span>{{ $t('layout.user.resetPassword') }}</span>
                  </IDropdownItem>
                </template>
              </template>
            </IDropdown>
        </INav>
        </INavbar>
        <INavbar class="default-layout__sub-nav" size="sm">
          <INavbarCollapsible>
            <INav>
              <INavItem
                v-for="(item, index) in subNavItems"
                :key="index"
                :to="item.url"
                :class="item.class || ''"
                v-show="!item.hidden"
              >
                {{ item.label }}
              </INavItem>
              <IDropdown class="default-layout__sub-nav--more" placement="bottom-end" events="hover">
                <INavItem>
                  <Icon size="22" name="mdi:dots-horizontal-circle-outline" />
                  <!-- {{ $t('layout.more.label') }} -->
                </InavItem>
                <template #body>
                  <IDropdownItem :to="localePath('/public-health')" v-if="$appSettings.SHOW_PUBLIC_HEALTH">
                    <span>{{ $t('layout.health') }}</span>
                  </IDropdownItem>
                  <IDropdownItem v-if="$appSettings.SHOW_EDUCATION" :to="localePath('/education')">
                    <span>{{ $t('layout.education') }}</span>
                  </IDropdownItem>
                  <IDropdownItem :to="localePath('/forum')">
                    <span>{{ $t('layout.forum') }}</span>
                  </IDropdownItem>
                  <IDropdownItem :to="localePath('/contribute')">
                    <span>{{ $t('layout.submitContent') }}</span>
                  </IDropdownItem>
                  <IDropdownItem :to="localePath('/mobile')">
                    <span>{{ $t('layout.mobile') }}</span>
                  </IDropdownItem>
                </template>
              </IDropdown>
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
              <li v-if="$appSettings.SHOW_MOBILE">
                <NuxtLink :to="localePath('/mobile')">{{ $t('layout.mobile') }}</NuxtLink>
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
                <a href="https://www.instagram.com/thatcovid.life" target="_blank">
                  <icon name="tabler:brand-instagram" />&nbsp;
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.reddit.com/r/thatcovidlife/" target="_blank">
                  <icon name="tabler:brand-reddit" />&nbsp;
                  Reddit
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/@thatcovid.life" target="_blank">
                  <icon name="tabler:brand-threads" />&nbsp;
                  Threads
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
    </template>
  </ILayout>
</template>
<script setup>
  import { INavItem, useInkline } from '@inkline/inkline'
  import { DARK, DARK_ICON , LIGHT, LIGHT_ICON } from '~/assets/constants/inkline-modes'
  import { useSignOut } from '~/assets/composables/useSignOut'
  import { useLanguages } from '~/assets/composables/useLanguages'
  import { getGravatarUrl } from '~/assets/utils/gravatar'
  import { usePosts } from '~/assets/composables/usePosts'

  const inkline = useInkline()
  const { t } = useI18n()
  const { currentLocale, availableLocales, locale } = useLanguages()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()
  const router = useRouter()
  const { $appSettings } = useNuxtApp()
  const { getUsernameById } = usePosts()
  const loading = ref(false)
  const password = ref('')
  const authCookie = useCookie('tcl-auth', { default: null, watch: true })
  const authorized = ref(false)

  const handleLogin = async () => {
    loading.value = true
    try {
      await $fetch('/api/login', {
        method: 'POST',
        body: {
          password: password.value
        }
      })
    } catch(e) {
      console.error(e)
    } finally {
      password.value = ''
      loading.value = false
    }
  }

  const verifyToken = async () => {
    try {
      const data = await $fetch('/api/verify', {
        method: 'POST',
        body: {
          token: authCookie.value
        }
      })
      authorized.value = data.ok
    } catch(e) {
      console.error(e)
    }
  } 

  const subNavItems = computed(() => [
    { label: t('layout.news'), url: localePath('/news') },
    { label: t('layout.resource'), url: localePath('/resource') },
    { label: t('layout.video'), url: localePath('/video') },
    { label: t('layout.scientific-library'), url: localePath('/scientific-library') },
    { label: t('layout.directory'), url: localePath('/directory'), hidden: !$appSettings.SHOW_DIRECTORY },
    { label: t('layout.product'), url: localePath('/product') },
    { label: t('layout.health'), url: localePath('/public-health'), class: 'optional', hidden: !$appSettings.SHOW_PUBLIC_HEALTH },
    { label: t('layout.education'), url: localePath('/education'), class: 'optional', hidden: !$appSettings.SHOW_EDUCATION },
    { label: t('layout.forum'), url: localePath('/forum'), class: 'optional' },
    { label: t('layout.submitContent'), url: localePath('/contribute'), class: 'optional' },
    { label: t('layout.mobile'), url: localePath('/mobile'), class: 'optional' },
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
  const avatar = computedAsync(
    async () => !user?.value?.email ? null : await getGravatarUrl(user.value.email),
    null
  )
  const username = computedAsync(
    async () => !user?.value?.id ? null : await getUsernameById(user.value.id),
    null
  )
  const { signOut } = useSignOut(user)

  watch(authCookie, () => {
    if(authCookie.value) {
      verifyToken()
    }
  }, { immediate: true })
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.default-layout {

  height: 100vh;

  &__header {
    position: sticky;
    top: 0;
    z-index: 10000;

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

  &__language,
  &__user {
    &--label {
      @include eyebrow();

      font-size: 13px;
      font-weight: 600;
      margin-left: 5px;
    }
  }

  &__user {
    &--info {
      display: flex;

      &-visual {
        margin-right: 10px;
        border-radius: 50%;
      }

      &-detail {
        font-size: 13px;
        margin: 0;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.username {
          font-weight: 700;
          letter-spacing: .05rem;
          text-transform: uppercase;
        }

        &.email {
          color: #555;
          font-weight: 500;
        }
      }
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

      font-weight: 700;
      letter-spacing: .1rem;
    }

    .optional {
      display: none;
    }

    @include breakpoint-down('md') {
      :deep(.collapse-toggle) {
        margin-left: 10px;
      }

      :deep(.navbar-collapsible) {
        margin-top: 10px;
      }

      &--more {
        display: none;
      }

      .optional {
        display: initial;
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
        padding: 0 20px;

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

  .default-layout__user--info-detail.email {
    color: #ccc;
  }
}
</style>