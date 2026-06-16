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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpatialEntitiesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const spatial_entities_service_1 = require("./spatial-entities.service");
const create_spatial_entity_dto_1 = require("./dto/create-spatial-entity.dto");
const update_spatial_entity_dto_1 = require("./dto/update-spatial-entity.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let SpatialEntitiesController = class SpatialEntitiesController {
    spatialEntitiesService;
    constructor(spatialEntitiesService) {
        this.spatialEntitiesService = spatialEntitiesService;
    }
    create(createSpatialEntityDto, user) {
        return this.spatialEntitiesService.create(createSpatialEntityDto, user);
    }
    findManaged(user) {
        return this.spatialEntitiesService.findManaged(user);
    }
    findManagedOne(id, user) {
        return this.spatialEntitiesService.findManagedOne(id, user);
    }
    findAll(layerId, regionId, categoryId, status, independent, bbox) {
        return this.spatialEntitiesService.findAll({
            layerId,
            regionId,
            categoryId,
            status,
            independent: independent === 'true',
            bbox,
        });
    }
    findOne(id) {
        return this.spatialEntitiesService.findOne(id);
    }
    update(id, updateSpatialEntityDto, user) {
        return this.spatialEntitiesService.update(id, updateSpatialEntityDto, user);
    }
    remove(id, user) {
        return this.spatialEntitiesService.remove(id, user);
    }
    uploadModel(id, file, user) {
        return this.spatialEntitiesService.attachModel(id, file, user);
    }
    uploadIcon(id, file, user) {
        return this.spatialEntitiesService.attachIcon(id, file, user);
    }
};
exports.SpatialEntitiesController = SpatialEntitiesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_spatial_entity_dto_1.CreateSpatialEntityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('managed'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "findManaged", null);
__decorate([
    (0, common_1.Get)('managed/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "findManagedOne", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('layerId')),
    __param(1, (0, common_1.Query)('regionId')),
    __param(2, (0, common_1.Query)('categoryId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('independent')),
    __param(5, (0, common_1.Query)('bbox')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_spatial_entity_dto_1.UpdateSpatialEntityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-model'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', 'entities', 'models');
                (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                const extension = (0, path_1.extname)(file.originalname).toLowerCase();
                const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
                cb(null, safeName);
            },
        }),
        fileFilter: (_req, file, cb) => {
            const extension = (0, path_1.extname)(file.originalname).toLowerCase();
            if (extension === '.glb' || extension === '.gltf') {
                cb(null, true);
                return;
            }
            cb(new common_1.BadRequestException('Only .glb or .gltf files are allowed'), false);
        },
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "uploadModel", null);
__decorate([
    (0, common_1.Post)(':id/upload-icon'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', 'entities', 'icons');
                (0, fs_1.mkdirSync)(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (_req, file, cb) => {
                const extension = (0, path_1.extname)(file.originalname).toLowerCase();
                const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
                cb(null, safeName);
            },
        }),
        fileFilter: (_req, file, cb) => {
            const extension = (0, path_1.extname)(file.originalname).toLowerCase();
            if (extension === '.png' ||
                extension === '.jpg' ||
                extension === '.jpeg' ||
                extension === '.svg') {
                cb(null, true);
                return;
            }
            cb(new common_1.BadRequestException('Only .png, .jpg, .jpeg, .svg files are allowed'), false);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], SpatialEntitiesController.prototype, "uploadIcon", null);
exports.SpatialEntitiesController = SpatialEntitiesController = __decorate([
    (0, common_1.Controller)('spatial-entities'),
    __metadata("design:paramtypes", [spatial_entities_service_1.SpatialEntitiesService])
], SpatialEntitiesController);

export { SpatialEntitiesController };
