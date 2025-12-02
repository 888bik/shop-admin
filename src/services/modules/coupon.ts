import { couponRequest } from "..";

export interface ICouponItem {
  id: number;
  name: string;
  order: number;
  status: number | string;
  total: number;
  type: number;
  used: number;
  value: number;
  desc: string;
  min_price: number;
  start_time: string;
  end_time: string;
  create_time: string;
  update_time: string;
  statusText?: string;
}

export interface CouponListResponse {
  list: ICouponItem[];
  totalCount: number;
}
interface CouponPayload {
  name: string;
  type: number;
  value: number;
  total: number;
  min_price: number;
  start_time: string;
  end_time: string;
  order: number;
  desc: string;
}

interface createCouponPayload extends CouponPayload {}

interface updateCouponPayload extends CouponPayload {}

export const getCouponList = (page: number) => {
  return couponRequest.get<CouponListResponse>(`admin/coupon/${page}`);
};

export const deleteCoupon = (id: number) => {
  return couponRequest.post(`admin/coupon/${id}/delete`);
};

export const createCoupon = (payload: createCouponPayload) => {
  return couponRequest.post("admin/coupon", { ...payload });
};

export const updateCoupon = (id: number, payload: updateCouponPayload) => {
  return couponRequest.post(`admin/coupon/${id}`, { ...payload });
};

export const updateCouponStatus = (id: number) => {
  return couponRequest.post(`admin/coupon/${id}/update_status`, { status: 0 });
};
