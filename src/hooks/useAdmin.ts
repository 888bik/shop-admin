import { updatePassword } from "@/services/modules/user";
import { toast } from "@/assets/base-ui/toast";
import type { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";

interface RuleForm {
  oldPassword: string;
  newPassword: string;
  rePassword: string;
}

export function UseEdPassword() {
  const formRef = ref<FormInstance>();
  const showDrawer = ref(false);

  const rules = reactive<FormRules<RuleForm>>({
    oldPassword: [
      { required: true, message: "旧密码不能为空", trigger: "blur" },
    ],
    newPassword: [{ required: true, message: "密码不能为空", trigger: "blur" }],
    rePassword: [
      { required: true, message: "确认密码不能为空", trigger: "blur" },
    ],
  });

  const form = reactive<RuleForm>({
    oldPassword: "",
    newPassword: "",
    rePassword: "",
  });

  const onSubmit = async () => {
    if (!formRef.value) return;
    try {
      const valid = await formRef.value.validate();
      if (!valid) return;

      updatePassword(form.oldPassword, form.newPassword, form.rePassword);
      // toast("密码修改成功", "请重新登录", "success");
    } catch (error) {
      console.log("error", error);
    }
  };

  return {
    onSubmit,
    formRef,
    showDrawer,
    rules,
    form,
  };
}
