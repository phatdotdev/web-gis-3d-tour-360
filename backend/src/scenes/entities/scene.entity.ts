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
exports.Scene = void 0;
const typeorm_1 = require("typeorm");
const scene_model_entity_1 = require("./scene-model.entity");
const spatial_entity_entity_1 = require("../../spatial-entities/entities/spatial-entity.entity");
let Scene = class Scene {
    id;
    name;
    description;
    parent;
    children;
    cameraView;
    environment;
    transitionPoints;
    models;
    entity;
};
exports.Scene = Scene;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Scene.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Scene.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Scene.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Scene, (scene) => scene.children, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", Object)
], Scene.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Scene, (scene) => scene.parent),
    __metadata("design:type", Array)
], Scene.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Scene.prototype, "cameraView", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Scene.prototype, "environment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Scene.prototype, "transitionPoints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scene_model_entity_1.SceneModel, (model) => model.scene, { cascade: true }),
    __metadata("design:type", Array)
], Scene.prototype, "models", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => spatial_entity_entity_1.SpatialEntity, (entity) => entity.scene, {
        cascade: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'spatial_entity_id' }),
    __metadata("design:type", spatial_entity_entity_1.SpatialEntity)
], Scene.prototype, "entity", void 0);
exports.Scene = Scene = __decorate([
    (0, typeorm_1.Entity)()
], Scene);

export { Scene };
