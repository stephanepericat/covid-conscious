<template>
  <div class="publication-list">
    <IListGroup size="sm" :border="false">
      <IListGroupItem v-for="article in items">
        <IMedia>
          <template v-if="!hideThumbnail" #image>
            <SanityImage
              v-if="article.thumbnail"
              class="publication-list__thumbnail"
              :asset-id="article.thumbnail"
              fit="crop"
              crop="entropy"
              :h="80"
              :w="80"
            />
            <img v-else-if="article.avatar" class="publication-list__avatar" :src="article.avatar" />
            <img v-else class="publication-list__thumbnail" src="/tcl-logo-big-grey.jpeg" />
          </template>
          <h4
            class="publication-list__link"
          >
            <NuxtLink
              :to="isExternalLink(article.type) ? article.link : localePath(article.path)"
              :target="isExternalLink(article.type) ? '_blank' : '_self'"
            >
              <span v-if="isNews(article.type) || isLibrary(article.type)">{{ article.source }}: </span>{{ article.title }}
            </NuxtLink>
          </h4>
          <p
            v-if="(isResource(article.type) || isLibrary(article.type)  || isVideo(article.type)) && article.summary"
            class="publication-list__description"
            :class="{ 'no-margin': isLibrary(article.type) || isVideo(article.type) || isResource(article.type) }"
          >
            {{ article.summary }}
          </p>
          <em class="publication-list__metadata">
            <IBadge size="sm" v-if="isForum(article.type)">{{ article.category }}</IBadge>
            <ul v-else class="publication-list__tags">
              <li v-if="article.locked" class="publication-list__tags--item locked">
                <ITooltip size="sm" placement="bottom" class="publication-list__locked--tooltip">
                  <IBadge size="sm" color="danger" class="publication-list__locked--badge">
                    <Icon
                      class="publication-list__locked--badge-icon"
                      name="material-symbols:lock"
                    />
                    <span>{{ $t('article.locked') }}</span>
                  </IBadge>
                  <template #body>
                    <div class="_xs:justify-content:center publication-list__locked--tooltip-label">
                      {{ $t('article.lockedDescription') }}
                    </div>
                  </template>
                </ITooltip>
              </li>
              <li v-for="{ uri, name } in article.tags" :key="uri" class="publication-list__tags--item">
                <IBadge size="sm" @click="onTagClick({ uri })">{{ name }}</IBadge>
              </li>
            </ul>
            <template v-if="!isResource(article.type)">
              <span v-if="article.author"> &bullet; <NuxtLink :to="localePath(isForum(article.type) ? `/${FORUM}/${USER}/${article.author.slug}` : `/${AUTHOR}/${article.author.slug}`)">{{ article.author.nickname }}</NuxtLink></span>
              <span> &bullet; {{ format(new Date(article.date ? convertTs(article.date) : article.published), DEFAULT_DATE_FORMAT) }}</span>
            </template>
          </em>
        </IMedia>
      </IListGroupItem>
    </IListGroup>
    <IPagination
      v-if="withPagination"
      v-model="currentPage"
      class="publication-list__pagination"
      :items-total="total"
      :items-per-page="itemsPerPage"
    />
  </div>
</template>
<script setup>
  import { format } from 'date-fns'
  import { isExternalLink, isForum, isLibrary, isNews, isResource, isVideo } from '~/assets/utils/article-types'
  import { convertTs } from '~/assets/utils/convert-timestamp'
  import { AUTHOR, FORUM, USER } from '~/assets/constants/types'
  import { DEFAULT_DATE_FORMAT } from '~/assets/constants/date-formats'
  import { useTags } from '~/assets/composables/useTags'

  const props = defineProps({
    hideThumbnail: Boolean,
    items: { type: Array, default: [] },
    itemsPerPage: { type: Number, default: 5 },
    total: { type: Number, default: 0},
    withPagination: Boolean,
  })

  const localePath = useLocalePath()
  const { onTagClick } = useTags()

  const currentPage = defineModel('currentPage')
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import "~/assets/sass/mixins.scss";

.publication-list {
  &__description {
    &.no-margin {
      margin: 0;
    }
  }

  &__link {
    @include titleLink();

    margin-bottom: 5px;
  }

  &__avatar,
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
      @include eyebrow();

      cursor: pointer;
      display: inline-block;
      font-style: normal;
      margin-right: 5px;

      &:last-of-type {
        margin-right: 1px;
      }

      &.locked {
        cursor: default;
      }
    }
  }

  &__locked {
    &--badge {
      &-icon {
        height: 0.7em;
        width: 0.7em;
        margin-right: 3px;
        vertical-align: initial !important;
      }
    }

    &--tooltip {
      &-label {
        letter-spacing: normal;
        text-transform: none;
        white-space: normal;
        width: 140px;
      }
    }
  }
}
</style>