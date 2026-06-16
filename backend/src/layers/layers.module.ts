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
exports.LayersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const layers_service_1 = require("./layers.service");
const layers_controller_1 = require("./layers.controller");
const layer_entity_1 = require("./entities/layer.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const geojson_downloader_service_1 = require("./services/geojson-downloader.service");
const geojson_parser_service_1 = require("./services/geojson-parser.service");
const geometry_validator_service_1 = require("./services/geometry-validator.service");
const feature_processor_service_1 = require("./services/feature-processor.service");
const render_data_generator_service_1 = require("./services/render-data-generator.service");
const geojson_pipeline_service_1 = require("./services/geojson-pipeline.service");
const spatial_entity_cleanup_service_1 = require("../spatial-entities/spatial-entity-cleanup.service");
const auth_module_1 = require("../auth/auth.module");
let LayersModule = class LayersModule {
};
exports.LayersModule = LayersModule;
exports.LayersModule = LayersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([layer_entity_1.Layer, spatial_entity_entity_1.SpatialEntity]), auth_module_1.AuthModule],
        controllers: [layers_controller_1.LayersController],
        providers: [
            layers_service_1.LayersService,
            geojson_downloader_service_1.GeoJsonDownloaderService,
            geojson_parser_service_1.GeoJsonParserService,
            geometry_validator_service_1.GeometryValidatorService,
            feature_processor_service_1.FeatureProcessorService,
            render_data_generator_service_1.RenderDataGeneratorService,
            geojson_pipeline_service_1.GeoJsonPipelineService,
            spatial_entity_cleanup_service_1.SpatialEntityCleanupService,
        ],
    })
], LayersModule);

export { LayersModule };
