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
exports.HotspotsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const create_hotspot_dto_1 = require("./dto/create-hotspot.dto");
const update_hotspot_dto_1 = require("./dto/update-hotspot.dto");
const hotspots_service_1 = require("./hotspots.service");
let HotspotsController = class HotspotsController {
    hotspotsService;
    access;
    constructor(hotspotsService, access) {
        this.hotspotsService = hotspotsService;
        this.access = access;
    }
    async create(dto, user) {
        await this.access.assertPanorama(dto.panoramaId, user);
        if (dto.targetPanoramaId) {
            await this.access.assertPanorama(dto.targetPanoramaId, user);
        }
        if (dto.targetSceneId) {
            await this.access.assertScene(dto.targetSceneId, user);
        }
        return this.hotspotsService.create(dto);
    }
    findAll(panoramaId) {
        return this.hotspotsService.findAll(panoramaId);
    }
    findOne(id) {
        return this.hotspotsService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertHotspot(id, user);
        if (dto.panoramaId) {
            await this.access.assertPanorama(dto.panoramaId, user);
        }
        if (dto.targetPanoramaId) {
            await this.access.assertPanorama(dto.targetPanoramaId, user);
        }
        if (dto.targetSceneId) {
            await this.access.assertScene(dto.targetSceneId, user);
        }
        return this.hotspotsService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertHotspot(id, user);
        return this.hotspotsService.remove(id);
    }
};
exports.HotspotsController = HotspotsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hotspot_dto_1.CreateHotspotDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HotspotsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('panoramaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hotspot_dto_1.UpdateHotspotDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HotspotsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], HotspotsController.prototype, "remove", null);
exports.HotspotsController = HotspotsController = __decorate([
    (0, common_1.Controller)('hotspots'),
    __metadata("design:paramtypes", [hotspots_service_1.HotspotsService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], HotspotsController);

export { HotspotsController };
