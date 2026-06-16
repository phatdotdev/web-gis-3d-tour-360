import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectPanelCollapsed,
  selectViewMode,
  selectViewState,
  setPanelCollapsed,
  setViewMode,
} from "../store/mapSlice";
import type { ViewMode } from "../types/map";
import { cn } from "../utils/cn";

const MapControls = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectViewMode);
  const viewState = useAppSelector(selectViewState);
  const panelCollapsed = useAppSelector(selectPanelCollapsed);

  const handleViewModeChange = (next: ViewMode) => {
    dispatch(setViewMode(next));
  };

  const panelClasses = cn(
    "absolute right-4 bottom-4 flex flex-col rounded-xl bg-[rgba(255,255,255,0.95)] border border-[var(--color-panel-border)] shadow-[0_16px_32px_rgba(0,0,0,0.12)] text-[var(--color-panel-text)] overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-10",
    panelCollapsed ? "w-14" : "w-[290px]",
  );

  return (
    <aside className={panelClasses}>
      <div className="flex items-center justify-between py-3 px-4 border-b border-[var(--color-panel-border)]">
        {!panelCollapsed && (
          <h2 className="m-0 text-sm font-bold tracking-tight">Explore View</h2>
        )}
        <button
          className="w-7 h-7 border-none rounded-lg bg-[var(--color-panel-surface)] text-[var(--color-panel-muted)] text-[11px] cursor-pointer grid place-items-center shrink-0 transition-all duration-200 hover:bg-[#e7eef5] hover:text-[var(--color-panel-accent-strong)]"
          type="button"
          onClick={() => dispatch(setPanelCollapsed(!panelCollapsed))}
          title={panelCollapsed ? "Mo rong" : "Thu gon"}
          aria-label={panelCollapsed ? "Mo rong panel" : "Thu gon panel"}
        >
          {panelCollapsed ? "◀" : "▶"}
        </button>
      </div>

      {!panelCollapsed && (
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Che do hien thi
            </div>
            <div className="grid grid-cols-2 rounded-xl border border-[var(--color-panel-input-border)] overflow-hidden">
              <button
                type="button"
                className={cn(
                  "px-3 py-2 text-sm font-semibold border-none cursor-pointer transition-colors",
                  viewMode === "2d"
                    ? "bg-[var(--color-panel-accent)] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50",
                )}
                onClick={() => handleViewModeChange("2d")}
              >
                2D
              </button>
              <button
                type="button"
                className={cn(
                  "px-3 py-2 text-sm font-semibold border-none cursor-pointer transition-colors",
                  viewMode === "3d"
                    ? "bg-[var(--color-panel-accent)] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50",
                )}
                onClick={() => handleViewModeChange("3d")}
              >
                3D
              </button>
            </div>
            <p className="m-0 text-xs leading-5 text-slate-500">
              2D dang la che do uu tien de on dinh. 3D hien tai dang duoc rut gon de thu nghiem.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Toa do hien tai
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <span className="text-slate-500">Kinh do</span>
              <span className="text-right font-mono tabular-nums">
                {viewState ? viewState.longitude.toFixed(6) : "—"}
              </span>
              <span className="text-slate-500">Vi do</span>
              <span className="text-right font-mono tabular-nums">
                {viewState ? viewState.latitude.toFixed(6) : "—"}
              </span>
              <span className="text-slate-500">Zoom</span>
              <span className="text-right font-mono tabular-nums">
                {viewState ? viewState.zoom.toFixed(2) : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default MapControls;
