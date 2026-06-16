import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as panoramasService from "../services/panoramasService";
import type { RootState } from "./store";

export const fetchAllPanoramas = createAsyncThunk("panoramas/fetchAll", async (params?: any) => {
  return panoramasService.fetchAll(params);
});

export const fetchPanoramaById = createAsyncThunk("panoramas/fetchById", async (id: string) => {
  return panoramasService.fetchById(id);
});

export const createPanorama = createAsyncThunk("panoramas/create", async (payload: any) => {
  return panoramasService.create(payload);
});

export const updatePanorama = createAsyncThunk("panoramas/update", async ({ id, dto }: { id: string; dto: any }) => {
  return panoramasService.update(id, dto);
});

export const removePanorama = createAsyncThunk("panoramas/remove", async (id: string) => {
  await panoramasService.remove(id);
  return id;
});

type PanoramasState = {
  items: any[];
  currentPanoramaId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: PanoramasState = {
  items: [],
  currentPanoramaId: null,
  status: "idle",
  error: null,
};

const panoramasSlice = createSlice({
  name: "panoramas",
  initialState,
  reducers: {
    setCurrentPanorama(state, action: PayloadAction<string | null>) {
      state.currentPanoramaId = action.payload;
    },
    clearPanoramasError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPanoramas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllPanoramas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllPanoramas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách panoramas";
      });

    builder.addCase(fetchPanoramaById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createPanorama.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updatePanorama.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removePanorama.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.currentPanoramaId === action.payload) {
        state.currentPanoramaId = null;
      }
    });
  },
});

export const { setCurrentPanorama, clearPanoramasError } = panoramasSlice.actions;

export const selectPanoramas = (state: RootState) => state.panoramas.items;
export const selectPanoramasStatus = (state: RootState) => state.panoramas.status;

export default panoramasSlice.reducer;
