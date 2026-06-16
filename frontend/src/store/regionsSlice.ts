import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as regionsService from "../services/regionsService";
import type { RootState } from "./store";

export const fetchAllRegions = createAsyncThunk("regions/fetchAll", async () => {
  return regionsService.fetchAll();
});

export const fetchRegionById = createAsyncThunk("regions/fetchById", async (id: string) => {
  return regionsService.fetchById(id);
});

export const createRegion = createAsyncThunk("regions/create", async (payload: any) => {
  return regionsService.create(payload);
});

export const updateRegion = createAsyncThunk("regions/update", async ({ id, dto }: { id: string; dto: any }) => {
  return regionsService.update(id, dto);
});

export const removeRegion = createAsyncThunk("regions/remove", async (id: string) => {
  await regionsService.remove(id);
  return id;
});

type RegionsState = {
  items: any[];
  selectedId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: RegionsState = {
  items: [],
  selectedId: null,
  status: "idle",
  error: null,
};

const regionsSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {
    setSelectedRegion(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearRegionsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRegions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllRegions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllRegions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách khu vực";
      });

    builder.addCase(fetchRegionById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createRegion.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateRegion.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeRegion.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    });
  },
});

export const { setSelectedRegion, clearRegionsError } = regionsSlice.actions;

export const selectRegions = (state: RootState) => state.regions.items;
export const selectRegionsStatus = (state: RootState) => state.regions.status;

export default regionsSlice.reducer;
