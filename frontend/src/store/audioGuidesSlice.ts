import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as audioGuidesService from "../services/audioGuidesService";
import type { RootState } from "./store";

export const fetchAllAudioGuides = createAsyncThunk("audioGuides/fetchAll", async (params?: any) => {
  return audioGuidesService.fetchAll(params);
});

export const fetchAudioGuideById = createAsyncThunk("audioGuides/fetchById", async (id: string) => {
  return audioGuidesService.fetchById(id);
});

export const createAudioGuide = createAsyncThunk("audioGuides/create", async (payload: any) => {
  return audioGuidesService.create(payload);
});

export const updateAudioGuide = createAsyncThunk("audioGuides/update", async ({ id, dto }: { id: string; dto: any }) => {
  return audioGuidesService.update(id, dto);
});

export const removeAudioGuide = createAsyncThunk("audioGuides/remove", async (id: string) => {
  await audioGuidesService.remove(id);
  return id;
});

type AudioGuidesState = {
  items: any[];
  playingId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AudioGuidesState = {
  items: [],
  playingId: null,
  status: "idle",
  error: null,
};

const audioGuidesSlice = createSlice({
  name: "audioGuides",
  initialState,
  reducers: {
    setPlayingGuide(state, action: PayloadAction<string | null>) {
      state.playingId = action.payload;
    },
    clearAudioGuidesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAudioGuides.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllAudioGuides.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllAudioGuides.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách audio guides";
      });

    builder.addCase(fetchAudioGuideById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createAudioGuide.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateAudioGuide.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeAudioGuide.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.playingId === action.payload) {
        state.playingId = null;
      }
    });
  },
});

export const { setPlayingGuide, clearAudioGuidesError } = audioGuidesSlice.actions;

export const selectAudioGuides = (state: RootState) => state.audioGuides.items;
export const selectAudioGuidesStatus = (state: RootState) => state.audioGuides.status;

export default audioGuidesSlice.reducer;
