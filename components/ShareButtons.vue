<template>
  <div class="share-buttons">
    <ShareNetwork network="facebook" :url="url" :title="title" :hashtags="hashtag">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:facebook"></Icon>
        <template #body>{{ $t('article.share.facebook') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="pinterest" :url="url" :title="title">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:pinterest"></Icon>
        <template #body>{{ $t('article.share.pinterest') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="reddit" :url="url" :title="title">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:reddit-icon"></Icon>
        <template #body>{{ $t('article.share.reddit') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="telegram" :url="url" :title="title">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:telegram"></Icon>
        <template #body>{{ $t('article.share.telegram') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="twitter" :url="url" :title="title" :hashtags="hashtag">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:twitter"></Icon>
        <template #body>{{ $t('article.share.twitter') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="whatsapp" :url="url" :title="title">
      <ITooltip size="sm" placement="right">
        <Icon name="logos:whatsapp-icon"></Icon>
        <template #body>{{ $t('article.share.whatsapp') }}</template>
      </ITooltip>
    </ShareNetwork>
    <ShareNetwork network="email" :url="url" :title="title">
      <ITooltip size="sm" placement="right">
        <Icon name="material-symbols:mail-outline-rounded"></Icon>
        <template #body>{{ $t('article.share.mail') }}</template>
      </ITooltip>
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