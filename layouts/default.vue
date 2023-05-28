<template>
  <ILayout class="default-layout">
    <ILayoutHeader>
      <INavbar color="light">
        <INavbarBrand to="/">
          <img  class="default-layout__logo" src="/covid-conscious-logo.svg" />
        </INavbarBrand>
        <INavbarCollapsible>
            <INav class="default-layout__nav">
              <INavItem to="/"> Home </INavItem>
              <IDropdown>
                <INavItem> Community </INavItem>
                <template #body>
                  <IDropdownItem>Action</IDropdownItem>
                  <IDropdownItem>Another action</IDropdownItem>
                  <IDropdownItem disabled>Disabled action</IDropdownItem>
                  <IDropdownDivider />
                  <IDropdownItem>Separated item</IDropdownItem>
                </template>
              </IDropdown>
              <IDropdown>
                <INavItem> Products </INavItem>
                <template #body>
                  <IDropdownItem>Action</IDropdownItem>
                  <IDropdownItem>Another action</IDropdownItem>
                  <IDropdownItem disabled>Disabled action</IDropdownItem>
                  <IDropdownDivider />
                  <IDropdownItem>Separated item</IDropdownItem>
                </template>
              </IDropdown>
              <INavItem to="/news"> News </INavItem>
              <INavItem to="/contact"> Submit Content </INavItem>
            </INav>
            <IInput class="default-layout__search" placeholder="Search...">
              <template #append>
                <IButton color="primary">
                  <IIcon name="ink-search" />
                </IButton>
              </template>
            </IInput>
        </INavbarCollapsible>
    </INavbar>
    </ILayoutHeader>
    <ILayout vertical>
        <ILayoutContent class="default-layout__content">
          <IContainer class="default-layout__content--container">
            <NuxtPage />
          </IContainer>
        </ILayoutContent>
        <!-- <ILayoutAside class="default-layout__aside"> Right Aside </ILayoutAside> -->
    </ILayout>
    <ILayoutFooter>
      <div class="default-layout__footer">&nbsp;</div>
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
    }

    &__search {
      flex-grow: 0;

      &:hover {
        flex-grow: 1;
      }
    }

    &__footer {
      background-color: var(--color-light);
    }

    // @include breakpoint('md') {
    //   &__aside {
    //     display: none;
    //   }
    // }
  }
</style>