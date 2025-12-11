import { toast } from "@/assets/base-ui/toast";
import type {
  IGoodsListItem,
  IGoodsSkusCardItem,
  IGoodsSkusCardValueItem,
} from "@/services/modules/goods";
import {
  createGoodsSkusCard,
  createGoodsSkusCardValue,
  deleteGoodsSkusCard,
  deleteGoodsSkusCardValue,
  updateGoodsSkusCard,
  updateGoodsSkusCardSort,
  updateGoodsSkusCardValue,
  updateSkusCardAndValue,
} from "@/services/modules/goodsSkus";
import { computed, nextTick, ref } from "vue";

type GoodsSkuCardExt = IGoodsSkusCardItem & {
  text: string;
  loading: boolean;
  goodsSkusCardValue: GoodsSkusCardValueExt[];
};

type GoodsSkusCardValueExt = IGoodsSkusCardValueItem & {
  text: string;
};

export const goodsId = ref();

// 规格选项列表
export const skuCardList = ref<GoodsSkuCardExt[]>([]);

export const skuList = ref();

// 保存后端原始 sku 行（用于合并已有数据）
export const originalGoodsSkus = ref<any[]>([]);

// 初始化规格选项列表
export const initSkuCardList = (data: IGoodsListItem) => {
  skuCardList.value = data.goodsSkusCard.map((o) => {
    return {
      ...o,
      text: o.name,
      loading: false,
      goodsSkusCardValue: o.goodsSkusCardValue.map((v) => {
        return {
          ...v,
          text: v.value,
        };
      }),
    };
  });

  // 保存后端原始 sku 行的拷贝（用于后续合并）
  originalGoodsSkus.value = Array.isArray(data.goodsSkus)
    ? data.goodsSkus.map((s) => ({ ...s }))
    : [];

  // 先清空，再由 getTableData 生成最终 skuList
  skuList.value = [];
  getTableData();
};

//删除规格选项
export const handleDelete = async (item: GoodsSkuCardExt) => {
  item.loading = true;
  await deleteGoodsSkusCard(item.id);
  //页面删除
  const i = skuCardList.value.findIndex((o) => o.id == item.id);
  if (i != -1) {
    skuCardList.value.splice(i, 1);
  }
  item.loading = false;
  getTableData();
  toast("删除成功");
};

//创建规格选项
export const btnLoading = ref(false);
export const handleCreate = async () => {
  btnLoading.value = true;
  const res = await createGoodsSkusCard({
    goodsId: goodsId.value,
    name: "规格选项",
    order: 50,
    type: 0,
  });
  if (res) {
    skuCardList.value.push({
      ...res,
      id: res.id,
      text: res.name,
      loading: false,
      goodsSkusCardValue: [],
    });
  }
  toast("添加成功");
  btnLoading.value = false;
};

//更新规格选项
export const handleUpdate = async (item: GoodsSkuCardExt) => {
  try {
    item.loading = true;
    await updateGoodsSkusCard(item.id, {
      goodsId: item.goodsId,
      name: item.text,
      order: item.order,
      type: item.type,
    });
    item.name = item.text;
    toast("修改成功");
  } catch (error) {
    item.text = item.name;
    toast("修改失败", "", "error");
  } finally {
    item.loading = false;
  }
};

//list: A B C D  交换 B C -> [list[index-1],list[index]] = [list[index],list[index-1]]
export const moveUp = async (index: number) => {
  const list = skuCardList.value;
  const prev = list[index - 1];
  const curr = list[index];

  if (!prev || !curr) return;

  list[index - 1] = curr;
  list[index] = prev;

  await syncSort();
};

// A B C D -> A C B D(index=1) [list[index-1],list[index]]  =[list[index],list[index+1]]
export const moveDown = async (index: number) => {
  const list = skuCardList.value;
  const next = list[index + 1];
  const curr = list[index];
  if (!next || !curr) return;

  list[index + 1] = curr;
  list[index] = next;

  await syncSort();
};

// 生成排序数据
const buildSortData = () => {
  return {
    sortData: skuCardList.value.map((item, index) => {
      item.order = index + 1;
      return {
        id: item.id,
        order: item.order,
      };
    }),
  };
};
export const bodyLoading = ref(false);
const syncSort = async () => {
  const data = buildSortData();

  try {
    bodyLoading.value = true;
    await updateGoodsSkusCardSort(data);

    getTableData();

    toast("排序已更新");
  } catch (e) {
    toast("排序同步失败");
  } finally {
    bodyLoading.value = false;
  }
};

export const handleChooseSetGoodsSkusCard = async (id: number, data: any) => {
  let item = skuCardList.value.find((o) => o.id == id);
  if (!item) return;

  try {
    item.loading = true;
    const res = await updateSkusCardAndValue(id, data);
    item.name = item.text = res.goodsSkusCard.name;
    item.goodsSkusCardValue = res.goodsSkusCardValue.map((o: any) => {
      o.text = o.value || "属性值";
      return o;
    });
    getTableData();
    toast("更新成功");
  } catch (error) {
    toast("更新失败", "", "error");
  } finally {
    item.loading = false;
  }
};

//规格选项值逻辑
export const initSkuCardItemValue = (id: number) => {
  const loading = ref(false);
  const skuCardItem = skuCardList.value.find((o) => o.id === id);
  const inputVisible = ref(false);
  const inputValue = ref();
  const InputRef = ref();

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
    getTableData();
  };

  const handleInputConfirm = async () => {
    //如果没输入值则关闭
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }

    try {
      loading.value = true;
      const res = await createGoodsSkusCardValue({
        goodsSkusCardId: id,
        name: skuCardItem!.name,
        order: 50,
        value: inputValue.value,
      });

      //更新界面
      skuCardItem?.goodsSkusCardValue.push({
        ...res,
        text: res.value,
      });

      getTableData();

      toast("添加成功");
    } catch (error) {
      toast("添加失败", "", "error");
    } finally {
      loading.value = false;
      inputVisible.value = false;
      inputValue.value = "";
    }
  };

  const handleClose = async (tag: GoodsSkusCardValueExt) => {
    try {
      loading.value = true;
      await deleteGoodsSkusCardValue(tag.id);
      let i = skuCardItem!.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
      if (i !== -1) {
        skuCardItem?.goodsSkusCardValue.splice(i, 1);
      }

      getTableData();

      toast("删除成功");
    } catch (error) {
      toast("删除失败", "", "error");
    } finally {
      loading.value = false;
    }
  };

  const handleChange = async (value: any, tag: GoodsSkusCardValueExt) => {
    try {
      loading.value = true;
      await updateGoodsSkusCardValue(tag.id, {
        goodsSkusCardId: tag.goodsSkusCardId,
        name: tag.name,
        order: tag.order,
        value,
      });

      getTableData();

      toast("更新成功");
      //更新界面
      tag.value = value;
    } catch (error) {
      tag.text = tag.value;
      toast("更新失败", "", "error");
    } finally {
      loading.value = false;
    }
  };

  return {
    skuCardItem,
    inputVisible,
    inputValue,
    handleInputConfirm,
    handleClose,
    loading,
    handleChange,
    showInput,
    InputRef,
  };
};

//初始化表格数据
export const initSkuTable = () => {
  //商品规格底下的值
  const tableLabels = computed(() => {
    return skuCardList.value.filter((v) => {
      return v.goodsSkusCardValue.length > 0;
    });
  });

  //规格表头
  const tableHeaders = computed(() => {
    let length = tableLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        rowspan: length > 0 ? 1 : 2,
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });

  return {
    tableLabels,
    tableHeaders,
    skuList,
  };
};

//排序组合算法
export function cartesianProductOf<T>(...args: T[][]): T[][] {
  return args.reduce((a, b) => a.flatMap((x) => b.map((y) => x.concat([y]))), [
    [],
  ] as T[][]);
}

// 生成组合签名（用于匹配两条 sku 是否表示相同的规格组合）
// 签名：把一行规格值变成 "cardId:value|cardId2:value2" 的字符串
function comboSignature(items: any[]): string {
  if (!Array.isArray(items)) return "";
  // 抽取 cardId 和 value（兼容不同字段名），并转为字符串后排序，生成唯一、可比较的签名
  const parts = items.map((it) => {
    const cid =
      it.goodsSkusCardId ??
      it.goods_skus_card_id ??
      it.goodsSkusCardId ??
      it.goods_skus_card_id ??
      "";
    const val = it.value ?? it.text ?? it.name ?? it.id ?? "";
    return `${String(cid)}:${String(val)}`;
  });
  // 排序使签名与顺序无关（更健壮）
  parts.sort();
  return parts.join("|");
}

/**
 * 生成表格数据：
 * - 使用 originalGoodsSkus（后端原始行）来匹配已有行
 * - 若匹配到就复用价格/库存/编码等字段；否则产生默认行
 */
export const getTableData = () => {
  if (!skuCardList.value || skuCardList.value.length === 0) {
    skuList.value = [];
    return;
  }

  //把每个规格卡片的值数组取出来
  const valueArrays: GoodsSkusCardValueExt[][] = skuCardList.value
    .filter((v) => v.goodsSkusCardValue.length > 0)
    .map((v) => v.goodsSkusCardValue);

  if (valueArrays.length === 0) {
    skuList.value = [];
    return;
  }

  // 所有组合（每个组合是一个规格值的数组）
  const combos = cartesianProductOf(...valueArrays);

  // 构建原始后端行的签名 Map（signature -> row）
  const existMap = new Map<string, any>();

  (originalGoodsSkus.value || []).forEach((row) => {
    // 尝试获取行里解析后的 skus 数组（后端可能已经返回 skusObj，也可能是 skus 字符串）
    let parsed: any = null;
    if (row.skusObj) {
      parsed = row.skusObj;
    } else if (row.skus) {
      try {
        parsed = typeof row.skus === "string" ? JSON.parse(row.skus) : row.skus;
      } catch (e) {
        // 如果解析失败，就尝试把它当数组处理
        parsed = row.skus;
      }
    }
    if (Array.isArray(parsed)) {
      const sig = comboSignature(parsed);
      if (sig) existMap.set(sig, row);
    }
  });

  // 根据 combos 生成最终 skuList：若匹配到后端行则复用其字段，否则使用默认行
  const newList = combos.map((combo) => {
    const sig = comboSignature(combo);
    const matched = existMap.get(sig);

    if (matched) {
      // 使用后端已有行（保留它的价格/stock/id等），但确保 skus/skusObj 都可用供前端渲染
      let skusParsed;
      if (matched.skusObj) skusParsed = matched.skusObj;
      else if (matched.skus) {
        try {
          skusParsed =
            typeof matched.skus === "string"
              ? JSON.parse(matched.skus)
              : matched.skus;
        } catch {
          skusParsed = matched.skus;
        }
      } else {
        skusParsed = combo;
      }

      return {
        ...matched,
        // 保证前端能以数组形式读取 skus（避免模板里出现 string）
        skus: Array.isArray(skusParsed) ? skusParsed : combo,
        // skusObj: combo, // 明确提供解析好的对象数组给前端
      };
    }

    // 未找到匹配 -> 新建一行（默认值）
    return {
      id: undefined,
      goodsId: goodsId.value,
      image: "",
      pprice: "0",
      oprice: "0",
      cprice: "0",
      stock: 0,
      volume: 0,
      weight: 0,
      code: "",
      skus: combo,
      skusObj: combo,
    };
  });

  skuList.value = newList;
};
