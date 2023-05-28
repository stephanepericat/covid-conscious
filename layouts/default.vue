<template>
  <ILayout class="default-layout">
    <ILayoutHeader>
      <INavbar color="light">
        <INavbarBrand to="/">
          <img  class="default-layout__logo" src="/covid-conscious-logo.svg" />
        </INavbarBrand>
        <INavbarCollapsible>
            <INav>
                <INavItem to="/"> Home </INavItem>
                <INavItem to="/about"> About </INavItem>
                <INavItem to="/contact"> Contact </INavItem>
            </INav>
            <!-- <IInput placeholder="Type something..">
                <template #append>
                    <IButton color="primary">
                        <IIcon name="ink-search" />
                    </IButton>
                </template>
            </IInput> -->
        </INavbarCollapsible>
    </INavbar>
    </ILayoutHeader>
    <ILayout vertical>
        <ILayoutContent>
          <NuxtPage />
        </ILayoutContent>
        <ILayoutAside> Right Aside </ILayoutAside>
    </ILayout>
    <ILayoutFooter>
      <div class="default-layout__footer">&nbsp;</div>
    </ILayoutFooter>
  </ILayout>
</template>
<style lang="scss" scoped>
  .default-layout {
    height: 100vh;

    &__logo {
      height: 60px;
      width: auto;
    }

    &__footer {
      background-color: var(--color-light);
    }
  }
</style>