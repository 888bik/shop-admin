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
