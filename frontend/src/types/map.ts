export type TerrainMode = "world-elevation" | "world-topobathymetry" | "flat";
export type ViewMode = "2d" | "3d";

export type MapViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  scale: number;
};
