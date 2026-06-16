import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/users";

export const fetchAll = async (params?: any) => {
  const { data } = await httpClient.get(ENDPOINT, { params });
  return data;
};

export const fetchById = async (id: string) => {
  const { data } = await httpClient.get(`${ENDPOINT}/${id}`);
  return data;
};

export const create = async (payload: any) => {
  const { data } = await httpClient.post(ENDPOINT, payload);
  return data;
};

export const update = async (id: string, payload: any) => {
  const { data } = await httpClient.patch(`${ENDPOINT}/${id}`, payload);
  return data;
};

export const updateRole = async (id: string, role: string) => {
  const { data } = await httpClient.patch(`${ENDPOINT}/${id}/role`, { role });
  return data;
};

export const updateStatus = async (id: string, status: string) => {
  const { data } = await httpClient.patch(`${ENDPOINT}/${id}/status`, { status });
  return data;
};

export const remove = async (id: string) => {
  await httpClient.delete(`${ENDPOINT}/${id}`);
};

export const getRoles = async () => {
  const { data } = await httpClient.get(`${ENDPOINT}/roles`);
  return data;
};
