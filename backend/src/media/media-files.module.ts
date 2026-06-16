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
exports.MediaFilesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_file_entity_1 = require("./entities/media-file.entity");
const media_files_controller_1 = require("./media-files.controller");
const media_files_service_1 = require("./media-files.service");
const storage_module_1 = require("../storage/storage.module");
const auth_module_1 = require("../auth/auth.module");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
let MediaFilesModule = class MediaFilesModule {
};
exports.MediaFilesModule = MediaFilesModule;
exports.MediaFilesModule = MediaFilesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([media_file_entity_1.MediaFile]), storage_module_1.StorageModule, auth_module_1.AuthModule],
        controllers: [media_files_controller_1.MediaFilesController],
        providers: [media_files_service_1.MediaFilesService, managed_entity_access_service_1.ManagedEntityAccessService],
        exports: [media_files_service_1.MediaFilesService],
    })
], MediaFilesModule);

export { MediaFilesModule };
