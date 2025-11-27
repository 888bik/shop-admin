<template>
  <el-card shadow="hover" style="height: 100%">
    <div class="chart-header">
      <span class="title">订单统计</span>
      <span class="time">
        <el-check-tag
          v-for="(item, index) in options"
          class="mx-1"
          :checked="currentIndex === index"
          @click="handleChoose(item, index)"
          >{{ item.text }}</el-check-tag
        >
      </span>
    </div>
    <el-divider />

    <div ref="el" id="chart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { getStatistics3 } from "@/services/modules/statistics";
import * as echarts from "echarts";
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { ECharts } from "echarts";
import { useResizeObserver } from "@vueuse/core";
const options = [
  {
    text: "近1个月",
    value: "month",
  },
  {
    text: "近1周",
    value: "week",
  },
  {
    text: "近24小时",
    value: "hour",
  },
];

const currentIndex = ref(0);
const currentValue = ref("week");

let myChart: ECharts | null = null;

const handleChoose = (item: any, index: number) => {
  currentIndex.value = index;
  currentValue.value = item.value;
  getChartData(currentValue.value);
};

onMounted(() => {
  const chartDom = document.getElementById("chart")!;
  myChart = echarts.init(chartDom);
  getChartData(currentValue.value);
});

onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart);
});

const getChartData = async (type: string) => {
  let options = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  if (!myChart) return;
  myChart.showLoading();

  const res = await getStatistics3(type);
  options.xAxis.data = res.x;
  options.series[0]!.data = res.y;
  myChart!.setOption(options);

  myChart.hideLoading();
};

const el = ref(null);
useResizeObserver(el, (entries) => myChart?.resize());
</script>

<style scoped>
.chart-header {
  @apply flex  items-center justify-between;
}
</style>
