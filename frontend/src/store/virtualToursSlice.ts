import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as virtualToursService from "../services/virtualToursService";
import type { RootState } from "./store";

export const fetchAllVirtualTours = createAsyncThunk("virtualTours/fetchAll", async (params?: any) => {
  return virtualToursService.fetchAll(params);
});

export const fetchVirtualTourById = createAsyncThunk("virtualTours/fetchById", async (id: string) => {
  return virtualToursService.fetchById(id);
});

export const createVirtualTour = createAsyncThunk("virtualTours/create", async (payload: any) => {
  return virtualToursService.create(payload);
});

export const updateVirtualTour = createAsyncThunk("virtualTours/update", async ({ id, dto }: { id: string; dto: any }) => {
  return virtualToursService.update(id, dto);
});

export const removeVirtualTour = createAsyncThunk("virtualTours/remove", async (id: string) => {
  await virtualToursService.remove(id);
  return id;
});

type VirtualToursState = {
  items: any[];
  activeTourId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: VirtualToursState = {
  items: [],
  activeTourId: null,
  status: "idle",
  error: null,
};

const virtualToursSlice = createSlice({
  name: "virtualTours",
  initialState,
  reducers: {
    setActiveTour(state, action: PayloadAction<string | null>) {
      state.activeTourId = action.payload;
    },
    clearVirtualToursError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVirtualTours.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllVirtualTours.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllVirtualTours.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách virtual tours";
      });

    builder.addCase(fetchVirtualTourById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createVirtualTour.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateVirtualTour.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeVirtualTour.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.activeTourId === action.payload) {
        state.activeTourId = null;
      }
    });
  },
});

export const { setActiveTour, clearVirtualToursError } = virtualToursSlice.actions;

export const selectVirtualTours = (state: RootState) => state.virtualTours.items;
export const selectVirtualToursStatus = (state: RootState) => state.virtualTours.status;

export default virtualToursSlice.reducer;
