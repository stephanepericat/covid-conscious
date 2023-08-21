<template>
  <PageShell class="sf-post-page">
    <ILoader
      v-if="loading"
      class="sf-post-page__loader"
    />
    <template v-else>
      <h1
        class="sf-post-page__title"
        v-text="post.headline"
      />
      <IMedia class="sf-post-page__author">
        <template #image>
          <div class="sf-post-page__avatar--placeholder" v-if="!post.avatar">
            <Icon
              class="sf-post-page__avatar--placeholder-icon"
              name="material-symbols:account-circle-full"
            />
          </div>
          <img
            v-else
            class="sf-post-page__avatar"
            :src="post.avatar"
          >
        </template>
        <h5 class="sf-post-page__author--name">
          <NuxtLink :to="localePath(`${rootPath}/user/${post.profiles.id}`)">
            {{ post.profiles.username }}
          </NuxtLink>
        </h5>
        <p class="sf-post-page__info">
          <span class="sf-post-page__info--category">
            {{ $t(`supabase-forum.create.categories.${post.topic}`) }} / {{ format(new Date(post.created_at), DEFAULT_DATE_FORMAT) }}
          </span>
        </p>
      </IMedia>
      <section
        class="sf-post-page__body"
        v-html="post.body"
      />
      <section class="sf-post-page__comments">
        <CommentBox
          class="sf-post-page__comments--box"
          :post-id="parseInt(route.params.id)"
          @error="onCommentPostError"
          @success="onCommentPostSuccess"
        />
        <h2 class="sf-post-page__comments--title">
          <Icon name="icon-park-outline:comments" />
          <span>{{ $t("supabase-forum.post.comments") }}</span>
        </h2>
        <CommentList
          :comments="comments"
          :page="activePage"
          :pending="commentsLoading"
          :total-items="totalComments"
          @page-change="onCommentsPageChange"
        />
      </section>
    </template>
  </PageShell>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useToast } from '@inkline/inkline'
  import PageShell from '~/components/PageShell.vue'
  import CommentBox from '~/components/CommentBox.vue'
  import CommentList from '~/components/CommentList.vue'
  import { usePosts } from '~/assets/composables/usePosts'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)

  const route = useRoute()
  const toast = useToast()
  const { t } = useI18n()
  const { commentsLoading, getComments, getCommentsCount, getPost, loading } = usePosts()

  const post = await getPost(route.params.id)

  const totalComments = ref(0)
  const comments = ref([])
  const activePage = ref(1)

  const onCommentsPageChange = async ({ currentPage, startItem, endItem }) => {
    if(activePage.value !== currentPage) {
      activePage.value = currentPage
      comments.value = await getComments(route.params.id, startItem, endItem - 1)
      totalComments.value = await getCommentsCount(route.params.id)
    }
  }

  const onCommentPostSuccess = async () => {
    toast.show({
      title: t('supabase-forum.comments.toast.success.title'),
      message: t('supabase-forum.comments.toast.success.message'),
      color: 'success'
    })

    activePage.value = 1
    comments.value = await getComments(route.params.id)
    totalComments.value = await getCommentsCount(route.params.id)
  }

  const onCommentPostError = () => toast.show({
    title: t('supabase-forum.comments.toast.error.title'),
    message: t('supabase-forum.comments.toast.error.message'),
    color: 'danger'
  })

  totalComments.value = await getCommentsCount(route.params.id)
  comments.value = await getComments(route.params.id)
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-post-page {
  &__loader {
    @include loader();
  }

  &__title {
    @include title();
    margin-bottom: 40px;
  }

  &__info--category,
  &__author--name {
    @include eyebrow();

    font-weight: 500;
  }

  &__avatar {
    @include thumbnail($dimension: 50px);

    &--placeholder {
      height: 50px;
      margin-right: var(--media--image--margin-right, var(--margin-right));
      width: 50px;

      &-icon  {
        height: 48px;
        opacity: .5;
        width: 48px;
      }
    }
  }

  &__author {
    margin-bottom: 40px;

    &--name {
      margin-bottom: 4px;
    }
  }

  &__info {
    margin-bottom: 0;

    &--category {
      font-weight: 200;
    }
  }

  &__body {
    padding-bottom: 30px;
  }

  &__comments {
    &--box {
      margin-bottom: 30px;
    }

    &--title {
      @include titleLink();

      span {
        margin-left: 5px;
      }
    }
  }
}
</style>