<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <SearchInput
      v-model="searchQuery"
      @search="onSearch"
      :fields="searchFields"
    />

    <el-table
      default-expand-all
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              :size="50"
              :src="row.avatar"
              fit="fill"
              class="mr-3"
            ></el-avatar>
            <div class="flex-1">
              <h6 class="flex items-center">
                {{ row.nickname || row.username }}
                <small class="text-gray-400 ml-2">{{
                  timeUtils.format(row.reviewTime)
                }}</small>
                <el-button
                  size="small"
                  class="ml-auto"
                  @click="openTextarea(row)"
                  v-if="!row.textareaEdit && !row.extra"
                  >回复</el-button
                >
              </h6>
              {{ row.review }}
              <div class="py-2" v-if="row.reviewImages">
                <el-image
                  v-for="(item, index) in row.reviewImages"
                  :key="index"
                  :src="item"
                  fit="cover"
                  :lazy="true"
                  style="width: 100px; height: 100px"
                  class="rounded"
                ></el-image>
              </div>
              <div class="py-2">
                <el-image
                  v-for="(item, index) in row.reviewImages"
                  :key="index"
                  :src="item"
                  fit="cover"
                  :lazy="true"
                  style="width: 100px; height: 100px"
                  class="rounded"
                ></el-image>
              </div>

              <div v-if="row.textareaEdit">
                <el-input
                  v-model="textarea"
                  placeholder="请输入评价内容"
                  type="textarea"
                  :rows="2"
                ></el-input>
                <div class="py-2">
                  <el-button type="primary" size="small" @click="review(row)"
                    >回复</el-button
                  >
                  <el-button
                    size="small"
                    class="ml-2"
                    @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>

              <template v-else>
                <div
                  class="mt-3 bg-gray-100 p-3 rounded"
                  v-if="row.replyContent"
                >
                  <h6 class="flex font-bold">
                    客服
                    <el-button
                      type="info"
                      size="small"
                      class="ml-auto"
                      @click="openTextarea(row)"
                      >修改</el-button
                    >
                  </h6>
                  <p>{{ row.replyContent }}</p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="ID" width="70" align="center" prop="id" />
      <el-table-column label="商品" width="240">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.goodsCover"
              fit="fill"
              :lazy="true"
              style="width: 50px; height: 50px"
              class="rounded"
            ></el-image>
            <div class="ml-3">
              <h6>{{ row?.goodsTitle ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" width="200" align="center">
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.nickname || row.username }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" width="200" align="center">
        <template #default="{ row }">
          {{ timeUtils.format(row.reviewTime) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.reviewStatus"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(row.id, $event)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager ,next"
        :total="totalCount"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </el-card>
</template>
<script setup lang="ts">
import { toast } from "@/assets/base-ui/toast";
import ListHeader from "@/components/listHeader.vue";
import SearchInput from "@/components/searchInput.vue";
import { useTable } from "@/hooks/useTable";
import {
  getCommentsList,
  reviewGoodsComment,
  updateCommentStatus,
  type ICommentItem,
} from "@/services/modules/comments";
import { timeUtils } from "@/utils/date";
import { computed, reactive, ref } from "vue";
const {
  tableData,
  tableLoading,
  currentPage,
  totalCount,
  query,
  getTableData,
  handlePageChange,
} = useTable<ICommentItem>({
  listApi: (page, limit, query) => getCommentsList(page, limit, query.keyword),
});

const searchQuery = reactive({
  keyword: "",
});

const searchFields = computed(() => [
  {
    type: "input" as "input",
    label: "商品标题",
    model: "keyword",
    placeholder: "商品标题",
    prefixIcon: "search",
  },
]);

const onSearch = (form: Record<string, any>) => {
  query.value = {
    ...query.value,
    ...form,
  };
  getTableData(1);
};
const init = async () => {
  await getTableData();
};
init();

const textarea = ref("");

const openTextarea = (row: any, data = "") => {
  textarea.value = data;
  row.textareaEdit = true;
};
const review = async (row: any) => {
  if (textarea.value == "") {
    return toast("回复内容不能为空", "error");
  }

  await reviewGoodsComment(row.id, textarea.value);
  row.textareaEdit = false;
  toast("回复成功");
  getTableData();
};
const handleChangeStatus = async (id: number, e: any) => {
  try {
    await updateCommentStatus(id, e);
    toast("修改成功");

    getTableData();
  } catch (error) {
    toast("修改失败", "", "error");
  }
};
</script>
