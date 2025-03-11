<script setup lang="ts">
import { useForm, useIsFormValid } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const isFormValid = useIsFormValid(form)

const onSubmit = form.handleSubmit((values) => {
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

          <FormField v-slot="{ componentField }" name="username">
            <FormItem v-auto-animate>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="shadcn"
                  v-bind="componentField"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- <Button type="submit"> Submit </Button> -->
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
