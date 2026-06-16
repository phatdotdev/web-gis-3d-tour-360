import { X, MapPin, Video, Eye, Volume2, Box } from "lucide-react";
import { Surface } from "../ui";
import { resolveAssetUrl } from "../../utils/httpClient";

type SpatialEntityCardProps = {
  entity: any;
  onClose: () => void;
  onExploreTour: () => void;
  onViewDetails: () => void;
};

export const SpatialEntityCard = ({
  entity,
  onClose,
  onExploreTour,
  onViewDetails,
}: SpatialEntityCardProps) => {
  if (!entity) return null;

  const coverUrl = entity.coverMedia?.fileUrl
    ? resolveAssetUrl(entity.coverMedia.fileUrl)
    : entity.iconUrl
    ? resolveAssetUrl(entity.iconUrl)
    : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";

  return (
    <Surface className="w-full max-w-sm border border-slate-200/50 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
      <div className="relative h-40 bg-slate-100">
        <img
          src={coverUrl}
          alt={entity.name}
          className="w-full h-full object-cover"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full transition-colors backdrop-blur-sm cursor-pointer"
        >
          <X size={16} />
        </button>

        {entity.hasVirtualTour && (
          <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Video size={13} />
            VR 360
          </div>
        )}
      </div>

      <div className="p-5 space-y-4 text-xs font-semibold text-slate-600">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-blue-600">
            <MapPin size={14} className="shrink-0" />
            <span className="font-bold text-[10px] uppercase tracking-wider">
              {entity.category?.name || "Địa điểm"}
            </span>
          </div>
          <h3 className="text-base font-black text-slate-800 line-clamp-1">{entity.name}</h3>
          <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{entity.address || "Cần Thơ, Việt Nam"}</p>
        </div>

        <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">
          {entity.shortDescription || "Khám phá địa điểm du lịch số hóa 3D và không gian VR 360 thực tế ảo."}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1.5">
          {(entity.assetUrl || entity.modelUrl) && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100">
              <Box size={12} />
              Mô hình 3D
            </span>
          )}
          {entity.audioUrl && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-100">
              <Volume2 size={12} />
              Audio Guide
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            <Eye size={14} />
            Xem chi tiết
          </button>
          <button
            onClick={onExploreTour}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Video size={14} />
            Tham quan 3D
          </button>
        </div>
      </div>
    </Surface>
  );
};
export default SpatialEntityCard;
