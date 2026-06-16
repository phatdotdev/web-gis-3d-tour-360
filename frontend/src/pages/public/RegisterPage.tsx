import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, User, Compass, ArrowRight } from "lucide-react";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, displayName, password, "location_manager");
      navigate("/manager/dashboard");
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6 bg-brand-light">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border border-brand-border shadow-sm space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 text-brand-primary rounded-lg">
            <Compass size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Đăng ký tài khoản</h1>
          <p className="text-xs text-brand-muted font-medium">Đăng ký để quản lý thông tin các điểm tọa độ 3D</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-brand-danger border border-red-150 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Họ tên</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-semibold text-slate-700 placeholder-Nguyễn Văn A"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-semibold text-slate-700 placeholder-ten@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-sm font-semibold text-slate-700 placeholder-••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-primary hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            Đăng ký tài khoản
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-brand-muted">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-brand-secondary hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
