import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "./mapSlice";
import regionsReducer from "./regionsSlice";
import categoriesReducer from "./categoriesSlice";
import mediaFilesReducer from "./mediaFilesSlice";
import spatialEntitiesReducer from "./spatialEntitiesSlice";
import virtualToursReducer from "./virtualToursSlice";
import panoramasReducer from "./panoramasSlice";
import hotspotsReducer from "./hotspotsSlice";
import audioGuidesReducer from "./audioGuidesSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    regions: regionsReducer,
    categories: categoriesReducer,
    mediaFiles: mediaFilesReducer,
    spatialEntities: spatialEntitiesReducer,
    virtualTours: virtualToursReducer,
    panoramas: panoramasReducer,
    hotspots: hotspotsReducer,
    audioGuides: audioGuidesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
