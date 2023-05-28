<template>
  <ILayout class="default-layout">
    <ILayoutHeader> Header </ILayoutHeader>
    <ILayout vertical>
        <ILayoutContent>
          <NuxtPage />
        </ILayoutContent>
        <ILayoutAside> Right Aside </ILayoutAside>
    </ILayout>
    <ILayoutFooter> Footer </ILayoutFooter>
  </ILayout>
</template>
<style lang="scss" scoped>
  .default-layout {
    height: 100vh;
  }
</style>