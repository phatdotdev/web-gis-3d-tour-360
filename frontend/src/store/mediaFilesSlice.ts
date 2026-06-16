import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as mediaFilesService from "../services/mediaFilesService";
import type { RootState } from "./store";

export const fetchAllMediaFiles = createAsyncThunk("mediaFiles/fetchAll", async (params?: any) => {
  return mediaFilesService.fetchAll(params);
});

export const fetchMediaFileById = createAsyncThunk("mediaFiles/fetchById", async (id: string) => {
  return mediaFilesService.fetchById(id);
});

export const uploadMediaFile = createAsyncThunk("mediaFiles/upload", async ({ file, params }: { file: File; params?: any }) => {
  return mediaFilesService.upload(file, params);
});

export const removeMediaFile = createAsyncThunk("mediaFiles/remove", async (id: string) => {
  await mediaFilesService.remove(id);
  return id;
});

type MediaFilesState = {
  items: any[];
  selectedId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: MediaFilesState = {
  items: [],
  selectedId: null,
  status: "idle",
  error: null,
};

const mediaFilesSlice = createSlice({
  name: "mediaFiles",
  initialState,
  reducers: {
    setSelectedMediaFile(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearMediaFilesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMediaFiles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllMediaFiles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllMediaFiles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách media files";
      });

    builder.addCase(fetchMediaFileById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(uploadMediaFile.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(removeMediaFile.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    });
  },
});

export const { setSelectedMediaFile, clearMediaFilesError } = mediaFilesSlice.actions;

export const selectMediaFiles = (state: RootState) => state.mediaFiles.items;
export const selectMediaFilesStatus = (state: RootState) => state.mediaFiles.status;

export default mediaFilesSlice.reducer;
