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
exports.PanoramasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const virtual_tour_entity_1 = require("../virtual-tours/entities/virtual-tour.entity");
const panorama_entity_1 = require("./entities/panorama.entity");
const panoramas_controller_1 = require("./panoramas.controller");
const panoramas_service_1 = require("./panoramas.service");
const auth_module_1 = require("../auth/auth.module");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
let PanoramasModule = class PanoramasModule {
};
exports.PanoramasModule = PanoramasModule;
exports.PanoramasModule = PanoramasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([panorama_entity_1.Panorama, virtual_tour_entity_1.VirtualTour, media_file_entity_1.MediaFile]), auth_module_1.AuthModule],
        controllers: [panoramas_controller_1.PanoramasController],
        providers: [panoramas_service_1.PanoramasService, managed_entity_access_service_1.ManagedEntityAccessService],
        exports: [panoramas_service_1.PanoramasService],
    })
], PanoramasModule);

export { PanoramasModule };
