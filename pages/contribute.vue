<template>
  <div class="contribute-page">
    <h1 class="contribute-page__title" v-text="$t('contribute.title')" />

    <template v-if="sent">
      <p>{{ $t('contribute.sent') }}</p>
      <NuxtLink :to="localePath('/')">{{ $t('contribute.back') }} &raquo;</NuxtLink>
    </template>

    <template v-else>
      <p v-text="$t('contribute.description')" />
      <IForm class="contribute-page__form" v-model="form" @submit="onSubmit">
        <IFormGroup required>
          <IFormLabel>{{ $t('contribute.labels.name') }}</IFormLabel>
          <IInput name="from_name" :placeholder="$t('contribute.placeholders.name')" :error="['invalid']" />
          <IFormError for="from_name" :visible="['invalid']" />
        </IFormGroup>
        <IFormGroup required>
          <IFormLabel>{{ $t('contribute.labels.email') }}</IFormLabel>
          <IInput name="email" :placeholder="$t('contribute.placeholders.email')" :error="['invalid']" />
          <IFormError for="email" :visible="['invalid']" />
        </IFormGroup>
        <IFormGroup required>
          <IFormLabel>{{ $t('contribute.labels.category') }}</IFormLabel>
          <ISelect name="category" :options="categories" :placeholder="$t('contribute.placeholders.category')" :error="['invalid']" />
          <IFormError for="category" :visible="['invalid']" />
        </IFormGroup>
        <IFormGroup required>
          <IFormLabel>{{ $t('contribute.labels.description') }}</IFormLabel>
          <ITextarea name="description" :placeholder="$t('contribute.placeholders.description')" :error="['invalid']" />
          <IFormError for="description" :visible="['invalid']" />
        </IFormGroup>
        <IFormGroup>
          <IFormLabel>{{ $t('contribute.labels.link') }}</IFormLabel>
          <IInput name="link" :placeholder="$t('contribute.placeholders.link')" :error="['invalid']" />
          <IFormError for="link" :visible="['invalid']" />
        </IFormGroup>
        <IFormGroup>
          <NuxtTurnstile class="contribute-page__captcha" v-model="token" />
        </IFormGroup>
        <IFormGroup>
          <IButton type="submit" :disabled="buttonDisabled">
            <Icon class="contribute-page__loading" name="eos-icons:loading" v-if="isSubmitting" />
            <template v-else>
              {{ $t('contribute.labels.submit') }}
            </template>
          </IButton>
        </IFormGroup>
      </IForm>
    </template>

    <IToastContainer />
  </div>
</template>
<script setup>
  import { useForm, useToast } from '@inkline/inkline'
  import { urlValidator } from '~/assets/utils/url-validator'
  import { COMMUNITY, NEWS, PRODUCT } from '~/assets/constants/types'

  const { t } = useI18n()
  const localePath = useLocalePath()
  const toast = useToast()

  const categories = [
    { id: COMMUNITY, label: t(`layout.${COMMUNITY}`) },
    { id: NEWS, label: t(`layout.${NEWS}`) },
    { id: PRODUCT, label: t(`layout.${PRODUCT}`) },
  ]

  const form = useForm({
    category: {
      validators: [
        {
          message: t('contribute.errors.category.required'),
          name: 'required',
        },
      ],
      value: '',
    },
    description: {
      validators: [
        {
          message: t('contribute.errors.description.required'),
          name: 'required',
        },
        {
          message: t('contribute.errors.description.min'),
          name: 'minLength',
          value: 20,
        },
      ],
      value: '',
    },
    email: {
      validators: [
        { 
          message: t('contribute.errors.email.required'),
          name: 'required',
        },
        {
          message: t('contribute.errors.email.invalid'),
          name: 'email',
        },
      ],
      value: '',
    },
    from_name: {
      validators: [
        {
          message: t('contribute.errors.from_name.required'),
          name: 'required',
        },
        {
          message: t('contribute.errors.from_name.min'),
          name: 'minLength',
          value: 3,
        },
      ],
      value: '',
    },
    link: {
      validators: [
        {
          message: t('contribute.errors.link.invalid'),
          name: 'custom',
          validator: urlValidator,
        },
      ],
      value: '',
    },
  })

  const isSubmitting = ref(false)
  const sent = ref(false)

  const showErrorToast = () => {
    toast.show({
      title: t('contribute.toast.error.title'),
      message: t('contribute.toast.error.message'),
      color: 'danger'
    })
  }

  const showSuccessToast = () => {
    sent.value = true

    toast.show({
      title: t('contribute.toast.success.title'),
      message: t('contribute.toast.success.message'),
      color: 'success'
    })
  }

  const onSubmit = async () => {
    isSubmitting.value = true
    sent.value = false

    try {
      const { data } = await useFetch('/api/contribute', {
        method: 'POST',
        body: form.value,
      })

      if(data.value?.ok) {
        showSuccessToast()
      } else {
        showErrorToast()
      }
    } catch(e) {
      showErrorToast()
    } finally {
      isSubmitting.value = false
    }
  }

  const token = ref(null)
  const tokenValidation = computed(() => token.value || process.env.NODE_ENV === 'development')

  const buttonDisabled = computed(() => form.value.untouched || form.value.invalid || !tokenValidation.value || isSubmitting.value)

  useHead({
    meta: [
      { name: 'description', content: t('contribute.description') },
    ],
    title: t('contribute.pageTitle')
  })
</script>
<style lang="scss" scoped>
@import "~/assets/sass/mixins.scss";
@import '@inkline/inkline/css/mixins';

.contribute-page {
  &__title {
    @include title();
  }

  &__form {
    width: 50%;
  }

  &__captcha {
    margin-top: 7px;
  }

  &__loading {
    margin: 4px 11px;
  }

  @include breakpoint('md') {
    &__form {
      width: 100%;
    }
  }
}
</style>