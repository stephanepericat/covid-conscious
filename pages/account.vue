<template>
  <div class="sf-account-page">
    <h1
      class="sf-account-page__title"
      v-text="$t('forum.account.title')"
    />
    <template v-if="user">
      <Account
        class="sf-account-page__account"
        @error="onError"
        @success="onUpdateSuccess"
      />
      <IFormGroup class="sf-account-page__logout">
        <IButton
          link
          color="danger"
          @click.prevent="signOut"
        >
          Sign Out
        </IButton>
      </IFormGroup>
    </template>
  </div>
</template>
<script setup>
  import { useSignOut } from '../assets/composables/useSignOut'
  import { useToast } from '@inkline/inkline'
  import Account from '../components/UserAccount.vue'

  const toast = useToast()
  const user = useSupabaseUser()
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

.sf-account-page {
  &__title {
    @include title();
  }

  // &__account,
  // &__logout {
  //   width: 50%;
  // }

  &__account {
    margin: 40px 0;
  }

  &__logout {
    display: flex;
    justify-content: center;
  }
}
</style>
