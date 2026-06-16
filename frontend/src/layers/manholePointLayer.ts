import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import {
  DEFAULT_MANHOLE_SIZE_METERS,
  MANHOLE_POINT_SIZE_MULTIPLIER,
} from "../constants/manholeDefaults";

export const createManholePointLayer = (url: string) =>
  new GeoJSONLayer({
    url,
    title: "Hố ga (điểm)",
    renderer: {
      type: "simple",
      symbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "icon",
            resource: { primitive: "circle" },
            size: DEFAULT_MANHOLE_SIZE_METERS * MANHOLE_POINT_SIZE_MULTIPLIER,
            material: { color: [255, 140, 0, 0.9] },
            outline: { color: [255, 255, 255, 0.8], size: 1 },
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
