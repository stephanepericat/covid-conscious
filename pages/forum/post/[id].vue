<template>
  <div class="sf-post-page">
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
          <div class="sf-post-page__avatar--placeholder" v-if="!post.avatar || isSSR">
            <Icon
              class="sf-post-page__avatar--placeholder-icon"
              name="material-symbols:account-circle-full"
            />
          </div>
          <img
            v-else-if="post.avatar && !isSSR"
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
          @delete-comment="onDeleteComment"
          @page-change="onCommentsPageChange"
        />
        <IModal
        class="sf-post-page__modal"
          v-model="commentDeletionModalVisible"
          :close-on-press-escape="false"
          :hide-on-click-outside="false"
          :show-close="false"
        >
          <template #header>{{ $t('supabase-forum.comments.deletion.title') }}</template>
          <span>{{ $t('supabase-forum.comments.deletion.description') }}</span>
          <template #footer>
            <div class="sf-post-page__modal--footer">
              <IButton
                size="sm"
                @click="onDeleteCommentCancelled"
              >
                {{ $t('supabase-forum.comments.cancel') }}
              </IButton>
              <IButton
                size="sm"
                color="danger"
                class="sf-post-page__modal--footer-confirm"
                @click="onDeleteCommentConfirmed"
              >
                {{ $t('supabase-forum.comments.delete') }}
              </IButton>
            </div>
          </template>
        </IModal>
      </section>
    </template>
    <IToastContainer />
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useToast } from '@inkline/inkline'
  import CommentBox from '~/components/CommentBox.vue'
  import CommentList from '~/components/CommentList.vue'
  import { usePosts } from '~/assets/composables/usePosts'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.supabaseForum.rootPath)

  const route = useRoute()
  const toast = useToast()
  const { t } = useI18n()
  const { commentsLoading, deleteComment, getComments, getCommentsCount, getPost, loading } = usePosts()
  const isSSR = computed(() => !process.client)

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

  const commentDeletionModalVisible = ref(false)
  const commentToDelete = ref(null)

  const onDeleteComment = ({ id }) => {
    console.log(`deleting comment id: ${id}`)
    commentToDelete.value = id
    commentDeletionModalVisible.value = true
  }

  const onDeleteCommentCancelled = () => {
    commentToDelete.value = null
    commentDeletionModalVisible.value = false
  }

  const onDeleteCommentConfirmed = async (id) => {
    try {
      const deleted = await deleteComment(commentToDelete.value)
      if(!deleted) throw new Error('Unable to delete comment')
      onCommentDeletionPostSuccess()
    } catch (e) {
      onCommentDeletionPostError()
    } finally {
      onDeleteCommentCancelled()
    }
  }

  const onCommentDeletionPostSuccess = async () => {
    toast.show({
      title: t('supabase-forum.comments.toast.deletion.success.title'),
      message: t('supabase-forum.comments.toast.deletion.success.message'),
      color: 'success'
    })

    activePage.value = 1
    comments.value = await getComments(route.params.id)
    totalComments.value = await getCommentsCount(route.params.id)
  }

  const onCommentDeletionPostError = () => toast.show({
    title: t('supabase-forum.comments.toast.deletion.error.title'),
    message: t('supabase-forum.comments.toast.deletion.error.message'),
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

  &__modal {
    &--footer {
      display: flex;
      justify-content: flex-end;

      &-confirm {
        margin-left: 10px;
      }
    }
  }
}
</style>