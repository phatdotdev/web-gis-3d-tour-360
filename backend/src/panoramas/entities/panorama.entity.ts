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
exports.Panorama = void 0;
const typeorm_1 = require("typeorm");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const hotspot_entity_1 = require("../../hotspots/entities/hotspot.entity");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const virtual_tour_entity_1 = require("../../virtual-tours/entities/virtual-tour.entity");
let Panorama = class Panorama {
    id;
    virtualTour;
    title;
    description;
    panoramaImage;
    thumbnail;
    displayOrder;
    initialYaw;
    initialPitch;
    initialFov;
    status;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    hotspots;
};
exports.Panorama = Panorama;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Panorama.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => virtual_tour_entity_1.VirtualTour, (tour) => tour.panoramas, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'virtual_tour_id' }),
    __metadata("design:type", virtual_tour_entity_1.VirtualTour)
], Panorama.prototype, "virtualTour", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], Panorama.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'panorama_image_id' }),
    __metadata("design:type", media_file_entity_1.MediaFile)
], Panorama.prototype, "panoramaImage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'thumbnail_id' }),
    __metadata("design:type", Object)
], Panorama.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Panorama.prototype, "displayOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3, nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "initialYaw", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3, nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "initialPitch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 8, scale: 3, nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "initialFov", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: content_status_enum_1.ContentStatus.Draft }),
    __metadata("design:type", String)
], Panorama.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Panorama.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Panorama.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Panorama.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hotspot_entity_1.Hotspot, (hotspot) => hotspot.panorama),
    __metadata("design:type", Array)
], Panorama.prototype, "hotspots", void 0);
exports.Panorama = Panorama = __decorate([
    (0, typeorm_1.Entity)({ name: 'panoramas' })
], Panorama);

export { Panorama };
