<template>
  <div class="sf-page-shell">
    <INav
      class="sf-page-shell__nav"
      vertical
      size="sm"
    >
      <INavItem :to="localePath(rootPath)">
        <Icon
          class="sf-page-shell__nav--icon"
          name="material-symbols:add-alert-rounded"
        />
        {{ $t('supabase-forum.nav.latest') }}
      </INavItem>
      <INavItem :to="localePath(`${rootPath}/search`)">
        <Icon
          class="sf-page-shell__nav--icon"
          name="material-symbols:find-in-page-outline-rounded"
        />
        {{ $t('supabase-forum.nav.search') }}
      </INavItem>
      <template v-if="user">
        <INavItem :to="localePath(`${rootPath}/create`)">
          <Icon
            class="sf-page-shell__nav--icon"
            name="material-symbols:add-box-outline-rounded"
          />
          {{ $t('supabase-forum.nav.create') }}
        </INavItem>
        <INavItem :to="localePath(`${rootPath}/my-posts`)">
          <Icon
            class="sf-page-shell__nav--icon"
            name="material-symbols:lab-profile-rounded"
          />
          {{ $t('supabase-forum.nav.my.posts') }}
        </INavItem>
        <INavItem
          class="sf-page-shell__nav--action"
          @click.prevent="signOut"
        >
          <Icon
            class="sf-page-shell__nav--icon"
            name="ph:sign-out-bold"
          />
          {{ $t('supabase-forum.nav.logout') }}
        </INavItem>
      </template>
      <INavItem
        v-else
        :to="localePath('/login')"
      >
        <Icon
          class="sf-page-shell__nav--icon"
          name="ph:sign-in-bold"
        />
        {{ $t('supabase-forum.nav.login') }}
      </INavItem>
    </INav>
    <section class="sf-page-shell__contents">
      <slot />
    </section>

    <IToastContainer />
  </div>
</template>
<script setup>
  import { useSignOut } from '~/assets/composables/useSignOut'

  const config = useRuntimeConfig()
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  const rootPath = computed(() => config.public.supabaseForum.rootPath)

  const { signOut } = useSignOut(user)
</script>
<style lang="scss" scoped>
.sf-page-shell {
  display: flex;

  &__nav {
    align-self: flex-start;
    flex-basis: 240px;
    flex-shrink: 0;
    position: sticky;
    top: 151px;

    &--action {
      cursor: pointer;
    }

    &--icon {
      margin-right: 5px;
    }
  }

  &__contents {
    flex-grow: 1;
  }
}
</style>