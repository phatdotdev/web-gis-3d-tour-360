import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchManagedSpatialEntities,
  removeSpatialEntity,
  selectSpatialEntities,
  selectSpatialEntitiesStatus,
} from "../../store/spatialEntitiesSlice";
import { selectLayers, loadLayers } from "../../store/mapSlice";
import { selectCategories, fetchAllCategories } from "../../store/categoriesSlice";
import { selectRegions, fetchAllRegions } from "../../store/regionsSlice";
import { AdminPageHeader, Surface, StatusBadge, LoadingSpinner } from "../../components/ui";
import { Plus, Search, Edit2, Trash2, MapPin, Video, Eye } from "lucide-react";
import { resolveAssetUrl } from "../../utils/httpClient";

export const ManagerEntitiesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const entities = useAppSelector(selectSpatialEntities);
  const status = useAppSelector(selectSpatialEntitiesStatus);

  const layers = useAppSelector(selectLayers);
  const categories = useAppSelector(selectCategories);
  const regions = useAppSelector(selectRegions);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLayerId, setSelectedLayerId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    dispatch(loadLayers());
    dispatch(fetchAllCategories());
    dispatch(fetchAllRegions());
    dispatch(fetchManagedSpatialEntities());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa điểm này? Toàn bộ dữ liệu 3D, virtual tour và âm thanh liên quan cũng sẽ bị xóa.")) {
      try {
        await dispatch(removeSpatialEntity(id)).unwrap();
      } catch (err) {
        alert("Xóa địa điểm thất bại.");
      }
    }
  };

  // Filtered entities
  const filteredEntities = entities.filter((ent: any) => {
    const matchesSearch = !searchTerm || ent.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLayer = !selectedLayerId || ent.layerId === selectedLayerId;
    const matchesCategory = !selectedCategoryId || ent.categoryId === selectedCategoryId;
    const matchesRegion = !selectedRegionId || ent.regionId === selectedRegionId;
    const matchesStatus = !selectedStatus || ent.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesLayer && matchesCategory && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Địa điểm của tôi"
        description="Quản lý danh sách các địa điểm, công trình hoặc cơ sở do bạn sở hữu và vận hành."
      >
        <button
          onClick={() => navigate("new")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <Plus size={18} />
          Thêm địa điểm
        </button>
      </AdminPageHeader>

      {/* Filter panel */}
      <Surface className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            />
          </div>

          <div>
            <select
              value={selectedLayerId}
              onChange={(e) => setSelectedLayerId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tất cả Lớp bản đồ</option>
              {layers.map((l: any) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tất cả Danh mục</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tất cả Khu vực</option>
              {regions.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Lưu trữ</option>
            </select>
          </div>
        </div>
      </Surface>

      {/* Main Content Area */}
      {status === "loading" && entities.length === 0 ? (
        <LoadingSpinner className="py-12" />
      ) : filteredEntities.length === 0 ? (
        <Surface className="p-12 text-center text-slate-500">
          <MapPin size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Không tìm thấy địa điểm nào</p>
          <p className="text-sm text-slate-400 mt-1">
            Bạn chưa có địa điểm nào được tạo hoặc không có địa điểm nào khớp với bộ lọc.
          </p>
        </Surface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntities.map((ent: any) => {
            const coverUrl = ent.coverMedia?.fileUrl 
              ? resolveAssetUrl(ent.coverMedia.fileUrl)
              : ent.iconUrl 
                ? resolveAssetUrl(ent.iconUrl)
                : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"; // fallback

            const cat = categories.find((c) => c.id === ent.categoryId);
            const reg = regions.find((r) => r.id === ent.regionId);

            return (
              <Surface key={ent.id} className="overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 border border-slate-100">
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={coverUrl}
                      alt={ent.name ?? "Cover"}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={ent.status || "draft"} />
                    </div>
                    {ent.hasVirtualTour && (
                      <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                        <Video size={13} />
                        VR 360
                      </div>
                    )}
                  </div>

                  <div className="px-6 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {cat && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                      )}
                      {reg && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                          {reg.name}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">{ent.name || "Chưa đặt tên"}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{ent.address || "Cần Thơ, Việt Nam"}</p>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 min-h-[2.5rem]">
                      {ent.shortDescription || "Không có mô tả ngắn."}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-slate-100/80 mt-4 flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    {ent.modelUrl && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100" title="Đã có mô hình 3D">
                        3D
                      </span>
                    )}
                    {ent.audioUrl && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100" title="Đã có Audio Guide">
                        Audio
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => navigate(`/explore?entityId=${ent.id}`)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Xem trên bản đồ Explore"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(ent.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa chi tiết"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(ent.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa địa điểm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ManagerEntitiesPage;
