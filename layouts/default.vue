<template>
  <ILayout class="default-layout">
    <!-- header -->
    <ILayoutHeader class="default-layout__header">
      <INavbar :collapse-on-item-click="false">
        <INavbarBrand :to="localePath('/')">
          <img class="default-layout__logo" :src="logoFile" />
        </INavbarBrand>
        <INavbarCollapsible>
          <INav class="default-layout__nav">
            <INavItem :to="localePath('/news')"> {{ $t("layout.news") }} </INavItem>
            <IDropdown>
              <INavItem> {{ $t("layout.community") }} </INavItem>
              <template #body>
                <IDropdownItem
                  v-for="category in menuCategoriesSorted.communityCategory"
                  :key="category.name"
                  :to="localePath(`/${COMMUNITY}/${category.slug}`)"
                >
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.education") }} </INavItem>
              <template #body>
                <IDropdownItem
                  v-for="category in menuCategoriesSorted.educationCategory"
                  :key="category.name"
                  :to="localePath(`/${EDUCATION}/${category.slug}`)"
                >
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.product") }} </INavItem>
              <template #body>
                <IDropdownItem
                  v-for="category in menuCategoriesSorted.productCategory"
                  :key="category.name"
                  :to="localePath(`/${PRODUCT}/${category.slug}`)"
                >
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.forum") }} </INavItem>
              <template #body>
                <IDropdownItem
                  :to="localePath(`/${FORUM}`)"
                >
                  {{ $t('forum.nav.latest') }}
                </IDropdownItem>
                <template v-if="isLoggedIn">
                  <IDropdownItem
                    :to="localePath(`/${FORUM}/create`)"
                  >
                    {{ $t('forum.nav.create') }}
                  </IDropdownItem>
                  <IDropdownItem
                    :to="localePath(`/${FORUM}/my-posts`)"
                  >
                    {{ $t('forum.nav.my.posts') }}
                  </IDropdownItem>
                </template>
              </template>
            </IDropdown>
            <INavItem :to="localePath('/contribute')"> {{ $t("layout.submitContent") }} </INavItem>
          </INav>
          <IInput v-model="searchTerm" @keydown.enter="onSearch" class="default-layout__search" :placeholder="`${$t('layout.search')}...`">
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
          <ITooltip placement="bottom-end" size="sm">
            <INavItem class="default-layout__header--color-mode" @click="switchColorMode">
              <Icon :name="colorModeIcon" />
            </INavItem>
            <template #body>{{ colorModeTooltip }}</template>
          </ITooltip>
          <IDropdown placement="bottom-end" events="hover">
            <INavItem>
              <Icon name="material-symbols:account-circle" />
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
              <a href="https://twitter.com/thatcovidlife" target="_blank">{{ $t('layout.twitter') }}</a>
            </li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block">
          <h5 class="default-layout__footer--container-block-title">{{ $t('layout.contents') }}</h5>
          <ul class="default-layout__footer--list">
            <li>
              <NuxtLink :to="localePath('/news')">{{ $t('layout.news') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/community')">{{ $t('layout.community') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/product')">{{ $t('layout.product') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/education')">{{ $t('layout.education') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/forum')">{{ $t('layout.forum') }}</NuxtLink>
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
            <li>{{ $t("layout.footerLegal", { year: new Date().getFullYear() }) }}</li>
          </ul>
        </div>
        <div class="default-layout__footer--container-block logo">
          <INavbarBrand :to="localePath('/')">
            <img class="default-layout__logo-footer" :src="logoFile" />
          </INavbarBrand>
        </div>
      </IContainer>
    </ILayoutFooter>
  </ILayout>
</template>
<script setup>
  import menuCategoriesQuery from '~/sanity/menuCategories.sanity';
  import { useInkline } from '@inkline/inkline';
  import { DARK, DARK_ICON , LIGHT, LIGHT_ICON } from '~/assets/constants/inkline-modes';
  import { COMMUNITY, EDUCATION, FORUM, PRODUCT } from '~/assets/constants/types';
  import { useSignOut } from '~/assets/composables/useSignOut';

  const inkline = useInkline();
  const { locale, locales, t } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const localePath = useLocalePath();
  const router = useRouter();

  // Current and available languages
  const currentLocale = computed(() => {
    return (locales.value).find(i => i.code === locale.value)
  });
  const availableLocales = computed(() => {
    return (locales.value).filter(i => i.code !== locale.value)
  });

  // Menu Categories
  const { data: menuCategories } = useSanityQuery(menuCategoriesQuery, { locale });
  const menuCategoriesSorted = computed(() => {
    return menuCategories?.value?.reduce((acc, val) => {
      if(!acc[val.type]) {
        acc[val.type] = [];
      }

      acc[val.type].push(val);

      return acc;
    }, {}) || {};
  });

  // Inkline color mode
  const colorModeIcon = computed(() => inkline.options.colorMode === DARK ? LIGHT_ICON : DARK_ICON);
  const colorModeTooltip = computed(() => {
    return inkline.options.colorMode === DARK
      ? t('layout.switch.lightMode')
      : t('layout.switch.darkMode')
  });
  const switchColorMode = () => inkline.options.colorMode = inkline.options.colorMode === DARK ? LIGHT : DARK;

  // App Logo
  const logoFile = computed(() => `/covid-life-v3-${inkline.options.colorMode}.png`);

  // Search
  const searchTerm = ref("");
  const onSearch = () => {
    if (!searchTerm.value.length) {
      return;
    }

    router.push({ path: localePath(`/search/${encodeURIComponent(searchTerm.value)}`)});
  };

  // Feed URL
  const rssFeedUrl = computed(() => locale?.value == "en" ? "/api/feed" : `/api/feed?lang=${locale.value}`);

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

    &--color-mode {
      &:hover {
        cursor: pointer;
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

  &__locale {
    margin-left: 8px;
  }

  &__search {
    margin: 0 10px;
  }

  &__content {
    &--container {
      padding: 50px;
    }
  }

  &__footer {
    background-color: var(--color-light);
    padding: 30px 0 70px 0;

    &--container {
      display: flex;
      padding: 0 60px;

      &-block {
        flex-basis: 25%;

        &.logo {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          align-items: center;
        }

        &-title {
          @include eyebrow();

          font-size: 16px;
        }
      }
    }

    &--list {
      line-height: 16px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    @include breakpoint-down('md') {
      &--container {
        flex-direction: column;

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