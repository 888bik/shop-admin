import { toast } from "@/assets/base-ui/toast";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

export function useFormDrawer<T = any>(
  rulesData?: FormRules,
  formData?: any,
  apis?: {
    createApi?: (data: T) => Promise<any>;
    updateApi?: (id: number, data: T) => Promise<any>;
    uploadApi?: (data: any) => Promise<any>;
  },
  onSuccess?: () => void
) {
  const visible = ref(false);
  const title = ref("");
  const mode = ref<"add" | "edit" | "upload">("add");
  const editData = ref<T | null>(null);

  const rules = reactive<FormRules>(rulesData || {});

  //如果formData是undefined,就初始化为空对象,同时确保不会共享引用
  const form = reactive(formData ? { ...formData } : {});
  const formRef = ref<FormInstance | null>(null);
  const formDrawerRef = ref();
  const loading = ref(false);

  const openAdd = (drawerTitle = "新增") => {
    mode.value = "add";
    title.value = drawerTitle;
    editData.value = null;
    resetForm();
    visible.value = true;
  };

  const openEdit = (data: T, drawerTitle = "修改") => {
    mode.value = "edit";
    title.value = drawerTitle;
    editData.value = data;
    //数据回填
    Object.assign(form, data);
    //清空验证提示
    formRef.value?.clearValidate();
    visible.value = true;
  };

  const openUpload = (drawerTitle = "上传") => {
    mode.value = "upload";
    title.value = drawerTitle;
    editData.value = null;
    resetForm();
    visible.value = true;
  };

  const resetForm = () => {
    //情况校验
    formRef.value?.clearValidate();
    //重置为初始值
    Object.assign(form, formData ? { ...formData } : {});
  };

  const submit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate();
    loading.value = true;
    try {
      if (mode.value === "add" && apis?.createApi) {
        await apis.createApi(form);
        console.log(form);
      } else if (mode.value === "edit" && apis?.updateApi && editData.value) {
        const id = editData.value["id"];
        // await apis.updateApi(id, form as T);
        await apis.updateApi(id, form);
      } else if (mode.value === "upload" && apis?.uploadApi) {
        await apis.uploadApi(form);
      }
      toast("操作成功");
      //刷新数据
      onSuccess && onSuccess();
      close();
    } finally {
      loading.value = false;
    }
  };

  const close = () => (visible.value = false);

  return {
    visible,
    title,
    mode,
    editData,
    loading,
    openAdd,
    openEdit,
    openUpload,
    resetForm,
    submit,
    close,
    rules,
    form,
    formRef,
    formDrawerRef,
  };
}
