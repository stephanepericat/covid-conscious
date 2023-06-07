
import { localePath } from 'vue-i18n-routing';

<template>
  <ILayout class="default-layout">
    <!-- header -->
    <ILayoutHeader class="default-layout__header">
      <INavbar>
        <INavbarBrand :to="localePath('/')">
          <img class="default-layout__logo" :src="logoFile" />
        </INavbarBrand>
        <INavbarCollapsible>
          <INav class="default-layout__nav">
            <INavItem :to="localePath('/news')"> {{ $t("layout.news") }} </INavItem>
            <IDropdown>
              <INavItem> {{ $t("layout.community") }} </INavItem>
              <template #body>
                <IDropdownItem v-for="category in menuCategoriesSorted.communityCategory" :key="category.name">
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.education") }} </INavItem>
              <template #body>
                <IDropdownItem v-for="category in menuCategoriesSorted.educationCategory" :key="category.name">
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.product") }} </INavItem>
              <template #body>
                <IDropdownItem v-for="category in menuCategoriesSorted.productCategory" :key="category.name">
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <INavItem :to="localePath('/submit')"> {{ $t("layout.submitContent") }} </INavItem>
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
              <!-- <span class="default-layout__locale">{{ currentLocale.name }}</span> -->
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
        <INav class="default-layout__footer--nav">
          <INavItem class="default-layout__footer--legal"> {{ $t("layout.footerLegal", { year: new Date().getFullYear() }) }} </INavItem>
          <INavbarBrand to="/" class="default-layout__footer--logo">
            <IDropdown placement="top-end" events="hover">
              <img class="default-layout__logo-footer" :src="logoFile" />
              <template #body>
                <IDropdownItem>
                  <Icon class="default-layout__footer--dropdown-icon" name="material-symbols:android-chat" />
                  <span class="default-layout__footer--dropdown-label" v-text="$t('layout.about')" />
                </IDropdownItem>
                <IDropdownItem>
                  <Icon class="default-layout__footer--dropdown-icon" name="material-symbols:contact-support-outline" />
                  <span class="default-layout__footer--dropdown-label" v-text="$t('layout.contactUs')" />
                </IDropdownItem>
                <IDropdownItem>
                  <Icon class="default-layout__footer--dropdown-icon" name="ri:twitter-line" />
                  <span class="default-layout__footer--dropdown-label" v-text="$t('layout.twitter')" />
                </IDropdownItem>
              </template>
            </IDropdown>
          </INavbarBrand>
        </INav>
      </IContainer>
    </ILayoutFooter>
  </ILayout>
</template>
<script setup>
import menuCategoriesQuery from '~/sanity/menuCategories.sanity';
import { useInkline } from '@inkline/inkline';
import { DARK, DARK_ICON , LIGHT, LIGHT_ICON } from '~/assets/constants/inkline-modes';

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
    if(!acc[val.category]) {
      acc[val.category] = [];
    }

    acc[val.category].push(val);

    return acc;
  }, {});
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
const logoFile = computed(() => {
  return inkline.options.colorMode === DARK
    ? '/covid-conscious-logo-light.svg'
    : '/covid-conscious-logo.svg'
});

// Search
const searchTerm = ref("");
const onSearch = () => {
  if (!searchTerm.value.length) {
    return;
  }

  router.push({ path: localePath(`/search/${encodeURIComponent(searchTerm.value)}`)});
};
</script>
<style lang="scss" scoped>
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
      height: 30px;
      margin-right: 20px;
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
    padding: 30px 0 50px 0;

    &--nav {
      display: flex;
      width: 100%;
    }

    &--dropdown {
      &-icon {
        height: 22px;
      }

      &-label {
        margin-left: 8px;
      }
    }

    &--legal {
      flex-grow: 1;
    }
  }
}

.dark-theme {
  .default-layout__footer {
    background: var(--color-dark);
  }
}
</style>