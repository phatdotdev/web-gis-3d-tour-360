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
exports.MediaFilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const content_status_enum_1 = require("../common/enums/content-status.enum");
const media_file_entity_1 = require("./entities/media-file.entity");
let MediaFilesService = class MediaFilesService {
    mediaFileRepository;
    constructor(mediaFileRepository) {
        this.mediaFileRepository = mediaFileRepository;
    }
    create(dto) {
        const mediaFile = this.mediaFileRepository.create({
            ...dto,
            storageProvider: dto.storageProvider ?? content_status_enum_1.StorageProvider.Minio,
        });
        return this.mediaFileRepository.save(mediaFile);
    }
    findAll(ownerType, ownerId, mediaType) {
        const where = {};
        if (ownerType)
            where.ownerType = ownerType;
        if (ownerId)
            where.ownerId = ownerId;
        if (mediaType)
            where.mediaType = mediaType;
        return this.mediaFileRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const mediaFile = await this.mediaFileRepository.findOne({ where: { id } });
        if (!mediaFile) {
            throw new common_1.NotFoundException(`MediaFile ${id} not found`);
        }
        return mediaFile;
    }
    async update(id, dto) {
        const mediaFile = await this.findOne(id);
        Object.assign(mediaFile, dto);
        return this.mediaFileRepository.save(mediaFile);
    }
    async remove(id) {
        const mediaFile = await this.findOne(id);
        await this.mediaFileRepository.remove(mediaFile);
        return { deleted: true };
    }
};
exports.MediaFilesService = MediaFilesService;
exports.MediaFilesService = MediaFilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_file_entity_1.MediaFile)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MediaFilesService);

export { MediaFilesService };
