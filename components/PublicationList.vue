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
            <img
              v-else-if="article.avatar"
              class="publication-list__thumbnail"
              :src="article.avatar"
            />
            <img
              v-else
              class="publication-list__thumbnail"
              src="/tcl-logo-big-grey.jpeg"
            />
          </template>
          <h4 class="publication-list__link">
            <NuxtLink
              :to="
                isExternalLink(article.type)
                  ? article.link
                  : localePath(article.path)
              "
              :target="isExternalLink(article.type) ? '_blank' : '_self'"
            >
              <span v-if="isNews(article.type) || isLibrary(article.type)"
                >{{ article.source }}: </span
              >{{ isBrand(article.type) ? article.name : article.title }}
            </NuxtLink>
          </h4>
          <div
            v-if="isEvent(article.type) && article.visual"
            class="publication-list__event--visual"
          >
            <NuxtLink :to="localePath(article.path)">
              <SanityImage
                :asset-id="article.visual"
                :alt="article.title"
                class="publication-list__event--visual-img"
              />
            </NuxtLink>
          </div>
          <p
            v-if="article.shortDescription"
            class="publication-list__description"
          >
            {{ article.shortDescription }}
          </p>
          <p
            v-if="showPublicationDate(article.type)"
            class="publication-list__date"
          >
            <span>{{
              format(
                new Date(
                  article.date ? convertTs(article.date) : article.published,
                ),
                LOCALIZED_DATE_FORMAT,
                { locale: getDateLocale(locale) },
              )
            }}</span>
            <span v-if="article.end">
              -
              {{
                format(
                  new Date(convertTs(article.end)),
                  LOCALIZED_DATE_FORMAT,
                  { locale: getDateLocale(locale) },
                )
              }}</span
            >
          </p>
          <em class="publication-list__metadata">
            <IBadge size="sm" v-if="isForum(article.type)">{{
              article.category
            }}</IBadge>
            <ul v-else class="publication-list__tags">
              <li
                v-if="article.onlineOnly"
                class="publication-list__tags--item locked"
              >
                <IBadge color="secondary" size="sm">
                  <Icon
                    class="publication-list__locked--badge-icon"
                    name="oui:online"
                  />
                  <span>{{ $t('article.online') }}</span>
                </IBadge>
              </li>
              <li
                v-if="article.free"
                class="publication-list__tags--item locked"
              >
                <IBadge color="secondary" size="sm">
                  <Icon
                    class="publication-list__locked--badge-icon"
                    name="material-symbols:free-cancellation-outline-rounded"
                  />
                  <span>{{ $t('article.free') }}</span>
                </IBadge>
              </li>
              <li
                v-if="article.limited"
                class="publication-list__tags--item locked"
              >
                <IBadge color="warning" size="sm">
                  <Icon
                    class="publication-list__locked--badge-icon"
                    name="line-md:alert-circle"
                  />
                  <span>{{ $t('article.limited') }}</span>
                </IBadge>
              </li>
              <li
                v-if="article.locked"
                class="publication-list__tags--item locked"
              >
                <ITooltip
                  size="sm"
                  placement="bottom"
                  class="publication-list__locked--tooltip"
                >
                  <IBadge
                    size="sm"
                    color="danger"
                    class="publication-list__locked--badge"
                  >
                    <Icon
                      class="publication-list__locked--badge-icon"
                      name="material-symbols:lock"
                    />
                    <span>{{ $t('article.locked') }}</span>
                  </IBadge>
                  <template #body>
                    <div
                      class="_xs:justify-content:center publication-list__locked--tooltip-label"
                    >
                      {{ $t('article.lockedDescription') }}
                    </div>
                  </template>
                </ITooltip>
              </li>
              <li
                v-for="{ uri, name } in article.tags"
                :key="uri"
                class="publication-list__tags--item"
              >
                <IBadge size="sm" @click="onTagClick({ uri })">{{
                  name
                }}</IBadge>
              </li>
              <li
                v-if="isEvent(article.type) && article.isEventFree"
                class="publication-list__tags--item locked"
              >
                <IBadge size="sm">{{ $t('article.free') }}</IBadge>
              </li>
            </ul>
            <template v-if="!isResource(article.type)">
              <span v-if="article.author">
                &bullet;
                <NuxtLink
                  :to="
                    localePath(
                      isForum(article.type)
                        ? `/${FORUM}/${USER}/${article.author.slug}`
                        : `/${AUTHOR}/${article.author.slug}`,
                    )
                  "
                  >{{ article.author.nickname }}</NuxtLink
                ></span
              >
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
import {
  isBrand,
  isEvent,
  isExternalLink,
  isDirectory,
  isForum,
  isLibrary,
  isNews,
  isResource,
  isVideo,
  isCovidnet,
  showPublicationDate,
} from '~/assets/utils/article-types'
import { convertTs } from '~/assets/utils/convert-timestamp'
import { AUTHOR, FORUM, USER } from '~/assets/constants/types'
import { LOCALIZED_DATE_FORMAT } from '~/assets/constants/date-formats'
import { useTags } from '~/assets/composables/useTags'
import { getDateLocale } from '~/assets/constants/date-locales'

const props = defineProps({
  hideThumbnail: Boolean,
  items: { type: Array, default: [] },
  itemsPerPage: { type: Number, default: 5 },
  total: { type: Number, default: 0 },
  withPagination: Boolean,
})

const { locale } = useI18n()
const localePath = useLocalePath()
const { onTagClick } = useTags()

const currentPage = defineModel('currentPage')
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';
@import '~/assets/sass/mixins.scss';

.publication-list {
  &__date {
    font-weight: 500;
    letter-spacing: 0.1rem;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  &__description {
    margin-bottom: 5px;

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
        margin-right: 3px;
        vertical-align: top !important;
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

  &__event {
    &--visual {
      margin: 15px auto;

      &-img {
        width: 100%;
        height: auto;
      }
    }
  }

  @include breakpoint-down('md') {
    &__thumbnail {
      display: none;
    }
  }
}
</style>
