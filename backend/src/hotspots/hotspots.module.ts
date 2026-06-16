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
exports.HotspotsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const panorama_entity_1 = require("../panoramas/entities/panorama.entity");
const hotspot_entity_1 = require("./entities/hotspot.entity");
const hotspots_controller_1 = require("./hotspots.controller");
const hotspots_service_1 = require("./hotspots.service");
const auth_module_1 = require("../auth/auth.module");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
let HotspotsModule = class HotspotsModule {
};
exports.HotspotsModule = HotspotsModule;
exports.HotspotsModule = HotspotsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hotspot_entity_1.Hotspot, panorama_entity_1.Panorama, media_file_entity_1.MediaFile]), auth_module_1.AuthModule],
        controllers: [hotspots_controller_1.HotspotsController],
        providers: [hotspots_service_1.HotspotsService, managed_entity_access_service_1.ManagedEntityAccessService],
        exports: [hotspots_service_1.HotspotsService],
    })
], HotspotsModule);

export { HotspotsModule };
