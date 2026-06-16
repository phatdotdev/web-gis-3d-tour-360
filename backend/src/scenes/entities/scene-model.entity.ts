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
exports.SceneModel = void 0;
const typeorm_1 = require("typeorm");
const scene_entity_1 = require("./scene.entity");
let SceneModel = class SceneModel {
    id;
    name;
    modelUrl;
    position;
    rotation;
    scale;
    settings;
    scene;
};
exports.SceneModel = SceneModel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SceneModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SceneModel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SceneModel.prototype, "modelUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SceneModel.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SceneModel.prototype, "rotation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], SceneModel.prototype, "scale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SceneModel.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scene_entity_1.Scene, (scene) => scene.models, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'scene_id' }),
    __metadata("design:type", scene_entity_1.Scene)
], SceneModel.prototype, "scene", void 0);
exports.SceneModel = SceneModel = __decorate([
    (0, typeorm_1.Entity)()
], SceneModel);

export { SceneModel };
