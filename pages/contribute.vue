<template>
  <div class="contribute-page">
    <h1 v-text="$t('contribute.title')" />
    <p v-text="$t('contribute.description')" />
    <IForm class="contribute-page__form" v-model="form" @submit="onSubmit">
      <IFormGroup>
        <IFormLabel>{{ $t('contribute.labels.name') }}</IFormLabel>
        <IInput name="from_name" :placeholder="$t('contribute.placeholders.name')" :error="['invalid']" />
        <IFormError for="from_name" :visible="['invalid']" />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t('contribute.labels.email') }}</IFormLabel>
        <IInput name="email" :placeholder="$t('contribute.placeholders.email')" :error="['invalid']" />
        <IFormError for="email" :visible="['invalid']" />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>{{ $t('contribute.labels.category') }}</IFormLabel>
        <ISelect name="category" :options="categories" :placeholder="$t('contribute.placeholders.category')" :error="['invalid']" />
        <IFormError for="category" :visible="['invalid']" />
      </IFormGroup>
      <IFormGroup>
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
        <IButton type="submit" :disabled="form.invalid">{{ $t('contribute.labels.submit') }}</IButton>
      </IFormGroup>
    </IForm>

    <!-- <pre class="_margin-top:2 _text:muted">{{ form }}</pre> -->
  </div>
</template>
<script setup>
  import { useForm } from "@inkline/inkline";
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
          message: "Please select a category.",
          name: "required",
        },
      ],
    },
    description: {
      validators: [
        {
          message: "Please enter a description.",
          name: "required",
        },
        {
          message: "The description needs to be at least 20 characters.",
          name: 'minLength',
          value: 20,
        },
      ],
    },
    email: {
      validators: [
        { 
          message: "Please enter an email address.",
          name: "required",
        },
        {
          message: "Please enter a valid email address.",
          name: "email",
        },
      ],
    },
    from_name: {
      validators: [
        {
          message: "Please enter a name.",
          name: "required",
        },
        {
          message: "The name needs to be at least 3 characters.",
          name: 'minLength',
          value: 3,
        },
      ],
    },
    link: {
      validators: [
        {
          message: "Please enter a valid link.",
          name: "custom",
          validator: (v) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v),
        },
      ],
    },
  });

  const onSubmit = () => console.log(form.value);
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