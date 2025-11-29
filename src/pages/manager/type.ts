export interface IRole {
  id: number;
  name: string;
}
export interface IManagerItem {
  id: number;
  avatar: string;
  role: IRole;
  roleId: number;
  status: number;
  super: number;
  username: string;
  createTime: string;
  updateTime: string;
}

export interface IManagerData {
  list: IManagerItem[];
  totalCount: number;
  roles: IRole[];
}

export interface RuleFormManger {}
