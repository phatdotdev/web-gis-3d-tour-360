import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Compass } from "lucide-react";

export const PublicLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20 group-hover:rotate-45 transition-transform duration-300">
              <Compass size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-800 leading-none group-hover:text-blue-650 transition-colors">
                Cần Thơ <span className="text-blue-600">3D</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1 leading-none">
                Bản đồ Du lịch & Sinh kế
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/explore" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
              Khám phá
            </Link>
            <Link to="/search" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
              Tìm kiếm
            </Link>
            <Link to="/intro" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
              Giới thiệu
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Link to="/admin/dashboard" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
                  Quản trị
                </Link>
              )}
              {user?.role === "location_manager" && (
                <Link to="/manager/dashboard" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
                  Quản lý
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-xs font-bold text-slate-650 hover:text-blue-600 transition-colors">
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all duration-150"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 flex flex-col min-h-0">
        <Outlet />
      </main>
    </div>
  );
};
