import { goodsSkusRequest } from "..";
import type { IGoodsSkuItem, ISkuValue } from "./goods";

export interface UpdateGoodsSkusPayload {
  skuType: number;
  skuValue: ISkuValue;
  goodsSkus: IGoodsSkuItem[];
}

export interface SkusCardPayload {
  goodsId: number;
  name: string;
  order: number;
  type: number;
}

export interface CreateGoodsSkusCardPayload extends SkusCardPayload {}

export interface UpdateGoodsSkusCardPayload extends SkusCardPayload {}

export interface CreateGoodsSkusCardResponse
  extends CreateGoodsSkusCardPayload {
  id: number;
  goodsId: number;
  name: string;
  order: number;
  type: number;
}

interface UpdateSortPayload {
  sortData: { id: number; order: number }[];
}

export interface SkusCardValuePayload {
  goodsSkusCardId: number;
  name: string;
  order: number;
  value: string;
}

interface CreateSkusCardValuePayload extends SkusCardValuePayload {}

interface CreateSkusCardValueResponse extends SkusCardValuePayload {
  id: number;
}

interface UpdateSkusCardValuePayload extends SkusCardValuePayload {}

/**
 * 统一更新商品单规格和多规格的值
 * @param id
 * @param payload
 * @returns
 */
export const updateGoodsSkus = (
  id: number,
  payload: UpdateGoodsSkusPayload
) => {
  return goodsSkusRequest.post(`admin/goods_skus_card/updateskus/${id}`, {
    ...payload,
  });
};

/**
 * 删除商品多规格选项
 * @param id 商品id
 * @returns
 */
export const deleteGoodsSkusCard = (id: number) => {
  return goodsSkusRequest.post(`admin/goods_skus_card/${id}/delete`);
};

/**
 * 创建商品多规格选项
 * @param payload
 * @returns
 */
export const createGoodsSkusCard = (payload: CreateGoodsSkusCardPayload) => {
  return goodsSkusRequest.post<CreateGoodsSkusCardResponse>(
    `admin/goods_skus_card`,
    { ...payload }
  );
};

/**
 * 修改商品规格选项
 * @param id 选项id
 * @param payload
 * @returns
 */
export const updateGoodsSkusCard = (
  id: number,
  payload: UpdateGoodsSkusCardPayload
) => {
  return goodsSkusRequest.post(`admin/goods_skus_card/${id}`, { ...payload });
};

/**
 * 更新商品规格排序
 * @param sortData 排序后的数据
 * @returns
 */
export const updateGoodsSkusCardSort = (sortData: UpdateSortPayload) => {
  return goodsSkusRequest.post("admin/goods_skus_card/sort", sortData);
};

/**
 * 新增商品规格值
 * @param payload
 * @returns
 */
export const createGoodsSkusCardValue = (
  payload: CreateSkusCardValuePayload
) => {
  return goodsSkusRequest.post<CreateSkusCardValueResponse>(
    `admin/goods_skus_card/value`,
    { ...payload }
  );
};

/**
 * 删除规格选项值
 * @param id 选项值的id
 * @returns
 */
export const deleteGoodsSkusCardValue = (id: number) => {
  return goodsSkusRequest.post(`admin/goods_skus_card/${id}/deleteValue`);
};

export const updateGoodsSkusCardValue = (
  id: number,
  payload: UpdateSkusCardValuePayload
) => {
  return goodsSkusRequest.post(`admin/goods_skus_card/${id}/updateValue`, {
    ...payload,
  });
};
