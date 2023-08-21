<template>
  <div class="sf-avatar">
    <div
      v-if="src"
      class="sf-avatar__image"
      :style="imgStyle"
    />
    <IFormGroup>
      <IFormLabel>{{ $t("supabase-forum.account.labels.avatar") }}</IFormLabel>
      <IInput
        id="single"
        type="file"
        accept="image/*"
        :disabled="uploading"
        @change="uploadAvatar"
      />
    </IFormGroup>
  </div>
</template>
<script setup>
  import { computed, ref, toRefs, useSupabaseClient, watch } from '#imports'

  const props = defineProps({
    path: { type: String, default: '' }
  })
  const { path } = toRefs(props)

  const emit = defineEmits(['update:path', 'upload', 'error'])

  const supabase = useSupabaseClient()

  const uploading = ref(false)
  const src = ref('')
  const files = ref()

  const imgStyle = computed(() => ({ 'background-image': `url(${src.value})` }))

  const downloadImage = async () => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path.value)
      if (error) throw error
      src.value = URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (evt) => {
    files.value = evt.target.files
    try {
      uploading.value = true

      if (!files.value || files.value.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = files.value[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) throw uploadError

      emit('update:path', filePath)
      emit('upload')
    } catch (error) {
      console.error(error)
      emit('error')
    } finally {
      uploading.value = false
    }
  }

  downloadImage()

  watch(path, () => {
    if (path.value) {
      downloadImage()
    }
  })
</script>
<style lang="scss" scoped>
.sf-avatar {
  &__image {
    background-size: cover;
    border-radius: 60px;
    margin: 0 auto 30px auto;
    height: 120px;
    width: 120px;
  }
}
</style>