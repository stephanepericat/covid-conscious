
import { localePath } from 'vue-i18n-routing';

<template>
  <ILayout class="default-layout">
    <!-- header -->
    <ILayoutHeader>
      <INavbar>
        <INavbarBrand :to="localePath('/')">
          <img class="default-layout__logo" src="/covid-conscious-logo.svg" />
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
              <INavItem> {{ $t("layout.learn") }} </INavItem>
              <template #body>
                <IDropdownItem v-for="category in menuCategoriesSorted.educationCategory" :key="category.name">
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <IDropdown>
              <INavItem> {{ $t("layout.products") }} </INavItem>
              <template #body>
                <IDropdownItem v-for="category in menuCategoriesSorted.productCategory" :key="category.name">
                  {{ category.name }}
                </IDropdownItem>
              </template>
            </IDropdown>
            <INavItem :to="localePath('/submit')"> {{ $t("layout.submitContent") }} </INavItem>
          </INav>
          <IInput class="default-layout__search" :placeholder="`${$t('layout.search')}...`">
            <template #append>
              <IButton color="primary">
                <IIcon name="ink-search" />
              </IButton>
            </template>
          </IInput>
          <IDropdown placement="bottom-end">
            <INavItem><Icon :name="currentLocale.flag" /> <span>{{ currentLocale.name }}</span></INavItem>
            <template #body>
              <IDropdownItem v-for="locale in availableLocales" :key="locale.code" :to="switchLocalePath(locale.code)">
                <span>{{ locale.name }}</span>
              </IDropdownItem>
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
        <INav class="default-layout__footer--nav">
          <INavItem class="default-layout__footer--legal"> {{ $t("layout.footerLegal", { year: new Date().getFullYear() }) }} </INavItem>
          <INavbarBrand to="/" class="default-layout__footer--logo">
            <IDropdown placement="top-end" events="hover">
              <img class="default-layout__logo-footer" src="/covid-conscious-logo.svg" />
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
                  <Icon class="default-layout__footer--dropdown-icon" name="ph:twitter-logo-light" />
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
import menuCategoriesQuery from "~/sanity/menuCategories.sanity";

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const currentLocale = computed(() => {
  return (locales.value).find(i => i.code === locale.value)
});
const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
});

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
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';

  .default-layout {
    height: 100vh;

    &__logo {
      height: 50px;
      width: auto;

      &-footer {
        height: 30px;
        margin-right: 20px;
      }
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

    // @include breakpoint('md') {
    // }
  }
</style>