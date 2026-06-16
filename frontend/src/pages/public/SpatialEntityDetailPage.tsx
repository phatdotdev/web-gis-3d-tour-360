import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchAllSpatialEntities, selectSpatialEntities } from "../../store/spatialEntitiesSlice";
import { fetchAllMediaFiles, selectMediaFiles } from "../../store/mediaFilesSlice";
import { fetchAllAudioGuides, selectAudioGuides } from "../../store/audioGuidesSlice";
import { fetchAllVirtualTours, selectVirtualTours } from "../../store/virtualToursSlice";
import { Surface, LoadingSpinner } from "../../components/ui";
import { VirtualTourViewer } from "../../components/public/VirtualTourViewer";
import { fetchSceneByEntity } from "../../services/scenesService";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Play,
  Pause,
  Video,
  Volume2,
  MapPin,
  Compass,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { resolveAssetUrl } from "../../utils/httpClient";

const formatCoordinate = (value: unknown) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(6) : "N/A";
};

const toPublicSlug = (value?: string | null) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const SpatialEntityDetailPage = () => {
  const { entitySlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const entities = useAppSelector(selectSpatialEntities);
  const mediaFiles = useAppSelector(selectMediaFiles);
  const audioGuides = useAppSelector(selectAudioGuides);
  const tours = useAppSelector(selectVirtualTours);

  const [loading, setLoading] = useState(true);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [hasScene, setHasScene] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Audio Guide Player States
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Find entity by slug
  const entity = entities.find(
    (e) =>
      e.slug === entitySlug ||
      toPublicSlug(e.name) === entitySlug,
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchAllSpatialEntities(undefined)).unwrap();
      } catch (err) {
        console.error("Lỗi tải thực thể", err);
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [dispatch]);

  useEffect(() => {
    if (entity) {
      void dispatch(fetchAllMediaFiles({ ownerType: "spatial_entity", ownerId: entity.id }));
      void dispatch(fetchAllAudioGuides({ spatialEntityId: entity.id }));
      void dispatch(fetchAllVirtualTours({ spatialEntityId: entity.id }));
      void fetchSceneByEntity(entity.id)
        .then(() => setHasScene(true))
        .catch(() => setHasScene(false));
    }
  }, [entity, dispatch]);

  const handlePlayAudio = (guide: any) => {
    if (!guide?.media?.fileUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(resolveAssetUrl(guide.media.fileUrl));
      audioRef.current.onended = () => setPlayingAudioId(null);
    }

    if (playingAudioId === guide.id) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      audioRef.current.src = resolveAssetUrl(guide.media.fileUrl) || "";
      audioRef.current.play().catch(() => alert("Phát audio thất bại."));
      setPlayingAudioId(guide.id);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return <LoadingSpinner className="py-24" />;
  }

  if (!entity) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <MapPin size={48} className="mx-auto text-slate-300" />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy địa điểm</h2>
        <p className="text-slate-500">Địa điểm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <button
          onClick={() => navigate("/explore")}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs"
        >
          Quay lại Bản đồ
        </button>
      </div>
    );
  }

  const coverUrl = entity.coverMedia?.fileUrl
    ? resolveAssetUrl(entity.coverMedia.fileUrl)
    : entity.iconUrl
    ? resolveAssetUrl(entity.iconUrl)
    : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  const galleryImages = mediaFiles.filter((m) => m.mediaType === "image");

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Header Section */}
      <div className="relative h-96 bg-slate-900 overflow-hidden">
        <img
          src={coverUrl}
          alt={entity.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        
        {/* Navigation controls */}
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl font-bold text-xs border border-slate-700/50 backdrop-blur cursor-pointer shadow-lg transition-all"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>

        {/* Title details */}
        <div className="absolute bottom-12 left-6 right-6 md:left-12 text-white space-y-3 max-w-3xl">
          <span className="px-3 py-1 bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
            {entity.category?.name || "Điểm đến"}
          </span>
          <h1 className="text-3xl md:text-4xl font-black">{entity.name}</h1>
          <p className="text-slate-300 font-medium flex items-center gap-1.5 text-xs">
            <MapPin size={14} className="text-sky-400 shrink-0" />
            {entity.address || "Cần Thơ, Việt Nam"}
          </p>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details, Gallery, Audios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed introduction */}
          <Surface className="p-6 md:p-8 space-y-4 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={16} className="text-blue-500" />
              Giới thiệu địa điểm
            </h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-line">
              {entity.fullDescription || entity.shortDescription || "Không có nội dung mô tả chi tiết."}
            </p>
          </Surface>

          {/* Interactive Audio Guide player */}
          {audioGuides.length > 0 && (
            <Surface className="p-6 md:p-8 space-y-4 border border-slate-100 bg-gradient-to-br from-white to-purple-50/20">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <Volume2 size={16} className="text-purple-500" />
                Hướng dẫn thuyết minh tự động (Audio Guide)
              </h3>
              <div className="space-y-3">
                {audioGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex justify-between items-center p-3.5 bg-white border border-slate-150 rounded-xl hover:border-purple-200 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayAudio(guide)}
                        className={`p-2.5 rounded-full ${
                          playingAudioId === guide.id ? "bg-purple-600 text-white animate-pulse" : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        } transition-colors cursor-pointer shrink-0`}
                      >
                        {playingAudioId === guide.id ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{guide.title || "Thuyết minh chi tiết"}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{guide.description || "Tệp âm thanh thuyết minh thực địa."}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          )}

          {/* Image Gallery */}
          {galleryImages.length > 0 && (
            <Surface className="p-6 md:p-8 space-y-4 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                <ImageIcon size={16} className="text-emerald-500" />
                Thư viện hình ảnh
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square bg-slate-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity border border-slate-200"
                  >
                    <img
                      src={resolveAssetUrl(img.fileUrl)}
                      alt={img.altText || entity.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onClick={() => window.open(resolveAssetUrl(img.fileUrl), "_blank")}
                    />
                  </div>
                ))}
              </div>
            </Surface>
          )}
        </div>

        {/* Right Column: Experience VR 360 CTA & Location Widgets */}
        <div className="space-y-6">
          {/* Full VR 360 CTA Box */}
          {(tours.length > 0 || hasScene) && (
            <Surface className="p-6 bg-slate-900 border border-slate-800 text-white flex flex-col justify-between h-[300px]">
              <div className="space-y-3">
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded">
                  Không gian số
                </span>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <Video className="text-emerald-400" size={20} />
                  Tham quan ảo 360° VR
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Bước vào trải nghiệm không gian thực tế ảo 360 độ cực kỳ sinh động để tham quan mọi ngóc ngách của di tích/địa điểm ngay lập tức.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTourId(tours[0]?.id ?? null);
                  setViewerOpen(true);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video size={16} />
                Bắt đầu tham quan ảo
              </button>
            </Surface>
          )}

          {/* Contact and schedule info card */}
          <Surface className="p-6 space-y-4 border border-slate-100">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
              Thông tin liên hệ
            </h3>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              {entity.openingHours && (
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Giờ mở cửa</p>
                    <p className="text-slate-800 mt-0.5">{entity.openingHours}</p>
                  </div>
                </div>
              )}

              {entity.ticketPrice && (
                <div className="flex items-center gap-2.5">
                  <DollarSign size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Giá vé tham khảo</p>
                    <p className="text-slate-800 mt-0.5">{entity.ticketPrice}</p>
                  </div>
                </div>
              )}

              {entity.contactPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Điện thoại</p>
                    <a href={`tel:${entity.contactPhone}`} className="text-blue-600 hover:underline mt-0.5 block">
                      {entity.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {entity.contactEmail && (
                <div className="flex items-center gap-2.5">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Email</p>
                    <a href={`mailto:${entity.contactEmail}`} className="text-blue-600 hover:underline mt-0.5 block">
                      {entity.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {entity.websiteUrl && (
                <div className="flex items-center gap-2.5">
                  <Globe size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Website</p>
                    <a href={entity.websiteUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-0.5 block">
                      {entity.websiteUrl}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Surface>

          {/* GIS / Map Position Card */}
          <Surface className="p-6 space-y-4 border border-slate-100 text-xs font-semibold">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
              Vị trí bản đồ (GIS)
            </h3>
            <div className="space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Vĩ độ (Latitude)</span>
                <span className="font-bold text-slate-800">
                  {formatCoordinate(entity.latitude ?? entity.centerLatitude)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kinh độ (Longitude)</span>
                <span className="font-bold text-slate-800">
                  {formatCoordinate(entity.longitude ?? entity.centerLongitude)}
                </span>
              </div>
              {entity.elevation != null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Độ cao (Elevation)</span>
                  <span className="font-bold text-slate-800">{entity.elevation} m</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => navigate(`/explore?entityId=${entity.id}`)}
              className="w-full mt-2 py-2.5 border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={14} />
              Định vị trên Bản đồ lớn
            </button>
          </Surface>
        </div>
      </div>

      {/* Fullscreen Tour overlay modal */}
      {viewerOpen && (
        <VirtualTourViewer
          tourId={activeTourId}
          entityId={entity.id}
          onClose={() => {
            setViewerOpen(false);
            setActiveTourId(null);
          }}
        />
      )}
    </div>
  );
};
export default SpatialEntityDetailPage;
