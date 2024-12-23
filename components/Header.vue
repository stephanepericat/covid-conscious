<script setup lang="ts"></script>

<template>
  <header
    className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[2]"
  >
    <nav
      className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
    >
      <Link href="/" className="min-w-[46px]">
        <!-- <Logo />
        <span className="sr-only">{t('app.title')}</span> -->
      </Link>
      <!-- <TopNavigation loggedIn={loggedIn} /> -->
    </nav>
    <!-- <MobileNavigation /> -->
    <div
      className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4"
    >
      <!-- <SearchInput />
      <ModeToggle />
      <LocaleSwitch />
      <ContactMenu />
      <UserMenu loggedIn={loggedIn} /> -->
      <a href="/auth/auth0">Login</a>
    </div>
  </header>
</template>
