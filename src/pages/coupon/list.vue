<template>
  <div class="role-page">
    <el-card shadow="never" class="border-0" v-loading="loading">
      <list-header @refresh="getTableData" @add="openAdd" />
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column prop="name" label="优惠券名称" width="350">
          <template #default="{ row }">
            <div
              class="border border-dashed py-2 px-4 rounded"
              :class="row.statusText == '领取中' ? 'active' : 'inactive'"
            >
              <h5 class="font-bold text-md">{{ row.name }}</h5>
              <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="statusText" label="状态" align="center">
        </el-table-column>

        <el-table-column prop="" label="优惠" align="center">
          <template #default="{ row }">
            {{ row.type == 0 ? "满减" : "折扣" }}
            {{ row.type == 0 ? "￥" + row.value : row.value + "折" }}
          </template>
        </el-table-column>

        <el-table-column prop="total" label="发放数量" align="center" />
        <el-table-column prop="used" label="已使用" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.statusText == '未开始'"
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >修改</el-button
            >

            <el-popconfirm
              v-if="scope.row.statusText != '领取中'"
              title="是否要删除该优惠券？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm
              v-if="scope.row.statusText == '领取中'"
              title="是否要让该优惠券失效？"
              confirmButtonText="失效"
              cancelButtonText="取消"
              @confirm="handleChangeStatus(scope.row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small">失效</el-button>
              </template>
            </el-popconfirm>
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
      v-model="visible"
      @submit="submitCoupon"
      ref="formDrawerRef"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="100px"
        :inline="false"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="form.name" placeholder="优惠券名称"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">满减</el-radio>
            <el-radio :label="1">折扣</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" placeholder="面值" style="width: 50%">
            <template #append>{{ form.type ? "折" : "元" }}</template>
          </el-input>
        </el-form-item>

        <el-form-item label="发行量" prop="total">
          <el-input-number
            v-model="form.total"
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="最低使用价格" prop="min_price">
          <el-input
            v-model="form.min_price"
            placeholder="最低使用价格"
            type="number"
          ></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number
            v-model="form.order"
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="活动时间">
          <el-date-picker
            :editable="false"
            v-model="timerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetimerange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="角色描述"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </div>
</template>

<script setup lang="ts">
import ListHeader from "@/components/listHeader.vue";
import { computed, ref, watch } from "vue";
import { toast } from "@/assets/base-ui/toast";

import { useFormDrawer } from "@/hooks/useFormDrawer";
import FormDrawer from "@/components/formDrawer.vue";
import {
  createCoupon,
  deleteCoupon,
  getCouponList,
  updateCoupon,
  updateCouponStatus,
  type ICouponItem,
} from "@/services/modules/coupon";
import { dayjs } from "element-plus";

const tableData = ref<ICouponItem[]>([]);
const currentPage = ref(1);
const totalCount = ref(0);
const isLoading = ref(false);

const timerange = ref<[string, string] | []>([]);

const {
  visible,
  title,
  openAdd,
  openEdit,
  form,
  rules,
  formDrawerRef,
  formRef,
  loading,
  submit,
} = useFormDrawer(
  {
    name: [{ required: true, message: "请输入优惠券名称" }],
  },
  {
    name: "",
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: "",
    end_time: "",
    order: 50,
    desc: "",
  },
  {
    createApi: createCoupon,
    updateApi: updateCoupon,
  },
  () => getTableData()
);

function formatStatus(row: any) {
  let s = "领取中";
  let start_time = new Date(row.start_time).getTime();
  let now = new Date().getTime();
  let end_time = new Date(row.end_time).getTime();
  if (start_time > now) {
    s = "未开始";
  } else if (end_time < now) {
    s = "已结束";
  } else if (row.status == 0) {
    s = "已失效";
  }
  return s;
}

const getTableData = async () => {
  isLoading.value = true;

  const res = await getCouponList(currentPage.value);
  tableData.value = res.list.map((o) => {
    o.statusText = formatStatus(o);
    return o;
  });
  totalCount.value = res.totalCount;

  isLoading.value = false;
};
getTableData();

const submitCoupon = () => {
  //将日期转为时间戳
  if (timerange.value?.length === 2) {
    form.start_time = new Date(timerange.value[0]).getTime();
    form.end_time = new Date(timerange.value[1]).getTime();
  } else {
    form.start_time = "";
    form.end_time = "";
  }

  submit();
};

const handleEdit = (row: ICouponItem) => {
  //将时间戳转为日期回填
  timerange.value = [
    row.start_time ? dayjs(row.start_time).format("YYYY-MM-DD HH:mm:ss") : "",
    row.end_time ? dayjs(row.end_time).format("YYYY-MM-DD HH:mm:ss") : "",
  ];

  openEdit(row);
};

const handleDelete = async (id: number) => {
  isLoading.value = true;
  await deleteCoupon(id);
  toast("删除成功");
  getTableData();
  isLoading.value = false;
};

const handleChangeStatus = async (id: number) => {
  console.log(id);
  isLoading.value = true;
  await updateCouponStatus(id);
  toast("修改成功");
  isLoading.value = false;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

watch(currentPage, () => {
  getTableData();
});
</script>

<style scoped>
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
