<template>
  <div class="manager-page">
    <el-tabs v-model="searchQuery.tab">
      <el-tab-pane
        v-for="(item, index) in tabBarData"
        :label="item.name"
        :name="item.key"
      ></el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <SearchInput
        v-model="searchQuery.title"
        @search="onSearch"
        label-name="商品分类"
      >
        <el-select
          v-model="searchQuery.categoryId"
          placeholder="请选择商品分类"
          clearable
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </SearchInput>
      <ListHeader
        @refresh="getTableData"
        @add="openAdd"
        :layout="['delete']"
        @delete="handleDelete"
      >
        <el-button
          size="small"
          @click="handleMultiStatusChange(1)"
          v-if="searchQuery.tab == 'all' || searchQuery.tab == 'off'"
          >上架</el-button
        >
        <el-button
          size="small"
          @click="handleMultiStatusChange(0)"
          v-if="searchQuery.tab == 'all' || searchQuery.tab == 'saling'"
          >下架</el-button
        >
        <el-button size="small" v-if="searchQuery.tab == 'delete'" type="danger"
          >彻底删除</el-button
        >
      </ListHeader>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex">
              <el-image
                class="mr-3 rounded"
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              >
              </el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.minPrice }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.minOprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类:{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间：{{ timeUtils.format(row.createTime) }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="实际销量"
          align="center"
          width="80"
          prop="saleCount"
        />

        <el-table-column label="商品状态" align="center" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{
              row.status ? "上架" : "仓库"
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" align="center" width="120">
          <template #default="{ row }">
            <div class="flex flex-col" v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button class="mt-2 !ml-0" type="danger" size="small" plain
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{ row.ischeck == 1 ? "通过" : "拒绝" }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="总库存"
          width="100"
          prop="stock"
          align="center"
        />

        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <span style="margin-left: 10px" v-if="searchQuery.tab !== 'delete'">
              <el-button type="primary" size="small" text @click="openEdit(row)"
                >修改</el-button
              >
              <el-button type="primary" size="small" text>商品规格</el-button>
              <el-button
                :type="row.goodsBanner.length == 0 ? 'danger' : 'primary'"
                size="small"
                text
                @click="handleSetGoodsBanner(row)"
                >设置轮播图</el-button
              >
              <el-button
                size="small"
                text
                :type="row.content === null ? 'danger' : 'primary'"
                @click="handleGoodsDetail(row.id)"
                >商品详情</el-button
              >
              <el-button
                type="primary"
                size="small"
                text
                @click="handleDelete(row.id)"
                >删除</el-button
              >
            </span>
            <span v-else>暂无操作</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-4">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :current-page="currentPage"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <form-drawer
      :title="title"
      @submit="submit"
      ref="formDrawerRef"
      v-model="visible"
    >
      <el-form
        :model="form"
        ref="formRef"
        label-width="90px"
        :inline="false"
        :rules="rules"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入商品名称,不能超过60个字符"
          />
        </el-form-item>

        <el-form-item label="封面" prop="cover">
          <ImageSelect :multiple="false" v-model="form.cover" />
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择商品分类"
            clearable
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            placeholder="选填，商品卖点"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input
            v-model="form.unit"
            placeholder="请输入单位"
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="总库存" prop="stock">
          <el-input v-model="form.stock" type="number" style="width: 40%">
            <template #append>件</template>
          </el-input></el-form-item
        >
        <el-form-item label="库存预警" prop="minStock">
          <el-input v-model="form.minStock" type="number" style="width: 40%">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低销售价" prop="minPrice">
          <el-input v-model="form.minPrice" type="number" style="width: 40%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原价" prop="minOprice">
          <el-input v-model="form.minOprice" type="number" style="width: 40%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存显示" prop="stockDisplay">
          <el-radio-group v-model="form.stockDisplay">
            <el-radio :label="0">隐藏</el-radio>
            <el-radio :label="1">显示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">放入仓库</el-radio>
            <el-radio :label="1">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </form-drawer>

    <Banner ref="bannerRef" @reload-data="getTableData" />
    <Content ref="contentRef" @reload-data="getTableData" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import ListHeader from "@/components/listHeader.vue";
import { useFormDrawer } from "@/hooks/useFormDrawer";
import SearchInput from "@/components/searchInput.vue";
import FormDrawer from "@/components/formDrawer.vue";
import { useTable } from "@/hooks/useTable";
import {
  createGoods,
  deleteGoods,
  getGoodsList,
  updateGoods,
  updateGoodsStatus,
  type IGoodsCategory,
} from "@/services/modules/goods";
import { toast } from "@/assets/base-ui/toast";
import ImageSelect from "@/components/imageSelect.vue";
import Banner from "./banners.vue";
import Content from "./content.vue";
import { timeUtils } from "@/utils/date";

const searchQuery = reactive({
  tab: "all",
  title: "",
  categoryId: null,
});

const categoryList = ref<IGoodsCategory[]>([]);

const bannerRef = ref();
const contentRef = ref();

const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  query,
  getTableData,
  handleDelete,
  handleSelectionChange,
  handlePageChange,
  multiSelectionIds,
} = useTable({
  listApi: (page, limit, query) =>
    getGoodsList(page, {
      tab: query.tab,
      limit,
      title: query.title,
      categoryId: query.categoryId,
    }),
  deleteApi: deleteGoods,
  pageSize: 10,
  initialQuery: { tab: "all" },
});

const {
  visible,
  title,
  openAdd,
  openEdit,
  form,
  rules,
  submit,
  formRef,
  formDrawerRef,
} = useFormDrawer(
  {
    title: [{ required: true, message: "商品名称不能为空" }],
    cover: [{ required: true, message: "请选择封面" }],
    categoryId: [{ required: true, message: "请选择商品分类" }],
  },
  {
    title: null, //商品名称
    categoryId: null, //商品分类
    cover: null, //商品封面
    description: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    minStock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stockDisplay: 1, //库存显示 0隐藏1显示
    minPrice: 0, //最低销售价
    minOprice: 0, //最低原价
  },
  {
    createApi: createGoods,
    updateApi: updateGoods,
  },
  () => getTableData()
);

watch(
  () => searchQuery.tab,
  (v) => {
    query.value.tab = v;
    getTableData(1); //切换标签后刷新第一页
  }
);

watch(
  () => searchQuery.categoryId,
  (v) => {
    console.log(v);
    query.value.categoryId = v;
    getTableData(1); //切换标签后刷新第一页
  }
);

const init = async () => {
  const res = await getTableData();
  console.log(res);
  categoryList.value = res.cates;
};
init();

const onSearch = (title: string) => {
  query.value.title = title;
  getTableData(1);
};

const handleMultiStatusChange = async (status: number) => {
  await updateGoodsStatus(multiSelectionIds.value, status);
  toast(status == 0 ? "下架成功" : "上架成功");
  getTableData();
};

const handleSetGoodsBanner = (row: any) => {
  bannerRef.value.open(row.id);
};

const handleGoodsDetail = (id: number) => {
  contentRef.value?.open(id);
};

const tabBarData = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];
</script>

<style scoped>
::v-deep(.el-dialog) {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  margin: 0 !important;
}
.avatar-picker {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
</style>
