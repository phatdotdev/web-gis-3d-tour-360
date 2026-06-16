import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";
import {
  LayoutDashboard,
  MapPin,
  LogOut,
} from "lucide-react";

const navItems = [
  { path: "/manager/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { path: "/manager/entities", label: "Địa điểm của tôi", icon: MapPin },
];

export const ManagerLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      <aside className="w-64 bg-emerald-900 text-emerald-100 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-emerald-800">
          <Link to="/" className="text-xl font-bold text-white tracking-tight">
            Manager Panel
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-700 text-white"
                      : "hover:bg-emerald-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-white truncate">
                {user?.displayName || "Manager"}
              </span>
              <span className="text-xs text-emerald-300 truncate">
                {user?.email}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-auto bg-slate-50 p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
