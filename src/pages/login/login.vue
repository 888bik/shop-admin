<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left">
      <div>
        <div class="title">欢迎光临</div>
        <div class="desc">鲜花销售后台管理系统</div>
      </div>
    </el-col>

    <el-col :lg="8" :md="12" class="right">
      <h2 class="title">欢迎回来</h2>
      <div class="desc">
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>

      <div class="input">
        <el-form class="w-[250px]" :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名">
              <template #prefix>
                <el-icon><UserFilled /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              type="password"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="submitBtn">
        <el-button
          round
          color="#6366f1"
          class="w-[250px]"
          @click="onSubmit()"
          :loading="isLoading"
          >登录</el-button
        >
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { userLogin } from "@/services/modules/user";
import { type FormInstance, type FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/utils/toast";
import useUserStore from "@/store/modules/user";
import { setToken } from "@/utils/auth";

interface RuleForm {
  username: string;
  password: string;
}

const formRef = ref<FormInstance>();
const router = useRouter();
const isLoading = ref(false);
const userStore = useUserStore();
const form = reactive<RuleForm>({
  username: "",
  password: "",
});

const rules = reactive<FormRules<RuleForm>>({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 3, max: 5, message: "长度必须3到5位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 3, max: 5, message: "长度必须3到5位", trigger: "blur" },
  ],
});

const onSubmit = async () => {
  if (!formRef.value) return;
  try {
    const valid = await formRef.value.validate();

    if (!valid) return;

    isLoading.value = true;

    const token = await userLogin(form.username, form.password);

    isLoading.value = false;

    if (token) {
      //存储token
      setToken(token);

      //提示登录成功
      toast("登录成功", "欢迎回来");

      //获取管理员信息
      await userStore.fetchUserInfo();

      //登录成功跳转
      router.push("/home");
    }
  } catch (error) {
    console.log("表单校验失败", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  @apply bg-indigo-500 min-h-screen min-w-screen;
}

.login-container .right {
  @apply bg-light-50 flex-col;
}

.login-container .left,
.login-container .right {
  @apply flex justify-center items-center;
}

.left .title {
  @apply font-bold text-5xl text-light-50 mb-4;
}

.left > div > div:last-child {
  @apply text-gray-200 text-sm;
}

.right .title {
  @apply font-bold text-3xl text-gray-800;
}

.right .desc {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>
