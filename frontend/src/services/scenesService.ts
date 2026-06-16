import type { SceneData, SceneModel, SceneTransitionPoint } from "../types/scene";
import { httpClient } from "../utils/httpClient";

type ScenePayload = {
  name: string;
  description?: string | null;
  cameraView?: Record<string, unknown> | null;
  environment?: Record<string, unknown> | null;
  transitionPoints?: SceneTransitionPoint[];
  models?: SceneModel[];
};

const normalizeScene = (scene: SceneData): SceneData => ({
  ...scene,
  children: scene.children ?? [],
  models: scene.models ?? [],
  transitionPoints: (scene.transitionPoints ?? []).map((point: any) => {
    const targetType =
      point.targetType ??
      (point.targetSceneId ? "scene" : "panorama");
    return {
      ...point,
      title: point.title ?? point.name ?? "Chuyển cảnh",
      targetType,
      targetId:
        point.targetId ??
        (targetType === "scene"
          ? point.targetSceneId
          : point.targetPanoramaId) ??
        "",
    };
  }),
});

export const fetchSceneByEntity = async (entityId: string) => {
  const { data } = await httpClient.get<SceneData>(`/scenes/entity/${entityId}`);
  return normalizeScene(data);
};

export const fetchSceneById = async (id: string) => {
  const { data } = await httpClient.get<SceneData>(`/scenes/${id}`);
  return normalizeScene(data);
};

export const createSceneForEntity = async (
  entityId: string,
  payload: ScenePayload,
) => {
  const { data } = await httpClient.post<SceneData>("/scenes/entity", {
    entityId,
    ...payload,
  });
  return normalizeScene(data);
};

export const createChildScene = async (
  parentId: string,
  payload: ScenePayload,
) => {
  const { data } = await httpClient.post<SceneData>(
    `/scenes/${parentId}/children`,
    payload,
  );
  return normalizeScene(data);
};

export const updateScene = async (id: string, payload: ScenePayload) => {
  const { data } = await httpClient.patch<SceneData>(`/scenes/${id}`, payload);
  return normalizeScene(data);
};

export const removeScene = async (id: string) => {
  await httpClient.delete(`/scenes/${id}`);
};

export const uploadSceneModel = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await httpClient.post<{ url: string }>(
    "/scenes/upload-model",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};
