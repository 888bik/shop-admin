import { ruleRequest } from "..";

export interface IRuleItem {
  id: number;
  menu: number; //1是菜单
  method: "GET" | "POST" | "DELETE" | "PUT";
  name: string; //菜单权限名称
  order: number; //排序
  ruleId: number; //上级菜单id
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
  ruleId: number;
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
  return ruleRequest.get<RuleListResponse>("admin/rule/1");
};

export const createRule = (payload: RulePayload) => {
  return ruleRequest.post("admin/rule", { ...payload });
};

export const updateRule = (id: number, payload: RulePayload) => {
  return ruleRequest.post(`admin/rule/${id}`, { ...payload });
};

export const deleteRule = (id: number) => {
  return ruleRequest.post(`admin/rule/${id}/delete`);
};

export const updateRuleStatus = (id: number, status: number) => {
  return ruleRequest.post(`admin/rule/${id}/update_status`, { status });
};

export const setRules = (id: number, rule_ids: number[]) => {
  return ruleRequest.post("admin/role/set_rules", { id, rule_ids });
};
