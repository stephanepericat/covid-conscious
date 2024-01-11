<template>
  <div class="sf-user-page">
    <IMedia class="sf-user-page__info">
      <template #image>
        <img
          v-if="user.avatar_url"
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
          <h1 class="sf-user-page__title" v-text="`@${user.username}`" />
          <em v-if="user.full_name" v-text="user.full_name" />
          <div v-if="user.website">
            <Icon
              class="sf-user-page__website--icon"
              name="mdi:web"
            />
            <a :href="user.website" target="_blank">{{ $t('forum.account.labels.website') }}</a>
          </div>
        </div>
      </template>
    </IMedia>
    <div v-if="user.about">
      <h3 v-text="$t('forum.account.labels.about')" />
      <p v-text="user.about" />
    </div>
    <a href="#" @click="() => router.go(-1)">
      &laquo;
      {{ $t('forum.account.back') }}
    </a>
  </div>
</template>
<script setup>
  import { usePosts } from '~/assets/composables/usePosts'

  const route = useRoute()
  const router = useRouter()
  const { getAvatarUrl, getUserById } = usePosts()

  const user = await getUserById(route.params.id)
  const avatar = await getAvatarUrl(user.avatar_url)

  umTrackView()
</script>
<style lang="scss" scoped>

@import "~/assets/sass/mixins.scss";

.sf-user-page {
  &__info {
    margin-bottom: 30px;
  }

  &__thumbnail {
    @include thumbnail($dimension: 120px);
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