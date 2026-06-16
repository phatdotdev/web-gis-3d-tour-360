// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LayersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const layer_entity_1 = require("./entities/layer.entity");
const typeorm_2 = require("typeorm");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const geojson_downloader_service_1 = require("./services/geojson-downloader.service");
const geojson_pipeline_service_1 = require("./services/geojson-pipeline.service");
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
const geojson_limits_1 = require("./constants/geojson-limits");
const spatial_entity_cleanup_service_1 = require("../spatial-entities/spatial-entity-cleanup.service");
let LayersService = LayersService_1 = class LayersService {
    layerRepository;
    spatialEntityRepository;
    downloader;
    pipeline;
    cleanupService;
    logger = new common_1.Logger(LayersService_1.name);
    constructor(layerRepository, spatialEntityRepository, downloader, pipeline, cleanupService) {
        this.layerRepository = layerRepository;
        this.spatialEntityRepository = spatialEntityRepository;
        this.downloader = downloader;
        this.pipeline = pipeline;
        this.cleanupService = cleanupService;
    }
    parseFormDataPayload(payload) {
        const parsed = { ...payload };
        if (typeof parsed.visible === 'string') {
            parsed.visible = parsed.visible === 'true';
        }
        if (typeof parsed.minZoom === 'string') {
            const v = Number(parsed.minZoom);
            parsed.minZoom = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.maxZoom === 'string') {
            const v = Number(parsed.maxZoom);
            parsed.maxZoom = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.zIndex === 'string') {
            const v = Number(parsed.zIndex);
            parsed.zIndex = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.elevation === 'string') {
            const v = Number(parsed.elevation);
            parsed.elevation = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.scale === 'string') {
            const v = Number(parsed.scale);
            parsed.scale = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.height === 'string') {
            const v = Number(parsed.height);
            parsed.height = Number.isFinite(v) ? v : undefined;
        }
        if (typeof parsed.metadata === 'string') {
            try {
                parsed.metadata = JSON.parse(parsed.metadata);
            }
            catch {
                parsed.metadata = undefined;
            }
        }
        return parsed;
    }
    async syncSpatialEntities(layer, features) {
        await this.cleanupService.removeByLayerId(layer.id);
        for (let start = 0; start < features.length; start += geojson_limits_1.GEOJSON_LIMITS.persistenceChunkSize) {
            const featureChunk = features.slice(start, start + geojson_limits_1.GEOJSON_LIMITS.persistenceChunkSize);
            const entityChunk = featureChunk.map((feature, chunkIndex) => {
                const properties = feature.properties ?? {};
                return this.spatialEntityRepository.create({
                    name: properties.name ?? `feature_${start + chunkIndex + 1}`,
                    type: properties.type ?? feature.geometry.type.toLowerCase(),
                    renderType: properties.renderType,
                    geometry: feature.geometry,
                    elevation: properties.elevation ?? 0,
                    height: properties.height ?? 0,
                    width: properties.width ?? 1,
                    assetUrl: properties.assetUrl ?? null,
                    iconUrl: properties.iconUrl ?? null,
                    color: properties.color ?? null,
                    opacity: properties.opacity ?? 1,
                    metadata: properties,
                    layer,
                });
            });
            const savedChunk = await this.spatialEntityRepository.save(entityChunk);
            for (let index = 0; index < featureChunk.length; index++) {
                const entity = savedChunk[index];
                const feature = featureChunk[index];
                if (!entity || !feature)
                    continue;
                feature.id = entity.id;
                feature.properties = {
                    ...(feature.properties ?? {}),
                    id: entity.id,
                };
            }
        }
    }
    toResponseDto(layer, dataStatus, fallbackReason) {
        const renderCache = layer.renderCache ?? {
            renderer: null,
            popupTemplate: null,
            featureCollection: { type: 'FeatureCollection', features: [] },
        };
        return {
            id: layer.id,
            name: layer.name,
            type: layer.type,
            visible: layer.visible,
            minZoom: layer.minZoom,
            maxZoom: layer.maxZoom,
            zIndex: layer.zIndex,
            elevation: layer.elevation,
            scale: layer.scale,
            height: layer.height,
            modelUrl: layer.modelUrl,
            iconUrl: layer.iconUrl,
            dataUrl: layer.dataUrl,
            metadata: layer.metadata,
            extent: layer.extent,
            renderer: renderCache.renderer,
            popupTemplate: renderCache.popupTemplate,
            featureCollection: renderCache.featureCollection,
            vertexFeatureCollection: renderCache.vertexFeatureCollection,
            entities: layer.entities ?? [],
            dataStatus,
            fallbackInfo: {
                useFallbackData: dataStatus === 'fallback',
                reason: fallbackReason,
            },
        };
    }
    async reloadLayerWithCount(id) {
        const layer = await this.layerRepository.findOne({ where: { id } });
        if (!layer)
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        const count = await this.spatialEntityRepository.count({ where: { layer: { id } } });
        layer.entities = { length: count };
        return layer;
    }
    async tryProcessRemoteData(layer) {
        if (!layer.dataUrl?.trim()) {
            return { status: 'latest' };
        }
        const geoJsonData = await this.downloader.download(layer.dataUrl);
        if (!geoJsonData) {
            return {
                status: 'fallback',
                reason: 'Failed to download data from remote URL. Using cached fallback data.',
            };
        }
        try {
            const pipelineResult = this.pipeline.process(geoJsonData, {
                elevation: layer.elevation,
                scale: layer.scale,
                height: layer.height,
                modelUrl: layer.modelUrl,
                iconUrl: layer.iconUrl,
            });
            layer.extent = pipelineResult.extent;
            layer.renderCache = {
                renderer: pipelineResult.renderer,
                popupTemplate: pipelineResult.popupTemplate,
                featureCollection: pipelineResult.featureCollection,
                vertexFeatureCollection: pipelineResult.vertexFeatureCollection,
            };
            await this.syncSpatialEntities(layer, pipelineResult.featureCollection.features);
            await this.layerRepository.save(layer);
            return { status: 'latest' };
        }
        catch (err) {
            this.logger.error(`Failed to process downloaded GeoJSON for layer ${layer.id}: ${err.message}`);
            return {
                status: 'fallback',
                reason: `Failed to process remote GeoJSON: ${err.message}. Using cached fallback data.`,
            };
        }
    }
    async create(createLayerDto) {
        const layer = this.layerRepository.create({
            name: createLayerDto.name,
            type: createLayerDto.type ?? 'Point',
            visible: createLayerDto.visible ?? true,
            minZoom: createLayerDto.minZoom ?? 0,
            maxZoom: createLayerDto.maxZoom ?? 24,
            zIndex: createLayerDto.zIndex ?? 0,
            elevation: createLayerDto.elevation ?? 0,
            scale: createLayerDto.scale ?? 1,
            height: createLayerDto.height ?? 0,
            modelUrl: createLayerDto.modelUrl ?? null,
            iconUrl: createLayerDto.iconUrl ?? null,
            dataUrl: createLayerDto.dataUrl ?? null,
            metadata: createLayerDto.metadata ?? {},
        });
        const savedLayer = await this.layerRepository.save(layer);
        if (savedLayer.dataUrl?.trim()) {
            const result = await this.tryProcessRemoteData(savedLayer);
            const reloaded = await this.reloadLayerWithCount(savedLayer.id);
            return this.toResponseDto(reloaded, result.status, result.reason);
        }
        const reloaded = await this.reloadLayerWithCount(savedLayer.id);
        return this.toResponseDto(reloaded, 'latest');
    }
    async createFromGeoJson(file, payload) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('GeoJSON file is required');
        }
        const parsed = this.parseFormDataPayload(payload);
        const layer = this.layerRepository.create({
            name: parsed.name ?? file.originalname.replace(/\.geojson$/i, ''),
            type: parsed.type ?? 'geojson',
            visible: parsed.visible ?? true,
            minZoom: parsed.minZoom ?? 0,
            maxZoom: parsed.maxZoom ?? 24,
            zIndex: parsed.zIndex ?? 0,
            elevation: parsed.elevation ?? 0,
            scale: parsed.scale ?? 1,
            height: parsed.height ?? 0,
            modelUrl: parsed.modelUrl ?? null,
            iconUrl: parsed.iconUrl ?? null,
            dataUrl: parsed.dataUrl ?? null,
            metadata: parsed.metadata ?? {},
        });
        const savedLayer = await this.layerRepository.save(layer);
        try {
            const pipelineResult = this.pipeline.process(file.buffer, {
                elevation: savedLayer.elevation,
                scale: savedLayer.scale,
                height: savedLayer.height,
                modelUrl: savedLayer.modelUrl,
                iconUrl: savedLayer.iconUrl,
            });
            savedLayer.extent = pipelineResult.extent;
            savedLayer.renderCache = {
                renderer: pipelineResult.renderer,
                popupTemplate: pipelineResult.popupTemplate,
                featureCollection: pipelineResult.featureCollection,
                vertexFeatureCollection: pipelineResult.vertexFeatureCollection,
            };
            await this.syncSpatialEntities(savedLayer, pipelineResult.featureCollection.features);
            const updatedLayer = await this.layerRepository.save(savedLayer);
            const reloaded = await this.reloadLayerWithCount(updatedLayer.id);
            return this.toResponseDto(reloaded, 'latest');
        }
        catch (err) {
            await this.layerRepository.remove(savedLayer);
            throw new common_1.BadRequestException(`Failed to process GeoJSON: ${err.message}`);
        }
    }
    async findAll() {
        const layers = await this.layerRepository.find();
        const response = [];
        for (const layer of layers) {
            let dataStatus = 'latest';
            let fallbackReason = undefined;
            if (layer.dataUrl?.trim() && !layer.renderCache) {
                const result = await this.tryProcessRemoteData(layer);
                dataStatus = result.status;
                fallbackReason = result.reason;
            }
            if (!layer.renderCache) {
                const entities = await this.spatialEntityRepository.find({ where: { layer: { id: layer.id } } });
                if (entities.length > 0) {
                    try {
                        const mockFeatureCollection = {
                            type: 'FeatureCollection',
                            features: entities.map((entity) => ({
                                type: 'Feature',
                                id: entity.id,
                                geometry: entity.geometry,
                                properties: {
                                    ...entity.metadata,
                                    id: entity.id,
                                },
                            })),
                        };
                        const pipelineResult = this.pipeline.process(mockFeatureCollection, {
                            elevation: layer.elevation,
                            scale: layer.scale,
                            height: layer.height,
                            modelUrl: layer.modelUrl,
                            iconUrl: layer.iconUrl,
                        });
                        layer.extent = pipelineResult.extent;
                        layer.renderCache = {
                            renderer: pipelineResult.renderer,
                            popupTemplate: pipelineResult.popupTemplate,
                            featureCollection: pipelineResult.featureCollection,
                            vertexFeatureCollection: pipelineResult.vertexFeatureCollection,
                        };
                        await this.layerRepository.save(layer);
                    }
                    catch (err) {
                        this.logger.error(`Failed to build renderCache for layer ${layer.id}: ${err.message}`);
                    }
                }
            }
            const count = await this.spatialEntityRepository.count({ where: { layer: { id: layer.id } } });
            layer.entities = { length: count };
            response.push(this.toResponseDto(layer, dataStatus, fallbackReason));
        }
        return response;
    }
    async findOne(id) {
        const layer = await this.layerRepository.findOne({
            where: { id },
        });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        if (layer.dataUrl?.trim() && !layer.renderCache) {
            const result = await this.tryProcessRemoteData(layer);
            const reloaded = await this.reloadLayerWithCount(id);
            return this.toResponseDto(reloaded, result.status, result.reason);
        }
        if (!layer.renderCache) {
            const entities = await this.spatialEntityRepository.find({ where: { layer: { id: layer.id } } });
            if (entities.length > 0) {
                try {
                    const mockFeatureCollection = {
                        type: 'FeatureCollection',
                        features: entities.map((entity) => ({
                            type: 'Feature',
                            id: entity.id,
                            geometry: entity.geometry,
                            properties: {
                                ...entity.metadata,
                                id: entity.id,
                            },
                        })),
                    };
                    const pipelineResult = this.pipeline.process(mockFeatureCollection, {
                        elevation: layer.elevation,
                        scale: layer.scale,
                        height: layer.height,
                        modelUrl: layer.modelUrl,
                        iconUrl: layer.iconUrl,
                    });
                    layer.extent = pipelineResult.extent;
                    layer.renderCache = {
                        renderer: pipelineResult.renderer,
                        popupTemplate: pipelineResult.popupTemplate,
                        featureCollection: pipelineResult.featureCollection,
                        vertexFeatureCollection: pipelineResult.vertexFeatureCollection,
                    };
                    await this.layerRepository.save(layer);
                }
                catch {
                }
            }
        }
        const count = await this.spatialEntityRepository.count({ where: { layer: { id: layer.id } } });
        layer.entities = { length: count };
        return this.toResponseDto(layer, 'latest');
    }
    async update(id, updateLayerDto) {
        const layer = await this.layerRepository.findOne({
            where: { id },
        });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        const requiresReprocessing = (updateLayerDto.dataUrl !== undefined && updateLayerDto.dataUrl !== layer.dataUrl) ||
            (updateLayerDto.elevation !== undefined && updateLayerDto.elevation !== layer.elevation) ||
            (updateLayerDto.scale !== undefined && updateLayerDto.scale !== layer.scale) ||
            (updateLayerDto.height !== undefined && updateLayerDto.height !== layer.height) ||
            (updateLayerDto.modelUrl !== undefined && updateLayerDto.modelUrl !== layer.modelUrl) ||
            (updateLayerDto.iconUrl !== undefined && updateLayerDto.iconUrl !== layer.iconUrl);
        Object.assign(layer, updateLayerDto);
        const savedLayer = await this.layerRepository.save(layer);
        if (requiresReprocessing) {
            savedLayer.renderCache = null;
            await this.layerRepository.save(savedLayer);
            if (savedLayer.dataUrl?.trim()) {
                const result = await this.tryProcessRemoteData(savedLayer);
                const reloaded = await this.reloadLayerWithCount(savedLayer.id);
                return this.toResponseDto(reloaded, result.status, result.reason);
            }
            const entities = await this.spatialEntityRepository.find({
                where: { layer: { id: savedLayer.id } },
            });
            if (entities.length > 0) {
                const mockFeatureCollection = {
                    type: 'FeatureCollection',
                    features: entities.map((entity) => ({
                        type: 'Feature',
                        geometry: entity.geometry,
                        properties: entity.metadata,
                    })),
                };
                try {
                    const pipelineResult = this.pipeline.process(mockFeatureCollection, {
                        elevation: savedLayer.elevation,
                        scale: savedLayer.scale,
                        height: savedLayer.height,
                        modelUrl: savedLayer.modelUrl,
                        iconUrl: savedLayer.iconUrl,
                    });
                    savedLayer.extent = pipelineResult.extent;
                    savedLayer.renderCache = {
                        renderer: pipelineResult.renderer,
                        popupTemplate: pipelineResult.popupTemplate,
                        featureCollection: pipelineResult.featureCollection,
                        vertexFeatureCollection: pipelineResult.vertexFeatureCollection,
                    };
                    await this.syncSpatialEntities(savedLayer, pipelineResult.featureCollection.features);
                    const updatedLayer = await this.layerRepository.save(savedLayer);
                }
                catch (err) {
                    this.logger.error(`Failed to sync render cache on update for layer ${savedLayer.id}: ${err.message}`);
                }
            }
        }
        const finalReloaded = await this.reloadLayerWithCount(savedLayer.id);
        return this.toResponseDto(finalReloaded, 'latest');
    }
    async remove(id) {
        const layer = await this.layerRepository.findOne({ where: { id } });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        const deletedEntities = await this.layerRepository.manager.transaction(async (manager) => {
            const count = await this.cleanupService.removeByLayerId(id, manager);
            await manager.getRepository(layer_entity_1.Layer).delete(id);
            return count;
        });
        return { deleted: true, deletedEntities };
    }
    async attachModel(id, file) {
        if (!file?.filename) {
            throw new common_1.BadRequestException('Model file is required');
        }
        const layer = await this.layerRepository.findOne({ where: { id } });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        const newModelUrl = `/uploads/models/${file.filename}`;
        return this.update(id, { modelUrl: newModelUrl });
    }
    async attachIcon(id, file) {
        if (!file?.filename) {
            throw new common_1.BadRequestException('Icon file is required');
        }
        const layer = await this.layerRepository.findOne({ where: { id } });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        try {
            const filePath = file.path;
            if (filePath) {
                const fileBuffer = await fs.promises.readFile(filePath);
                const ext = (0, path_1.extname)(file.originalname).toLowerCase();
                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                    const image = (0, sharp_1.default)(fileBuffer);
                    const metadata = await image.metadata();
                    if ((metadata.width && metadata.width > 1024) || (metadata.height && metadata.height > 1024)) {
                        image.resize(1024, 1024, {
                            fit: 'inside',
                            withoutEnlargement: true,
                        });
                    }
                    let compressedBuffer;
                    if (ext === '.png') {
                        compressedBuffer = await image.png({ quality: 80, compressionLevel: 8 }).toBuffer();
                    }
                    else {
                        compressedBuffer = await image.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
                    }
                    await fs.promises.writeFile(filePath, compressedBuffer);
                }
            }
        }
        catch (err) {
            this.logger.error('Failed to compress and optimize icon image:', err);
        }
        const newIconUrl = `/uploads/icons/${file.filename}`;
        return this.update(id, { iconUrl: newIconUrl });
    }
};
exports.LayersService = LayersService;
exports.LayersService = LayersService = LayersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(layer_entity_1.Layer)),
    __param(1, (0, typeorm_1.InjectRepository)(spatial_entity_entity_1.SpatialEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        geojson_downloader_service_1.GeoJsonDownloaderService,
        geojson_pipeline_service_1.GeoJsonPipelineService,
        spatial_entity_cleanup_service_1.SpatialEntityCleanupService])
], LayersService);

export { LayersService };
