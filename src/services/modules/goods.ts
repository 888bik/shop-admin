import { goodsRequest } from "..";
export type Tab =
  | "all"
  | "checking"
  | "saling"
  | "off"
  | "min_stock"
  | "delete";

interface GetGoodsListPayload {
  tab: Tab; //all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
  title?: string; //关键词
  categoryId?: number; //分类id
  limit?: number;
  categoryIds?: number[];
}
/** 类别项**/
export interface ICateItem {
  id: number;
  name: string;
  status: number;
  createTime: string;
  updateTime: string;
  categoryId: number;
  order: number;
  level?: number;
}

/** sku card value */
export interface IGoodsSkusCardValueItem {
  id: number;
  goodsSkusCardId: number;
  name: string;
  value: string;
  order: number;
}

/** sku card（规格组） */
export interface IGoodsSkusCardItem {
  id: number;
  goodsId: number;
  name: string;
  type: number;
  order: number;
  goodsSkusCardValue: IGoodsSkusCardValueItem[];
}

/** goods banner 项 */
export interface IGoodsBannerItem {
  id: number;
  goods_id: number;
  url: string;
  createTime: string;
  updateTime: string;
}

/** goods_skus 内部项 */
export interface IGoodsSkuItem {
  id: number;
  image: string;
  pprice: string;
  oprice: string;
  cprice: string;
  stock: number;
  volume: number;
  weight: number;
  code: string;
  goodsId: number;
  // 后端返回的 skus 是个对象（数字索引的 key），这里用 Record<string, IGoodsSkuDimension>
  skus: Record<string, IGoodsSkuDimension>;
}

/** sku_value 的统一结构 */
export interface IGoodsSkuDimension {
  id: number | string;
  goodsSkusCardId: number | string;
  name: string;
  value: string;
  order: number;
  text?: string;
}

export interface ISkuValue {
  oprice: number;
  pprice: number;
  cprice: number;
  weight: number;
  volume: number;
}

export interface IGoodsCategory {
  id: number;
  name: string;
  status: number;
  createTime: string;
  updateTime: string;
  categoryId: number;
  order: number;
}

/** 列表中单个商品项 */
export interface IGoodsListItem {
  id: number;
  title: string;
  categoryId: number;
  cover: string;
  rating: number;
  saleCount: number;
  reviewCount: number;
  minPrice: string; // 注意：后端是字符串 "1.00"
  minOprice: string; // 原数据有 min_oprice
  description: string;
  unit: string;
  stock: number;
  minStock: number;
  ischeck: number;
  status: number;
  stockDisplay: number;
  expressId: number;
  skuType: number;
  skuValue: ISkuValue;
  content: string;
  discount: number;
  createTime: string;
  updateTime: string;
  deleteTime: string | null;
  order: number;
  category: IGoodsCategory;
  goodsBanner: IGoodsBannerItem[];
  goodsAttrs: any[];
  goodsSkus: IGoodsSkuItem[]; // 一组 sku 组合
  goodsSkusCard: IGoodsSkusCardItem[];
}

/** 最终响应 */
export interface GoodsListResponse {
  cates: ICateItem[];
  list: IGoodsListItem[];
  totalCount: number;
}

export interface GoodsPayload {
  title: string;
  categoryId: number;
  cover: string;
  description: string;
  unit: string;
  stock: number;
  minStock: number;
  status: number;
  stockDisplay: number;
  minPrice: number;
  minOprice: number;
}

export interface CreateGoodsPayload extends GoodsPayload {
  categoryIds: number[];
}

export interface UpdateGoodsPayload extends GoodsPayload {}

export const getGoodsList = (
  page: number = 1,
  payload: GetGoodsListPayload
) => {
  return goodsRequest.get<GoodsListResponse>(`admin/goods/${page}`, {
    params: payload,
  });
};

export const deleteGoods = (ids: number | number[]) => {
  const arr = Array.isArray(ids) ? ids : [ids];
  return goodsRequest.post("admin/goods/delete_all", { ids: arr });
};

export const updateGoodsStatus = (ids: number | number[], status: number) => {
  const arr = Array.isArray(ids) ? ids : [ids];
  return goodsRequest.post("admin/goods/changestatus", { ids: arr, status });
};

export const createGoods = (payload: CreateGoodsPayload) => {
  return goodsRequest.post("admin/goods", {
    ...payload,
  });
};

export const updateGoods = (id: number, payload: UpdateGoodsPayload) => {
  return goodsRequest.post(`admin/goods/${id}`, { ...payload });
};

export const readGoods = (id: number) => {
  return goodsRequest.get<IGoodsListItem>(`admin/goods/read/${id}`);
};

export const updateGoodsBanners = (id: number, banners: string[]) => {
  return goodsRequest.post(`admin/goods/banners/${id}`, { banners });
};

export const updateGoodsContent = (id: number, content: string) => {
  return goodsRequest.post(`admin/goods/updateContent/${id}`, { content });
};

export const checkGoods = (id: number, ischeck: number) => {
  return goodsRequest.post(`admin/goods/${id}/check`, { ischeck });
};

export const restoreGoods = (ids: number[] | number) => {
  return goodsRequest.post("admin/goods/restore", { ids });
};

export const deleteGoodsForce = (ids: number[] | number) => {
  return goodsRequest.post("admin/goods/delete_force", { ids });
};
