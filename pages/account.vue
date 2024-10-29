<template>
  <div class="account-page">
    <h1
      class="account-page__title"
      v-text="$t('forum.account.title')"
    />
    <div v-if="user">
      <!-- <Account
        class="account-page__account"
        @error="onError"
        @success="onUpdateSuccess"
      /> -->
      <p className="text-center">{{ user.email }}</p>
      <IFormGroup class="account-page__logout">
        <IButton
          link
          color="danger"
          @click.prevent="signOut"
        >
          Sign Out
        </IButton>
      </IFormGroup>
    </div>
  </div>
</template>
<script setup>
  import { useSignOut } from '../assets/composables/useSignOut'
  import { useToast } from '@inkline/inkline'
  import Account from '../components/UserAccount.vue'

  const { user } = useUserSession()

  const toast = useToast()
  // const user = useSupabaseUser()
  const { t } = useI18n()
  const { onError, signOut } = useSignOut(user)

  const onUpdateSuccess = () => {
    toast.show({
      title: t('forum.auth.toast.update.title'),
      message: t('forum.auth.toast.update.message'),
      color: 'success'
    })
  }

  umTrackView()
</script>
<style lang="scss" scoped>
@import "../assets/sass/mixins.scss";

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
}
</style>
