import {
  DEFAULT_DEPTH_METERS,
  DEFAULT_DIAMETER_METERS,
  PIPE_GEOJSON_URL,
} from "../constants/pipeDefaults";

type PipeGeoJsonFeature = {
  type: "Feature";
  id?: number | string;
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties?: Record<string, unknown> | null;
};

type PipeGeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: PipeGeoJsonFeature[];
};

const normalizePipeGeoJson = (input: PipeGeoJsonFeatureCollection) => {
  const normalizedFeatures = input.features
    .filter((feature) => feature.geometry?.type === "LineString")
    .map((feature, index) => {
      const properties = feature.properties ?? {};
      const objectId =
        typeof properties.OBJECTID === "number" ||
        typeof properties.OBJECTID === "string"
          ? properties.OBJECTID
          : undefined;
      const rawDiameter = Number(properties.DuongKinh);
      const diameterMeters =
        Number.isFinite(rawDiameter) && rawDiameter > 0
          ? rawDiameter / 1000
          : DEFAULT_DIAMETER_METERS;
      const rawDepth = Number(properties.DoSau);
      const depthMeters =
        Number.isFinite(rawDepth) && rawDepth > 0
          ? rawDepth
          : DEFAULT_DEPTH_METERS;

      return {
        ...feature,
        id: feature.id ?? objectId ?? index + 1,
        properties: {
          ...properties,
          DuongKinh_m: diameterMeters,
          DoSau_m: depthMeters,
        },
      };
    });

  return {
    type: "FeatureCollection",
    features: normalizedFeatures,
  } satisfies PipeGeoJsonFeatureCollection;
};

export const loadPipeGeoJson = async (signal?: AbortSignal) => {
  const response = await fetch(PIPE_GEOJSON_URL, { signal });
  if (!response.ok) {
    throw new Error("Failed to load pipe geojson");
  }

  const data = (await response.json()) as PipeGeoJsonFeatureCollection;
  return normalizePipeGeoJson(data);
};

export const createGeoJsonBlobUrl = (data: PipeGeoJsonFeatureCollection) => {
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/geo+json",
  });

  return URL.createObjectURL(blob);
};
