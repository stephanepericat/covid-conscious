<script setup lang="ts">
import { useSignOut } from '@/composables/useSignOut'
import { useStatsig } from '@/composables/useStatsig'

defineProps<{
  loggedIn?: boolean
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const { signOut } = useSignOut()
const { statsig } = useStatsig()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="outline" size="icon" class="rounded-full">
        <Icon name="iconoir:profile-circle" :size="20" />
        <span class="sr-only">{{ t('layout.toggleUserMenu') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ t('layout.user.account') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <template v-if="loggedIn">
        <DropdownMenuItem v-if="statsig?.checkGate('bookmarks_enabled')">
          <NuxtLink :to="localePath('/bookmarks')">{{
            t('layout.user.bookmarks')
          }}</NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <NuxtLink :to="localePath('/user/account')">{{
            t('layout.user.settings')
          }}</NuxtLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="() => signOut()">
          {{ t('layout.user.signOut') }}
        </DropdownMenuItem>
      </template>
      <DropdownMenuItem v-else>
        <a href="/auth/auth0">{{ t('layout.user.signIn') }}</a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
