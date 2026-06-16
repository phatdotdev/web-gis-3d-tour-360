import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Bounds,
  Grid,
  Html,
  OrbitControls,
  TransformControls,
  useGLTF,
} from "@react-three/drei";
import { Plane, Vector3, type Group } from "three";
import { Box, Image, Info, Link2, MapPin, Video } from "lucide-react";

import type {
  SceneData,
  SceneContentHotspot,
  SceneModel,
  SceneTransitionPoint,
  Vector3Value,
} from "../../types/scene";
import { resolveAssetUrl } from "../../utils/httpClient";

type TransformMode = "translate" | "rotate" | "scale";

const ModelObject = ({
  model,
  selected,
  editable,
  transformMode,
  onSelect,
  onTransform,
  onTrigger,
  onHotspotTrigger,
  onDragStateChange,
}: {
  model: SceneModel;
  selected: boolean;
  editable: boolean;
  transformMode: TransformMode;
  onSelect: () => void;
  onTransform: (
    position: Vector3Value,
    rotation: Vector3Value,
    scale: Vector3Value,
  ) => void;
  onTrigger?: (model: SceneModel) => void;
  onHotspotTrigger?: (hotspot: SceneContentHotspot) => void;
  onDragStateChange?: (dragging: boolean) => void;
}) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragPlane = useRef(new Plane());
  const dragOffset = useRef(new Vector3());
  const dragPoint = useRef(new Vector3());
  const dragStartPoint = useRef(new Vector3());
  const dragMoved = useRef(false);
  const returnPosition = useRef(
    new Vector3(model.position.x, model.position.y, model.position.z),
  );
  const gltf = useGLTF(resolveAssetUrl(model.modelUrl) || model.modelUrl);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const hotspots = model.settings?.hotspots ?? [];
  const interaction = model.settings?.interaction ?? {};
  const hoverEffect = interaction.hoverEffect ?? "scale";
  const hoverScale = Math.max(1, Number(interaction.hoverScale ?? 1.08));
  const draggable = !editable && Boolean(interaction.draggable);
  const dragReturn = interaction.dragReturn !== false;
  const baseScale = useMemo(
    () => new Vector3(model.scale.x, model.scale.y, model.scale.z),
    [model.scale.x, model.scale.y, model.scale.z],
  );

  const syncTransform = () => {
    const object = groupRef.current;
    if (!object) return;
    onTransform(
      { x: object.position.x, y: object.position.y, z: object.position.z },
      { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z },
      { x: object.scale.x, y: object.scale.y, z: object.scale.z },
    );
  };

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
      onDragStateChange?.(false);
    };
  }, [onDragStateChange]);

  useFrame((state, delta) => {
    const object = groupRef.current;
    if (!object) return;

    const scaleMultiplier =
      hovered && hoverEffect === "scale" && !dragging ? hoverScale : 1;
    const targetScale = baseScale
      .clone()
      .multiplyScalar(scaleMultiplier);
    object.scale.lerp(targetScale, 1 - Math.exp(-10 * delta));

    if (hoverEffect === "float" && hovered && !dragging) {
      object.position.y =
        returnPosition.current.y + Math.sin(state.clock.elapsedTime * 3) * 0.12;
    } else if (!dragging && dragReturn) {
      object.position.lerp(
        returnPosition.current,
        1 - Math.exp(-7 * delta),
      );
    }
  });

  const content = (
    <group
      ref={groupRef}
      position={[model.position.x, model.position.y, model.position.z]}
      rotation={[model.rotation.x, model.rotation.y, model.rotation.z]}
      scale={[model.scale.x, model.scale.y, model.scale.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
        if (dragMoved.current) {
          dragMoved.current = false;
          return;
        }
        if (!editable && interaction.clickEnabled !== false) {
          onTrigger?.(model);
        }
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
        document.body.style.cursor = draggable ? "grab" : "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onPointerDown={(event) => {
        if (!draggable || !groupRef.current) return;
        event.stopPropagation();
        const pointerTarget = event.nativeEvent.target;
        if (pointerTarget instanceof Element) {
          pointerTarget.setPointerCapture(event.pointerId);
        }
        returnPosition.current.set(
          model.position.x,
          model.position.y,
          model.position.z,
        );
        dragPlane.current.setFromNormalAndCoplanarPoint(
          new Vector3(0, 1, 0),
          groupRef.current.position,
        );
        if (event.ray.intersectPlane(dragPlane.current, dragPoint.current)) {
          dragStartPoint.current.copy(dragPoint.current);
          dragOffset.current
            .copy(groupRef.current.position)
            .sub(dragPoint.current);
        }
        dragMoved.current = false;
        setDragging(true);
        onDragStateChange?.(true);
        document.body.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        if (!dragging || !groupRef.current) return;
        event.stopPropagation();
        if (event.ray.intersectPlane(dragPlane.current, dragPoint.current)) {
          if (dragPoint.current.distanceTo(dragStartPoint.current) > 0.03) {
            dragMoved.current = true;
          }
          groupRef.current.position
            .copy(dragPoint.current)
            .add(dragOffset.current);
        }
      }}
      onPointerUp={(event) => {
        if (!dragging) return;
        event.stopPropagation();
        const pointerTarget = event.nativeEvent.target;
        if (
          pointerTarget instanceof Element &&
          pointerTarget.hasPointerCapture(event.pointerId)
        ) {
          pointerTarget.releasePointerCapture(event.pointerId);
        }
        setDragging(false);
        onDragStateChange?.(false);
        document.body.style.cursor = hovered ? "grab" : "auto";
        if (!dragReturn && groupRef.current) {
          returnPosition.current.copy(groupRef.current.position);
        }
      }}
    >
      <primitive object={clonedScene} />
      {hovered && !editable && (
        <Html center position={[0, 0, 0]} pointerEvents="none">
          <div className="rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-xl">
            {model.name}
          </div>
        </Html>
      )}
      {hotspots.map((hotspot) => (
        <Html
          key={hotspot.id}
          center
          position={[
            hotspot.position.x,
            hotspot.position.y,
            hotspot.position.z,
          ]}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onHotspotTrigger?.(hotspot);
            }}
            className="group flex items-center gap-2 rounded-full border border-white/50 bg-slate-950/85 px-3 py-2 text-xs font-bold text-white shadow-xl backdrop-blur transition hover:bg-blue-600 cursor-pointer"
            title={hotspot.title}
          >
            {hotspot.type === "image" ? (
              <Image size={15} />
            ) : hotspot.type === "video" ? (
              <Video size={15} />
            ) : hotspot.type === "model3d" ? (
              <Box size={15} />
            ) : hotspot.type === "external_link" ? (
              <Link2 size={15} />
            ) : (
              <Info size={15} />
            )}
            <span className="max-w-36 truncate">{hotspot.title}</span>
          </button>
        </Html>
      ))}
    </group>
  );

  if (!editable || !selected) return content;

  return (
    <TransformControls mode={transformMode} onMouseUp={syncTransform}>
      {content}
    </TransformControls>
  );
};

const TransitionObject = ({
  point,
  selected,
  editable,
  onSelect,
  onTransform,
  onTrigger,
}: {
  point: SceneTransitionPoint;
  selected: boolean;
  editable: boolean;
  onSelect: () => void;
  onTransform: (position: Vector3Value) => void;
  onTrigger?: (point: SceneTransitionPoint) => void;
}) => {
  const groupRef = useRef<Group>(null);

  const content = (
    <group
      ref={groupRef}
      position={[point.position.x, point.position.y, point.position.z]}
    >
      <Html center distanceFactor={8}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
            if (!editable) onTrigger?.(point);
          }}
          className={`group flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-xl backdrop-blur cursor-pointer transition-all ${
            selected
              ? "border-cyan-300 bg-cyan-500 text-white"
              : "border-white/50 bg-slate-950/80 text-white hover:bg-cyan-600"
          }`}
        >
          <MapPin size={15} />
          <span className="max-w-36 truncate">{point.title}</span>
        </button>
      </Html>
    </group>
  );

  if (!editable || !selected) return content;

  return (
    <TransformControls
      mode="translate"
      onMouseUp={() => {
        const object = groupRef.current;
        if (!object) return;
        onTransform({
          x: object.position.x,
          y: object.position.y,
          z: object.position.z,
        });
      }}
    >
      {content}
    </TransformControls>
  );
};

export const SceneViewport = ({
  scene,
  editable = false,
  transformMode = "translate",
  selectedModelIndex,
  selectedTransitionIndex,
  onSelectModel,
  onSelectTransition,
  onModelTransform,
  onTransitionTransform,
  onTransitionTrigger,
  onModelTrigger,
  onContentHotspotTrigger,
}: {
  scene: SceneData;
  editable?: boolean;
  transformMode?: TransformMode;
  selectedModelIndex?: number | null;
  selectedTransitionIndex?: number | null;
  onSelectModel?: (index: number) => void;
  onSelectTransition?: (index: number) => void;
  onModelTransform?: (
    index: number,
    position: Vector3Value,
    rotation: Vector3Value,
    scale: Vector3Value,
  ) => void;
  onTransitionTransform?: (index: number, position: Vector3Value) => void;
  onTransitionTrigger?: (point: SceneTransitionPoint) => void;
  onModelTrigger?: (model: SceneModel) => void;
  onContentHotspotTrigger?: (hotspot: SceneContentHotspot) => void;
}) => {
  const [modelDragging, setModelDragging] = useState(false);

  useEffect(() => {
    scene.models.forEach((model) => {
      const url = resolveAssetUrl(model.modelUrl) || model.modelUrl;
      useGLTF.preload(url);
    });
  }, [scene.models]);

  return (
    <Canvas
      shadows
      camera={{ position: [8, 6, 8], fov: 48 }}
      onPointerMissed={() => {
        onSelectModel?.(-1);
        onSelectTransition?.(-1);
      }}
    >
      <color attach="background" args={["#dce8f5"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[8, 12, 6]} intensity={2.2} castShadow />
      <Suspense
        fallback={
          <Html center className="text-sm font-bold">
            Đang tải mô hình...
          </Html>
        }
      >
        {scene.models.length > 0 && (
          <Bounds fit clip margin={1.25}>
            {scene.models.map((model, index) => (
              <ModelObject
                key={model.id ?? `${model.modelUrl}-${index}`}
                model={model}
                selected={selectedModelIndex === index}
                editable={editable}
                transformMode={transformMode}
                onSelect={() => onSelectModel?.(index)}
                onTransform={(position, rotation, scale) =>
                  onModelTransform?.(index, position, rotation, scale)
                }
                onTrigger={onModelTrigger}
                onHotspotTrigger={onContentHotspotTrigger}
                onDragStateChange={setModelDragging}
              />
            ))}
          </Bounds>
        )}
        {scene.transitionPoints.map((point, index) => (
          <TransitionObject
            key={point.id}
            point={point}
            selected={selectedTransitionIndex === index}
            editable={editable}
            onSelect={() => onSelectTransition?.(index)}
            onTransform={(position) => onTransitionTransform?.(index, position)}
            onTrigger={onTransitionTrigger}
          />
        ))}
        <Environment preset="city" />
      </Suspense>
      <Grid
        infiniteGrid
        fadeDistance={50}
        sectionColor="#64748b"
        cellColor="#a5b4c5"
      />
      <OrbitControls makeDefault enabled={!modelDragging} />
    </Canvas>
  );
};
