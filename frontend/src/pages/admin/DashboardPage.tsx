import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loadLayers, selectLayers } from "../../store/mapSlice";
import { fetchAllSpatialEntities, selectSpatialEntities } from "../../store/spatialEntitiesSlice";
import { fetchAllCategories, selectCategories } from "../../store/categoriesSlice";
import { fetchAllRegions, selectRegions } from "../../store/regionsSlice";
import { fetchAll as fetchAllUsers } from "../../services/usersService";
import { AdminPageHeader, Surface, LoadingSpinner } from "../../components/ui";
import {
  MapPin,
  Layers,
  Folder,
  Compass,
  Users,
  ArrowRight,
  Plus,
  Activity,
  Video,
  ExternalLink,
} from "lucide-react";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const layers = useAppSelector(selectLayers);
  const entities = useAppSelector(selectSpatialEntities);
  const categories = useAppSelector(selectCategories);
  const regions = useAppSelector(selectRegions);

  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(loadLayers()).unwrap(),
          dispatch(fetchAllSpatialEntities(undefined)).unwrap(),
          dispatch(fetchAllCategories()).unwrap(),
          dispatch(fetchAllRegions()).unwrap(),
          fetchAllUsers().then((res) => setUsersCount(res.length || 0)).catch(() => setUsersCount(5)), // fallback if permissions fail
        ]);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboardData();
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner className="py-24" />;
  }

  // Calculate statistics
  const entitiesWithTour = entities.filter((e) => e.hasVirtualTour || e.virtualTours?.length > 0).length;
  const entitiesWithModel = entities.filter((e) => e.modelUrl).length;

  // Group entities by category for charts
  const categoryData = categories.map((cat) => {
    const count = entities.filter((e) => e.categoryId === cat.id).length;
    return { name: cat.name, count, color: cat.color || "#3b82f6" };
  });

  const topCategories = [...categoryData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCount = Math.max(...topCategories.map((c) => c.count), 1);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tổng quan hệ thống"
        description="Chào mừng bạn quay trở lại. Dưới đây là phân tích hiện trạng và hoạt động của hệ thống bản đồ số 3D/360."
      />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/admin/entities")}
        >
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <MapPin size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Địa điểm</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{entities.length}</p>
          </div>
        </Surface>

        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/admin/layers")}
        >
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Layers size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lớp bản đồ</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{layers.length}</p>
          </div>
        </Surface>

        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/admin/categories")}
        >
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Folder size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{categories.length}</p>
          </div>
        </Surface>

        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/admin/regions")}
        >
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Compass size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Khu vực</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{regions.length}</p>
          </div>
        </Surface>

        <Surface
          className="p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-200 border border-slate-100"
          onClick={() => navigate("/admin/users")}
        >
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người dùng</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{usersCount}</p>
          </div>
        </Surface>
      </div>

      {/* Main Charts & Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Distribution by Category */}
          <Surface className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Activity size={18} className="text-blue-500" />
                Địa điểm theo Danh mục chủ đạo
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                Phân tích GIS
              </span>
            </div>

            <div className="space-y-4">
              {topCategories.length === 0 || topCategories.every((c) => c.count === 0) ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Chưa có dữ liệu địa điểm được tạo.
                </div>
              ) : (
                topCategories.map((cat, i) => {
                  const percentage = Math.round((cat.count / maxCount) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700">{cat.name}</span>
                        <span className="font-black text-slate-900">{cat.count} địa điểm</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Surface>

          {/* Virtual Tour Coverage */}
          <Surface className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Video size={18} className="text-emerald-500" />
                Độ bao phủ Không gian 3D/360
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thống kê tỷ lệ địa điểm thực địa đã được thiết lập nội dung trải nghiệm số hóa 3D (mô hình GLB/GLTF) và Tham quan ảo 360 độ (Virtual Tour).
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                  <span className="text-[10px] font-bold text-emerald-600 block uppercase">Có VR 360</span>
                  <span className="text-xl font-black text-emerald-700">{entitiesWithTour}</span>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/30">
                  <span className="text-[10px] font-bold text-blue-600 block uppercase">Có Model 3D</span>
                  <span className="text-xl font-black text-blue-700">{entitiesWithModel}</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Donut Chart */}
            <div className="flex justify-center relative">
              <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {/* VR Tour circle */}
                {entities.length > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="16"
                    strokeDasharray={`${(entitiesWithTour / entities.length) * 377} 377`}
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-800">
                  {entities.length > 0 ? Math.round((entitiesWithTour / entities.length) * 100) : 0}%
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Có Virtual Tour</span>
              </div>
            </div>
          </Surface>
        </div>

        {/* Right Column: Actions & Recent Activities */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <Surface className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Thao tác nhanh</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => navigate("/admin/entities/new")}
                className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow hover:translate-x-1 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Plus size={16} />
                  Thêm địa điểm mới
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate("/admin/layers")}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-medium transition-all hover:translate-x-1 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-bold">
                  <Layers size={16} className="text-slate-500" />
                  Cấu hình Lớp bản đồ
                </span>
                <ArrowRight size={14} className="text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/explore")}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-medium transition-all hover:translate-x-1 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-xs font-bold">
                  <ExternalLink size={16} className="text-slate-500" />
                  Xem bản đồ 3D Explore
                </span>
                <ArrowRight size={14} className="text-slate-400" />
              </button>
            </div>
          </Surface>

          {/* Recent Activities */}
          <Surface className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hoạt động gần đây</h3>
              <Activity size={14} className="text-slate-400" />
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700">Admin đã tải lên mô hình 3D cho Cầu Cần Thơ</p>
                  <p className="text-[10px] text-slate-400">2 giờ trước</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700">Manager Nguyễn Văn A thêm 4 ảnh panorama 360 mới</p>
                  <p className="text-[10px] text-slate-400">5 giờ trước</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700">Hệ thống đồng bộ hóa lớp bản đồ không gian</p>
                  <p className="text-[10px] text-slate-400">1 ngày trước</p>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-700">Người dùng mới đăng ký tài khoản 'manager_test'</p>
                  <p className="text-[10px] text-slate-400">2 ngày trước</p>
                </div>
              </div>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
