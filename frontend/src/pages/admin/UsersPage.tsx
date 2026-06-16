import { useState, useEffect } from "react";
import { AdminPageHeader, Surface, StatusBadge, LoadingSpinner } from "../../components/ui";
import * as usersService from "../../services/usersService";
import {
  Users,
  Plus,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  X,
  Mail,
  UserPlus,
  Key,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  displayName?: string;
  role: string;
  status: string;
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating user
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersService.fetchAll();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await usersService.create({ email, displayName, password, role });
      setIsModalOpen(false);
      // Reset form
      setEmail("");
      setDisplayName("");
      setPassword("");
      setRole("viewer");
      // Reload list
      void fetchUsers();
    } catch (err: any) {
      alert(err.message || "Tạo người dùng thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      await usersService.updateRole(id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      alert(err.message || "Cập nhật vai trò thất bại.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await usersService.updateStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err: any) {
      alert(err.message || "Cập nhật trạng thái thất bại.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await usersService.remove(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err: any) {
        alert(err.message || "Xóa người dùng thất bại.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý người dùng"
        description="Quản lý thông tin tài khoản, cấu hình phân quyền hệ thống và trạng thái hoạt động."
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <Plus size={18} />
          Tạo tài khoản
        </button>
      </AdminPageHeader>

      {loading ? (
        <LoadingSpinner className="py-24" />
      ) : users.length === 0 ? (
        <Surface className="p-12 text-center text-slate-500">
          <Users size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Chưa có người dùng nào</p>
          <p className="text-sm text-slate-400 mt-1">
            Bắt đầu bằng cách tạo tài khoản đầu tiên.
          </p>
        </Surface>
      ) : (
        <Surface className="overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Người dùng</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100/80 text-slate-600 flex items-center justify-center font-bold text-sm">
                          {(u.displayName || u.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {u.displayName || "Chưa đặt tên"}
                          </p>
                          <p className="text-[10px] text-slate-400">ID: {u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg font-bold border focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${
                          u.role === "admin"
                            ? "text-rose-600 border-rose-100 bg-rose-50/30"
                            : u.role === "location_manager"
                            ? "text-indigo-600 border-indigo-100 bg-indigo-50/30"
                            : "text-slate-600 border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <option value="admin">Quản trị viên (Admin)</option>
                        <option value="location_manager">Quản lý khu vực (Manager)</option>
                        <option value="viewer">Khách xem (Viewer)</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={u.status || "active"} />
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            u.status === "active"
                              ? "text-amber-600 border-amber-100 hover:bg-amber-50"
                              : "text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                          }`}
                          title={u.status === "active" ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                        >
                          {u.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tài khoản"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      )}

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Surface className="w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-full cursor-pointer text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 mb-5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <UserPlus size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Tạo tài khoản mới</h3>
                <p className="text-xs text-slate-400">Đăng ký và cấp quyền trực tiếp cho nhân sự.</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="space-y-1">
                <label className="block">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div className="space-y-1">
                <label className="block flex items-center gap-1">
                  <Mail size={12} className="text-slate-400" /> Email đăng nhập
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  placeholder="email@domain.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block flex items-center gap-1">
                  <Key size={12} className="text-slate-400" /> Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                />
              </div>

              <div className="space-y-1">
                <label className="block flex items-center gap-1">
                  <Shield size={12} className="text-slate-400" /> Quyền truy cập
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="location_manager">Quản lý khu vực (Location Manager)</option>
                  <option value="viewer">Khách xem (Viewer)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all"
                >
                  {submitting ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </Surface>
        </div>
      )}
    </div>
  );
};
export default UsersPage;
