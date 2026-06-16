import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import type { BackendLayer } from "../types/backend";
import { backendHost } from "../utils/backendApi";

type LayerBuildResult = {
  layers: GeoJSONLayer[];
  blobUrls: string[];
};

type ColorTuple = [number, number, number, number];

const resolveColor = (color?: string | null, opacity?: number | null): ColorTuple => {
  if (!color || typeof color !== "string") {
    return [56, 189, 248, opacity ?? 0.9];
  }
  if (color.startsWith("#")) {
    const value = color.replace("#", "").trim();
    const expand = (chunk: string) => (chunk.length === 1 ? `${chunk}${chunk}` : chunk);
    const r = expand(value.slice(0, 2));
    const g = expand(value.slice(2, 4));
    const b = expand(value.slice(4, 6));
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), opacity ?? 0.9];
  }
  return [56, 189, 248, opacity ?? 0.9];
};

const resolveUrl = (url?: string | null) => {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/model/")) return url;
  return `${backendHost}${url.startsWith("/") ? "" : "/"}${url}`;
};

const resolveRendererUrls = (renderer: any): any => {
  if (!renderer) return renderer;
  const clone = JSON.parse(JSON.stringify(renderer));
  const traverse = (obj: any) => {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
      return;
    }
    if (obj.href && typeof obj.href === "string" && obj.href.startsWith("/uploads/")) {
      obj.href = resolveUrl(obj.href);
    }
    Object.values(obj).forEach(traverse);
  };
  traverse(clone);
  return clone;
};

export const createBackendLayer = (
  layer: BackendLayer,
  _show3DModels = true,
  showPositioningIcons = true,
): LayerBuildResult => {
  const layers: GeoJSONLayer[] = [];
  const blobUrls: string[] = [];

  const featureCollection = layer.featureCollection ?? {
    type: "FeatureCollection",
    features: [],
  };

  const blobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(featureCollection)], {
      type: "application/geo+json",
    }),
  );
  blobUrls.push(blobUrl);

  const resolvedRenderer = resolveRendererUrls(layer.renderer);

  const geoLayer = new GeoJSONLayer({
    url: blobUrl,
    title: layer.name,
    renderer: resolvedRenderer,
    visible: layer.visible,
    elevationInfo: {
      mode: "relative-to-ground",
      featureExpressionInfo: { expression: "$feature.elevation" },
      unit: "meters",
    },
    popupTemplate: layer.popupTemplate,
  });
  layers.push(geoLayer);

  if (layer.vertexFeatureCollection && layer.vertexFeatureCollection.features.length > 0) {
    const vertexBlobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(layer.vertexFeatureCollection)], {
        type: "application/geo+json",
      }),
    );
    blobUrls.push(vertexBlobUrl);

    const resolvedIconUrl = showPositioningIcons ? resolveUrl(layer.iconUrl) : undefined;
    const symbolLayers = [] as any[];

    if (showPositioningIcons) {
      if (resolvedIconUrl) {
        symbolLayers.push({
          type: "icon",
          resource: { href: resolvedIconUrl },
          size: 12,
        });
      } else {
        symbolLayers.push({
          type: "icon",
          resource: { primitive: "circle" },
          size: 6,
          material: {
            color: resolveColor(layer.metadata?.color as string, 0.9),
          },
          outline: { color: [255, 255, 255, 0.6], size: 1 },
        });
      }
    }

    const vertexLayer = new GeoJSONLayer({
      url: vertexBlobUrl,
      title: `${layer.name} points`,
      visible: layer.visible && showPositioningIcons,
      renderer: {
        type: "simple",
        symbol: {
          type: "point-3d",
          symbolLayers,
        },
      } as any,
      elevationInfo: {
        mode: "relative-to-ground",
      },
      popupTemplate: layer.popupTemplate,
    });
    layers.push(vertexLayer);
  }

  return { layers, blobUrls };
};
