type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const cleanStatus = status?.toLowerCase() || "";
  let classes = "bg-slate-100 text-slate-700 border-slate-200";
  let text = status;

  if (cleanStatus === "active" || cleanStatus === "published") {
    classes = "bg-emerald-50 text-emerald-700 border-emerald-100";
    text = "Hoạt động";
  } else if (cleanStatus === "draft") {
    classes = "bg-slate-100 text-slate-700 border-slate-200";
    text = "Bản nháp";
  } else if (cleanStatus === "archived" || cleanStatus === "inactive") {
    classes = "bg-amber-50 text-amber-700 border-amber-100";
    text = "Lưu trữ";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {text}
    </span>
  );
};
