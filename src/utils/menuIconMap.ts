import {
  Bell,
  HomeFilled,
  ShoppingCart,
  ShoppingCartFull,
  Goods,
  Menu,
  Aim,
  Postcard,
  User,
  UserFilled,
  DataAnalysis,
  Reading,
  Comment,
  Setting,
  Management,
  Coordinate,
  Connection,
  Histogram,
  Baseball,
  CreditCard,
  Bicycle,
  MostlyCloudy,
  PictureFilled,
  Notification,
  Service,
  Help,
  ChatDotRound,
} from "@element-plus/icons-vue";

/**
 * 后端 icon 字段 → Element Plus Icon 组件
 * key：后端返回的 icon
 * value：Element Plus 图标组件
 */
export const menuIconMap: Record<string, any> = {
  /** 后台面板 */
  help: Help,
  "home-filled": HomeFilled,

  /** 商品管理 */
  "shopping-bag": Goods,
  "shopping-cart-full": ShoppingCartFull,
  menu: Menu,
  aim: Aim,
  postcard: Postcard,

  /** 用户管理 */
  user: User,
  "user-filled": UserFilled,
  "data-analysis": DataAnalysis,

  /** 订单管理 */
  "message-box": Reading,
  reading: Reading,
  comment: Comment,

  /** 管理员管理 */
  management: Management,
  coordinate: Coordinate,
  connection: Connection,
  histogram: Histogram,

  /** 系统设置 */
  setting: Setting,
  baseball: Baseball,
  "credit-card": CreditCard,
  bicycle: Bicycle,

  /** 分销模块 */
  "shopping-cart": ShoppingCart,

  /** 其他模块 */
  "mostly-cloudy": MostlyCloudy,
  "picture-filled": PictureFilled,
  notification: Notification,

  Bell: Bell,
  service: Service,
  ChatDotRound: ChatDotRound,
};
