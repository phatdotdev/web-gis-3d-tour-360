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
exports.LayersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const layers_service_1 = require("./layers.service");
const create_layer_dto_1 = require("./dto/create-layer.dto");
const update_layer_dto_1 = require("./dto/update-layer.dto");
const geojson_limits_1 = require("./constants/geojson-limits");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let LayersController = class LayersController {
    layersService;
    constructor(layersService) {
        this.layersService = layersService;
    }
    create(createLayerDto) {
        return this.layersService.create(createLayerDto);
    }
    uploadGeoJson(file, payload) {
        return this.layersService.createFromGeoJson(file, payload);
    }
    uploadModel(id, file) {
        return this.layersService.attachModel(id, file);
    }
    uploadIcon(id, file) {
        return this.layersService.attachIcon(id, file);
    }
    findAll() {
        return this.layersService.findAll();
    }
    findOne(id) {
        return this.layersService.findOne(id);
    }
    update(id, updateLayerDto) {
        return this.layersService.update(id, updateLayerDto);
    }
    remove(id) {
        return this.layersService.remove(id);
    }
};
exports.LayersController = LayersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_layer_dto_1.CreateLayerDto]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload-geojson'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (_req, file, callback) => {
            const extension = (0, path_1.extname)(file.originalname).toLowerCase();
            const acceptedMimeTypes = [
                'application/json',
                'application/geo+json',
                'application/octet-stream',
            ];
            if (extension === '.geojson' ||
                (extension === '.json' && acceptedMimeTypes.includes(file.mimetype))) {
                callback(null, true);
                return;
            }
            callback(new common_1.BadRequestException('Only .geojson or GeoJSON .json files are allowed'), false);
        },
        limits: { fileSize: geojson_limits_1.GEOJSON_LIMITS.maxFileSizeBytes },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "uploadGeoJson", null);
__decorate([
    (0, common_1.Post)(':id/upload-model'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', 'models');
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "uploadModel", null);
__decorate([
    (0, common_1.Post)(':id/upload-icon'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dir = (0, path_1.join)(process.cwd(), 'uploads', 'icons');
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "uploadIcon", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_layer_dto_1.UpdateLayerDto]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.Admin),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LayersController.prototype, "remove", null);
exports.LayersController = LayersController = __decorate([
    (0, common_1.Controller)('layers'),
    __metadata("design:paramtypes", [layers_service_1.LayersService])
], LayersController);

export { LayersController };
