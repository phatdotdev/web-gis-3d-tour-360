import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/media-files";

export const fetchAll = async (params?: any) => {
  const { data } = await httpClient.get(ENDPOINT, { params });
  return data;
};

export const fetchById = async (id: string) => {
  const { data } = await httpClient.get(`${ENDPOINT}/${id}`);
  return data;
};

export const upload = async (file: File, params: any = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      formData.append(key, String(value));
    }
  });
  
  const { data } = await httpClient.post(`${ENDPOINT}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const remove = async (id: string) => {
  await httpClient.delete(`${ENDPOINT}/${id}`);
};
