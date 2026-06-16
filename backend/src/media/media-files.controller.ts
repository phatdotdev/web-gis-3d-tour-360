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
exports.MediaFilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const content_status_enum_1 = require("../common/enums/content-status.enum");
const create_media_file_dto_1 = require("./dto/create-media-file.dto");
const update_media_file_dto_1 = require("./dto/update-media-file.dto");
const media_files_service_1 = require("./media-files.service");
const storage_service_1 = require("../storage/storage.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const managed_entity_access_service_1 = require("../common/services/managed-entity-access.service");
const user_entity_1 = require("../users/entities/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let MediaFilesController = class MediaFilesController {
    mediaFilesService;
    storageService;
    access;
    constructor(mediaFilesService, storageService, access) {
        this.mediaFilesService = mediaFilesService;
        this.storageService = storageService;
        this.access = access;
    }
    async create(dto, user) {
        await this.access.assertMediaOwner(dto.ownerType, dto.ownerId, user);
        return this.mediaFilesService.create(dto);
    }
    async upload(file, user, ownerType, ownerId, requestedMediaType, altText) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        await this.access.assertMediaOwner(ownerType, ownerId, user);
        const mediaType = requestedMediaType ?? this.inferMediaType(file.mimetype);
        const extension = (0, path_1.extname)(file.originalname).toLowerCase();
        if (mediaType === content_status_enum_1.MediaType.Panorama &&
            !file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Panorama must be an image');
        }
        if (mediaType === content_status_enum_1.MediaType.Model3d &&
            extension !== '.glb' &&
            extension !== '.gltf') {
            throw new common_1.BadRequestException('3D model must be a .glb or .gltf file');
        }
        const storedFile = await this.storageService.uploadMediaFile(file, {
            ownerType,
            mediaType,
        });
        return this.mediaFilesService.create({
            ownerType: ownerType || null,
            ownerId: ownerId || null,
            fileName: file.originalname,
            storedFileName: storedFile.storedFileName,
            fileUrl: storedFile.fileUrl,
            storagePath: storedFile.storagePath,
            storageProvider: storedFile.storageProvider,
            mediaType,
            mimeType: file.mimetype,
            extension,
            fileSize: String(file.size),
            altText: altText || null,
        });
    }
    findAll(ownerType, ownerId, mediaType) {
        return this.mediaFilesService.findAll(ownerType, ownerId, mediaType);
    }
    findOne(id) {
        return this.mediaFilesService.findOne(id);
    }
    async update(id, dto, user) {
        await this.access.assertMediaFile(id, user);
        if (dto.ownerType || dto.ownerId) {
            await this.access.assertMediaOwner(dto.ownerType, dto.ownerId, user);
        }
        return this.mediaFilesService.update(id, dto);
    }
    async remove(id, user) {
        await this.access.assertMediaFile(id, user);
        return this.mediaFilesService.remove(id);
    }
    inferMediaType(mimeType) {
        if (mimeType.startsWith('audio/'))
            return content_status_enum_1.MediaType.Audio;
        if (mimeType.startsWith('video/'))
            return content_status_enum_1.MediaType.Video;
        return content_status_enum_1.MediaType.Image;
    }
};
exports.MediaFilesController = MediaFilesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_media_file_dto_1.CreateMediaFileDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MediaFilesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (_req, file, callback) => {
            const allowedMimeTypes = [
                'image/jpeg',
                'image/png',
                'image/webp',
                'audio/mpeg',
                'audio/mp4',
                'audio/ogg',
                'audio/wav',
                'video/mp4',
                'video/webm',
                'video/ogg',
                'model/gltf-binary',
                'model/gltf+json',
                'application/octet-stream',
                'application/json',
            ];
            const extension = (0, path_1.extname)(file.originalname).toLowerCase();
            const isModel = extension === '.glb' || extension === '.gltf';
            if (allowedMimeTypes.includes(file.mimetype) &&
                (!['application/octet-stream', 'application/json'].includes(file.mimetype) ||
                    isModel)) {
                callback(null, true);
                return;
            }
            callback(new common_1.BadRequestException('Unsupported media file type'), false);
        },
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('ownerType')),
    __param(3, (0, common_1.Body)('ownerId')),
    __param(4, (0, common_1.Body)('mediaType')),
    __param(5, (0, common_1.Body)('altText')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_entity_1.User, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MediaFilesController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('ownerType')),
    __param(1, (0, common_1.Query)('ownerId')),
    __param(2, (0, common_1.Query)('mediaType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MediaFilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaFilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_media_file_dto_1.UpdateMediaFileDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MediaFilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin, user_role_enum_1.UserRole.LocationManager),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], MediaFilesController.prototype, "remove", null);
exports.MediaFilesController = MediaFilesController = __decorate([
    (0, common_1.Controller)('media-files'),
    __metadata("design:paramtypes", [media_files_service_1.MediaFilesService,
        storage_service_1.StorageService,
        managed_entity_access_service_1.ManagedEntityAccessService])
], MediaFilesController);

export { MediaFilesController };
