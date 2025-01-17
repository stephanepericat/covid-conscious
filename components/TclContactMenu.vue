<script setup lang="ts">
const localePath = useLocalePath()

const onClick = (linkName: string) =>
  umTrackEvent('click:contact', { linkName })
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="outline" size="icon" class="rounded-full">
        <Icon
          name="streamline:interface-edit-write-1-edit-edition-form-pen-text-write"
          :size="18"
        />
        <span class="sr-only">{{ $t('layout.toggleContactMenu') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ $t('layout.contactInfo') }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <NuxtLink
          :to="localePath('/contact-us')"
          @click="() => onClick('contact')"
          >{{ $t('layout.contactUs') }}</NuxtLink
        >
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NuxtLink
          :to="localePath('/contribute')"
          @click="() => onClick('contribute')"
          >{{ $t('layout.submitContent') }}</NuxtLink
        >
      </DropdownMenuItem>
      <DropdownMenuItem>
        <NuxtLink
          :to="localePath('/support')"
          @click="() => onClick('support')"
          >{{ $t('layout.support') }}</NuxtLink
        >
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
