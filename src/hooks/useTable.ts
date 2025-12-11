import { toast } from "@/assets/base-ui/toast";
import { ref } from "vue";

export type ListApi<T> = (
  page: number,
  limit: number,
  params?: any
) => Promise<{
  list: T[];
  totalCount: number;
  [extra: string]: any;
}>;

export function useTable<T = any>(options: {
  listApi: ListApi<T>;
  deleteApi?: (id: number | number[]) => Promise<any>;
  updateStatusApi?: (id: number, status: number) => Promise<any>;
  pageSize?: number;
  initialQuery?: Record<string, any>;
}) {
  const {
    listApi,
    deleteApi,
    updateStatusApi,
    pageSize = 10,
    initialQuery = {},
  } = options;

  const tableData = ref<T[]>([]);
  const tableLoading = ref(false);
  const currentPage = ref(1);
  const totalCount = ref(0);
  const limit = ref(pageSize);

  // 多选 id 列表（selection）
  const multiSelectionIds = ref<number[]>([]);

  // 可用于搜索 / 额外查询条件
  const query = ref<Record<string, any>>({ ...initialQuery });

  const getTableData = async (page = currentPage.value) => {
    tableLoading.value = true;
    try {
      currentPage.value = page;
      const res = await listApi(currentPage.value, limit.value, query.value);
      tableData.value = res.list || [];
      totalCount.value = res.totalCount ?? 0;
      // 如果有额外数据（如 roles），也可以返回在 res 上，调用方自行接收
      return res;
    } finally {
      tableLoading.value = false;
    }
  };

  const handleDelete = async (id?: number | number[]) => {
    if (!deleteApi) return Promise.reject("deleteApi not provided");
    tableLoading.value = true;
    try {
      const target = id ?? multiSelectionIds.value;
      if (!target || (Array.isArray(target) && target.length === 0)) {
        return Promise.reject("no id to delete");
      }
      await deleteApi(target);
      toast("删除成功");
      // 清除选择并刷新
      multiSelectionIds.value = [];
      await getTableData(1);
    } finally {
      tableLoading.value = false;
    }
  };

  const handleChangeStatus = async (id: number, status: number) => {
    if (!updateStatusApi) return Promise.reject("updateStatusApi not provided");
    tableLoading.value = true;
    try {
      await updateStatusApi(id, status);
      await getTableData(currentPage.value);

      toast("修改成功");
    } finally {
      tableLoading.value = false;
    }
  };

  const handleSelectionChange = (rows: any[]) => {
    multiSelectionIds.value = rows.map((r: any) => r.id);
  };

  const handlePageChange = (page: number) => {
    getTableData(page);
  };

  const resetQueryAndSearch = async () => {
    query.value = {};
    await getTableData(1);
  };

  return {
    // state
    tableData,
    tableLoading,
    currentPage,
    totalCount,
    limit,
    query,
    multiSelectionIds,

    // actions
    getTableData,
    handleDelete,
    handleChangeStatus,
    handleSelectionChange,
    handlePageChange,
    resetQueryAndSearch,
  };
}
