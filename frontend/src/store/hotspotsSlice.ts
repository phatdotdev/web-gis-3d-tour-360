import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as hotspotsService from "../services/hotspotsService";
import type { RootState } from "./store";

export const fetchAllHotspots = createAsyncThunk("hotspots/fetchAll", async (params?: any) => {
  return hotspotsService.fetchAll(params);
});

export const fetchHotspotById = createAsyncThunk("hotspots/fetchById", async (id: string) => {
  return hotspotsService.fetchById(id);
});

export const createHotspot = createAsyncThunk("hotspots/create", async (payload: any) => {
  return hotspotsService.create(payload);
});

export const updateHotspot = createAsyncThunk("hotspots/update", async ({ id, dto }: { id: string; dto: any }) => {
  return hotspotsService.update(id, dto);
});

export const removeHotspot = createAsyncThunk("hotspots/remove", async (id: string) => {
  await hotspotsService.remove(id);
  return id;
});

type HotspotsState = {
  items: any[];
  selectedId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: HotspotsState = {
  items: [],
  selectedId: null,
  status: "idle",
  error: null,
};

const hotspotsSlice = createSlice({
  name: "hotspots",
  initialState,
  reducers: {
    setSelectedHotspot(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearHotspotsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllHotspots.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllHotspots.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllHotspots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách hotspots";
      });

    builder.addCase(fetchHotspotById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createHotspot.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateHotspot.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeHotspot.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    });
  },
});

export const { setSelectedHotspot, clearHotspotsError } = hotspotsSlice.actions;

export const selectHotspots = (state: RootState) => state.hotspots.items;
export const selectHotspotsStatus = (state: RootState) => state.hotspots.status;

export default hotspotsSlice.reducer;
