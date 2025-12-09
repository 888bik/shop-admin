<template>
  <div v-loading="loading">
    <FormDrawer
      v-model="visible"
      @submit="submit"
      :ref="formDrawerRef"
      title="设置商品规格"
      destroy-on-close
      size="70%"
    >
      <el-form :model="form">
        <el-form-item label="规格类型">
          <el-radio-group v-model="form.skuType">
            <el-radio :label="0">单规格</el-radio>
            <el-radio :label="1">多规格</el-radio>
          </el-radio-group>
        </el-form-item>

        <template v-if="form.skuType === 0">
          <el-form-item label="市场价格">
            <el-input v-model="form.skuValue.oprice" style="width: 35%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销售价格">
            <el-input v-model="form.skuValue.pprice" style="width: 35%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="成本价格">
            <el-input v-model="form.skuValue.cprice" style="width: 35%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.skuValue.weight" style="width: 35%">
              <template #append>公斤</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品体积">
            <el-input v-model="form.skuValue.volume" style="width: 35%">
              <template #append>立方米</template>
            </el-input>
          </el-form-item>
        </template>

        <template v-else>
          <SkuCard />
          <SkuTable />
        </template>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup lang="ts">
import FormDrawer from "@/components/formDrawer.vue";
import { initSkuCardList, goodsId, skuList } from "@/hooks/useSkus";
import { readGoods } from "@/services/modules/goods";
import { reactive, ref } from "vue";
import SkuCard from "./skuCard.vue";
import { toast } from "@/assets/base-ui/toast";
import { updateGoodsSkus } from "@/services/modules/goodsSkus";
import SkuTable from "./skuTable.vue";

const emit = defineEmits(["reloadData"]);

const visible = ref(false);

const formDrawerRef = ref();

const loading = ref(false);

const form = reactive({
  skuType: 0,
  skuValue: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});

const open = async (row: any) => {
  goodsId.value = row.id;
  row.skusLoading = true;

  const res = await readGoods(goodsId.value);

  form.skuType = res.skuType;
  form.skuValue = res.skuValue || {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  };

  initSkuCardList(res);

  visible.value = true;

  row.skusLoading = false;
};

const submit = async () => {
  loading.value = true;

  let data = {
    skuType: form.skuType,
    skuValue: form.skuValue,
    goodsSkus: [],
  };

  if (form.skuType === 1) {
    data.goodsSkus = skuList.value;
  }

  await updateGoodsSkus(goodsId.value, data);
  toast("修改成功");
  emit("reloadData");
  loading.value = false;
  visible.value = false;
};
defineExpose({
  open,
});
</script>

<style scoped></style>
