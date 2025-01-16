<script>
// const onResetFilters = () => {
//   console.log('reset filters')
// }

const onUpdateFilters = () => {
  console.log('update filters')
}
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
      <div class="grid gap-4 py-4">
        <!-- <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right"> Username </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div> -->
        <div>tag</div>
        <div>language</div>
      </div>
      <SheetFooter>
        <SheetClose as-child>
          <Button class="mb-3" type="submit" @click="onUpdateFilters">{{
            $t('filters.apply')
          }}</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
