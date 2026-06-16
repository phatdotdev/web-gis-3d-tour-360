// Recovered from backend/dist compiled output because the original source was deleted.
// @ts-nocheck
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const scenes_service_1 = require("./scenes.service");
const scenes_controller_1 = require("./scenes.controller");
const scene_entity_1 = require("./entities/scene.entity");
const scene_model_entity_1 = require("./entities/scene-model.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const auth_module_1 = require("../auth/auth.module");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
let ScenesModule = class ScenesModule {
};
exports.ScenesModule = ScenesModule;
exports.ScenesModule = ScenesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([scene_entity_1.Scene, scene_model_entity_1.SceneModel, spatial_entity_entity_1.SpatialEntity]), auth_module_1.AuthModule],
        controllers: [scenes_controller_1.ScenesController],
        providers: [scenes_service_1.ScenesService, managed_entity_access_service_1.ManagedEntityAccessService],
    })
], ScenesModule);

export { ScenesModule };
