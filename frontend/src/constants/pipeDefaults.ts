/** Độ sâu chôn ống mặc định (mét) – trung bình đô thị Việt Nam */
export const DEFAULT_DEPTH_METERS = 1.5;

/** Đường kính ống mặc định (mét) – 400mm là kích thước phổ biến */
export const DEFAULT_DIAMETER_METERS = 0.4;

/** Ground opacity */
export const GROUND_OPACITY_MIN = 0;
export const GROUND_OPACITY_MAX = 1;
export const GROUND_OPACITY_DEFAULT = 0.55;

export const PIPE_GEOJSON_URL = new URL(
  "../../raw/_SoXayDung_QHPK_CongThoatNuoc_L0_Quy_hoạch_phân_khu___Cống_thoát_nước.geojson",
  import.meta.url,
).toString();
