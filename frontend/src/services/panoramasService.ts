import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/panoramas";

const normalizePanorama = (panorama: any) => ({
  ...panorama,
  name: panorama.name ?? panorama.title ?? "Panorama",
});

export const fetchAll = async (params?: any) => {
  const { data } = await httpClient.get(ENDPOINT, { params });
  return Array.isArray(data) ? data.map(normalizePanorama) : [];
};

export const fetchById = async (id: string) => {
  const { data } = await httpClient.get(`${ENDPOINT}/${id}`);
  return normalizePanorama(data);
};

export const create = async (payload: any) => {
  const { data } = await httpClient.post(ENDPOINT, payload);
  return normalizePanorama(data);
};

export const update = async (id: string, payload: any) => {
  const { data } = await httpClient.patch(`${ENDPOINT}/${id}`, payload);
  return normalizePanorama(data);
};

export const remove = async (id: string) => {
  await httpClient.delete(`${ENDPOINT}/${id}`);
};
