import { useEffect, useRef } from "react";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";

type MiniMapSelectorProps = {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (coords: { latitude: number; longitude: number }) => void;
};

export const MiniMapSelector = ({ latitude, longitude, onChange }: MiniMapSelectorProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<SceneView | null>(null);
  const graphicRef = useRef<Graphic | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const apiKey = import.meta.env.VITE_ARCGIS_API_KEY as string | undefined;
    if (apiKey) {
      esriConfig.apiKey = apiKey;
    }

    const map = new Map({
      basemap: apiKey ? "arcgis/topographic" : "osm",
    });

    const view = new SceneView({
      container: mapRef.current,
      map,
      center: [longitude || 105.78, latitude || 10.037],
      zoom: 14,
    });

    viewRef.current = view;

    // Add click event to selector
    const clickHandle = view.on("click", (event) => {
      const { mapPoint } = event;
      if (mapPoint) {
        onChange({
          latitude: mapPoint.latitude ?? 0,
          longitude: mapPoint.longitude ?? 0,
        });
      }
    });

    return () => {
      clickHandle.remove();
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);

  // Effect to update graphic when props change
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    if (graphicRef.current) {
      view.graphics.remove(graphicRef.current);
      graphicRef.current = null;
    }

    if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      const pt = new Point({
        latitude,
        longitude,
      });

      const symbol = {
        type: "point-3d",
        symbolLayers: [
          {
            type: "icon",
            resource: { primitive: "circle" as const },
            size: 14,
            material: { color: [220, 38, 38, 0.9] }, // red
            outline: { color: [255, 255, 255, 0.9], size: 1.5 },
          },
        ],
      } as any;

      const graphic = new Graphic({
        geometry: pt,
        symbol,
      });

      graphicRef.current = graphic;
      view.graphics.add(graphic);
      
      // Go to point
      view.goTo({ target: pt, zoom: 16 }, { animate: true }).catch(() => undefined);
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-full min-h-[300px]" />;
};
export default MiniMapSelector;
