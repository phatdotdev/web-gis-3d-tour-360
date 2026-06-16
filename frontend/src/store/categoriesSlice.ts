import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import * as categoriesService from "../services/categoriesService";
import type { RootState } from "./store";

export const fetchAllCategories = createAsyncThunk("categories/fetchAll", async () => {
  return categoriesService.fetchAll();
});

export const fetchCategoryById = createAsyncThunk("categories/fetchById", async (id: string) => {
  return categoriesService.fetchById(id);
});

export const createCategory = createAsyncThunk("categories/create", async (payload: any) => {
  return categoriesService.create(payload);
});

export const updateCategory = createAsyncThunk("categories/update", async ({ id, dto }: { id: string; dto: any }) => {
  return categoriesService.update(id, dto);
});

export const removeCategory = createAsyncThunk("categories/remove", async (id: string) => {
  await categoriesService.remove(id);
  return id;
});

type CategoriesState = {
  items: any[];
  selectedId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  selectedId: null,
  status: "idle",
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    clearCategoriesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Không thể tải danh sách danh mục";
      });

    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });

    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const idx = state.items.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    });

    builder.addCase(removeCategory.fulfilled, (state, action) => {
      state.items = state.items.filter((e) => e.id !== action.payload);
      if (state.selectedId === action.payload) {
        state.selectedId = null;
      }
    });
  },
});

export const { setSelectedCategory, clearCategoriesError } = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesStatus = (state: RootState) => state.categories.status;

export default categoriesSlice.reducer;
