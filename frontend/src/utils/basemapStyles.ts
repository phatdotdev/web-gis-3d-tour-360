type BasemapStyle = {
  id: string;
  name: string;
};

const CURATED_BASEMAP_STYLES: BasemapStyle[] = [
  { id: "arcgis/navigation", name: "Navigation" },
  { id: "arcgis/imagery", name: "Imagery" },
  { id: "arcgis/topographic", name: "Topographic" },
  { id: "arcgis/light-gray", name: "Light Gray" },
  { id: "arcgis/dark-gray", name: "Dark Gray" },
];

export const loadBasemapStyles = async (signal?: AbortSignal) => {
  if (signal?.aborted) {
    return [];
  }
  return CURATED_BASEMAP_STYLES;
};

export type { BasemapStyle };
