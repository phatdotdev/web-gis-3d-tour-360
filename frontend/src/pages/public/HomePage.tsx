import { Link } from "react-router-dom";
import { Compass, Map, Video, MapPin, Sprout, ArrowRight, Sparkles, Heart } from "lucide-react";

export const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-indigo-50/20 to-transparent pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/50 text-blue-700 rounded-full text-xs font-black tracking-wide uppercase">
              <Sparkles size={12} className="animate-pulse" />
              Công nghệ số hóa không gian 3D
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Bản Đồ Số Du Lịch & <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sinh Kế Bền Vững
              </span> <br />
              Thành phố Cần Thơ
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-slate-650 font-semibold leading-relaxed">
              Trải nghiệm không gian số hóa 3D trực quan và hệ thống thực tế ảo VR 360. 
              Nơi kết nối du khách thập phương với các danh thắng nổi tiếng và các mô hình sinh kế nông nghiệp miệt vườn đặc trưng vùng sông nước Cửu Long.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-150"
              >
                <Compass size={18} />
                Khám phá Bản đồ 3D
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-all duration-150"
              >
                <Video size={18} className="text-emerald-500" />
                Tham quan VR 360
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60 max-w-lg text-xs font-semibold text-slate-500">
              <div>
                <span className="block text-2xl font-black text-slate-900 leading-none mb-1">100%</span>
                Không gian thực địa số hóa
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900 leading-none mb-1">3D GIS</span>
                Định vị tọa độ chuẩn xác
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-900 leading-none mb-1">360° VR</span>
                Tương tác điểm chạm ảo
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Visual Teaser Card Mockup */}
            <div className="relative mx-auto max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-4 overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="relative h-64 bg-slate-100 rounded-xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1543731068-7e0f5beff43a?auto=format&fit=crop&w=800&q=80"
                  alt="Du lịch Cần Thơ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-blue-600 shadow-sm">
                  Cảnh 360° nổi bật
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-black text-sm">Chợ nổi Cái Răng</h3>
                    <p className="text-white/80 text-[10px] font-bold">Văn hóa sông nước Cần Thơ</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">Thực tế ảo VR</span>
                  <span className="text-emerald-600 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Sẵn sàng
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Tương tác trực tiếp trên bản đồ số, nhấp ghim để bước vào hành trình tham quan 3D, nghe thuyết minh hướng dẫn chi tiết từng vật thể.
                </p>
                <Link
                  to="/explore"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  Mở bản đồ xem ngay <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tourism Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-black tracking-widest text-blue-600 uppercase flex items-center justify-center gap-1.5">
            <MapPin size={14} /> Điểm đến du lịch nổi bật
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Khám phá tinh hoa vùng sông nước Tây Đô
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
            Hành trình văn hóa độc đáo từ các di tích lịch sử cổ kính đến các khu du lịch sinh thái miệt vườn trĩu quả.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-250/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80"
                alt="Bến Ninh Kiều"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                Danh thắng
              </span>
            </div>
            <div className="p-5 space-y-3 text-xs font-semibold text-slate-650">
              <h4 className="text-base font-black text-slate-800">Bến Ninh Kiều</h4>
              <p className="leading-relaxed font-medium">
                Biểu tượng văn hóa sông nước tráng lệ của Cần Thơ. Bản đồ 3D hiển thị chi tiết mô hình cây cầu tình yêu, công viên trung tâm và bến tàu tấp nập.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                <span className="text-blue-600 font-bold">GIS 3D Model</span>
                <Link to="/explore" className="text-slate-800 hover:text-blue-600 flex items-center gap-0.5 font-bold">
                  Khám phá <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-250/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
                alt="Chợ nổi Cái Răng"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                VR 360° Tour
              </span>
            </div>
            <div className="p-5 space-y-3 text-xs font-semibold text-slate-650">
              <h4 className="text-base font-black text-slate-800">Chợ nổi Cái Răng</h4>
              <p className="leading-relaxed font-medium">
                Khu chợ nổi giao thương nông sản trên sông độc đáo bậc nhất Việt Nam. Trải nghiệm tour 360° thực tế ảo, nghe âm thanh nhộn nhịp mua bán lúc bình minh.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                <span className="text-emerald-600 font-bold">Audio Guide & VR</span>
                <Link to="/explore" className="text-slate-800 hover:text-blue-600 flex items-center gap-0.5 font-bold">
                  Trải nghiệm <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-250/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
                alt="Du lịch sinh thái Cồn Sơn"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2 py-1 bg-indigo-650 text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                Sinh thái
              </span>
            </div>
            <div className="p-5 space-y-3 text-xs font-semibold text-slate-650">
              <h4 className="text-base font-black text-slate-800">Cồn Sơn</h4>
              <p className="leading-relaxed font-medium">
                Vùng đất cồn sông Hậu với nét sinh hoạt miệt vườn truyền thống như trình diễn cá lóc bay, làm bánh dân gian Tây Nam Bộ và tham quan các vườn chôm chôm, nhãn xuồng.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                <span className="text-indigo-600 font-bold">Vườn quả & Làng bè</span>
                <Link to="/explore" className="text-slate-800 hover:text-blue-600 flex items-center gap-0.5 font-bold">
                  Khám phá <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Livelihoods Section */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-black tracking-widest text-indigo-600 uppercase flex items-center justify-center gap-1.5">
              <Sprout size={14} /> Mô hình sinh kế bền vững
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              Số hóa bảo tồn làng nghề & sinh thái miệt vườn
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
              Chúng tôi hỗ trợ người dân bản địa tiếp cận công nghệ số, quảng bá sản phẩm nông nghiệp và sinh kế đặc trưng vùng ĐBSCL tới cộng đồng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Image Show */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=400&q=80"
                    alt="Làng hoa kiểng Bà Bộ"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80"
                    alt="Vườn dâu Phong Điền"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-60 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c7769ae?auto=format&fit=crop&w=400&q=80"
                    alt="Lò hủ tiếu truyền thống"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1563514220-ea97900b172a?auto=format&fit=crop&w=400&q=80"
                    alt="Can Tho agriculture"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right List Detail */}
            <div className="space-y-6">
              {/* Livelihood 1 */}
              <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Sprout size={22} />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="text-base font-black text-slate-800">Làng hoa kiểng Bà Bộ</h4>
                  <p className="text-slate-500 font-semibold leading-relaxed">
                    Nơi lưu giữ truyền thống trồng hoa kiểng trứ danh Nam Bộ. Việc định vị không gian 3D trên bản đồ số giúp khách tham quan dễ dàng liên hệ đặt mua hoa và lên lịch chụp hình check-in mùa hoa Tết.
                  </p>
                </div>
              </div>

              {/* Livelihood 2 */}
              <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Map size={22} />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="text-base font-black text-slate-800">Nghề hủ tiếu truyền thống Cái Răng</h4>
                  <p className="text-slate-500 font-semibold leading-relaxed">
                    Mô hình làng nghề sản xuất hủ tiếu thủ công gia truyền kết hợp với phát triển du lịch. Tour thực tế ảo 360° đưa khách tham quan chi tiết quy trình tráng bánh, phơi khô và thưởng thức hủ tiếu pizza trứ danh.
                  </p>
                </div>
              </div>

              {/* Livelihood 3 */}
              <div className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Video size={22} />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="text-base font-black text-slate-800">Vườn cây ăn trái Phong Điền (Dâu Hạ Châu)</h4>
                  <p className="text-slate-500 font-semibold leading-relaxed">
                    Vườn sinh thái trồng giống dâu Hạ Châu ngọt thanh, đặc sản bản địa Phong Điền. Hệ thống hỗ trợ khách đặt tour trực tiếp từ vườn dâu ảo hoặc liên hệ mua hoa quả chính gốc bảo đảm sinh kế nông nghiệp số.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
          <div className="space-y-4 max-w-2xl text-left">
            <h3 className="text-2xl md:text-3xl font-black">Sẵn sàng trải nghiệm Cần Thơ 3D?</h3>
            <p className="text-sm text-white/80 font-bold leading-relaxed">
              Mở bản đồ số ngay hôm nay để bắt đầu hành trình khám phá hệ sinh thái du lịch đa phương tiện cùng các làng nghề, mô hình sinh kế nông nghiệp sinh động.
            </p>
          </div>
          <Link
            to="/explore"
            className="px-6 py-3 bg-white hover:bg-slate-100 text-blue-650 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer"
          >
            Trải nghiệm Bản đồ 3D
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 text-xs font-semibold text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-slate-400" />
            <span className="font-black text-slate-600">Cần Thơ 3D</span>
            <span>- Bản đồ số hóa Du lịch & Sinh kế cộng đồng</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Thiết kế bởi Đội ngũ kỹ thuật Cần Thơ</span>
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default HomePage;
