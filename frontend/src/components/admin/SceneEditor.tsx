import { useEffect, useState } from "react";
import {
  Box,
  Cuboid,
  MapPinPlus,
  Plus,
  Rotate3D,
  Save,
  Scaling,
  Trash2,
  Upload,
} from "lucide-react";

import {
  createChildScene,
  createSceneForEntity,
  fetchSceneByEntity,
  fetchSceneById,
  removeScene,
  updateScene,
  uploadSceneModel,
} from "../../services/scenesService";
import { upload as uploadMedia } from "../../services/mediaFilesService";
import { fetchAll as fetchPanoramas } from "../../services/panoramasService";
import type {
  SceneContentHotspot,
  SceneData,
  SceneModel,
  SceneTransitionPoint,
  Vector3Value,
} from "../../types/scene";
import { SceneViewport } from "../three/SceneViewport";
import { Surface } from "../ui";

type TransformMode = "translate" | "rotate" | "scale";

const zeroVector = (): Vector3Value => ({ x: 0, y: 0, z: 0 });
const oneVector = (): Vector3Value => ({ x: 1, y: 1, z: 1 });

const normalizeScene = (scene: SceneData): SceneData => ({
  ...scene,
  models: scene.models ?? [],
  children: scene.children ?? [],
  transitionPoints: scene.transitionPoints ?? [],
});

export const SceneEditor = ({
  entityId,
  tourId,
  initialModelUrl,
}: {
  entityId: string;
  tourId?: string | null;
  initialModelUrl?: string | null;
}) => {
  const [rootScene, setRootScene] = useState<SceneData | null>(null);
  const [scene, setScene] = useState<SceneData | null>(null);
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingHotspotId, setUploadingHotspotId] = useState<string | null>(
    null,
  );
  const [uploadingClickMedia, setUploadingClickMedia] = useState<
    "image" | "video" | null
  >(null);
  const [transformMode, setTransformMode] =
    useState<TransformMode>("translate");
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(
    null,
  );
  const [selectedTransitionIndex, setSelectedTransitionIndex] = useState<
    number | null
  >(null);

  const loadRoot = async () => {
    setLoading(true);
    try {
      const nextRoot = normalizeScene(await fetchSceneByEntity(entityId));
      setRootScene(nextRoot);
      setScene(nextRoot);
    } catch {
      setRootScene(null);
      setScene(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRoot();
  }, [entityId]);

  useEffect(() => {
    if (!tourId) {
      setPanoramas([]);
      return;
    }
    void fetchPanoramas({ virtualTourId: tourId })
      .then(setPanoramas)
      .catch(() => setPanoramas([]));
  }, [tourId]);

  const selectScene = async (id: string) => {
    const nextScene = normalizeScene(await fetchSceneById(id));
    setScene(nextScene);
    setSelectedModelIndex(null);
    setSelectedTransitionIndex(null);
  };

  const updateModel = (
    index: number,
    patch: Partial<SceneModel>,
  ) => {
    setScene((current) => {
      if (!current) return current;
      return {
        ...current,
        models: current.models.map((model, modelIndex) =>
          modelIndex === index ? { ...model, ...patch } : model,
        ),
      };
    });
  };

  const updateModelHotspots = (
    modelIndex: number,
    updater: (hotspots: SceneContentHotspot[]) => SceneContentHotspot[],
  ) => {
    setScene((current) => {
      if (!current) return current;
      return {
        ...current,
        models: current.models.map((model, index) => {
          if (index !== modelIndex) return model;
          const settings = model.settings ?? {};
          return {
            ...model,
            settings: {
              ...settings,
              hotspots: updater(settings.hotspots ?? []),
            },
          };
        }),
      };
    });
  };

  const updateModelSettings = (
    modelIndex: number,
    patch: Partial<NonNullable<SceneModel["settings"]>>,
  ) => {
    setScene((current) => {
      if (!current) return current;
      return {
        ...current,
        models: current.models.map((model, index) =>
          index === modelIndex
            ? {
                ...model,
                settings: {
                  ...(model.settings ?? {}),
                  ...patch,
                },
              }
            : model,
        ),
      };
    });
  };

  const uploadClickMedia = async (
    modelIndex: number,
    mediaType: "image" | "video",
    file: File,
  ) => {
    setUploadingClickMedia(mediaType);
    try {
      const media = await uploadMedia(file, {
        ownerType: "scene",
        ownerId: scene?.id,
        mediaType,
      });
      const model = scene?.models[modelIndex];
      updateModelSettings(modelIndex, {
        clickContent: {
          ...(model?.settings?.clickContent ?? {}),
          [mediaType === "image" ? "imageUrl" : "videoUrl"]: media.fileUrl,
        },
      });
    } finally {
      setUploadingClickMedia(null);
    }
  };

  const updateModelHotspot = (
    modelIndex: number,
    hotspotId: string,
    patch: Partial<SceneContentHotspot>,
  ) => {
    updateModelHotspots(modelIndex, (hotspots) =>
      hotspots.map((hotspot) =>
        hotspot.id === hotspotId ? { ...hotspot, ...patch } : hotspot,
      ),
    );
  };

  const addModelHotspot = (modelIndex: number) => {
    updateModelHotspots(modelIndex, (hotspots) => [
      ...hotspots,
      {
        id: crypto.randomUUID(),
        title: "Điểm thông tin",
        type: "info",
        description: "",
        position: { x: 0, y: 1.5, z: 0 },
      },
    ]);
  };

  const uploadModelHotspotMedia = async (
    modelIndex: number,
    hotspot: SceneContentHotspot,
    file: File,
  ) => {
    setUploadingHotspotId(hotspot.id);
    try {
      const media = await uploadMedia(file, {
        ownerType: "scene",
        ownerId: scene?.id,
        mediaType:
          hotspot.type === "model3d"
            ? "model3d"
            : hotspot.type === "video"
              ? "video"
              : "image",
      });
      updateModelHotspot(modelIndex, hotspot.id, { mediaUrl: media.fileUrl });
    } finally {
      setUploadingHotspotId(null);
    }
  };

  const updateTransition = (
    index: number,
    patch: Partial<SceneTransitionPoint>,
  ) => {
    setScene((current) => {
      if (!current) return current;
      return {
        ...current,
        transitionPoints: current.transitionPoints.map((point, pointIndex) =>
          pointIndex === index ? { ...point, ...patch } : point,
        ),
      };
    });
  };

  const createRoot = async () => {
    let created = normalizeScene(
      await createSceneForEntity(entityId, {
        name: "Cảnh 3D chính",
        description: "Không gian tham quan 3D",
        transitionPoints: [],
      }),
    );
    if (initialModelUrl) {
      created = normalizeScene(
        await updateScene(created.id, {
          name: created.name,
          models: [
            {
              name: initialModelUrl.split("/").pop() || "Mô hình 3D",
              modelUrl: initialModelUrl,
              position: zeroVector(),
              rotation: zeroVector(),
              scale: oneVector(),
              settings: {
                interaction: {
                  hoverEffect: "scale",
                  hoverScale: 1.08,
                  clickEnabled: true,
                  draggable: false,
                  dragReturn: true,
                },
              },
            },
          ],
        }),
      );
    }
    setRootScene(created);
    setScene(created);
  };

  const addInitialModel = () => {
    if (!scene || !initialModelUrl) return;
    if (scene.models.some((model) => model.modelUrl === initialModelUrl)) return;
    setScene({
      ...scene,
      models: [
        ...scene.models,
        {
          name: initialModelUrl.split("/").pop() || "Mô hình 3D",
          modelUrl: initialModelUrl,
          position: zeroVector(),
          rotation: zeroVector(),
          scale: oneVector(),
          settings: {
            interaction: {
              hoverEffect: "scale",
              hoverScale: 1.08,
              clickEnabled: true,
              draggable: false,
              dragReturn: true,
            },
          },
        },
      ],
    });
    setSelectedModelIndex(scene.models.length);
  };

  const createChild = async () => {
    if (!rootScene) return;
    const created = normalizeScene(
      await createChildScene(rootScene.id, {
        name: `Cảnh ${rootScene.children.length + 2}`,
        description: "",
        models: [],
        transitionPoints: [],
      }),
    );
    const refreshedRoot = normalizeScene(await fetchSceneByEntity(entityId));
    setRootScene(refreshedRoot);
    setScene(created);
  };

  const deleteCurrentScene = async () => {
    if (!scene || !scene.parent) return;
    if (!window.confirm(`Xóa cảnh "${scene.name}"?`)) return;
    await removeScene(scene.id);
    await loadRoot();
  };

  const handleUploadModel = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !scene) return;

    setUploading(true);
    try {
      const uploaded = await uploadSceneModel(file);
      const model: SceneModel = {
        name: file.name.replace(/\.(glb|gltf)$/i, ""),
        modelUrl: uploaded.url,
        position: zeroVector(),
        rotation: zeroVector(),
        scale: oneVector(),
        settings: {
          interaction: {
            hoverEffect: "scale",
            hoverScale: 1.08,
            clickEnabled: true,
            draggable: false,
            dragReturn: true,
          },
        },
      };
      setScene({
        ...scene,
        models: [...scene.models, model],
      });
      setSelectedModelIndex(scene.models.length);
      setSelectedTransitionIndex(null);
    } finally {
      setUploading(false);
    }
  };

  const addTransition = () => {
    if (!scene) return;
    const targetScene = [
      rootScene,
      ...(rootScene?.children ?? []),
    ].find((item) => item && item.id !== scene.id);
    const point: SceneTransitionPoint = {
      id: crypto.randomUUID(),
      title: "Chuyển cảnh",
      position: { x: 0, y: 1.5, z: 0 },
      targetType: targetScene ? "scene" : "panorama",
      targetId: targetScene?.id ?? panoramas[0]?.id ?? "",
    };
    setScene({
      ...scene,
      transitionPoints: [...scene.transitionPoints, point],
    });
    setSelectedTransitionIndex(scene.transitionPoints.length);
    setSelectedModelIndex(null);
  };

  const saveScene = async () => {
    if (!scene) return;
    setSaving(true);
    try {
      const saved = normalizeScene(
        await updateScene(scene.id, {
          name: scene.name,
          description: scene.description,
          cameraView: scene.cameraView,
          environment: scene.environment,
          models: scene.models,
          transitionPoints: scene.transitionPoints,
        }),
      );
      setScene(saved);
      const refreshedRoot = normalizeScene(await fetchSceneByEntity(entityId));
      setRootScene(refreshedRoot);
      alert("Đã lưu cảnh 3D.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[620px] grid place-items-center text-sm text-slate-500">
        Đang tải trình chỉnh sửa 3D...
      </div>
    );
  }

  if (!rootScene || !scene) {
    return (
      <Surface className="py-20 text-center">
        <Cuboid size={52} className="mx-auto mb-4 text-slate-300" />
        <h3 className="font-bold text-slate-800">Chưa có cảnh 3D</h3>
        <p className="mt-2 text-sm text-slate-500">
          Tạo cảnh chính để tải GLB/GLTF và bố trí mô hình.
        </p>
        <button
          type="button"
          onClick={() => void createRoot()}
          className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white cursor-pointer"
        >
          Tạo cảnh 3D chính
        </button>
      </Surface>
    );
  }

  const selectedModel =
    selectedModelIndex != null && selectedModelIndex >= 0
      ? scene.models[selectedModelIndex]
      : null;
  const selectedTransition =
    selectedTransitionIndex != null && selectedTransitionIndex >= 0
      ? scene.transitionPoints[selectedTransitionIndex]
      : null;
  const sceneTargets = [rootScene, ...rootScene.children].filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  return (
    <div className="grid min-h-[680px] grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
      <Surface className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
            Danh sách cảnh
          </h3>
          <button
            type="button"
            onClick={() => void createChild()}
            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 cursor-pointer"
            title="Thêm cảnh"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {sceneTargets.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void selectScene(item.id)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-bold cursor-pointer ${
                scene.id === item.id
                  ? "border-blue-400 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        {scene.parent && (
          <button
            type="button"
            onClick={() => void deleteCurrentScene()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 cursor-pointer"
          >
            <Trash2 size={14} /> Xóa cảnh
          </button>
        )}
      </Surface>

      <Surface className="relative min-h-[620px] overflow-hidden border border-slate-200">
        <div className="absolute left-4 top-4 z-10 flex gap-2 rounded-xl bg-white/90 p-2 shadow-lg backdrop-blur">
          {[
            { value: "translate", label: "Di chuyển", icon: MapPinPlus },
            { value: "rotate", label: "Xoay", icon: Rotate3D },
            { value: "scale", label: "Tỉ lệ", icon: Scaling },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTransformMode(value as TransformMode)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold cursor-pointer ${
                transformMode === value
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <SceneViewport
          scene={scene}
          editable
          transformMode={transformMode}
          selectedModelIndex={selectedModelIndex}
          selectedTransitionIndex={selectedTransitionIndex}
          onSelectModel={(index) => {
            setSelectedModelIndex(index >= 0 ? index : null);
            setSelectedTransitionIndex(null);
          }}
          onSelectTransition={(index) => {
            setSelectedTransitionIndex(index >= 0 ? index : null);
            setSelectedModelIndex(null);
          }}
          onModelTransform={(index, position, rotation, scale) =>
            updateModel(index, { position, rotation, scale })
          }
          onTransitionTransform={(index, position) =>
            updateTransition(index, { position })
          }
        />
      </Surface>

      <div className="space-y-4">
        <Surface className="p-4">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-600">
              Tên cảnh
              <input
                value={scene.name}
                onChange={(event) =>
                  setScene({ ...scene, name: event.target.value })
                }
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
            <label className="block text-xs font-bold text-slate-600">
              Mô tả
              <textarea
                value={scene.description ?? ""}
                onChange={(event) =>
                  setScene({ ...scene, description: event.target.value })
                }
                className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2"
                rows={2}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                <Upload size={14} />
                {uploading ? "Đang tải..." : "Thêm GLB/GLTF"}
                <input
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => void handleUploadModel(event)}
                />
              </label>
              <button
                type="button"
                onClick={addTransition}
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-xs font-bold text-cyan-700 cursor-pointer"
              >
                <MapPinPlus size={14} /> Thêm điểm
              </button>
            </div>
            {initialModelUrl &&
              !scene.models.some((model) => model.modelUrl === initialModelUrl) && (
                <button
                  type="button"
                  onClick={addInitialModel}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 cursor-pointer"
                >
                  <Box size={14} /> Thêm mô hình đã tải của địa điểm
                </button>
              )}
            <button
              type="button"
              onClick={() => void saveScene()}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} /> {saving ? "Đang lưu..." : "Lưu cảnh 3D"}
            </button>
          </div>
        </Surface>

        <Surface className="p-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
            Mô hình ({scene.models.length})
          </h3>
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto">
            {scene.models.map((model, index) => (
              <button
                key={model.id ?? `${model.modelUrl}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedModelIndex(index);
                  setSelectedTransitionIndex(null);
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-xs cursor-pointer ${
                  selectedModelIndex === index
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Box size={14} />
                  <span className="truncate">{model.name}</span>
                </span>
                <Trash2
                  size={13}
                  className="shrink-0 text-red-500"
                  onClick={(event) => {
                    event.stopPropagation();
                    setScene({
                      ...scene,
                      models: scene.models.filter((_, itemIndex) => itemIndex !== index),
                    });
                    setSelectedModelIndex(null);
                  }}
                />
              </button>
            ))}
          </div>
          {selectedModel && selectedModelIndex != null && (
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
              <input
                value={selectedModel.name}
                onChange={(event) =>
                  updateModel(selectedModelIndex, { name: event.target.value })
                }
                className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
              />
              {(["position", "rotation", "scale"] as const).map((field) => (
                <div key={field}>
                  <div className="mb-1 text-[10px] font-black uppercase text-slate-400">
                    {field}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(["x", "y", "z"] as const).map((axis) => (
                      <input
                        key={axis}
                        type="number"
                        step="0.1"
                        value={selectedModel[field][axis]}
                        onChange={(event) =>
                          updateModel(selectedModelIndex, {
                            [field]: {
                              ...selectedModel[field],
                              [axis]: Number(event.target.value),
                            },
                          })
                        }
                        className="min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                        title={`${field}.${axis}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="text-[10px] font-black uppercase text-slate-500">
                  Hiệu ứng tương tác
                </div>
                <label className="block text-[11px] font-bold text-slate-600">
                  Hiệu ứng khi rê chuột
                  <select
                    value={
                      selectedModel.settings?.interaction?.hoverEffect ??
                      "scale"
                    }
                    onChange={(event) =>
                      updateModelSettings(selectedModelIndex, {
                        interaction: {
                          ...(selectedModel.settings?.interaction ?? {}),
                          hoverEffect: event.target.value as
                            | "none"
                            | "scale"
                            | "float",
                        },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
                  >
                    <option value="none">Không dùng hiệu ứng</option>
                    <option value="scale">Phóng to nhẹ</option>
                    <option value="float">Nổi lên nhẹ</option>
                  </select>
                </label>
                {(selectedModel.settings?.interaction?.hoverEffect ??
                  "scale") === "scale" && (
                  <label className="block text-[11px] font-bold text-slate-600">
                    Mức phóng to
                    <input
                      type="number"
                      min="1"
                      max="2"
                      step="0.01"
                      value={
                        selectedModel.settings?.interaction?.hoverScale ?? 1.08
                      }
                      onChange={(event) =>
                        updateModelSettings(selectedModelIndex, {
                          interaction: {
                            ...(selectedModel.settings?.interaction ?? {}),
                            hoverScale: Number(event.target.value),
                          },
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
                    />
                  </label>
                )}
                {[
                  {
                    key: "clickEnabled" as const,
                    label: "Cho phép click để xem thông tin",
                    fallback: true,
                  },
                  {
                    key: "draggable" as const,
                    label: "Cho phép kéo mô hình",
                    fallback: false,
                  },
                  {
                    key: "dragReturn" as const,
                    label: "Tự quay về vị trí sau khi kéo",
                    fallback: true,
                  },
                ].map(({ key, label, fallback }) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-[11px] font-bold text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedModel.settings?.interaction?.[key] ?? fallback
                      }
                      disabled={
                        key === "dragReturn" &&
                        !selectedModel.settings?.interaction?.draggable
                      }
                      onChange={(event) =>
                        updateModelSettings(selectedModelIndex, {
                          interaction: {
                            ...(selectedModel.settings?.interaction ?? {}),
                            [key]: event.target.checked,
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="text-[10px] font-black uppercase text-slate-500">
                  Nội dung khi click model
                </div>
                <input
                  value={
                    selectedModel.settings?.clickContent?.title ??
                    selectedModel.name
                  }
                  onChange={(event) =>
                    updateModelSettings(selectedModelIndex, {
                      clickContent: {
                        ...(selectedModel.settings?.clickContent ?? {}),
                        title: event.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
                  placeholder="Tiêu đề"
                />
                <textarea
                  rows={3}
                  value={
                    selectedModel.settings?.clickContent?.description ?? ""
                  }
                  onChange={(event) =>
                    updateModelSettings(selectedModelIndex, {
                      clickContent: {
                        ...(selectedModel.settings?.clickContent ?? {}),
                        description: event.target.value,
                      },
                    })
                  }
                  className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
                  placeholder="Nội dung văn bản"
                />
                <div className="grid grid-cols-2 gap-2">
                  {(["image", "video"] as const).map((mediaType) => {
                    const currentUrl =
                      mediaType === "image"
                        ? selectedModel.settings?.clickContent?.imageUrl
                        : selectedModel.settings?.clickContent?.videoUrl;
                    return (
                      <label
                        key={mediaType}
                        className="cursor-pointer rounded-lg border border-dashed border-blue-200 bg-blue-50 px-2 py-2 text-center text-[10px] font-bold text-blue-700"
                      >
                        {uploadingClickMedia === mediaType
                          ? "Đang tải..."
                          : currentUrl
                            ? mediaType === "image"
                              ? "Đổi ảnh"
                              : "Đổi video"
                            : mediaType === "image"
                              ? "Tải ảnh"
                              : "Tải video"}
                        <input
                          type="file"
                          className="hidden"
                          accept={mediaType === "image" ? "image/*" : "video/*"}
                          disabled={uploadingClickMedia != null}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (file) {
                              void uploadClickMedia(
                                selectedModelIndex,
                                mediaType,
                                file,
                              );
                            }
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase text-slate-500">
                    Điểm nội dung trên model
                  </div>
                  <button
                    type="button"
                    onClick={() => addModelHotspot(selectedModelIndex)}
                    className="rounded-lg bg-cyan-50 px-2 py-1 text-[10px] font-bold text-cyan-700 cursor-pointer"
                  >
                    + Thêm điểm
                  </button>
                </div>
                <div className="mt-2 max-h-80 space-y-3 overflow-y-auto pr-1">
                  {(selectedModel.settings?.hotspots ?? []).map((hotspot) => (
                    <div
                      key={hotspot.id}
                      className="space-y-2 rounded-xl border border-slate-200 p-2.5"
                    >
                      <div className="flex gap-2">
                        <input
                          value={hotspot.title}
                          onChange={(event) =>
                            updateModelHotspot(
                              selectedModelIndex,
                              hotspot.id,
                              { title: event.target.value },
                            )
                          }
                          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                          placeholder="Tiêu đề"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateModelHotspots(
                              selectedModelIndex,
                              (hotspots) =>
                                hotspots.filter(
                                  (item) => item.id !== hotspot.id,
                                ),
                            )
                          }
                          className="rounded-lg px-2 text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Xóa điểm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <select
                        value={hotspot.type}
                        onChange={(event) =>
                          updateModelHotspot(selectedModelIndex, hotspot.id, {
                            type: event.target
                              .value as SceneContentHotspot["type"],
                            mediaUrl: undefined,
                            externalUrl: undefined,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                      >
                        <option value="info">Thông tin</option>
                        <option value="image">Hình ảnh</option>
                        <option value="video">Video</option>
                        <option value="model3d">Mô hình 3D</option>
                        <option value="external_link">Liên kết</option>
                      </select>
                      <textarea
                        rows={2}
                        value={hotspot.description ?? ""}
                        onChange={(event) =>
                          updateModelHotspot(selectedModelIndex, hotspot.id, {
                            description: event.target.value,
                          })
                        }
                        className="w-full resize-none rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                        placeholder="Mô tả"
                      />
                      {hotspot.type === "external_link" && (
                        <input
                          type="url"
                          value={hotspot.externalUrl ?? ""}
                          onChange={(event) =>
                            updateModelHotspot(
                              selectedModelIndex,
                              hotspot.id,
                              { externalUrl: event.target.value },
                            )
                          }
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                          placeholder="https://..."
                        />
                      )}
                      {(hotspot.type === "image" ||
                        hotspot.type === "video" ||
                        hotspot.type === "model3d") && (
                        <label className="block cursor-pointer rounded-lg border border-dashed border-blue-200 bg-blue-50 px-2 py-2 text-center text-[10px] font-bold text-blue-700">
                          {uploadingHotspotId === hotspot.id
                            ? "Đang tải..."
                            : hotspot.mediaUrl
                              ? "Đổi tập tin"
                              : "Tải tập tin"}
                          <input
                            type="file"
                            className="hidden"
                            disabled={uploadingHotspotId === hotspot.id}
                            accept={
                              hotspot.type === "model3d"
                                ? ".glb,.gltf"
                                : hotspot.type === "video"
                                  ? "video/*"
                                : "image/*"
                            }
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              event.target.value = "";
                              if (file) {
                                void uploadModelHotspotMedia(
                                  selectedModelIndex,
                                  hotspot,
                                  file,
                                );
                              }
                            }}
                          />
                        </label>
                      )}
                      <div>
                        <div className="mb-1 text-[10px] font-black uppercase text-slate-400">
                          Vị trí tương đối
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {(["x", "y", "z"] as const).map((axis) => (
                            <input
                              key={axis}
                              type="number"
                              step="0.1"
                              value={hotspot.position[axis]}
                              onChange={(event) =>
                                updateModelHotspot(
                                  selectedModelIndex,
                                  hotspot.id,
                                  {
                                    position: {
                                      ...hotspot.position,
                                      [axis]: Number(event.target.value),
                                    },
                                  },
                                )
                              }
                              className="min-w-0 rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              title={`position.${axis}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Surface>

        {selectedTransition && selectedTransitionIndex != null && (
          <Surface className="p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
              Điểm chuyển cảnh
            </h3>
            <div className="mt-3 space-y-2">
              <input
                value={selectedTransition.title}
                onChange={(event) =>
                  updateTransition(selectedTransitionIndex, {
                    title: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              />
              <select
                value={selectedTransition.targetType}
                onChange={(event) => {
                  const targetType = event.target.value as "scene" | "panorama";
                  updateTransition(selectedTransitionIndex, {
                    targetType,
                    targetId:
                      targetType === "scene"
                        ? sceneTargets.find((target) => target.id !== scene.id)?.id ?? ""
                        : panoramas[0]?.id ?? "",
                  });
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              >
                <option value="scene">Cảnh 3D</option>
                <option value="panorama">Panorama 360</option>
              </select>
              <select
                value={selectedTransition.targetId}
                onChange={(event) =>
                  updateTransition(selectedTransitionIndex, {
                    targetId: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
              >
                <option value="">-- Chọn đích --</option>
                {selectedTransition.targetType === "scene"
                  ? sceneTargets
                      .filter((target) => target.id !== scene.id)
                      .map((target) => (
                        <option key={target.id} value={target.id}>
                          {target.name}
                        </option>
                      ))
                  : panoramas.map((panorama) => (
                      <option key={panorama.id} value={panorama.id}>
                        {panorama.name}
                      </option>
                    ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setScene({
                    ...scene,
                    transitionPoints: scene.transitionPoints.filter(
                      (_, index) => index !== selectedTransitionIndex,
                    ),
                  });
                  setSelectedTransitionIndex(null);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 cursor-pointer"
              >
                <Trash2 size={13} /> Xóa điểm chuyển
              </button>
            </div>
          </Surface>
        )}
      </div>
    </div>
  );
};
