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
exports.SpatialEntitiesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const spatial_entities_service_1 = require("./spatial-entities.service");
const spatial_entities_controller_1 = require("./spatial-entities.controller");
const spatial_entity_entity_1 = require("./entities/spatial-entity.entity");
const layer_entity_1 = require("../layers/entities/layer.entity");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const region_entity_1 = require("../regions/entities/region.entity");
const spatial_entity_cleanup_service_1 = require("./spatial-entity-cleanup.service");
const auth_module_1 = require("../auth/auth.module");
let SpatialEntitiesModule = class SpatialEntitiesModule {
};
exports.SpatialEntitiesModule = SpatialEntitiesModule;
exports.SpatialEntitiesModule = SpatialEntitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([spatial_entity_entity_1.SpatialEntity, layer_entity_1.Layer, region_entity_1.Region, category_entity_1.Category, media_file_entity_1.MediaFile]),
            auth_module_1.AuthModule,
        ],
        controllers: [spatial_entities_controller_1.SpatialEntitiesController],
        providers: [spatial_entities_service_1.SpatialEntitiesService, spatial_entity_cleanup_service_1.SpatialEntityCleanupService],
        exports: [spatial_entity_cleanup_service_1.SpatialEntityCleanupService],
    })
], SpatialEntitiesModule);

export { SpatialEntitiesModule };
