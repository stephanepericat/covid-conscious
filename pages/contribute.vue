<template>
  <div class="submit-page">
    <h1 v-text="$t('contribute.title')" />
    <!-- <p v-text="$t('comingSoon')" /> -->
    <IForm v-model="form" @submit="onSubmit">
      <IFormGroup>
        <IFormLabel>Name</IFormLabel>
        <IInput name="from_name" placeholder="Enter your name.." :error="['invalid']" />
        <IFormError for="from_name" :visible="['invalid']" />
      </IFormGroup>
      <IFormGroup>
        <IFormLabel>E-mail</IFormLabel>
        <IInput name="email" placeholder="Enter an email.." :error="['invalid']" />
        <IFormError for="email" :visible="['invalid']" />
      </IFormGroup>
      <IFormGroup>
        <IButton type="submit" :disabled="form.invalid">Submit</IButton>
      </IFormGroup>
    </IForm>

    <pre class="_margin-top:2 _text:muted">{{ form }}</pre>
  </div>
</template>
<script setup>
  import { useForm } from "@inkline/inkline";

  const form = useForm({
    email: {
      validators: [{ name: "required" }, { name: "email" }],
    },
    from_name: {
      validators: [{ name: "required" }, { name: 'minLength', value: 3 }],
    },
  });

  const onSubmit = () => console.log(form.value);
</script>