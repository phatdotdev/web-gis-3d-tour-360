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
exports.AudioGuidesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const spatial_entity_entity_1 = require("../spatial-entities/entities/spatial-entity.entity");
const audio_guide_entity_1 = require("./entities/audio-guide.entity");
const audio_guides_controller_1 = require("./audio-guides.controller");
const audio_guides_service_1 = require("./audio-guides.service");
const auth_module_1 = require("../auth/auth.module");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
let AudioGuidesModule = class AudioGuidesModule {
};
exports.AudioGuidesModule = AudioGuidesModule;
exports.AudioGuidesModule = AudioGuidesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([audio_guide_entity_1.AudioGuide, spatial_entity_entity_1.SpatialEntity, media_file_entity_1.MediaFile]),
            auth_module_1.AuthModule,
        ],
        controllers: [audio_guides_controller_1.AudioGuidesController],
        providers: [audio_guides_service_1.AudioGuidesService, managed_entity_access_service_1.ManagedEntityAccessService],
        exports: [audio_guides_service_1.AudioGuidesService],
    })
], AudioGuidesModule);

export { AudioGuidesModule };
