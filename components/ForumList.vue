<template>
  <div class="forum-list">
    <IListGroup size="sm" :border="false">
      <IListGroupItem v-for="post in formattedPosts" :key="post.id">
        <PostPreview
          :hide-thumbnail="hideThumbnail"
          :post="post"
          :root-path="rootPath"
          :ssr="ssr"
          with-preview
        />
      </IListGroupItem>
    </IListGroup>
  </div>
</template>
<script setup>
  import PostPreview from '~/components/PostPreview.vue'
  import { getGravatarUrl } from '~/assets/utils/gravatar';

  const props = defineProps({
    hideThumbnail: Boolean,
    posts: { type: Array, default: [] },
    rootPath: { type: String, required: true },
    ssr: Boolean,
  })

  const { posts: rawPosts } = toRefs(props)

  const formattedPosts = computedAsync(async() => {
    if(!rawPosts.value) {
      return []
    }

    const emails = rawPosts.value.map(({ author }) => author.email)
    const thumbnails = await Promise.all(
      emails.map((email) => new Promise(async (resolve) => {
        const avatar = await getGravatarUrl(email)
        resolve([email, avatar])
      }))
    );

    const thumbnailMap = thumbnails.reduce((acc, val) => {
      const [email, avatar] = val;

      if(!acc[email]) {
        acc[email] = avatar
      }

      return acc
    }, {})

    return rawPosts
      .value
      .map(({ author, categories, content, createdAt, id, title }) => {
        return {
          id,
          author: {
            id: author.id,
            username: author.profile?.name || 'USER',
          },
          description: content ? content.substr(0, 255) : null,
          published: createdAt,
          tags: categories || [],
          thumbnail: thumbnailMap[author.email] || null,
          title,
        }
      })
  }, [])
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.forum-list {
  &__description {
    &.no-margin {
      margin: 0;
    }
  }

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__thumbnail {
    @include thumbnail();
  }

  &__pagination {
    @include pagination();
  }

  &__metadata {
    display: block;
    margin-top: 5px;
  }

  &__tags {
    display: inline;
    list-style: none;
    margin: 0;
    padding: 0;

    &--item {
      cursor: pointer;
      display: inline-block;
      font-style: normal;
      margin-right: 5px;

      &:last-of-type {
        margin-right: 1px;
      }
    }
  }

  &__forum-tag {
    font-style: normal;
  }
}
</style>