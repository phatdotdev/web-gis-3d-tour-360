import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";

import { useAppDispatch } from "../../store/hooks";
import { updateEntity } from "../../store/mapSlice";
import type { BackendSpatialEntity } from "../../types/backend";

const entitySchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  opacity: z.number().min(0).max(1),
  width: z.number().min(0),
  height: z.number().min(0),
  elevation: z.number(),
  scale: z.number().min(0.1).optional(),
});

type FormValues = z.infer<typeof entitySchema>;

type Props = {
  entity: BackendSpatialEntity;
  onCancel: () => void;
};

const inputClasses =
  "w-full py-2 px-3 border border-[#e2e8f0] rounded-lg text-[13px] text-[#1e293b] bg-white transition-all duration-200 focus:outline-none focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] placeholder:text-[#94a3b8] font-mono";

const labelClasses = "text-[11.5px] font-semibold text-[#64748b]";

export const EntityEditForm: React.FC<Props> = ({ entity, onCancel }) => {
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: entity.name || "",
      color: entity.color || "",
      opacity: entity.opacity ?? 1,
      width: entity.width ?? 1,
      height: entity.height ?? 0,
      elevation: entity.elevation ?? 0,
      scale: entity.scale ?? 1,
    },
  });

  useEffect(() => {
    reset({
      name: entity.name || "",
      color: entity.color || "",
      opacity: entity.opacity ?? 1,
      width: entity.width ?? 1,
      height: entity.height ?? 0,
      elevation: entity.elevation ?? 0,
      scale: entity.scale ?? 1,
    });
  }, [entity, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(
        updateEntity({ entityId: entity.id, payload: data }),
      ).unwrap();
      onCancel();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-[#e2e8f0] animate-[form-slide-in_0.2s_ease]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-2.5">
          <div className="flex flex-col gap-1 min-w-[45%] flex-1">
            <label className={labelClasses}>Tên</label>
            <input type="text" className={inputClasses} {...register("name")} />
          </div>
          <div className="flex flex-col gap-1 min-w-[45%] flex-1">
            <label className={labelClasses}>Màu (Hex/RGBA)</label>
            <input type="text" className={inputClasses} {...register("color")} />
          </div>
          <div className="flex flex-col gap-1 min-w-[30%] flex-1">
            <label className={labelClasses}>Độ mờ (0-1)</label>
            <input
              type="number"
              step="0.1"
              className={inputClasses}
              {...register("opacity", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[30%] flex-1">
            <label className={labelClasses}>Độ rộng</label>
            <input
              type="number"
              step="0.1"
              className={inputClasses}
              {...register("width", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[30%] flex-1">
            <label className={labelClasses}>Độ cao Z</label>
            <input
              type="number"
              step="0.1"
              className={inputClasses}
              {...register("elevation", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[30%] flex-1">
            <label className={labelClasses}>Scale</label>
            <input
              type="number"
              step="0.1"
              className={inputClasses}
              {...register("scale", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 py-2 px-4 text-[13px] font-semibold border border-transparent rounded-lg cursor-pointer transition-all duration-200 leading-none bg-[#2563eb] text-white hover:bg-[#1d4ed8] hover:shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-[0.97]"
          >
            <Save size={14} />
            <span>Lưu thay đổi</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 py-2 px-4 text-[13px] font-semibold border border-[#e2e8f0] rounded-lg cursor-pointer transition-all duration-200 leading-none bg-white text-[#475569] hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:scale-[0.97]"
            onClick={onCancel}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};
