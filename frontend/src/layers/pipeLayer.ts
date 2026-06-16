import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import {
  DEFAULT_DEPTH_METERS,
  DEFAULT_DIAMETER_METERS,
} from "../constants/pipeDefaults";

export const createPipeLayer = (url: string) =>
  new GeoJSONLayer({
    url,
    title: "Cống thoát nước",
    elevationInfo: {
      mode: "relative-to-ground",
      offset: -DEFAULT_DEPTH_METERS,
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "line-3d",
        symbolLayers: [
          {
            type: "path",
            profile: "circle",
            material: { color: [0, 200, 255, 0.9] },
            width: DEFAULT_DIAMETER_METERS,
            height: DEFAULT_DIAMETER_METERS,
          },
        ],
      },
      visualVariables: [
        {
          type: "size",
          field: "DuongKinh_m",
          valueUnit: "meters",
        },
      ],
    },
    popupTemplate: {
      title: "Cống thoát nước #{OBJECTID}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            { fieldName: "ChieuDai", label: "Chiều dài (m)" },
            { fieldName: "DoDoc", label: "Độ dốc" },
            { fieldName: "DoSau_m", label: "Độ sâu (m)" },
            { fieldName: "DuongKinh_m", label: "Đường kính (m)" },
            { fieldName: "VatLieu", label: "Vật liệu" },
            {
              fieldName: "LoaiCongThoatNuoc",
              label: "Loại cống thoát nước",
            },
            { fieldName: "GhiChu", label: "Ghi chú" },
            { fieldName: "MaPhuongXa", label: "Mã phường/xã" },
            { fieldName: "MaQuanHuyen", label: "Mã quận/huyện" },
            { fieldName: "MaDuAn", label: "Mã dự án" },
          ],
        },
      ],
    },
  });
