import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/regions";

export const fetchAll = async () => {
  const { data } = await httpClient.get(ENDPOINT);
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

export const remove = async (id: string) => {
  await httpClient.delete(`${ENDPOINT}/${id}`);
};
