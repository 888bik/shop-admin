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
        <Editor v-model="form.content" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import Editor from "@/components/Editor.vue";
import FormDrawer from "@/components/formDrawer.vue";
import { readGoods, updateGoods } from "@/services/modules/goods";
import { reactive, ref } from "vue";

const formDrawerRef = ref();
const visible = ref(false);

const form = reactive({
  content: "",
});

const goodsId = ref(0);
const open = (row: any) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      formDrawerRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};
const emit = defineEmits(["reloadData"]);

const submit = () => {
  visible.value = true;
  updateGoods(goodsId.value, form)
    .then((res) => {
      toast("设置商品详情成功");
      formDrawerRef.value.close();
      emit("reloadData");
    })
    .finally(() => {
      visible.value = false;
    });
};

defineExpose({
  open,
});
</script>

<style scoped></style>
