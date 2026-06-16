import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loadLayers,
  createLayerWithFiles,
  updateLayer,
  deleteLayer,
  toggleLayerSelection,
  selectLayers,
  selectSelectedLayerIds,
  selectLayerStatus,
  selectLayerError,
} from "../../store/mapSlice";
import { AdminPageHeader, Surface, LoadingSpinner } from "../../components/ui";
import { Plus, Trash2, Edit2, FileJson, ToggleLeft, ToggleRight, X, Settings } from "lucide-react";

export const LayersPage = () => {
  const dispatch = useAppDispatch();
  const layers = useAppSelector(selectLayers);
  const selectedLayerIds = useAppSelector(selectSelectedLayerIds);
  const status = useAppSelector(selectLayerStatus);
  const error = useAppSelector(selectLayerError);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("geojson");
  const [minZoom, setMinZoom] = useState(0);
  const [maxZoom, setMaxZoom] = useState(24);
  const [zIndex, setZIndex] = useState(1);
  const [visible, setVisible] = useState(true);

  // File states
  const [geoJsonFile, setGeoJsonFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(loadLayers());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingLayer(null);
    setName("");
    setType("geojson");
    setMinZoom(0);
    setMaxZoom(24);
    setZIndex(1);
    setVisible(true);
    setGeoJsonFile(null);
    setModelFile(null);
    setIconFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (layer: any) => {
    setEditingLayer(layer);
    setName(layer.name || "");
    setType(layer.type || "geojson");
    setMinZoom(layer.minZoom ?? 0);
    setMaxZoom(layer.maxZoom ?? 24);
    setZIndex(layer.zIndex ?? 1);
    setVisible(layer.visible ?? true);
    setGeoJsonFile(null);
    setModelFile(null);
    setIconFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const layerPayload = {
      name,
      type,
      minZoom: Number(minZoom),
      maxZoom: Number(maxZoom),
      zIndex: Number(zIndex),
      visible,
    };

    try {
      if (editingLayer) {
        // Since we are updating, we use updateLayer thunk
        await dispatch(
          updateLayer({ layerId: editingLayer.id, payload: layerPayload })
        ).unwrap();
        // Upload files if selected
        // Note: For now we can alert if files are chosen because edit file upload is handled by separate endpoints in mapSlice
        if (geoJsonFile || modelFile || iconFile) {
          alert("Lưu ý: Để cập nhật File GeoJSON/Model/Icon, vui lòng xóa và tạo mới lớp bản đồ.");
        }
      } else {
        // Create new layer with optional files
        await dispatch(
          createLayerWithFiles({
            layerPayload,
            geoJsonFile,
            modelFile,
            iconFile,
          })
        ).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Đã xảy ra lỗi khi lưu lớp bản đồ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa lớp bản đồ này? Tất cả các thực thể không gian (Entities) thuộc lớp này sẽ bị xóa theo."
      )
    ) {
      try {
        await dispatch(deleteLayer(id)).unwrap();
      } catch (err) {
        alert("Xóa lớp bản đồ thất bại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý lớp bản đồ"
        description="Định nghĩa các lớp hiển thị (Layers) trên bản đồ 3D ArcGIS và quản lý tệp GeoJSON, mô hình 3D mặc định."
      >
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <Plus size={18} />
          Tải lên / Tạo lớp mới
        </button>
      </AdminPageHeader>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
          Lỗi: {error}
        </div>
      )}

      {status === "loading" && layers.length === 0 ? (
        <LoadingSpinner className="py-12" />
      ) : layers.length === 0 ? (
        <Surface className="p-12 text-center text-slate-500">
          <FileJson size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Chưa có lớp bản đồ nào</p>
          <p className="text-sm text-slate-400 mt-1">
            Hãy tải lên một tệp GeoJSON hoặc tạo một lớp bản đồ trống để bắt đầu hiển thị dữ liệu.
          </p>
        </Surface>
      ) : (
        <Surface className="overflow-hidden border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <th className="py-3.5 px-6">Tên lớp</th>
                  <th className="py-3.5 px-6">Loại dữ liệu</th>
                  <th className="py-3.5 px-6">Đường dẫn tệp tin (Data/3D)</th>
                  <th className="py-3.5 px-6 text-center">Zoom Range</th>
                  <th className="py-3.5 px-6 text-center">Z-Index</th>
                  <th className="py-3.5 px-6 text-center">Hiển thị (Map)</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {layers.map((layer: any) => {
                  const isSelected = selectedLayerIds.includes(layer.id);
                  return (
                    <tr key={layer.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">{layer.name}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                          {layer.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 space-y-1 max-w-xs">
                        {layer.dataUrl && (
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 truncate" title={layer.dataUrl}>
                            <FileJson size={12} className="shrink-0" />
                            <span className="truncate">GeoJSON: {layer.dataUrl.split("/").pop()}</span>
                          </div>
                        )}
                        {layer.modelUrl && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 truncate" title={layer.modelUrl}>
                            <Settings size={12} className="shrink-0" />
                            <span className="truncate">Model GLB: {layer.modelUrl.split("/").pop()}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 font-mono text-xs">
                        {layer.minZoom ?? 0} - {layer.maxZoom ?? 24}
                      </td>
                      <td className="py-4 px-6 text-center text-slate-600 font-semibold">
                        {layer.zIndex ?? 1}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => dispatch(toggleLayerSelection(layer.id))}
                          className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors cursor-pointer"
                        >
                          {isSelected ? (
                            <ToggleRight size={28} className="text-blue-500" />
                          ) : (
                            <ToggleLeft size={28} />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          onClick={() => openEditModal(layer)}
                          className="inline-flex items-center justify-center p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(layer.id)}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa lớp bản đồ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Surface>
      )}

      {/* Layer Upload/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[backdrop-fade_0.2s_ease]">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-[modal-enter_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLayer ? "Cập nhật lớp bản đồ" : "Tải lên lớp bản đồ mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tên lớp bản đồ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Ví dụ: Cống thoát nước Ninh Kiều, Trụ nước chữa cháy"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Loại đối tượng
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    >
                      <option value="geojson">GeoJSON</option>
                      <option value="pipe">Đường ống (Pipe)</option>
                      <option value="manhole">Hố ga (Manhole)</option>
                      <option value="point">Điểm (Point)</option>
                      <option value="polygon">Vùng (Polygon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Z-Index hiển thị
                    </label>
                    <input
                      type="number"
                      value={zIndex}
                      onChange={(e) => setZIndex(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      min={1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Zoom nhỏ nhất (Min Zoom)
                    </label>
                    <input
                      type="number"
                      value={minZoom}
                      onChange={(e) => setMinZoom(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      min={0}
                      max={24}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Zoom lớn nhất (Max Zoom)
                    </label>
                    <input
                      type="number"
                      value={maxZoom}
                      onChange={(e) => setMaxZoom(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      min={0}
                      max={24}
                    />
                  </div>
                </div>

                {/* File Upload Fields (Only show when creating new layer) */}
                {!editingLayer && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Đính kèm tệp tin tài nguyên
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tệp tin bản đồ GeoJSON (.geojson, .json)
                      </label>
                      <input
                        type="file"
                        accept=".geojson,.json"
                        onChange={(e) => setGeoJsonFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mô hình 3D mặc định (.glb, .gltf)
                      </label>
                      <input
                        type="file"
                        accept=".glb,.gltf"
                        onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ảnh biểu tượng định vị (.png, .jpg, .svg)
                      </label>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                        className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  {editingLayer ? "Lưu thay đổi" : "Tạo và Tải lên"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
