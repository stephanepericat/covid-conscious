<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

import { Check, ChevronsUpDown } from 'lucide-vue-next'

import TAGS_BY_TYPE_QUERY from '@/sanity/queries/tagsByType.sanity'
import type { TAGS_BY_TYPE_QUERYResult } from '@/sanity/types'

const props = defineProps<{
  locale: string
  type: string
}>()

const { data: tagList, status } =
  await useLazySanityQuery<TAGS_BY_TYPE_QUERYResult>(TAGS_BY_TYPE_QUERY, {
    locale: props.locale,
    type: props.type,
  })

const formSchema = toTypedSchema(
  z.object({
    tag: z.string(),
  }),
)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    tag: '',
  },
})

const isFormValid = useIsFormValid()

const onSubmit = handleSubmit((values) => {
  console.log('submitted', values)
})
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button>{{ $t('filters.title') }}</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ $t('filters.title') }}</SheetTitle>
        <SheetDescription>
          {{ $t('filters.description') }}
        </SheetDescription>
      </SheetHeader>
      <form @submit="onSubmit">
        <div class="grid gap-4 py-4">
          <!-- <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right"> Username </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div> -->

          <FormField v-slot="{ componentField }" name="tag">
            <FormItem v-auto-animate>
              <FormLabel>Tags</FormLabel>
              <Combobox by="label">
                <FormControl>
                  <ComboboxAnchor>
                    <div class="relative items-center">
                      <ComboboxInput
                        :display-value="(val) => val?.label ?? ''"
                        placeholder="Select tag..."
                      />
                      <ComboboxTrigger
                        class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                      >
                        <ChevronsUpDown class="size-4 text-muted-foreground" />
                      </ComboboxTrigger>
                    </div>
                  </ComboboxAnchor>
                </FormControl>
                <ComboboxList class="max-h-60 overflow-auto">
                  <ComboboxEmpty> Nothing found. </ComboboxEmpty>
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="tag in tagList"
                      :key="tag.value"
                      :value="tag"
                      @select="
                        () => {
                          setFieldValue('tag', tag.value)
                        }
                      "
                    >
                      {{ tag.label }}
                      <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                      </ComboboxItemIndicator>
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </Combobox>
              <FormDescription> Choose a tag. </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <SheetFooter>
          <SheetClose as-child>
            <Button class="mb-3 mr-1" variant="secondary">Close</Button>
          </SheetClose>
          <SheetClose as-child>
            <Button class="mb-3" type="submit" :disabled="!isFormValid">{{
              $t('filters.apply')
            }}</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  </Sheet>
</template>
