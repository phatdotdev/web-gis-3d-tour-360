import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchManagedSpatialEntities, selectSpatialEntities } from "../../store/spatialEntitiesSlice";
import { AdminPageHeader, Surface, LoadingSpinner } from "../../components/ui";
import {
  MapPin,
  Video,
  Database,
  Plus,
  ArrowRight,
  Compass,
  Activity,
  Award,
} from "lucide-react";

export const ManagerDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const entities = useAppSelector(selectSpatialEntities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchManagedSpatialEntities())
      .unwrap()
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner className="py-24" />;
  }

  // Stats
  const tourCount = entities.filter((e) => e.hasVirtualTour || e.virtualTours?.length > 0).length;
  const modelCount = entities.filter((e) => e.modelUrl).length;
  const activeCount = entities.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tổng quan quản trị viên cơ sở"
        description="Chào mừng Quản lý cơ sở. Dưới đây là thống kê chi tiết các công trình và địa điểm do bạn vận hành."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/manager/entities")}
        >
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <MapPin size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa điểm của tôi</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{entities.length}</p>
          </div>
        </Surface>

        <Surface className="p-5 flex items-center gap-4 border border-slate-100">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Video size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cảnh 360 VR</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{tourCount}</p>
          </div>
        </Surface>

        <Surface className="p-5 flex items-center gap-4 border border-slate-100">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Database size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mô hình 3D</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{modelCount}</p>
          </div>
        </Surface>

        <Surface className="p-5 flex items-center gap-4 border border-slate-100">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoạt động</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{activeCount}</p>
          </div>
        </Surface>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left list of entities */}
        <Surface className="lg:col-span-2 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            Danh sách địa điểm sở hữu
          </h3>

          {entities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Bạn chưa đăng ký địa điểm nào. Nhấn "+ Thêm địa điểm" để bắt đầu số hóa.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
              {entities.map((e) => (
                <div key={e.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{e.name}</h4>
                      <p className="text-[10px] text-slate-400">{e.address || "Cần Thơ"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      e.status === "active" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {e.status === "active" ? "Hoạt động" : "Bản nháp"}
                    </span>
                    <button
                      onClick={() => navigate(`/manager/entities/${e.id}`)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded transition-all cursor-pointer"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>

        {/* Right card actions */}
        <Surface className="p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Thao tác nhanh</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bắt đầu tạo hồ sơ địa điểm du lịch, tải lên các ảnh chụp 360 độ hoặc nhúng mô hình kiến trúc 3D công trình để khách du lịch có thể tham quan ảo từ xa.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate("/manager/entities/new")}
              className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow hover:translate-x-1 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-xs font-bold">
                <Plus size={16} />
                Thêm địa điểm mới
              </span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-medium transition-all hover:translate-x-1 cursor-pointer"
            >
              <span className="flex items-center gap-2 text-xs font-bold">
                <Compass size={16} className="text-slate-500" />
                Xem trên Bản đồ lớn
              </span>
              <ArrowRight size={14} className="text-slate-400" />
            </button>
          </div>
        </Surface>
      </div>
    </div>
  );
};
export default ManagerDashboardPage;
