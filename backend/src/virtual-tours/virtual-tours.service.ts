// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualToursService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const panorama_entity_1 = require("../panoramas/entities/panorama.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const virtual_tour_entity_1 = require("./entities/virtual-tour.entity");
let VirtualToursService = class VirtualToursService {
    virtualTourRepository;
    spatialEntityRepository;
    mediaFileRepository;
    panoramaRepository;
    constructor(virtualTourRepository, spatialEntityRepository, mediaFileRepository, panoramaRepository) {
        this.virtualTourRepository = virtualTourRepository;
        this.spatialEntityRepository = spatialEntityRepository;
        this.mediaFileRepository = mediaFileRepository;
        this.panoramaRepository = panoramaRepository;
    }
    async create(dto) {
        const { spatialEntityId, thumbnailId, defaultPanoramaId, ...data } = dto;
        const tour = this.virtualTourRepository.create(data);
        tour.spatialEntity = await this.findSpatialEntityOrThrow(spatialEntityId);
        tour.thumbnail = thumbnailId ? await this.findMediaFileOrThrow(thumbnailId) : null;
        tour.defaultPanorama = defaultPanoramaId
            ? await this.findPanoramaOrThrow(defaultPanoramaId)
            : null;
        return this.virtualTourRepository.save(tour);
    }
    findAll(spatialEntityId) {
        return this.virtualTourRepository.find({
            where: spatialEntityId ? { spatialEntity: { id: spatialEntityId } } : {},
            relations: { spatialEntity: true, thumbnail: true, defaultPanorama: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const tour = await this.virtualTourRepository.findOne({
            where: { id },
            relations: {
                spatialEntity: true,
                thumbnail: true,
                defaultPanorama: true,
                panoramas: true,
            },
        });
        if (!tour) {
            throw new common_1.NotFoundException(`VirtualTour ${id} not found`);
        }
        return tour;
    }
    async update(id, dto) {
        const tour = await this.virtualTourRepository.findOne({ where: { id } });
        if (!tour) {
            throw new common_1.NotFoundException(`VirtualTour ${id} not found`);
        }
        const { spatialEntityId, thumbnailId, defaultPanoramaId, ...data } = dto;
        Object.assign(tour, data);
        if (spatialEntityId !== undefined) {
            tour.spatialEntity = await this.findSpatialEntityOrThrow(spatialEntityId);
        }
        if (thumbnailId !== undefined) {
            tour.thumbnail = thumbnailId ? await this.findMediaFileOrThrow(thumbnailId) : null;
        }
        if (defaultPanoramaId !== undefined) {
            tour.defaultPanorama = defaultPanoramaId
                ? await this.findPanoramaOrThrow(defaultPanoramaId)
                : null;
        }
        await this.virtualTourRepository.save(tour);
        return this.findOne(id);
    }
    async remove(id) {
        const tour = await this.virtualTourRepository.findOne({ where: { id } });
        if (!tour) {
            throw new common_1.NotFoundException(`VirtualTour ${id} not found`);
        }
        await this.virtualTourRepository.remove(tour);
        return { deleted: true };
    }
    async findSpatialEntityOrThrow(id) {
        const entity = await this.spatialEntityRepository.findOne({ where: { id } });
        if (!entity) {
            throw new common_1.NotFoundException(`SpatialEntity ${id} not found`);
        }
        return entity;
    }
    async findMediaFileOrThrow(id) {
        const media = await this.mediaFileRepository.findOne({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`MediaFile ${id} not found`);
        }
        return media;
    }
    async findPanoramaOrThrow(id) {
        const panorama = await this.panoramaRepository.findOne({ where: { id } });
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama ${id} not found`);
        }
        return panorama;
    }
};
exports.VirtualToursService = VirtualToursService;
exports.VirtualToursService = VirtualToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(virtual_tour_entity_1.VirtualTour)),
    __param(1, (0, typeorm_1.InjectRepository)(spatial_entity_entity_1.SpatialEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __param(3, (0, typeorm_1.InjectRepository)(panorama_entity_1.Panorama)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], VirtualToursService);

export { VirtualToursService };
