import type { BackendLayer } from "../types/backend";
import type { BackendSpatialEntity } from "../types/backend";

const rawBaseUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

const normalizeHost = (value?: string) => {
  const trimmed = value?.replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000";
  return trimmed.endsWith("/api") ? trimmed.slice(0, -4) : trimmed;
};

export const backendHost = normalizeHost(rawBaseUrl);

const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.replace(/\/$/, "");
  if (!trimmed) return "http://localhost:3000/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const baseUrl = normalizeBaseUrl(rawBaseUrl);

export const fetchLayers = async (signal?: AbortSignal) => {
  const response = await fetch(`${baseUrl}/layers`, { signal });
  if (!response.ok) {
    throw new Error("Failed to load layers");
  }
  return (await response.json()) as BackendLayer[];
};

export const createLayer = async (payload: Partial<BackendLayer>) => {
  const response = await fetch(`${baseUrl}/layers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to create layer");
  }
  return (await response.json()) as BackendLayer;
};

export const updateLayer = async (
  layerId: string,
  payload: Partial<BackendLayer>,
) => {
  const response = await fetch(`${baseUrl}/layers/${layerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to update layer");
  }
  return (await response.json()) as BackendLayer;
};

export const deleteLayer = async (layerId: string) => {
  const response = await fetch(`${baseUrl}/layers/${layerId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete layer");
  }
  return (await response.json()) as { deleted: boolean };
};

export const uploadLayerModel = async (layerId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${baseUrl}/layers/${layerId}/upload-model`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload model");
  }
  return (await response.json()) as BackendLayer;
};

export const uploadLayerIcon = async (layerId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${baseUrl}/layers/${layerId}/upload-icon`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload icon");
  }
  return (await response.json()) as BackendLayer;
};

export const uploadLayerGeoJson = async (
  file: File,
  payload: Partial<BackendLayer> = {},
) => {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(payload).forEach(([key, value]) => {
    if (value == null) return;
    formData.append(key, String(value));
  });
  const response = await fetch(`${baseUrl}/layers/upload-geojson`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload geojson");
  }
  return (await response.json()) as BackendLayer;
};

export const updateSpatialEntity = async (
  entityId: string,
  payload: Partial<BackendSpatialEntity> & { layerId?: string },
) => {
  const response = await fetch(`${baseUrl}/spatial-entities/${entityId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to update entity");
  }
  return (await response.json()) as BackendSpatialEntity;
};

export const deleteSpatialEntity = async (entityId: string) => {
  const response = await fetch(`${baseUrl}/spatial-entities/${entityId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete entity");
  }
  return (await response.json()) as { deleted: boolean };
};
