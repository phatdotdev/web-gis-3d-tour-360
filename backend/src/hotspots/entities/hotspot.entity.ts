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
exports.Hotspot = void 0;
const typeorm_1 = require("typeorm");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const panorama_entity_1 = require("../../panoramas/entities/panorama.entity");
let Hotspot = class Hotspot {
    id;
    panorama;
    type;
    title;
    description;
    yaw;
    pitch;
    targetPanorama;
    targetSceneId;
    media;
    externalUrl;
    content;
    icon;
    displayOrder;
    status;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
};
exports.Hotspot = Hotspot;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hotspot.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => panorama_entity_1.Panorama, (panorama) => panorama.hotspots, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'panorama_id' }),
    __metadata("design:type", panorama_entity_1.Panorama)
], Hotspot.prototype, "panorama", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Hotspot.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Hotspot.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3 }),
    __metadata("design:type", String)
], Hotspot.prototype, "yaw", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3 }),
    __metadata("design:type", String)
], Hotspot.prototype, "pitch", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => panorama_entity_1.Panorama, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'target_panorama_id' }),
    __metadata("design:type", Object)
], Hotspot.prototype, "targetPanorama", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_scene_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "targetSceneId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'media_id' }),
    __metadata("design:type", Object)
], Hotspot.prototype, "media", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "externalUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Hotspot.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: content_status_enum_1.ContentStatus.Draft }),
    __metadata("design:type", String)
], Hotspot.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Hotspot.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Hotspot.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Hotspot.prototype, "updatedAt", void 0);
exports.Hotspot = Hotspot = __decorate([
    (0, typeorm_1.Entity)({ name: 'hotspots' })
], Hotspot);

export { Hotspot };
