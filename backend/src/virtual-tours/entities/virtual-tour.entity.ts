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
exports.VirtualTour = void 0;
const typeorm_1 = require("typeorm");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const panorama_entity_1 = require("../../panoramas/entities/panorama.entity");
const spatial_entity_entity_1 = require("../../spatial-entities/entities/spatial-entity.entity");
let VirtualTour = class VirtualTour {
    id;
    spatialEntity;
    title;
    description;
    thumbnail;
    defaultPanorama;
    status;
    createdBy;
    updatedBy;
    createdAt;
    updatedAt;
    panoramas;
};
exports.VirtualTour = VirtualTour;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VirtualTour.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => spatial_entity_entity_1.SpatialEntity, (entity) => entity.virtualTours, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'spatial_entity_id' }),
    __metadata("design:type", spatial_entity_entity_1.SpatialEntity)
], VirtualTour.prototype, "spatialEntity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 250 }),
    __metadata("design:type", String)
], VirtualTour.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], VirtualTour.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'thumbnail_id' }),
    __metadata("design:type", Object)
], VirtualTour.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => panorama_entity_1.Panorama, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'default_panorama_id' }),
    __metadata("design:type", Object)
], VirtualTour.prototype, "defaultPanorama", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: content_status_enum_1.ContentStatus.Draft }),
    __metadata("design:type", String)
], VirtualTour.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], VirtualTour.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], VirtualTour.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], VirtualTour.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], VirtualTour.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => panorama_entity_1.Panorama, (panorama) => panorama.virtualTour),
    __metadata("design:type", Array)
], VirtualTour.prototype, "panoramas", void 0);
exports.VirtualTour = VirtualTour = __decorate([
    (0, typeorm_1.Entity)({ name: 'virtual_tours' })
], VirtualTour);

export { VirtualTour };
