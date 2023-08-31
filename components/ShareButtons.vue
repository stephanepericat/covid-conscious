<template>
  <div class="share-buttons">
    <ShareNetwork network="facebook" :url="url" :title="title" :hashtags="hashtag">
      <Icon name="logos:facebook"></Icon>
    </ShareNetwork>
    <ShareNetwork network="reddit" :url="url" :title="title">
      <Icon name="logos:reddit-icon"></Icon>
    </ShareNetwork>
    <ShareNetwork network="pinterest" :url="url" :title="title">
      <Icon name="logos:pinterest"></Icon>
    </ShareNetwork>
    <ShareNetwork network="telegram" :url="url" :title="title">
      <Icon name="logos:telegram"></Icon>
    </ShareNetwork>
    <ShareNetwork network="twitter" :url="url" :title="title" :hashtags="hashtag">
      <Icon name="logos:twitter"></Icon>
    </ShareNetwork>
    <ShareNetwork network="whatsapp" :url="url" :title="title">
      <Icon name="logos:whatsapp-icon"></Icon>
    </ShareNetwork>
    <ShareNetwork network="email" :url="url" :title="title">
      <Icon name="material-symbols:mail-outline-rounded"></Icon>
    </ShareNetwork>
  </div>
</template>
<script setup>
  defineProps({
    title: { type: String, required: true },
    url: { type: String, required: true },
    hashtag: { type: String, default: null },
  })
</script>
<style lang="scss" scoped>
  .share-buttons {
    display: flex;
    flex-direction: column;
    font-size: 24px;
    height: 100%;
    justify-content: center;
    left: 15px;
    position: fixed;
    top: 0;
    z-index: 999;
  }
</style>