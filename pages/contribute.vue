<template>
  <div class="contribute-page">
    <h1 v-text="$t('contribute.title')" />
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
        <NuxtTurnstile v-model="token" />
      </IFormGroup>
      <IFormGroup>
        <IButton type="submit" :disabled="form.invalid || !token">{{ $t('contribute.labels.submit') }}</IButton>
      </IFormGroup>
    </IForm>
  </div>
</template>
<script setup>
  import { useForm } from "@inkline/inkline";
  import { urlValidator } from "~/assets/utils/url-validator";
  import { COMMUNITY, NEWS, PRODUCT } from "~/assets/constants/types";

  const { t } = useI18n();

  const categories = [
    { id: COMMUNITY, label: t(`layout.${COMMUNITY}`) },
    { id: NEWS, label: t(`layout.${NEWS}`) },
    { id: PRODUCT, label: t(`layout.${PRODUCT}`) },
  ];

  const form = useForm({
    category: {
      validators: [
        {
          message: t("contribute.errors.category.required"),
          name: "required",
        },
      ],
    },
    description: {
      validators: [
        {
          message: t("contribute.errors.description.required"),
          name: "required",
        },
        {
          message: t("contribute.errors.description.min"),
          name: 'minLength',
          value: 20,
        },
      ],
    },
    email: {
      validators: [
        { 
          message: t("contribute.errors.email.required"),
          name: "required",
        },
        {
          message: t("contribute.errors.email.invalid"),
          name: "email",
        },
      ],
    },
    from_name: {
      validators: [
        {
          message: t("contribute.errors.from_name.required"),
          name: "required",
        },
        {
          message: t("contribute.errors.from_name.min"),
          name: 'minLength',
          value: 3,
        },
      ],
    },
    link: {
      validators: [
        {
          message: t("contribute.errors.link.invalid"),
          name: "custom",
          validator: urlValidator,
        },
      ],
    },
  });

  const onSubmit = async () => {
    try {
      const { data } = await useFetch('/api/contribute', {
        method: "POST",
        body: form.value,
      });

      console.log("data", data.value.ok);
      console.log("data", data.value.errors);
    } catch(e) {
      console.error("catch", e);
    }
  };

  const token = ref("");

  useHead({
    meta: [
      { name: "description", content: t("contribute.description") },
    ],
    title: t("contribute.pageTitle")
  });
</script>
<style lang="scss" scoped>
@import '@inkline/inkline/css/mixins';

.contribute-page {
  &__form {
    width: 50%;
  }

  @include breakpoint('md') {
    &__form {
      width: 100%;
    }
  }
}
</style>