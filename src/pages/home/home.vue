<template>
  <div>
    <home-panels></home-panels>
    <home-cards></home-cards>
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12" :offset="0">
        <home-chart></home-chart>
      </el-col>
      <el-col :span="12" :offset="0">
        <home-tips
          title="店铺及商品提示"
          tip="店铺及商品提示"
          v-if="TipsData"
          :tip-data="TipsData.goods"
          class="mb-3"
        ></home-tips>
        <home-tips
          title="交易提示"
          tip="需要立即处理的交易订单"
          v-if="TipsData"
          :tip-data="TipsData.order"
        ></home-tips>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import HomePanels from "./cpns/home-panels.vue";
import HomeCards from "./cpns/home-cards.vue";
import homeChart from "./cpns/home-chart.vue";
import HomeTips from "./cpns/home-tips.vue";
import { onMounted, ref } from "vue";
import { getStatistics2 } from "@/services/modules/statistics";

const TipsData = ref();
onMounted(async () => {
  TipsData.value = await getStatistics2();
});
</script>

<style scoped></style>
