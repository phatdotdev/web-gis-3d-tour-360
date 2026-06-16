/** Độ sâu hố ga mặc định (mét) */
export const DEFAULT_MANHOLE_DEPTH_METERS = 1.5;

/** Kích thước hố ga mặc định (mét) – phổ biến 600-1000mm */
export const DEFAULT_MANHOLE_SIZE_METERS = 5;

/** Hệ số nhân kích thước hiển thị điểm hố ga ở xa */
export const MANHOLE_POINT_SIZE_MULTIPLIER = 4;

/** Scale tối thiểu để hiển thị mô hình 3D hố ga */
export const MANHOLE_MIN_SCALE = 1_000_000;

export const MANHOLE_GEOJSON_URL = new URL(
  "../../raw/_SoXayDung_QHPK_HoGa_L0_Quy_hoạch_phân_khu___Hố_ga.geojson",
  import.meta.url,
).toString();

export const MANHOLE_MODEL_URL = "/model/manhole_2.glb";
