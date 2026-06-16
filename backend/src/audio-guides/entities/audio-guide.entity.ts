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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioGuide = void 0;
const typeorm_1 = require("typeorm");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const spatial_entity_entity_1 = require("../../spatial-entities/entities/spatial-entity.entity");
let AudioGuide = class AudioGuide {
    id;
    spatialEntity;
    title;
    transcript;
    media;
    languageCode;
    targetType;
    targetId;
    duration;
    status;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
};
exports.AudioGuide = AudioGuide;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AudioGuide.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => spatial_entity_entity_1.SpatialEntity, (entity) => entity.audioGuides, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'spatial_entity_id' }),
    __metadata("design:type", Object)
], AudioGuide.prototype, "spatialEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], AudioGuide.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AudioGuide.prototype, "transcript", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'media_id' }),
    __metadata("design:type", media_file_entity_1.MediaFile)
], AudioGuide.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'vi' }),
    __metadata("design:type", String)
], AudioGuide.prototype, "languageCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: content_status_enum_1.AudioTargetType.SpatialEntity }),
    __metadata("design:type", String)
], AudioGuide.prototype, "targetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AudioGuide.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], AudioGuide.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: content_status_enum_1.ContentStatus.Draft }),
    __metadata("design:type", String)
], AudioGuide.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AudioGuide.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], AudioGuide.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AudioGuide.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AudioGuide.prototype, "updatedAt", void 0);
exports.AudioGuide = AudioGuide = __decorate([
    (0, typeorm_1.Entity)({ name: 'audio_guides' }),
    (0, typeorm_1.Index)(['targetType', 'targetId'])
], AudioGuide);

export { AudioGuide };
