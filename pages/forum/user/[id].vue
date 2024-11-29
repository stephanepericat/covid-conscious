<template>
  <div class="sf-user-page">
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
      <Meta name="og:title" :content="pageTitle" />
      <Meta name="og:description" :content="pageDescription" />
      <Meta name="twitter:title" :content="pageTitle" />
      <Meta name="twitter:description" :content="pageDescription" />
    </Head>

    <ILoader v-if="!user" class="sf-user-page__loader" size="sm" />

    <template v-else>
      <IMedia class="sf-user-page__info">
        <template #image>
          <img
            v-if="avatar"
            class="sf-user-page__thumbnail"
            :src="avatar"
          >
          <div
            v-else
            class="sf-user-page__thumbnail--fallback"
          >
            <Icon
              class="sf-user-page__thumbnail--fallback-icon"
              name="material-symbols:account-circle-full"
            />
          </div>
          <div>
            <h1 class="sf-user-page__title" v-text="`@${user?.profile?.name || ''}`" />
            <div v-if="user?.profile?.website">
              <Icon
                class="sf-user-page__website--icon"
                name="mdi:web"
              />
              <a :href="`https://${user.profile.website}`" target="_blank">{{ $t('forum.account.labels.website') }}</a>
            </div>
          </div>
        </template>
      </IMedia>
      <div v-if="user?.profile?.bio">
        <h3 v-text="$t('forum.account.labels.about')" />
        <p v-text="user.profile.bio" />
      </div>
      <a href="#" @click="() => router.go(-1)">
        &laquo;
        {{ $t('forum.account.back') }}
      </a>
    </template>
  </div>
</template>
<script setup>
  import { usePrisma } from '~/assets/composables/usePrisma'
  import { getGravatarUrl } from '~/assets/utils/gravatar'

  const route = useRoute()
  const router = useRouter()

  const { getUserById } = usePrisma()
  const user = computedAsync(async () => await getUserById(parseInt(route.params.id)), null)
  
  const avatar = computedAsync(
    async () => user.value?.email
      ? await getGravatarUrl(user.value.email)
      : null,
    null
  )

  const pageTitle = computed(() => user.value?.profile?.name ? `@${user.value.profile.name}` : user.value?.email ? user.value.email : null)
  const pageDescription = computed(() => user.value?.profile.bio ? user.value.profile.bio : null)

  umTrackView()
</script>
<style lang="scss" scoped>

@import "~/assets/sass/mixins.scss";

.sf-user-page {
  &__info {
    margin-bottom: 30px;
  }

  &__loader {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    width: 100%;
  }

  &__thumbnail {
    @include thumbnail($dimension: 120px);
    border-radius: 50%;
  }

  &__title {
    @include title();
  }

  &__website {
    &--icon {
      margin-right: 5px;
    }
  }
}
</style>