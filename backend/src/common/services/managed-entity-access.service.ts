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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedEntityAccessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const audio_guide_entity_1 = require("../../audio-guides/entities/audio-guide.entity");
const hotspot_entity_1 = require("../../hotspots/entities/hotspot.entity");
const media_file_entity_1 = require("../../media/entities/media-file.entity");
const panorama_entity_1 = require("../../panoramas/entities/panorama.entity");
const scene_entity_1 = require("../../scenes/entities/scene.entity");
const spatial_entity_entity_1 = require("../../spatial-entities/entities/spatial-entity.entity");
const user_role_enum_1 = require("../../users/enums/user-role.enum");
const virtual_tour_entity_1 = require("../../virtual-tours/entities/virtual-tour.entity");
let ManagedEntityAccessService = class ManagedEntityAccessService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async assertEntity(entityId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const entity = await this.dataSource.getRepository(spatial_entity_entity_1.SpatialEntity).findOne({
            where: { id: entityId },
            select: { id: true, createdBy: true },
        });
        if (!entity)
            throw new common_1.NotFoundException(`SpatialEntity ${entityId} not found`);
        this.assertOwner(entity.createdBy, user);
    }
    async assertTour(tourId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const tour = await this.dataSource.getRepository(virtual_tour_entity_1.VirtualTour).findOne({
            where: { id: tourId },
            relations: { spatialEntity: true },
        });
        if (!tour)
            throw new common_1.NotFoundException(`VirtualTour ${tourId} not found`);
        this.assertOwner(tour.spatialEntity.createdBy, user);
    }
    async assertPanorama(panoramaId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const panorama = await this.dataSource.getRepository(panorama_entity_1.Panorama).findOne({
            where: { id: panoramaId },
            relations: { virtualTour: { spatialEntity: true } },
        });
        if (!panorama)
            throw new common_1.NotFoundException(`Panorama ${panoramaId} not found`);
        this.assertOwner(panorama.virtualTour.spatialEntity.createdBy, user);
    }
    async assertHotspot(hotspotId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const hotspot = await this.dataSource.getRepository(hotspot_entity_1.Hotspot).findOne({
            where: { id: hotspotId },
            relations: { panorama: { virtualTour: { spatialEntity: true } } },
        });
        if (!hotspot)
            throw new common_1.NotFoundException(`Hotspot ${hotspotId} not found`);
        this.assertOwner(hotspot.panorama.virtualTour.spatialEntity.createdBy, user);
    }
    async assertScene(sceneId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const repository = this.dataSource.getRepository(scene_entity_1.Scene);
        let scene = await repository.findOne({
            where: { id: sceneId },
            relations: { entity: true, parent: true },
        });
        if (!scene)
            throw new common_1.NotFoundException(`Scene ${sceneId} not found`);
        while (!scene.entity && scene.parent) {
            scene = await repository.findOne({
                where: { id: scene.parent.id },
                relations: { entity: true, parent: true },
            });
            if (!scene)
                throw new common_1.NotFoundException(`Scene ${sceneId} not found`);
        }
        this.assertOwner(scene.entity?.createdBy ?? null, user);
    }
    async assertMediaOwner(ownerType, ownerId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        if (!ownerType || !ownerId) {
            throw new common_1.ForbiddenException('Manager must attach media to a managed location resource');
        }
        switch (ownerType) {
            case 'spatial_entity':
                return this.assertEntity(ownerId, user);
            case 'virtual_tour':
                return this.assertTour(ownerId, user);
            case 'panorama':
                return this.assertPanorama(ownerId, user);
            case 'hotspot':
                return this.assertHotspot(ownerId, user);
            case 'scene':
                return this.assertScene(ownerId, user);
            default:
                throw new common_1.ForbiddenException(`Manager cannot manage media owner type ${ownerType}`);
        }
    }
    async assertMediaFile(mediaId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const media = await this.dataSource.getRepository(media_file_entity_1.MediaFile).findOne({
            where: { id: mediaId },
            select: { id: true, ownerType: true, ownerId: true },
        });
        if (!media)
            throw new common_1.NotFoundException(`MediaFile ${mediaId} not found`);
        return this.assertMediaOwner(media.ownerType, media.ownerId, user);
    }
    async assertAudioGuide(audioGuideId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        const guide = await this.dataSource.getRepository(audio_guide_entity_1.AudioGuide).findOne({
            where: { id: audioGuideId },
            relations: { spatialEntity: true },
        });
        if (!guide) {
            throw new common_1.NotFoundException(`AudioGuide ${audioGuideId} not found`);
        }
        if (guide.spatialEntity) {
            return this.assertOwner(guide.spatialEntity.createdBy, user);
        }
        return this.assertAudioTarget(guide.targetType, guide.targetId, user);
    }
    async assertAudioTarget(targetType, targetId, user) {
        if (user.role === user_role_enum_1.UserRole.Admin)
            return;
        if (!targetType || !targetId) {
            throw new common_1.ForbiddenException('Manager must attach audio to a managed location resource');
        }
        return this.assertMediaOwner(targetType, targetId, user);
    }
    assertOwner(ownerId, user) {
        if (user.role !== user_role_enum_1.UserRole.LocationManager ||
            !ownerId ||
            ownerId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to manage this location');
        }
    }
};
exports.ManagedEntityAccessService = ManagedEntityAccessService;
exports.ManagedEntityAccessService = ManagedEntityAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ManagedEntityAccessService);

export { ManagedEntityAccessService };
