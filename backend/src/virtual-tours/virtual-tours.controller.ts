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
exports.VirtualToursController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const create_virtual_tour_dto_1 = require("./dto/create-virtual-tour.dto");
const update_virtual_tour_dto_1 = require("./dto/update-virtual-tour.dto");
const virtual_tours_service_1 = require("./virtual-tours.service");
let VirtualToursController = class VirtualToursController {
    virtualToursService;
    access;
    constructor(virtualToursService, access) {
        this.virtualToursService = virtualToursService;
        this.access = access;
    }
    async create(dto, user) {
        await this.access.assertEntity(dto.spatialEntityId, user);
        return this.virtualToursService.create(dto);
    }
    findAll(spatialEntityId) {
        return this.virtualToursService.findAll(spatialEntityId);
    }
    findOne(id) {
        return this.virtualToursService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertTour(id, user);
        if (dto.spatialEntityId) {
            await this.access.assertEntity(dto.spatialEntityId, user);
        }
        return this.virtualToursService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertTour(id, user);
        return this.virtualToursService.remove(id);
    }
};
exports.VirtualToursController = VirtualToursController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_virtual_tour_dto_1.CreateVirtualTourDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], VirtualToursController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('spatialEntityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VirtualToursController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VirtualToursController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_virtual_tour_dto_1.UpdateVirtualTourDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], VirtualToursController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], VirtualToursController.prototype, "remove", null);
exports.VirtualToursController = VirtualToursController = __decorate([
    (0, common_1.Controller)('virtual-tours'),
    __metadata("design:paramtypes", [virtual_tours_service_1.VirtualToursService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], VirtualToursController);

export { VirtualToursController };
