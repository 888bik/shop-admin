import { ref } from "vue";

export function useFormDrawer<T = any>() {
  const visible = ref(false);
  const title = ref("");
  const mode = ref<"add" | "edit" | "upload">("add");
  const editData = ref<T | null>(null);

  const openAdd = (drawerTitle = "新增") => {
    mode.value = "add";
    title.value = drawerTitle;
    editData.value = null;
    visible.value = true;
  };

  const openEdit = (data: T, drawerTitle = "编辑") => {
    mode.value = "edit";
    title.value = drawerTitle;
    editData.value = data;
    visible.value = true;
  };

  const openUpload = (drawerTitle = "上传图片") => {
    mode.value = "upload";
    title.value = drawerTitle;
    editData.value = null;
    visible.value = true;
  };

  const close = () => (visible.value = false);

  return {
    visible,
    title,
    mode,
    editData,
    openAdd,
    openEdit,
    openUpload,
    close,
  };
}
