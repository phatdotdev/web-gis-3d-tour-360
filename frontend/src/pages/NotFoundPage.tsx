import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50">
      <h1 className="text-9xl font-extrabold text-slate-200">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-4">Không tìm thấy trang</h2>
      <p className="text-slate-500 mt-2 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
};
