import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllSpatialEntities, selectSpatialEntities } from "../../store/spatialEntitiesSlice";
import { selectCategories, fetchAllCategories } from "../../store/categoriesSlice";
import { selectRegions, fetchAllRegions } from "../../store/regionsSlice";
import { resolveAssetUrl } from "../../utils/httpClient";
import { Search, Video, Compass, ChevronRight, X } from "lucide-react";

export const SearchPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const entities = useAppSelector(selectSpatialEntities);
  const categories = useAppSelector(selectCategories);
  const regions = useAppSelector(selectRegions);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeRegionId, setActiveRegionId] = useState("");

  useEffect(() => {
    dispatch(fetchAllSpatialEntities(undefined));
    dispatch(fetchAllCategories());
    dispatch(fetchAllRegions());
  }, [dispatch]);

  const filteredEntities = entities.filter((ent: any) => {
    if (["inactive", "archived", "deleted"].includes(ent.status)) return false;

    const matchesSearch = !searchTerm || ent.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategoryId || ent.categoryId === activeCategoryId;
    const matchesRegion = !activeRegionId || ent.regionId === activeRegionId;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategoryId("");
    setActiveRegionId("");
  };

  return (
    <div className="bg-brand-light min-h-screen text-brand-dark py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Tìm kiếm địa điểm</h1>
          <p className="text-xs text-brand-muted font-medium">Khám phá các di tích lịch sử, địa danh du lịch và mô hình sinh kế bền vững tại Cần Thơ</p>
        </div>

        <div className="bg-white border border-brand-border p-5 rounded-lg shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Nhập tên địa điểm hoặc di tích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm font-semibold text-slate-700 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="w-full md:w-64">
              <select
                value={activeRegionId}
                onChange={(e) => setActiveRegionId(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:border-brand-secondary text-sm font-semibold text-slate-700"
              >
                <option value="">Tất cả Quận / Huyện</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Danh mục:</span>
            <button
              onClick={() => setActiveCategoryId("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                !activeCategoryId
                  ? "bg-brand-secondary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeCategoryId === cat.id
                    ? "bg-brand-secondary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
            {(searchTerm || activeCategoryId || activeRegionId) && (
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-brand-danger hover:underline ml-auto flex items-center gap-1"
              >
                <X size={12} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-brand-muted">
              Tìm thấy {filteredEntities.length} địa điểm
            </span>
          </div>

          {filteredEntities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map((ent: any) => {
                const coverUrl = ent.coverMedia?.fileUrl
                  ? resolveAssetUrl(ent.coverMedia.fileUrl)
                  : ent.iconUrl
                  ? resolveAssetUrl(ent.iconUrl)
                  : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

                const category = categories.find((c) => c.id === ent.categoryId);
                const region = regions.find((r) => r.id === ent.regionId);

                return (
                  <div
                    key={ent.id}
                    className="bg-white border border-brand-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-slate-100">
                        <img
                          src={coverUrl}
                          alt={ent.name}
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        {ent.hasVirtualTour && (
                          <span className="absolute bottom-3 left-3 bg-brand-success text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Video size={10} />
                            VR 360
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex flex-wrap gap-2 items-center">
                          {category && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border"
                              style={{
                                color: category.color || "#4f46e5",
                                borderColor: `${category.color}40` || "#4f46e540",
                                backgroundColor: `${category.color}10` || "#4f46e510",
                              }}
                            >
                              {category.name}
                            </span>
                          )}
                          {region && (
                            <span className="text-[10px] font-bold text-brand-muted bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {region.name}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-800 line-clamp-1">{ent.name}</h3>
                        <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                          {ent.shortDescription || "Khám phá địa điểm du lịch số hóa 3D và không gian VR 360 thực tế ảo."}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex gap-3 border-t border-slate-50">
                      <button
                        onClick={() => navigate(`/explore/${ent.slug || ent.id}`)}
                        className="flex-1 py-2 text-center border border-brand-border text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => navigate(`/explore?entityId=${ent.id}`)}
                        className="flex-1 py-2 text-center bg-brand-primary text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Bản đồ
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-brand-border rounded-lg p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 flex items-center justify-center rounded-lg mx-auto">
                <Compass size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-850">Không tìm thấy kết quả</h3>
                <p className="text-xs text-brand-muted leading-relaxed font-medium">
                  Chúng tôi không tìm thấy địa điểm nào khớp với điều kiện tìm kiếm hiện tại của bạn. Thử thay đổi từ khóa hoặc xóa bộ lọc.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-brand-secondary text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
