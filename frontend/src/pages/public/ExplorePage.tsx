import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  loadLayers,
  setGoToTarget,
} from "../../store/mapSlice";
import {
  fetchAllSpatialEntities,
  selectSelectedSpatialEntityId,
  selectSpatialEntities,
  setSelectedEntity,
} from "../../store/spatialEntitiesSlice";
import { selectCategories, fetchAllCategories } from "../../store/categoriesSlice";
import { selectRegions, fetchAllRegions } from "../../store/regionsSlice";
import { fetchAllVirtualTours } from "../../store/virtualToursSlice";
import MapScene from "../../components/MapScene";
import MapControls from "../../components/MapControls";
import { SpatialEntityCard } from "../../components/public/SpatialEntityCard";
import { VirtualTourViewer } from "../../components/public/VirtualTourViewer";
import { fetchSceneByEntity } from "../../services/scenesService";
import {
  Search,
  Folder,
  Compass,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
} from "lucide-react";

export const ExplorePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux Selectors
  const entities = useAppSelector(selectSpatialEntities);
  const selectedEntityIdFromStore = useAppSelector(selectSelectedSpatialEntityId);
  const categories = useAppSelector(selectCategories);
  const regions = useAppSelector(selectRegions);

  // Local States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeRegionId, setActiveRegionId] = useState("");
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  // Get selected entity ID from URL search params
  const selectedEntityId = searchParams.get("entityId") || selectedEntityIdFromStore || "";

  useEffect(() => {
    dispatch(loadLayers());
    dispatch(fetchAllCategories());
    dispatch(fetchAllRegions());
    dispatch(fetchAllSpatialEntities(undefined));
  }, [dispatch]);

  // Sync selected entity from URL param to Redux store
  useEffect(() => {
    dispatch(setSelectedEntity(selectedEntityId || null));
    if (selectedEntityId && entities.length > 0) {
      const ent = entities.find((e) => e.id === selectedEntityId);
      const longitude = Number(ent?.longitude ?? ent?.centerLongitude);
      const latitude = Number(ent?.latitude ?? ent?.centerLatitude);
      if (ent && Number.isFinite(longitude) && Number.isFinite(latitude)) {
        dispatch(
          setGoToTarget({
            longitude,
            latitude,
            zoom: 16,
          })
        );
      }
    }
  }, [selectedEntityId, entities, dispatch]);

  const selectedEntity = entities.find((e) => e.id === selectedEntityId);

  // Filters logic
  const filteredEntities = entities.filter((ent: any) => {
    if (["inactive", "archived", "deleted"].includes(ent.status)) return false;

    const matchesSearch =
      !searchTerm || ent.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategoryId || ent.categoryId === activeCategoryId;
    const matchesRegion = !activeRegionId || ent.regionId === activeRegionId;
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleEntityClick = (ent: any) => {
    setSearchParams({ entityId: ent.id });
    const longitude = Number(ent.longitude ?? ent.centerLongitude);
    const latitude = Number(ent.latitude ?? ent.centerLatitude);
    if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
      dispatch(
        setGoToTarget({
          longitude,
          latitude,
          zoom: 16,
        })
      );
    }
  };

  const handleCloseSelectedEntity = () => {
    dispatch(setSelectedEntity(null));
    setSearchParams({});
  };

  const handleExploreTour = async () => {
    if (!selectedEntityId) return;
    try {
      const res = await dispatch(
        fetchAllVirtualTours({ spatialEntityId: selectedEntityId })
      ).unwrap();
      const entityTours = res || [];
      if (entityTours.length > 0) {
        setActiveTourId(entityTours[0].id);
        setViewerOpen(true);
        return;
      }

      await fetchSceneByEntity(selectedEntityId);
      setActiveTourId(null);
      setViewerOpen(true);
    } catch (err) {
      alert("Địa điểm này chưa có cảnh 3D hoặc tour 360 để tham quan.");
    }
  };

  return (
    <div className="flex-1 min-h-0 relative w-full overflow-hidden flex bg-slate-50">
      {/* Search & Filter Floating Sidebar */}
      <div
        className={`absolute top-0 bottom-0 left-0 z-20 flex transition-all duration-300 ${
          sidebarCollapsed ? "-translate-x-80" : "translate-x-0"
        } w-80 bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-xl flex-col justify-between`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header & Search */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div>
              <h1 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Compass className="text-blue-600" size={18} />
                Khám phá Cần Thơ 3D
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Bản đồ không gian & thực tế ảo
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Tìm địa điểm, di tích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-semibold text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Filters and List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
            {/* Category Filter */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <Folder size={12} /> Phân loại địa điểm
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategoryId("")}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    !activeCategoryId
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((c) => {
                  const isActive = activeCategoryId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategoryId(c.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Regions list */}
            {regions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass size={12} /> Quận / Huyện
                </span>
                <select
                  value={activeRegionId}
                  onChange={(e) => setActiveRegionId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-750"
                >
                  <option value="">Tất cả Quận / Huyện</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Matching Entities List */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={12} /> Địa điểm tìm thấy ({filteredEntities.length})
              </span>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredEntities.map((ent: any) => {
                  const isSelected = selectedEntityId === ent.id;
                  const cat = categories.find((c) => c.id === ent.categoryId);
                  return (
                    <div
                      key={ent.id}
                      onClick={() => handleEntityClick(ent)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-900 shadow-sm"
                          : "bg-slate-50/50 border-slate-200/65 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      <h4 className="text-xs font-bold truncate">{ent.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-[9px] font-bold">
                        <span style={{ color: cat?.color }}>{cat?.name || "Địa điểm"}</span>
                        {ent.hasVirtualTour && (
                          <span className="flex items-center gap-0.5 text-emerald-600">
                            <Video size={10} /> VR 360
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Collapser Toggle Handle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-1/2 -translate-y-1/2 left-full bg-white border border-slate-200 text-slate-600 p-1 rounded-r-xl shadow-md hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Fullscreen Map Scene View */}
      <div className="absolute inset-0 z-0">
        <MapScene />
      </div>
      <MapControls />

      {/* Floating Spatial Entity Details Popup (Bottom Right) */}
      {selectedEntity && (
        <div className="absolute bottom-6 right-6 z-10 w-full max-w-sm pointer-events-auto">
          <SpatialEntityCard
            entity={selectedEntity}
            onClose={handleCloseSelectedEntity}
            onExploreTour={handleExploreTour}
            onViewDetails={() => navigate(`/explore/${selectedEntity.slug}`)}
          />
        </div>
      )}

      {/* Fullscreen 3D / 360 experience overlay */}
      {viewerOpen && selectedEntityId && (
        <VirtualTourViewer
          tourId={activeTourId}
          entityId={selectedEntityId}
          onClose={() => {
            setViewerOpen(false);
            setActiveTourId(null);
          }}
        />
      )}
    </div>
  );
};
export default ExplorePage;
