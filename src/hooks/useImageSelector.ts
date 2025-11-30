import { ref } from "vue";

export function useImageSelector() {
  const dialogVisible = ref(false);
  const imageUrl = ref("");

  const openSelector = () => (dialogVisible.value = true);
  const handleSelect = (url: string) => {
    imageUrl.value = url;
    dialogVisible.value = false;
  };

  return {
    dialogVisible,
    imageUrl,
    openSelector,
    handleSelect,
  };
}
