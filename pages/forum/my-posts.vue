<template>
  <div class="sf-my-posts-page">
    <h1
      class="sf-my-posts-page__title"
      v-text="$t('forum.posts.title')"
    />
    <!-- <p>{{  posts.entries }}</p> -->
    <ILoader v-if="loading || reloading" class="sf-my-posts-page__loader" size="sm" />
    <p v-else-if="!loading && !reloading && !posts.entries?.length" v-text="$t('forum.posts.noPosts')" />
    <template v-else>
      <p v-text="$t(`forum.posts.description`)" />
      <div class="sf-my-posts-page__tools">
        <p
          class="sf-my-posts-page__tools--counter"
          v-text="$t('forum.list.description', { start, end, total })"
        />
        <div class="sf-my-posts-page__tools--actions">
          <IButton
            :disabled="selectedNone"
            :color="selectedNone ? 'light' : 'danger'"
            @click="showConfirmation = true"
          >
            <template #icon>
              <Icon name="material-symbols:auto-delete-outline-rounded" />
            </template>
            {{ $t('forum.posts.buttonLabel', { amount: selection.length }) }}
          </IButton>
        </div>
      </div>
      <ITable class="sf-my-posts-page__table">
        <thead>
          <tr>
            <th class="sf-my-posts-page__table--selection">
              <ICheckbox
                size="lg"
                :indeterminate="selectedSome"
                :modelValue="selectedAll"
                @change="onMultiSelection"
              />
            </th>
            <th class="sf-my-posts-page__table--flex" v-text="$t(`forum.posts.table.title`)" />
            <th class="sf-my-posts-page__table--fixed" v-text="$t(`forum.posts.table.topic`)" />
            <th class="sf-my-posts-page__table--fixed" v-text="$t(`forum.posts.table.published`)" />
          </tr>
        </thead>
        <tbody class="sf-my-posts-page__table--body">
          <tr v-for="post in posts.entries" :key="post.id">
            <td class="sf-my-posts-page__table--body-selection">
              <ICheckbox
                size="lg"
                :modelValue="isChecked(post.id)"
                @change="(e) => onSelection(e.target, post.id)"
              />
            </td>
            <td>{{ post.title }}</td>
            <td v-if="post.categories.length > 0">{{ $t(`forum.create.categories.${post.categories[0].name}`) }}</td>
            <td>{{ format(new Date(post.createdAt), DEFAULT_DATE_FORMAT) }}</td>
          </tr>
        </tbody>
      </ITable>
      <IPagination
        v-if="total > itemsPerPage"
        v-model="currentPage"
        class="sf-my-posts-page__pagination"
        :items-total="total"
        :items-per-page="itemsPerPage"
        @update:modelValue="onPageChange"
      />
      <IModal v-model="showConfirmation">
        <template #header>{{ $t('forum.posts.modal.title') }}</template>
        <p v-text="$t('forum.posts.modal.description', { amount: selection.length })" />
        <strong v-text="$t('forum.posts.modal.confirmation')" />
        <template #footer>
          <div class="sf-my-posts-page__modal--footer">
            <IButton class="sf-my-posts-page__modal--footer-action" @click="showConfirmation = false">
              {{ $t('forum.posts.modal.buttons.cancel') }}
            </IButton>
            <IButton class="sf-my-posts-page__modal--footer-action" color="danger" @click="onDelete">
              {{ $t('forum.posts.modal.buttons.confirm') }}
            </IButton>
          </div>
        </template>
      </IModal>
    </template>
    <IToastContainer />
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { useToast } from '@inkline/inkline'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { usePagination } from '~/assets/composables/usePagination'
  // import { usePosts } from '~/assets/composables/usePosts'
  import { usePrisma } from '~/assets/composables/usePrisma'

  const { t } = useI18n()
  const { deletePosts, getUser, getUserPosts } = usePrisma()
  // const user = useSupabaseUser()
  const { user } = useUserSession()
  const userInfo = computedAsync(
    async () =>
      user?.value?.email ? await getUser(user.value.email) : null,
    null,
  )

  const { currentPage, itemsPerPage, startItem, endItem } = usePagination()

  // const total = ref(0)

  const start = computed(() => startItem.value + 1)
  const end = computed(() => endItem.value > total ? total : endItem.value)
  const loading = ref(true)

  // const {
    // deleteUserPosts,
    // getUserPosts,
    // getUserPostsCount,
    // loading,
  // } = usePosts()

  const posts = ref([])
  const total = computed(() => posts.value?.total || 0)
  const selection = ref([]);

  const selectedNone = computed(() => selection.value.length === 0)
  const selectedSome = computed(() => selection.value.length > 0 && selection.value.length < itemsPerPage.value)
  const selectedAll = computed(() => selection.value.length === itemsPerPage.value)

  const onSelection = ({ checked }, postId) => {
    if(checked) {
      selection.value = [...selection.value, postId]
    } else {
      selection.value = selection.value.filter((id) => id !== postId)
    }
  }

  const onMultiSelection = ({ target }) => {
    if(target.checked) {
      selection.value = posts.value.entries.map((p) => p.id)
    } else {
      selection.value = []
    }
  }

  const isChecked = (postId) => selection.value.includes(postId)

  const showConfirmation = ref(false)
  const reloading = ref(false)

  const onDelete = async () => {
    try {
      const payload = {
        authorId: userInfo.value?.id,
        posts: Object.values(selection.value)
      } 
      console.log('selected post ids', payload)
      const deleted = await deletePosts(payload)

      if (!deleted) throw new Error("Not deleted")

      onDeleteSuccess()

      reloading.value = true
      currentPage.value = 1
      selection.value = []
      // total.value = await getUserPostsCount()
      posts.value = await getUserPosts(user.value.email)
    } catch(e) {
      console.error(e)
      onDeleteError()
    } finally {
      showConfirmation.value = false
      reloading.value = false
    }
  }

  const toast = useToast()

  const onDeleteSuccess = async () => toast.show({
    title: t('forum.posts.toast.success.title'),
    message: t('forum.posts.toast.success.message'),
    color: 'success'
  })

  const onDeleteError = () => toast.show({
    title: t('forum.posts.toast.error.title'),
    message: t('forum.posts.toast.error.message'),
    color: 'danger'
  })

  const onPageChange = async () => {
    loading.value = true

    try {
      
      posts.value = await getUserPosts(userInfo.value?.id, startItem.value)
    selection.value = []
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // total.value = await getUserPostsCount()
  // posts.value = await getUserPosts(userInfo.value?.id, 0, 4)

  onMounted(async () => {
    if(!user.value?.email) {
      return
    }

    try {
      posts.value = await getUserPosts(user.value.email)
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  })

  umTrackView()
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";

.sf-my-posts-page {
  &__title {
    @include title();
  }

  &__loader {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    width: 100%;
  }

  &__tools {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &--counter {
      align-items: center;
      display: flex;
      margin: 0;
    }
  }

  &__table {
    &--fixed {
      width: 145px;
    }

    &--flex {
      width: auto;
    }

    &--selection {
      width: 20px;
    }
  }

  &__pagination {
    justify-content: center;
    margin-top: 20px;
  }

  &__modal {
    &--footer {
      display: flex;
      justify-content: flex-end;

      &-action {
        margin-left: 10px;
      }
    }
  }
}
</style>