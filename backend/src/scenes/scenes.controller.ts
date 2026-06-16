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
exports.ScenesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const scenes_service_1 = require("./scenes.service");
const create_scene_for_entity_dto_1 = require("./dto/create-scene-for-entity.dto");
const create_scene_child_dto_1 = require("./dto/create-scene-child.dto");
const update_scene_dto_1 = require("./dto/update-scene.dto");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let ScenesController = class ScenesController {
    scenesService;
    access;
    constructor(scenesService, access) {
        this.scenesService = scenesService;
        this.access = access;
    }
    async createForEntity(dto, user) {
        await this.access.assertEntity(dto.entityId, user);
        return this.scenesService.createForEntity(dto);
    }
    async createChild(id, dto, user) {
        await this.access.assertScene(id, user);
        return this.scenesService.createChild(id, dto);
    }
    findByEntity(entityId) {
        return this.scenesService.findByEntity(entityId);
    }
    findOne(id) {
        return this.scenesService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertScene(id, user);
        return this.scenesService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertScene(id, user);
        return this.scenesService.remove(id);
    }
    uploadModel(file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        return {
            url: `/uploads/scenes/${file.filename}`,
        };
    }
};
exports.ScenesController = ScenesController;
__decorate([
    (0, common_1.Post)('entity'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scene_for_entity_dto_1.CreateSceneForEntityDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "createForEntity", null);
__decorate([
    (0, common_1.Post)(':id/children'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_scene_child_dto_1.CreateSceneChildDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "createChild", null);
__decorate([
    (0, common_1.Get)('entity/:entityId'),
    __param(0, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScenesController.prototype, "findByEntity", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScenesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_scene_dto_1.UpdateSceneDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ScenesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('upload-model'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', 'scenes');
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
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScenesController.prototype, "uploadModel", null);
exports.ScenesController = ScenesController = __decorate([
    (0, common_1.Controller)('scenes'),
    __metadata("design:paramtypes", [scenes_service_1.ScenesService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], ScenesController);

export { ScenesController };
