import { expressRequest } from "..";

export interface ICompaniesItem {
  id: number;
  name: string;
  code: string;
  order: number;
  createTime: number;
  updateTime: number;
}

export const getCompanies = () => {
  return expressRequest.get<ICompaniesItem[]>("admin/express/companies");
};
