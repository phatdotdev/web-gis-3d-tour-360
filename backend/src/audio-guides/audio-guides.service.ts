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
exports.AudioGuidesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const audio_guide_entity_1 = require("./entities/audio-guide.entity");
let AudioGuidesService = class AudioGuidesService {
    audioGuideRepository;
    spatialEntityRepository;
    mediaFileRepository;
    constructor(audioGuideRepository, spatialEntityRepository, mediaFileRepository) {
        this.audioGuideRepository = audioGuideRepository;
        this.spatialEntityRepository = spatialEntityRepository;
        this.mediaFileRepository = mediaFileRepository;
    }
    async create(dto) {
        const { spatialEntityId, mediaId, ...data } = dto;
        const audioGuide = this.audioGuideRepository.create({
            ...data,
            languageCode: dto.languageCode ?? 'vi',
        });
        audioGuide.spatialEntity = spatialEntityId
            ? await this.findSpatialEntityOrThrow(spatialEntityId)
            : null;
        audioGuide.media = await this.findMediaFileOrThrow(mediaId);
        return this.audioGuideRepository.save(audioGuide);
    }
    findAll(spatialEntityId, targetType, targetId) {
        const where = {};
        if (spatialEntityId) {
            where.spatialEntity = { id: spatialEntityId };
        }
        if (targetType) {
            where.targetType = targetType;
        }
        if (targetId) {
            where.targetId = targetId;
        }
        return this.audioGuideRepository.find({
            where,
            relations: { spatialEntity: true, media: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const audioGuide = await this.audioGuideRepository.findOne({
            where: { id },
            relations: { spatialEntity: true, media: true },
        });
        if (!audioGuide) {
            throw new common_1.NotFoundException(`AudioGuide ${id} not found`);
        }
        return audioGuide;
    }
    async update(id, dto) {
        const audioGuide = await this.audioGuideRepository.findOne({ where: { id } });
        if (!audioGuide) {
            throw new common_1.NotFoundException(`AudioGuide ${id} not found`);
        }
        const { spatialEntityId, mediaId, ...data } = dto;
        Object.assign(audioGuide, data);
        if (spatialEntityId !== undefined) {
            audioGuide.spatialEntity = spatialEntityId
                ? await this.findSpatialEntityOrThrow(spatialEntityId)
                : null;
        }
        if (mediaId !== undefined) {
            audioGuide.media = await this.findMediaFileOrThrow(mediaId);
        }
        await this.audioGuideRepository.save(audioGuide);
        return this.findOne(id);
    }
    async remove(id) {
        const audioGuide = await this.audioGuideRepository.findOne({ where: { id } });
        if (!audioGuide) {
            throw new common_1.NotFoundException(`AudioGuide ${id} not found`);
        }
        await this.audioGuideRepository.remove(audioGuide);
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
};
exports.AudioGuidesService = AudioGuidesService;
exports.AudioGuidesService = AudioGuidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audio_guide_entity_1.AudioGuide)),
    __param(1, (0, typeorm_1.InjectRepository)(spatial_entity_entity_1.SpatialEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AudioGuidesService);

export { AudioGuidesService };
