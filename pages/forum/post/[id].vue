<template>
  <div class="sf-post-page">
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
      <Meta name="og:title" :content="pageTitle" />
      <Meta name="og:description" :content="pageDescription" />
      <Meta name="twitter:title" :content="pageTitle" />
      <Meta name="twitter:description" :content="pageDescription" />
    </Head>

    <ILoader
      v-if="!post"
      class="sf-post-page__loader"
    />
    <template v-else>
      <h1
        class="sf-post-page__title"
        v-text="post.title"
      />
      <IMedia class="sf-post-page__author">
        <template #image>
          <div class="sf-post-page__avatar--placeholder" v-if="!avatar || isSSR">
            <Icon
              class="sf-post-page__avatar--placeholder-icon"
              name="material-symbols:account-circle-full"
            />
          </div>
          <img
            v-else-if="avatar && !isSSR"
            class="sf-post-page__avatar"
            :src="avatar"
          >
        </template>
        <h5 class="sf-post-page__author--name">
          <NuxtLink :to="localePath(`${rootPath}/user/${post.author.id}`)">
            @{{ post.author.profile.name || 'USER' }}
          </NuxtLink>
        </h5>
        <p class="sf-post-page__info">
          <span class="sf-post-page__info--category">
            <span v-if="post.categories.length">{{ $t(`forum.create.categories.${post.categories[0].name}`) }} / </span>{{ format(new Date(post.createdAt), LOCALIZED_DATE_FORMAT) }}
          </span>
        </p>
      </IMedia>
      <section class="sf-post-page__body">
        <div class="sf-post-page__body--contents" ref="postBody" v-html="post.content"></div>
        <a
          v-if="showTranslateButton"
          class="sf-post-page__translate--button"
          href="#"
          @click="onTranslateClick"
        >
          {{ $t('forum.post.translate') }} &raquo;
        </a>
        <ILoader v-else-if="isTranslating" size="sm" />
        <div v-else-if="showTranslation">
          <h5 class="sf-post-page__translate--label">{{ $t('forum.post.translation') }}</h5>
          <div v-html="translationResults.text" />
        </div>
      </section>
      <section class="sf-post-page__comments">
        <CommentBox
          class="sf-post-page__comments--box"
          :post-id="parseInt(route.params.id)"
          @error="onCommentPostError"
          @success="onCommentPostSuccess"
        />
        <h2 class="sf-post-page__comments--title">
          <Icon name="icon-park-outline:comments" />
          <span>{{ $t("forum.post.comments") }}</span>
        </h2>
        <CommentList
          :comments="comments.entries"
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
          <template #header>{{ $t('forum.comments.deletion.title') }}</template>
          <span>{{ $t('forum.comments.deletion.description') }}</span>
          <template #footer>
            <div class="sf-post-page__modal--footer">
              <IButton
                size="sm"
                @click="onDeleteCommentCancelled"
              >
                {{ $t('forum.comments.cancel') }}
              </IButton>
              <IButton
                size="sm"
                color="danger"
                class="sf-post-page__modal--footer-confirm"
                @click="onDeleteCommentConfirmed"
              >
                {{ $t('forum.comments.delete') }}
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
  import consola from 'consola'
  import { format } from 'date-fns'
  import { ILoader, useToast } from '@inkline/inkline'
  import CommentBox from '~/components/CommentBox.vue'
  import CommentList from '~/components/CommentList.vue'
  import { usePrisma } from '~/assets/composables/usePrisma'
  import { useTranslation } from '~/assets/composables/useTranslation'
  import { LOCALIZED_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { getGravatarUrl } from '~/assets/utils/gravatar'
  import { cleanPostBody } from '~/assets/utils/clean-post-body'

  const config = useRuntimeConfig()
  const rootPath = computed(() => config.public.forum.rootPath)

  const route = useRoute()
  const toast = useToast()
  const { t, locale, localeProperties } = useI18n()
  const { deleteComment, getPostComments, getPostById } = usePrisma()
  const isSSR = computed(() => !process.client)

  // const post = await getPost(route.params.id)
  const post = computedAsync(async () => await getPostById(route.params.id), null)
  const avatar = computedAsync(async () => post.value?.author?.email ? await getGravatarUrl(post.value.author.email) : null, null)
  const pageTitle = computed(() => post.value?.title || null)
  const pageDescription = computed(() => post.value ? cleanPostBody(post.value.content) : null)
  const postBody = ref(null)

  // const totalComments = ref(0)
  const comments = ref([])
  const commentsLoading = ref(true)
  // const comments = computed(() => post.value?.comments || [])
  const totalComments = computed(() => comments.value?.total || 0)
  const activePage = ref(1)

  const onCommentsPageChange = async ({ currentPage, startItem }) => {
    if(activePage.value !== currentPage) {
      activePage.value = currentPage
      commentsLoading.value = true
      comments.value = await getPostComments(route.params.id, startItem)
      commentsLoading.value = false
      // totalComments.value = await getCommentsCount(route.params.id)
    }
  }

  const onCommentPostSuccess = async () => {
    toast.show({
      title: t('forum.comments.toast.success.title'),
      message: t('forum.comments.toast.success.message'),
      color: 'success'
    })

    activePage.value = 1
    commentsLoading.value = true
    comments.value = await getPostComments(route.params.id)
    commentsLoading.value = false
    // comments.value = await getComments(route.params.id)
    // totalComments.value = await getCommentsCount(route.params.id)
  }

  const onCommentPostError = () => toast.show({
    title: t('forum.comments.toast.error.title'),
    message: t('forum.comments.toast.error.message'),
    color: 'danger'
  })

  const commentDeletionModalVisible = ref(false)
  const commentToDelete = ref(null)

  const onDeleteComment = ({ id, author }) => {
    // console.log(`deleting comment id: ${id}`)
    commentToDelete.value = { commentId: id, authorId: author?.id }
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
      title: t('forum.comments.toast.deletion.success.title'),
      message: t('forum.comments.toast.deletion.success.message'),
      color: 'success'
    })

    activePage.value = 1
    commentsLoading.value = true
    comments.value = await getPostComments(route.params.id)
    commentsLoading.value = false
    // comments.value = await getComments(route.params.id)
    // totalComments.value = await getCommentsCount(route.params.id)
  }

  const onCommentDeletionPostError = () => toast.show({
    title: t('forum.comments.toast.deletion.error.title'),
    message: t('forum.comments.toast.deletion.error.message'),
    color: 'danger'
  })

  // TRANSLATION
  const { translateText } = useTranslation()
  const isTranslating = ref(false)
  const translationResults = ref(null)
  const showTranslateButton = computed(() => postBody.value && !isTranslating.value && !translationResults.value)
  const showTranslation = computed(() => postBody.value && !isTranslating.value && translationResults.value)
  const needIso = ref(['en', 'pt'])
  const targetLanguage = computed(() => needIso.value.includes(locale.value) ? localeProperties.value.iso : locale.value)

  const onTranslateClick = async (e) => {
    e.preventDefault()

    try {
      isTranslating.value = true
      translationResults.value = await translateText(postBody.value.innerHTML, targetLanguage.value)
    } catch(e) {
      consola.error(e)
      translationResults.value = null
    } finally {
      isTranslating.value = false
    }
  }

  // totalComments.value = await getCommentsCount(route.params.id)
  // comments.value = await getComments(route.params.id)

  watch(locale, () => {
    translationResults.value = null
  })

  onMounted(async () => {
    comments.value = await getPostComments(route.params.id)
    commentsLoading.value = false
  })

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-post-page {
  &__loader {
    @include loader();

    display: flex;
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
      font-size: 14px;
      font-weight: 300;
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

  &__translate {
    &--button {
      font-weight: 500;
    }

    &--label {
      @include eyebrow()
    }
  }
}
</style>
<style>
.sf-post-page__body--contents a {
  color: var(--link--color, var(--color-primary-500)) !important;
}

.sf-post-page__body--contents a:hover {
  color: var(--link--color, var(--color-primary-600)) !important;
}
</style>