<script setup lang="ts">
const { locale } = useI18n()
</script>

<template>
  <div class="home-page">
    <Head>
      <Title>{{ $t('layout.home') }}</Title>
      <Meta name="description" :content="$t('layout.description')" />
      <Meta name="og:title" :content="$t('layout.home')" />
      <Meta name="og:description" :content="$t('layout.description')" />
      <Meta name="og:image" content="/tcl-fallback-169.jpg" />
      <Meta name="og:image:secure_url" content="/tcl-fallback-169.jpg" />
      <Meta name="og:image:type" content="image/jpeg" />
      <Meta name="og:image:alt" :content="$t('layout.home')" />
      <Meta name="og:locale" :content="locale" />
      <Meta name="og:site_name" :content="$t('layout.tcl')" />
      <Meta name="twitter:title" :content="$t('layout.home')" />
      <Meta name="twitter:description" :content="$t('layout.description')" />
      <Meta name="twitter:image" content="/tcl-fallback-169.jpg" />
      <Meta name="twitter:site" content="@thatcovidlife" />
      <Meta name="twitter:card" content="summary_large_image" />
    </Head>

    <h1 class="font-title text-5xl font-bold uppercase">
      Home Page {{ $t('layout.tcl') }}
    </h1>
    <Button>Click me!</Button>
  </div>
</template>
