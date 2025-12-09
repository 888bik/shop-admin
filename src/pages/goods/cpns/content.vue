<template>
  <FormDrawer
    ref="formDrawerRef"
    title="设置商品详情"
    @submit="submit"
    destroy-on-close
    v-model="visible"
  >
    <el-form :model="form">
      <el-form-item>
        <RichEditor v-model="form.content" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import RichEditor from "@/components/RichEditor.vue";
import FormDrawer from "@/components/formDrawer.vue";
import { readGoods, updateGoodsContent } from "@/services/modules/goods";
import { reactive, ref } from "vue";

const formDrawerRef = ref();

const visible = ref(false);

const form = reactive({
  content: "",
});

const goodsId = ref(0);

const open = async (id: number) => {
  goodsId.value = id;
  const res = await readGoods(goodsId.value);
  form.content = res.content;
  visible.value = true;
};

const emit = defineEmits(["reloadData"]);

const submit = async () => {
  console.log("1111");
  await updateGoodsContent(goodsId.value, form.content);

  toast("设置商品详情成功");
  emit("reloadData");

  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style scoped></style>
