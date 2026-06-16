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
exports.PanoramasController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const create_panorama_dto_1 = require("./dto/create-panorama.dto");
const update_panorama_dto_1 = require("./dto/update-panorama.dto");
const panoramas_service_1 = require("./panoramas.service");
let PanoramasController = class PanoramasController {
    panoramasService;
    access;
    constructor(panoramasService, access) {
        this.panoramasService = panoramasService;
        this.access = access;
    }
    async create(dto, user) {
        await this.access.assertTour(dto.virtualTourId, user);
        return this.panoramasService.create(dto);
    }
    findAll(virtualTourId) {
        return this.panoramasService.findAll(virtualTourId);
    }
    findOne(id) {
        return this.panoramasService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertPanorama(id, user);
        if (dto.virtualTourId) {
            await this.access.assertTour(dto.virtualTourId, user);
        }
        return this.panoramasService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertPanorama(id, user);
        return this.panoramasService.remove(id);
    }
};
exports.PanoramasController = PanoramasController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_panorama_dto_1.CreatePanoramaDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PanoramasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('virtualTourId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PanoramasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PanoramasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_panorama_dto_1.UpdatePanoramaDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PanoramasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PanoramasController.prototype, "remove", null);
exports.PanoramasController = PanoramasController = __decorate([
    (0, common_1.Controller)('panoramas'),
    __metadata("design:paramtypes", [panoramas_service_1.PanoramasService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], PanoramasController);

export { PanoramasController };
