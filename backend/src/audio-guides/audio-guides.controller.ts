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
exports.AudioGuidesController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
const audio_guides_service_1 = require("./audio-guides.service");
const create_audio_guide_dto_1 = require("./dto/create-audio-guide.dto");
const update_audio_guide_dto_1 = require("./dto/update-audio-guide.dto");
let AudioGuidesController = class AudioGuidesController {
    audioGuidesService;
    access;
    constructor(audioGuidesService, access) {
        this.audioGuidesService = audioGuidesService;
        this.access = access;
    }
    async create(dto, user) {
        if (dto.spatialEntityId) {
            await this.access.assertEntity(dto.spatialEntityId, user);
        }
        else {
            await this.access.assertAudioTarget(dto.targetType, dto.targetId, user);
        }
        await this.access.assertMediaFile(dto.mediaId, user);
        return this.audioGuidesService.create(dto);
    }
    findAll(spatialEntityId, targetType, targetId) {
        return this.audioGuidesService.findAll(spatialEntityId, targetType, targetId);
    }
    findOne(id) {
        return this.audioGuidesService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertAudioGuide(id, user);
        if (dto.spatialEntityId) {
            await this.access.assertEntity(dto.spatialEntityId, user);
        }
        if (dto.targetType || dto.targetId) {
            await this.access.assertAudioTarget(dto.targetType, dto.targetId, user);
        }
        if (dto.mediaId) {
            await this.access.assertMediaFile(dto.mediaId, user);
        }
        return this.audioGuidesService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertAudioGuide(id, user);
        return this.audioGuidesService.remove(id);
    }
};
exports.AudioGuidesController = AudioGuidesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_audio_guide_dto_1.CreateAudioGuideDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AudioGuidesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('spatialEntityId')),
    __param(1, (0, common_1.Query)('targetType')),
    __param(2, (0, common_1.Query)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AudioGuidesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AudioGuidesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_audio_guide_dto_1.UpdateAudioGuideDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AudioGuidesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AudioGuidesController.prototype, "remove", null);
exports.AudioGuidesController = AudioGuidesController = __decorate([
    (0, common_1.Controller)('audio-guides'),
    __metadata("design:paramtypes", [audio_guides_service_1.AudioGuidesService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], AudioGuidesController);

export { AudioGuidesController };
