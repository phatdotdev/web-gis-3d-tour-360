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
exports.PanoramasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const virtual_tour_entity_1 = require("../virtual-tours/entities/virtual-tour.entity");
const panorama_entity_1 = require("./entities/panorama.entity");
let PanoramasService = class PanoramasService {
    panoramaRepository;
    virtualTourRepository;
    mediaFileRepository;
    constructor(panoramaRepository, virtualTourRepository, mediaFileRepository) {
        this.panoramaRepository = panoramaRepository;
        this.virtualTourRepository = virtualTourRepository;
        this.mediaFileRepository = mediaFileRepository;
    }
    async create(dto) {
        const { virtualTourId, panoramaImageId, thumbnailId, ...data } = dto;
        const panorama = this.panoramaRepository.create({
            ...data,
            displayOrder: dto.displayOrder ?? 0,
        });
        panorama.virtualTour = await this.findVirtualTourOrThrow(virtualTourId);
        panorama.panoramaImage = await this.findMediaFileOrThrow(panoramaImageId);
        panorama.thumbnail = thumbnailId ? await this.findMediaFileOrThrow(thumbnailId) : null;
        return this.panoramaRepository.save(panorama);
    }
    findAll(virtualTourId) {
        return this.panoramaRepository.find({
            where: virtualTourId ? { virtualTour: { id: virtualTourId } } : {},
            relations: { virtualTour: true, panoramaImage: true, thumbnail: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const panorama = await this.panoramaRepository.findOne({
            where: { id },
            relations: {
                virtualTour: true,
                panoramaImage: true,
                thumbnail: true,
                hotspots: true,
            },
        });
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama ${id} not found`);
        }
        return panorama;
    }
    async update(id, dto) {
        const panorama = await this.panoramaRepository.findOne({ where: { id } });
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama ${id} not found`);
        }
        const { virtualTourId, panoramaImageId, thumbnailId, ...data } = dto;
        Object.assign(panorama, data);
        if (virtualTourId !== undefined) {
            panorama.virtualTour = await this.findVirtualTourOrThrow(virtualTourId);
        }
        if (panoramaImageId !== undefined) {
            panorama.panoramaImage = await this.findMediaFileOrThrow(panoramaImageId);
        }
        if (thumbnailId !== undefined) {
            panorama.thumbnail = thumbnailId ? await this.findMediaFileOrThrow(thumbnailId) : null;
        }
        await this.panoramaRepository.save(panorama);
        return this.findOne(id);
    }
    async remove(id) {
        const panorama = await this.panoramaRepository.findOne({ where: { id } });
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama ${id} not found`);
        }
        await this.panoramaRepository.remove(panorama);
        return { deleted: true };
    }
    async findVirtualTourOrThrow(id) {
        const tour = await this.virtualTourRepository.findOne({ where: { id } });
        if (!tour) {
            throw new common_1.NotFoundException(`VirtualTour ${id} not found`);
        }
        return tour;
    }
    async findMediaFileOrThrow(id) {
        const media = await this.mediaFileRepository.findOne({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`MediaFile ${id} not found`);
        }
        return media;
    }
};
exports.PanoramasService = PanoramasService;
exports.PanoramasService = PanoramasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(panorama_entity_1.Panorama)),
    __param(1, (0, typeorm_1.InjectRepository)(virtual_tour_entity_1.VirtualTour)),
    __param(2, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PanoramasService);

export { PanoramasService };
