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
exports.Layer = void 0;
const typeorm_1 = require("typeorm");
const spatial_entity_entity_1 = require("../../spatial-entities/entities/spatial-entity.entity");
let Layer = class Layer {
    id;
    name;
    type;
    visible;
    minZoom;
    maxZoom;
    zIndex;
    metadata;
    elevation;
    scale;
    height;
    extent;
    renderCache;
    modelUrl;
    iconUrl;
    dataUrl;
    entities;
};
exports.Layer = Layer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Layer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Layer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Layer.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Layer.prototype, "visible", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Layer.prototype, "minZoom", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 24 }),
    __metadata("design:type", Number)
], Layer.prototype, "maxZoom", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Layer.prototype, "zIndex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 0 }),
    __metadata("design:type", Number)
], Layer.prototype, "elevation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 1 }),
    __metadata("design:type", Number)
], Layer.prototype, "scale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', default: 0 }),
    __metadata("design:type", Number)
], Layer.prototype, "height", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "extent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "renderCache", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "modelUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "iconUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Layer.prototype, "dataUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => spatial_entity_entity_1.SpatialEntity, (entity) => entity.layer),
    __metadata("design:type", Array)
], Layer.prototype, "entities", void 0);
exports.Layer = Layer = __decorate([
    (0, typeorm_1.Entity)()
], Layer);

export { Layer };
