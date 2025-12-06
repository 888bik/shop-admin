<template>
  <div>
    <el-drawer
      title="设置轮播图"
      v-model="dialogVisible"
      size="50%"
      destroy-on-close
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="轮播图">
          <ImageSelect v-model="form.banners" :multiple="true" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loading"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import ImageSelect from "@/components/imageSelect.vue";
import { readGoods, updateGoodsBanners } from "@/services/modules/goods";
import { reactive, ref } from "vue";

interface FormType {
  banners: string[];
}

const emit = defineEmits(["reloadData"]);

const dialogVisible = ref(false);

const form = reactive<FormType>({
  banners: [],
});

const loading = ref(false);

const goodId = ref(0);

const open = async (id: number) => {
  goodId.value = id;

  loading.value = true;
  const res = await readGoods(goodId.value);
  form.banners = res.goodsBanner.map((o) => o.url);

  loading.value = false;
  dialogVisible.value = true;
};

const submit = async () => {
  const target = form.banners.map((o: any) => o.url);
  loading.value = true;
  await updateGoodsBanners(goodId.value, target);
  loading.value = false;
  dialogVisible.value = false;
  toast("设置成功");
  emit("reloadData");
};

defineExpose({
  open,
});
</script>

<style scoped></style>
