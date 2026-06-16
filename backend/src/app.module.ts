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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const audio_guide_entity_1 = require("./audio-guides/entities/audio-guide.entity");
const audio_guides_module_1 = require("./audio-guides/audio-guides.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const category_entity_1 = require("./categories/entities/category.entity");
const categories_module_1 = require("./categories/categories.module");
const hotspot_entity_1 = require("./hotspots/entities/hotspot.entity");
const hotspots_module_1 = require("./hotspots/hotspots.module");
const layers_module_1 = require("./layers/layers.module");
const spatial_entities_module_1 = require("./spatial-entities/spatial-entities.module");
const layer_entity_1 = require("./layers/entities/layer.entity");
const media_file_entity_1 = require("./media/entities/media-file.entity");
const media_files_module_1 = require("./media/media-files.module");
const panorama_entity_1 = require("./panoramas/entities/panorama.entity");
const panoramas_module_1 = require("./panoramas/panoramas.module");
const region_entity_1 = require("./regions/entities/region.entity");
const regions_module_1 = require("./regions/regions.module");
const spatial_entity_entity_1 = require("./spatial-entities/entities/spatial-entity.entity");
const scenes_module_1 = require("./scenes/scenes.module");
const scene_entity_1 = require("./scenes/entities/scene.entity");
const scene_model_entity_1 = require("./scenes/entities/scene-model.entity");
const storage_config_1 = require("./storage/storage.config");
const virtual_tour_entity_1 = require("./virtual-tours/entities/virtual-tour.entity");
const virtual_tours_module_1 = require("./virtual-tours/virtual-tours.module");
const user_entity_1 = require("./users/entities/user.entity");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [storage_config_1.storageConfig] }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [
                    layer_entity_1.Layer,
                    spatial_entity_entity_1.SpatialEntity,
                    scene_entity_1.Scene,
                    scene_model_entity_1.SceneModel,
                    region_entity_1.Region,
                    category_entity_1.Category,
                    media_file_entity_1.MediaFile,
                    virtual_tour_entity_1.VirtualTour,
                    panorama_entity_1.Panorama,
                    hotspot_entity_1.Hotspot,
                    audio_guide_entity_1.AudioGuide,
                    user_entity_1.User,
                ],
                synchronize: true,
            }),
            layers_module_1.LayersModule,
            spatial_entities_module_1.SpatialEntitiesModule,
            scenes_module_1.ScenesModule,
            regions_module_1.RegionsModule,
            categories_module_1.CategoriesModule,
            media_files_module_1.MediaFilesModule,
            virtual_tours_module_1.VirtualToursModule,
            panoramas_module_1.PanoramasModule,
            hotspots_module_1.HotspotsModule,
            audio_guides_module_1.AudioGuidesModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);

export { AppModule };
