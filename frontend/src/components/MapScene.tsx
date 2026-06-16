import { useEffect, useRef, useState } from "react";

import Basemap from "@arcgis/core/Basemap";
import esriConfig from "@arcgis/core/config";
import { watch } from "@arcgis/core/core/reactiveUtils";
import Extent from "@arcgis/core/geometry/Extent";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import type GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";

import { createBackendLayer } from "../layers/backendLayer";
import {
  clearGoToTarget,
  selectGoToTarget,
  selectLayers,
  selectSelectedLayerIds,
  selectViewMode,
  selectViewState,
  setViewState,
} from "../store/mapSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectSpatialEntities, setSelectedEntity } from "../store/spatialEntitiesSlice";
import { getEntityCenter } from "../utils/geometry";

type ArcGISView = MapView | SceneView;

const DEFAULT_CENTER: [number, number] = [105.78, 10.04];
const DEFAULT_ZOOM = 12;
const STREET_MAP_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer";

const isSceneView = (view: ArcGISView | null): view is SceneView =>
  Boolean(view && view.type === "3d");

const buildPinDataUri = (hex?: string | null) => {
  const fill = hex && hex.startsWith("#") ? hex : "#2563eb";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="52" viewBox="0 0 36 52"><path fill="${fill}" d="M18 1C8.611 1 1 8.611 1 18c0 12.494 14.982 29.217 16.184 30.536a1.1 1.1 0 0 0 1.632 0C20.018 47.217 35 30.494 35 18 35 8.611 27.389 1 18 1Z"/><circle cx="18" cy="18" r="7.5" fill="white"/><path fill="rgba(15,23,42,0.18)" d="M18 50c4.2 0 7.6-.85 7.6-1.9S22.2 46.2 18 46.2s-7.6.85-7.6 1.9S13.8 50 18 50Z"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getFeaturePoint = (feature: any) => {
  const geometry = feature?.geometry;
  if (!geometry) return null;

  if (geometry.type === "Point" && Array.isArray(geometry.coordinates)) {
    const [longitude, latitude, z] = geometry.coordinates;
    if (typeof longitude === "number" && typeof latitude === "number") {
      return { longitude, latitude, z: typeof z === "number" ? z : 0 };
    }
  }

  return null;
};

const createStreetBasemap = () =>
  new Basemap({
    title: "World Street Map",
    baseLayers: [
      new TileLayer({
        url: STREET_MAP_URL,
        title: "World Street Map",
      }),
    ],
  });

const getEntityPoint = (entity: any) => {
  const longitude = Number(entity.longitude ?? entity.centerLongitude);
  const latitude = Number(entity.latitude ?? entity.centerLatitude);

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return { longitude, latitude };
  }

  const center = getEntityCenter(entity.geometry ?? entity.location);
  return center ? { longitude: center.lng, latitude: center.lat } : null;
};

const MapScene = () => {
  const dispatch = useAppDispatch();

  const viewMode = useAppSelector(selectViewMode);
  const layers = useAppSelector(selectLayers);
  const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
  const goToTarget = useAppSelector(selectGoToTarget);
  const entities = useAppSelector(selectSpatialEntities);
  const savedViewState = useAppSelector(selectViewState);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const viewRef = useRef<ArcGISView | null>(null);
  const entitiesLayerRef = useRef<GraphicsLayer | null>(null);
  const backendPinsLayerRef = useRef<GraphicsLayer | null>(null);
  const hasApiKeyRef = useRef(false);
  const [viewReadyKey, setViewReadyKey] = useState(0);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY as string | undefined;
    hasApiKeyRef.current = Boolean(apiKey);

    if (apiKey) {
      esriConfig.apiKey = apiKey;
    }
  }, []);

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;

    const previousView = viewRef.current;
    const center =
      previousView?.center && previousView.center.longitude != null && previousView.center.latitude != null
        ? ([previousView.center.longitude, previousView.center.latitude] as [
            number,
            number,
          ])
        : savedViewState &&
            Number.isFinite(savedViewState.longitude) &&
            Number.isFinite(savedViewState.latitude)
          ? ([savedViewState.longitude, savedViewState.latitude] as [number, number])
          : DEFAULT_CENTER;
    const zoom =
      previousView?.zoom ??
      (savedViewState && Number.isFinite(savedViewState.zoom)
        ? savedViewState.zoom
        : DEFAULT_ZOOM);

    if (previousView) {
      previousView.container = null;
      previousView.destroy();
      viewRef.current = null;
    }

    const previousMap = mapInstanceRef.current;
    if (previousMap) {
      previousMap.removeAll();
      mapInstanceRef.current = null;
    }

    const map = new Map({
      basemap: createStreetBasemap(),
      ground:
        viewMode === "3d" && hasApiKeyRef.current
          ? "world-elevation"
          : { layers: [] },
    });
    mapInstanceRef.current = map;

    const entitiesLayer = new GraphicsLayer({
      title: "Entities Pins",
    });
    const backendPinsLayer = new GraphicsLayer({
      title: "Backend Pins",
    });

    map.addMany([entitiesLayer, backendPinsLayer]);
    entitiesLayerRef.current = entitiesLayer;
    backendPinsLayerRef.current = backendPinsLayer;
    setViewReadyKey(0);

    const nextView: ArcGISView =
      viewMode === "3d"
        ? new SceneView({
            container,
            map,
            camera: {
              position: {
                longitude: center[0],
                latitude: center[1],
                z: 2500,
              },
              tilt: 68,
              heading: 0,
            },
            qualityProfile: "medium",
            environment: {
              background: {
                type: "color",
                color: [198, 220, 255, 1],
              },
              starsEnabled: false,
              atmosphereEnabled: true,
            },
          })
        : new MapView({
            container,
            map,
            center,
            zoom,
          });

    nextView.popupEnabled = true;
    viewRef.current = nextView;

    void nextView
      .when(() => {
        if (viewRef.current !== nextView) return;

        if (isSceneView(nextView)) {
          const camera = nextView.camera.clone();
          camera.tilt = 60;
          void nextView.goTo(camera, { animate: false }).catch(() => undefined);
        }

        setViewReadyKey((current) => current + 1);
      })
      .catch(() => undefined);

    const clickHandle = nextView.on("click", async (event) => {
      const response = await nextView.hitTest(event);
      const graphicResult = response.results.find(
        (result: any) =>
          result.graphic && result.graphic.attributes?.type === "spatial-entity",
      );

      if (!graphicResult) return;

      const entity = (graphicResult as any).graphic.attributes.entity;
      dispatch(setSelectedEntity(entity.id));

      const target = (graphicResult as any).graphic.geometry;
      if (isSceneView(nextView)) {
        void nextView
          .goTo({ target, zoom: 16, tilt: 60 }, { duration: 1000 })
          .catch(() => undefined);
      } else {
        void nextView.goTo({ target, zoom: 16 }, { duration: 1000 }).catch(() => undefined);
      }
    });

    const updateViewState = () => {
      const liveCenter = nextView.center;
      if (!liveCenter) return;
      if (
        liveCenter.longitude == null ||
        liveCenter.latitude == null ||
        nextView.zoom == null ||
        nextView.scale == null
      ) {
        return;
      }

      dispatch(
        setViewState({
          longitude: liveCenter.longitude,
          latitude: liveCenter.latitude,
          zoom: nextView.zoom,
          scale: nextView.scale,
        }),
      );
    };

    const viewStateHandle = watch(
      () => [nextView.center, nextView.zoom, nextView.scale],
      updateViewState,
    );
    updateViewState();

    return () => {
      clickHandle.remove();
      viewStateHandle.remove();
      nextView.container = null;
      nextView.destroy();
      map.removeAll();
      if (viewRef.current === nextView) {
        viewRef.current = null;
      }
      if (mapInstanceRef.current === map) {
        mapInstanceRef.current = null;
      }
      if (entitiesLayerRef.current === entitiesLayer) {
        entitiesLayerRef.current = null;
      }
      if (backendPinsLayerRef.current === backendPinsLayer) {
        backendPinsLayerRef.current = null;
      }
    };
  }, [dispatch, viewMode]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const view = viewRef.current;
    if (!map || !view || viewReadyKey === 0) return;

    const selectedIds = new Set(selectedLayerIds);
    const nextLayers = layers
      .filter((layer) => selectedIds.has(layer.id))
      .sort((a, b) => a.zIndex - b.zIndex);

    const currentLayers: GeoJSONLayer[] = [];
    const currentBlobs: string[] = [];

    if (nextLayers.length > 0 && !isSceneView(view)) {
      const created = nextLayers.map((layer) =>
        createBackendLayer(layer, false, true),
      );

      created.forEach(({ layers: builtLayers, blobUrls }) => {
        map.addMany(builtLayers);
        currentLayers.push(...builtLayers);
        currentBlobs.push(...blobUrls);
      });
    }

    const updateExtent = () => {
      if (currentLayers.length === 0) return;
      const extents = nextLayers
        .map((layer) => layer.extent)
        .filter((extent): extent is NonNullable<typeof extent> => Boolean(extent));

      if (extents.length === 0) return;

      const merged = extents.reduce((acc, curr) => ({
        xmin: Math.min(acc.xmin, curr.xmin),
        ymin: Math.min(acc.ymin, curr.ymin),
        xmax: Math.max(acc.xmax, curr.xmax),
        ymax: Math.max(acc.ymax, curr.ymax),
      }));

      const extentGeometry = new Extent({
        xmin: merged.xmin,
        ymin: merged.ymin,
        xmax: merged.xmax,
        ymax: merged.ymax,
        spatialReference: { wkid: 4326 },
      });

      void view.goTo(extentGeometry.expand(1.2)).catch(() => undefined);
    };

    updateExtent();

    return () => {
      if (currentLayers.length > 0) {
        map.removeMany(currentLayers);
      }
      if (currentBlobs.length > 0) {
        setTimeout(() => {
          currentBlobs.forEach((url) => URL.revokeObjectURL(url));
        }, 5000);
      }
    };
  }, [layers, selectedLayerIds, viewMode, viewReadyKey]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !goToTarget || viewReadyKey === 0) return;

    const point = new Point({
      longitude: goToTarget.longitude,
      latitude: goToTarget.latitude,
    });

    const handleComplete = () => dispatch(clearGoToTarget());

    if (isSceneView(view)) {
      void view
        .goTo(
          {
            target: point,
            zoom: goToTarget.zoom ?? 18,
            tilt: 60,
          },
          { duration: 1500, easing: "ease-in-out" },
        )
        .then(handleComplete)
        .catch(() => undefined);
      return;
    }

    void view
      .goTo(
        {
          target: point,
          zoom: goToTarget.zoom ?? 18,
        },
        { duration: 1500, easing: "ease-in-out" },
      )
      .then(handleComplete)
      .catch(() => undefined);
  }, [dispatch, goToTarget, viewMode, viewReadyKey]);

  useEffect(() => {
    const view = viewRef.current;
    const pinsLayer = backendPinsLayerRef.current;
    if (!view || !pinsLayer || viewReadyKey === 0) return;

    pinsLayer.removeAll();

    layers.forEach((layer) => {
      if (!selectedLayerIds.includes(layer.id)) return;

      const features = layer.vertexFeatureCollection?.features;
      if (!Array.isArray(features)) return;

      const pinUrl = buildPinDataUri((layer.metadata?.color as string | undefined) ?? null);
      features.forEach((feature: any, index: number) => {
        const pointData = getFeaturePoint(feature);
        if (!pointData) return;

        const point = new Point({
          longitude: pointData.longitude,
          latitude: pointData.latitude,
          z: isSceneView(view) ? pointData.z : undefined,
        });

        const symbol = isSceneView(view)
          ? ({
              type: "point-3d",
              symbolLayers: [
                {
                  type: "icon",
                  resource: { href: pinUrl },
                  size: 18,
                  outline: {
                    color: [255, 255, 255, 0.95],
                    size: 1,
                  },
                },
              ],
              verticalOffset: {
                screenLength: 18,
                maxWorldLength: 80,
                minWorldLength: 10,
              },
            } as any)
          : ({
              type: "picture-marker",
              url: pinUrl,
              width: "24px",
              height: "34px",
            } as any);

        pinsLayer.add(
          new Graphic({
            geometry: point,
            symbol,
            attributes: {
              id: `${layer.id}-${index}`,
              type: "backend-vertex",
              layerName: layer.name,
              featureName:
                feature?.properties?.name ??
                feature?.properties?.label ??
                `Point ${index + 1}`,
            },
            popupTemplate: {
              title: "{featureName}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "layerName",
                      label: "Layer",
                    },
                  ],
                },
              ],
            },
          }),
        );
      });
    });
  }, [layers, selectedLayerIds, viewMode, viewReadyKey]);

  useEffect(() => {
    const view = viewRef.current;
    const layer = entitiesLayerRef.current;
    if (!view || !layer || viewReadyKey === 0) return;

    layer.removeAll();

    entities.forEach((entity) => {
      if (["inactive", "archived", "deleted"].includes(entity.status)) return;
      const entityPoint = getEntityPoint(entity);
      if (!entityPoint) return;

      const point = new Point({
        longitude: entityPoint.longitude,
        latitude: entityPoint.latitude,
        z: isSceneView(view) ? Number(entity.elevation || 0) : undefined,
      });

      const pinUrl = buildPinDataUri(entity.category?.color);
      let symbol;

      if (isSceneView(view)) {
        symbol = {
          type: "point-3d",
          symbolLayers: [
            {
              type: "icon",
              resource: { href: pinUrl },
              size: entity.hasVirtualTour ? 22 : 19,
              outline: { color: [255, 255, 255, 0.95], size: 1.25 },
            },
          ],
          verticalOffset: {
            screenLength: 20,
            maxWorldLength: 90,
            minWorldLength: 12,
          },
        } as any;
      } else {
        symbol = {
          type: "picture-marker",
          url: pinUrl,
          width: entity.hasVirtualTour ? "28px" : "24px",
          height: entity.hasVirtualTour ? "40px" : "34px",
        } as any;
      }

      layer.add(
        new Graphic({
          geometry: point,
          symbol,
          attributes: {
            id: entity.id,
            type: "spatial-entity",
            entity,
          },
        }),
      );
    });
  }, [entities, viewMode, viewReadyKey]);

  return <div ref={mapRef} className="absolute inset-0 w-full h-full" />;
};

export default MapScene;
