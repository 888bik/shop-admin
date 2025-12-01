import { ruleRequests } from "..";

export interface IRuleItem {
  id: number;
  menu: number; //1是菜单
  method: "GET" | "POST" | "DELETE" | "PUT";
  name: string; //菜单权限名称
  order: number; //排序
  rule_id: number; //上级菜单id
  status: number;
  create_time: string;
  update_time: string;
  desc: string;
  frontpath: string;
  icon: string;
  condition: any;
  child: IRuleItem[];
}

export interface RuleListResponse {
  list: IRuleItem[];
  rules: IRuleItem[];
  totalCount: number;
}

export interface RulePayload {
  rule_id: number;
  menu: number;
  name: string;
  condition: string;
  method: string;
  status: number;
  order: number;
  icon: string;
  frontpath: string;
}

export const getRuleList = () => {
  return ruleRequests.get<RuleListResponse>("admin/rule/1");
};

export const createRule = (payload: RulePayload) => {
  return ruleRequests.post("admin/rule", { ...payload });
};

export const updateRule = (payload: RulePayload) => {
  return ruleRequests.post("admin/rule/193", { ...payload });
};

export const deleteRule = (id: number) => {
  return ruleRequests.post(`admin/rule/${id}/delete`);
};

export const updateRuleStatus = (id: number, status: number) => {
  return ruleRequests.post(`admin/rule/${id}/update_status`, { status });
};
