export const usePagination = () => {
  const currentPage = ref(1);
  const itemsPerPage = ref(4);
  const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value);
  const endItem = computed(() => startItem.value + itemsPerPage.value);

  return {
    currentPage,
    itemsPerPage,
    startItem,
    endItem,
  };
};
