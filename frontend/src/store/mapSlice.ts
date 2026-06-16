import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { DEFAULT_BASEMAP_STYLE } from "../constants/mapDefaults";
import { GROUND_OPACITY_DEFAULT } from "../constants/pipeDefaults";
import type { BackendLayer, BackendSpatialEntity } from "../types/backend";
import type { MapViewState, TerrainMode, ViewMode } from "../types/map";
import type { BasemapStyle } from "../utils/basemapStyles";
import { getEntityCenter } from "../utils/geometry";
import {
  fetchLayers as fetchLayersApi,
  createLayer as createLayerApi,
  updateLayer as updateLayerApi,
  deleteLayer as deleteLayerApi,
  uploadLayerGeoJson as uploadLayerGeoJsonApi,
  uploadLayerModel as uploadLayerModelApi,
  uploadLayerIcon as uploadLayerIconApi,
  updateSpatialEntity as updateSpatialEntityApi,
  deleteSpatialEntity as deleteSpatialEntityApi,
} from "../utils/backendApi";
import type { RootState } from "./store";

type LayerStatus = "loading" | "ready" | "error";

type MapState = {
  viewMode: ViewMode;
  terrainEnabled: boolean;
  terrainStyle: Exclude<TerrainMode, "flat">;
  basemapStyles: BasemapStyle[];
  basemapStyleId: string;
  viewState: MapViewState | null;
  groundOpacity: number;
  panelCollapsed: boolean;
  layers: BackendLayer[];
  selectedLayerIds: string[];
  layerStatus: LayerStatus;
  layerError: string | null;
  goToTarget: { longitude: number; latitude: number; zoom?: number } | null;
  showPositioningIcons: boolean;
  show3DModels: boolean;
};

type FileUploadPayload = {
  layerId: string;
  file: File;
};

type EntityPayload = {
  entityId: string;
  payload: Partial<BackendSpatialEntity>;
};

type CreateLayerWithFilesPayload = {
  layerPayload: Partial<BackendLayer>;
  geoJsonFile?: File | null;
  modelFile?: File | null;
  iconFile?: File | null;
};

const computeSelectedLayerIds = (
  prevSelected: string[],
  layers: BackendLayer[],
) => {
  const existing = prevSelected.filter((id) => layers.some((l) => l.id === id));
  if (existing.length > 0) return existing;
  const visible = layers
    .filter((layer) => layer.visible)
    .map((layer) => layer.id);
  return visible.length > 0 ? visible : layers.map((layer) => layer.id);
};

export const loadLayers = createAsyncThunk("map/loadLayers", async () => {
  return fetchLayersApi();
});

export const createLayer = createAsyncThunk(
  "map/createLayer",
  async (payload: Partial<BackendLayer>) => {
    await createLayerApi(payload);
    return fetchLayersApi();
  },
);

export const createLayerWithFiles = createAsyncThunk(
  "map/createLayerWithFiles",
  async ({
    layerPayload,
    geoJsonFile,
    modelFile,
    iconFile,
  }: CreateLayerWithFilesPayload) => {
    let createdLayer: BackendLayer;

    if (geoJsonFile) {
      createdLayer = await uploadLayerGeoJsonApi(geoJsonFile, layerPayload);
    } else {
      createdLayer = await createLayerApi(layerPayload);
    }

    if (modelFile) {
      await uploadLayerModelApi(createdLayer.id, modelFile);
    }
    if (iconFile) {
      await uploadLayerIconApi(createdLayer.id, iconFile);
    }

    return fetchLayersApi();
  },
);

export const updateLayer = createAsyncThunk(
  "map/updateLayer",
  async ({
    layerId,
    payload,
  }: {
    layerId: string;
    payload: Partial<BackendLayer>;
  }) => {
    await updateLayerApi(layerId, payload);
    return fetchLayersApi();
  },
);

export const deleteLayer = createAsyncThunk(
  "map/deleteLayer",
  async (layerId: string) => {
    await deleteLayerApi(layerId);
    return fetchLayersApi();
  },
);

export const uploadLayerModel = createAsyncThunk(
  "map/uploadLayerModel",
  async ({ layerId, file }: FileUploadPayload) => {
    await uploadLayerModelApi(layerId, file);
    return fetchLayersApi();
  },
);

export const uploadLayerIcon = createAsyncThunk(
  "map/uploadLayerIcon",
  async ({ layerId, file }: FileUploadPayload) => {
    await uploadLayerIconApi(layerId, file);
    return fetchLayersApi();
  },
);

export const uploadLayerGeoJson = createAsyncThunk(
  "map/uploadLayerGeoJson",
  async ({
    file,
    payload,
  }: {
    file: File;
    payload: Partial<BackendLayer>;
  }) => {
    await uploadLayerGeoJsonApi(file, payload);
    return fetchLayersApi();
  },
);

export const updateEntity = createAsyncThunk(
  "map/updateEntity",
  async ({ entityId, payload }: EntityPayload) => {
    await updateSpatialEntityApi(entityId, payload);
    return fetchLayersApi();
  },
);

export const deleteEntity = createAsyncThunk(
  "map/deleteEntity",
  async (entityId: string) => {
    await deleteSpatialEntityApi(entityId);
    return fetchLayersApi();
  },
);

const initialState: MapState = {
  viewMode: "2d",
  terrainEnabled: true,
  terrainStyle: "world-elevation",
  basemapStyles: [],
  basemapStyleId: DEFAULT_BASEMAP_STYLE,
  viewState: null,
  groundOpacity: GROUND_OPACITY_DEFAULT,
  panelCollapsed: false,
  layers: [],
  selectedLayerIds: [],
  layerStatus: "loading",
  layerError: null,
  goToTarget: null,
  showPositioningIcons: true,
  show3DModels: true,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setViewMode(state, action) {
      state.viewMode = action.payload as ViewMode;
    },
    setTerrainEnabled(state, action) {
      state.terrainEnabled = action.payload as boolean;
    },
    setTerrainStyle(state, action) {
      state.terrainStyle = action.payload as Exclude<TerrainMode, "flat">;
    },
    setBasemapStyles(state, action) {
      state.basemapStyles = action.payload as BasemapStyle[];
    },
    setBasemapStyleId(state, action) {
      state.basemapStyleId = action.payload as string;
    },
    setViewState(state, action) {
      state.viewState = action.payload as MapViewState | null;
    },
    setGroundOpacity(state, action) {
      state.groundOpacity = action.payload as number;
    },
    setPanelCollapsed(state, action) {
      state.panelCollapsed = action.payload as boolean;
    },
    toggleLayerSelection(state, action) {
      const layerId = action.payload as string;
      state.selectedLayerIds = state.selectedLayerIds.includes(layerId)
        ? state.selectedLayerIds.filter((id) => id !== layerId)
        : [...state.selectedLayerIds, layerId];
    },
    selectAllLayers(state) {
      state.selectedLayerIds = state.layers.map((layer) => layer.id);
    },
    clearLayerSelection(state) {
      state.selectedLayerIds = [];
    },
    goToEntity(state, action) {
      const entity = action.payload as BackendSpatialEntity;
      const center = getEntityCenter(entity.geometry);
      if (center) {
        state.goToTarget = {
          longitude: center.lng,
          latitude: center.lat,
          zoom: 18,
        };
      }
    },
    setGoToTarget(state, action) {
      state.goToTarget = action.payload;
    },
    clearGoToTarget(state) {
      state.goToTarget = null;
    },
    setShowPositioningIcons(state, action) {
      state.showPositioningIcons = action.payload as boolean;
    },
    setShow3DModels(state, action) {
      state.show3DModels = action.payload as boolean;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLayers.pending, (state) => {
        state.layerStatus = "loading";
        state.layerError = null;
      })
      .addCase(loadLayers.fulfilled, (state, action) => {
        state.layers = action.payload as BackendLayer[];
        state.selectedLayerIds = computeSelectedLayerIds(
          state.selectedLayerIds,
          state.layers,
        );
        state.layerStatus = "ready";
        state.layerError = null;
      })
      .addCase(loadLayers.rejected, (state) => {
        state.layerStatus = "error";
        state.layerError = "Không tải được danh sách layer từ backend";
      });

    const refreshCases = [
      createLayer,
      createLayerWithFiles,
      updateLayer,
      deleteLayer,
      uploadLayerModel,
      uploadLayerIcon,
      uploadLayerGeoJson,
      updateEntity,
      deleteEntity,
    ];

    refreshCases.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.layerStatus = "loading";
          state.layerError = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.layers = action.payload as BackendLayer[];
          state.selectedLayerIds = computeSelectedLayerIds(
            state.selectedLayerIds,
            state.layers,
          );
          state.layerStatus = "ready";
          state.layerError = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.layerStatus = "error";
          state.layerError =
            (action.error?.message as string | undefined) ?? "Upload error";
        });
    });
  },
});

export const {
  setViewMode,
  setTerrainEnabled,
  setTerrainStyle,
  setBasemapStyles,
  setBasemapStyleId,
  setViewState,
  setGroundOpacity,
  setPanelCollapsed,
  toggleLayerSelection,
  selectAllLayers,
  clearLayerSelection,
  goToEntity,
  setGoToTarget,
  clearGoToTarget,
  setShowPositioningIcons,
  setShow3DModels,
} = mapSlice.actions;

export const selectViewMode = (s: RootState) => s.map.viewMode;
export const selectTerrainEnabled = (s: RootState) => s.map.terrainEnabled;
export const selectTerrainStyle = (s: RootState) => s.map.terrainStyle;
export const selectBasemapStyles = (s: RootState) => s.map.basemapStyles;
export const selectBasemapStyleId = (s: RootState) => s.map.basemapStyleId;
export const selectViewState = (s: RootState) => s.map.viewState;
export const selectGroundOpacity = (s: RootState) => s.map.groundOpacity;
export const selectPanelCollapsed = (s: RootState) => s.map.panelCollapsed;
export const selectLayers = (s: RootState) => s.map.layers;
export const selectSelectedLayerIds = (s: RootState) => s.map.selectedLayerIds;
export const selectLayerStatus = (s: RootState) => s.map.layerStatus;
export const selectLayerError = (s: RootState) => s.map.layerError;
export const selectGoToTarget = (s: RootState) => s.map.goToTarget;
export const selectShowPositioningIcons = (s: RootState) => s.map.showPositioningIcons;
export const selectShow3DModels = (s: RootState) => s.map.show3DModels;

export const selectEffectiveTerrain = (s: RootState): TerrainMode =>
  s.map.terrainEnabled ? s.map.terrainStyle : "flat";

export default mapSlice.reducer;
