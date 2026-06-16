export type Vector3Value = {
  x: number;
  y: number;
  z: number;
};

export type SceneContentHotspotType =
  | "info"
  | "image"
  | "video"
  | "model3d"
  | "external_link";

export type SceneContentHotspot = {
  id: string;
  title: string;
  type: SceneContentHotspotType;
  description?: string;
  externalUrl?: string;
  mediaUrl?: string;
  position: Vector3Value;
};

export type SceneModelSettings = Record<string, unknown> & {
  hotspots?: SceneContentHotspot[];
  interaction?: {
    hoverEffect?: "none" | "scale" | "float";
    hoverScale?: number;
    clickEnabled?: boolean;
    draggable?: boolean;
    dragReturn?: boolean;
  };
  clickContent?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    videoUrl?: string;
  };
};

export type SceneModel = {
  id?: string;
  name: string;
  modelUrl: string;
  position: Vector3Value;
  rotation: Vector3Value;
  scale: Vector3Value;
  settings?: SceneModelSettings | null;
};

export type SceneTransitionPoint = {
  id: string;
  title: string;
  position: Vector3Value;
  targetType: "scene" | "panorama";
  targetId: string;
};

export type SceneSummary = {
  id: string;
  name: string;
};

export type SceneData = {
  id: string;
  name: string;
  description?: string | null;
  cameraView?: Record<string, unknown> | null;
  environment?: Record<string, unknown> | null;
  transitionPoints: SceneTransitionPoint[];
  parent?: SceneSummary | null;
  children: SceneSummary[];
  entityId?: string | null;
  models: SceneModel[];
};
