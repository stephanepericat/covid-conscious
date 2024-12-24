<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header
    className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[2] justify-between"
  >
    <nav
      className="hidden flex-col space-x-6 text-lg font-medium md:flex md:flex-row md:items-center md:space-x-5 md:text-sm lg:space-x-6"
    >
      <NuxtLink :to="localePath('/')" className="min-w-[46px]">
        <TclLogo />
        <span className="sr-only">{{ $t('layout.tcl') }}</span>
      </NuxtLink>
      <!-- <TopNavigation loggedIn={loggedIn} /> -->
    </nav>
    <!-- <MobileNavigation /> -->
    <div
      className="flex items-center space-x-4 md:ml-auto md:space-x-2 lg:space-x-4"
    >
      <!-- <SearchInput /> -->
      <TclModeToggle />
      <!-- <LocaleSwitch />
      <ContactMenu />
      <UserMenu loggedIn={loggedIn} /> -->
      <a href="/auth/auth0">Login</a>
    </div>
  </header>
</template>
