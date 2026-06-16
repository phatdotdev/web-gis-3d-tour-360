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
var SpatialEntitiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpatialEntitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const spatial_entity_entity_1 = require("./entities/spatial-entity.entity");
const layer_entity_1 = require("../layers/entities/layer.entity");
const region_entity_1 = require("../regions/entities/region.entity");
const category_entity_1 = require("../categories/entities/category.entity");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const sharp_1 = __importDefault(require("sharp"));
const fs = __importStar(require("fs"));
const path_1 = require("path");
const spatial_entity_cleanup_service_1 = require("./spatial-entity-cleanup.service");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let SpatialEntitiesService = SpatialEntitiesService_1 = class SpatialEntitiesService {
    spatialEntityRepository;
    layerRepository;
    regionRepository;
    categoryRepository;
    mediaFileRepository;
    cleanupService;
    logger = new common_1.Logger(SpatialEntitiesService_1.name);
    constructor(spatialEntityRepository, layerRepository, regionRepository, categoryRepository, mediaFileRepository, cleanupService) {
        this.spatialEntityRepository = spatialEntityRepository;
        this.layerRepository = layerRepository;
        this.regionRepository = regionRepository;
        this.categoryRepository = categoryRepository;
        this.mediaFileRepository = mediaFileRepository;
        this.cleanupService = cleanupService;
    }
    async create(createSpatialEntityDto, actor) {
        const { layerId, regionId, categoryId, coverMediaId, ...data } = createSpatialEntityDto;
        const geometry = this.normalizeGeometry(data.geometry, data.longitude, data.latitude);
        const entity = this.spatialEntityRepository.create({
            ...data,
            createdBy: actor?.role === user_role_enum_1.UserRole.LocationManager
                ? actor.id
                : data.createdBy ?? actor?.id ?? null,
            updatedBy: actor?.id ?? data.updatedBy ?? null,
            geometry,
            location: this.normalizePoint(data.location, data.longitude, data.latitude),
        });
        entity.layer = layerId
            ? await this.findLayerOrThrow(layerId)
            : null;
        entity.region = regionId
            ? await this.findRegionOrThrow(regionId)
            : null;
        entity.category = categoryId
            ? await this.findCategoryOrThrow(categoryId)
            : null;
        const saved = await this.spatialEntityRepository.save(entity);
        return this.findOne(saved.id);
    }
    findAll(filters = {}) {
        const query = this.spatialEntityRepository
            .createQueryBuilder('entity')
            .leftJoin('entity.layer', 'layer')
            .addSelect([
            'layer.id',
            'layer.name',
            'layer.type',
            'layer.visible',
            'layer.minZoom',
            'layer.maxZoom',
            'layer.zIndex',
        ])
            .leftJoinAndSelect('entity.region', 'region')
            .leftJoinAndSelect('entity.category', 'category')
            .leftJoinAndSelect('entity.coverMedia', 'coverMedia');
        if (filters.layerId) {
            query.andWhere('layer.id = :layerId', { layerId: filters.layerId });
        }
        if (filters.regionId) {
            query.andWhere('region.id = :regionId', { regionId: filters.regionId });
        }
        if (filters.categoryId) {
            query.andWhere('category.id = :categoryId', {
                categoryId: filters.categoryId,
            });
        }
        if (filters.status) {
            query.andWhere('entity.status = :status', { status: filters.status });
        }
        if (filters.independent) {
            query.andWhere('layer.id IS NULL');
        }
        if (filters.ownerId) {
            query.andWhere('entity.createdBy = :ownerId', {
                ownerId: filters.ownerId,
            });
        }
        const bbox = this.parseBbox(filters.bbox);
        if (bbox) {
            query.andWhere('ST_Intersects(entity.geometry, ST_MakeEnvelope(:xmin, :ymin, :xmax, :ymax, 4326))', bbox);
        }
        return query.orderBy('entity.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const entity = await this.spatialEntityRepository
            .createQueryBuilder('entity')
            .leftJoin('entity.layer', 'layer')
            .addSelect([
            'layer.id',
            'layer.name',
            'layer.type',
            'layer.visible',
            'layer.minZoom',
            'layer.maxZoom',
            'layer.zIndex',
        ])
            .leftJoinAndSelect('entity.region', 'region')
            .leftJoinAndSelect('entity.category', 'category')
            .leftJoinAndSelect('entity.coverMedia', 'coverMedia')
            .where('entity.id = :id', { id })
            .getOne();
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        return entity;
    }
    findManaged(actor) {
        return this.findAll({ ownerId: actor.id });
    }
    async findManagedOne(id, actor) {
        const entity = await this.findOne(id);
        this.assertCanManage(entity, actor);
        return entity;
    }
    async update(id, updateSpatialEntityDto, actor) {
        const entity = await this.spatialEntityRepository.findOne({
            where: { id },
        });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        await this.applyOptionalRelations(entity, updateSpatialEntityDto);
        const { layerId, regionId, categoryId, coverMediaId, createdBy, updatedBy: _updatedBy, ...data } = updateSpatialEntityDto;
        if (actor?.role === user_role_enum_1.UserRole.Admin && createdBy !== undefined) {
            entity.createdBy = createdBy || null;
        }
        const longitude = data.longitude ?? entity.longitude;
        const latitude = data.latitude ?? entity.latitude;
        Object.assign(entity, {
            ...data,
            updatedBy: actor?.id ?? entity.updatedBy,
            geometry: data.geometry === undefined
                ? entity.geometry
                : this.normalizeGeometry(data.geometry, longitude, latitude),
            location: this.normalizePoint(data.location, longitude, latitude),
        });
        await this.spatialEntityRepository.save(entity);
        return this.findOne(id);
    }
    async remove(id, actor) {
        const entity = await this.spatialEntityRepository.findOne({
            where: { id },
        });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        if (actor)
            this.assertCanManage(entity, actor);
        await this.cleanupService.removeByIds([entity.id]);
        return { deleted: true };
    }
    assertCanManage(entity, actor) {
        if (actor.role === user_role_enum_1.UserRole.Admin)
            return;
        if (actor.role !== user_role_enum_1.UserRole.LocationManager ||
            entity.createdBy !== actor.id) {
            throw new common_1.ForbiddenException('Bạn không có quyền quản lý địa điểm này');
        }
    }
    async applyOptionalRelations(entity, dto) {
        if (dto.layerId !== undefined) {
            entity.layer = dto.layerId ? await this.findLayerOrThrow(dto.layerId) : null;
        }
        if (dto.regionId !== undefined) {
            entity.region = dto.regionId
                ? await this.findRegionOrThrow(dto.regionId)
                : null;
        }
        if (dto.categoryId !== undefined) {
            entity.category = dto.categoryId
                ? await this.findCategoryOrThrow(dto.categoryId)
                : null;
        }
        if (dto.coverMediaId !== undefined) {
            entity.coverMedia = dto.coverMediaId
                ? await this.findMediaFileOrThrow(dto.coverMediaId)
                : null;
        }
    }
    async findLayerOrThrow(id) {
        const layer = await this.layerRepository.findOne({ where: { id } });
        if (!layer) {
            throw new common_1.NotFoundException(`Layer ${id} not found`);
        }
        return layer;
    }
    async findRegionOrThrow(id) {
        const region = await this.regionRepository.findOne({ where: { id } });
        if (!region) {
            throw new common_1.NotFoundException(`Region ${id} not found`);
        }
        return region;
    }
    async findCategoryOrThrow(id) {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${id} not found`);
        }
        return category;
    }
    async findMediaFileOrThrow(id) {
        const mediaFile = await this.mediaFileRepository.findOne({ where: { id } });
        if (!mediaFile) {
            throw new common_1.NotFoundException(`MediaFile ${id} not found`);
        }
        return mediaFile;
    }
    createPointFromCoordinates(longitude, latitude) {
        if (!longitude || !latitude) {
            return undefined;
        }
        const lon = Number(longitude);
        const lat = Number(latitude);
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
            return undefined;
        }
        return {
            type: 'Point',
            coordinates: [lon, lat],
        };
    }
    normalizeGeometry(geometry, longitude, latitude) {
        const parsedGeometry = this.parseGeometry(geometry);
        if (parsedGeometry && this.isGeoJsonGeometry(parsedGeometry)) {
            return parsedGeometry;
        }
        const point = this.createPointFromCoordinates(longitude, latitude);
        if (point) {
            return point;
        }
        throw new common_1.BadRequestException('A valid GeoJSON geometry is required');
    }
    normalizePoint(location, longitude, latitude) {
        const parsedLocation = this.parseGeometry(location);
        if (parsedLocation?.type === 'Point' &&
            Array.isArray(parsedLocation.coordinates)) {
            return parsedLocation;
        }
        return this.createPointFromCoordinates(longitude, latitude);
    }
    parseGeometry(geometry) {
        if (typeof geometry === 'string') {
            try {
                return JSON.parse(geometry);
            }
            catch {
                return null;
            }
        }
        if (geometry && typeof geometry === 'object') {
            return geometry;
        }
        return null;
    }
    isGeoJsonGeometry(geometry) {
        const validTypes = new Set([
            'Point',
            'LineString',
            'Polygon',
            'MultiPoint',
            'MultiLineString',
            'MultiPolygon',
            'GeometryCollection',
        ]);
        if (!validTypes.has(geometry.type)) {
            return false;
        }
        return geometry.type === 'GeometryCollection'
            ? Array.isArray(geometry.geometries)
            : Array.isArray(geometry.coordinates);
    }
    parseBbox(bbox) {
        if (!bbox) {
            return null;
        }
        const values = bbox.split(',').map((value) => Number(value.trim()));
        if (values.length !== 4 || values.some((value) => !Number.isFinite(value))) {
            return null;
        }
        const [xmin, ymin, xmax, ymax] = values;
        return { xmin, ymin, xmax, ymax };
    }
    async attachModel(id, file, actor) {
        if (!file?.filename) {
            throw new common_1.BadRequestException('Model file is required');
        }
        const entity = await this.spatialEntityRepository.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        if (actor)
            this.assertCanManage(entity, actor);
        if (actor)
            this.assertCanManage(entity, actor);
        const newModelUrl = `/uploads/entities/models/${file.filename}`;
        return this.update(id, { assetUrl: newModelUrl }, actor);
    }
    async attachIcon(id, file, actor) {
        if (!file?.filename) {
            throw new common_1.BadRequestException('Icon file is required');
        }
        const entity = await this.spatialEntityRepository.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        if (actor)
            this.assertCanManage(entity, actor);
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
        const newIconUrl = `/uploads/entities/icons/${file.filename}`;
        return this.update(id, { iconUrl: newIconUrl }, actor);
    }
};
exports.SpatialEntitiesService = SpatialEntitiesService;
exports.SpatialEntitiesService = SpatialEntitiesService = SpatialEntitiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(spatial_entity_entity_1.SpatialEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(layer_entity_1.Layer)),
    __param(2, (0, typeorm_1.InjectRepository)(region_entity_1.Region)),
    __param(3, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(4, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        spatial_entity_cleanup_service_1.SpatialEntityCleanupService])
], SpatialEntitiesService);

export { SpatialEntitiesService };
