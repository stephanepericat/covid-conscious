<script setup lang="ts">
const localePath = useLocalePath()
const { loggedIn } = useUserSession()
</script>

<template>
  <header
    class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[2] justify-between"
  >
    <nav
      class="hidden flex-col space-x-6 text-lg font-medium md:flex md:flex-row md:items-center md:space-x-5 md:text-sm lg:space-x-6"
    >
      <NuxtLink :to="localePath('/')" class="min-w-[46px]">
        <TclLogo />
        <span class="sr-only">{{ $t('layout.tcl') }}</span>
      </NuxtLink>
      <!-- <TopNavigation loggedIn={loggedIn} /> -->
    </nav>
    <!-- <MobileNavigation /> -->
    <div
      class="flex items-center space-x-4 md:ml-auto md:space-x-2 lg:space-x-4"
    >
      <!-- <SearchInput /> -->
      <TclModeToggle />
      <!-- <LocaleSwitch />
      <ContactMenu /> -->
      <TclUserMenu :logged-in="loggedIn" />
      <!-- <a href="/auth/auth0">Login</a> -->
    </div>
  </header>
</template>
