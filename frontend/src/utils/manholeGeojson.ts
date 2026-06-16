import { MANHOLE_GEOJSON_URL } from "../constants/manholeDefaults";

type ManholeGeoJsonFeature = {
  type: "Feature";
  id?: number | string;
  geometry: {
    type: "Point";
    coordinates: number[];
  };
  properties?: Record<string, unknown> | null;
};

type ManholeGeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: ManholeGeoJsonFeature[];
};

const normalizeManholeGeoJson = (input: ManholeGeoJsonFeatureCollection) => {
  const normalizedFeatures = input.features
    .filter((feature) => feature.geometry?.type === "Point")
    .map((feature, index) => {
      const properties = feature.properties ?? {};
      const [longitude, latitude] = feature.geometry.coordinates ?? [];
      const objectId =
        typeof properties.OBJECTID === "number" ||
        typeof properties.OBJECTID === "string"
          ? properties.OBJECTID
          : undefined;

      return {
        ...feature,
        id: feature.id ?? objectId ?? index + 1,
        properties: {
          ...properties,
          Longitude: longitude,
          Latitude: latitude,
        },
      };
    });

  return {
    type: "FeatureCollection",
    features: normalizedFeatures,
  } satisfies ManholeGeoJsonFeatureCollection;
};

export const loadManholeGeoJson = async (signal?: AbortSignal) => {
  const response = await fetch(MANHOLE_GEOJSON_URL, { signal });
  if (!response.ok) {
    throw new Error("Failed to load manhole geojson");
  }

  const data = (await response.json()) as ManholeGeoJsonFeatureCollection;
  return normalizeManholeGeoJson(data);
};

export const createManholeBlobUrl = (data: ManholeGeoJsonFeatureCollection) => {
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/geo+json",
  });

  return URL.createObjectURL(blob);
};
