export interface MenuItem {
  id: number;
  ruleId: number;
  status: number;
  createTime: string;
  updateTime: string;
  name: string;
  desc: string;
  frontpath: any;
  condition: any;
  menu: number;
  order: number;
  icon: string;
  method: string;
  child?: MenuItem[];
}

export interface Role {
  id: number;
  name: string;
}

// export interface MenuItem {
//   id: number;
//   rule_id: number;
//   status: number;
//   create_time: string;
//   update_time: string;
//   name: string;
//   desc: string | null;
//   frontpath: string | null;
//   condition: string | null;
//   menu: number;
//   order: number;
//   icon: string;
//   method: string;
//   child: MenuItem[];
// }

export interface IUser {
  id: number;
  username: string;
  avatar: string;
  super: number;
  role: Role;
  menus: MenuItem[];
  ruleNames: string[];
}

export interface UserState {
  user: IUser | null;
  menus: MenuItem[];
  asideWidth: string;
  hasRoutes: boolean;
  ruleNames: string[];
}
