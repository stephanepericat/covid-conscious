
import { localePath } from 'vue-i18n-routing';

<template>
  <ILayout class="default-layout">
    <ILayoutHeader>
      <INavbar>
        <INavbarBrand to="/">
          <img class="default-layout__logo" src="/covid-conscious-logo.svg" />
        </INavbarBrand>
        <INavbarCollapsible>
            <INav class="default-layout__nav">
              <INavItem to="/"> {{ $t("layout.home") }} </INavItem>
              <IDropdown>
                <INavItem> {{ $t("layout.community") }} </INavItem>
                <template #body>
                  <IDropdownItem>Action</IDropdownItem>
                  <IDropdownItem>Another action</IDropdownItem>
                  <IDropdownItem disabled>Disabled action</IDropdownItem>
                  <IDropdownDivider />
                  <IDropdownItem>Separated item</IDropdownItem>
                </template>
              </IDropdown>
              <IDropdown>
                <INavItem> {{ $t("layout.learn") }} </INavItem>
                <template #body>
                  <IDropdownItem>Action</IDropdownItem>
                  <IDropdownItem>Another action</IDropdownItem>
                  <IDropdownItem disabled>Disabled action</IDropdownItem>
                  <IDropdownDivider />
                  <IDropdownItem>Separated item</IDropdownItem>
                </template>
              </IDropdown>
              <IDropdown>
                <INavItem> {{ $t("layout.products") }} </INavItem>
                <template #body>
                  <IDropdownItem>Action</IDropdownItem>
                  <IDropdownItem>Another action</IDropdownItem>
                  <IDropdownItem disabled>Disabled action</IDropdownItem>
                  <IDropdownDivider />
                  <IDropdownItem>Separated item</IDropdownItem>
                </template>
              </IDropdown>
              <INavItem to="/news"> {{ $t("layout.news") }} </INavItem>
              <INavItem to="/contact"> {{ $t("layout.submitContent") }} </INavItem>
            </INav>
            <IInput class="default-layout__search" :placeholder="`${$t('layout.search')}...`">
              <template #append>
                <IButton color="primary">
                  <IIcon name="ink-search" />
                </IButton>
              </template>
            </IInput>
        </INavbarCollapsible>
    </INavbar>
    </ILayoutHeader>
    <ILayoutContent class="default-layout__content">
      <IContainer class="default-layout__content--container">
        <NuxtPage />
      </IContainer>
    </ILayoutContent>
    <ILayoutFooter class="default-layout__footer">
      <IContainer class="default-layout__footer--container">
        <INav class="default-layout__footer--nav">
          <INavItem class="default-layout__footer--legal"> {{ $t("layout.footerLegal", { year: new Date().getFullYear() }) }} </INavItem>
          <INavbarBrand to="/" class="default-layout__footer--logo">
            <img class="default-layout__logo-footer" src="/covid-conscious-logo.svg" />
          </INavbarBrand>
        </INav>
      </IContainer>
    </ILayoutFooter>
  </ILayout>
</template>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';

  .default-layout {
    height: 100vh;

    &__logo {
      height: 50px;
      width: auto;

      &-footer {
        height: 30px;
      }
    }

    &__search {
      flex-grow: 0;

      &:hover {
        flex-grow: 1;
      }
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

      &--legal {
        flex-grow: 1;
      }
    }

    // @include breakpoint('md') {
    // }
  }
</style>