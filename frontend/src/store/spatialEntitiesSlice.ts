import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as spatialEntitiesService from "../services/spatialEntitiesService";
import type { RootState } from "./store";

export const fetchAllSpatialEntities = createAsyncThunk("spatialEntities/fetchAll", async (params?: any) => {
  return spatialEntitiesService.fetchAll(params);
});

export const fetchSpatialEntityById = createAsyncThunk("spatialEntities/fetchById", async (id: string) => {
  return spatialEntitiesService.fetchById(id);
});

export const fetchManagedSpatialEntities = createAsyncThunk("spatialEntities/fetchManaged", async () => {
  return spatialEntitiesService.fetchManaged();
});

export const createSpatialEntity = createAsyncThunk("spatialEntities/create", async (payload: any) => {
  return spatialEntitiesService.create(payload);
});

export const updateSpatialEntity = createAsyncThunk("spatialEntities/update", async ({ id, dto }: { id: string; dto: any }) => {
  return spatialEntitiesService.update(id, dto);
});

export const removeSpatialEntity = createAsyncThunk("spatialEntities/remove", async (id: string) => {
  await spatialEntitiesService.remove(id);
  return id;
});

type SpatialEntitiesState = {
  items: any[];
  selectedId: string | null;
  activeEntityQuery: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: SpatialEntitiesState = {
  items: [],
  selectedId: null,
  activeEntityQuery: null,
  status: "idle",
  error: null,
};

const spatialEntitiesSlice = createSlice({
  name: "spatialEntities",
  initialState,
  reducers: {
    setSelectedEntity(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    setActiveEntityQuery(state, action: PayloadAction<any | null>) {
      state.activeEntityQuery = action.payload;
    },
    clearSpatialEntitiesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpatialEntities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllSpatialEntities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllSpatialEntities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách địa điểm";
      });

    builder
      .addCase(fetchManagedSpatialEntities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchManagedSpatialEntities.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchManagedSpatialEntities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách địa điểm quản lý";
      });

    builder.addCase(fetchSpatialEntityById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createSpatialEntity.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateSpatialEntity.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeSpatialEntity.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    });
  },
});

export const { setSelectedEntity, setActiveEntityQuery, clearSpatialEntitiesError } = spatialEntitiesSlice.actions;

export const selectSpatialEntities = (state: RootState) => state.spatialEntities.items;
export const selectSelectedSpatialEntityId = (state: RootState) => state.spatialEntities.selectedId;
export const selectSpatialEntitiesStatus = (state: RootState) => state.spatialEntities.status;

export default spatialEntitiesSlice.reducer;
