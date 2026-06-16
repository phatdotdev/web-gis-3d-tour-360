import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchSpatialEntityById,
  createSpatialEntity,
  updateSpatialEntity,
} from "../../store/spatialEntitiesSlice";
import { uploadModel, uploadIcon } from "../../services/spatialEntitiesService";
import { selectLayers, loadLayers } from "../../store/mapSlice";
import { selectCategories, fetchAllCategories } from "../../store/categoriesSlice";
import { selectRegions, fetchAllRegions } from "../../store/regionsSlice";
import {
  createVirtualTour,
  fetchAllVirtualTours,
  selectVirtualTours,
} from "../../store/virtualToursSlice";
import { AdminPageHeader, LoadingSpinner } from "../../components/ui";
import { MiniMapSelector } from "../../components/admin/MiniMapSelector";
import { VirtualTourEditor } from "../../components/admin/VirtualTourEditor";
import { SceneEditor } from "../../components/admin/SceneEditor";
import { ArrowLeft, Save, Info, MapPin, Phone, Settings, Film, Cuboid, Images } from "lucide-react";

export const EntityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const isNew = !id;
  const activeTab = searchParams.get("tab") || "basic";

  const layers = useAppSelector(selectLayers);
  const categories = useAppSelector(selectCategories);
  const regions = useAppSelector(selectRegions);
  const tours = useAppSelector(selectVirtualTours);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [experienceMode, setExperienceMode] = useState<"3d" | "360">("3d");

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("point");
  const [objectKind, setObjectKind] = useState("building");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [layerId, setLayerId] = useState("");
  const [status, setStatus] = useState("draft");

  // Location
  const [latitude, setLatitude] = useState<number | null>(10.037);
  const [longitude, setLongitude] = useState<number | null>(105.782);
  const [elevation, setElevation] = useState<number>(0);
  const [address, setAddress] = useState("");

  // Contact
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  // GIS Display
  const [renderType, setRenderType] = useState("billboard");
  const [color, setColor] = useState("#3b82f6");
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [assetUrl, setAssetUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(loadLayers());
    dispatch(fetchAllCategories());
    dispatch(fetchAllRegions());

    if (!isNew && id) {
      setLoading(true);
      dispatch(fetchSpatialEntityById(id))
        .unwrap()
        .then((entity) => {
          setName(entity.name || "");
          setSlug(entity.slug || "");
          setType(entity.type || "point");
          setObjectKind(entity.objectKind || "building");
          setShortDescription(entity.shortDescription || "");
          setFullDescription(entity.fullDescription || "");
          setCategoryId(entity.categoryId || "");
          setRegionId(entity.regionId || "");
          setLayerId(entity.layerId || "");
          setStatus(entity.status || "draft");

          setLatitude(entity.latitude ?? entity.centerLatitude ?? 10.037);
          setLongitude(entity.longitude ?? entity.centerLongitude ?? 105.782);
          setElevation(entity.elevation ?? 0);
          setAddress(entity.address || "");

          setContactPhone(entity.contactPhone || "");
          setContactEmail(entity.contactEmail || "");
          setWebsiteUrl(entity.websiteUrl || "");
          setFacebookUrl(entity.facebookUrl || "");
          setOpeningHours(entity.openingHours || "");
          setTicketPrice(entity.ticketPrice || "");

          setRenderType(entity.renderType || "billboard");
          setColor(entity.color || "#3b82f6");
          setOpacity(entity.opacity ?? 1);
          setScale(entity.scale ?? 1);
          setHeight(entity.height ?? 10);
          setWidth(entity.width ?? 10);
          setAssetUrl(entity.assetUrl || "");
          setIconUrl(entity.iconUrl || "");
        })
        .finally(() => setLoading(false));

      dispatch(fetchAllVirtualTours({ spatialEntityId: id }));
    }
  }, [dispatch, id, isNew]);

  const handleCreateTour = async () => {
    if (isNew || !id) return;
    try {
      await dispatch(
        createVirtualTour({
          spatialEntityId: id,
          name: `Tour: ${name}`,
          description: `Tour tham quan ảo của địa điểm ${name}`,
        })
      ).unwrap();
      dispatch(fetchAllVirtualTours({ spatialEntityId: id }));
    } catch (err) {
      alert("Tạo virtual tour thất bại.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      slug,
      type,
      objectKind,
      shortDescription,
      fullDescription,
      categoryId: categoryId || null,
      regionId: regionId || null,
      layerId: layerId || null,
      status,
      latitude,
      longitude,
      elevation: Number(elevation),
      address,
      contactPhone,
      contactEmail,
      websiteUrl,
      facebookUrl,
      openingHours,
      ticketPrice,
      renderType,
      color,
      opacity: Number(opacity),
      scale: Number(scale),
      height: Number(height),
      width: Number(width),
    };

    try {
      if (isNew) {
        const created = await dispatch(createSpatialEntity(payload)).unwrap();
        if (modelFile) {
          await uploadModel(created.id, modelFile);
        }
        if (iconFile) {
          await uploadIcon(created.id, iconFile);
        }
        navigate(`../entities/${created.id}?tab=experiences`);
      } else if (id) {
        await dispatch(updateSpatialEntity({ id, dto: payload })).unwrap();
        if (modelFile) {
          await uploadModel(id, modelFile);
        }
        if (iconFile) {
          await uploadIcon(id, iconFile);
        }
        alert("Lưu thông tin địa điểm thành công!");
        window.location.reload();
      }
    } catch (err) {
      alert("Đã xảy ra lỗi khi lưu địa điểm.");
    } finally {
      setSaving(false);
    }
  };

  const switchTab = (tab: string) => {
    setSearchParams({ tab });
  };

  if (loading) {
    return <LoadingSpinner className="py-24" />;
  }

  const activeTour = tours.length > 0 ? tours[0] : null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isNew ? "Thêm địa điểm mới" : `Chỉnh sửa: ${name}`}
        description="Định cấu hình vị trí GIS, thông tin chi tiết và trải nghiệm thực tế ảo 3D/360."
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-colors cursor-pointer text-sm"
        >
          <ArrowLeft size={16} />
          Quay lại
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer text-sm"
        >
          <Save size={16} />
          {saving ? "Đang lưu..." : "Lưu địa điểm"}
        </button>
      </AdminPageHeader>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap bg-white px-6 rounded-t-2xl">
        <button
          onClick={() => switchTab("basic")}
          className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "basic"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Info size={16} />
          Thông tin cơ bản
        </button>
        <button
          onClick={() => switchTab("location")}
          className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "location"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <MapPin size={16} />
          Bản đồ & Tọa độ
        </button>
        <button
          onClick={() => switchTab("contact")}
          className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "contact"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Phone size={16} />
          Liên hệ & Nghiệp vụ
        </button>
        <button
          onClick={() => switchTab("gis")}
          className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "gis"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Settings size={16} />
          Hiển thị GIS
        </button>
        <button
          onClick={() => switchTab("experiences")}
          disabled={isNew}
          className={`py-3.5 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            activeTab === "experiences"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          title={isNew ? "Vui lòng lưu địa điểm trước" : ""}
        >
          <Film size={16} />
          Trải nghiệm 3D & 360
        </button>
      </div>

      <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-slate-200/80 shadow-sm min-h-[400px]">
        {/* Tab 1: Basic Info */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tên địa điểm/công trình <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (isNew) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="Ví dụ: Cầu Cần Thơ, Bến Ninh Kiều"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                  placeholder="cau-can-tho"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Loại hình đối tượng
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="point">Điểm (Point)</option>
                    <option value="polyline">Đoạn thẳng (Polyline)</option>
                    <option value="polygon">Vùng khép kín (Polygon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phân nhóm (Kind)
                  </label>
                  <select
                    value={objectKind}
                    onChange={(e) => setObjectKind(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="building">Công trình xây dựng</option>
                    <option value="tourism_spot">Điểm du lịch/Danh lam</option>
                    <option value="infrastructure">Cơ sở hạ tầng</option>
                    <option value="scenery">Cảnh quan thiên nhiên</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trạng thái xuất bản
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                >
                  <option value="active">Hoạt động (Active)</option>
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lớp bản đồ (Layer)
                  </label>
                  <select
                    value={layerId}
                    onChange={(e) => setLayerId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="">Không có lớp (Độc lập)</option>
                    {layers.map((l: any) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Danh mục (Category)
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Khu vực (Region)
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                >
                  <option value="">-- Chọn khu vực --</option>
                  {regions.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                  placeholder="Mô tả tóm tắt ngắn..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mô tả đầy đủ
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="Thông tin giới thiệu chi tiết về địa danh này..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Map & Location */}
        {activeTab === "location" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={latitude || ""}
                    onChange={(e) => setLatitude(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={longitude || ""}
                    onChange={(e) => setLongitude(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Độ cao (Elevation - mét)
                </label>
                <input
                  type="number"
                  value={elevation}
                  onChange={(e) => setElevation(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Địa chỉ thực tế
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="Ví dụ: Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ"
                />
              </div>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative">
              <MiniMapSelector
                latitude={latitude}
                longitude={longitude}
                onChange={({ latitude, longitude }) => {
                  setLatitude(latitude);
                  setLongitude(longitude);
                }}
              />
              <div className="absolute top-2 left-2 bg-slate-900/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur">
                Click chọn vị trí trực tiếp trên bản đồ 3D
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Contact & Operation */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Giờ mở cửa (Chuỗi văn bản)
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="08:00 - 17:00 hằng ngày"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Giá vé tham quan (đồng)
                </label>
                <input
                  type="text"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="Ví dụ: Miễn phí hoặc 50.000đ"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trang web (Website URL)
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Facebook Fanpage URL
                </label>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: GIS display rendering */}
        {activeTab === "gis" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kiểu hiển thị trên bản đồ (Render Type)
                </label>
                <select
                  value={renderType}
                  onChange={(e) => setRenderType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                >
                  <option value="billboard">Billboard (Biển định vị nổi)</option>
                  <option value="point">Point (Nút icon chấm nhỏ)</option>
                  <option value="model3d">Model 3D (Tập tin .glb)</option>
                  <option value="polygon">Polygon (Bản vẽ khối 3D)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Màu sắc GIS (Ví dụ: khối vẽ 3D)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 border border-slate-300 rounded-xl cursor-pointer p-0 overflow-hidden bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Độ trong suốt (Opacity)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tỷ lệ (Scale)
                  </label>
                  <input
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Chiều cao (Height)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Chiều rộng (Width)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tải lên Mô hình 3D (.glb / .gltf)
                  </label>
                  {assetUrl && (
                    <p className="text-xs text-emerald-650 font-bold mb-1.5 truncate" title={assetUrl}>
                      Tệp hiện tại: {assetUrl.split("/").pop()}
                    </p>
                  )}
                  <input
                    type="file"
                    accept=".glb,.gltf"
                    onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tải lên Icon tùy chỉnh (.png / .jpg / .svg)
                  </label>
                  {iconUrl && (
                    <p className="text-xs text-emerald-650 font-bold mb-1.5 truncate" title={iconUrl}>
                      Icon hiện tại: {iconUrl.split("/").pop()}
                    </p>
                  )}
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Virtual Tour Editor & Experiences */}
        {activeTab === "experiences" && !isNew && id && (
          <div className="space-y-6">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setExperienceMode("3d")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold cursor-pointer ${
                  experienceMode === "3d"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600"
                }`}
              >
                <Cuboid size={16} /> Editor canh 3D
              </button>
              <button
                type="button"
                onClick={() => setExperienceMode("360")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold cursor-pointer ${
                  experienceMode === "360"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600"
                }`}
              >
                <Images size={16} /> Editor Panorama 360
              </button>
            </div>

            {experienceMode === "3d" ? (
              <SceneEditor
                entityId={id}
                tourId={activeTour?.id}
                initialModelUrl={assetUrl || null}
              />
            ) : activeTour ? (
              <VirtualTourEditor tourId={activeTour.id} entityId={id} />
            ) : (
              <div className="py-12 text-center text-slate-500">
                <Film size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="font-medium text-slate-700">Địa điểm này chưa có tour tham quan ảo</p>
                <p className="text-sm text-slate-400 mt-1 mb-6">
                  Tạo tour tham quan ảo 360 độ để cho khách hàng khám phá không gian trực quan.
                </p>
                <button
                  onClick={handleCreateTour}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm cursor-pointer"
                >
                  Tạo tour mới ngay
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default EntityDetailPage;
