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
exports.SpatialEntity = void 0;
const typeorm_1 = require("typeorm");
const audio_guide_entity_1 = require("../../audio-guides/entities/audio-guide.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
const content_status_enum_1 = require("../../common/enums/content-status.enum");
const layer_entity_1 = require("../../layers/entities/layer.entity");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const region_entity_1 = require("../../regions/entities/region.entity");
const scene_entity_1 = require("../../scenes/entities/scene.entity");
const virtual_tour_entity_1 = require("../../virtual-tours/entities/virtual-tour.entity");
let SpatialEntity = class SpatialEntity {
    id;
    name;
    slug;
    type;
    objectKind;
    renderType;
    geometry;
    location;
    latitude;
    longitude;
    elevation;
    height;
    width;
    assetUrl;
    iconUrl;
    color;
    opacity;
    shortDescription;
    fullDescription;
    address;
    openingHours;
    ticketPrice;
    contactPhone;
    contactEmail;
    websiteUrl;
    facebookUrl;
    hasVirtualTour;
    hasAudioGuide;
    has3dModel;
    status;
    createdBy;
    updatedBy;
    metadata;
    layer;
    layerId;
    region;
    regionId;
    category;
    categoryId;
    coverMedia;
    coverMediaId;
    scene;
    virtualTours;
    audioGuides;
    createdAt;
    updatedAt;
};
exports.SpatialEntity = SpatialEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SpatialEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, default: 'generic_place' }),
    __metadata("design:type", String)
], SpatialEntity.prototype, "objectKind", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "renderType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'geometry', spatialFeatureType: 'Geometry', srid: 4326 }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "geometry", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 7, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 0 }),
    __metadata("design:type", Number)
], SpatialEntity.prototype, "elevation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 0 }),
    __metadata("design:type", Number)
], SpatialEntity.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 1 }),
    __metadata("design:type", Number)
], SpatialEntity.prototype, "width", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "assetUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 1 }),
    __metadata("design:type", Number)
], SpatialEntity.prototype, "opacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "shortDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "fullDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "openingHours", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "ticketPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "websiteUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "facebookUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SpatialEntity.prototype, "hasVirtualTour", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SpatialEntity.prototype, "hasAudioGuide", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], SpatialEntity.prototype, "has3dModel", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: content_status_enum_1.ContentStatus.Draft }),
    __metadata("design:type", String)
], SpatialEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => layer_entity_1.Layer, (layer) => layer.entities, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'layer_id' }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "layer", void 0);
__decorate([
    (0, typeorm_1.RelationId)((entity) => entity.layer),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "layerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => region_entity_1.Region, (region) => region.entities, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'region_id' }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.RelationId)((entity) => entity.region),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.entities, {
        nullable: true,
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.RelationId)((entity) => entity.category),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => media_file_entity_1.MediaFile, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'cover_media_id' }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "coverMedia", void 0);
__decorate([
    (0, typeorm_1.RelationId)((entity) => entity.coverMedia),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "coverMediaId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => scene_entity_1.Scene, (scene) => scene.entity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'scene_id' }),
    __metadata("design:type", Object)
], SpatialEntity.prototype, "scene", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => virtual_tour_entity_1.VirtualTour, (tour) => tour.spatialEntity),
    __metadata("design:type", Array)
], SpatialEntity.prototype, "virtualTours", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audio_guide_entity_1.AudioGuide, (audioGuide) => audioGuide.spatialEntity),
    __metadata("design:type", Array)
], SpatialEntity.prototype, "audioGuides", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SpatialEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SpatialEntity.prototype, "updatedAt", void 0);
exports.SpatialEntity = SpatialEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'spatial_entity' }),
    (0, typeorm_1.Index)(['latitude', 'longitude'])
], SpatialEntity);

export { SpatialEntity };
