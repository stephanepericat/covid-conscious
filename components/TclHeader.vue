<script setup lang="ts">
const localePath = useLocalePath()
const { loggedIn } = useUserSession()

const searchValue = ref('')
</script>

<template>
  <header
    class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[2] justify-between"
  >
    <nav
      class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
    >
      <NuxtLink :to="localePath('/')" class="min-w-[46px]">
        <TclLogo />
        <span class="sr-only">{{ $t('layout.tcl') }}</span>
      </NuxtLink>
      <TclTopNavigation :logged-in="loggedIn" />
    </nav>
    <TclMobileNavigation :logged-in="loggedIn" with-taco />
    <div class="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <!-- <TclSearchInput v-model="searchValue" /> -->
      <TclSearchbox class="min-w-[225px] lg:min-w-[350px]" />
      <TclModeToggle />
      <TclLocaleSwitch />
      <TclContactMenu />
      <TclUserMenu :logged-in="loggedIn" />
    </div>
  </header>
</template>
