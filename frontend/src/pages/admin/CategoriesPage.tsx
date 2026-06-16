import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  removeCategory,
  selectCategories,
  selectCategoriesStatus,
} from "../../store/categoriesSlice";
import { AdminPageHeader, Surface, LoadingSpinner } from "../../components/ui";
import { Plus, Edit2, Trash2, X, Folder, Eye } from "lucide-react";

export const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const status = useAppSelector(selectCategoriesStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📂");
  const [color, setColor] = useState("#3b82f6");
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("📂");
    setColor("#3b82f6");
    setDisplayOrder(categories.length);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setDescription(cat.description || "");
    setIcon(cat.icon || "📂");
    setColor(cat.color || "#3b82f6");
    setDisplayOrder(cat.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description,
      icon,
      color,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, dto: payload })).unwrap();
      } else {
        await dispatch(createCategory(payload)).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Đã xảy ra lỗi khi lưu danh mục");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Hợp phần liên quan có thể bị ảnh hưởng.")) {
      try {
        await dispatch(removeCategory(id)).unwrap();
      } catch (err) {
        alert("Không thể xóa danh mục này.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản lý danh mục"
        description="Quản lý các danh mục phân loại thực thể không gian trên bản đồ du lịch."
      >
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all duration-150 cursor-pointer"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>
      </AdminPageHeader>

      {status === "loading" && categories.length === 0 ? (
        <LoadingSpinner className="py-12" />
      ) : categories.length === 0 ? (
        <Surface className="p-12 text-center text-slate-500">
          <Folder size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-700">Chưa có danh mục nào</p>
          <p className="text-sm text-slate-400 mt-1">Hãy tạo danh mục đầu tiên để phân loại địa điểm của bạn.</p>
        </Surface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat: any) => (
            <Surface key={cat.id} className="p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    {cat.icon || "📂"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    {cat.name}
                    <span 
                      className="w-2.5 h-2.5 rounded-full inline-block" 
                      style={{ backgroundColor: cat.color || "#3b82f6" }}
                    />
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">slug: {cat.slug}</p>
                </div>

                <p className="text-sm text-slate-600 line-clamp-3 min-h-[4.5rem]">
                  {cat.description || "Không có mô tả cho danh mục này."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs text-slate-400">
                <span>Thứ tự hiển thị: {cat.displayOrder ?? 0}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  Hiển thị bản đồ
                </span>
              </div>
            </Surface>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[backdrop-fade_0.2s_ease]">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-[modal-enter_0.25s_cubic-bezier(0.34,1.56,0.64,1)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? "Cập nhật danh mục" : "Tạo danh mục mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tên danh mục <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="Ví dụ: Homestay, Địa điểm ẩm thực, Bến tàu"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                    placeholder="ví-dụ-homestay-dia-diem-am-thuc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Emoji Biểu tượng (Icon)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-center"
                    placeholder="🔍"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Màu sắc nhận diện
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 border border-slate-300 rounded-xl cursor-pointer p-0 overflow-hidden bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Thứ tự hiển thị (Ưu tiên)
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mô tả danh mục
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                    placeholder="Mô tả tóm tắt về loại danh mục này..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
