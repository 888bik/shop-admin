<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh" v-loading="tableLoading">
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div
            class="sku-list"
            v-for="(item, index) in tableData"
            :key="index"
            :class="{ active: activeId == item.id }"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            layout="prev, next"
            :total="totalCount"
            :current-page="currentPage"
            :page-size="limit"
            @current-change="handlePageChange"
          />
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.value">
          <el-checkbox
            v-for="item in skuValueList"
            :key="item"
            :label="item"
            border
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit" :disabled="!form.value.length"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { useTable } from "@/hooks/useTable";
import { getSkusList } from "@/services/modules/skus";
import { reactive, ref } from "vue";

const emit = defineEmits(["reloadData"]);

const dialogVisible = ref(false);

const activeId = ref();

const skuValueList = ref();

const form = reactive({
  name: "",
  value: [],
});

const callbackFunction = ref<Function>();

const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  getTableData,
  handlePageChange,
  limit,
} = useTable({
  listApi: (page, limit) => getSkusList(page),
  pageSize: 10,
});

const init = async () => {
  const res = await getTableData();
  if (res.list.length > 0 && res.list[0]) {
    handleChangeActiveId(res.list[0]?.id);
  }
};
init();

const open = (cb: Function) => {
  callbackFunction.value = cb;
  dialogVisible.value = true;
};

const handleChangeActiveId = (id: number) => {
  activeId.value = id;
  const item = tableData.value.find((o) => o.id == id);
  if (item) {
    skuValueList.value = item.defaults.split(",");
    form.name = item.name;
  }
};

const submit = async () => {
  if (typeof callbackFunction.value !== "function") return;

  callbackFunction.value(form);

  dialogVisible.value = false;

  form.name = "";
  form.value = [];
};

defineExpose({
  open,
});
</script>
<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,
.sku-list.active {
  @apply bg-blue-50;
}
</style>
