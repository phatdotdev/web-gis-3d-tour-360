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
exports.HotspotsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const panorama_entity_1 = require("../panoramas/entities/panorama.entity");
const hotspot_entity_1 = require("./entities/hotspot.entity");
let HotspotsService = class HotspotsService {
    hotspotRepository;
    panoramaRepository;
    mediaFileRepository;
    constructor(hotspotRepository, panoramaRepository, mediaFileRepository) {
        this.hotspotRepository = hotspotRepository;
        this.panoramaRepository = panoramaRepository;
        this.mediaFileRepository = mediaFileRepository;
    }
    async create(dto) {
        const { panoramaId, targetPanoramaId, mediaId, content, ...data } = dto;
        await this.validateContentMedia(content);
        const hotspot = this.hotspotRepository.create({
            ...data,
            content: content ?? null,
            displayOrder: dto.displayOrder ?? 0,
        });
        hotspot.panorama = await this.findPanoramaOrThrow(panoramaId);
        hotspot.targetPanorama = targetPanoramaId
            ? await this.findPanoramaOrThrow(targetPanoramaId)
            : null;
        hotspot.media = mediaId ? await this.findMediaFileOrThrow(mediaId) : null;
        return this.hotspotRepository.save(hotspot);
    }
    findAll(panoramaId) {
        return this.hotspotRepository.find({
            where: panoramaId ? { panorama: { id: panoramaId } } : {},
            relations: { panorama: true, targetPanorama: true, media: true },
            order: { displayOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async findOne(id) {
        const hotspot = await this.hotspotRepository.findOne({
            where: { id },
            relations: { panorama: true, targetPanorama: true, media: true },
        });
        if (!hotspot) {
            throw new common_1.NotFoundException(`Hotspot ${id} not found`);
        }
        return hotspot;
    }
    async update(id, dto) {
        const hotspot = await this.hotspotRepository.findOne({ where: { id } });
        if (!hotspot) {
            throw new common_1.NotFoundException(`Hotspot ${id} not found`);
        }
        const { panoramaId, targetPanoramaId, mediaId, content, ...data } = dto;
        if (content !== undefined) {
            await this.validateContentMedia(content);
        }
        Object.assign(hotspot, data);
        if (content !== undefined) {
            hotspot.content = content;
        }
        if (panoramaId !== undefined) {
            hotspot.panorama = await this.findPanoramaOrThrow(panoramaId);
        }
        if (targetPanoramaId !== undefined) {
            hotspot.targetPanorama = targetPanoramaId
                ? await this.findPanoramaOrThrow(targetPanoramaId)
                : null;
        }
        if (mediaId !== undefined) {
            hotspot.media = mediaId ? await this.findMediaFileOrThrow(mediaId) : null;
        }
        await this.hotspotRepository.save(hotspot);
        return this.findOne(id);
    }
    async remove(id) {
        const hotspot = await this.hotspotRepository.findOne({ where: { id } });
        if (!hotspot) {
            throw new common_1.NotFoundException(`Hotspot ${id} not found`);
        }
        await this.hotspotRepository.remove(hotspot);
        return { deleted: true };
    }
    async findPanoramaOrThrow(id) {
        const panorama = await this.panoramaRepository.findOne({ where: { id } });
        if (!panorama) {
            throw new common_1.NotFoundException(`Panorama ${id} not found`);
        }
        return panorama;
    }
    async findMediaFileOrThrow(id) {
        const media = await this.mediaFileRepository.findOne({ where: { id } });
        if (!media) {
            throw new common_1.NotFoundException(`MediaFile ${id} not found`);
        }
        return media;
    }
    async validateContentMedia(content) {
        const mediaIds = [...new Set(content?.mediaIds ?? [])];
        if (mediaIds.length === 0)
            return;
        const count = await this.mediaFileRepository
            .createQueryBuilder('media')
            .where('media.id IN (:...mediaIds)', { mediaIds })
            .getCount();
        if (count !== mediaIds.length) {
            throw new common_1.NotFoundException('One or more hotspot media files were not found');
        }
    }
};
exports.HotspotsService = HotspotsService;
exports.HotspotsService = HotspotsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotspot_entity_1.Hotspot)),
    __param(1, (0, typeorm_1.InjectRepository)(panorama_entity_1.Panorama)),
    __param(2, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HotspotsService);

export { HotspotsService };
