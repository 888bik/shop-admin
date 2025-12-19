import { ordersRequest } from "..";

export interface IOrderItems {
  goodsId: number;
  goodsTitle: string;
  goodsCover: string;
  num: number;
  price: number;
  skusType: number;
  goodsItem: any;
  goodsSkus: any;
}

export interface IUser {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
}
export interface IAddress {
  id: number;
  userId: number;
  province: string;
  city: string;
  district: string;
  address: string;
  zip: string;
  name: string;
  phone: string;
}
export interface IExtra {
  shipping: {
    type: string;
    name: string;
    fee: number;
  };
}
export interface IShipData {
  shippedTime: number;
  trackingNo: string;
  company: {
    code: string;
    name: string;
    id: number;
  };
}

export interface IOrderItem {
  orderId: number;
  orderNo: string;
  user: IUser;
  address: IAddress;
  items: IOrderItems[];
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  payStatus: string;
  paidTime: number | null;
  paymentMethod: string | null;
  paymentNo: string | null;
  refundStatus: string;
  refundNo: string;
  closed: boolean;
  shipStatus: string;
  shipData: IShipData;
  extra: IExtra;
  remark: string;
  reviewed: boolean;
  createTime: number;
}

export interface OrdersListResponse {
  list: any;
  totalCount: number;
}

export interface ShipDataResponse {
  company: {
    id: number;
    name: string;
    code: string;
  };
  shipping: {
    fee: number;
    name: string;
    type: string;
  };
  history: {
    time: string;
    status: string;
    location: string;
    desc: string;
  }[];
  trackingNo: string;
}

export const getOrdersList = (
  page: number = 1,
  limit: number = 10,
  query?: { no?: string; phone?: string; tab?: string }
) => {
  return ordersRequest.get<OrdersListResponse>(`admin/orders`, {
    params: { page, limit, ...query },
  });
};

export const shipOrder = (
  id: number,
  expressCompanyId: number,
  expressNo: string
) => {
  return ordersRequest.post(`admin/orders/${id}/ship`, {
    expressCompanyId,
    expressNo,
  });
};

export const getShipData = (id: number) => {
  return ordersRequest.get<ShipDataResponse>(`admin/orders/${id}/ship`);
};
