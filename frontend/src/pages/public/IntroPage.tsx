import { Link } from "react-router-dom";
import { Compass, Map, Video, Sprout, ArrowRight, BookOpen, Layers } from "lucide-react";

export const IntroPage = () => {
  return (
    <div className="bg-brand-light min-h-screen text-brand-dark">
      <section className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-brand-dark text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-xs font-bold tracking-wide uppercase">
            <Compass size={14} className="text-blue-400" />
            Giới thiệu nền tảng
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Số Hóa Không Gian 3D &<br />
            Hỗ Trợ Sinh Kế Cộng Đồng Cần Thơ
          </h1>
          <p className="text-slate-350 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Hệ thống Bản đồ Web 3D ArcGIS tích hợp công nghệ thực tế ảo VR 360 là giải pháp quảng bá du lịch số và hỗ trợ phát triển các mô hình kinh tế nông nghiệp miệt vườn bền vững.
          </p>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Trải nghiệm ngay
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-xs font-bold tracking-widest text-brand-primary uppercase">
            Công nghệ cốt lõi
          </h2>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Giải pháp số hóa toàn diện
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-brand-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-50 text-brand-primary flex items-center justify-center rounded-lg mb-4 shrink-0">
              <Map size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Bản đồ số 3D GIS</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Hiển thị tọa độ chính xác, mô phỏng không gian ba chiều trực quan của các danh thắng lịch sử, công trình kiến trúc nổi bật và hệ thống hạ tầng du lịch thành phố.
            </p>
          </div>

          <div className="bg-white border border-brand-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-brand-secondary flex items-center justify-center rounded-lg mb-4 shrink-0">
              <Video size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Thực tế ảo VR 360</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Chuyến tham quan ảo đa phương tiện tích hợp hệ thống điểm chạm thông tin, hình ảnh độ phân giải cao và thuyết minh tự động (Audio Guide) ngay trên thiết bị của bạn.
            </p>
          </div>

          <div className="bg-white border border-brand-border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-brand-success flex items-center justify-center rounded-lg mb-4 shrink-0">
              <Sprout size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Sinh kế bền vững</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-medium">
              Cung cấp cầu nối quảng bá mô hình kinh tế nông thôn, vườn sinh thái và làng nghề thủ công, hỗ trợ nâng cao thu nhập cho nông dân địa phương nhờ công nghệ số.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-brand-border py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-primary uppercase">
              <BookOpen size={16} />
              Hướng dẫn sử dụng
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Bắt đầu hành trình trải nghiệm dễ dàng
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Tìm kiếm địa điểm</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Sử dụng tính năng tìm kiếm theo phân loại du lịch hoặc quận/huyện để định vị địa điểm mong muốn.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-secondary flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Tương tác bản đồ 3D</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Nhấn chọn ghim để mở bảng chi tiết, xoay góc nhìn 3D hoặc bấm di chuyển đến điểm quan sát.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-success flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Khám phá tour thực tế ảo</h4>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Nhấp vào biểu tượng VR để bước vào không gian 360 độ và nghe thuyết minh về danh thắng/sản phẩm địa phương.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-light p-6 border border-brand-border rounded-lg space-y-6">
            <h4 className="text-base font-bold text-slate-850 flex items-center gap-2">
              <Layers size={18} className="text-brand-primary" />
              Sứ mệnh của dự án
            </h4>
            <div className="space-y-4 text-xs leading-relaxed text-brand-muted font-medium">
              <p>
                Cần Thơ 3D mong muốn xây dựng cơ sở dữ liệu địa lý vững chắc và nâng tầm tiếp cận du lịch văn hóa miệt vườn. Chúng tôi tin rằng số hóa không gian không chỉ phục vụ khách du lịch mà còn đóng vai trò đắc lực trong bảo tồn văn hóa sông nước.
              </p>
              <p>
                Dự án cũng đồng hành cùng các hợp tác xã sản xuất hủ tiếu truyền thống, vườn trồng cây đặc sản và làng hoa kiểng Bà Bộ nhằm tạo thêm các kênh tiếp xúc khách hàng trực tuyến, tối ưu hóa chuỗi cung ứng nông sản thông minh.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/explore"
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-indigo-750 transition-colors"
              >
                Khám phá Bản đồ 3D
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
