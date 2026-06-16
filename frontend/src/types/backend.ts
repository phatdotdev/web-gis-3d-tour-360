export type BackendLayer = {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  minZoom: number;
  maxZoom: number;
  zIndex: number;
  elevation?: number | null;
  scale?: number | null;
  height?: number | null;
  modelUrl?: string | null;
  iconUrl?: string | null;
  dataUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  entities: BackendSpatialEntity[];
  extent?: { xmin: number; ymin: number; xmax: number; ymax: number } | null;
  renderer?: any;
  popupTemplate?: any;
  featureCollection?: any;
  vertexFeatureCollection?: any;
  dataStatus?: 'latest' | 'fallback';
  fallbackInfo?: {
    useFallbackData: boolean;
    reason?: string;
  } | null;
};


export type BackendSpatialEntity = {
  id: string;
  name?: string | null;
  type: string;
  renderType: string;
  geometry: unknown;
  elevation?: number | null;
  height?: number | null;
  width?: number | null;
  scale?: number | null;
  assetUrl?: string | null;
  iconUrl?: string | null;
  color?: string | null;
  opacity?: number | null;
  metadata?: Record<string, unknown> | null;
};
