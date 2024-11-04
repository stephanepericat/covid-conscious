<script setup>
  import isURL from 'validator/lib/isURL'
  import { useSignOut } from '~/assets/composables/useSignOut'
  import { ITooltip, useToast } from '@inkline/inkline'
  // import Account from '../components/UserAccount.vue'
  import { usePrisma } from '~/assets/composables/usePrisma'
  import { getGravatarUrl } from '~/assets/utils/gravatar'
  import { useForm } from '@inkline/inkline/composables'

  const { form, schema } = useForm({
    bio: {
      validators: [{ name: 'maxLength', value: 512 }],
    },
    name: {
      validators: [
        { name: 'required' },
        { name: 'alphanumeric' },
        { name: 'minLength', value: 5 },
      ],
    },
    website: {
      validators: [
        {
          name: 'custom',
          message: 'Please enter a valid URL.',
          validator: (value) => {
            if (!value) return true
            return isURL(value)
          },
        },
      ],
    },
  })

  const { getOrCreateUser } = usePrisma()

  const { user } = useUserSession()
  const userInfo = computedAsync(
    async () =>
      user?.value?.email ? await getOrCreateUser(user.value.email) : null,
    null,
  )

  const avatar = computedAsync(
    async () =>
      user?.value?.email ? await getGravatarUrl(user.value.email) : null,
    null,
  )

  const toast = useToast()
  // const user = useSupabaseUser()
  const { t } = useI18n()
  const { onError, signOut } = useSignOut(user)
  const loading = ref(false)

  const onUpdateSuccess = () => {
    toast.show({
      title: t('forum.auth.toast.update.title'),
      message: t('forum.auth.toast.update.message'),
      color: 'success',
    })
  }

  const onSubmit = () => {
    const payload = {
      ...form.value,
      id: userInfo?.value.profile?.id,
      userId: userInfo?.value?.id,
    }
    console.log('submit', payload)
  }

  watch(
    userInfo,
    () => {
      const { profile = null } = userInfo.value || {}

      if (profile) {
        schema.value.bio.value = profile.bio || ''
        schema.value.name.value = profile.name || ''
        schema.value.website.value = profile.website || ''
      }
    },
    { immediate: true },
  )

  umTrackView()
</script>

<template>
  <div class="account-page">
    <h1 class="account-page__title" v-text="$t('forum.account.title')" />
    <div v-if="user" class="flex flex-col">
      <!-- <Account
        class="account-page__account"
        :info="userInfo"
        @error="onError"
        @success="onUpdateSuccess"
      /> -->
      <!-- <UserProfile v-if="userInfo" :info="userInfo" /> -->
      <IForm v-if="userInfo" v-model="schema" class="my-12" @submit="onSubmit">
        <div class="flex flex-row mb-8">
          <ITooltip placement="top" size="sm" interactable>
            <NuxtLink href="https://gravatar.com" target="_blank">
              <NuxtImg :src="avatar" class="w-[120px] h-[120px] rounded-full" />
            </NuxtLink>
            <template #body>
              <div class="max-w-[120px] whitespace-normal">
                {{ $t("forum.account.labels.avatar") }} <a href="https://gravatar.com" target="_blank">gravatar.com</a>
              </div>
            </template>
          </ITooltip>
          <div class="ml-6 flex-grow flex flex-col justify-center">
            <h4
              class="text-sm md:text-xl font-bold uppercase tracking-widest mb-4 text-ellipsis overflow-hidden max-w-[230px] md:max-w-[400px]"
            >
              {{ userInfo.email }}
            </h4>
            <IFormGroup>
              <IInput
                type="text"
                name="name"
                :placeholder="$t('forum.account.labels.username')"
              >
                <template #prefix>@</template>
              </IInput>
              <IFormError for="name" />
            </IFormGroup>
          </div>
        </div>
        <IFormGroup>
          <IFormLabel for="bio">{{
            $t('forum.account.labels.about')
          }}</IFormLabel>
          <ITextarea name="bio" />
          <IFormError for="bio" />
        </IFormGroup>
        <IFormGroup class="pt-4">
          <IFormLabel for="website">{{
            $t('forum.account.labels.website')
          }}</IFormLabel>
          <IInput type="text" name="website">
            <template #prepend>
              <span>https://</span>
            </template>
          </IInput>
          <IFormError for="website" />
        </IFormGroup>
        <IFormGroup class="pt-8">
          <IButton
            type="submit"
            block
            :disabled="!schema.dirty || !schema.valid || loading"
          >
            <Icon v-if="loading" name="eos-icons:loading" />
            {{ $t('forum.account.labels.update') }}
          </IButton>
        </IFormGroup>
      </IForm>
      <ILoader v-else class="account-page__loader" />
      <IFormGroup class="account-page__logout">
        <IButton link color="danger" @click.prevent="signOut">
          Sign Out
        </IButton>
      </IFormGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/sass/mixins.scss';

.account-page {
  margin: 0 auto;
  max-width: 34rem;

  &__title {
    @include title();

    text-align: center;
  }

  &__account {
    margin: 40px 0;
  }

  &__logout {
    display: flex;
    justify-content: center;
  }

  &__loader {
    @include loader();
  }
}
</style>
