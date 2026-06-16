import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/spatial-entities";

export const fetchAll = async (params?: any) => {
  const { data } = await httpClient.get(ENDPOINT, { params });
  return data;
};

export const fetchById = async (id: string) => {
  const { data } = await httpClient.get(`${ENDPOINT}/${id}`);
  return data;
};

export const fetchManaged = async () => {
  const { data } = await httpClient.get(`${ENDPOINT}/managed`);
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

export const uploadModel = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post(`${ENDPOINT}/${id}/upload-model`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const uploadIcon = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post(`${ENDPOINT}/${id}/upload-icon`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
