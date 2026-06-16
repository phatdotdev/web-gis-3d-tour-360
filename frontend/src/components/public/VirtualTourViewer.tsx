import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllPanoramas,
  fetchPanoramaById,
  selectPanoramas,
} from "../../store/panoramasSlice";
import { fetchAllHotspots, selectHotspots } from "../../store/hotspotsSlice";
import { fetchAllAudioGuides as fetchAudioGuides } from "../../store/audioGuidesSlice";
import {
  X,
  Compass,
  Image as ImageIcon,
  Video,
  Volume2,
  VolumeX,
  Info,
  Link2,
  Maximize2,
  Minimize2,
  Play,
  ChevronRight,
  Box,
} from "lucide-react";
import { resolveAssetUrl } from "../../utils/httpClient";
import { Surface } from "../ui";
import { SceneViewport } from "../three/SceneViewport";
import {
  fetchSceneByEntity,
  fetchSceneById,
} from "../../services/scenesService";
import type {
  SceneContentHotspot,
  SceneData,
  SceneModel,
  SceneTransitionPoint,
} from "../../types/scene";

type VirtualTourViewerProps = {
  tourId?: string | null;
  entityId?: string;
  onClose: () => void;
};

// 3D equirectangular panorama sphere
const PanoramaSphere = ({ imageUrl }: { imageUrl: string }) => {
  const texture = new THREE.TextureLoader().load(imageUrl);
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      {/* BackSide rendering makes sure we look at it from inside */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

const StandaloneModel = ({ modelUrl }: { modelUrl: string }) => {
  const gltf = useGLTF(modelUrl);
  return <primitive object={gltf.scene.clone(true)} />;
};

const ModelPreview = ({ modelUrl }: { modelUrl: string }) => (
  <div className="h-[52vh] min-h-80 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
    <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 8, 5]} intensity={2.2} />
      <Suspense fallback={<Html center>Đang tải mô hình...</Html>}>
        <Bounds fit clip margin={1.25}>
          <StandaloneModel modelUrl={modelUrl} />
        </Bounds>
      </Suspense>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  </div>
);

// Hotspot inside the 3D scene
const PublicHotspotMarker = ({
  hotspot,
  onTrigger,
}: {
  hotspot: any;
  onTrigger: (hs: any) => void;
}) => {
  const yaw = Number(hotspot.yaw || 0);
  const pitch = Number(hotspot.pitch || 0);
  const radius = 80;

  const theta = (yaw * Math.PI) / 180;
  const phi = (pitch * Math.PI) / 180;

  const x = radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.sin(phi);
  const z = -radius * Math.cos(phi) * Math.cos(theta);

  const getIcon = () => {
    switch (hotspot.type) {
      case "navigation":
        return <Compass className="text-sky-400 animate-pulse hover:scale-110 duration-200" size={26} />;
      case "image":
        return <ImageIcon className="text-emerald-400 hover:scale-110 duration-200" size={24} />;
      case "video":
        return <Video className="text-rose-400 hover:scale-110 duration-200" size={24} />;
      case "audio":
        return <Volume2 className="text-purple-400 hover:scale-110 duration-200" size={24} />;
      case "info":
        return <Info className="text-amber-400 hover:scale-110 duration-200" size={24} />;
      case "model3d":
        return <Box className="text-cyan-400 hover:scale-110 duration-200" size={24} />;
      default:
        return <Link2 className="text-slate-400 hover:scale-110 duration-200" size={24} />;
    }
  };

  return (
    <Html position={[x, y, z]} center>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onTrigger(hotspot);
        }}
        className="group relative flex items-center justify-center p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-white/20 backdrop-blur rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:border-white/40 transition-all duration-150"
      >
        {getIcon()}
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700">
          {hotspot.title || "Tương tác"}
        </div>
      </button>
    </Html>
  );
};

export const VirtualTourViewer = ({
  tourId,
  entityId,
  onClose,
}: VirtualTourViewerProps) => {
  const dispatch = useAppDispatch();
  const panoramas = useAppSelector(selectPanoramas);
  const hotspots = useAppSelector(selectHotspots);

  const [activePan, setActivePan] = useState<any>(null);
  const [activeScene, setActiveScene] = useState<SceneData | null>(null);
  const [experienceMode, setExperienceMode] = useState<"panorama" | "scene">(
    "panorama",
  );
  const [fullscreen, setFullscreen] = useState(false);

  // Hotspot interaction states
  const [lightboxHs, setLightboxHs] = useState<any>(null);

  // Audio Guide states
  const [audioGuide, setAudioGuide] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!tourId) {
      setActivePan(null);
      return;
    }

    dispatch(fetchAllPanoramas({ virtualTourId: tourId })).then((res: any) => {
      const pans = res.payload || [];
      if (pans.length > 0) {
        setActivePan(pans[0]);
      }
    });
  }, [dispatch, tourId]);

  useEffect(() => {
    if (!entityId) return;
    void fetchSceneByEntity(entityId)
      .then((scene) => {
        setActiveScene(scene);
        if (!tourId) setExperienceMode("scene");
      })
      .catch(() => setActiveScene(null));
  }, [entityId, tourId]);

  useEffect(() => {
    if (activePan) {
      dispatch(fetchAllHotspots({ panoramaId: activePan.id }));
      // Fetch audio guides for this panorama
      dispatch(fetchAudioGuides({ targetType: "panorama", targetId: activePan.id })).then((res: any) => {
        const guides = res.payload || [];
        if (guides.length > 0) {
          setAudioGuide(guides[0]);
        } else {
          setAudioGuide(null);
        }
      });
    }
    // Stop audio when changing scene
    setIsPlayingAudio(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [dispatch, activePan]);

  const openPanorama = async (panoramaId?: string | null) => {
    if (!panoramaId) return;
    const loaded = panoramas.find((panorama) => panorama.id === panoramaId);
    if (loaded) {
      setActivePan(loaded);
      setExperienceMode("panorama");
      return;
    }

    try {
      const panorama = await dispatch(fetchPanoramaById(panoramaId)).unwrap();
      setActivePan(panorama);
      setExperienceMode("panorama");
    } catch {
      alert("Không thể tải cảnh panorama đích.");
    }
  };

  const handleHotspotTrigger = (hs: any) => {
    if (hs.type === "navigation") {
      if (hs.targetSceneId) {
        void fetchSceneById(hs.targetSceneId).then((scene) => {
          setActiveScene(scene);
          setExperienceMode("scene");
        });
        return;
      }
      void openPanorama(hs.targetPanoramaId ?? hs.targetPanorama?.id);
    } else {
      setLightboxHs(hs);
      if (hs.type === "audio" && hs.media?.fileUrl) {
        // Play hotspot audio inside lightbox
      }
    }
  };

  const handleSceneTransition = (point: SceneTransitionPoint) => {
    if (!point.targetId) return;

    if (point.targetType === "scene") {
      void fetchSceneById(point.targetId).then((scene) => {
        setActiveScene(scene);
        setExperienceMode("scene");
      });
      return;
    }

    void openPanorama(point.targetId);
  };

  const handleModelTrigger = (model: SceneModel) => {
    const clickContent = model.settings?.clickContent;
    const firstHotspot = model.settings?.hotspots?.[0];
    setLightboxHs(
      clickContent?.title ||
      clickContent?.description ||
      clickContent?.imageUrl ||
      clickContent?.videoUrl
        ? {
            id: model.id ?? model.modelUrl,
            type: "model_details",
            title: clickContent.title || model.name,
            description: clickContent.description,
            imageUrl: clickContent.imageUrl,
            videoUrl: clickContent.videoUrl,
          }
        : firstHotspot ?? {
        id: model.id ?? model.modelUrl,
        type: "info",
        title: model.name,
        description:
          typeof model.settings?.description === "string"
            ? model.settings.description
            : "Kéo để xoay góc nhìn, cuộn để phóng to hoặc thu nhỏ mô hình.",
          },
    );
  };

  const handleContentHotspotTrigger = (hotspot: SceneContentHotspot) => {
    setLightboxHs(hotspot);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  };

  const handleToggleAudioGuide = () => {
    if (!audioGuide?.media?.fileUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(resolveAssetUrl(audioGuide.media.fileUrl));
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.src = resolveAssetUrl(audioGuide.media.fileUrl) || "";
      audioRef.current.play().catch(() => alert("Phát audio thất bại."));
      setIsPlayingAudio(true);
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

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Top bar overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur cursor-pointer"
            title="Đóng tham quan"
          >
            <X size={18} />
          </button>
          <div>
            <h2 className="text-sm font-black">
              {experienceMode === "scene"
                ? activeScene?.name
                : activePan?.name || "Đang tham quan..."}
            </h2>
            <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
              {experienceMode === "scene"
                ? "Không gian Three.js 3D"
                : "Tham quan ảo 360°"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur cursor-pointer"
            title={fullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Primary 3D equirectangular Canvas */}
      <div className="w-full h-full">
        {experienceMode === "scene" && activeScene ? (
          <SceneViewport
            scene={activeScene}
            onTransitionTrigger={handleSceneTransition}
            onModelTrigger={handleModelTrigger}
            onContentHotspotTrigger={handleContentHotspotTrigger}
          />
        ) : activePan ? (
          <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} className="w-full h-full">
            <Suspense fallback={null}>
              <PanoramaSphere imageUrl={resolveAssetUrl(activePan.panoramaImage?.fileUrl) || ""} />
              {hotspots.map((hs) => (
                <PublicHotspotMarker key={hs.id} hotspot={hs} onTrigger={handleHotspotTrigger} />
              ))}
            </Suspense>
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              rotateSpeed={-0.55} // Negative rotation for natural feeling drag
              minDistance={0.01}
              maxDistance={1}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImageIcon size={48} className="animate-pulse mb-3" />
            <p className="font-semibold text-sm">Đang kết nối không gian ảo...</p>
          </div>
        )}
      </div>

      {/* Floating Audio Guide and Bottom Panorama Selection Strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-3">
        {/* Audio guide controls */}
        {audioGuide && (
          <div className="self-start">
            <button
              onClick={handleToggleAudioGuide}
              className={`flex items-center gap-2 px-3 py-2 ${
                isPlayingAudio ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700"
              } text-white font-bold rounded-xl shadow-lg transition-colors text-xs backdrop-blur-sm cursor-pointer`}
            >
              {isPlayingAudio ? <VolumeX size={14} /> : <Play size={14} />}
              {isPlayingAudio ? "Tạm dừng thuyết minh" : "Nghe thuyết minh (Audio Guide)"}
            </button>
          </div>
        )}

        {/* Thumbnail Carousel strip */}
        {(panoramas.length > 0 || activeScene) && (
          <div className="flex items-center gap-2">
            <div className="flex gap-2.5 overflow-x-auto py-1.5 scrollbar-thin scrollbar-thumb-white/20 select-none w-full">
              {activeScene && (
                <button
                  type="button"
                  onClick={() => setExperienceMode("scene")}
                  className={`relative flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border-2 bg-slate-800 text-white cursor-pointer ${
                    experienceMode === "scene"
                      ? "border-cyan-400"
                      : "border-transparent opacity-70"
                  }`}
                >
                  <span className="px-2 text-center text-[10px] font-bold">
                    {activeScene.name}
                  </span>
                </button>
              )}
              {panoramas.map((p) => {
                const isSelected =
                  experienceMode === "panorama" && activePan?.id === p.id;
                const thumbUrl = p.panoramaImage?.fileUrl
                  ? resolveAssetUrl(p.panoramaImage.fileUrl)
                  : "";

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActivePan(p);
                      setExperienceMode("panorama");
                    }}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shrink-0 border-2 ${
                      isSelected ? "border-sky-400 scale-[1.03]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-bold text-white truncate text-center">
                      {p.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Popup Media Modal */}
      {lightboxHs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <Surface className="w-full max-w-2xl border border-slate-700 bg-slate-900/90 text-white relative p-6 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setLightboxHs(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-4 text-xs font-semibold">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-1">
                  Nội dung tương tác
                </span>
                <h3 className="text-base font-black">{lightboxHs.title}</h3>
              </div>

              {/* Render media content based on hotspot type */}
              {lightboxHs.type === "image" && lightboxHs.media?.fileUrl && (
                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex justify-center max-h-[50vh]">
                  <img
                    src={resolveAssetUrl(lightboxHs.media.fileUrl)}
                    alt={lightboxHs.title}
                    className="object-contain max-h-[50vh] w-full"
                  />
                </div>
              )}

              {lightboxHs.type === "video" && lightboxHs.media?.fileUrl && (
                <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    src={resolveAssetUrl(lightboxHs.media.fileUrl)}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {lightboxHs.type === "video" &&
                !lightboxHs.media?.fileUrl &&
                lightboxHs.mediaUrl && (
                  <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
                    <video
                      src={resolveAssetUrl(lightboxHs.mediaUrl)}
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}

              {lightboxHs.type === "audio" && lightboxHs.media?.fileUrl && (
                <div className="bg-slate-950/50 p-6 rounded-xl border border-slate-800 flex flex-col items-center gap-4">
                  <Volume2 size={36} className="text-purple-400 animate-pulse" />
                  <p className="text-xs text-slate-400">Đang phát tệp âm thanh đính kèm</p>
                  <audio
                    src={resolveAssetUrl(lightboxHs.media.fileUrl)}
                    controls
                    autoPlay
                    className="w-full max-w-sm"
                  />
                </div>
              )}

              {lightboxHs.type === "info" && (
                <p className="text-slate-300 font-medium leading-relaxed text-sm">
                  {lightboxHs.description || "Không có thông tin mô tả chi tiết."}
                </p>
              )}

              {lightboxHs.type === "external_link" && (
                <div className="text-center py-6 space-y-4">
                  <Link2 size={32} className="mx-auto text-sky-400" />
                  <p className="text-slate-300 font-medium">Bấm vào nút dưới đây để chuyển hướng tới trang liên kết:</p>
                  <a
                    href={lightboxHs.externalUrl || lightboxHs.description}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors text-xs"
                  >
                    Mở liên kết ngoài <ChevronRight size={14} />
                  </a>
                </div>
              )}

              {lightboxHs.type === "model3d" &&
                (lightboxHs.media?.fileUrl || lightboxHs.mediaUrl) && (
                  <ModelPreview
                    modelUrl={
                      resolveAssetUrl(
                        lightboxHs.media?.fileUrl || lightboxHs.mediaUrl,
                      ) || ""
                    }
                  />
                )}

              {lightboxHs.type === "image" &&
                !lightboxHs.media?.fileUrl &&
                lightboxHs.mediaUrl && (
                  <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex justify-center max-h-[50vh]">
                    <img
                      src={resolveAssetUrl(lightboxHs.mediaUrl)}
                      alt={lightboxHs.title}
                      className="object-contain max-h-[50vh] w-full"
                    />
                  </div>
                )}

              {lightboxHs.type === "model_details" && (
                <div className="space-y-4">
                  {lightboxHs.imageUrl && (
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                      <img
                        src={resolveAssetUrl(lightboxHs.imageUrl)}
                        alt={lightboxHs.title}
                        className="max-h-[42vh] w-full object-contain"
                      />
                    </div>
                  )}
                  {lightboxHs.videoUrl && (
                    <div className="aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                      <video
                        src={resolveAssetUrl(lightboxHs.videoUrl)}
                        controls
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-slate-300">
                    {lightboxHs.description ||
                      "Chưa có nội dung mô tả cho mô hình này."}
                  </p>
                </div>
              )}

              {lightboxHs.description &&
                lightboxHs.type !== "info" &&
                lightboxHs.type !== "external_link" &&
                lightboxHs.type !== "model_details" && (
                <p className="text-slate-400 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-800">
                  {lightboxHs.description}
                </p>
              )}
            </div>
          </Surface>
        </div>
      )}
    </div>
  );
};
export default VirtualTourViewer;
