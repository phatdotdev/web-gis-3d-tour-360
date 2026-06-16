import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllRegions,
  createRegion,
  updateRegion,
  removeRegion,
  selectRegions,
  selectRegionsStatus,
} from "../../store/regionsSlice";
import { AdminPageHeader, Surface, LoadingSpinner } from "../../components/ui";
import { Plus, Edit2, Trash2, X, MapPin, Map } from "lucide-react";

export const RegionsPage = () => {
  const dispatch = useAppDispatch();
  const regions = useAppSelector(selectRegions);
  const status = useAppSelector(selectRegionsStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<any>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("Cần Thơ");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [centerLatitude, setCenterLatitude] = useState(10.03);
  const [centerLongitude, setCenterLongitude] = useState(105.78);
  const [defaultZoom, setDefaultZoom] = useState(14);

  useEffect(() => {
    dispatch(fetchAllRegions());
  }, [dispatch]);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingRegion) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setEditingRegion(null);
    setName("");
    setSlug("");
    setDescription("");
    setProvince("Cần Thơ");
    setDistrict("");
    setWard("");
    setCenterLatitude(10.03);
    setCenterLongitude(105.78);
    setDefaultZoom(14);
    setIsModalOpen(true);
  };

  const openEditModal = (reg: any) => {
    setEditingRegion(reg);
    setName(reg.name || "");
    setSlug(reg.slug || "");
    setDescription(reg.description || "");
    setProvince(reg.province || "Cần Thơ");
    setDistrict(reg.district || "");
    setWard(reg.ward || "");
    setCenterLatitude(reg.centerLatitude || 10.03);
    setCenterLongitude(reg.centerLongitude || 105.78);
    setDefaultZoom(reg.defaultZoom || 14);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description,
      province,
      district,
      ward,
      centerLatitude: Number(centerLatitude),
      centerLongitude: Number(centerLongitude),
      defaultZoom: Number(defaultZoom),
    };

    try {
      if (editingRegion) {
        await dispatch(updateRegion({ id: editingRegion.id, dto: payload })).unwrap();
      } else {
        await dispatch(createRegion(payload)).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Đã xảy ra lỗi khi lưu khu vực");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khu vực này? Tất cả địa điểm thuộc khu vực này sẽ cần được cấu hình lại.")) {
      try {
        await dispatch(removeRegion(id)).unwrap();
      } catch (err) {
        alert("Không thể xóa khu vực này.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý khu vực"
        description="Quản lý vùng địa lý, khu vực dự án hoặc đơn vị hành chính quản hạt địa điểm du lịch số."
      >
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <Plus size={18} />
          Thêm khu vực
        </button>
      </AdminPageHeader>

      {status === "loading" && regions.length === 0 ? (
        <LoadingSpinner className="py-12" />
      ) : regions.length === 0 ? (
        <Surface className="p-12 text-center text-slate-500">
          <Map size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Chưa có khu vực nào</p>
          <p className="text-sm text-slate-400 mt-1">Hãy tạo khu vực hành chính đầu tiên cho ứng dụng bản đồ của bạn.</p>
        </Surface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((reg: any) => (
            <Surface key={reg.id} className="p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(reg)}
                      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{reg.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">slug: {reg.slug}</p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Địa chính:</span>
                    <span className="font-medium text-slate-700">
                      {[reg.ward, reg.district, reg.province].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tọa độ trung tâm:</span>
                    <span className="font-mono text-xs text-slate-700">
                      {reg.centerLatitude?.toFixed(4)}, {reg.centerLongitude?.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Zoom mặc định:</span>
                    <span className="font-medium text-slate-700">{reg.defaultZoom ?? 14}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] pt-1">
                  {reg.description || "Không có mô tả cho khu vực này."}
                </p>
              </div>
            </Surface>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[backdrop-fade_0.2s_ease]">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-[modal-enter_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingRegion ? "Cập nhật khu vực" : "Tạo khu vực mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tên khu vực <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Ví dụ: Quận Ninh Kiều, Phân khu B, Cần Thơ"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                    placeholder="quan-ninh-kieu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tỉnh / Thành phố
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Cần Thơ"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quận / Huyện
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Ninh Kiều"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phường / Xã
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Xuân Khánh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Zoom mặc định (Vite/ArcGIS)
                  </label>
                  <input
                    type="number"
                    value={defaultZoom}
                    onChange={(e) => setDefaultZoom(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    min={1}
                    max={20}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Vĩ độ trung tâm (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={centerLatitude}
                    onChange={(e) => setCenterLatitude(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                    placeholder="10.03711"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kinh độ trung tâm (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={centerLongitude}
                    onChange={(e) => setCenterLongitude(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                    placeholder="105.78244"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mô tả khu vực
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                    placeholder="Mô tả tóm tắt về khu vực này..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
