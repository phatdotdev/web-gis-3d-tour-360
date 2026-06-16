import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllPanoramas,
  createPanorama,
  removePanorama,
  selectPanoramas,
} from "../../store/panoramasSlice";
import {
  fetchAllHotspots,
  createHotspot,
  removeHotspot,
  selectHotspots,
} from "../../store/hotspotsSlice";
import { uploadMediaFile } from "../../store/mediaFilesSlice";
import { Surface } from "../ui";
import { Box, Plus, Trash2, X, Image as ImageIcon, Video, Volume2, Info, Link2, Compass } from "lucide-react";
import { resolveAssetUrl } from "../../utils/httpClient";
import { fetchSceneByEntity } from "../../services/scenesService";
import type { SceneSummary } from "../../types/scene";

type VirtualTourEditorProps = {
  tourId: string;
  entityId: string;
};

// 3D Sphere Component to render the 360 image
const PanoramaSphere = ({ imageUrl, onClick }: { imageUrl: string; onClick: (event: any) => void }) => {
  const texture = new THREE.TextureLoader().load(imageUrl);
  return (
    <mesh onClick={onClick}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

// Hotspot inside the 3D scene
const HotspotMarker = ({
  hotspot,
  onRemove,
}: {
  hotspot: any;
  onRemove: (id: string) => void;
}) => {
  const yaw = Number(hotspot.yaw || 0);
  const pitch = Number(hotspot.pitch || 0);
  const radius = 80; // Distance from center

  const theta = (yaw * Math.PI) / 180;
  const phi = (pitch * Math.PI) / 180;

  const x = radius * Math.cos(phi) * Math.sin(theta);
  const y = radius * Math.sin(phi);
  const z = -radius * Math.cos(phi) * Math.cos(theta);

  const getIcon = () => {
    switch (hotspot.type) {
      case "navigation":
        return <Compass className="text-blue-500 animate-pulse" size={24} />;
      case "image":
        return <ImageIcon className="text-emerald-500" size={24} />;
      case "video":
        return <Video className="text-red-500" size={24} />;
      case "audio":
        return <Volume2 className="text-purple-500" size={24} />;
      case "info":
        return <Info className="text-yellow-500" size={24} />;
      case "model3d":
        return <Box className="text-cyan-500" size={24} />;
      default:
        return <Link2 className="text-slate-500" size={24} />;
    }
  };

  return (
    <Html position={[x, y, z]} center>
      <div className="group relative flex items-center justify-center p-2 bg-white/90 backdrop-blur rounded-full border border-slate-200/50 shadow-md cursor-pointer hover:scale-110 hover:bg-white transition-all duration-150">
        {getIcon()}
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
          {hotspot.title || "Hotspot"}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(hotspot.id);
            }}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            🗑️
          </button>
        </div>
      </div>
    </Html>
  );
};

export const VirtualTourEditor = ({ tourId, entityId }: VirtualTourEditorProps) => {
  const dispatch = useAppDispatch();
  
  const panoramas = useAppSelector(selectPanoramas);
  const hotspots = useAppSelector(selectHotspots);

  const [activePan, setActivePan] = useState<any>(null);
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ yaw: number; pitch: number } | null>(null);

  // Form states for hotspots
  const [hTitle, setHTitle] = useState("");
  const [hType, setHType] = useState("navigation");
  const [hTargetType, setHTargetType] = useState<"panorama" | "scene">("panorama");
  const [hTargetPanId, setHTargetPanId] = useState("");
  const [hTargetSceneId, setHTargetSceneId] = useState("");
  const [hDescription, setHDescription] = useState("");
  const [hExternalUrl, setHExternalUrl] = useState("");
  const [hMediaFile, setHMediaFile] = useState<File | null>(null);
  const [sceneTargets, setSceneTargets] = useState<SceneSummary[]>([]);

  useEffect(() => {
    dispatch(fetchAllPanoramas({ virtualTourId: tourId })).then((res: any) => {
      const pans = res.payload || [];
      if (pans.length > 0) {
        setActivePan(pans[0]);
      }
    });
  }, [dispatch, tourId]);

  useEffect(() => {
    void fetchSceneByEntity(entityId)
      .then((root) =>
        setSceneTargets([
          { id: root.id, name: root.name },
          ...(root.children ?? []),
        ]),
      )
      .catch(() => setSceneTargets([]));
  }, [entityId]);

  useEffect(() => {
    if (activePan) {
      dispatch(fetchAllHotspots({ panoramaId: activePan.id }));
    }
  }, [dispatch, activePan]);

  const handleAddPanorama = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Upload media file as panorama
      const media = await dispatch(
        uploadMediaFile({ file, params: { ownerType: "panorama", mediaType: "panorama" } })
      ).unwrap();

      // 2. Create Panorama record
      const newPan = await dispatch(
        createPanorama({
          virtualTourId: tourId,
          title: file.name.split(".")[0],
          panoramaImageId: media.id,
          displayOrder: panoramas.length,
        })
      ).unwrap();

      if (!activePan) {
        setActivePan(newPan);
      }
    } catch (err) {
      alert("Tải lên panorama thất bại.");
    }
  };

  const handleDeletePanorama = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa cảnh này?")) {
      try {
        await dispatch(removePanorama(id)).unwrap();
        if (activePan?.id === id) {
          setActivePan(panoramas.find((p) => p.id !== id) || null);
        }
      } catch (err) {
        alert("Xóa thất bại.");
      }
    }
  };

  // Click handler inside R3F sphere to get polar coordinates
  const handleSphereClick = (event: any) => {
    if (!isAddingHotspot) return;

    // Get click direction vector
    const point = event.point;
    const direction = point.clone().normalize();

    // Convert direction vector to spherical coordinates
    // yaw is rotation around Y-axis (XZ plane)
    // pitch is elevation from XZ plane
    const yaw = Math.atan2(direction.x, -direction.z) * (180 / Math.PI);
    const pitch = Math.asin(direction.y) * (180 / Math.PI);

    setTempCoords({ yaw, pitch });
    setIsAddingHotspot(false);
  };

  const handleCreateHotspot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempCoords || !activePan) return;

    try {
      let mediaId = null;
      if (hMediaFile) {
        const media = await dispatch(
          uploadMediaFile({
            file: hMediaFile,
            params: {
              ownerType: "hotspot",
              mediaType:
                hType === "audio"
                  ? "audio"
                  : hType === "video"
                    ? "video"
                    : hType === "model3d"
                      ? "model3d"
                      : "image",
            },
          })
        ).unwrap();
        mediaId = media.id;
      }

      await dispatch(
        createHotspot({
          panoramaId: activePan.id,
          type: hType,
          title: hTitle,
          description: hDescription,
          targetPanoramaId:
            hType === "navigation" && hTargetType === "panorama"
              ? hTargetPanId
              : null,
          targetSceneId:
            hType === "navigation" && hTargetType === "scene"
              ? hTargetSceneId
              : null,
          mediaId,
          externalUrl: hType === "external_link" ? hExternalUrl : null,
          yaw: tempCoords.yaw,
          pitch: tempCoords.pitch,
        })
      ).unwrap();

      // Reset
      setTempCoords(null);
      setHTitle("");
      setHType("navigation");
      setHTargetType("panorama");
      setHTargetPanId("");
      setHTargetSceneId("");
      setHDescription("");
      setHExternalUrl("");
      setHMediaFile(null);
    } catch (err) {
      alert("Tạo hotspot thất bại.");
    }
  };

  const handleDeleteHotspot = async (id: string) => {
    try {
      await dispatch(removeHotspot(id)).unwrap();
    } catch (err) {
      alert("Xóa hotspot thất bại.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
      {/* 360 Viewer Area */}
      <Surface className="lg:col-span-3 h-[500px] lg:h-[600px] overflow-hidden relative border border-slate-200">
        {activePan ? (
          <>
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
              <Suspense fallback={null}>
                <PanoramaSphere
                  imageUrl={resolveAssetUrl(activePan.panoramaImage?.fileUrl || "") || ""}
                  onClick={handleSphereClick}
                />
                {hotspots.map((hs) => (
                  <HotspotMarker key={hs.id} hotspot={hs} onRemove={handleDeleteHotspot} />
                ))}
              </Suspense>
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                rotateSpeed={-0.5} // Reversed rotation for correct natural feel
                minDistance={0.01}
                maxDistance={1}
              />
            </Canvas>

            {/* Viewer Controls Panel */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur text-white px-4 py-2.5 rounded-xl flex items-center gap-4 text-xs font-semibold">
              <span className="text-slate-400">Cảnh hiện tại:</span>
              <span className="font-bold">{activePan.name}</span>
              <button
                onClick={() => setIsAddingHotspot(true)}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                  isAddingHotspot
                    ? "bg-amber-600 border-amber-600 hover:bg-amber-700"
                    : "bg-blue-600 border-blue-600 hover:bg-blue-700"
                }`}
              >
                {isAddingHotspot ? "Click vào màn hình..." : "+ Thêm Hotspot"}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50">
            <ImageIcon size={48} className="text-slate-300 mb-3" />
            <p className="font-medium text-slate-700">Chưa có ảnh Panorama 360 nào</p>
            <p className="text-sm text-slate-400 mt-1">Hãy tải lên ảnh toàn cảnh 360 độ ở panel bên phải.</p>
          </div>
        )}
      </Surface>

      {/* Editor & Panoramas List Sidebar */}
      <div className="space-y-6">
        {/* Add / Select Panoramas */}
        <Surface className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Danh sách Panoramas</h3>
            <label className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
              <Plus size={14} />
              Tải ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleAddPanorama}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {panoramas.map((p) => (
              <div
                key={p.id}
                onClick={() => setActivePan(p)}
                className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                  activePan?.id === p.id
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                  {p.name}
                </span>
                <button
                  onClick={(e) => handleDeletePanorama(p.id, e)}
                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </Surface>

        {/* Hotspot configuration form */}
        {tempCoords && (
          <Surface className="p-4 space-y-4 border border-amber-200 bg-amber-50/30">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cấu hình Hotspot mới
              </h3>
              <button
                onClick={() => setTempCoords(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreateHotspot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Loại Hotspot</label>
                <select
                  value={hType}
                  onChange={(e) => setHType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="navigation">Chuyển cảnh (Navigation)</option>
                  <option value="image">Xem hình ảnh (Image)</option>
                  <option value="video">Xem video (Video)</option>
                  <option value="audio">Nghe thuyết minh (Audio)</option>
                  <option value="info">Thẻ thông tin (Info)</option>
                  <option value="model3d">Mô hình 3D (GLB/GLTF)</option>
                  <option value="external_link">Liên kết ngoài (Link)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Tiêu đề Hotspot</label>
                <input
                  type="text"
                  required
                  value={hTitle}
                  onChange={(e) => setHTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  placeholder="Ví dụ: Đi tới Sân trường"
                />
              </div>

              {hType === "navigation" && (
                <div className="space-y-2">
                  <label className="block text-slate-500 font-bold mb-1">
                    Loại cảnh đích
                  </label>
                  <select
                    value={hTargetType}
                    onChange={(e) =>
                      setHTargetType(e.target.value as "panorama" | "scene")
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="panorama">Panorama 360</option>
                    <option value="scene">Cảnh Three.js 3D</option>
                  </select>

                  {hTargetType === "panorama" ? (
                    <select
                      required
                      value={hTargetPanId}
                      onChange={(e) => setHTargetPanId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- Chọn panorama --</option>
                      {panoramas
                        .filter((p) => p.id !== activePan?.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <select
                      required
                      value={hTargetSceneId}
                      onChange={(e) => setHTargetSceneId(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">-- Chọn cảnh 3D --</option>
                      {sceneTargets.map((target) => (
                        <option key={target.id} value={target.id}>
                          {target.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {["image", "video", "audio", "model3d"].includes(hType) && (
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Tải lên tệp đa phương tiện</label>
                  <input
                    type="file"
                    required
                    accept={
                      hType === "audio"
                        ? "audio/*"
                        : hType === "video"
                          ? "video/*"
                          : hType === "model3d"
                            ? ".glb,.gltf"
                            : "image/*"
                    }
                    onChange={(e) => setHMediaFile(e.target.files?.[0] || null)}
                    className="w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}

              {hType === "external_link" && (
                <div>
                  <label className="block text-slate-500 font-bold mb-1">
                    Liên kết
                  </label>
                  <input
                    type="url"
                    required
                    value={hExternalUrl}
                    onChange={(event) => setHExternalUrl(event.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-500 font-bold mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={hDescription}
                  onChange={(e) => setHDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white resize-none"
                  placeholder="Mô tả khi di chuột vào điểm..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTempCoords(null)}
                  className="px-2.5 py-1.5 border border-slate-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold"
                >
                  Tạo điểm
                </button>
              </div>
            </form>
          </Surface>
        )}
      </div>
    </div>
  );
};
export default VirtualTourEditor;
