import { roleRequest } from "..";

interface IRuleItem {
  id: number;
  pivot: {
    id: number;
    role_id: number;
    ruleId: number;
  };
}

export interface IRoleItem {
  id: number;
  name: string;
  status: number;
  create_time: string;
  update_time: string;
  desc: string;
  rules: IRuleItem[];
}

export interface RoleListResponse {
  totalCount: number;
  list: IRoleItem[];
}

interface RolePayload {
  name: string;
  status: number;
  desc: string;
}

interface createRolePayload extends RolePayload {}
interface updateRolePayload extends RolePayload {}

export const getRoleList = (page: number = 1) => {
  return roleRequest.get<RoleListResponse>(`admin/role/${page}`);
};

export const createRole = (payload: createRolePayload) => {
  return roleRequest.post("admin/role", { ...payload });
};

export const deleteRole = (id: number) => {
  return roleRequest.post(`/admin/role/${id}/delete`);
};

export const updateRoleStatus = (id: number, status: number) => {
  return roleRequest.post(`admin/role/${id}/update_status`, { status });
};

export const updateRole = (id: number, payload: updateRolePayload) => {
  return roleRequest.post(`admin/role/${id}`, { ...payload });
};
