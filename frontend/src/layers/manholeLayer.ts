import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import {
  DEFAULT_MANHOLE_DEPTH_METERS,
  DEFAULT_MANHOLE_SIZE_METERS,
  MANHOLE_MIN_SCALE,
  MANHOLE_MODEL_URL,
} from "../constants/manholeDefaults";

export const createManholeLayer = (url: string) =>
  new GeoJSONLayer({
    url,
    title: "Hố ga",
    minScale: MANHOLE_MIN_SCALE,
    elevationInfo: {
      mode: "relative-to-ground",
      offset: -DEFAULT_MANHOLE_DEPTH_METERS,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
            resource: { href: MANHOLE_MODEL_URL },
            height: DEFAULT_MANHOLE_SIZE_METERS,
            width: DEFAULT_MANHOLE_SIZE_METERS,
            depth: DEFAULT_MANHOLE_SIZE_METERS,
            anchor: "bottom",
          },
        ],
      },
    },
    popupTemplate: {
      title: "Hố ga #{OBJECTID}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "Longitude", label: "Kinh độ" },
            { fieldName: "Latitude", label: "Vĩ độ" },
            { fieldName: "LoaiHoGa", label: "Loại hố ga" },
            { fieldName: "VatLieu", label: "Vật liệu" },
            { fieldName: "DoSau", label: "Độ sâu" },
            { fieldName: "GhiChu", label: "Ghi chú" },
            { fieldName: "MaPhuongXa", label: "Mã phường/xã" },
            { fieldName: "MaQuanHuyen", label: "Mã quận/huyện" },
            { fieldName: "MaDuAn", label: "Mã dự án" },
          ],
        },
      ],
    },
  });
