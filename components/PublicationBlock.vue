<template>
  <div :class="`grid xl:grid-cols-2 gap-x-8 gap-y-8`">
    <Card
      :date="top.date"
      :description="top.summary"
      :tags="top.tags"
      :target="target"
      :title="top.title"
      :url="top.link || localePath(top.path)"
      :visual="top.thumbnail"
    />
    <div class="grid gap-4">
      <Media
        v-for="item in others"
        :key="item.id"
        :date="item.date"
        :tags="item.tags"
        :target="target"
        :title="item.title"
        :url="item.link || localePath(item.path)"
      />
    </div>
  </div>
</template>
<script setup>
  import Card from '~/components/Card.vue'
  import Media from '~/components/Media.vue'

  const props = defineProps({
    publications: { type: Array, default: [] },
    target: { type: String, default: null },
  })

  const localePath = useLocalePath()

  const top = computed(() => props.publications[0])
  const others = computed(() => props.publications.slice(1))
</script>