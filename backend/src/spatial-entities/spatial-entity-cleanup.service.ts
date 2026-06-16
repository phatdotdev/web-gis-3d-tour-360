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
exports.SpatialEntityCleanupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const audio_guide_entity_1 = require("../audio-guides/entities/audio-guide.entity");
const hotspot_entity_1 = require("../hotspots/entities/hotspot.entity");
const media_file_entity_1 = require("../media/entities/media-file.entity");
const panorama_entity_1 = require("../panoramas/entities/panorama.entity");
const scene_entity_1 = require("../scenes/entities/scene.entity");
const virtual_tour_entity_1 = require("../virtual-tours/entities/virtual-tour.entity");
const spatial_entity_entity_1 = require("./entities/spatial-entity.entity");
let SpatialEntityCleanupService = class SpatialEntityCleanupService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async removeByIds(entityIds, manager) {
        const uniqueIds = [...new Set(entityIds.filter(Boolean))];
        if (uniqueIds.length === 0)
            return 0;
        if (manager) {
            return this.removeWithinTransaction(uniqueIds, manager);
        }
        return this.dataSource.transaction((transactionManager) => this.removeWithinTransaction(uniqueIds, transactionManager));
    }
    async removeByLayerId(layerId, manager) {
        const entityRepository = (manager ?? this.dataSource.manager).getRepository(spatial_entity_entity_1.SpatialEntity);
        const entities = await entityRepository.find({
            select: { id: true },
            where: { layer: { id: layerId } },
        });
        return this.removeByIds(entities.map((entity) => entity.id), manager);
    }
    async removeWithinTransaction(entityIds, manager) {
        const tourRepository = manager.getRepository(virtual_tour_entity_1.VirtualTour);
        const panoramaRepository = manager.getRepository(panorama_entity_1.Panorama);
        const hotspotRepository = manager.getRepository(hotspot_entity_1.Hotspot);
        const sceneRepository = manager.getRepository(scene_entity_1.Scene);
        const tours = await tourRepository.find({
            select: { id: true },
            where: { spatialEntity: { id: (0, typeorm_1.In)(entityIds) } },
        });
        const tourIds = tours.map((tour) => tour.id);
        const panoramas = tourIds.length > 0
            ? await panoramaRepository.find({
                select: { id: true },
                where: { virtualTour: { id: (0, typeorm_1.In)(tourIds) } },
            })
            : [];
        const panoramaIds = panoramas.map((panorama) => panorama.id);
        const hotspots = panoramaIds.length > 0
            ? await hotspotRepository.find({
                select: { id: true },
                where: { panorama: { id: (0, typeorm_1.In)(panoramaIds) } },
            })
            : [];
        const hotspotIds = hotspots.map((hotspot) => hotspot.id);
        const scenes = await sceneRepository.find({
            select: { id: true },
            where: { entity: { id: (0, typeorm_1.In)(entityIds) } },
        });
        await manager
            .createQueryBuilder()
            .update(spatial_entity_entity_1.SpatialEntity)
            .set({ scene: null })
            .where({ id: (0, typeorm_1.In)(entityIds) })
            .execute();
        if (scenes.length > 0) {
            await sceneRepository.delete({ id: (0, typeorm_1.In)(scenes.map((scene) => scene.id)) });
        }
        await this.deleteTargetedAudioGuides(manager, entityIds, tourIds, panoramaIds, hotspotIds);
        if (tourIds.length > 0) {
            await tourRepository.delete({ id: (0, typeorm_1.In)(tourIds) });
        }
        await manager.getRepository(spatial_entity_entity_1.SpatialEntity).delete({ id: (0, typeorm_1.In)(entityIds) });
        await this.deleteOwnedMedia(manager, entityIds, tourIds, panoramaIds, hotspotIds);
        return entityIds.length;
    }
    async deleteTargetedAudioGuides(manager, entityIds, tourIds, panoramaIds, hotspotIds) {
        const repository = manager.getRepository(audio_guide_entity_1.AudioGuide);
        await repository.delete({ spatialEntity: { id: (0, typeorm_1.In)(entityIds) } });
        const targets = [
            { type: 'spatial_entity', ids: entityIds },
            { type: 'virtual_tour', ids: tourIds },
            { type: 'panorama', ids: panoramaIds },
            { type: 'hotspot', ids: hotspotIds },
        ];
        for (const target of targets) {
            if (target.ids.length > 0) {
                await repository
                    .createQueryBuilder()
                    .delete()
                    .where('"targetType" = :type', { type: target.type })
                    .andWhere('"targetId" IN (:...ids)', { ids: target.ids })
                    .execute();
            }
        }
    }
    async deleteOwnedMedia(manager, entityIds, tourIds, panoramaIds, hotspotIds) {
        const repository = manager.getRepository(media_file_entity_1.MediaFile);
        const owners = [
            { type: 'spatial_entity', ids: entityIds },
            { type: 'virtual_tour', ids: tourIds },
            { type: 'panorama', ids: panoramaIds },
            { type: 'hotspot', ids: hotspotIds },
        ];
        for (const owner of owners) {
            if (owner.ids.length > 0) {
                await repository
                    .createQueryBuilder()
                    .delete()
                    .where('"ownerType" = :type', { type: owner.type })
                    .andWhere('"ownerId" IN (:...ids)', { ids: owner.ids })
                    .execute();
            }
        }
    }
};
exports.SpatialEntityCleanupService = SpatialEntityCleanupService;
exports.SpatialEntityCleanupService = SpatialEntityCleanupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], SpatialEntityCleanupService);

export { SpatialEntityCleanupService };
