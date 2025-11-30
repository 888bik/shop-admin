import { ruleRequests } from "..";

export interface IRuleItem {
  id: number;
  menu: number;
  method: "GET" | "POST" | "DELETE" | "PUT";
  name: string;
  order: number;
  rule_id: number;
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

export const getRuleList = () => {
  return ruleRequests.get<RuleListResponse>("admin/rule/1");
};
