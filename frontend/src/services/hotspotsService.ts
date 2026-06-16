import { httpClient } from "../utils/httpClient";

const ENDPOINT = "/hotspots";

const normalizeHotspot = (hotspot: any) => ({
  ...hotspot,
  targetPanoramaId:
    hotspot.targetPanoramaId ?? hotspot.targetPanorama?.id ?? null,
});

export const fetchAll = async (params?: any) => {
  const { data } = await httpClient.get(ENDPOINT, { params });
  return Array.isArray(data) ? data.map(normalizeHotspot) : [];
};

export const fetchById = async (id: string) => {
  const { data } = await httpClient.get(`${ENDPOINT}/${id}`);
  return normalizeHotspot(data);
};

export const create = async (payload: any) => {
  const { data } = await httpClient.post(ENDPOINT, payload);
  return normalizeHotspot(data);
};

export const update = async (id: string, payload: any) => {
  const { data } = await httpClient.patch(`${ENDPOINT}/${id}`, payload);
  return normalizeHotspot(data);
};

export const remove = async (id: string) => {
  await httpClient.delete(`${ENDPOINT}/${id}`);
};
