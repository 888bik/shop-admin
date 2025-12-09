<template>
  <el-form-item label="规格设置">
    <table class="border">
      <thead>
        <tr>
          <th
            class="border"
            v-for="(item, index) in tableHeaders"
            :key="index"
            :width="item.width"
            :rowspan="item.rowspan"
            :colspan="item.colspan"
          >
            {{ item.name }}
          </th>
        </tr>
        <tr>
          <th class="border" v-for="(item, index) in tableLabels" :key="index">
            {{ item.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in skuList" :key="index">
          <td
            width="100"
            class="border text-center"
            v-for="(sku, skuI) in item.skus"
            :key="skuI"
          >
            {{ sku.value }}
          </td>
          <td class="border">
            <el-input
              v-model="item.pprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.oprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.cprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.stock"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.volume"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.weight"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>
<script setup lang="ts">
import { initSkuTable } from "@/hooks/useSkus";

const { tableLabels, tableHeaders, skuList } = initSkuTable();
console.log(skuList.value);
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* 让列宽根据内容自动计算 */
}

th,
td {
  padding: 6px;
  white-space: nowrap;
}

/* 除了规格列以外的所有列固定宽度 */
th.fixed,
td.fixed {
  width: 100px;
}
</style>
